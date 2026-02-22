import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <nav className="navbar">
      <Link to={user?.role === 'ADMIN' ? '/admin' : '/'} className="nav-brand">
        <span className="brand-logo-text brand-font">NexCart</span>
        <span className="brand-subtext">STORE</span>
      </Link>

      {user && user.role !== 'ADMIN' && (
        <form className="nav-search" onSubmit={(e) => {
          e.preventDefault();
          if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
          } else {
            navigate('/');
          }
        }}>
          <input
            type="text"
            placeholder="Search NexCart for products, brands and more"
            value={searchTerm}
            onChange={(e) => {
              const val = e.target.value;
              setSearchTerm(val);
              if (val.trim()) {
                navigate(`/?search=${encodeURIComponent(val.trim())}`);
              } else {
                if (window.location.pathname === '/') {
                  // only clear if already on home
                  navigate('/');
                }
              }
            }}
          />
          <button type="submit" className="search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </form>
      )}

      <div className="nav-actions">
        {user ? (
          <div className="nav-userbox">
            <span className="welcome-text">
              <Link to={user.role === 'ADMIN' ? '/admin' : '/profile'} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="nav-avatar" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <div className="nav-avatar-fallback">{user.username.charAt(0).toUpperCase()}</div>
                )}
                <span className="nav-greeting">Hello, {user.username}</span>
              </Link>
            </span>
          </div>
        ) : (
          <div className="nav-auth">
            <Link to="/login" className="login-link">Login</Link>
          </div>
        )}

        {(!user || user.role !== 'ADMIN') && (
          <Link to="/" className="nav-home-link" style={{ textDecoration: 'none' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span className="home-text">Home</span>
          </Link>
        )}

        {user && user.role === 'CONSUMER' && (
          <Link to="/cart" className="nav-cart" style={{ textDecoration: 'none' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span className="cart-badge">{getCartCount()}</span>
            <span>Cart</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
