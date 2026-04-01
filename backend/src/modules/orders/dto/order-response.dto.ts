import { OrderItemDto } from "./order-item.dto";

export interface OrderResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPrice: number;
  items: OrderItemDto[];
  createdAt: string;
}
