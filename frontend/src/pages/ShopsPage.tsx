import { useEffect, useState, useRef } from 'react';
import { productsApi, type Product, ProductSortOrder, type ProductSortOrder as ProductSortOrderType } from '../api/products.api';
import { shopsApi, type Shop } from '../api/shops.api';
import { ProductGrid } from '../components/ProductGrid';
import { useCartStore } from '../store';

const formatCategoryLabel = (category: string): string =>
  category
    .split(/[_\s-]+/)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

interface RatingRange {
  min: number;
  max: number;
  label: string;
}

const RATING_RANGES: RatingRange[] = [
  { min: 4.0, max: 5.0, label: '4.0 - 5.0 ⭐' },
  { min: 3.0, max: 3.99, label: '3.0 - 3.99 ⭐' },
  { min: 2.0, max: 2.99, label: '2.0 - 2.99 ⭐' },
  { min: 1.0, max: 1.99, label: '1.0 - 1.99 ⭐' },
];

export const ShopsPage = () => {
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
  const observerRef = useRef<IntersectionObserver | null>(null);
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
          limit: 30,
        });

        if (!isMounted) {
          return;
        }

        if (isInitialLoad) {
          setProducts(data);
        } else {
          setProducts((prev) => [...prev, ...data]);
        }

        setHasMore(data.length === 30);
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
    observerRef.current = observer;

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

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setAddedToCartMessage(`${product.name} was added to cart`);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((previous) => {
      const isSelected = previous.includes(category);

      if (isSelected) {
        return previous.filter((item) => item !== category);
      }

      return [...previous, category];
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    setProducts([]);
  }, [selectedCategories, selectedSort]);

  const filteredShops = selectedRatingRange
    ? shops.filter((shop) => shop.rating >= selectedRatingRange.min && shop.rating <= selectedRatingRange.max)
    : shops;

  const handleRatingFilterChange = (range: RatingRange | null) => {
    setSelectedRatingRange(range);

    if (range) {
      const matchingShops = shops.filter(
        (shop) => shop.rating >= range.min && shop.rating <= range.max,
      );

      if (matchingShops.length > 0 && !matchingShops.find((s) => s.id === selectedShopId)) {
        setSelectedShopId(matchingShops[0].id);
      } else if (matchingShops.length === 0) {
        setSelectedShopId(null);
      }
    } else {
      if (shops.length > 0) {
        setSelectedShopId(shops[0].id);
      }
    }
  };

  return (
    <section className="space-y-4 md:space-y-6">
      {isLoading && <p className="text-sm md:text-base text-slate-600">Loading shops...</p>}

      {!isLoading && errorMessage && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-3 md:p-4 min-h-[calc(100dvh-10rem)]">
            <h2 className="mb-3 text-xs md:text-sm font-semibold uppercase tracking-wide text-slate-500">Shop list</h2>

            <div className="mb-3">
              <select
                value={selectedRatingRange ? `${selectedRatingRange.min}-${selectedRatingRange.max}` : 'all'}
                onChange={(e) => {
                  if (e.target.value === 'all') {
                    handleRatingFilterChange(null);
                  } else {
                    const selected = RATING_RANGES.find((r) => `${r.min}-${r.max}` === e.target.value);
                    if (selected) handleRatingFilterChange(selected);
                  }
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs md:text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-0"
              >
                <option value="all">All Ratings ({shops.length})</option>
                {RATING_RANGES.map((range) => {
                  const count = shops.filter((s) => s.rating >= range.min && s.rating <= range.max).length;
                  return (
                    <option key={`${range.min}-${range.max}`} value={`${range.min}-${range.max}`}>
                      {range.label} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="border-t border-slate-200 pt-3">
              {filteredShops.length === 0 ? (
                <p className="text-xs md:text-sm text-slate-600">No shops found.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                  {filteredShops.map((shop) => {
                    const isActive = selectedShopId === shop.id;

                    return (
                      <button
                        key={shop.id}
                        type="button"
                        onClick={() => setSelectedShopId(shop.id)}
                        className={`w-full rounded-xl border px-3 py-2 text-center md:text-left text-xs md:text-sm font-medium transition-colors duration-200 min-h-[44px] ${
                          isActive
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {shop.image ? (
                            <img
                              src={shop.image}
                              alt={`${shop.name} logo`}
                              className="h-6 w-6 rounded-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <span
                              className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${
                                isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {shop.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <span className="truncate text-left">{shop.name}</span>
                          <span className="ml-auto text-[11px] font-semibold">{shop.rating}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 md:p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="md:col-span-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <p className="text-xs md:text-sm font-semibold uppercase tracking-wide text-slate-500">Categories</p>
                    {selectedCategories.length > 0 && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableCategories.length === 0 ? (
                      <p className="text-xs text-slate-500">No categories available for this shop.</p>
                    ) : (
                      availableCategories.map((category) => {
                        const isSelected = selectedCategories.includes(category);

                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => toggleCategory(category)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                              isSelected
                                ? 'border-slate-900 bg-slate-900 text-white'
                                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {formatCategoryLabel(category)}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="sort" className="block text-xs md:text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
                    Sort by
                  </label>
                  <select
                    id="sort"
                    value={selectedSort ?? ''}
                    onChange={(e) => setSelectedSort((e.target.value as ProductSortOrderType) || undefined)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:border-slate-900 focus:outline-none"
                  >
                    <option value="">Default</option>
                    <option value={ProductSortOrder.NameAz}>Name (A→Z)</option>
                    <option value={ProductSortOrder.PriceAsc}>Price (↑)</option>
                    <option value={ProductSortOrder.PriceDesc}>Price (↓)</option>
                  </select>
                </div>
              </div>
            </div>

            {isProductsLoading && <p className="text-sm md:text-base text-slate-600">Loading products...</p>}

            {!isProductsLoading && productsErrorMessage && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {productsErrorMessage}
              </p>
            )}

            {!isProductsLoading && !productsErrorMessage && (
              <>
                <ProductGrid
                  products={products}
                  isLoading={isProductsLoading}
                  errorMessage={productsErrorMessage}
                  onAddToCart={handleAddToCart}
                />
                {isLoadingMore && (
                  <div className="py-4 text-center">
                    <p className="text-sm text-slate-600">Loading more products...</p>
                  </div>
                )}
                {hasMore && <div ref={bottomSentinelRef} className="h-4" />}
                {!hasMore && products.length > 0 && (
                  <p className="text-center text-sm text-slate-500 py-4">No more products to load</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {addedToCartMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg"
        >
          {addedToCartMessage}
        </div>
      )}
    </section>
  );
};
