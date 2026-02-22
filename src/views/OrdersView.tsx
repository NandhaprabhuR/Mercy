import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './OrdersView.css';

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    productIdsJson: string;
    feedbackRating?: number;
    feedbackComment?: string;
}

export default function OrdersView() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
        <div className="orders-page">
            <div className="orders-header">
                <button className="back-btn" onClick={() => navigate('/profile')}>
                    &larr; Back to Profile
                </button>
                <h2>Your Orders</h2>
                <p>Track, return, or buy things again</p>
            </div>

            <div className="order-history-list">
                {isLoading ? (
                    <div className="loading-state">Loading your orders...</div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <p>You haven't placed any orders yet.</p>
                        <button className="primary-btn mt-1" onClick={() => navigate('/')}>Start Shopping</button>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="order-card-large">
                            <div className="order-card-header">
                                <div className="order-meta">
                                    <div className="meta-block">
                                        <span>ORDER PLACED</span>
                                        <strong>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                                    </div>
                                    <div className="meta-block">
                                        <span>TOTAL</span>
                                        <strong>${order.totalAmount.toFixed(2)}</strong>
                                    </div>
                                    <div className="meta-block">
                                        <span>SHIP TO</span>
                                        <strong>{user?.username}</strong>
                                    </div>
                                </div>
                                <div className="order-id-block">
                                    <span>ORDER # {order.id.toUpperCase()}</span>
                                    <button className="link-btn" onClick={() => navigate(`/profile/orders/${order.id}/invoice`)}>View Invoice</button>
                                </div>
                            </div>
                            <div className="order-card-body">
                                <h3>
                                    Status: <span style={{ color: order.status === 'PENDING' ? '#e77600' : 'var(--neon-green)' }}>{order.status}</span>
                                </h3>
                                <p>You ordered {JSON.parse(order.productIdsJson).length} item(s) in this shipment.</p>
                                <div className="order-actions">
                                    <button className="secondary-btn" onClick={() => navigate(`/profile/orders/${order.id}/track`)}>Track Package</button>

                                    <button
                                        className="secondary-btn"
                                        disabled={['RETURN_REQUESTED', 'RETURNED', 'REFUNDED'].includes(order.status)}
                                        onClick={() => navigate(`/profile/orders/${order.id}/return`)}
                                    >
                                        {['RETURN_REQUESTED', 'RETURNED', 'REFUNDED'].includes(order.status) ? 'Return Processing' : 'Return Items'}
                                    </button>

                                    <button
                                        className="secondary-btn"
                                        disabled={order.feedbackRating != null || order.status === 'REVIEWED'}
                                        onClick={() => navigate(`/profile/orders/${order.id}/feedback`)}
                                    >
                                        {(order.feedbackRating != null || order.status === 'REVIEWED') ? 'Feedback Submitted' : 'Leave Seller Feedback'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
