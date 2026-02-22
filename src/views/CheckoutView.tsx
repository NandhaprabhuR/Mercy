import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CheckoutView.css';

interface Address {
    id: string;
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
}

export default function CheckoutView() {
    const { user } = useAuth();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [status, setStatus] = useState<string | null>(null);

    // Inline Address Form State
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        street: '',
        city: '',
        state: '',
        zipCode: ''
    });

    // Mock Payment State
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const subtotal = getCartTotal();

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/addresses/${user?.id}`);
                if (res.ok) {
                    const data: Address[] = await res.json();
                    setAddresses(data);

                    // Auto-select the default address
                    const defaultAddress = data.find(a => a.isDefault);
                    if (defaultAddress) {
                        setSelectedAddressId(defaultAddress.id);
                    } else if (data.length > 0) {
                        setSelectedAddressId(data[0].id);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch address book:", err);
            }
        };

        if (user) fetchAddresses();
    }, [user]);

    const handleSaveAddress = async () => {
        if (!newAddress.fullName || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
            setStatus('Please fill out all address fields.');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/addresses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newAddress, userId: user?.id })
            });

            if (res.ok) {
                const createdAddress = await res.json();
                setAddresses(prev => [...prev, createdAddress]);
                setSelectedAddressId(createdAddress.id);
                setIsAddingAddress(false);
                setNewAddress({ fullName: '', street: '', city: '', state: '', zipCode: '' });
                setStatus(null);
            } else {
                setStatus('Failed to save address.');
            }
        } catch (err) {
            console.error(err);
            setStatus('Network error saving address.');
        }
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        // If currently filling out logic, prevent order submission
        if (isAddingAddress) {
            setStatus('Please save your new address before confirming the order.');
            return;
        }

        if (!selectedAddressId) {
            setStatus('Please select a shipping address to continue.');
            return;
        }

        if (cardNumber.replace(/\s/g, '').length < 15 || expiry.length < 5 || cvv.length < 3) {
            setStatus('Please complete the payment details correctly.');
            return;
        }

        setStatus('Authorizing payment...');

        // Artificial delay for UI realism
        await new Promise(resolve => setTimeout(resolve, 1500));

        const selectedAddress = addresses.find(a => a.id === selectedAddressId);
        const formattedAddressString = `${selectedAddress?.fullName}, ${selectedAddress?.street}, ${selectedAddress?.city}, ${selectedAddress?.state} ${selectedAddress?.zipCode}`;

        try {
            const res = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    shippingAddress: formattedAddressString,
                    totalAmount: subtotal,
                    productIdsJson: JSON.stringify(cartItems.map(item => item.id))
                })
            });

            if (res.ok) {
                clearCart();
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
                    <h3>Order Summary ({cartItems.length} items)</h3>
                    <p>Subtotal: ${subtotal.toFixed(2)}</p>
                    <p>Shipping: FREE</p>
                    <hr />
                    <p className="total">Total: ${subtotal.toFixed(2)}</p>
                </div>

                <form onSubmit={handleCheckout} className="checkout-form">
                    <div className="address-selector">
                        <h3>Select a shipping address</h3>

                        {addresses.length === 0 && !isAddingAddress ? (
                            <div className="empty-addresses">
                                <p>You have no saved addresses.</p>
                                <button type="button" className="btn-secondary add-address-btn" onClick={() => setIsAddingAddress(true)}>
                                    Add a new address
                                </button>
                            </div>
                        ) : (
                            <div className="address-list">
                                {addresses.map((addr) => (
                                    <label
                                        key={addr.id}
                                        className={`address-option ${selectedAddressId === addr.id ? 'selected' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="shipping_address"
                                            value={addr.id}
                                            checked={selectedAddressId === addr.id}
                                            onChange={() => setSelectedAddressId(addr.id)}
                                            disabled={isAddingAddress}
                                        />
                                        <div className="address-details">
                                            <strong>{addr.fullName}</strong>
                                            <span>{addr.street}</span>
                                            <span>{addr.city}, {addr.state} {addr.zipCode}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        {addresses.length > 0 && !isAddingAddress && (
                            <div className="address-actions-inline">
                                <button type="button" className="link-btn" onClick={() => setIsAddingAddress(true)}>
                                    + Add New Address
                                </button>
                            </div>
                        )}

                        {isAddingAddress && (
                            <div className="inline-address-form">
                                <h4>New Delivery Address</h4>
                                <div className="form-group">
                                    <label>Recipient Name</label>
                                    <input type="text" value={newAddress.fullName} onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Street Address</label>
                                    <input type="text" value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} required />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input type="text" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} required />
                                    </div>
                                    <div className="form-group small">
                                        <label>State</label>
                                        <input type="text" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} required maxLength={2} placeholder="e.g. CA" />
                                    </div>
                                    <div className="form-group medium">
                                        <label>ZIP</label>
                                        <input type="text" value={newAddress.zipCode} onChange={e => setNewAddress({ ...newAddress, zipCode: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="inline-form-actions">
                                    {addresses.length > 0 && (
                                        <button type="button" className="cancel-btn" onClick={() => setIsAddingAddress(false)}>Cancel</button>
                                    )}
                                    <button type="button" className="btn-primary custom-save-btn" onClick={handleSaveAddress}>Save & Select Address</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="payment-method-section">
                        <h3>Payment Method</h3>
                        <div className="payment-card-grid">
                            <div className="form-group full-width">
                                <label>Card Number</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="0000 0000 0000 0000"
                                    maxLength={19}
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9 ]/g, ''))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Expiry Date</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>CVV</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="123"
                                    maxLength={4}
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="checkout-actions">
                        <button type="button" className="cancel-btn" onClick={() => navigate('/cart')}>Return to Cart</button>
                        <button type="submit" className="confirm-btn" disabled={addresses.length === 0 || !selectedAddressId}>Confirm Order</button>
                    </div>
                    {status && <p className="status-msg">{status}</p>}
                </form>
            </div>
        </div>
    );
}
