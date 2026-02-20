import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: ''
    });
    const [status, setStatus] = useState<string | null>(null);

    if (user?.role !== 'ADMIN') {
        return <div className="admin-error">Access Denied. Admin Privileges Required.</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Submitting...');

        try {
            const res = await fetch('http://localhost:5001/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('Product added successfully!');
                setFormData({ name: '', description: '', price: '', imageUrl: '' });
            } else {
                setStatus('Failed to add product.');
            }
        } catch (err) {
            console.error(err);
            setStatus('Error adding product.');
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard: Add New Product</h2>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label>Product Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. PEAK Running Shoes"
                    />
                </div>

                <div className="form-group">
                    <label>Price ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        placeholder="99.99"
                    />
                </div>

                <div className="form-group">
                    <label>Image URL</label>
                    <input
                        type="url"
                        required
                        value={formData.imageUrl}
                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        required
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed product description..."
                    />
                </div>

                <button type="submit" className="submit-btn solid">Add Product</button>
                {status && <p className="status-msg">{status}</p>}
            </form>
        </div>
    );
}
