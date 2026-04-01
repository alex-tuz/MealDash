import { useEffect, useState } from 'react';
import { productsApi, type Product } from '../api/products.api';
import { shopsApi, type Shop } from '../api/shops.api';
import { ProductGrid } from '../components/ProductGrid';
import { useCartStore } from '../store';

export const ShopsPage = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
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

  const selectedShop = shops.find((shop) => shop.id === selectedShopId) ?? null;

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
        const data = await productsApi.getByShopId(selectedShopId);

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
  }, [selectedShopId]);

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

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Shops</h1>

      {isLoading && <p className="text-slate-600">Loading shops...</p>}

      {!isLoading && errorMessage && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && (
        <div className="grid gap-4 md:grid-cols-[240px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Shop list</h2>

            {shops.length === 0 ? (
              <p className="text-sm text-slate-600">No shops found.</p>
            ) : (
              <div className="space-y-2">
                {shops.map((shop) => {
                  const isActive = selectedShopId === shop.id;

                  return (
                    <button
                      key={shop.id}
                      type="button"
                      onClick={() => setSelectedShopId(shop.id)}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors duration-200 ${
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

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {selectedShop ? selectedShop.name : 'Select a shop'}
              </h2>
            </div>

            <ProductGrid
              products={products}
              isLoading={isProductsLoading}
              errorMessage={productsErrorMessage}
              onAddToCart={handleAddToCart}
            />
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
