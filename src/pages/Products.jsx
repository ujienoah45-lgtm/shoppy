import { useState,useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import getProducts from '../Utils/Products';
import './Products.css';

function Products({ onNavigateProduct, searchQuery }) {
  const [sortBy, setSortBy] = useState('name');
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(sortBy);
        setProducts(data)
      } catch (error) {
        console.log("An error occured while loading products", error);
      }
    };

    fetchProducts();
  },[sortBy]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h2>{searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}</h2>
          <div className="sort-controls">
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name (A-Z)</option>
              <option value="price">Price (Low to High)</option>
              <option value="-price">Price (High to Low)</option>
              <option value="-rating">Rating (High to Low)</option>
              <option value="rating">Rating (Low to High)</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-results" style={{ textAlign: 'center', padding: '50px 0' }}>
            <p>No products found matching your search.</p>
            <button
              onClick={() => {
                window.location.href = '/products';
              }}
              style={{ padding: '10px 20px', marginTop: '20px', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} onNavigateProduct={onNavigateProduct} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export default Products;
