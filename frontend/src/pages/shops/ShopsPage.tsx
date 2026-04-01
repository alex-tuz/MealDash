import { ProductFiltersPanel } from './ui/ProductFiltersPanel';
import { ProductsSection } from './ui/ProductsSection';
import { ShopsSidebar } from './ui/ShopsSidebar';
import { AddToCartToast } from './ui/AddToCartToast';
import { ProductsGridSkeleton, ShopsSidebarSkeleton } from './ui/ShopsSkeletons';
import { useShopsPageLogic } from './model/useShopsPageLogic';
import { RATING_RANGES } from './model/shops.types';

export const ShopsPage = () => {
  const {
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
  } = useShopsPageLogic();

  return (
    <section className="space-y-4 md:space-y-6">
      {isLoading && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
          <ShopsSidebarSkeleton />
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 md:p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="md:col-span-2">
                  <div className="mb-3 h-4 w-24 rounded bg-slate-200 animate-pulse" />
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="h-7 w-20 rounded-full bg-slate-200 animate-pulse" />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 h-4 w-16 rounded bg-slate-200 animate-pulse" />
                  <div className="h-10 w-full rounded-lg bg-slate-200 animate-pulse" />
                </div>
              </div>
            </div>
            <ProductsGridSkeleton />
          </div>
        </div>
      )}

      {!isLoading && errorMessage && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
          <ShopsSidebar
            shops={shops}
            filteredShops={filteredShops}
            selectedShopId={selectedShopId}
            selectedRatingRange={selectedRatingRange}
            ratingRanges={RATING_RANGES}
            onShopSelect={setSelectedShopId}
            onRatingFilterChange={handleRatingFilterChange}
          />

          <div className="space-y-4">
            <ProductFiltersPanel
              availableCategories={availableCategories}
              selectedCategories={selectedCategories}
              selectedSort={selectedSort}
              onToggleCategory={handleToggleCategory}
              onClearCategories={handleClearCategories}
              onSortChange={setSelectedSort}
            />

            <ProductsSection
              products={products}
              isProductsLoading={isProductsLoading}
              productsErrorMessage={productsErrorMessage}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              bottomSentinelRef={bottomSentinelRef}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      )}

      <AddToCartToast message={addedToCartMessage} />
    </section>
  );
};
