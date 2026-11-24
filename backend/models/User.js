const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer','admin','manager','support'], default: 'customer' },
  permissions: [{ type: String }],
  phone: String,
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  loyaltyPoints: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
  profile: {
    avatar: String,
    bio: String,
    preferences: {
      mealPreference: String,
      seatPreference: String,
      travelClass: String
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
