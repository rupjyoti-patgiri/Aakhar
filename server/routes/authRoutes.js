const express = require('express');
const router = express.Router();
const { signup, login, changePassword, verifyOtp } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', signup);

// @route   POST api/auth/verify-otp
// @desc    Verify OTP and log in user
// @access  Public
router.post('/verify-otp', verifyOtp);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   PUT api/auth/changepassword
// @desc    Change user password
// @access  Private (requires token)
router.put('/changepassword', protect, changePassword);

module.exports = router;
