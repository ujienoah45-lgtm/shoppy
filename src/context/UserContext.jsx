import { createContext, useContext, useState, useEffect } from 'react';
import { logout } from '../Utils/user';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    userObj: null,
    isAuthenticated: false,
    loading: true
  });
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  useEffect(() => {
    const savedRecentlyViewed = sessionStorage.getItem('shoppy_recently_viewed');
    if (savedRecentlyViewed) {
      setRecentlyViewed(JSON.parse(savedRecentlyViewed));
    }
    setAuth(prev => ({
      ...prev, loading: false
    }));
  }, []);

  // Save recently viewed to sessionStorage (session-based)
  useEffect(() => {
    sessionStorage.setItem('shoppy_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const saveLogin = (userData) => {
    setAuth(prev =>({
      ...prev, userObj: userData, isAuthenticated: true
    }));
  };

  useEffect(() => {
      const initializeAuth = async () => {
        try {
          const res = await fetch("/api/v1/auth/me", {
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            }
          });

          const data = await res.json();
          if(data.status !== "success") {
            setAuth(prev => ({
              ...prev, userObj: null, isAuthenticated: false, loading: false
            }));
            return;
          };

          setAuth(prev => ({
            ...prev, userObj: data.data.user, isAuthenticated: true, loading: false
          }))
        } catch (error) {
          setAuth(prev => ({
            ...prev, userObj: null, isAuthenticated: false, loading: false
          }));
        }finally{
          setAuth(prev => ({
            ...prev, loading: false
          }))
        }
      };

      initializeAuth()
  }, []);

  const clearLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log('Logout failed but local auth will still be cleared.', error);
    }

    setAuth(prev => ({
      ...prev, userObj: null, isAuthenticated: false, loading: false
    }));
  };

  const addRecentlyViewed = (product) => {
    setRecentlyViewed((prev) => {
      const productId = product._id || product.id;
      // Filter out if already exists and add to front
      const filtered = prev.filter((p) => (p._id || p.id) !== productId);
      const updated = [product, ...filtered].slice(0, 5); // Keep last 5
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{ auth, setAuth, saveLogin, clearLogout, recentlyViewed, addRecentlyViewed }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
