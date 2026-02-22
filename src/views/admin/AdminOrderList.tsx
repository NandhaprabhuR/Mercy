import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import './AdminOrderList.css';

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    productIdsJson: string;
    userId: string;
    user?: {
        username: string;
        email: string;
    };
}

const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'REVIEWED', 'RETURN_REQUESTED', 'RETURNED', 'REFUNDED'];

export default function AdminOrderList() {
    const { addToast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (err) {
            console.error("Failed to fetch all orders:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                addToast('Order status updated', 'success');
            } else {
                addToast('Failed to update status', 'error');
            }
        } catch (err) {
            console.error(err);
            addToast('Network error updating status', 'error');
        }
    };

    if (isLoading) return <div className="loading-state">Loading global orders...</div>;

    return (
        <div className="admin-order-list">
            <h2>Manage Customer Orders</h2>
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center' }}>No orders found.</td></tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order.id}>
                                    <td className="mono">{order.id.slice(0, 8)}...</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div>{order.user?.username || order.userId}</div>
                                        <div className="sub-text">{order.user?.email}</div>
                                    </td>
                                    <td>{JSON.parse(order.productIdsJson).length}</td>
                                    <td>${order.totalAmount.toFixed(2)}</td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`status-select ${order.status.toLowerCase()}`}
                                        >
                                            {ORDER_STATUSES.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
