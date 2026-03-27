import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PolicyCard from '../components/PolicyCard';
import ClaimCard from '../components/ClaimCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCurrentPolicy } from '../api/policies';
import { getClaims, triggerClaim } from '../api/claims';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [policy, setPolicy] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loadingPolicy, setLoadingPolicy] = useState(true);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const [triggerLoading, setTriggerLoading] = useState({ rain: false, aqi: false });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchPolicy();
    fetchClaims();
  }, []);

  const fetchPolicy = async () => {
    try {
      const data = await getCurrentPolicy();
      setPolicy(data.policy || null);
    } catch {
      setPolicy(null);
    } finally {
      setLoadingPolicy(false);
    }
  };

  const fetchClaims = async () => {
    try {
      const data = await getClaims();
      setClaims(data.claims || []);
    } catch {
      setClaims([]);
    } finally {
      setLoadingClaims(false);
    }
  };

  const handleTrigger = async (type) => {
    setTriggerLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const data = await triggerClaim(type);
      const claim = data.claim || data;
      setToast({
        type: 'success',
        message: `${type.toUpperCase()} claim ${claim.status || 'triggered'}! Amount: ₹${claim.amount || 0}`,
      });
      fetchClaims();
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || `Failed to trigger ${type} claim.`,
      });
    } finally {
      setTriggerLoading((prev) => ({ ...prev, [type]: false }));
    }
    setTimeout(() => setToast(null), 4000);
  };

  const recentClaims = claims.slice(0, 3);
  const totalClaimed = claims.filter((c) => c.status === 'paid').reduce((s, c) => s + (c.amount || 0), 0);
  const loyaltyMonths = user?.loyaltyMonths || 0;

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        {toast && (
          <div className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-greeting">Welcome back, {user?.name || user?.phone || 'Partner'}! 👋</h1>
          <span className="dashboard-role">🏍️ Active Delivery Partner</span>
        </div>

        {/* Active Policy */}
        {loadingPolicy ? (
          <LoadingSpinner text="Loading policy..." />
        ) : policy ? (
          <PolicyCard policy={policy} />
        ) : (
          <div className="no-policy-card">
            <span className="no-policy-icon">🛡️</span>
            <h3>No Active Policy</h3>
            <p>Protect yourself with GigShield micro-insurance</p>
            <button className="btn btn-primary" onClick={() => navigate('/policy')}>
              Get Insured Now
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-card-value">{claims.length}</span>
            <span className="stat-card-label">Total Claims</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-value">₹{totalClaimed.toLocaleString()}</span>
            <span className="stat-card-label">Amount Saved</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-value">{loyaltyMonths}</span>
            <span className="stat-card-label">Loyalty Months</span>
          </div>
        </div>

        {/* Claim Triggers */}
        {policy && (
          <div className="trigger-card">
            <h3 className="section-title">Simulate Triggers 🌧️</h3>
            <p className="section-subtitle">Demo: auto-trigger claims based on conditions</p>
            <div className="trigger-buttons">
              <button
                className="btn btn-trigger"
                onClick={() => handleTrigger('rain')}
                disabled={triggerLoading.rain}
              >
                {triggerLoading.rain ? '...' : '🌧️ Simulate Rain'}
              </button>
              <button
                className="btn btn-trigger"
                onClick={() => handleTrigger('aqi')}
                disabled={triggerLoading.aqi}
              >
                {triggerLoading.aqi ? '...' : '💨 Simulate AQI Spike'}
              </button>
            </div>
          </div>
        )}

        {/* Recent Claims */}
        <div className="section">
          <div className="section-header">
            <h3 className="section-title">Recent Claims</h3>
            <Link to="/claims" className="section-link">View All →</Link>
          </div>
          {loadingClaims ? (
            <LoadingSpinner size="sm" />
          ) : recentClaims.length > 0 ? (
            recentClaims.map((c) => (
              <ClaimCard key={c._id || c.id} claim={c} />
            ))
          ) : (
            <p className="empty-state">No claims yet. Stay safe out there! 🙏</p>
          )}
        </div>
      </main>
    </div>
  );
}
