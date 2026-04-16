import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { createOrder } from '../Utils/order';
import './Checkout.css';

function Checkout({ onOrderComplete }) {
  const navigate = useNavigate();
  const { cart, getSubtotal, clearCart } = useCart();
  const { auth } = useUser();
  const [formData, setFormData] = useState({
    name: auth.userObj?.name || '',
    phone: auth.userObj?.phone || '',
    address: auth.userObj?.address || '',
    paymentOption: 'POD',
  });
  const [showBankDetails, setShowBankDetails] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = 1500;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const finalizeOrder = async () => {

    try {
      const data = await createOrder(formData.name, formData.phone, formData.address, formData.paymentOption);
  
      clearCart();
      onOrderComplete(data);
    } catch (error) {
      console.log("An error occured", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.paymentOption === 'Bank') {
      setShowBankDetails(true);
    } else {
      finalizeOrder();
    }
  };

  const handleConfirmBankPayment = () => {
    finalizeOrder();
  };

  if (cart?.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <h2>Checkout</h2>
          <p>Your cart is empty. Please add items before checking out.</p>
          <button onClick={() => navigate('/products')} className="checkout-btn" style={{ width: 'auto', marginTop: '20px' }}>Go Shopping</button>
        </div>
      </div>
    );
  }

  if (showBankDetails) {
    return (
      <div className="checkout-page">
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="bank-details-card">
            <h2>Bank Transfer Details</h2>
            <p>Please make a transfer of <strong>₦ {total.toLocaleString()}</strong> to the account below:</p>

            <div className="account-info">
              <div className="info-row">
                <span>Bank:</span>
                <strong>Shoppy Payment Bank</strong>
              </div>
              <div className="info-row">
                <span>Account Number:</span>
                <strong>0123456789</strong>
              </div>
              <div className="info-row">
                <span>Account Name:</span>
                <strong>SHOPPY LIMITED</strong>
              </div>
            </div>

            <div className="transfer-instructions">
              <p><strong>Important:</strong> Please use your phone number (<strong>{formData.phone}</strong>) as the transaction narration for faster verification.</p>
            </div>

            <div className="bank-actions">
              <button
                className="place-order-btn"
                onClick={handleConfirmBankPayment}
                style={{ width: '100%', marginBottom: '10px' }}
              >
                I Have Made the Transfer
              </button>
              <button
                className="link-btn"
                onClick={() => setShowBankDetails(false)}
                style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer', width: '100%' }}
              >
                Change Payment Method
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h2>Complete Your Order</h2>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Essential Information</h3>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Delivery Address</label>
                <textarea
                  name="address"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Payment Option</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentOption"
                    value="POD"
                    checked={formData.paymentOption === 'POD'}
                    onChange={handleInputChange}
                  />
                  Pay on Delivery
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentOption"
                    value="Bank"
                    checked={formData.paymentOption === 'Bank'}
                    onChange={handleInputChange}
                  />
                  Bank Transfer
                </label>
              </div>
            </div>

            <button type="submit" className="place-order-btn">
              Place Order (₦ {total.toLocaleString()})
            </button>
          </form>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map((item) => (
                <div key={item.product._id} className="summary-item">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>₦ {(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₦ {subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>₦ {deliveryFee.toLocaleString()}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₦ {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
