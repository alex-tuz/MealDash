import { type CartItem } from '../../../store';
import { QTY_MIN, QTY_STEP } from '../model/cart.types';

interface CartItemsListProps {
  items: CartItem[];
  brokenImages: Record<string, boolean>;
  onImageError: (itemId: string) => void;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onSetQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export const CartItemsList = ({
  items,
  brokenImages,
  onImageError,
  onIncrement,
  onDecrement,
  onSetQuantity,
  onRemove,
}: CartItemsListProps) => {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-slate-200 bg-white p-3 md:p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-16 w-20 sm:w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl md:rounded-2xl border border-slate-200 bg-slate-50">
                {item.image && !brokenImages[item.id] ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={() => onImageError(item.id)}
                  />
                ) : (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                    {item.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm md:text-base font-semibold text-slate-900">{item.name}</h2>
                <p className="mt-1 text-xs md:text-sm text-slate-600">${item.price.toFixed(2)} each</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => onDecrement(item.id)}
                className="h-8 w-8 min-h-[44px] min-w-[44px] sm:h-auto sm:w-auto sm:min-h-0 sm:min-w-0 rounded-lg border border-slate-300 px-2 sm:px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-8 text-center text-xs md:text-sm font-semibold text-slate-900">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onIncrement(item.id)}
                className="h-8 w-8 min-h-[44px] min-w-[44px] sm:h-auto sm:w-auto sm:min-h-0 sm:min-w-0 rounded-lg border border-slate-300 px-2 sm:px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                aria-label="Increase quantity"
              >
                +
              </button>
              <label className="sr-only" htmlFor={`quantity-${item.id}`}>
                Quantity for {item.name}
              </label>
              <input
                id={`quantity-${item.id}`}
                type="number"
                min={QTY_MIN}
                step={QTY_STEP}
                value={item.quantity}
                onChange={(event) => onSetQuantity(item.id, Number.parseInt(event.target.value, 10))}
                className="hidden sm:inline-block w-14 sm:w-16 rounded-lg border border-slate-300 px-2 py-1 text-center text-xs md:text-sm text-slate-900"
              />
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="rounded-lg border border-red-200 px-2 sm:px-3 py-1 text-xs md:text-sm font-medium text-red-700 hover:bg-red-50 transition whitespace-nowrap"
              >
                Remove
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
