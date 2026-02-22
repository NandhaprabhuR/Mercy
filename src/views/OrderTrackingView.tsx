import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './OrderTrackingView.css';

// Declare google on window for TypeScript
declare global {
    interface Window {
        initMap: () => void;
        google: any;
    }
}

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    shippingAddress: string;
}

const TRACKING_STEPS = [
    { key: 'PENDING', label: 'Order Placed', desc: 'We have received your order.' },
    { key: 'PROCESSING', label: 'Processing', desc: 'Your items are being packed.' },
    { key: 'SHIPPED', label: 'Shipped', desc: 'Your order has left our facility.' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Your package is arriving today.' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Your package has been delivered.' },
    { key: 'REVIEWED', label: 'Reviewed', desc: 'You have left seller feedback.' },
    { key: 'RETURNED', label: 'Returned', desc: 'Items have been returned to facility.' },
    { key: 'REFUNDED', label: 'Refunded', desc: 'Refund has been issued.' }
];

export default function OrderTrackingView() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // For a real app, you'd want an endpoint that fetches a single order by ID.
                // We will reuse the `getUserOrders` and filter it locally since this is a mock.
                const res = await fetch(`${API_BASE_URL}/api/orders/user/${user?.id}`);
                if (res.ok) {
                    const data: Order[] = await res.json();
                    const foundOrder = data.find(o => o.id === id);
                    if (foundOrder) {
                        setOrder(foundOrder);
                    } else {
                        throw new Error("Order not found");
                    }
                }
            } catch (err) {
                console.error("Failed to fetch order details:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (user && id) {
            fetchOrderDetails();
        }
    }, [user, id]);

    // Initialize map once order is loaded
    useEffect(() => {
        if (!isLoading && order) {
            // Function to run when the Maps script calls back, OR immediately if already loaded
            window.initMap = () => {
                const mapEl = document.getElementById('map');
                if (mapEl && window.google) {
                    // Mock coordinates (e.g. SF)
                    const location = { lat: 37.7749, lng: -122.4194 };
                    const map = new window.google.maps.Map(mapEl, {
                        zoom: 12,
                        center: location,
                        disableDefaultUI: true,
                        styles: [
                            // Subtle styling for modern look
                            { featureType: "all", elementType: "geometry.fill", stylers: [{ weight: "2.00" }] },
                            { featureType: "all", elementType: "geometry.stroke", stylers: [{ color: "#9c9c9c" }] },
                            { featureType: "all", elementType: "labels.text", stylers: [{ visibility: "on" }] },
                            { featureType: "landscape", elementType: "all", stylers: [{ color: "#f2f2f2" }] },
                            { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }] },
                            { featureType: "landscape.man_made", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }] },
                            { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
                            { featureType: "road", elementType: "all", stylers: [{ saturation: -100 }, { lightness: 45 }] },
                            { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#eeeeee" }] },
                            { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#7b7b7b" }] },
                            { featureType: "road", elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
                            { featureType: "road.highway", elementType: "all", stylers: [{ visibility: "simplified" }] },
                            { featureType: "road.arterial", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
                            { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] },
                            { featureType: "water", elementType: "all", stylers: [{ color: "#46bcec" }, { visibility: "on" }] },
                            { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#c8d7d4" }] },
                            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#070707" }] },
                            { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] }
                        ]
                    });

                    // Add a marker at the center
                    new window.google.maps.Marker({
                        position: location,
                        map: map,
                        title: "Delivery Location",
                        icon: {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: '#00cc66',
                            fillOpacity: 1,
                            strokeColor: '#ffffff',
                            strokeWeight: 2,
                        }
                    });
                }
            };

            // If google maps is already loaded, init right away
            if (window.google && window.google.maps) {
                window.initMap();
            }
        }
    }, [isLoading, order]);

    if (isLoading) return <div className="loading-state">Loading tracking info...</div>;
    if (!order) return <div className="empty-state">Order not found.</div>;

    // Determine the current step index
    const currentStepIndex = TRACKING_STEPS.findIndex(s => s.key === order.status);

    return (
        <div className="tracking-page">
            <div className="tracking-header">
                <button className="back-btn" onClick={() => navigate('/profile/orders')}>
                    &larr; Back to Orders
                </button>
                <h2>Track Your Package</h2>
                <p>Order #{order.id.slice(0, 8).toUpperCase()}</p>
            </div>

            <div className="tracking-content">
                {/* Visual Timeline component */}
                <div className="timeline-container">
                    <h3>Delivery Status</h3>
                    <div className="timeline">
                        {TRACKING_STEPS.map((step, index) => {
                            let stepClass = "timeline-step";

                            if (['RETURN_REQUESTED', 'RETURNED', 'REFUNDED'].includes(order.status)) {
                                // Special case visual
                                stepClass += " error";
                            } else if (order.status === 'REVIEWED') {
                                stepClass += " completed";
                            } else if (index < currentStepIndex) {
                                stepClass += " completed";
                            } else if (index === currentStepIndex) {
                                stepClass += " active";
                            }

                            return (
                                <div key={step.key} className={stepClass}>
                                    <div className="step-indicator">
                                        <div className="step-dot"></div>
                                        {index < TRACKING_STEPS.length - 1 && <div className="step-line"></div>}
                                    </div>
                                    <div className="step-content">
                                        <h4>{step.label}</h4>
                                        <p>{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {order.status === 'RETURN_REQUESTED' && (
                        <div className="return-alert">
                            <strong>Return Requested:</strong> You have requested to return this item. We will contact you shortly with the shipping label. Refund will be processed within 24 hours after we receive the item.
                        </div>
                    )}
                    {order.status === 'RETURNED' && (
                        <div className="return-alert" style={{ backgroundColor: 'rgba(23, 162, 184, 0.1)', color: '#17a2b8', borderLeftColor: '#17a2b8' }}>
                            <strong>Item Returned:</strong> We have received your returned item. Your refund will be processed and issued within 24 hours.
                        </div>
                    )}
                    {order.status === 'REFUNDED' && (
                        <div className="return-alert" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', color: '#28a745', borderLeftColor: '#28a745' }}>
                            <strong>Refund Processed:</strong> Your refund has been successfully issued to your original payment method.
                        </div>
                    )}
                    <div className="shipping-info">
                        <h4>Shipping To:</h4>
                        <p>{order.shippingAddress}</p>
                    </div>
                </div>

                <div className="map-placeholder" style={{ padding: 0, overflow: 'hidden' }}>
                    <div id="map" style={{ width: '100%', height: '100%', minHeight: '400px' }}></div>
                </div>
            </div>
        </div>
    );
}
