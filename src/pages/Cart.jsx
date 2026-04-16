import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { getProductPrimaryImage } from '../Utils/image';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, increaseQuantity, reduceQuantity, getSubtotal } = useCart();
  const { auth } = useUser();
  const subtotal = getSubtotal();
  const deliveryFee = 1500;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) navigate("/login");
  }, [auth.isAuthenticated, auth.loading, navigate]);

  if (cart?.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h2>Shopping Cart</h2>
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <p>Start shopping to add items to your cart!</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h2>Shopping Cart</h2>

        <div className="cart-layout">
          <div className="cart-items-section">
            <div className="cart-items">
              {cart?.map((item) => (
                <div key={item.product?._id} className="cart-item">
                  <div className="item-image">
                    <img src={getProductPrimaryImage(item.product)} alt={item.product?.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.product?.name}</h3>
                    <p className="item-price">₦ {item.product?.price?.toLocaleString()}</p>
                  </div>
                  <div className="item-quantity">
                    <button
                      onClick={() => reduceQuantity(item.product?._id, item?.quantity - 1)}
                      className="qty-btn"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.product?._id, item?.quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    <p>₦ {(item.product?.price * item?.quantity).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item?.product._id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₦ {subtotal?.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>₦ {deliveryFee?.toLocaleString()}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₦ {total?.toLocaleString()}</span>
            </div>
            <button className="checkout-btn" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
