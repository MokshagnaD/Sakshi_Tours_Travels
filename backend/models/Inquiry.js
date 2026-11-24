const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: String,
  message: { type: String, required: true },
  status: { type: String, enum: ['new','open','closed'], default: 'new' },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
