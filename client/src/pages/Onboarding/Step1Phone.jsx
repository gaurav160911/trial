import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOTP, verifyOTP } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

function StepIndicator({ current, total = 5 }) {
  return (
    <div className="step-indicator">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`step-dot ${i + 1 <= current ? 'active' : ''}`} />
      ))}
      <span className="step-label">Step {current} of {total}</span>
    </div>
  );
}

export { StepIndicator };

export default function Step1Phone() {
  const navigate = useNavigate();
  const { login, updateOnboardingData } = useAuth();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendOTP(phone);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await verifyOTP(phone, otp);
      login(data.token, data.user || { phone });
      updateOnboardingData({ phone });
      navigate('/onboarding/2');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <StepIndicator current={1} />
        <div className="onboarding-header">
          <span className="onboarding-icon">🛡️</span>
          <h1 className="onboarding-title">Welcome to GigShield</h1>
          <p className="onboarding-subtitle">Micro-insurance for gig workers</p>
        </div>

        <div className="form-group">
          <label className="form-label">Mobile Number</label>
          <input
            type="tel"
            className="form-input"
            placeholder="Enter 10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            disabled={otpSent || loading}
          />
        </div>

        {!otpSent ? (
          <button className="btn btn-primary btn-full" onClick={handleSendOTP} disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Enter OTP</label>
              <input
                type="text"
                className="form-input"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={loading}
              />
              <p className="form-hint">💡 Use <strong>123456</strong> for demo</p>
            </div>
            <button className="btn btn-primary btn-full" onClick={handleVerifyOTP} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              className="btn btn-ghost btn-full"
              onClick={() => { setOtpSent(false); setOtp(''); setError(''); }}
              disabled={loading}
            >
              Change Number
            </button>
          </>
        )}

        {error && <div className="alert alert-error">{error}</div>}
      </div>
    </div>
  );
}
