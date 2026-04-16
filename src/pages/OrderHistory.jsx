import { useState, useEffect } from 'react';
import { getOrders } from '../Utils/order';
import './Cart.css';
import './OrderHistory.css';

function OrderHistory() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        const data = await getOrders();
        setOrders(data);
    };
    useEffect(() => {
        fetchOrders();
    }, []);

    if (orders?.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <h2 style={{ marginBottom: '2rem' }}>Order History</h2>
                    <div className="empty-cart">
                        <p>You haven't placed any orders yet.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h2 style={{ marginBottom: '2rem' }}>My Orders</h2>
                <div className="orders-list">
                    {orders?.map((order) => (
                        <div key={order.trackingId} className="order-card">
                            <div className="order-header">
                                <span className="order-id">Order #{order.trackingId.slice(-6).toUpperCase()}</span>
                                <div className="order-meta">
                                    <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
                                    <span className="order-status">{order.status}</span>
                                </div>
                            </div>
                            <div className="order-items">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="order-item-row">
                                        <span>{item.product?.name} x {item.quantity}</span>
                                        <span>₦ {(item.product?.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-footer">
                                <span className="order-total">Total Paid: ₦ {order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default OrderHistory;
