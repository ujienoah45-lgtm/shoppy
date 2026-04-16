import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';
import { getProductPrimaryImage } from '../Utils/image';
import './ProductCard.css';

function ProductCard({ product, onNavigateProduct }) {
  const { addToCart } = useCart();
  const { auth } = useUser();
  const productImage = getProductPrimaryImage(product);
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation to details
    if(!auth.isAuthenticated) {
      toast.info("Please log in to add products to the cart");
      return;
    };
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="product-card" onClick={() => onNavigateProduct(product)}>
      <div className="product-image">
        <img src={productImage} alt={product.name} />
      </div>
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <p className="product-description">{product.description || 'Premium quality product for everyday style.'}</p>
        <p className="product-price">₦ {product.price.toLocaleString()}</p>
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
