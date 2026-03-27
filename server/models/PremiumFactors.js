const mongoose = require('mongoose');

const premiumFactorsSchema = new mongoose.Schema({
  zone: { type: String, required: true },
  zoneMultiplier: { type: Number, required: true },
  season: { type: String, required: true },
  seasonalFactor: { type: Number, required: true },
  basePremium: {
    Basic: { type: Number, default: 29 },
    Standard: { type: Number, default: 49 },
    Premium: { type: Number, default: 79 }
  },
  coverage: {
    Basic: { type: Number, default: 5000 },
    Standard: { type: Number, default: 10000 },
    Premium: { type: Number, default: 20000 }
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PremiumFactors', premiumFactorsSchema);
