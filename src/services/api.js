import axios from 'axios';

const API_BASE_URL = 'https://hognetwork.onrender.com/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      // You might want to redirect to login here
      window.location.reload(); // Simple reload to reset state
    }
    return Promise.reject(error);
  }
);

// Public API functions
export const getSiteSettings = () => api.get('/site/settings');
export const getSitePlans = () => api.get('/site/plans');
export const logPayment = (paymentData) => api.post('/site/log-payment', paymentData);

export default api;