import { useEffect, useRef, useState } from 'react';
import {
  productsApi,
  type Product,
  type ProductSortOrder as ProductSortOrderType,
} from '../../../api/products.api';

const PRODUCTS_PER_PAGE = 10;

interface UseProductsCatalogResult {
  products: Product[];
  availableCategories: string[];
  selectedCategories: string[];
  selectedSort: ProductSortOrderType | undefined;
  isProductsLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  productsErrorMessage: string | null;
  bottomSentinelRef: React.RefObject<HTMLDivElement | null>;
  setSelectedSort: (sort: ProductSortOrderType | undefined) => void;
  handleToggleCategory: (category: string) => void;
  handleClearCategories: () => void;
}

export const useProductsCatalog = (selectedShopId: string | null): UseProductsCatalogResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<ProductSortOrderType | undefined>();
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [productsErrorMessage, setProductsErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

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
    setCurrentPage(1);
    setHasMore(true);
    setProducts([]);
  }, [selectedCategories, selectedSort]);

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

  return {
    products,
    availableCategories,
    selectedCategories,
    selectedSort,
    isProductsLoading,
    isLoadingMore,
    hasMore,
    productsErrorMessage,
    bottomSentinelRef,
    setSelectedSort,
    handleToggleCategory,
    handleClearCategories,
  };
};
