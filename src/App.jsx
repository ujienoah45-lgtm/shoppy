import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useState, Suspense, lazy, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import LoadingSpinner from './components/LoadingSpinner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Products = lazy(() => import('./pages/Products'));
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const InfoPage = lazy(() => import('./pages/InfoPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminSignup = lazy(() => import('./pages/AdminSignup'));

// Admin Pages
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/vault/ops/login');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const navigateToProductDetails = (product) => {
    setSelectedProduct(product);
    navigate(`/product/${product._id || product.id}`);
  };

  const navigateToConfirmation = (order) => {
    setLastOrder(order);
    navigate('/order-confirmation');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    navigate('/products');
  };

  return (
    <div className="app">
      {!isAdminRoute && <Header onSearch={handleSearch} />}
      <main className="main-content">
        <Suspense fallback={<LoadingSpinner fullPage />}>
          <Routes>
            <Route path="/" element={<Home onNavigateProduct={navigateToProductDetails} />} />
            <Route path="/products" element={<Products onNavigateProduct={navigateToProductDetails} searchQuery={searchQuery} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout onOrderComplete={navigateToConfirmation} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/product/:id" element={<ProductDetails product={selectedProduct} />} />
            <Route path="/order-confirmation" element={<OrderConfirmation order={lastOrder} />} />
            <Route path="/help-center" element={<InfoPage />} />
            <Route path="/how-to-shop" element={<InfoPage />} />
            <Route path="/delivery-options" element={<InfoPage />} />
            <Route path="/returns" element={<InfoPage />} />
            <Route path="/about-us" element={<InfoPage />} />
            <Route path="/careers" element={<InfoPage />} />
            <Route path="/shoppy-express" element={<InfoPage />} />
            <Route path="/terms-and-conditions" element={<InfoPage />} />
            <Route path="/privacy-policy" element={<InfoPage />} />
            <Route path="/cookie-policy" element={<InfoPage />} />
            <Route path="/vault/ops/login" element={<AdminLogin />} />
            <Route path="/vault/ops/signup" element={<AdminSignup />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <Chatbot />}
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <CartProvider>
          <AppContent />
          <ToastContainer position="bottom-right" autoClose={3000} />
        </CartProvider>
      </Router>
    </UserProvider>
  );
}

export default App;
