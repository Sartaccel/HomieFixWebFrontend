import axios from "axios";

// Global navigation reference for redirects
let globalNavigate = null;

export const setGlobalNavigate = (navigate) => {
  globalNavigate = navigate;
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://admin.homiefix.in/api",
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject({ 
        message: 'Request timeout. Please try again.' 
      });
    }

    // Handle 401 Unauthorized (token expired/invalid)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (globalNavigate) {
        globalNavigate('/');
      }
      return Promise.reject({
        message: 'Session expired. Please login again.'
      });
    }

    // Handle other HTTP errors
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage = 'An error occurred';

      if (data && data.message) {
        errorMessage = data.message;
      } else if (status === 403) {
        errorMessage = 'You do not have permission for this action';
      } else if (status === 404) {
        errorMessage = 'Resource not found';
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      return Promise.reject({ 
        message: errorMessage,
        status,
        data
      });
    }

    return Promise.reject(error);
  }
);

export default api;