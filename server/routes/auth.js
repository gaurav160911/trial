const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, updateProfile, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.put('/profile', protect, updateProfile);
router.get('/profile', protect, getProfile);

module.exports = router;
