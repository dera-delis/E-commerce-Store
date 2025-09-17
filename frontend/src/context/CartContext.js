import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api, endpoints } from '../api/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await api.get(endpoints.cart.get);
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Failed to load cart:', error);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      const response = await api.post(endpoints.cart.add, { product_id: productId, quantity });
      setCartItems(response.data.items || []);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to add item to cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setError(null);
      await api.delete(endpoints.cart.remove(productId));
      setCartItems(prev => prev.filter(item => item.product_id !== productId));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to remove item from cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    try {
      setError(null);
      const response = await api.put(endpoints.cart.update(productId), { quantity });
      setCartItems(response.data.items || []);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to update quantity';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await api.delete(endpoints.cart.clear);
      setCartItems([]);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to clear cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.subtotal, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item.product_id === productId);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getCartItem,
    clearError,
    isEmpty: cartItems.length === 0,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};