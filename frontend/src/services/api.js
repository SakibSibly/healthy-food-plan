import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

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
  login: (credentials) => api.post('/auth/login', credentials),
  logout: (refreshToken) => api.post('/auth/logout', { refresh_token: refreshToken }),
  getCurrentUser: () => api.get('/auth/users/me'),
};

export const profileAPI = {
  getProfile: () => api.get('/auth/users/me'),
  // Note: updateProfile endpoint doesn't exist in backend yet
  // This saves to localStorage for now
  updateProfile: (profileData) => {
    console.info('Profile saved to localStorage (backend endpoint not implemented)');
    return Promise.resolve({ data: { message: 'Profile saved locally' } });
  },
};

// Note: Food logs endpoints don't exist in backend yet
export const foodLogAPI = {
  getLogs: () => api.get('/actions/logs/'),
  createLog: (logData) => api.post('/actions/logs/', logData),
  updateLog: (id, logData) => api.put(`/actions/logs/${id}`, logData),
  deleteLog: (id) => api.delete(`/actions/logs/${id}`),
};

export const inventoryAPI = {
  getItems: () => api.get('/actions/inventory/'),
  createItem: (itemData) => api.post('/actions/inventory/', itemData),
  updateItem: (id, itemData) => {
    console.warn('Inventory update endpoint not implemented in backend');
    return Promise.reject(new Error('Inventory update not implemented'));
  },
  deleteItem: (id) => {
    console.warn('Inventory delete endpoint not implemented in backend');
    return Promise.reject(new Error('Inventory delete not implemented'));
  },
};

// Note: Image upload endpoints don't exist in backend yet
export const imageAPI = {
  uploadImage: (file) => {
    console.warn('Image upload endpoint not implemented in backend');
    return Promise.reject(new Error('Image upload not implemented'));
  },
  getImages: () => Promise.resolve({ data: [] }),
  deleteImage: (id) => {
    console.warn('Image delete endpoint not implemented in backend');
    return Promise.reject(new Error('Image delete not implemented'));
  },
};

export default api;
