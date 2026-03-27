import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StepIndicator } from './Step1Phone';

const PLATFORMS = [
  { id: 'swiggy', label: 'Swiggy', emoji: '🟠', color: '#FF6B35' },
  { id: 'zomato', label: 'Zomato', emoji: '🔴', color: '#CB202D' },
  { id: 'both', label: 'Both', emoji: '💜', color: '#6B46C1' },
];

export default function Step3Platform() {
  const navigate = useNavigate();
  const { updateOnboardingData } = useAuth();

  const handleSelect = (platformId) => {
    updateOnboardingData({ platform: platformId });
    navigate('/onboarding/4');
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <StepIndicator current={3} />
        <div className="onboarding-header">
          <span className="onboarding-icon">🛡️</span>
          <h1 className="onboarding-title">Select Platform</h1>
          <p className="onboarding-subtitle">Which platform do you deliver on?</p>
        </div>

        <div className="platform-grid">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              className="platform-card"
              style={{ '--platform-color': p.color }}
              onClick={() => handleSelect(p.id)}
            >
              <span className="platform-emoji">{p.emoji}</span>
              <span className="platform-label">{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
