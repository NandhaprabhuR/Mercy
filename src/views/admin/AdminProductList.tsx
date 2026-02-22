import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import type { Product } from '../../models/Product';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import './AdminProductList.css';

export default function AdminProductList() {
    const { addToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [vegFilter, setVegFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [categories, setCategories] = useState<string[]>([]);

    // Edit Modal State
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Form State for editing
    const [editForm, setEditForm] = useState({
        name: '', price: '', category: '', isVeg: false
    });

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/products`)
            .then(res => res.json())
            .then((data: Product[]) => {
                setProducts(data);
                const uniqueCategoriesStr = Array.from(new Set(data.map(p => p.category).filter(Boolean))) as string[];
                setCategories(uniqueCategoriesStr.sort());
            })
            .catch(err => console.error(err));
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = selectedCategory === '' || p.category === selectedCategory;
        const matchesMin = minPrice === '' || p.price >= parseFloat(minPrice);
        const matchesMax = maxPrice === '' || p.price <= parseFloat(maxPrice);

        let matchesVeg = true;
        if (vegFilter === 'VEG') matchesVeg = p.isVeg === true;
        if (vegFilter === 'NON_VEG') matchesVeg = p.isVeg === false;

        return matchesSearch && matchesCat && matchesMin && matchesMax && matchesVeg;
    });

    return (
        <div className="admin-products">
            <div className="admin-header-actions">
                <h2>Product Catalog</h2>
                <Link to="/admin/products/add" className="add-new-btn">+ Add Product</Link>
            </div>

            <div className="admin-filter-bar">
                <input type="text" placeholder="Search by name or desc..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="admin-search-input" />

                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <select value={vegFilter} onChange={e => setVegFilter(e.target.value as any)}>
                    <option value="ALL">All Dietary</option>
                    <option value="VEG">Veg / Vegan</option>
                    <option value="NON_VEG">Non-Veg</option>
                </select>

                <div className="admin-price-filter">
                    <input type="number" placeholder="Min $" value={minPrice} onChange={e => setMinPrice(e.target.value)} min="0" />
                    <input type="number" placeholder="Max $" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min="0" />
                </div>

                <button className="clear-filters-btn" onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setVegFilter('ALL');
                    setMinPrice('');
                    setMaxPrice('');
                }}>Clear</button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Diet</th>
                            <th>Price</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(p => (
                            <tr key={p.id}>
                                <td>
                                    <img src={p.imageUrl} alt={p.name} className="table-img" />
                                </td>
                                <td className="font-medium">{p.name}</td>
                                <td>{p.category || '-'}</td>
                                <td>{p.isVeg === true ? 'Veg' : p.isVeg === false ? 'Non-Veg' : '-'}</td>
                                <td>${p.price.toFixed(2)}</td>
                                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="action-btn edit"
                                        onClick={() => {
                                            setEditingProduct(p);
                                            setEditForm({
                                                name: p.name,
                                                price: p.price.toString(),
                                                category: p.category || '',
                                                isVeg: p.isVeg || false
                                            });
                                            setShowDeleteConfirm(false);
                                        }}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingProduct && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>Edit Product: {editingProduct.name}</h3>

                        <div className="admin-form" style={{ marginTop: '1rem' }}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Price ($)</label>
                                <input
                                    type="number"
                                    value={editForm.price}
                                    onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                                />
                            </div>

                            <div className="admin-modal-actions" style={{ marginBottom: '2rem' }}>
                                <button className="cancel-btn" onClick={() => setEditingProduct(null)}>Cancel</button>
                                <button className="confirm-btn" style={{ backgroundColor: 'var(--neon-green)', color: 'var(--bg-darker-green)', border: 'none' }} onClick={async () => {
                                    try {
                                        const res = await fetch(`${API_BASE_URL}/api/products/${editingProduct.id}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(editForm)
                                        });
                                        if (res.ok) {
                                            const updated = await res.json();
                                            setProducts(products.map(p => p.id === updated.id ? updated : p));
                                            setEditingProduct(null);
                                            addToast('Product updated successfully', 'success');
                                        } else {
                                            addToast('Failed to update product', 'error');
                                        }
                                    } catch (err) {
                                        console.error('Error updating product', err);
                                        addToast('Network error while updating product', 'error');
                                    }
                                }}>Save Changes</button>
                            </div>

                            <div className="admin-edit-mode">
                                {!showDeleteConfirm ? (
                                    <button className="delete-btn" onClick={() => setShowDeleteConfirm(true)} style={{ width: '100%' }}>Delete Product</button>
                                ) : (
                                    <div className="ban-confirmation" style={{ background: '#fff8f8', padding: '1rem', border: '1px solid #ffcccc', borderRadius: '4px' }}>
                                        <p style={{ color: '#c0392b', marginBottom: '1rem', fontWeight: 600 }}>Are you absolutely sure you want to delete this product? This action cannot be undone.</p>
                                        <div className="admin-modal-actions" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
                                            <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                                            <button className="confirm-btn" style={{ backgroundColor: '#d9534f', color: '#fff' }} onClick={async () => {
                                                try {
                                                    const res = await fetch(`${API_BASE_URL}/api/products/${editingProduct.id}`, {
                                                        method: 'DELETE'
                                                    });
                                                    if (res.ok) {
                                                        setProducts(products.filter(p => p.id !== editingProduct.id));
                                                        setEditingProduct(null);
                                                        setShowDeleteConfirm(false);
                                                        addToast('Product deleted successfully', 'success');
                                                    } else {
                                                        addToast('Failed to delete product', 'error');
                                                    }
                                                } catch (err) {
                                                    console.error('Error deleting product', err);
                                                    addToast('Network error while deleting product', 'error');
                                                }
                                            }}>Yes, Delete Product</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
