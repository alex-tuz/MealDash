import { OrderItemDto } from "./order-item.dto";

export interface CreateOrderDto {
  name: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItemDto[];
}
