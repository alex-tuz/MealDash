export enum ShopSortOrder {
  nameAsc = 'name_asc',
  nameDesc = 'name_desc',
  ratingAsc = 'rating_asc',
  ratingDesc = 'rating_desc',
}

export interface ShopFilterDto {
  sort?: ShopSortOrder;
  minRating?: number;
  maxRating?: number;
}
