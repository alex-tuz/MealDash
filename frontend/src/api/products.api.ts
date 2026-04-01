import { apiClient } from './api.client';

export interface Product {
  id: string;
  shopId: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

export const productsApi = {
  getByShopId: async (shopId: string): Promise<Product[]> => {
    const response = await apiClient.get<{ data: Product[] }>(`/shops/${shopId}/products`);
    return response.data.data;
  },
};
