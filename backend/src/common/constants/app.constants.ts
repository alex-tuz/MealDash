export const SERVICE_NAME = 'food-delivery-backend';

export const API_ROUTES = {
  health: '/health',
} as const;

export const HTTP_STATUS = {
  ok: 200,
  badRequest: 400,
  notFound: 404,
  internalServerError: 500,
  notImplemented: 501,
} as const;

export const ERROR_CODES = {
  appError: 'APP_ERROR',
  notFound: 'NOT_FOUND',
  internalServerError: 'INTERNAL_SERVER_ERROR',
  notImplemented: 'NOT_IMPLEMENTED',
} as const;

export const DATABASE = {
  healthcheckQuery: 'SELECT 1',
} as const;
