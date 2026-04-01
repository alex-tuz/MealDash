import { useEffect, useMemo, useRef, useState } from 'react';
import {
  productsApi,
  type Product,
  type ProductSortOrder as ProductSortOrderType,
} from '../../../api/products.api';
import { shopsApi, type Shop } from '../../../api/shops.api';
import { useCartStore } from '../../../store';
import { type RatingRange } from './shops.types';

const PRODUCTS_PER_PAGE = 10;

export const useShopsPageLogic = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<ProductSortOrderType | undefined>();
  const [selectedRatingRange, setSelectedRatingRange] = useState<RatingRange | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [productsErrorMessage, setProductsErrorMessage] = useState<string | null>(null);
  const [addedToCartMessage, setAddedToCartMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    let isMounted = true;

    const loadShops = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await shopsApi.getAll();

        if (!isMounted) {
          return;
        }

        setShops(data);
        setSelectedShopId(data[0]?.id ?? null);
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage('Failed to load shops. Please try again.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadShops();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setSelectedCategories([]);
    setAvailableCategories([]);
    setSelectedSort(undefined);
    setCurrentPage(1);
    setHasMore(true);
    setProducts([]);
  }, [selectedShopId]);

  useEffect(() => {
    if (!selectedShopId) {
      return;
    }

    let isMounted = true;

    const loadAvailableCategories = async () => {
      try {
        const data = await productsApi.getByShopId(selectedShopId);

        if (!isMounted) {
          return;
        }

        const categories = Array.from(new Set(data.map((product) => product.category))).sort((a, b) =>
          a.localeCompare(b),
        );

        setAvailableCategories(categories);
      } catch {
        if (isMounted) {
          setAvailableCategories([]);
        }
      }
    };

    loadAvailableCategories();

    return () => {
      isMounted = false;
    };
  }, [selectedShopId]);

  useEffect(() => {
    if (!selectedShopId) {
      setProducts([]);
      setProductsErrorMessage(null);
      return;
    }

    let isMounted = true;

    const loadProducts = async () => {
      const isInitialLoad = currentPage === 1;
      if (isInitialLoad) {
        setIsProductsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      if (isInitialLoad) {
        setProductsErrorMessage(null);
      }

      try {
        const data = await productsApi.getByShopId(selectedShopId, {
          categories: selectedCategories,
          sort: selectedSort,
          page: currentPage,
          limit: PRODUCTS_PER_PAGE,
        });

        if (!isMounted) {
          return;
        }

        if (isInitialLoad) {
          setProducts(data);
        } else {
          setProducts((prev) => [...prev, ...data]);
        }

        setHasMore(data.length === PRODUCTS_PER_PAGE);
      } catch {
        if (!isMounted) {
          return;
        }

        if (isInitialLoad) {
          setProducts([]);
          setProductsErrorMessage('Failed to load products. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsProductsLoading(false);
          setIsLoadingMore(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [selectedShopId, selectedCategories, selectedSort, currentPage]);

  useEffect(() => {
    if (!bottomSentinelRef.current || !hasMore || isLoadingMore || isProductsLoading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(bottomSentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, isProductsLoading]);

  useEffect(() => {
    if (!addedToCartMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setAddedToCartMessage(null);
    }, 1600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [addedToCartMessage]);

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    setProducts([]);
  }, [selectedCategories, selectedSort]);

  const filteredShops = useMemo(() => {
    if (!selectedRatingRange) {
      return shops;
    }

    return shops.filter(
      (shop) => shop.rating >= selectedRatingRange.min && shop.rating <= selectedRatingRange.max,
    );
  }, [shops, selectedRatingRange]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setAddedToCartMessage(`${product.name} was added to cart`);
  };

  const handleToggleCategory = (category: string) => {
    setSelectedCategories((previous) => {
      const isSelected = previous.includes(category);

      if (isSelected) {
        return previous.filter((item) => item !== category);
      }

      return [...previous, category];
    });
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
  };

  const handleRatingFilterChange = (range: RatingRange | null) => {
    setSelectedRatingRange(range);

    if (range) {
      const matchingShops = shops.filter((shop) => shop.rating >= range.min && shop.rating <= range.max);

      if (matchingShops.length > 0 && !matchingShops.find((shop) => shop.id === selectedShopId)) {
        setSelectedShopId(matchingShops[0].id);
      } else if (matchingShops.length === 0) {
        setSelectedShopId(null);
      }
      return;
    }

    if (shops.length > 0) {
      setSelectedShopId(shops[0].id);
    }
  };

  return {
    shops,
    filteredShops,
    products,
    availableCategories,
    selectedCategories,
    selectedSort,
    selectedRatingRange,
    selectedShopId,
    isLoading,
    isProductsLoading,
    isLoadingMore,
    hasMore,
    errorMessage,
    productsErrorMessage,
    addedToCartMessage,
    bottomSentinelRef,
    setSelectedShopId,
    setSelectedSort,
    handleAddToCart,
    handleToggleCategory,
    handleClearCategories,
    handleRatingFilterChange,
  };
};
