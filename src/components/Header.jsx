import { useNavigate, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import './Header.css';

function Header({ onSearch }) {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { auth, clearLogout } = useUser();
  const cartCount = getTotalItems();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleLogout = async () => {
    await clearLogout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            <img
              src="/shoppy_logo.png"
              alt="Shoppy logo"
              className="shoppy_logo"
            />
          </div>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" aria-label="Search products">🔍</button>
          </form>

          <nav className="nav">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Products
            </NavLink>
            {auth.isAuthenticated ? (
              <div className="user-menu">
                {auth.userObj?.role === 'admin' && (
                  <NavLink to="/admin" className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`}>
                    Admin Dashboard
                  </NavLink>
                )}
                <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Profile
                </NavLink>
                <button className="nav-link logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Sign Up
                </NavLink>
              </>
            )}
          </nav>

          <div className="header-actions">
            <button className="cart-button" onClick={() => navigate('/cart')} aria-label="Open cart">
              <span className="cart-icon">🛒</span>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
