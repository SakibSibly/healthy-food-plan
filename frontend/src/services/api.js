import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => {
    // Backend expects form data for login
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    return api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  logout: (refreshToken) => api.post('/auth/logout', { refresh_token: refreshToken }),
  getCurrentUser: () => api.get('/auth/users/me'),
};

export const profileAPI = {
  getProfile: () => api.get('/auth/users/me'),
  updateProfile: (profileData) => api.put('/auth/users/me', profileData),
};

export const foodLogAPI = {
  getLogs: () => api.get('/actions/logs'),
  createLog: (logData) => api.post('/actions/logs', logData),
  updateLog: (id, logData) => api.put(`/actions/logs/${id}`, logData),
  deleteLog: (id) => api.delete(`/actions/logs/${id}`),
};

export const inventoryAPI = {
  getItems: () => api.get('/actions/inventory'),
  createItem: (itemData) => api.post('/actions/inventory', itemData),
  updateItem: (id, itemData) => api.put(`/actions/inventory/${id}`, itemData),
  deleteItem: (id) => api.delete(`/actions/inventory/${id}`),
};

export const imageAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/actions/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getImages: () => api.get('/actions/images'),
  deleteImage: (id) => api.delete(`/actions/images/${id}`),
};

export default api;
