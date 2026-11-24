const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@sakshi.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email: admin@sakshi.com');
      console.log('Use existing password or reset if needed');
      process.exit(0);
    }

    // Create admin user
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('admin123', salt);
    
    const admin = new User({
      name: 'Admin',
      email: 'admin@sakshi.com',
      passwordHash,
      role: 'admin',
      phone: '9999999999'
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@sakshi.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();