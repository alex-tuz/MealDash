import type { Product } from '../api/products.api';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  errorMessage: string | null;
  onAddToCart: (product: Product) => void;
}

export const ProductGrid = ({
  products,
  isLoading,
  errorMessage,
  onAddToCart,
}: ProductGridProps) => {
  if (isLoading) {
    return <p className="text-xs md:text-sm text-slate-600">Loading products...</p>;
  }

  if (errorMessage) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {errorMessage}
      </p>
    );
  }

  if (products.length === 0) {
    return <p className="text-xs md:text-sm text-slate-600">No products found for this shop.</p>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};
