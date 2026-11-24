const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  phone: String,
  email: String,
  seatNumber: String,
  mealPreference: { type: String, enum: ['Veg', 'Non-Veg', 'Jain', 'None'], default: 'None' },
  specialRequests: String
}, { timestamps: true });

module.exports = mongoose.model('Passenger', passengerSchema);