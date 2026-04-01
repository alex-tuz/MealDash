import { useMemo, useState } from 'react';
import type { Product } from '../api/products.api';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isImageBroken, setIsImageBroken] = useState(false);
  const fallbackLabel = useMemo(() => product.name.charAt(0).toUpperCase(), [product.name]);

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 h-full">
      <div className="flex h-40 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 flex-shrink-0">
        {!isImageBroken && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full rounded-xl object-cover"
            loading="lazy"
            onError={() => setIsImageBroken(true)}
          />
        ) : (
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
            {fallbackLabel}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-3 flex-grow flex flex-col">
        <h3 className="text-base font-semibold text-slate-900 line-clamp-2">{product.name}</h3>

        <div className="mt-auto flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900">${product.price.toFixed(2)}</p>

          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="shrink-0 whitespace-nowrap rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
};
