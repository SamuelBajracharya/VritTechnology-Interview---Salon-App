import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for clear error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log API errors in development for easier debugging
    const errorMessage = error.response?.data || error.message;
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

export default api;
