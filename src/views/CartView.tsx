import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartView.css';

export default function CartView() {
    const { cartItems, getCartTotal, updateQuantity, removeFromCart } = useCart();
    const subtotal = getCartTotal();
    const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string } | null>(null);

    const handleDeleteClick = (id: string, name: string) => {
        setItemToDelete({ id, name });
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            removeFromCart(itemToDelete.id);
            setItemToDelete(null);
        }
    };

    const cancelDelete = () => {
        setItemToDelete(null);
    };

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
                                        <div className="qty-wrapper">
                                            <label htmlFor={`qty-${item.id}`}>Qty:</label>
                                            <input
                                                id={`qty-${item.id}`}
                                                type="number"
                                                min="1"
                                                className="quantity-input"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                            />
                                        </div>
                                        <button className="delete-btn" onClick={() => handleDeleteClick(item.id, item.name)}>Delete</button>
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
                    <p>Your NexCart Cart is empty.</p>
                    <Link to="/" className="continue-shopping">Continue Shopping</Link>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {itemToDelete && (
                <div className="cart-modal-overlay" onClick={cancelDelete}>
                    <div className="cart-modal" onClick={e => e.stopPropagation()}>
                        <h3>Remove Item</h3>
                        <p>Are you sure you want to remove <strong>{itemToDelete.name}</strong> from your cart?</p>
                        <div className="cart-modal-actions">
                            <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
                            <button className="confirm-btn" onClick={confirmDelete}>Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
