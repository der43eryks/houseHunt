import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  withCredentials: true // Send cookies with every request
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
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
  
  // Stats - with fallback for development
  getStats: async () => {
    try {
      return await api.get('/admin/stats');
    } catch (error: any) {
      // For development, return mock data if authentication fails
      if (error.error === 'Access token required' || error.error === 'Invalid or expired token') {
        console.warn('Using mock stats data for development');
        return {
          success: true,
          data: {
            totalListings: 0,
            availableListings: 0,
            totalInquiries: 0,
            pendingInquiries: 0,
            totalFeedbacks: 0,
            averageRating: 0,
            ratingDistribution: {}
          }
        };
      }
      throw error;
    }
  },
  async checkEmailExists(email: string) {
    const res = await fetch(`/api/admin/check-email?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    return data.exists;
  },
  async checkIdExists(id: string) {
    const res = await fetch(`/api/admin/check-id?id=${encodeURIComponent(id)}`);
    const data = await res.json();
    return data.exists;
  },
};

export default api; 