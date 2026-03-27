import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PolicyCard from '../components/PolicyCard';
import PremiumBreakdown from '../components/PremiumBreakdown';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCurrentPolicy, getPolicyHistory, subscribePolicy, cancelPolicy } from '../api/policies';

const PLANS = [
  {
    id: 'basic',
    label: 'Basic',
    price: 29,
    coverage: 5000,
    features: ['Rain Coverage', 'Basic AQI Protection', '₹5,000 max payout', '7-day policy'],
  },
  {
    id: 'standard',
    label: 'Standard',
    price: 49,
    coverage: 10000,
    popular: true,
    features: ['Rain + AQI Coverage', 'Heat Stroke Protection', '₹10,000 max payout', 'Priority claims'],
  },
  {
    id: 'premium',
    label: 'Premium',
    price: 79,
    coverage: 20000,
    features: ['All Coverage Types', 'Fraud Protection', '₹20,000 max payout', '24/7 Support'],
  },
];

export default function PolicyPage() {
  const [policy, setPolicy] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingPolicy, setLoadingPolicy] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoadingPolicy(true);
    try {
      const [pData, hData] = await Promise.all([getCurrentPolicy(), getPolicyHistory()]);
      setPolicy(pData.policy || null);
      setHistory(hData.policies || hData.history || []);
    } catch {
      setPolicy(null);
    } finally {
      setLoadingPolicy(false);
    }
  };

  const handleSubscribe = async (planId) => {
    setSubscribing(planId);
    setMessage(null);
    try {
      const data = await subscribePolicy(planId);
      setPolicy(data.policy);
      setMessage({ type: 'success', text: `Successfully subscribed to ${planId} plan! 🎉` });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to subscribe.' });
    } finally {
      setSubscribing(null);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel your policy?')) return;
    setCancelling(true);
    try {
      await cancelPolicy(id);
      setPolicy(null);
      setMessage({ type: 'success', text: 'Policy cancelled successfully.' });
      fetchAll();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to cancel policy.' });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <h1 className="page-title">Insurance Policy 🛡️</h1>

        {message && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        {/* Active Policy */}
        {loadingPolicy ? (
          <LoadingSpinner text="Loading policy..." />
        ) : policy ? (
          <>
            <PolicyCard policy={policy} onCancel={handleCancel} />
            {cancelling && <LoadingSpinner size="sm" text="Cancelling..." />}

            {policy.breakdown && (
              <>
                <PremiumBreakdown breakdown={policy.breakdown} />
                <div className="savings-banner">
                  🎉 You saved ₹{policy.savedAmount || Math.round((policy.breakdown.basePremium || 0) * 0.1)} this week!
                </div>
              </>
            )}
          </>
        ) : (
          <div className="no-policy-card">
            <span className="no-policy-icon">🛡️</span>
            <p>No active policy. Choose a plan below to get started.</p>
          </div>
        )}

        {/* Choose a Plan */}
        <h2 className="section-title" style={{ marginTop: '2rem' }}>Choose a Plan</h2>
        <div className="plans-grid">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`plan-card ${plan.popular ? 'plan-popular' : ''}`}>
              {plan.popular && <span className="popular-badge">⭐ POPULAR</span>}
              <h3 className="plan-name">{plan.label}</h3>
              <div className="plan-price">
                <span className="plan-amount">₹{plan.price}</span>
                <span className="plan-period">/week</span>
              </div>
              <div className="plan-coverage">Coverage: ₹{plan.coverage.toLocaleString()}</div>
              <ul className="plan-features">
                {plan.features.map((f) => (
                  <li key={f}>✅ {f}</li>
                ))}
              </ul>
              <button
                className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'} btn-full`}
                onClick={() => handleSubscribe(plan.id)}
                disabled={subscribing === plan.id || (policy && policy.status === 'active')}
              >
                {subscribing === plan.id ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>

        {/* Policy History */}
        <div className="history-section">
          <button className="history-toggle" onClick={() => setHistoryOpen(!historyOpen)}>
            📜 Policy History {historyOpen ? '▲' : '▼'}
          </button>
          {historyOpen && (
            <div className="history-list">
              {history.length === 0 ? (
                <p className="empty-state">No policy history yet.</p>
              ) : (
                history.map((h) => (
                  <div key={h._id || h.id} className="history-item">
                    <span>{h.plan?.toUpperCase() || 'PLAN'}</span>
                    <span>{h.startDate ? new Date(h.startDate).toLocaleDateString() : 'N/A'}</span>
                    <span className={`badge badge-${h.status === 'active' ? 'success' : 'danger'}`}>
                      {(h.status || 'expired').toUpperCase()}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
