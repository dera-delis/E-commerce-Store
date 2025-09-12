import axios from 'axios';

// Create axios instance for admin
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add admin auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/api/v1/auth/login',
    me: '/api/v1/auth/me',
    logout: '/api/v1/auth/logout',
  },
  
  // Admin
  admin: {
    stats: '/api/v1/admin/stats',
    products: {
      list: '/api/v1/admin/products',
      create: '/api/v1/admin/products',
      update: (id) => `/api/v1/admin/products/${id}`,
      delete: (id) => `/api/v1/admin/products/${id}`,
    },
    orders: {
      list: '/api/v1/admin/orders',
      detail: (id) => `/api/v1/admin/orders/${id}`,
      updateStatus: (id) => `/api/v1/admin/orders/${id}/status`,
    },
  },
};

export { api };
