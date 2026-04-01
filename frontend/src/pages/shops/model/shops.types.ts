import { type ProductSortOrder } from '../../../api/products.api';
import { type Shop } from '../../../api/shops.api';

export interface RatingRange {
  min: number;
  max: number;
  label: string;
}

export const RATING_RANGES: RatingRange[] = [
  { min: 4.0, max: 5.0, label: '4.0 - 5.0 ⭐' },
  { min: 3.0, max: 3.99, label: '3.0 - 3.99 ⭐' },
  { min: 2.0, max: 2.99, label: '2.0 - 2.99 ⭐' },
  { min: 1.0, max: 1.99, label: '1.0 - 1.99 ⭐' },
];

export const formatCategoryLabel = (category: string): string =>
  category
    .split(/[_\s-]+/)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export interface ShopsSidebarProps {
  shops: Shop[];
  filteredShops: Shop[];
  selectedShopId: string | null;
  selectedRatingRange: RatingRange | null;
  ratingRanges: RatingRange[];
  onShopSelect: (shopId: string) => void;
  onRatingFilterChange: (range: RatingRange | null) => void;
}

export interface ProductFiltersPanelProps {
  availableCategories: string[];
  selectedCategories: string[];
  selectedSort?: ProductSortOrder;
  onToggleCategory: (category: string) => void;
  onClearCategories: () => void;
  onSortChange: (sort?: ProductSortOrder) => void;
}
