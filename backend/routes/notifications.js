const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const Notification = require('../models/Notification');

// get notifications for current user
router.get('/', auth, async (req, res) => {
  const list = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(list);
});

// admin: get all notifications
router.get('/all', auth, adminOnly, async (req, res) => {
  const list = await Notification.find().sort({ createdAt: -1 });
  res.json(list);
});

// mark as read
router.put('/:id/read', auth, async (req, res) => {
  const notif = await Notification.findById(req.params.id);
  if (!notif) return res.status(404).json({ msg: 'Not found' });
  if (notif.user && notif.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized' });
  }
  notif.read = true;
  await notif.save();
  res.json(notif);
});

// mark all as read
router.put('/mark-all-read', auth, async (req, res) => {
  await Notification.updateMany({ user: req.user.id, read: false }, { $set: { read: true } });
  res.json({ msg: 'All marked as read' });
});

module.exports = router;
