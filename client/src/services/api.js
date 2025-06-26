import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4002/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Client API endpoints
export const clientAPI = {
  // Listings
  getListings: (params = {}) => api.get('/client/listings', { params }),
  getListing: (id) => api.get(`/client/listings/${id}`),
  getFeaturedListings: (limit = 6) => api.get('/client/listings/featured', { params: { limit } }),
  
  // Search
  getSearchSuggestions: (query) => api.get('/client/search/suggestions', { params: { q: query } }),
  
  // Inquiries
  submitInquiry: (data) => api.post('/client/inquiries', data),
  
  // Help Desk
  getHelpDesk: () => api.get('/client/helpdesk'),
  
  // Feedback
  submitFeedback: (data) => api.post('/client/feedbacks', data),
  
  // Stats
  getStats: () => api.get('/client/stats'),
};

// Admin API endpoints
export const adminAPI = {
  // Auth
  login: (credentials) => api.post('/admin/login', credentials),
  
  // Profile
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (data) => api.put('/admin/profile', data),
  changePassword: (data) => api.put('/admin/change-password', data),
  
  // Listings
  getListings: (params = {}) => api.get('/admin/listings', { params }),
  createListing: (data) => api.post('/admin/listings', data),
  updateListing: (id, data) => api.put(`/admin/listings/${id}`, data),
  deleteListing: (id) => api.delete(`/admin/listings/${id}`),
  updateAvailability: (id, available) => api.patch(`/admin/listings/${id}/availability`, { available }),
  
  // Inquiries
  getInquiries: (params = {}) => api.get('/admin/inquiries', { params }),
  updateInquiryStatus: (id, status) => api.post(`/admin/inquiries/${id}/respond`, { status }),
  
  // Help Desk
  getHelpDesk: () => api.get('/admin/helpdesk'),
  updateHelpDesk: (data) => api.put('/admin/helpdesk', data),
  
  // Feedback
  getFeedbacks: (params = {}) => api.get('/admin/feedbacks', { params }),
  
  // Stats
  getStats: () => api.get('/admin/stats'),
};

export default api; 