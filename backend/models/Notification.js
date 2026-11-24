const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  message: String,
  type: { type: String, enum: ['booking','payment','review','inquiry','system'], default: 'system' },
  read: { type: Boolean, default: false },
  meta: Object,
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
