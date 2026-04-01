import type { AxiosError } from 'axios';
import { API_ERROR_MESSAGES, HTTP_STATUS } from './api.constants';

export const handleApiError = (error: AxiosError): Promise<never> => {
  const status = error.response?.status;

  if (typeof status === 'number') {
    if (status >= HTTP_STATUS.serverErrorMin) {
      console.error(API_ERROR_MESSAGES.server);
    } else if (status === HTTP_STATUS.notFound) {
      console.error(API_ERROR_MESSAGES.notFound);
    }
  } else {
    console.error(API_ERROR_MESSAGES.network);
  }

  return Promise.reject(error);
};
