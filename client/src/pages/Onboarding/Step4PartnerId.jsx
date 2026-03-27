import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StepIndicator } from './Step1Phone';

export default function Step4PartnerId() {
  const navigate = useNavigate();
  const { updateOnboardingData } = useAuth();

  const [partnerId, setPartnerId] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!partnerId.trim()) {
      setError('Please enter your partner/delivery ID.');
      return;
    }
    updateOnboardingData({ partnerId: partnerId.trim() });
    navigate('/onboarding/5');
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <StepIndicator current={4} />
        <div className="onboarding-header">
          <span className="onboarding-icon">🛡️</span>
          <h1 className="onboarding-title">Partner ID</h1>
          <p className="onboarding-subtitle">Enter your delivery partner ID</p>
        </div>

        <div className="form-group">
          <label className="form-label">Delivery Partner ID</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. SWG-12345 or ZMT-67890"
            value={partnerId}
            onChange={(e) => { setPartnerId(e.target.value); setError(''); }}
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <button className="btn btn-primary btn-full" onClick={handleContinue}>
          Continue →
        </button>
      </div>
    </div>
  );
}
