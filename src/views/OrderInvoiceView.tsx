import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../models/Product';
import './OrderInvoiceView.css';

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    shippingAddress: string;
    productIdsJson: string;
    userId: string;
}

export default function OrderInvoiceView() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrderAndProducts = async () => {
            try {
                // 1. Fetch Order
                // If the user isn't logged in properly or we don't have their ID, we could fail.
                // In a real app with proper auth tokens, we'd just hit GET /orders/:id directly.
                const orderRes = await fetch(`${API_BASE_URL}/api/orders/user/${user?.id}`);
                const productsRes = await fetch(`${API_BASE_URL}/api/products`);

                if (orderRes.ok && productsRes.ok) {
                    const allOrders: Order[] = await orderRes.json();
                    const allProducts: Product[] = await productsRes.json();

                    const foundOrder = allOrders.find(o => o.id === id);
                    if (foundOrder) {
                        setOrder(foundOrder);
                        setProducts(allProducts);
                    } else {
                        throw new Error('Order not found');
                    }
                }
            } catch (err) {
                console.error("Failed to load invoice data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (user && id) {
            fetchOrderAndProducts();
        }
    }, [user, id]);

    const handleDownloadPDF = () => {
        // Temporarily change document title to name the saved PDF
        if (order) {
            const originalTitle = document.title;
            document.title = `NexCart_Invoice_${order.id.slice(0, 8).toUpperCase()}`;
            window.print();
            // Restore title after print dialog closes
            setTimeout(() => {
                document.title = originalTitle;
            }, 1000);
        }
    };

    if (isLoading) return <div className="loading-state">Generating Invoice...</div>;
    if (!order) return <div className="empty-state">Invoice not found.</div>;

    // Map the product IDs saved in the order to actual Product objects for the table
    let orderItems: Product[] = [];
    try {
        const productIds: string[] = JSON.parse(order.productIdsJson);
        orderItems = productIds.map(pid => products.find(p => p.id === pid)).filter(Boolean) as Product[];
    } catch (e) {
        console.error("Error parsing product IDs", e);
    }

    return (
        <div className="invoice-page-wrapper">
            {/* The Print Controls - Hidden during actual printing */}
            <div className="invoice-controls no-print">
                <button className="back-btn" onClick={() => navigate('/profile/orders')}>
                    &larr; Back to Orders
                </button>
                <button className="primary-btn" onClick={handleDownloadPDF}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download / Print PDF
                </button>
            </div>

            {/* The A4 Invoice Sheet */}
            <div className="invoice-sheet" id="invoiceArea">
                <div className="invoice-header">
                    <div className="branding-col">
                        <h1 className="brand-font">NexCart</h1>
                        <p className="tagline">Premium E-Commerce Store</p>
                        <div className="store-address">
                            123 Commerce Blvd.<br />
                            Suite 400<br />
                            San Francisco, CA 94105
                        </div>
                    </div>
                    <div className="meta-col">
                        <h2>INVOICE</h2>
                        <table className="meta-table">
                            <tbody>
                                <tr>
                                    <td>Invoice #:</td>
                                    <td>{order.id.split('-')[0].toUpperCase()}</td>
                                </tr>
                                <tr>
                                    <td>Date:</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td>Order ID:</td>
                                    <td>{order.id.split('-')[1].toUpperCase()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="invoice-body">
                    <div className="bill-to-section">
                        <h3>Bill To:</h3>
                        <p className="customer-name">{user?.username}</p>
                        <p className="customer-email">{user?.username}@example.com</p>
                        <p className="customer-address">{order.shippingAddress}</p>
                    </div>

                    <table className="invoice-items-table">
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>Item</th>
                                <th>Description</th>
                                <th style={{ textAlign: 'center' }}>Qty</th>
                                <th style={{ textAlign: 'right' }}>Price</th>
                                <th style={{ textAlign: 'right' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="item-image-col">
                                        <img src={item.imageUrl} alt={item.name} className="invoice-item-img" />
                                    </td>
                                    <td className="item-desc-col">
                                        <strong>{item.name}</strong>
                                        <div className="item-short-desc">{item.description.slice(0, 50)}...</div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>1</td>
                                    <td style={{ textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="invoice-totals">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Subtotal:</td>
                                    <td>${order.totalAmount.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Tax (0%):</td>
                                    <td>$0.00</td>
                                </tr>
                                {['RETURNED', 'REFUNDED'].includes(order.status) && (
                                    <tr style={{ color: '#d9534f' }}>
                                        <td>Refund Processed:</td>
                                        <td>-${order.totalAmount.toFixed(2)}</td>
                                    </tr>
                                )}
                                <tr className="grand-total">
                                    <td>Total Due:</td>
                                    <td>${['RETURNED', 'REFUNDED'].includes(order.status) ? '0.00' : order.totalAmount.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="invoice-footer">
                    <p>Thank you for your business!</p>
                    <p className="small-text">If you have any questions concerning this invoice, contact support@nexcart.com</p>
                </div>
            </div>
        </div>
    );
}
