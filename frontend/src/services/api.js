import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration and Network/Server errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle Network Errors (Service Down)
    if (!error.response) {
      console.error('Network Error:', error);
      // Construct a faux response object so components can handle it gracefully
      // rather than crashing unchecked
      const serviceUnavailableError = {
        ...error,
        response: {
          status: 503,
          data: { msg: 'Service is temporarily unavailable', isServiceDown: true }
        },
        isServiceDown: true
      };
      return Promise.reject(serviceUnavailableError);
    }

    // Handle 502/503/504 (Gateway Timeout / Bad Gateway)
    if (error.response.status >= 502 && error.response.status <= 504) {
      error.isServiceDown = true;
      error.response.data = { msg: 'Service is temporarily unavailable', isServiceDown: true };
    }

    // Handle Token Expiry
    if (error.response?.status === 401 && error.response?.data?.msg?.includes('expired')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  // 2FA Registration
  sendRegistrationOTP: (data) => api.post('/auth/register/send-otp', data),
  verifyOTP: (data) => api.post('/auth/register/verify-otp', data),
  completeRegistration: (data) => api.post('/auth/register/complete', data),

  // Original APIs
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Package APIs
export const packageAPI = {
  getAll: (params) => api.get('/packages', { params }),
  getById: (id) => api.get(`/packages/${id}`),
  create: (data) => api.post('/packages', data),
  update: (id, data) => api.put(`/packages/${id}`, data),
  delete: (id) => api.delete(`/packages/${id}`),
  search: (query) => api.get('/packages', { params: { q: query } }),
};

// Booking APIs
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: (all = false) => api.get('/bookings', { params: { all } }),
  getById: (id) => api.get(`/bookings/${id}`),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
};

// Review APIs
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByPackage: (packageId) => api.get(`/reviews/package/${packageId}`),
  getAll: () => api.get('/reviews'),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Inquiry APIs
export const inquiryAPI = {
  create: (data) => api.post('/inquiries', data),
  getAll: () => api.get('/inquiries'),
  getMyInquiries: () => api.get('/inquiries/my-inquiries'),
  getById: (id) => api.get(`/inquiries/${id}`),
  update: (id, data) => api.put(`/inquiries/${id}`, data),
  delete: (id) => api.delete(`/inquiries/${id}`),
};

// Payment APIs
export const paymentAPI = {
  createIntent: (data) => api.post('/payments/create-intent', data),
  confirmPayment: (data) => api.post('/payments/confirm', data),
  getPayments: () => api.get('/payments'),
};

// Notification APIs
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getBookings: () => api.get('/admin/bookings'),
  getStats: () => api.get('/admin/stats'),

  // Analytics APIs
  getAnalytics: () => api.get('/admin/analytics'),
  getSalesAnalytics: () => api.get('/admin/reports/sales'),
  getPopularDestinations: () => api.get('/admin/reports/popular-destinations'),
  getCustomerAnalytics: () => api.get('/admin/reports/customer-analytics'),

  // Dynamic Pricing APIs
  getPricingRules: () => api.get('/admin/pricing-rules'),
  updatePricingRules: (data) => api.put('/admin/pricing-rules', data),
  getPricingAnalytics: () => api.get('/admin/reports/pricing-analytics'),

  // Loyalty Program APIs
  getLoyaltyStats: () => api.get('/admin/reports/loyalty-points'),
  getLoyaltyMembers: () => api.get('/admin/loyalty-members'),
  updateLoyaltyTier: (userId, tier) => api.put(`/admin/loyalty-members/${userId}/tier`, { tier }),

  // E-Ticket Management
  getETicketStats: () => api.get('/admin/e-tickets/stats'),
  regenerateTicket: (bookingId) => api.post(`/admin/e-tickets/${bookingId}/regenerate`),
};

export default api;
