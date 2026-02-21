import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfileView.css';

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    productIdsJson: string;
}

export default function ProfileView() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out securely?")) {
            logout();
            navigate('/login');
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`http://localhost:5001/api/orders/user/${user?.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

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
                <div className="profile-actions-grid">
                    <div className="action-card" onClick={() => {
                        const ordersSection = document.getElementById('recent-orders');
                        ordersSection?.scrollIntoView({ behavior: 'smooth' });
                    }}>
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

                    <div className="action-card logout-card" onClick={handleLogout}>
                        <div className="action-icon">🔒</div>
                        <div className="action-text">
                            <h3>Sign Out</h3>
                            <p>Securely log out of your PEAK account</p>
                        </div>
                    </div>
                </div>

                <div className="profile-section" id="recent-orders">
                    <h3>Recent Orders</h3>
                    <div className="order-history-mock">
                        {isLoading ? (
                            <p>Loading your orders...</p>
                        ) : orders.length === 0 ? (
                            <p>You haven't placed any orders yet.</p>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <span className="order-date">
                                            Order placed: {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className="order-total">Total: ${order.totalAmount.toFixed(2)}</span>
                                        <span className="order-id">Order ID: {order.id.slice(0, 8)}...</span>
                                    </div>
                                    <div className="order-body">
                                        <p>Status: <strong style={{ color: order.status === 'PENDING' ? '#e77600' : 'green' }}>{order.status}</strong></p>
                                        <p>Items: {JSON.parse(order.productIdsJson).length} product(s)</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
