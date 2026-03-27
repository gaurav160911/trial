import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StepIndicator } from './Step1Phone';

export default function Step2Aadhaar() {
  const navigate = useNavigate();
  const { updateOnboardingData } = useAuth();

  const [last4, setLast4] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');

  const handleValidate = () => {
    if (!/^\d{4}$/.test(last4)) {
      setError('Please enter exactly 4 digits of your Aadhaar.');
      return;
    }
    setError('');
    setValidated(true);
    updateOnboardingData({ aadhaarLast4: last4 });
  };

  const handleNext = () => {
    navigate('/onboarding/3');
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <StepIndicator current={2} />
        <div className="onboarding-header">
          <span className="onboarding-icon">🛡️</span>
          <h1 className="onboarding-title">Aadhaar Verification</h1>
          <p className="onboarding-subtitle">Enter last 4 digits of your Aadhaar</p>
        </div>

        <div className="form-group">
          <label className="form-label">Last 4 digits of Aadhaar</label>
          <input
            type="text"
            className={`form-input ${validated ? 'input-success' : ''}`}
            placeholder="XXXX"
            maxLength={4}
            value={last4}
            onChange={(e) => {
              setLast4(e.target.value.replace(/\D/g, '').slice(0, 4));
              setValidated(false);
              setError('');
            }}
            disabled={validated}
          />
        </div>

        {validated ? (
          <div className="success-banner">
            <span className="success-icon">✅</span>
            <span>Aadhaar validated successfully!</span>
          </div>
        ) : null}

        {error && <div className="alert alert-error">{error}</div>}

        {!validated ? (
          <button className="btn btn-primary btn-full" onClick={handleValidate}>
            Validate
          </button>
        ) : (
          <button className="btn btn-primary btn-full" onClick={handleNext}>
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}
