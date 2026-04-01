export enum ProductSortOrder {
  priceAsc = 'price_asc',
  priceDesc = 'price_desc',
  nameAz = 'name_az',
}

export interface ProductQueryDto {
  category?: string;
  sort?: ProductSortOrder;
  page?: number;
  limit?: number;
}
