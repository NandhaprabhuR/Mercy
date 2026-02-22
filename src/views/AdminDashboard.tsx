import { API_BASE_URL } from '../config/api';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: ''
    });
    const [status, setStatus] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        const uploadData = new FormData();
        uploadData.append('image', file);

        setIsUploading(true);
        setStatus('Uploading image...');
        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: uploadData
            });
            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
                setStatus('Image uploaded! Ready to submit.');
            } else {
                setStatus('Failed to upload image.');
            }
        } catch (err) {
            console.error(err);
            setStatus('Network error during upload.');
        } finally {
            setIsUploading(false);
        }
    };

    if (user?.role !== 'ADMIN') {
        return <div className="admin-error">Access Denied. Admin Privileges Required.</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Submitting...');

        try {
            const res = await fetch(`${API_BASE_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('Product added successfully!');
                setFormData({ name: '', description: '', price: '', imageUrl: '', category: '' });
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
                        placeholder="e.g. NexCart Running Shoes"
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
                    <label>Product Image</label>
                    {formData.imageUrl && (
                        <div style={{ marginBottom: '1rem' }}>
                            <img src={formData.imageUrl} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        style={{ width: '100%', padding: '0.5rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--border-radius-sm)', background: 'var(--bg-body)' }}
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-body)' }}
                    >
                        <option value="">Select a Category</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Meat">Meat</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Eggs">Eggs</option>
                        <option value="Oils">Oils</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Beverages">Beverages</option>
                    </select>
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
            </form >
        </div >
    );
}
