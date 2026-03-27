import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ClaimCard from '../components/ClaimCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getClaims, triggerClaim, processPayout } from '../api/claims';
import { getCurrentPolicy } from '../api/policies';

const CLAIM_TYPES = [
  { id: 'rain', label: 'Rain Claim', icon: '🌧️' },
  { id: 'aqi', label: 'AQI Claim', icon: '💨' },
  { id: 'heat', label: 'Heat Claim', icon: '🌡️' },
];

const STATUS_BADGE = {
  pending: 'badge-warning',
  approved: 'badge-info',
  paid: 'badge-success',
  rejected: 'badge-danger',
};

export default function ClaimsPage() {
  const [policy, setPolicy] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const [triggerLoading, setTriggerLoading] = useState({});
  const [payoutLoading, setPayoutLoading] = useState({});
  const [claimResult, setClaimResult] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoadingClaims(true);
    try {
      const [pData, cData] = await Promise.all([getCurrentPolicy(), getClaims()]);
      setPolicy(pData.policy || null);
      setClaims(cData.claims || []);
    } catch {
      setClaims([]);
    } finally {
      setLoadingClaims(false);
    }
  };

  const handleTrigger = async (type) => {
    setTriggerLoading((prev) => ({ ...prev, [type]: true }));
    setClaimResult(null);
    setMessage(null);
    try {
      const data = await triggerClaim(type);
      const claim = data.claim || data;
      setClaimResult(claim);
      fetchAll();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || `Failed to trigger ${type} claim.` });
    } finally {
      setTriggerLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handlePayout = async (claimId) => {
    setPayoutLoading((prev) => ({ ...prev, [claimId]: true }));
    setMessage(null);
    try {
      const data = await processPayout(claimId);
      setMessage({
        type: 'success',
        text: `Payout processed! Payment ID: ${data.paymentId || data.payment_id || 'PAY' + Date.now()}`,
      });
      fetchAll();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to process payout.' });
    } finally {
      setPayoutLoading((prev) => ({ ...prev, [claimId]: false }));
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <h1 className="page-title">My Claims 📋</h1>

        {message && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        {/* Trigger Section */}
        {policy && (
          <div className="trigger-card">
            <h3 className="section-title">File a Claim</h3>
            <p className="section-subtitle">Trigger a claim based on weather/environment conditions</p>
            <div className="trigger-buttons">
              {CLAIM_TYPES.map((ct) => (
                <button
                  key={ct.id}
                  className="btn btn-trigger"
                  onClick={() => handleTrigger(ct.id)}
                  disabled={triggerLoading[ct.id]}
                >
                  {triggerLoading[ct.id] ? '⏳ Processing...' : `${ct.icon} ${ct.label}`}
                </button>
              ))}
            </div>

            {/* Claim Result Popup */}
            {claimResult && (
              <div className="claim-result-popup">
                <h4 className="result-popup-title">
                  {claimResult.status === 'rejected' ? '❌ Claim Rejected' : '✅ Claim Result'}
                </h4>
                <div className="result-popup-rows">
                  <div className="result-row">
                    <span>Status</span>
                    <span className={`badge ${STATUS_BADGE[claimResult.status] || 'badge-warning'}`}>
                      {(claimResult.status || 'pending').toUpperCase()}
                    </span>
                  </div>
                  <div className="result-row">
                    <span>Amount</span>
                    <span>₹{claimResult.amount || 0}</span>
                  </div>
                  {claimResult.fraudScore !== undefined && (
                    <div className="result-row">
                      <span>Fraud Score</span>
                      <span>{parseFloat(claimResult.fraudScore).toFixed(2)}</span>
                    </div>
                  )}
                </div>
                {claimResult.status === 'approved' && (
                  <button
                    className="btn btn-success btn-full"
                    onClick={() => handlePayout(claimResult._id || claimResult.id)}
                    disabled={payoutLoading[claimResult._id || claimResult.id]}
                  >
                    {payoutLoading[claimResult._id || claimResult.id] ? 'Processing...' : '💸 Process Payout'}
                  </button>
                )}
                <button className="btn btn-ghost" onClick={() => setClaimResult(null)}>
                  Dismiss
                </button>
              </div>
            )}
          </div>
        )}

        {/* Claims List */}
        <div className="section">
          <h3 className="section-title">All Claims</h3>
          {loadingClaims ? (
            <LoadingSpinner text="Loading claims..." />
          ) : claims.length === 0 ? (
            <p className="empty-state">No claims filed yet.</p>
          ) : (
            <div className="claims-table">
              <div className="claims-table-header">
                <span>Type</span>
                <span>Date</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Fraud</span>
                <span>Action</span>
              </div>
              {claims.map((c) => (
                <div key={c._id || c.id} className="claims-table-row">
                  <span className="claim-type-cell">
                    {c.type === 'rain' ? '🌧️' : c.type === 'aqi' ? '💨' : '🌡️'}{' '}
                    {(c.type || 'N/A').toUpperCase()}
                  </span>
                  <span>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}</span>
                  <span>₹{c.amount || 0}</span>
                  <span>
                    <span className={`badge ${STATUS_BADGE[c.status] || 'badge-warning'}`}>
                      {(c.status || 'pending').toUpperCase()}
                    </span>
                  </span>
                  <span>{c.fraudScore !== undefined ? parseFloat(c.fraudScore).toFixed(2) : '—'}</span>
                  <span>
                    {c.status === 'approved' ? (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handlePayout(c._id || c.id)}
                        disabled={payoutLoading[c._id || c.id]}
                      >
                        {payoutLoading[c._id || c.id] ? '...' : 'Pay Out'}
                      </button>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
