import { useAuth } from '../context/AuthContext';
import './ProfileView.css';

export default function ProfileView() {
    const { user } = useAuth();

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="avatar">
                    {user?.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2>{user?.username}</h2>
                    <p className="role-badge">{user?.role}</p>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-section">
                    <h3>Your Orders</h3>
                    <div className="order-history-mock">
                        <div className="order-card">
                            <div className="order-header">
                                <span className="order-date">Order placed: Oct 24, 2025</span>
                                <span className="order-total">Total: $155.99</span>
                                <span className="order-id">Order #112-4919</span>
                            </div>
                            <div className="order-body">
                                <p>Status: <strong style={{ color: 'green' }}>Delivered</strong></p>
                                <p>Items: PEAK Performance Tee, PEAK Pro Dumbbells</p>
                            </div>
                        </div>

                        <div className="order-card">
                            <div className="order-header">
                                <span className="order-date">Order placed: Sep 10, 2025</span>
                                <span className="order-total">Total: $45.00</span>
                                <span className="order-id">Order #112-2884</span>
                            </div>
                            <div className="order-body">
                                <p>Status: <strong style={{ color: 'green' }}>Delivered</strong></p>
                                <p>Items: PEAK Recovery Protein</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-section">
                    <h3>Account Settings</h3>
                    <ul className="settings-list">
                        <li>Login & Security</li>
                        <li>Your Addresses</li>
                        <li>Payment Methods</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
