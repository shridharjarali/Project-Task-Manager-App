const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { sendOtp, verifyOtpHandler } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/send-otp
router.post(
  '/send-otp',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
  ],
  validate,
  sendOtp
);

// POST /api/auth/verify-otp
router.post(
  '/verify-otp',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('otp')
      .isLength({ min: 6, max: 6 })
      .withMessage('OTP must be exactly 6 digits')
      .isNumeric()
      .withMessage('OTP must contain only numbers'),
  ],
  validate,
  verifyOtpHandler
);

module.exports = router;
