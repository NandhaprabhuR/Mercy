import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CheckoutView.css';

export default function CheckoutView() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState<string | null>(null);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Processing...');

        try {
            const res = await fetch('http://localhost:5001/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    shippingAddress: address,
                    totalAmount: 155.99, // Simulated cart total
                    productIdsJson: '["prod-1", "prod-2"]' // Simulated cart items
                })
            });

            if (res.ok) {
                setStatus('Order Placed Successfully! Returning to store...');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setStatus('Order failed.');
            }
        } catch (err) {
            console.error(err);
            setStatus('Network Error.');
        }
    };

    return (
        <div className="checkout-page">
            <div className="checkout-content">
                <h2>Secure Checkout</h2>

                <div className="checkout-summary">
                    <h3>Order Summary</h3>
                    <p>Subtotal: $155.99</p>
                    <p>Shipping: FREE</p>
                    <hr />
                    <p className="total">Total: $155.99</p>
                </div>

                <form onSubmit={handleCheckout} className="checkout-form">
                    <div className="form-group">
                        <label>Shipping Address</label>
                        <textarea
                            required
                            rows={3}
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="123 React Street, City, Country..."
                        />
                    </div>

                    <div className="checkout-actions">
                        <button type="button" className="cancel-btn" onClick={() => navigate('/cart')}>Return to Cart</button>
                        <button type="submit" className="confirm-btn">Confirm Order</button>
                    </div>
                    {status && <p className="status-msg">{status}</p>}
                </form>
            </div>
        </div>
    );
}
