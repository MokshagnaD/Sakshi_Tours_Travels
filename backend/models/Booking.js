const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  travelDate: Date,
  totalAmount: { type: Number, default: 0 },
  travelers: { type: Number, default: 1 },
  status: { type: String, enum: ['pending','confirmed','cancelled','completed'], default: 'pending' },
  paymentInfo: Object,
  
  // Advanced Features
  baseAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  addOnAmount: { type: Number, default: 0 },
  loyaltyPointsUsed: { type: Number, default: 0 },
  loyaltyPointsEarned: { type: Number, default: 0 },
  
  // E-ticket
  ticketNumber: { type: String, unique: true, sparse: true },
  qrCode: String,
  
  // Selected Add-ons
  selectedAddOns: [{
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 }
  }],
  
  // Applied Discounts
  appliedDiscounts: [{
    type: String,
    percentage: Number,
    amount: Number,
    description: String
  }],
  travelerDetails: {
    fullName: String,
    dateOfBirth: Date,
    gender: String,
    email: String,
    mobile: String,
    address: String,
    aadharNumber: String,
    nationality: String,
    roomType: String,
    numberOfRooms: Number,
    bedPreference: String,
    specialRequests: String,
    emergencyContact: String,
    emergencyMobile: String,
    travelers: [{
      name: String,
      age: Number,
      gender: String,
      seatNumber: String,
      mealPreference: { type: String, enum: ['Veg', 'Non-Veg', 'Jain', 'None'], default: 'None' },
      specialRequests: String
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
