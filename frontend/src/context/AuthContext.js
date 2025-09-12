import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, endpoints } from '../api/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug: Log error state changes
  useEffect(() => {
    console.log('AuthContext error state changed:', error);
  }, [error]);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
    
    // Restore error from localStorage if it exists
    const storedError = localStorage.getItem('loginError');
    if (storedError) {
      console.log('Restoring error from localStorage:', storedError);
      setError(storedError);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get(endpoints.auth.me);
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post(endpoints.auth.login, { email, password });
      const { access_token, ...userData } = response.data;
      
      localStorage.setItem('token', access_token);
      setUser(userData);
      setError(null); // Only clear error on successful login
      localStorage.removeItem('loginError'); // Clear stored error
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      console.log('Setting error:', errorMessage);
      setError(errorMessage);
      localStorage.setItem('loginError', errorMessage); // Store error in localStorage
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await api.post(endpoints.auth.signup, userData);
      const { access_token, ...user } = response.data;
      
      localStorage.setItem('token', access_token);
      setUser(user);
      setError(null); // Only clear error on successful signup
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    console.log('Clearing error manually');
    setError(null);
    localStorage.removeItem('loginError');
  };

  const clearErrorWithDelay = () => {
    setTimeout(() => {
      setError(null);
    }, 5000); // Clear error after 5 seconds
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    clearError,
    clearErrorWithDelay,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
