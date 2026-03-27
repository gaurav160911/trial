import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import PremiumBreakdown from '../components/PremiumBreakdown';
import LoadingSpinner from '../components/LoadingSpinner';
import { calculatePremium } from '../api/premium';
import { subscribePolicy } from '../api/policies';

const PLANS = [
  { id: 'basic', label: 'Basic', coverage: 5000, base: 29 },
  { id: 'standard', label: 'Standard', coverage: 10000, base: 49 },
  { id: 'premium', label: 'Premium', coverage: 20000, base: 79 },
];

const ZONE_MULTIPLIERS = { low: 1.0, medium: 1.2, high: 1.5 };

function getRiskLabel(score) {
  if (score < 0.4) return 'Low Risk';
  if (score < 0.7) return 'Medium Risk';
  return 'High Risk';
}

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if ([6, 7, 8, 9].includes(month)) return { name: 'Monsoon', factor: 1.3 };
  if ([3, 4, 5].includes(month)) return { name: 'Summer', factor: 1.2 };
  if ([12, 1, 2].includes(month)) return { name: 'Winter', factor: 1.1 };
  return { name: 'Regular', factor: 1.0 };
}

function calcLocalPremium(planId, zone, riskScore, loyaltyMonths) {
  const plan = PLANS.find((p) => p.id === planId) || PLANS[0];
  const zoneMultiplier = ZONE_MULTIPLIERS[zone] || 1.0;
  const season = getCurrentSeason();
  const riskAdjustment = 1 + riskScore * 0.5;
  const loyaltyDiscount = Math.min(loyaltyMonths * 1, 20);
  const base = plan.base;
  const afterZone = base * zoneMultiplier;
  const afterSeason = afterZone * season.factor;
  const afterRisk = afterSeason * riskAdjustment;
  const finalPremium = Math.round(afterRisk * (1 - loyaltyDiscount / 100));

  return {
    plan: planId,
    basePremium: base,
    zoneMultiplier: zoneMultiplier.toFixed(1),
    seasonalFactor: season.factor.toFixed(1),
    season: season.name,
    riskAdjustment: riskAdjustment.toFixed(2),
    loyaltyDiscount,
    finalPremium,
    coverage: plan.coverage,
  };
}

export default function PremiumCalculator() {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [zone, setZone] = useState('medium');
  const [riskScore, setRiskScore] = useState(0.3);
  const [loyaltyMonths, setLoyaltyMonths] = useState(0);
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchPremium = useCallback(async () => {
    setLoading(true);
    try {
      const data = await calculatePremium(selectedPlan, zone, riskScore, loyaltyMonths);
      setBreakdown(data.breakdown || data);
    } catch {
      // Fallback to local calculation if API unavailable
      setBreakdown(calcLocalPremium(selectedPlan, zone, riskScore, loyaltyMonths));
    } finally {
      setLoading(false);
    }
  }, [selectedPlan, zone, riskScore, loyaltyMonths]);

  useEffect(() => {
    const timer = setTimeout(fetchPremium, 400);
    return () => clearTimeout(timer);
  }, [fetchPremium]);

  const handleSubscribe = async () => {
    setSubscribing(true);
    setMessage(null);
    try {
      // Backend expects capitalized plan name
      const planName = selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1);
      await subscribePolicy(planName);
      setMessage({ type: 'success', text: `Subscribed to ${selectedPlan} plan! 🎉` });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to subscribe.' });
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <h1 className="page-title">Premium Calculator 🧮</h1>

        {message && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <div className="calculator-layout">
          {/* Controls */}
          <div className="calculator-controls">
            {/* Plan Selector */}
            <div className="form-group">
              <label className="form-label">Plan</label>
              <div className="plan-tabs">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    className={`plan-tab ${selectedPlan === p.id ? 'active' : ''}`}
                    onClick={() => setSelectedPlan(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Zone Selector */}
            <div className="form-group">
              <label className="form-label">Delivery Zone</label>
              <select
                className="form-select"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
              >
                <option value="low">Low Risk Zone (×1.0)</option>
                <option value="medium">Medium Risk Zone (×1.2)</option>
                <option value="high">High Risk Zone (×1.5)</option>
              </select>
            </div>

            {/* Risk Score Slider */}
            <div className="form-group">
              <label className="form-label">
                Risk Score: <strong>{riskScore.toFixed(1)}</strong>{' '}
                <span className="risk-label">({getRiskLabel(riskScore)})</span>
              </label>
              <input
                type="range"
                className="form-slider"
                min="0"
                max="1"
                step="0.1"
                value={riskScore}
                onChange={(e) => setRiskScore(parseFloat(e.target.value))}
              />
              <div className="slider-labels">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            {/* Loyalty Months Slider */}
            <div className="form-group">
              <label className="form-label">
                Loyalty Months: <strong>{loyaltyMonths}</strong>
                {loyaltyMonths > 0 && (
                  <span className="discount-tag"> ({Math.min(loyaltyMonths, 20)}% off)</span>
                )}
              </label>
              <input
                type="range"
                className="form-slider"
                min="0"
                max="24"
                step="1"
                value={loyaltyMonths}
                onChange={(e) => setLoyaltyMonths(parseInt(e.target.value))}
              />
              <div className="slider-labels">
                <span>0</span>
                <span>12 months</span>
                <span>24 months</span>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="calculator-result">
            {loading ? (
              <LoadingSpinner text="Calculating..." />
            ) : breakdown ? (
              <>
                <div className="premium-result-card">
                  <p className="result-label">Final Premium</p>
                  <p className="result-value">₹{breakdown.finalPremium || 0}</p>
                  <p className="result-period">per week</p>
                </div>
                <PremiumBreakdown breakdown={breakdown} />
                <button
                  className="btn btn-primary btn-full"
                  onClick={handleSubscribe}
                  disabled={subscribing}
                >
                  {subscribing ? 'Subscribing...' : `Subscribe to ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan`}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
