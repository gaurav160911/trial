const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['Basic', 'Standard', 'Premium'], required: true },
  premium: { type: Number, required: true },
  coverage: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  premiumBreakdown: {
    basePremium: Number,
    zoneMultiplier: Number,
    seasonalFactor: Number,
    riskAdjustment: Number,
    loyaltyDiscount: Number,
    finalPremium: Number
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Policy', policySchema);
