import { API_BASE_URL } from '../config/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AddressBookView.css';

interface Address {
    id: string;
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
}

export default function AddressBookView() {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [fullName, setFullName] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    const fetchAddresses = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/addresses/${user?.id}`);
            if (response.ok) {
                const data = await response.json();
                setAddresses(data);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchAddresses();
        }
    }, [user]);

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/addresses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    fullName,
                    street,
                    city,
                    state,
                    zipCode,
                    country: 'US', // Fixed for prototype
                    isDefault
                })
            });

            if (response.ok) {
                setIsAdding(false);
                resetForm();
                fetchAddresses(); // Refresh list to get new DB assigned defaults
            }
        } catch (error) {
            console.error("Failed to add address:", error);
        }
    };

    const handleSetDefault = async (addressId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/addresses/${addressId}/default`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id })
            });
            if (response.ok) fetchAddresses();
        } catch (error) {
            console.error("Failed to set default:", error);
        }
    };

    const handleDelete = async (addressId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/addresses/${addressId}`, {
                method: 'DELETE'
            });
            if (response.ok) fetchAddresses();
        } catch (error) {
            console.error("Failed to delete address:", error);
        }
    };

    const resetForm = () => {
        setFullName('');
        setStreet('');
        setCity('');
        setState('');
        setZipCode('');
        setIsDefault(false);
    };

    return (
        <div className="address-book-view fade-in">
            <div className="address-book-header">
                <h2>Your Addresses</h2>
                {!isAdding && (
                    <button className="btn-primary" onClick={() => setIsAdding(true)}>
                        Add New Address
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="address-form-container">
                    <h3>Add a new address</h3>
                    <form onSubmit={handleAddAddress} className="address-form">
                        <div className="form-group">
                            <label>Full name (First and Last name)</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Street address</label>
                            <input
                                type="text"
                                placeholder="Street address, P.O. box, company name, c/o"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group half">
                                <label>City</label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group half">
                                <label>State</label>
                                <input
                                    type="text"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group half">
                                <label>ZIP Code</label>
                                <input
                                    type="text"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-checkbox">
                            <input
                                type="checkbox"
                                id="isDefaultCheck"
                                checked={isDefault}
                                onChange={(e) => setIsDefault(e.target.checked)}
                            />
                            <label htmlFor="isDefaultCheck">Make this my default address</label>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">Add address</button>
                            <button type="button" className="btn-secondary" onClick={() => { setIsAdding(false); resetForm(); }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {!isAdding && (
                <div className="addresses-grid">
                    {addresses.length === 0 ? (
                        <div className="empty-state">
                            <p>You have no saved addresses.</p>
                        </div>
                    ) : (
                        addresses.map((address) => (
                            <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                                {address.isDefault && <div className="default-badge">Default</div>}
                                <h4>{address.fullName}</h4>
                                <p>{address.street}</p>
                                <p>{address.city}, {address.state} {address.zipCode}</p>
                                <p>{address.country}</p>

                                <div className="address-actions">
                                    {!address.isDefault && (
                                        <button className="link-btn" onClick={() => handleSetDefault(address.id)}>Set as Default</button>
                                    )}
                                    <button className="link-btn danger" onClick={() => handleDelete(address.id)}>Remove</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
