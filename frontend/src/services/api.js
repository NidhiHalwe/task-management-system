import axios from 'axios';
import { getToken, removeToken } from './auth';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response handler: if token is invalid/expired, clear and redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        removeToken();
      } catch (e) {}
      // force a full reload to the login route
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  me: () => API.get('/auth/me')
};

export const tasks = {
  list: (page = 1, limit = 20) => API.get(`/tasks?page=${page}&limit=${limit}`),
  get: (id) => API.get(`/tasks/${id}`),
  create: (data) => API.post('/tasks', data),
  update: (id, data) => API.put(`/tasks/${id}`, data),
  remove: (id) => API.delete(`/tasks/${id}`)
};

export default API;
