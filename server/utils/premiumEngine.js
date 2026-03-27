const calculatePremium = (plan, zone, riskScore, loyaltyMonths) => {
  const basePremiums = { Basic: 29, Standard: 49, Premium: 79 };
  const coverage = { Basic: 5000, Standard: 10000, Premium: 20000 };
  const zoneMultipliers = { low: 0.9, medium: 1.0, high: 1.2 };

  const month = new Date().getMonth();
  // Monsoon (June-Sep) = 1.3, Winter (Nov-Jan) = 1.1, else 1.0
  let seasonalFactor = 1.0;
  if (month >= 5 && month <= 8) seasonalFactor = 1.3;
  else if (month === 10 || month === 11 || month === 0) seasonalFactor = 1.1;

  const riskAdjustment = 1 + (riskScore - 0.5) * 0.4;
  const loyaltyDiscount = Math.min(loyaltyMonths * 0.01, 0.15); // max 15%

  const basePremium = basePremiums[plan];
  const zoneMultiplier = zoneMultipliers[zone] || 1.0;
  const finalPremium = Math.round(
    basePremium * zoneMultiplier * seasonalFactor * riskAdjustment * (1 - loyaltyDiscount)
  );

  return {
    plan,
    basePremium,
    zoneMultiplier,
    seasonalFactor,
    riskAdjustment: parseFloat(riskAdjustment.toFixed(2)),
    loyaltyDiscount: parseFloat((loyaltyDiscount * 100).toFixed(1)),
    finalPremium,
    coverage: coverage[plan],
    savedAmount: Math.max(0, basePremium - finalPremium)
  };
};

module.exports = { calculatePremium };
