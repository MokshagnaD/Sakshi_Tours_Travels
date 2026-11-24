const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { auth, adminOnly } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

// create inquiry (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const inquiry = new Inquiry({ name, email, phone, subject, message });
    await inquiry.save();

    // send notification email to site admin
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Inquiry: ${subject || 'Contact Form'}`,
        html: `<p><strong>${name}</strong> (${email}) submitted an inquiry.</p><p>Message: ${message}</p><p>Phone: ${phone || 'N/A'}</p>`,
      });
    } catch (err) {
      console.warn('Failed to send inquiry email', err);
    }

    res.json(inquiry);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// user: get own inquiries (must be before admin routes)
router.get('/my-inquiries', auth, async (req, res) => {
  try {
    console.log('User requesting inquiries:', req.user.email);
    const userInquiries = await Inquiry.find({ email: req.user.email }).sort({ createdAt: -1 });
    console.log('Found inquiries:', userInquiries.length);
    res.json(userInquiries);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// admin: list all inquiries
router.get('/', auth, adminOnly, async (req, res) => {
  const list = await Inquiry.find().sort({ createdAt: -1 });
  res.json(list);
});

router.get('/:id', auth, adminOnly, async (req, res) => {
  const item = await Inquiry.findById(req.params.id);
  if (!item) return res.status(404).json({ msg: 'Not found' });
  res.json(item);
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  const item = await Inquiry.findById(req.params.id);
  if (!item) return res.status(404).json({ msg: 'Not found' });
  Object.assign(item, req.body);
  await item.save();
  res.json(item);
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  await Inquiry.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Deleted' });
});

module.exports = router;
