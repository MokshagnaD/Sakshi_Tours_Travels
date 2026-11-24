const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/email');

let stripe;
if (process.env.STRIPE_SECRET) {
  try { stripe = require('stripe')(process.env.STRIPE_SECRET); } catch (e) { console.warn('Stripe not installed'); }
}

// create payment intent
router.post('/create-intent', auth, async (req, res) => {
  try {
    const { bookingId, amount, currency = 'inr' } = req.body;
    const booking = await Booking.findById(bookingId).populate('package');
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    if (!stripe) return res.status(500).json({ msg: 'Stripe not configured' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((amount || booking.totalAmount) * 100),
      currency,
      metadata: { bookingId: booking._id.toString() },
    });

    res.json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// confirm payment (simple endpoint to mark booking as paid)
router.post('/confirm', auth, async (req, res) => {
  try {
    const { bookingId, paymentIntentId, status='succeeded', transactionId } = req.body;
    const booking = await Booking.findById(bookingId).populate('user package');
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    booking.paymentInfo = booking.paymentInfo || {};
    booking.paymentInfo.status = status;
    booking.paymentInfo.method = req.body.method || 'card';
    booking.paymentInfo.transactionId = paymentIntentId || transactionId;
    booking.paymentInfo.paidAt = new Date();
    booking.status = status === 'succeeded' ? 'confirmed' : booking.status;
    await booking.save();

    // Mark payment as succeeded but keep booking pending for admin confirmation
    booking.paymentInfo.status = 'succeeded';
    booking.status = 'pending'; // Keep as pending until admin confirms
    await booking.save();

    // create notification on success
    const notif = new Notification({
      user: booking.user._id,
      title: 'Payment Successful - Awaiting Confirmation',
      message: `Payment of ₹${booking.totalAmount} received for ${booking.package?.title || 'your booking'}. Your booking is awaiting admin confirmation.`,
      type: 'payment',
      meta: { bookingId: booking._id }
    });
    await notif.save();

    res.json({ success: true, booking, notif });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
