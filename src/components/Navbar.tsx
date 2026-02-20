import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span className="brand-logo-text brand-font">PEAK</span>
        <span className="brand-subtext">STORE</span>
      </Link>

      <div className="nav-search">
        <input type="text" placeholder="Search for products, brands and more" />
        <button className="search-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      </div>

      <div className="nav-actions">
        {user ? (
          <div className="nav-userbox">
            <span className="welcome-text">
              <Link to={user.role === 'ADMIN' ? '/admin' : '/profile'} style={{ color: 'inherit', textDecoration: 'none' }}>
                Hello, {user.username}
              </Link>
            </span>
            <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
          </div>
        ) : (
          <div className="nav-auth">
            <Link to="/login" className="login-link">Login</Link>
          </div>
        )}

        {/* Only show cart to consumers or generic users */}
        {(!user || user.role === 'CONSUMER') && (
          <Link to="/cart" className="nav-cart" style={{ textDecoration: 'none' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span className="cart-badge">0</span>
            <span>Cart</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
