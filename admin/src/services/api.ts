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
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Admin API endpoints
export const adminAPI = {
  // Auth
  login: (credentials: { email: string; password: string }) => 
    api.post('/admin/login', credentials),
  register: (data: { id: string; username: string; email: string; phone: string; password: string }) => 
    api.post('/admin/register', data),
  forgotPassword: (data: { email: string }) => 
    api.post('/admin/forgot-password', data),
  
  // Profile
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (data: any) => api.put('/admin/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    api.put('/admin/change-password', data),
  
  // Listings
  getListings: (params = {}) => api.get('/admin/listings', { params }),
  createListing: (data: any) => api.post('/admin/listings', data),
  updateListing: (id: string, data: any) => api.put(`/admin/listings/${id}`, data),
  deleteListing: (id: string) => api.delete(`/admin/listings/${id}`),
  updateAvailability: (id: string, available: boolean) => 
    api.patch(`/admin/listings/${id}/availability`, { available }),
  
  // Inquiries
  getInquiries: (params = {}) => api.get('/admin/inquiries', { params }),
  updateInquiryStatus: (id: string, status: string) => 
    api.post(`/admin/inquiries/${id}/respond`, { status }),
  
  // Help Desk
  getHelpDesk: () => api.get('/admin/helpdesk'),
  updateHelpDesk: (data: any) => api.put('/admin/helpdesk', data),
  
  // Feedback
  getFeedbacks: (params = {}) => api.get('/admin/feedbacks', { params }),
  
  // Stats
  getStats: () => api.get('/admin/stats'),
};

export default api; 