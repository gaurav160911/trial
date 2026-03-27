const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'gigshield_secret', { expiresIn: '30d' });

const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });
    // In production this would call an SMS gateway; demo always uses 123456
    console.log(`OTP 123456 sent to ${phone}`);
    res.json({ message: 'OTP sent', phone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP are required' });
    if (otp !== '123456') return res.status(400).json({ message: 'Invalid OTP' });

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }

    res.json({
      message: 'OTP verified',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        phone: user.phone,
        name: user.name,
        platform: user.platform,
        zone: user.zone,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, aadhaarLast4, platform, partnerId, pincode, zone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, aadhaarLast4, platform, partnerId, pincode, zone, isVerified: true },
      { new: true, runValidators: true }
    );
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { sendOTP, verifyOTP, updateProfile, getProfile };
