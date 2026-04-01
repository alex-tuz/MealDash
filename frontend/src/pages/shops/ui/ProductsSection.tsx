import { type RefObject } from 'react';
import { type Product } from '../../../api/products.api';
import { ProductGrid } from '../../../components/ProductGrid';

interface ProductsSectionProps {
  products: Product[];
  isProductsLoading: boolean;
  productsErrorMessage: string | null;
  isLoadingMore: boolean;
  hasMore: boolean;
  bottomSentinelRef: RefObject<HTMLDivElement | null>;
  onAddToCart: (product: Product) => void;
}

export const ProductsSection = ({
  products,
  isProductsLoading,
  productsErrorMessage,
  isLoadingMore,
  hasMore,
  bottomSentinelRef,
  onAddToCart,
}: ProductsSectionProps) => {
  if (isProductsLoading) {
    return <p className="text-sm md:text-base text-slate-600">Loading products...</p>;
  }

  if (productsErrorMessage) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {productsErrorMessage}
      </p>
    );
  }

  return (
    <>
      <ProductGrid
        products={products}
        isLoading={isProductsLoading}
        errorMessage={productsErrorMessage}
        onAddToCart={onAddToCart}
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
  );
};
