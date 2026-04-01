import { apiClient } from './api.client';

export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  items: CreateOrderItemPayload[];
  couponCode?: string;
}

export interface CreatedOrderItem {
  productId: string;
  quantity: number;
  name: string;
  image: string;
  unitPrice: number;
}

export interface CreatedOrder {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPrice: number;
  items: CreatedOrderItem[];
  createdAt: string;
}

export interface CreateOrderResult {
  status: number;
  order: CreatedOrder;
}

export const ordersApi = {
  create: async (payload: CreateOrderPayload): Promise<CreateOrderResult> => {
    const response = await apiClient.post<{ data: CreatedOrder }>('/orders', payload);
    return {
      status: response.status,
      order: response.data.data,
    };
  },

  search: async (email?: string, phone?: string, orderId?: string): Promise<CreatedOrder[]> => {
    const params: Record<string, string> = {};

    if (email) {
      params.email = email;
    }

    if (phone) {
      params.phone = phone;
    }

    if (orderId) {
      params.id = orderId;
    }

    const response = await apiClient.get<{ data: CreatedOrder[] }>('/orders', { params });
    return response.data.data;
  },
};
