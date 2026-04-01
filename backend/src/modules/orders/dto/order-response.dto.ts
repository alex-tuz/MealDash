import { OrderItemSnapshotDto } from './order-item.dto';

export interface OrderResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPrice: number;
  items: OrderItemSnapshotDto[];
  createdAt: string;
}
