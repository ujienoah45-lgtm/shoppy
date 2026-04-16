import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';
import getProducts from '../Utils/Products';
import { getProductGallery } from '../Utils/image';
import './Home.css';

function ProductDetails({ product: initialProduct }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { auth, addRecentlyViewed } = useUser();
  const [product, setProduct] = useState(initialProduct);
  const [selectedImage, setSelectedImage] = useState(getProductGallery(initialProduct)[0]);
  const [loading, setLoading] = useState(!initialProduct);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(getProductGallery(initialProduct)[0]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (product || !id) return;

      setLoading(true);
      try {
        const products = await getProducts();
        const found = products.find((p) => p._id?.toString() === id);
        if (found) {
          setProduct(found);
          setSelectedImage(getProductGallery(found)[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, product]);

  useEffect(() => {
    if (!product) return;
    addRecentlyViewed(product);
    const firstImage = getProductGallery(product)[0];
    setSelectedImage(firstImage);
    setLightboxImage(firstImage);
  }, [product, addRecentlyViewed]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  if (loading) {
    return <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}><h2>Loading...</h2></div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/products')} className="category-btn active">Back to Products</button>
      </div>
    );
  }

  const images = getProductGallery(product);

  return (
    <div className="product-details-page" style={{ padding: '40px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '44px' }}>
          <div className="product-gallery">
            <div className="main-image" style={{ marginBottom: '14px' }}>
              <img
                src={selectedImage}
                alt={product.name}
                style={{ width: '100%', borderRadius: '10px', aspectRatio: '3 / 4', objectFit: 'cover', cursor: 'zoom-in' }}
                onClick={() => {
                  setLightboxImage(selectedImage);
                  setIsLightboxOpen(true);
                }}
              />
            </div>
            <button
              type="button"
              className="lightbox-trigger"
              onClick={() => {
                setLightboxImage(selectedImage);
                setIsLightboxOpen(true);
              }}
            >
              View full size
            </button>
            <div className="thumbnail-grid" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {images.map((img) => (
                <img
                  key={img}
                  src={img}
                  alt={product.name}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: '96px',
                    height: '120px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: selectedImage === img ? '2px solid var(--accent-color)' : '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="product-info">
            <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{product.name}</h2>
            <p className="product-price" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '20px' }}>
              ₦ {product.price.toLocaleString()}
            </p>
            <div style={{ marginBottom: '30px', color: '#666', lineHeight: '1.6' }}>
              <h3>Description</h3>
              <p>{product.description || `This is a premium ${product.name} from our ${product.category} collection.`}</p>
            </div>

            <button
              className="add-to-cart-btn"
              onClick={() => {
                if (!auth.isAuthenticated) {
                  toast.info('Please log in to add products to the cart');
                  navigate('/login');
                  return;
                }
                addToCart(product);
                toast.success(`${product.name} added to cart!`);
              }}
              style={{ padding: '15px 40px', fontSize: '1.1rem' }}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
      {isLightboxOpen && (
        <div
          className="lightbox-overlay"
          onClick={() => setIsLightboxOpen(false)}
          role="presentation"
        >
          <div
            className="lightbox-content"
            onClick={(event) => event.stopPropagation()}
            role="presentation"
          >
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setIsLightboxOpen(false)}
            >
              Close
            </button>
            <img src={lightboxImage} alt={product.name} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
