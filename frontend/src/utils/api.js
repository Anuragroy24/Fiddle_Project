import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const adjustTone = async (text, formalityLevel, friendlinessLevel) => {
  try {
    const response = await api.post('/adjust-tone', {
      text,
      formalityLevel,
      friendlinessLevel
    });
    
    return response.data.adjustedText;
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      if (status === 400) {
        throw new Error(data.error || 'Invalid request');
      } else if (status === 401) {
        throw new Error('API authentication failed');
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment.');
      } else if (status === 500) {
        throw new Error(data.error || 'Server error occurred');
      }
      throw new Error(`Request failed with status ${status}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error - please check your connection');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred');
    }
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not responding');
  }
};

export default api;
