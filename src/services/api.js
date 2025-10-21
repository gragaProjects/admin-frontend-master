import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.assisthealth.cloud';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

// Add request interceptor for auth token and content type
api.interceptors.request.use(
  (config) => {
    // Log request data
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data instanceof FormData 
        ? 'FormData (file upload)' 
        : config.data
    });
    
    // Don't modify content-type if it's FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Success Response:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data
    });
    
    // Return the entire response data, not just response.data
    return response.data;
  },
  (error) => {
    // Don't log 500 errors as errors since we handle them gracefully
    if (error.response?.status !== 500) {
      console.error('API Error Response:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        error: error.message,
        details: error.response?.data?.errors || error.response?.data?.message
      });
    } else {
      console.log('API 500 Error (handled gracefully):', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status
      });
    }

    // Handle errors (401, 403, etc.)
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
    
    // Reject with the error response data if available
    return Promise.reject(error.response?.data || error);
  }
);

export default api; 