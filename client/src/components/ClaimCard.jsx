const TYPE_ICONS = {
  rain: '🌧️',
  aqi: '💨',
  heat: '🌡️',
};

const STATUS_BADGE = {
  pending: 'badge-warning',
  approved: 'badge-info',
  paid: 'badge-success',
  rejected: 'badge-danger',
};

export default function ClaimCard({ claim, onPayout }) {
  if (!claim) return null;

  const icon = TYPE_ICONS[claim.type] || '📋';
  const badgeClass = STATUS_BADGE[claim.status] || 'badge-warning';
  const date = claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : 'N/A';

  return (
    <div className="claim-card">
      <div className="claim-card-left">
        <span className="claim-icon">{icon}</span>
        <div>
          <p className="claim-type">{claim.type ? claim.type.toUpperCase() : 'CLAIM'}</p>
          <p className="claim-date">{date}</p>
        </div>
      </div>
      <div className="claim-card-right">
        <span className="claim-amount">₹{claim.amount || 0}</span>
        <span className={`badge ${badgeClass}`}>{(claim.status || 'pending').toUpperCase()}</span>
        {claim.fraudScore !== undefined && (
          <span className="fraud-score">Fraud: {parseFloat(claim.fraudScore).toFixed(2)}</span>
        )}
        {claim.status === 'approved' && onPayout && (
          <button className="btn btn-sm btn-success" onClick={() => onPayout(claim._id || claim.id)}>
            Pay Out
          </button>
        )}
      </div>
    </div>
  );
}
