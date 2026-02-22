import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './OrdersView.css';

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    productIdsJson: string;
    feedbackRating: number | null;
    feedbackComment: string | null;
}

export default function ReviewsView() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reviewedOrders, setReviewedOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`http://localhost:5001/api/orders/user/${user?.id}`);
                if (res.ok) {
                    const data: Order[] = await res.json();
                    // Filter down to only orders that have feedback
                    const withFeedback = data.filter(o => o.feedbackRating != null);
                    setReviewedOrders(withFeedback);
                }
            } catch (err) {
                console.error("Failed to load reviews:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    if (isLoading) return <div className="loading-state">Loading reviews...</div>;

    return (
        <div className="orders-page-wrapper">
            <div className="orders-header">
                <button className="back-btn" onClick={() => navigate('/profile')}>
                    &larr; Back to Profile
                </button>
                <h2>My Reviews</h2>
            </div>

            <div className="orders-list">
                {reviewedOrders.length === 0 ? (
                    <div className="empty-state">
                        <p>You haven't left any feedback yet.</p>
                        <button className="primary-btn" onClick={() => navigate('/profile/orders')}>View Past Orders</button>
                    </div>
                ) : (
                    reviewedOrders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-card-header">
                                <div className="order-meta">
                                    <div className="meta-item">
                                        <span className="label">ORDER PLACED</span>
                                        <span className="value">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="label">TOTAL</span>
                                        <span className="value">${order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="order-id-block">
                                    <span>ORDER # {order.id.slice(0, 8).toUpperCase()}</span>
                                    <button className="link-btn" onClick={() => navigate(`/profile/orders/${order.id}/invoice`)}>View Invoice</button>
                                </div>
                            </div>
                            <div className="order-card-body" style={{ padding: '2rem' }}>
                                <div className="feedback-stars" style={{ marginBottom: '1rem', color: '#ffb400' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <svg key={star} width="24" height="24" viewBox="0 0 24 24" fill={star <= (order.feedbackRating || 0) ? "currentColor" : "none"} stroke={star <= (order.feedbackRating || 0) ? "none" : "#ccc"}>
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    ))}
                                    <strong style={{ marginLeft: '10px', color: '#333' }}>
                                        {order.feedbackRating}/5 Stars
                                    </strong>
                                </div>
                                <p style={{ fontSize: '1rem', color: '#555', fontStyle: 'italic', lineHeight: '1.5' }}>
                                    "{order.feedbackComment || "No comment provided."}"
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
