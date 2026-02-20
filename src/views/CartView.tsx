import { Link } from 'react-router-dom';
import './CartView.css';

export default function CartView() {
    // In a real app, this would be fueled by Context or Redux
    // We'll mock a realistic cart state for the prototype
    const cartItems = [
        {
            id: 'prod-1',
            name: 'PEAK Performance Tee',
            price: 35.99,
            quantity: 2,
            imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800'
        },
        {
            id: 'prod-2',
            name: 'PEAK Pro Dumbbells (Pair)',
            price: 120.00,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=800'
        }
    ];

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="cart-page">
            <h2>Shopping Cart</h2>

            {cartItems.length > 0 ? (
                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.imageUrl} alt={item.name} />
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p className="item-price">${item.price.toFixed(2)}</p>
                                    <div className="item-actions">
                                        <select defaultValue={item.quantity}>
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <option key={num} value={num}>Qty: {num}</option>
                                            ))}
                                        </select>
                                        <button className="delete-btn">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Subtotal ({cartItems.length} items): ${subtotal.toFixed(2)}</h3>
                        <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
                    </div>
                </div>
            ) : (
                <div className="empty-cart">
                    <p>Your PEAK Cart is empty.</p>
                    <Link to="/" className="continue-shopping">Continue Shopping</Link>
                </div>
            )}
        </div>
    );
}
