import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import type { Product } from '../models/Product';
import './ProductDetailView.css';

export default function ProductDetailView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { addToast } = useToast();

    const [product, setProduct] = useState<Product | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/api/products`);
                if (res.ok) {
                    const data: Product[] = await res.json();
                    setAllProducts(data);

                    const found = data.find(p => p.id === id);
                    if (found) {
                        setProduct(found);
                    } else {
                        // Not found
                        setProduct(null);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;

        if (user && user.role === 'ADMIN') {
            addToast("Admins cannot add items to cart.", "error");
            return;
        }

        addToCart(product);
        addToast(`Added ${product.name} to cart!`, "success");
    };

    if (isLoading) return <div className="loading-state">Loading product details...</div>;
    if (!product) return <div className="empty-state">Product not found. <button onClick={() => navigate('/')} className="primary-btn" style={{ marginTop: '1rem' }}>Go Home</button></div>;

    // Get 4 random / other products for the related section
    const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);

    return (
        <div className="product-detail-page slide-in">
            <button className="back-btn" onClick={() => navigate('/')} style={{ marginBottom: '2rem' }}>
                &larr; Back to Shop
            </button>

            <div className="product-detail-main">
                <div className="product-image-container">
                    <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="product-info-container">
                    <h1>{product.name}</h1>
                    <div className="price">${product.price.toFixed(2)}</div>
                    <p className="description">{product.description}</p>
                    {(!user || user.role !== 'ADMIN') && (
                        <button className="primary-btn add-to-cart-btn" onClick={handleAddToCart}>
                            Add to Cart &rarr;
                        </button>
                    )}
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <h2>You might also like</h2>
                    <div className="related-grid">
                        {relatedProducts.map(rp => (
                            <Link to={`/products/${rp.id}`} key={rp.id} className="related-card">
                                <img src={rp.imageUrl} alt={rp.name} />
                                <div className="related-card-info">
                                    <h3>{rp.name}</h3>
                                    <p>${rp.price.toFixed(2)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
