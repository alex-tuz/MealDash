export const API_DEFAULT_BASE_URL = '/api';
export const API_TIMEOUT_MS = 10_000;

export const HTTP_STATUS = {
  notFound: 404,
  serverErrorMin: 500,
} as const;

export const API_ERROR_MESSAGES = {
  network: 'Network error. Check your connection.',
  notFound: 'Requested resource was not found.',
  server: 'Server error. Please try again later.',
} as const;
