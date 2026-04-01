import { apiClient } from './api.client';

export interface Shop {
  id: string;
  name: string;
  image: string;
  rating: number;
}

export const shopsApi = {
  getAll: async (): Promise<Shop[]> => {
    const response = await apiClient.get<{ data: Shop[] }>('/shops');
    return response.data.data;
  },
};
