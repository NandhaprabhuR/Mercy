import { Outlet, Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';

export default function AdminLayout() {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <span className="brand-logo-text brand-font">PEAK</span>
                    <span className="brand-subtext">ADMIN</span>
                </div>

                <nav className="admin-nav">
                    <Link to="/admin" className={isActive('/admin')}>📊 Dashboard</Link>
                    <Link to="/admin/products" className={location.pathname.includes('/products') ? 'active' : ''}>👟 Products</Link>
                    <Link to="/admin/users" className={isActive('/admin/users')}>👥 Users</Link>
                </nav>
            </aside>

            <main className="admin-main">
                {/* Child routes inject here */}
                <Outlet />
            </main>
        </div>
    );
}
