export default function PremiumBreakdown({ breakdown }) {
  if (!breakdown) return null;

  const {
    basePremium,
    zoneMultiplier,
    seasonalFactor,
    season,
    riskAdjustment,
    loyaltyDiscount,
    finalPremium,
    coverage,
    plan,
  } = breakdown;

  return (
    <div className="breakdown-card">
      <h3 className="breakdown-title">Premium Breakdown</h3>
      <div className="breakdown-final">
        <span className="breakdown-final-label">Final Premium</span>
        <span className="breakdown-final-value">₹{finalPremium || 0}</span>
      </div>
      <div className="breakdown-rows">
        <div className="breakdown-row">
          <span>Base Premium</span>
          <span>₹{basePremium || 0}</span>
        </div>
        <div className="breakdown-row">
          <span>Zone Multiplier</span>
          <span>×{zoneMultiplier || 1}</span>
        </div>
        <div className="breakdown-row">
          <span>Seasonal Factor {season ? `(${season})` : ''}</span>
          <span>×{seasonalFactor || 1}</span>
        </div>
        <div className="breakdown-row">
          <span>Risk Adjustment</span>
          <span>×{riskAdjustment || 1}</span>
        </div>
        <div className="breakdown-row discount">
          <span>Loyalty Discount</span>
          <span className="discount-value">-{loyaltyDiscount || 0}%</span>
        </div>
      </div>
      {coverage && (
        <div className="breakdown-coverage">
          Coverage: <strong>₹{coverage.toLocaleString()}</strong>
        </div>
      )}
    </div>
  );
}
