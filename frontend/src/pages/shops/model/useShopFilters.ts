import { useMemo, useState } from 'react';
import { type Shop } from '../../../api/shops.api';
import { type RatingRange } from './shops.types';

interface UseShopFiltersResult {
  filteredShops: Shop[];
  selectedRatingRange: RatingRange | null;
  selectedShopId: string | null;
  setSelectedShopId: (shopId: string | null) => void;
  handleRatingFilterChange: (range: RatingRange | null) => void;
}

export const useShopFilters = (shops: Shop[]): UseShopFiltersResult => {
  const [selectedRatingRange, setSelectedRatingRange] = useState<RatingRange | null>(null);
  const [manualSelectedShopId, setManualSelectedShopId] = useState<string | null>(null);

  const filteredShops = useMemo(() => {
    if (!selectedRatingRange) {
      return shops;
    }

    return shops.filter(
      (shop) => shop.rating >= selectedRatingRange.min && shop.rating <= selectedRatingRange.max,
    );
  }, [shops, selectedRatingRange]);

  const selectedShopId = useMemo(() => {
    if (filteredShops.length === 0) {
      return null;
    }

    if (manualSelectedShopId && filteredShops.some((shop) => shop.id === manualSelectedShopId)) {
      return manualSelectedShopId;
    }

    return filteredShops[0].id;
  }, [filteredShops, manualSelectedShopId]);

  const handleRatingFilterChange = (range: RatingRange | null) => {
    setSelectedRatingRange(range);

    if (range) {
      const matchingShops = shops.filter((shop) => shop.rating >= range.min && shop.rating <= range.max);

      if (matchingShops.length > 0 && !matchingShops.find((shop) => shop.id === selectedShopId)) {
        setManualSelectedShopId(matchingShops[0].id);
      } else if (matchingShops.length === 0) {
        setManualSelectedShopId(null);
      }
      return;
    }

    if (shops.length > 0) {
      setManualSelectedShopId(shops[0].id);
    }
  };

  return {
    filteredShops,
    selectedRatingRange,
    selectedShopId,
    setSelectedShopId: setManualSelectedShopId,
    handleRatingFilterChange,
  };
};
