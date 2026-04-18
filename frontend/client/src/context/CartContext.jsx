import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState({ restaurantId: null, items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ restaurantId: null, items: [] });
      return;
    }
    try {
      setLoading(true);
      const data = await api.get('/cart');
      setCart({
        restaurantId: data.restaurantId,
        items: data.items?.map(item => ({
          id: item.menuItemId,
          cartItemId: item.id,
          name: item.MenuItem?.name,
          price: item.MenuItem?.price,
          imageUrl: item.MenuItem?.imageUrl,
          quantity: item.quantity
        })) || []
      });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (restaurantId, menuItem) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    try {
      const data = await api.post('/cart/items', {
        menuItemId: menuItem.id,
        quantity: 1
      });
      setCart({
        restaurantId: data.restaurantId,
        items: data.items?.map(item => ({
          id: item.menuItemId,
          cartItemId: item.id,
          name: item.MenuItem?.name,
          price: item.MenuItem?.price,
          imageUrl: item.MenuItem?.imageUrl,
          quantity: item.quantity
        })) || []
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item');
    }
  };

  const updateQuantity = async (menuItemId, quantity) => {
    if (!isAuthenticated) return;
    try {
      const data = await api.patch(`/cart/items/${menuItemId}`, { quantity });
      setCart({
        restaurantId: data.restaurantId,
        items: data.items?.map(item => ({
          id: item.menuItemId,
          cartItemId: item.id,
          name: item.MenuItem?.name,
          price: item.MenuItem?.price,
          imageUrl: item.MenuItem?.imageUrl,
          quantity: item.quantity
        })) || []
      });
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeFromCart = async (menuItemId) => {
    if (!isAuthenticated) return;
    try {
      const data = await api.delete(`/cart/items/${menuItemId}`);
      setCart({
        restaurantId: data.restaurantId,
        items: data.items?.map(item => ({
          id: item.menuItemId,
          cartItemId: item.id,
          name: item.MenuItem?.name,
          price: item.MenuItem?.price,
          imageUrl: item.MenuItem?.imageUrl,
          quantity: item.quantity
        })) || []
      });
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      setCart({ restaurantId: null, items: [] });
      return;
    }
    try {
      await api.delete('/cart');
      setCart({ restaurantId: null, items: [] });
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      fetchCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};