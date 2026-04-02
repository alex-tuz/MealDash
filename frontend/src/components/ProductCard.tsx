import { useMemo, useState } from 'react';
import type { Product } from '../api/products.api';
import { useCartStore } from '../store';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isImageBroken, setIsImageBroken] = useState(false);
  const fallbackLabel = useMemo(() => product.name.charAt(0).toUpperCase(), [product.name]);
  const isFavorite = useCartStore((state) =>
    state.favoriteItems.some((item) => item.id === product.id),
  );
  const toggleFavorite = useCartStore((state) => state.toggleFavorite);

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 h-full">
      <div className="relative flex h-40 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 flex-shrink-0">
        <button
          type="button"
          onClick={() => toggleFavorite(product)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={isFavorite}
          className={`absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
            isFavorite
              ? 'border-rose-300 bg-rose-100 text-rose-600'
              : 'border-slate-300 bg-white text-slate-500 hover:bg-slate-100'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
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
