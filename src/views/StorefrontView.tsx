import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import type { Product } from '../models/Product';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './StorefrontView.css';

export default function StorefrontView() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    // Extracted categories
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/products`)
            .then(res => res.json())
            .then((data: Product[]) => {
                setProducts(data);

                // Extract unique categories
                const uniqueCategoriesStr = Array.from(new Set(data.map(p => p.category).filter(Boolean))) as string[];
                setCategories(uniqueCategoriesStr.sort());

                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch products', err);
                setLoading(false);
            });
    }, []);

    const handleAddToCart = (product: Product) => {
        if (user && user.role === 'ADMIN') {
            addToast("Admins cannot add items to cart.", "error");
            return;
        }
        addToCart(product);
        addToast(`Added ${product.name} to cart!`, "success");
    }

    if (loading) {
        return <div className="loading-state">Loading Storefront...</div>;
    }

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === '' || p.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="storefront-layout">
            <div className="storefront-filters">
                <div className="filter-group">
                    <label>Category</label>
                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <button
                    className="secondary-btn clear-btn"
                    onClick={() => setSelectedCategory('')}
                >
                    Clear Categories
                </button>
            </div>

            <main className="storefront-container">
                <div className="store-banner">
                    {searchQuery ? (
                        <h2>Search results for "{searchQuery}"</h2>
                    ) : (
                        <h2>Recommended for you</h2>
                    )}
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
                        <p>No products found matching your search and active filters.</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="product-card">
                                <Link to={`/products/${product.id}`} className="product-image-link" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                    <div className="product-image-wrapper">
                                        <img src={product.imageUrl} alt={product.name} />
                                        {/* Optional badges */}
                                        <div className="product-badges">
                                            {product.isVeg && <span className="badge veg-badge">Veg</span>}
                                            {!product.isVeg && <span className="badge non-veg-badge">Non-Veg</span>}
                                        </div>
                                    </div>
                                    <div className="product-info">
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-desc">{product.description}</p>
                                        <div className="product-price">${product.price.toFixed(2)}</div>
                                    </div>
                                </Link>
                                {(!user || user.role !== 'ADMIN') && (
                                    <div className="product-action-footer" style={{ padding: '0 1.25rem 1.25rem' }}>
                                        <button
                                            className="add-to-cart-btn"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
