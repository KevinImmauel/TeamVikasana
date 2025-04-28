import axios from 'axios';
import sessionManager from './sessionManager';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    // Get token from session manager
    const token = sessionManager.getToken();
    
    // If token exists and is valid, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common response scenarios
api.interceptors.response.use(
  (response) => {
    // Return successful responses
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized responses (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Use sessionManager to handle unauthorized response
      // Pass null as we don't have direct access to logout function here
      sessionManager.handleUnauthorized();
    }
    
    // Pass the error to the calling function
    return Promise.reject(error);
  }
);

export default api;