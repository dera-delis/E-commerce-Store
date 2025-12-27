import axios from 'axios';

// Dynamic base URL: use environment variable or fallback to localhost
const isBrowser = typeof window !== 'undefined';
const isLocal = isBrowser && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

// Use REACT_APP_API_URL from environment, or fallback to localhost for dev
// Production: Cloud Run backend URL
const baseURL = isLocal
  ? 'http://localhost:8000'
  : (process.env.REACT_APP_API_URL || 'https://ecommerce-backend-192614808954.us-central1.run.app');
console.log('🌐 API Base URL:', baseURL);

// Create axios instance with HTTPS
const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('🚀 API Request ->', config.baseURL + config.url);
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
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints with versioning
export const endpoints = {
  // Auth
  auth: {
    login: '/api/v1/auth/login',
    signup: '/api/v1/auth/signup',
    logout: '/api/v1/auth/logout',
    me: '/api/v1/auth/me',
    refresh: '/api/v1/auth/refresh',
  },
  
  // Products
  products: {
    list: '/api/v1/products',
    detail: (id) => `/api/v1/products/${id}`,
    categories: '/api/v1/products/categories',
    featured: '/api/v1/products/featured',
    search: '/api/v1/products/search/suggestions',
  },
  
  // Cart
  cart: {
    get: '/api/v1/cart',
    add: '/api/v1/cart/add',
    update: (id) => `/api/v1/cart/items/${id}`,
    remove: (id) => `/api/v1/cart/items/${id}`,
    clear: '/api/v1/cart',
    count: '/api/v1/cart/count',
  },
  
  // Orders
  orders: {
    create: '/api/v1/orders',
    list: '/api/v1/orders',
    detail: (id) => `/api/v1/orders/${id}`,
    tracking: (id) => `/api/v1/orders/${id}/tracking`,
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