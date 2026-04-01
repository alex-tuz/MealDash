import { useEffect, useState } from 'react';
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

export const ShopsPage = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<ProductSortOrderType | undefined>();
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [productsErrorMessage, setProductsErrorMessage] = useState<string | null>(null);
  const [addedToCartMessage, setAddedToCartMessage] = useState<string | null>(null);
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
      setIsProductsLoading(true);
      setProductsErrorMessage(null);

      try {
        const data = await productsApi.getByShopId(selectedShopId, {
          categories: selectedCategories,
          sort: selectedSort,
        });

        if (!isMounted) {
          return;
        }

        setProducts(data);
      } catch {
        if (!isMounted) {
          return;
        }

        setProducts([]);
        setProductsErrorMessage('Failed to load products. Please try again.');
      } finally {
        if (isMounted) {
          setIsProductsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [selectedShopId, selectedCategories, selectedSort]);

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

            {shops.length === 0 ? (
              <p className="text-xs md:text-sm text-slate-600">No shops found.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {shops.map((shop) => {
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
                        <span className="truncate">{shop.name}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
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
              <ProductGrid
                products={products}
                isLoading={isProductsLoading}
                errorMessage={productsErrorMessage}
                onAddToCart={handleAddToCart}
              />
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
