import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../models/Product';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './StorefrontView.css';

export default function StorefrontView() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        fetch('http://localhost:5001/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch products', err);
                setLoading(false);
            });
    }, []);

    const handleAddToCart = (product: Product) => {
        if (user && user.role === 'ADMIN') {
            alert("Admins cannot add items to cart.");
            return;
        }
        addToCart(product);
        alert(`Added ${product.name} to cart!`);
    }

    if (loading) {
        return <div className="loading-state">Loading Storefront...</div>;
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="storefront-container">
            <div className="store-banner">
                {searchQuery ? (
                    <h2>Search results for "{searchQuery}"</h2>
                ) : (
                    <h2>Recommended for you</h2>
                )}
            </div>

            {filteredProducts.length === 0 ? (
                <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p>No products found matching your search.</p>
                </div>
            ) : (
                <div className="product-grid">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-wrapper">
                                <img src={product.imageUrl} alt={product.name} />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-desc">{product.description}</p>
                                <div className="product-price">${product.price.toFixed(2)}</div>
                                <button
                                    className="add-to-cart-btn"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
