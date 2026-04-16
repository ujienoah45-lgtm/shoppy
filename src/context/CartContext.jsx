import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addProd, remProd, increaseQty, reduceQty,restoreCart } from '../Utils/cart';
import { useUser } from './UserContext';
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { auth } = useUser();

  useEffect(() => {
    const syncCart = async () => {
      if (auth.loading) return;

      if (!auth.isAuthenticated) {
        setCart([]);
        return;
      }

      try {
        const data = await getCart();
        setCart(data || []);
      } catch (error) {
        console.log('An error occured while loading cart', error);
        setCart([]);
      }
    };

    syncCart();
  }, [auth.isAuthenticated, auth.loading]);

  const addToCart = async (product) => {
    try {
      const data = await addProd(product);
      setCart(data || []);
    } catch (error) {
      console.log('An error occured', error.message);
    };
  };

  const removeFromCart = async (productId) => {
    try {
      const data = await remProd(productId);
      setCart(data || []);
    } catch (error) {
      console.log("An error occured", error)
    }
  };

  const increaseQuantity = async (productId, quantity) => {
    try {
      const data = await increaseQty(productId, quantity);
      setCart(data || []);
    } catch (error) {
      console.log("An error occured while increasing cart quantity", error);
    };
  };

  const reduceQuantity = async (productId, quantity) => {
    const prodToUpdate = cart?.find(i => i.product._id === productId);
    if (prodToUpdate && prodToUpdate.quantity <= 0) {
      removeFromCart(productId);
      return;
    };
    try {
      const data = await reduceQty(productId, quantity)
      setCart(data || []);
    } catch (error) {
      console.log("An error occured while reducing cart quantity", error);
    };
  };

  const clearCart = async () => {
    try {
      const data = await restoreCart();
      setCart(data || []);
    } catch (error) {
      console.log("An error occured", error);
    };
  };

  const getTotalItems = () => {
    return cart?.reduce((total, item) => {
      return total + item.quantity
    }, 0);
  };

  const getSubtotal = () => {
    return cart?.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        reduceQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
