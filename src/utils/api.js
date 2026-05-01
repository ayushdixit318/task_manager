import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api',
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
