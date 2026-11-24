require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const packageRoutes = require('./routes/packages');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const inquiryRoutes = require('./routes/inquiries');
const notificationRoutes = require('./routes/notifications');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(2000, () => {
    res.status(408).json({ msg: 'Request timeout' });
  });
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// basic health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// database connection test
app.get('/api/db-test', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    res.json({ 
      database: states[dbState], 
      status: dbState === 1 ? 'ok' : 'error',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ database: 'error', message: error.message });
  }
});

// email test endpoint
app.get('/api/email-test', async (req, res) => {
  const { sendEmail } = require('./utils/email');
  try {
    await sendEmail({
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<h1>Test Email</h1><p>If you receive this, email is working!</p>'
    });
    res.json({ status: 'ok', message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Show all OTPs in database
app.get('/api/otps', async (req, res) => {
  const OTP = require('./models/OTP');
  try {
    const otps = await OTP.find({}).sort({ createdAt: -1 });
    
    const otpList = otps.map(otp => ({
      id: otp._id,
      email: otp.email,
      otp: otp.otp,
      verified: otp.verified,
      expired: otp.expiresAt < new Date(),
      createdAt: otp.createdAt,
      expiresAt: otp.expiresAt,
      userData: otp.userData
    }));
    
    res.json({ 
      total: otps.length,
      otps: otpList
    });
  } catch (error) {
    console.error('Error fetching OTPs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check admin status
app.get('/api/check-admin', async (req, res) => {
  const User = require('./models/User');
  try {
    const admin = await User.findOne({ email: 'admin@sakshitours.com' });
    res.json({ 
      exists: !!admin,
      email: admin ? admin.email : null,
      role: admin ? admin.role : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create admin user (one-time setup)
app.get('/api/create-admin', async (req, res) => {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  
  try {
    // Delete any existing admin first
    await User.deleteMany({ email: 'admin@sakshitours.com' });
    console.log('Deleted existing admin users');
    
    // Create admin user
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('admin123', salt);
    console.log('Password hash created:', passwordHash);
    
    const admin = new User({
      name: 'Admin',
      email: 'admin@sakshitours.com',
      passwordHash,
      role: 'admin',
      phone: '9999999999',
      isActive: true
    });
    
    const savedAdmin = await admin.save();
    console.log('Admin saved with ID:', savedAdmin._id);
    
    // Verify the admin was created
    const verifyAdmin = await User.findOne({ email: 'admin@sakshitours.com' });
    console.log('Verification - Admin exists:', !!verifyAdmin);
    
    res.json({ 
      msg: 'Admin created successfully',
      email: 'admin@sakshitours.com',
      password: 'admin123',
      id: savedAdmin._id,
      verified: !!verifyAdmin
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// OTP database test
app.get('/api/otp-test', async (req, res) => {
  const OTP = require('./models/OTP');
  try {
    // Create test OTP
    const testOTP = new OTP({
      email: 'test@example.com',
      otp: '123456',
      type: 'registration',
      userData: { name: 'Test', email: 'test@example.com', phone: '1234567890' }
    });
    
    const saved = await testOTP.save();
    console.log('Test OTP saved:', saved._id);
    
    // Find and delete it
    const found = await OTP.findById(saved._id);
    await OTP.deleteOne({ _id: saved._id });
    
    res.json({ 
      status: 'ok', 
      message: 'OTP database operations working',
      testId: saved._id,
      found: !!found
    });
  } catch (error) {
    console.error('OTP test error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

const PORT = process.env.PORT || 5001;

console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI:', process.env.MONGO_URI ? 'URI is set' : 'URI is missing');

const startServer = () => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    startServer();
  })
  .catch(err => {
    console.warn('⚠️ MongoDB connection error:', err.message);
    console.log('Starting server in offline/fallback mode...');
    startServer();
  });
} else {
  console.warn('⚠️ MONGO_URI not provided. Server will run in standalone mode.');
  startServer();
}

// Handle connection errors after initial connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});
