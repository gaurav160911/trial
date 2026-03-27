import { useNavigate } from 'react-router-dom';

const PLAN_DETAILS = {
  basic: { label: 'Basic', coverage: 5000, price: 29 },
  standard: { label: 'Standard', coverage: 10000, price: 49 },
  premium: { label: 'Premium', coverage: 20000, price: 79 },
};

export default function PolicyCard({ policy, onCancel }) {
  const navigate = useNavigate();
  if (!policy) return null;

  const planInfo = PLAN_DETAILS[policy.plan] || PLAN_DETAILS.basic;
  const startDate = policy.startDate ? new Date(policy.startDate) : null;
  const endDate = policy.endDate ? new Date(policy.endDate) : null;
  const now = new Date();
  const daysRemaining = endDate ? Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))) : 0;

  return (
    <div className={`policy-card ${policy.status === 'active' ? 'policy-active' : ''}`}>
      <div className="policy-card-header">
        <div>
          <h3 className="policy-plan-name">🛡️ {planInfo.label} Plan</h3>
          <p className="policy-meta">ID: {policy._id || policy.id}</p>
        </div>
        <span className={`badge badge-${policy.status === 'active' ? 'success' : 'danger'}`}>
          {(policy.status || 'active').toUpperCase()}
        </span>
      </div>
      <div className="policy-stats">
        <div className="policy-stat">
          <span className="stat-label">Coverage</span>
          <span className="stat-value">₹{planInfo.coverage.toLocaleString()}</span>
        </div>
        <div className="policy-stat">
          <span className="stat-label">Premium</span>
          <span className="stat-value">₹{policy.premiumPaid || planInfo.price}/wk</span>
        </div>
        <div className="policy-stat">
          <span className="stat-label">Days Left</span>
          <span className="stat-value">{daysRemaining}</span>
        </div>
      </div>
      {startDate && (
        <p className="policy-dates">
          {startDate.toLocaleDateString()} — {endDate ? endDate.toLocaleDateString() : 'Ongoing'}
        </p>
      )}
      <div className="policy-card-actions">
        <button className="btn btn-primary" onClick={() => navigate('/policy')}>
          Manage Policy
        </button>
        {onCancel && (
          <button className="btn btn-danger-outline" onClick={() => onCancel(policy._id || policy.id)}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
