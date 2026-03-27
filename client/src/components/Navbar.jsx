import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/policy', label: 'Policy', icon: '🛡️' },
    { path: '/calculator', label: 'Calculator', icon: '🧮' },
    { path: '/claims', label: 'Claims', icon: '📋' },
  ];

  return (
    <>
      {/* Top navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-icon">🛡️</span>
          <span className="brand-name">GigShield</span>
        </div>
        <div className="navbar-user">
          {user && <span className="user-name">{user.name || user.phone}</span>}
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      {/* Bottom mobile nav */}
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
