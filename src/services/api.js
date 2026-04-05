import axios from 'axios';

// const API_BASE_URL = 'https://hognetwork.onrender.com/api';
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('adminToken');
    window.location.reload(); 
  }
  return Promise.reject(error);
});

// --- NEW ENPOINTS FOR OMADA INTEGRATION ---
export const checkVoucherBalance = async (voucherCode) => {
  try {
    return await api.get(`/vouchers/balance/${voucherCode}`);
  } catch (err) {
    if (err.response?.status === 404) {
      // fallback maybe the backend uses a different path
      return api.get(`/vouchers/check/${voucherCode}`);
    }
    throw err;
  }
};

export const verifyAndGenerateVoucher = (paymentData) => api.post('/vouchers/generate', paymentData);
export const fetchOc300Vouchers = () => api.get('/vouchers/oc300');
export const retrieveVoucher = (code) => api.get(`/vouchers/retrieve/${code}`);

// Public API functions
export const getSiteSettings = () => api.get('/site/settings');
export const getSitePlans = () => api.get('/site/plans');
export const logPayment = (paymentData) => api.post('/site/log-payment', paymentData);

// Admin API functions
export const getAdminSettings = () => api.get('/admin/settings');
export const updateAdminSettings = (data) => api.put('/admin/settings', data);
export const getAdminPlans = () => api.get('/admin/plans');
export const createAdminPlan = (data) => api.post('/admin/plans', data);
export const updateAdminPlan = (id, data) => api.put(`/admin/plans/${id}`, data);
export const deleteAdminPlan = (id) => api.delete(`/admin/plans/${id}`);
export const getAdminPayments = (status) => api.get(`/admin/payments${status ? `?status=${status}` : ''}`);
export const approveAdminPayment = (id) => api.post(`/admin/payments/${id}/approve`);
export const rejectAdminPayment = (id) => api.post(`/admin/payments/${id}/reject`);

// Transaction History Endpoints
export const getTransactionHistory = () => api.get('/admin/transactions');
export const getTransactionById = (id) => api.get(`/admin/transactions/${id}`);
export const syncPaystackTransactions = () => api.post('/admin/transactions/sync-paystack');

export default api;