import { apiClient } from './api.client';

export interface Coupon {
  id: string;
  name: string;
  code: string;
  discountPercent: number;
  image: string;
}

export const couponsApi = {
  getAll: async (): Promise<Coupon[]> => {
    const response = await apiClient.get<{ data: Coupon[] }>('/coupons');
    return response.data.data;
  },

  apply: async (code: string): Promise<Coupon> => {
    const response = await apiClient.post<{ data: Coupon }>('/coupons/apply', { code });
    return response.data.data;
  },
};
