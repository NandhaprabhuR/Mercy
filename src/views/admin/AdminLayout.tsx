import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const isActive = (path: string) => {
        return location.pathname === path ? 'active' : '';
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="admin-brand">
                    <button
                        className="mobile-sidebar-toggle"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        title="Toggle Sidebar"
                    >
                        ☰
                    </button>
                    <div className="brand-text">
                        <span className="brand-logo-text brand-font">NexCart</span>
                        <span className="brand-subtext">ADMIN</span>
                    </div>
                </div>

                <nav className="admin-nav">
                    <div className="nav-links">
                        <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                            <span className="nav-label">Dashboard</span>
                        </Link>
                        <Link to="/admin/products" className={location.pathname.includes('/products') ? 'active' : ''}>
                            <span className="nav-label">Products</span>
                        </Link>
                        <Link to="/admin/orders" className={location.pathname.includes('/orders') ? 'active' : ''}>
                            <span className="nav-label">Orders</span>
                        </Link>
                        <Link to="/admin/users" className={isActive('/admin/users')}>
                            <span className="nav-label">Users</span>
                        </Link>
                    </div>

                    <div className="nav-footer">
                        <button
                            className="logout-sidebar-btn"
                            onClick={() => setShowLogoutConfirm(true)}
                        >
                            <span className="nav-label">Logout</span>
                        </button>
                    </div>
                </nav>
            </aside>

            <main className="admin-main">
                {/* Child routes inject here */}
                <Outlet />
            </main>

            {showLogoutConfirm && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '1rem', color: '#c0392b' }}>Confirm Logout</h3>
                        <p style={{ color: 'var(--text-color)', marginBottom: '2rem' }}>Are you sure you want to log out of the admin panel?</p>
                        <div className="admin-modal-actions" style={{ justifyContent: 'center' }}>
                            <button className="cancel-btn" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                            <button className="confirm-btn" style={{ backgroundColor: '#d9534f', color: '#fff' }} onClick={handleLogout}>Yes, Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
