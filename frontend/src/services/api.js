import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — token expired or invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login on auth failure (except on auth endpoints)
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  signin: (data) => api.post('/auth/signin', data),
  googleSignIn: (payload) =>
    api.post('/auth/google', typeof payload === 'string' ? { credential: payload } : payload),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

// ─── Documents ───────────────────────────────────────────────────────────────
export const documentsAPI = {
  upload: (formData, onUploadProgress) =>
    api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),
  getAll: () => api.get('/documents'),
  getById: (id) => api.get(`/documents/${id}`),
  getStatus: (id) => api.get(`/documents/${id}/status`),
  delete: (id) => api.delete(`/documents/${id}`),
};

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const chatAPI = {
  ask: (documentId, question) => api.post('/chat', { documentId, question }),
  getHistory: (documentId) => api.get(`/chat/${documentId}`),
  clearHistory: (documentId) => api.delete(`/chat/${documentId}`),
};

export default api;
