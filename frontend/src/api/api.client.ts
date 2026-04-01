import axios from 'axios';
import { API_DEFAULT_BASE_URL, API_TIMEOUT_MS } from './api.constants';
import { handleApiError } from './api.errors';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? API_DEFAULT_BASE_URL,
  timeout: API_TIMEOUT_MS,
});

apiClient.interceptors.response.use((response) => response, handleApiError);
