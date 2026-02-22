import { API_BASE_URL } from '../config/api';
import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import './ActionModalViews.css';

export default function OrderReturnView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const orderId = id || new URLSearchParams(location.search).get('orderId');
    if (!orderId) {
        console.error("No order ID provided.");
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) return addToast("Please select a reason", "error");

        setIsSubmitting(true);
        try {
            // Update status to RETURN_REQUESTED
            const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'RETURN_REQUESTED' })
            });

            if (res.ok) {
                addToast("Return request submitted successfully. We will email you a shipping label.", "success");
                navigate('/profile/orders');
            } else {
                throw new Error("Failed to process return.");
            }
        } catch (err) {
            console.error(err);
            addToast("An error occurred while submitting your return.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="action-view-container">
            <div className="action-card-view">
                <button className="back-btn" onClick={() => navigate('/profile/orders')}>&larr; Back</button>
                <h2>Return Items</h2>
                <p className="subtitle">Order #{orderId?.slice(0, 8).toUpperCase()}</p>

                <form onSubmit={handleSubmit} className="action-form">
                    <div className="form-group">
                        <label>Why are you returning this?</label>
                        <select value={reason} onChange={e => setReason(e.target.value)} required>
                            <option value="">Choose a reason...</option>
                            <option value="wrong_item">Sent the wrong item</option>
                            <option value="defective">Item defective or doesn't work</option>
                            <option value="no_longer_needed">No longer needed</option>
                            <option value="arrived_late">Arrived too late</option>
                            <option value="description_mismatch">Item doesn't match description</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Additional Comments (Optional)</label>
                        <textarea rows={4} placeholder="Please provide more details..."></textarea>
                    </div>

                    <button type="submit" className="btn-primary full-width" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
                    </button>
                </form>
            </div>
        </div>
    );
}
