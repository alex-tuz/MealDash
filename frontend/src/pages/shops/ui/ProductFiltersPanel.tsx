import { ProductSortOrder } from '../../../api/products.api';
import { formatCategoryLabel, type ProductFiltersPanelProps } from '../model/shops.types';

export const ProductFiltersPanel = ({
  availableCategories,
  selectedCategories,
  selectedSort,
  onToggleCategory,
  onClearCategories,
  onSortChange,
}: ProductFiltersPanelProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 md:p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-wide text-slate-500">Categories</p>
            {selectedCategories.length > 0 && (
              <button
                type="button"
                onClick={onClearCategories}
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
                    onClick={() => onToggleCategory(category)}
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
            onChange={(e) => onSortChange((e.target.value as ProductSortOrder) || undefined)}
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
  );
};
