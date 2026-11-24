const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Token = require('../models/Token');
const OTP = require('../models/OTP');
const { sendEmail } = require('../utils/email');

const authController = {
  // Step 1: Send OTP for registration
  async sendRegistrationOTP(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const { name, email, phone } = req.body;
      
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Check if OTP was sent recently (prevent spam)
      const recentOTP = await OTP.findOne({ 
        email, 
        type: 'registration',
        createdAt: { $gt: new Date(Date.now() - 60000) } // 1 minute ago
      });
      
      if (recentOTP) {
        return res.json({ 
          msg: 'OTP already sent recently',
          email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
        });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('Generated OTP for', email, ':', otp);
      
      // Delete any existing OTP for this email
      console.log('Deleting existing OTPs for:', email);
      const deleteResult = await OTP.deleteMany({ email });
      console.log('Deleted OTPs count:', deleteResult.deletedCount);
      
      // Save OTP with user data
      console.log('Saving new OTP to database...');
      const otpRecord = new OTP({
        email,
        phone,
        otp,
        type: 'registration',
        userData: { name, email, phone }
      });
      
      const savedOTP = await otpRecord.save();
      console.log('OTP saved successfully:', savedOTP._id);
      console.log('OTP details:', { email, otp, expiresAt: savedOTP.expiresAt });

      // Send OTP via email (don't await to prevent blocking)
      sendEmail({
        to: email,
        subject: 'Sakshi Tours - Registration OTP',
        html: `
          <h2>Welcome to Sakshi Tours!</h2>
          <p>Your OTP for registration is: <strong>${otp}</strong></p>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      }).then(() => {
        console.log('OTP email sent successfully to:', email);
      }).catch((emailError) => {
        console.error('Email send error:', emailError.message);
      });

      // Always return success since OTP is saved
      res.json({ 
        success: true,
        msg: 'OTP sent successfully',
        email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  },

  // Step 2: Verify OTP
  async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;
      console.log('Verifying OTP for:', email, 'OTP:', otp);
      
      // Check all OTPs for this email first
      const allOTPs = await OTP.find({ email });
      console.log('All OTPs for', email, ':', allOTPs.map(o => ({ otp: o.otp, verified: o.verified, expired: o.expiresAt < new Date() })));
      
      const otpRecord = await OTP.findOne({ 
        email, 
        otp, 
        type: 'registration',
        verified: false,
        expiresAt: { $gt: new Date() }
      });
      
      if (!otpRecord) {
        console.log('OTP not found or expired for:', email);
        return res.status(400).json({ msg: 'Invalid or expired OTP' });
      }

      console.log('Found valid OTP, marking as verified');
      // Mark OTP as verified
      otpRecord.verified = true;
      await otpRecord.save();

      res.json({ 
        msg: 'OTP verified successfully',
        userData: otpRecord.userData
      });
    } catch (err) {
      console.error('OTP verification error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  },

  // Step 3: Complete registration with password
  async completeRegistration(req, res) {
    try {
      const { email, otp, password, confirmPassword } = req.body;
      
      if (password !== confirmPassword) {
        return res.status(400).json({ msg: 'Passwords do not match' });
      }

      const otpRecord = await OTP.findOne({ 
        email, 
        otp, 
        type: 'registration',
        verified: true,
        expiresAt: { $gt: new Date() }
      });
      
      if (!otpRecord) {
        return res.status(400).json({ msg: 'Invalid or expired OTP' });
      }

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Create user
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      
      user = new User({ 
        name: otpRecord.userData.name,
        email: otpRecord.userData.email,
        phone: otpRecord.userData.phone,
        passwordHash 
      });
      await user.save();

      // Delete used OTP
      await OTP.deleteOne({ _id: otpRecord._id });

      // Generate JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
      
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await new Token({ user: user._id, token, expiresAt }).save();
      
      res.json({ 
        msg: 'Registration completed successfully',
        token, 
        user: { id: user._id, name: user.name, email: user.email, role: user.role } 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  },

  // Original registration (kept for backward compatibility)
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const { name, email, password, phone } = req.body;
      
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      user = new User({ name, email, passwordHash, phone });
      await user.save();

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
      
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await new Token({ user: user._id, token, expiresAt }).save();
      
      res.json({ 
        token, 
        user: { id: user._id, name: user.name, email: user.email, role: user.role } 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log('Login attempt for:', email);
      
      // Hardcoded admin login for demo
      if (email === 'admin@sakshi.com' && password === 'admin123') {
        console.log('Admin login successful');
        const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        return res.json({ 
          token, 
          user: { id: 'admin', name: 'Admin', email: 'admin@sakshi.com', role: 'admin' } 
        });
      }
      
      const user = await User.findOne({ email });
      console.log('User found:', user ? 'Yes' : 'No');
      if (!user) {
        console.log('User not found in database');
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      console.log('User role:', user.role);
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      console.log('Password match:', isMatch);
      if (!isMatch) {
        console.log('Password does not match');
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
      
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await new Token({ user: user._id, token, expiresAt }).save();
      
      res.json({ 
        token, 
        user: { id: user._id, name: user.name, email: user.email, role: user.role } 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
};

module.exports = authController;