import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StepIndicator } from './Step1Phone';
import { updateProfile } from '../../api/auth';

function detectZone(pincode) {
  const first = pincode.charAt(0);
  if (first === '1') return { zone: 'high', label: 'High Risk Zone', color: '#E53E3E' };
  if (['2', '3', '4', '5'].includes(first)) return { zone: 'medium', label: 'Medium Risk Zone', color: '#D69E2E' };
  return { zone: 'low', label: 'Low Risk Zone', color: '#38A169' };
}

export default function Step5Zone() {
  const navigate = useNavigate();
  const { updateUser, onboardingData, user } = useAuth();

  const [pincode, setPincode] = useState('');
  const [zoneInfo, setZoneInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDetect = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }
    setError('');
    const info = detectZone(pincode);
    setZoneInfo(info);
  };

  const handleComplete = async () => {
    if (!zoneInfo) {
      setError('Please detect your zone first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const profileData = {
        ...onboardingData,
        pincode,
        zone: zoneInfo.zone,
      };
      const data = await updateProfile(profileData);
      updateUser(data.user || { ...user, ...profileData });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <StepIndicator current={5} />
        <div className="onboarding-header">
          <span className="onboarding-icon">🛡️</span>
          <h1 className="onboarding-title">Zone Detection</h1>
          <p className="onboarding-subtitle">Enter your pincode to detect your risk zone</p>
        </div>

        <div className="form-group">
          <label className="form-label">Pincode</label>
          <input
            type="text"
            className="form-input"
            placeholder="6-digit pincode"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
              setZoneInfo(null);
              setError('');
            }}
          />
        </div>

        <button className="btn btn-secondary btn-full" onClick={handleDetect} disabled={loading}>
          🔍 Detect Zone
        </button>

        {zoneInfo && (
          <div className="zone-result" style={{ borderColor: zoneInfo.color }}>
            <span className="zone-icon">📍</span>
            <div>
              <p className="zone-name" style={{ color: zoneInfo.color }}>{zoneInfo.label}</p>
              <p className="zone-pincode">Pincode: {pincode}</p>
            </div>
            <span className="badge" style={{ backgroundColor: zoneInfo.color, color: '#fff' }}>
              {zoneInfo.zone.toUpperCase()}
            </span>
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        <button
          className="btn btn-primary btn-full"
          onClick={handleComplete}
          disabled={loading || !zoneInfo}
        >
          {loading ? 'Completing...' : '🎉 Complete Registration'}
        </button>
      </div>
    </div>
  );
}
