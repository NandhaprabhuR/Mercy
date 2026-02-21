import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartView.css';

export default function CartView() {
    const { cartItems, getCartTotal, updateQuantity, removeFromCart } = useCart();
    const subtotal = getCartTotal();

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
                                        <select
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                <option key={num} value={num}>Qty: {num}</option>
                                            ))}
                                        </select>
                                        <button className="delete-btn" onClick={() => removeFromCart(item.id)}>Delete</button>
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
