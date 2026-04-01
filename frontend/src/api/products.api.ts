import { apiClient } from './api.client';

export interface Product {
  id: string;
  shopId: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

export interface ProductsQueryParams {
  categories?: string[];
  sort?: string;
}

export const productsApi = {
  getByShopId: async (shopId: string, query?: ProductsQueryParams): Promise<Product[]> => {
    const params: Record<string, string> = {};

    if (query?.categories && query.categories.length > 0) {
      params.category = query.categories.join(',');
    }

    if (query?.sort) {
      params.sort = query.sort;
    }

    const response = await apiClient.get<{ data: Product[] }>(`/shops/${shopId}/products`, { params });
    return response.data.data;
  },
};
