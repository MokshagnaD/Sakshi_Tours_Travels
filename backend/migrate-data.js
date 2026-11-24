require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const User = require('./models/User');
const Package = require('./models/Package');
const Booking = require('./models/Booking');
const Inquiry = require('./models/Inquiry');
const Review = require('./models/Review');

// Database URIs
const OLD_URI = process.env.OLD_MONGO_URI || 'mongodb://localhost:27017/sakshitours_old';
const NEW_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sakshi';

async function migrateData() {
  try {
    console.log('🔄 Starting data migration...');
    
    // Connect to old database
    console.log('📡 Connecting to old database...');
    const oldConnection = await mongoose.createConnection(OLD_URI);
    
    // Get models from old connection
    const OldUser = oldConnection.model('User', User.schema);
    const OldPackage = oldConnection.model('Package', Package.schema);
    const OldBooking = oldConnection.model('Booking', Booking.schema);
    const OldInquiry = oldConnection.model('Inquiry', Inquiry.schema);
    const OldReview = oldConnection.model('Review', Review.schema);
    
    // Fetch all data from old database
    console.log('📥 Fetching data from old database...');
    const users = await OldUser.find({});
    const packages = await OldPackage.find({});
    const bookings = await OldBooking.find({});
    const inquiries = await OldInquiry.find({});
    const reviews = await OldReview.find({});
    
    console.log(`📊 Found: ${users.length} users, ${packages.length} packages, ${bookings.length} bookings, ${inquiries.length} inquiries, ${reviews.length} reviews`);
    
    // Close old connection
    await oldConnection.close();
    
    // Connect to new database
    console.log('📡 Connecting to new database...');
    const newConnection = await mongoose.createConnection(NEW_URI);
    
    // Get models from new connection
    const NewUser = newConnection.model('User', User.schema);
    const NewPackage = newConnection.model('Package', Package.schema);
    const NewBooking = newConnection.model('Booking', Booking.schema);
    const NewInquiry = newConnection.model('Inquiry', Inquiry.schema);
    const NewReview = newConnection.model('Review', Review.schema);
    
    // Clear existing data in new database
    console.log('🗑️ Clearing existing data in new database...');
    await NewUser.deleteMany({});
    await NewPackage.deleteMany({});
    await NewBooking.deleteMany({});
    await NewInquiry.deleteMany({});
    await NewReview.deleteMany({});
    
    // Insert data into new database
    console.log('📤 Inserting data into new database...');
    
    if (users.length > 0) {
      await NewUser.insertMany(users);
      console.log(`✅ Migrated ${users.length} users`);
    }
    
    if (packages.length > 0) {
      await NewPackage.insertMany(packages);
      console.log(`✅ Migrated ${packages.length} packages`);
    }
    
    if (bookings.length > 0) {
      await NewBooking.insertMany(bookings);
      console.log(`✅ Migrated ${bookings.length} bookings`);
    }
    
    if (inquiries.length > 0) {
      await NewInquiry.insertMany(inquiries);
      console.log(`✅ Migrated ${inquiries.length} inquiries`);
    }
    
    if (reviews.length > 0) {
      await NewReview.insertMany(reviews);
      console.log(`✅ Migrated ${reviews.length} reviews`);
    }
    
    // Close new connection
    await newConnection.close();
    
    console.log('🎉 Data migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run migration
migrateData();