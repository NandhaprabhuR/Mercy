import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileView.css';

export default function ProfileView() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutConfirm = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="avatar">
                    {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        user?.username.charAt(0).toUpperCase()
                    )}
                </div>
                <div>
                    <h2>{user?.username}</h2>
                    <p className="role-badge">{user?.role}</p>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-actions-grid">
                    <div className="action-card" onClick={() => navigate('/profile/orders')}>
                        <div className="action-icon">📦</div>
                        <div className="action-text">
                            <h3>Your Orders</h3>
                            <p>Track packages, return items, or buy things again</p>
                        </div>
                    </div>

                    <div className="action-card" onClick={() => navigate('/profile/addresses')}>
                        <div className="action-icon">🏠</div>
                        <div className="action-text">
                            <h3>Your Addresses</h3>
                            <p>Edit, remove, or set default delivery addresses</p>
                        </div>
                    </div>

                    <div className="action-card" onClick={() => navigate('/profile/reviews')}>
                        <div className="action-icon">⭐</div>
                        <div className="action-text">
                            <h3>My Reviews</h3>
                            <p>View all your submitted seller feedback</p>
                        </div>
                    </div>

                    <div className="action-card" onClick={() => navigate('/profile/edit')}>
                        <div className="action-icon">⚙️</div>
                        <div className="action-text">
                            <h3>Edit Profile</h3>
                            <p>Change your avatar and update your password</p>
                        </div>
                    </div>

                    <div className="action-card logout-card" onClick={() => setShowLogoutModal(true)}>
                        <div className="action-icon">🔒</div>
                        <div className="action-text">
                            <h3>Sign Out</h3>
                            <p>Securely log out of your NexCart account</p>
                        </div>
                    </div>
                </div>

                <div className="profile-actions-grid" style={{ marginTop: '2rem' }}>
                    <div className="action-card theme-card" onClick={toggleTheme} style={{ border: '2px dashed var(--border-color)', backgroundColor: 'transparent' }}>
                        <div className="action-icon">{theme === 'dark' ? '☀️' : '🌙'}</div>
                        <div className="action-text">
                            <h3>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</h3>
                            <p>Switch to a {theme === 'dark' ? 'brighter' : 'sleeker'} looking experience!</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Logout Modal Overlay */}
            {showLogoutModal && (
                <div className="logout-modal-overlay" onClick={() => setShowLogoutModal(false)}>
                    <div className="logout-modal" onClick={e => e.stopPropagation()}>
                        <h3>Sign Out</h3>
                        <p>Are you sure you want to log out securely?</p>
                        <div className="logout-modal-actions">
                            <button className="cancel-btn" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                            <button className="confirm-btn" onClick={handleLogoutConfirm}>Sign Out</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
