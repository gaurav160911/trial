const { calculatePremium } = require('../utils/premiumEngine');

const getPremiumCalculation = (req, res) => {
  try {
    const {
      plan = 'Standard',
      zone = 'medium',
      riskScore = 0.5,
      loyaltyMonths = 0
    } = req.query;

    if (!['Basic', 'Standard', 'Premium'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan. Choose Basic, Standard, or Premium.' });
    }
    if (!['low', 'medium', 'high'].includes(zone)) {
      return res.status(400).json({ message: 'Invalid zone. Choose low, medium, or high.' });
    }

    const result = calculatePremium(plan, zone, parseFloat(riskScore), parseInt(loyaltyMonths, 10));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFactors = (req, res) => {
  const month = new Date().getMonth();
  let season, seasonalFactor;

  if (month >= 5 && month <= 8) {
    season = 'Monsoon';
    seasonalFactor = 1.3;
  } else if (month === 10 || month === 11 || month === 0) {
    season = 'Winter';
    seasonalFactor = 1.1;
  } else {
    season = 'Normal';
    seasonalFactor = 1.0;
  }

  res.json({
    zoneMultipliers: { low: 0.9, medium: 1.0, high: 1.2 },
    currentSeason: season,
    seasonalFactor,
    basePremiums: { Basic: 29, Standard: 49, Premium: 79 },
    coverageAmounts: { Basic: 5000, Standard: 10000, Premium: 20000 },
    maxLoyaltyDiscount: '15%',
    riskAdjustmentRange: { min: 0.8, max: 1.2 }
  });
};

module.exports = { calculatePremium: getPremiumCalculation, getFactors };
