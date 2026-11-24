require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const authController = require('../controllers/authController');

// 2FA Registration Routes
router.post('/register/send-otp',
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  authController.sendRegistrationOTP
);

router.post('/register/verify-otp',
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  authController.verifyOTP
);

router.post('/register/complete',
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is required'),
  authController.completeRegistration
);

// Original register route (backward compatibility)
router.post('/register',
  body('email').isEmail(),
  body('name').notEmpty(),
  body('password').isLength({ min: 12, max: 16 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,16}$/).withMessage('Password must be 12-16 characters with at least one uppercase, lowercase, number, and symbol'),
  authController.register
);

router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  authController.login
);

module.exports = router;