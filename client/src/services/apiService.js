import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Service object with all endpoints
export const apiService = {
  // Get latest AI predictions for plants
  getPredictions: async () => {
    try {
      const response = await api.get('/predict');
      return response.data;
    } catch (error) {
      console.error('Error fetching predictions:', error);
      throw new Error('Failed to fetch plant predictions');
    }
  },

  // Get latest sensor readings
  getSensors: async () => {
    try {
      const response = await api.get('/sensors');
      return response.data;
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw new Error('Failed to fetch sensor data');
    }
  },

  // Send spray command
  sendSprayCommand: async (sprayData) => {
    try {
      const response = await api.post('/spray', sprayData);
      return response.data;
    } catch (error) {
      console.error('Error sending spray command:', error);
      throw new Error('Failed to execute spray command');
    }
  },

  // Get history logs
  getHistory: async (type = null, limit = 50) => {
    try {
      const params = { limit };
      if (type) {
        params.type = type;
      }
      const response = await api.get('/history', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching history logs:', error);
      throw new Error('Failed to fetch history logs');
    }
  },

  // Get predictions history only
  getPredictionsHistory: async (limit = 50) => {
    return apiService.getHistory('predictions', limit);
  },

  // Get sensors history only
  getSensorsHistory: async (limit = 50) => {
    return apiService.getHistory('sensors', limit);
  },

  // Get sprays history only
  getSpraysHistory: async (limit = 50) => {
    return apiService.getHistory('sprays', limit);
  },
};

// Export the axios instance for custom requests
export default api;
