import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('gigshield_token'));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('gigshield_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({});

  const login = (newToken, newUser) => {
    localStorage.setItem('gigshield_token', newToken);
    localStorage.setItem('gigshield_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('gigshield_token');
    localStorage.removeItem('gigshield_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData) => {
    const updated = { ...user, ...userData };
    localStorage.setItem('gigshield_user', JSON.stringify(updated));
    setUser(updated);
  };

  const updateOnboardingData = (data) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        updateUser,
        onboardingStep,
        setOnboardingStep,
        onboardingData,
        updateOnboardingData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
