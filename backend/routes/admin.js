const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { getSalesAnalytics, getPopularDestinations, getMonthlyRevenue, getCustomerAnalytics } = require('../utils/analytics');

router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const totalPackages = await Package.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // Calculate revenue from confirmed bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = (revenueAgg[0] && revenueAgg[0].total) || 0;
    
    // Count loyalty members (users with loyalty points > 0)
    const loyaltyMembers = await User.countDocuments({ loyaltyPoints: { $gt: 0 } });
    
    // Count e-tickets issued (confirmed bookings with ticket numbers)
    const eTicketsIssued = await Booking.countDocuments({ 
      status: 'confirmed',
      ticketNumber: { $exists: true, $ne: null }
    });
    
    // Get recent activities
    const recentBookings = await Booking.find()
      .populate('user package')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const recentActivity = recentBookings.map(booking => ({
      type: 'booking',
      message: `${booking.user?.name || 'Customer'} booked ${booking.package?.title || 'Package'}`,
      amount: booking.totalAmount,
      status: booking.status,
      time: booking.createdAt
    }));
    
    res.json({ 
      totalPackages, 
      totalBookings, 
      totalUsers, 
      totalRevenue,
      loyaltyMembers,
      eTicketsIssued,
      recentActivity
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').limit(200);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Analytics endpoints
router.get('/analytics/sales', auth, adminOnly, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    const analytics = await getSalesAnalytics(start, end);
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/analytics/popular-destinations', auth, adminOnly, async (req, res) => {
  try {
    const destinations = await getPopularDestinations();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/analytics/monthly-revenue/:year', auth, adminOnly, async (req, res) => {
  try {
    const year = parseInt(req.params.year) || new Date().getFullYear();
    const monthlyData = await getMonthlyRevenue(year);
    res.json(monthlyData);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/analytics/customers', auth, adminOnly, async (req, res) => {
  try {
    const customerData = await getCustomerAnalytics();
    res.json(customerData);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
