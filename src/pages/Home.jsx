import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useUser } from '../context/UserContext';
import './Home.css';
import getProducts from '../Utils/Products';

const FALLBACK_PRODUCTS = [
  { id: 101, name: 'Premium Cotton Shirt', price: 12500, category: 'Shirts', image: 'https://via.placeholder.com/250x300?text=Shirt', description: 'Breathable premium cotton shirt for formal and casual wear.' },
  { id: 102, name: 'Oxford Leather Shoes', price: 25000, category: 'Shoes', image: 'https://via.placeholder.com/250x300?text=Shoes', description: 'Genuine leather oxford shoes with a polished finish.' },
  { id: 103, name: 'Minimalist Watch', price: 18000, category: 'Accessories', image: 'https://via.placeholder.com/250x300?text=Watch', description: 'Sleek silver watch with a minimalist dial.' },
  { id: 104, name: 'Leather Belt', price: 8500, category: 'Accessories', image: 'https://via.placeholder.com/250x300?text=Belt', description: 'Durable leather belt with a classic buckle.' },
  { id: 105, name: 'Slim Fit Denim', price: 15000, category: 'Shirts', image: 'https://via.placeholder.com/250x300?text=Denim', description: 'Comfortable slim fit denim shirt.' },
];

function Home({ onNavigateProduct }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const { recentlyViewed } = useUser();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if(data && data.length > 0) {
          const mapped = data.map((p) => ({
            ...p, category: p.category.charAt(0).toUpperCase() + p.category.slice(1)
          }));
          setProducts(mapped);
        };
      } catch (error) {
        console.log("Product fetch failed falling back to FallBack products", error);
      }
    };
    fetchProducts();
  },[]);

  const catValues = [
    "all", ...new Set(products.map(p => p.category))
  ];

  const categories = catValues.map(c => ({
    id: c.toLowerCase(),
    label: c.toUpperCase()
  }));

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category.toLowerCase() === selectedCategory);


  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">NEW ARRIVALS 2026</span>
            <h2>Elevate Your Style</h2>
            <p>Discover premium men's wear and accessories curated for the modern gentleman.</p>
            <button className="category-btn active" style={{ marginTop: '20px' }} onClick={() => setSelectedCategory('all')}>SHOP NOW</button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h3>Shop by Category</h3>
          <div className="category-grid">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''
                  }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h3>Featured Products</h3>
          </div>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} onNavigateProduct={onNavigateProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <section className="recently-viewed" style={{ padding: '60px 0', background: '#fcfcfc' }}>
          <div className="container">
            <div className="section-header">
              <h3>Recently Viewed</h3>
            </div>
            <div className="product-grid">
              {recentlyViewed.map((product) => (
                <ProductCard key={product._id} product={product} onNavigateProduct={onNavigateProduct} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

