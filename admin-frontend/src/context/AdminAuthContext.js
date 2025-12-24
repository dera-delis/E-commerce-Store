import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, endpoints } from '../api/api';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem('admin_token');
    if (token) {
      checkAdminStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await api.get(endpoints.auth.me);
      const userData = response.data;
      
      // Check if user has admin role
      if (userData.role !== 'admin') {
        localStorage.removeItem('admin_token');
        setAdmin(null);
        setError('Access denied. Admin privileges required.');
      } else {
        setAdmin(userData);
        setError(null);
      }
    } catch (error) {
      console.error('Admin auth check failed:', error);
      localStorage.removeItem('admin_token');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post(endpoints.auth.login, { email, password });
      const { access_token, ...userData } = response.data;
      
      // Check if user has admin role
      if (userData.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        return { success: false, error: 'Admin privileges required' };
      }
      
      localStorage.setItem('admin_token', access_token);
      setAdmin(userData);
      setError(null);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setAdmin(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    admin,
    loading,
    error,
    login,
    logout,
    clearError
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
