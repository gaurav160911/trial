const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  aadhaarLast4: { type: String, default: '' },
  platform: { type: String, enum: ['Swiggy', 'Zomato', 'Both'], default: 'Swiggy' },
  partnerId: { type: String, default: '' },
  pincode: { type: String, default: '' },
  zone: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  loyaltyMonths: { type: Number, default: 0 },
  riskScore: { type: Number, default: 0.5 },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
