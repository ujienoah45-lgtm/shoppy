import { useNavigate } from 'react-router-dom';
import './Checkout.css';

function OrderConfirmation({ order }) {
    const navigate = useNavigate();
    if (!order) {
        return (
            <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
                <h2>No order found.</h2>
                <button onClick={() => navigate('/')} className="checkout-btn">Go to Home</button>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <div className="order-success" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '20px' }}>✅</div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Order Confirmed!</h2>
                    <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
                        Thank you for your purchase, {order.customerName}. Your order ID is <strong>#{order.trackingId.slice(-8).toUpperCase()}</strong>.
                    </p>

                    <div className="order-summary" style={{ maxWidth: '600px', margin: '0 auto 40px', textAlign: 'left', background: '#f9f9f9', padding: '30px', borderRadius: '12px' }}>
                        <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>Order Detail Summary</h3>
                        {order?.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                                <span>{item.product?.name} x {item?.quantity}</span>
                                <span>₦ {(item.product?.price * item?.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                        <div style={{ borderTop: '2px solid #ddd', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Total Amount</span>
                            <span>₦ {order.total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <button onClick={() => navigate('/products')} className="checkout-btn" style={{ width: 'auto', padding: '12px 30px' }}>Continue Shopping</button>
                        <button onClick={() => navigate('/order-history')} className="checkout-btn" style={{ width: 'auto', padding: '12px 30px', background: '#333' }}>View Order History</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation;
