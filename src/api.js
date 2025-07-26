// File: src/api.js
import axios from 'axios';

// Get the backend API URL from environment variables.
// VITE_API_URL will be defined in the .env file for the frontend.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an instance of axios for your API
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  Add a request interceptor to include the JWT token in the
  Authorization header of every request if it exists in localStorage.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
