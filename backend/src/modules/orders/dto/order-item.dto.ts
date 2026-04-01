export interface OrderItemDto {
  productId: string;
  quantity: number;
}

export interface OrderItemSnapshotDto extends OrderItemDto {
  name: string;
  image: string;
  unitPrice: number;
}
