import axios from 'axios';

// Create an Axios instance with default settings
const apiClient = axios.create({
    baseURL: 'https://your-backend-endpoint.com/api', // Replace with your actual backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log or handle the error globally if needed
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error.response || error.message);
    }
);

/**
 * Generic GET request
 * @param {string} endpoint - The API endpoint
 * @param {Object} params - Query parameters (optional)
 */
export const get = (endpoint, params) =>
    apiClient.get(endpoint, { params });

/**
 * Generic POST request
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The data to send in the request body
 */
export const post = (endpoint, data) =>
    apiClient.post(endpoint, data);

/**
 * Generic PUT request
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The data to send in the request body
 */
export const put = (endpoint, data) =>
    apiClient.put(endpoint, data);

/**
 * Generic DELETE request
 * @param {string} endpoint - The API endpoint
 */
export const del = (endpoint) =>
    apiClient.delete(endpoint);
