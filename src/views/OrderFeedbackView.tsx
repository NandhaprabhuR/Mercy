import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import './ActionModalViews.css';

export default function OrderFeedbackView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comments, setComments] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return addToast("Please select a star rating", "error");

        setIsSubmitting(true);
        try {
            const res = await fetch(`http://localhost:5001/api/orders/${id}/feedback`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, comments })
            });

            if (res.ok) {
                addToast(`Thanks for your ${rating}-star feedback!`, "success");
                navigate('/profile/orders');
            } else {
                throw new Error("Failed to submit feedback.");
            }
        } catch (err) {
            console.error(err);
            addToast("An error occurred while submitting your feedback.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="action-view-container">
            <div className="action-card-view">
                <button className="back-btn" onClick={() => navigate('/profile/orders')}>&larr; Back</button>
                <h2>Leave Seller Feedback</h2>
                <p className="subtitle">Order #{id?.slice(0, 8).toUpperCase()}</p>

                <form onSubmit={handleSubmit} className="action-form">
                    <div className="form-group feedback-stars">
                        <label>How was your experience?</label>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    className={`star-btn ${star <= (hover || rating) ? 'active' : ''}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(rating)}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                        <div className="rating-text">
                            {rating === 1 && "Terrible"}
                            {rating === 2 && "Poor"}
                            {rating === 3 && "Average"}
                            {rating === 4 && "Good"}
                            {rating === 5 && "Excellent"}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Review details</label>
                        <textarea
                            rows={5}
                            placeholder="Tell us more about your experience with this seller and delivery..."
                            value={comments}
                            onChange={e => setComments(e.target.value)}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn-primary full-width" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
}
