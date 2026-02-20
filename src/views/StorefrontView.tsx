import { useState, useEffect } from 'react';
import type { Product } from '../models/Product';
import { useAuth } from '../context/AuthContext';
import './StorefrontView.css';

export default function StorefrontView() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

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
        if (!user) {
            alert("Please login as a Consumer to add items to cart!");
            return;
        }
        alert(`Added ${product.name} to cart!`);
        // Ideally this dispatches to a cart context
    }

    if (loading) {
        return <div className="loading-state">Loading Storefront...</div>;
    }

    return (
        <div className="storefront-container">
            <div className="store-banner">
                <h2>Recommended for you</h2>
            </div>

            <div className="product-grid">
                {products.map(product => (
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
        </div>
    );
}
