import axios from 'axios';
import { getToken } from '../../utils/storage';

// Use your machine's local IP when testing on a physical device
// For emulator: 10.0.2.2 (Android) or localhost (iOS)
const API_BASE_URL = 'http://10.0.2.2:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        // Token expired or invalid — handled by auth slice
      }
      return Promise.reject({
        status,
        message: data.error || 'Something went wrong',
        details: data.details,
      });
    }
    return Promise.reject({
      status: 0,
      message: 'Network error. Please check your connection.',
    });
  }
);

export default api;
