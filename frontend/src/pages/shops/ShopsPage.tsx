import { ProductFiltersPanel } from './ui/ProductFiltersPanel';
import { ProductsSection } from './ui/ProductsSection';
import { ShopsSidebar } from './ui/ShopsSidebar';
import { AddToCartToast } from './ui/AddToCartToast';
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
      {isLoading && <p className="text-sm md:text-base text-slate-600">Loading shops...</p>}

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
