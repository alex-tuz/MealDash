import axios from 'axios';

const DEFAULT_API_BASE_URL = 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status as number;

      if (status >= 500) {
        console.error('Server error. Please try again later.');
      } else if (status === 404) {
        console.error('Requested resource was not found.');
      }
    } else {
      console.error('Network error. Check your connection.');
    }

    return Promise.reject(error);
  },
);
