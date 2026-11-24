const mongoose = require('mongoose');

// Function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  description: { type: String, required: true },
  destination: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String },
  durationDays: { type: Number, required: true },
  images: [{ type: String }],
  categories: [{ type: String }],
  highlights: [{ type: String }],
  inclusions: [{ type: String }],
  itinerary: [{
    day: Number,
    title: String,
    activities: String,
    meals: String,
    accommodation: String
  }],
  availableSeats: { type: Number, default: 20 },
  ratings: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  availableDates: [Date],
  isActive: { type: Boolean, default: true },
  
  // Advanced Features
  originalPrice: { type: Number },
  packageType: { type: String, enum: ['DOMESTIC', 'INTERNATIONAL', 'HONEYMOON', 'ADVENTURE'], default: 'DOMESTIC' },
  loyaltyPoints: { type: Number, default: 0 },
  
  // Dynamic Pricing
  seasonalPricing: {
    peak: { multiplier: { type: Number, default: 1.3 }, months: [String] },
    offPeak: { multiplier: { type: Number, default: 0.9 }, months: [String] }
  },
  
  // Discounts
  earlyBirdDiscount: { percentage: { type: Number, default: 10 }, daysBeforeTravel: { type: Number, default: 30 } },
  groupDiscount: { minSize: { type: Number, default: 5 }, percentage: { type: Number, default: 15 } },
  
  // Add-ons
  addOns: [{
    name: String,
    description: String,
    price: Number,
    type: { type: String, enum: ['Insurance', 'Meal', 'Transport', 'Activity'] }
  }]
}, { timestamps: true });

// Auto-generate slug before saving
packageSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = generateSlug(this.title);
  }
  next();
});

module.exports = mongoose.model('Package', packageSchema);
