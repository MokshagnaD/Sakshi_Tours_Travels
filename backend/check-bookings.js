require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const User = require('./models/User');
const Package = require('./models/Package');

const checkBookings = async () => {
  try {
    console.log('🔍 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check total bookings
    const totalBookings = await Booking.countDocuments();
    console.log(`📊 Total bookings in database: ${totalBookings}`);

    if (totalBookings > 0) {
      // Get all bookings with user info
      const bookings = await Booking.find().populate('user package').limit(10);
      
      console.log('\n📋 Recent bookings:');
      bookings.forEach((booking, index) => {
        console.log(`${index + 1}. ID: ${booking._id}`);
        console.log(`   User: ${booking.user?.name || 'Unknown'} (${booking.user?.email || 'No email'})`);
        console.log(`   Package: ${booking.package?.title || booking.package?.name || 'Unknown package'}`);
        console.log(`   Amount: ₹${booking.totalAmount || 0}`);
        console.log(`   Status: ${booking.status}`);
        console.log(`   Created: ${booking.createdAt}`);
        console.log('');
      });

      // Check users
      const totalUsers = await User.countDocuments();
      console.log(`👥 Total users: ${totalUsers}`);
      
      const users = await User.find().limit(5);
      console.log('\n👤 Sample users:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    } else {
      console.log('❌ No bookings found in database');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
};

checkBookings();