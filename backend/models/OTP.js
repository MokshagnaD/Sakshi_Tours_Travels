const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: String,
  otp: { type: String, required: true },
  type: { type: String, enum: ['registration', 'password_reset'], default: 'registration' },
  verified: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true, default: () => new Date(Date.now() + 10 * 60 * 1000) }, // 10 minutes
  userData: {
    name: String,
    email: String,
    phone: String
  }
}, { timestamps: true });

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', otpSchema);