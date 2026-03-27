import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Step1Phone from './pages/Onboarding/Step1Phone';
import Step2Aadhaar from './pages/Onboarding/Step2Aadhaar';
import Step3Platform from './pages/Onboarding/Step3Platform';
import Step4PartnerId from './pages/Onboarding/Step4PartnerId';
import Step5Zone from './pages/Onboarding/Step5Zone';
import Dashboard from './pages/Dashboard';
import PolicyPage from './pages/PolicyPage';
import ClaimsPage from './pages/ClaimsPage';
import PremiumCalculator from './pages/PremiumCalculator';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding/1" replace />} />
          <Route path="/onboarding/1" element={<Step1Phone />} />
          <Route path="/onboarding/2" element={<Step2Aadhaar />} />
          <Route path="/onboarding/3" element={<Step3Platform />} />
          <Route path="/onboarding/4" element={<Step4PartnerId />} />
          <Route path="/onboarding/5" element={<Step5Zone />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/policy" element={<ProtectedRoute><PolicyPage /></ProtectedRoute>} />
          <Route path="/claims" element={<ProtectedRoute><ClaimsPage /></ProtectedRoute>} />
          <Route path="/calculator" element={<ProtectedRoute><PremiumCalculator /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
