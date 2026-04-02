import { type ShopsSidebarProps } from '../model/shops.types';

export const ShopsSidebar = ({
  shops,
  filteredShops,
  selectedShopId,
  selectedRatingRange,
  ratingRanges,
  onShopSelect,
  onRatingFilterChange,
}: ShopsSidebarProps) => {
  return (
    <aside className="self-start rounded-2xl border border-slate-200 bg-white p-3 md:p-4 md:sticky md:top-16 md:h-[calc(100dvh-8rem)] md:overflow-y-auto">
      <h2 className="mb-3 text-xs md:text-sm font-semibold uppercase tracking-wide text-slate-500">Shop list</h2>

      <div className="mb-3">
        <select
          value={selectedRatingRange ? `${selectedRatingRange.min}-${selectedRatingRange.max}` : 'all'}
          onChange={(e) => {
            if (e.target.value === 'all') {
              onRatingFilterChange(null);
              return;
            }

            const selected = ratingRanges.find((range) => `${range.min}-${range.max}` === e.target.value);
            if (selected) {
              onRatingFilterChange(selected);
            }
          }}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs md:text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-0"
        >
          <option value="all">All Ratings ({shops.length})</option>
          {ratingRanges.map((range) => {
            const count = shops.filter((shop) => shop.rating >= range.min && shop.rating <= range.max).length;
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
                  onClick={() => onShopSelect(shop.id)}
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
  );
};
