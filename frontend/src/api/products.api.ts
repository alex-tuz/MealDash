import { apiClient } from './api.client';

export const ProductSortOrder = {
  PriceAsc: 'price_asc',
  PriceDesc: 'price_desc',
  NameAz: 'name_az',
} as const;

export type ProductSortOrder = (typeof ProductSortOrder)[keyof typeof ProductSortOrder];

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
  sort?: ProductSortOrder;
  page?: number;
  limit?: number;
}

export const productsApi = {
  getByShopId: async (shopId: string, query?: ProductsQueryParams): Promise<Product[]> => {
    const params: Record<string, string | number> = {};

    if (query?.categories && query.categories.length > 0) {
      params.category = query.categories.join(',');
    }

    if (query?.sort) {
      params.sort = query.sort;
    }

    if (query?.page !== undefined) {
      params.page = query.page;
    }

    if (query?.limit !== undefined) {
      params.limit = query.limit;
    }

    const response = await apiClient.get<{ data: Product[] }>(`/shops/${shopId}/products`, { params });
    return response.data.data;
  },
};
