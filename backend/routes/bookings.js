const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { calculateDynamicPrice, generateTicketNumber, calculateLoyaltyPoints } = require('../utils/pricing');
const { sendEmail } = require('../utils/email');
const { sendSimpleEReceipt } = require('../utils/simpleEReceipt');

// create booking with advanced features
router.post('/', auth, async (req, res) => {
  try {
    const { packageId, travelDate, travelers, travelerDetails, selectedAddOns = [], loyaltyPointsToUse = 0 } = req.body;
    
    const package = await Package.findById(packageId);
    if (!package) {
      return res.status(404).json({ msg: 'Package not found' });
    }

    const user = await User.findById(req.user.id);
    
    // Calculate dynamic pricing
    const pricingResult = calculateDynamicPrice(package.price, travelDate, travelers, package);
    
    // Calculate traveler costs with age-based pricing
    let travelerCosts = 0;
    if (travelerDetails.travelers) {
      travelerDetails.travelers.forEach(traveler => {
        const age = parseInt(traveler.age);
        if (age <= 5) {
          travelerCosts += 0; // Free for children 5 and below
        } else if (age >= 6 && age <= 13) {
          travelerCosts += pricingResult.finalPrice * 0.5; // Half price for children 6-13
        } else if (age >= 60) {
          travelerCosts += pricingResult.finalPrice * 0.95; // 5% discount for senior citizens
        } else {
          travelerCosts += pricingResult.finalPrice; // Full price for adults 14-59
        }
      });
    } else {
      travelerCosts = pricingResult.finalPrice * travelers;
    }
    
    // Calculate accommodation costs
    const getRoomRate = (roomType) => {
      switch(roomType) {
        case 'single': return 1500;
        case 'double': return 2500;
        case 'triple': return 3200;
        case 'family': return 4000;
        default: return 2500;
      }
    };
    
    const roomCost = getRoomRate(travelerDetails.roomType || 'double') * (travelerDetails.numberOfRooms || 1);
    
    // Calculate add-ons cost
    const addOnAmount = selectedAddOns.reduce((sum, addon) => sum + (addon.price * addon.quantity), 0);
    
    // Calculate travel insurance if selected
    const insuranceCost = travelerDetails.travelInsurance ? (travelerCosts + roomCost) * 0.05 : 0;
    
    // Calculate subtotal before loyalty discount
    const subtotal = travelerCosts + roomCost + addOnAmount + insuranceCost;
    
    // Apply loyalty points discount (max 10% of subtotal)
    const loyaltyDiscount = Math.min(loyaltyPointsToUse, user.loyaltyPoints, subtotal * 0.1);
    
    const totalAmount = subtotal - loyaltyDiscount;
    
    // Generate ticket number
    const ticketNumber = generateTicketNumber();
    
    // Calculate loyalty points earned
    const pointsEarned = calculateLoyaltyPoints(totalAmount);

    const booking = new Booking({
      user: req.user.id,
      package: packageId,
      travelDate,
      travelers,
      baseAmount: package.price * travelers,
      discountAmount: pricingResult.totalDiscount,
      addOnAmount: addOnAmount + roomCost + insuranceCost,
      totalAmount,
      travelerDetails,
      selectedAddOns,
      appliedDiscounts: pricingResult.appliedDiscounts,
      ticketNumber,
      loyaltyPointsUsed: loyaltyPointsToUse,
      loyaltyPointsEarned: pointsEarned,
      status: 'pending'
    });

    await booking.save();
    
    // Update user loyalty points
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 
        loyaltyPoints: pointsEarned - loyaltyPointsToUse,
        totalBookings: 1
      }
    });
    
    const populatedBooking = await Booking.findById(booking._id).populate('user package');
    
    res.json({
      booking: populatedBooking,
      pricingBreakdown: {
        basePrice: package.price,
        finalPricePerPerson: pricingResult.finalPrice,
        totalDiscount: pricingResult.totalDiscount,
        addOnAmount,
        loyaltyDiscount,
        totalAmount,
        pointsEarned,
        ticketNumber
      }
    });
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ msg: 'Failed to create booking' });
  }
});

