import axios from 'axios';
import API_BASE_URL from '../config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,   // ✅ now it uses config.js
});

// Attach token if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;