// get bookings for user (or admin can fetch all by query param)
router.get('/', auth, async (req, res) => {
  try {
    console.log('📋 Fetching bookings for user:', req.user.id, 'Role:', req.user.role);
    
    if (req.user.role === 'admin' && req.query.all === 'true') {
      const list = await Booking.find().populate('user package');
      console.log('📋 Admin fetched', list.length, 'bookings');
      return res.json(list);
    }
    
    const list = await Booking.find({ user: req.user.id }).populate('package');
    console.log('📋 User fetched', list.length, 'bookings');
    res.json(list);
  } catch (err) {
    console.error('❌ Error fetching bookings:', err);
    res.status(500).json({ msg: 'Failed to fetch bookings', error: err.message });
  }
});

// get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user package');
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// calculate dynamic price
router.post('/calculate-price', auth, async (req, res) => {
  try {
    const { packageId, travelDate, passengers } = req.body;
    
    const package = await Package.findById(packageId);
    if (!package) {
      return res.status(404).json({ msg: 'Package not found' });
    }
    
    const pricingResult = calculateDynamicPrice(package.price, travelDate, passengers, package);
    
    res.json({
      basePrice: package.price,
      adjustedPrice: pricingResult.finalPrice,
      season: new Date(travelDate).getMonth() + 1 >= 10 || new Date(travelDate).getMonth() + 1 <= 1 ? 'Peak' : 'Regular',
      discount: Math.round((package.price - pricingResult.finalPrice) / package.price * 100),
      appliedDiscounts: pricingResult.appliedDiscounts
    });
  } catch (err) {
    console.error('Price calculation error:', err);
    res.status(500).json({ msg: 'Failed to calculate price' });
  }
});

// update booking (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    const oldBooking = await Booking.findById(req.params.id).populate('user package');
    if (!oldBooking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('user package');
    
    // Send e-receipt email when booking is confirmed (only once)
    if (oldBooking.status !== 'confirmed' && booking.status === 'confirmed' && !booking.eReceiptSent) {
      console.log('📧 Booking confirmed - sending e-receipt automatically');
      try {
        await sendSimpleEReceipt(booking);
        // Mark e-receipt as sent to prevent duplicates
        await Booking.findByIdAndUpdate(req.params.id, { eReceiptSent: true });
        console.log('✅ E-receipt sent automatically for confirmed booking');
      } catch (emailErr) {
        console.error('❌ Failed to send automatic e-receipt:', emailErr.message);
      }
    }
    
    res.json({ msg: 'Booking updated successfully', booking });
  } catch (err) {
    console.error('Booking update error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// test e-receipt email (admin only)
router.post('/:id/send-receipt', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    const booking = await Booking.findById(req.params.id).populate('user package');
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    console.log('📧 Attempting to send e-receipt for booking:', booking._id);
    console.log('📧 Customer email:', booking.user.email);
    
    const result = await sendSimpleEReceipt(booking);
    console.log('📧 E-receipt send result:', result);
    
    res.json({ 
      msg: 'E-receipt sent successfully',
      recipient: booking.user.email,
      bookingId: booking._id,
      messageId: result.messageId
    });
  } catch (err) {
    console.error('❌ E-receipt sending error:', err);
    res.status(500).json({ 
      msg: 'Failed to send e-receipt',
      error: err.message,
      details: 'Please check email configuration or try again later'
    });
  }
});

// test e-receipt with sample data (admin only)
router.post('/test-receipt', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    // Create sample booking data for testing
    const sampleBooking = {
      _id: 'TEST-' + Date.now(),
      user: {
        name: 'Test Customer',
        email: 'test@example.com'
      },
      package: {
        name: 'Sample Goa Package',
        title: 'Amazing Goa Beach Tour',
        destination: 'Goa, India'
      },
      travelers: 2,
      totalAmount: 25000,
      travelDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      ticketNumber: 'TKT-TEST-' + Date.now().toString().slice(-6),
      createdAt: new Date()
    };
    
    console.log('📧 Sending test e-receipt');
    
    const result = await sendSimpleEReceipt(sampleBooking);
    console.log('📧 Test e-receipt result:', result);
    
    res.json({ 
      msg: 'Test e-receipt sent successfully',
      recipient: sampleBooking.user.email,
      messageId: result.messageId,
      sampleData: true
    });
  } catch (err) {
    console.error('❌ Test e-receipt error:', err);
    res.status(500).json({ 
      msg: 'Failed to send test e-receipt',
      error: err.message
    });
  }
});

module.exports = router;
