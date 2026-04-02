import { ProductGrid } from '../../components/ProductGrid';
import { selectFavoriteItems, useCartStore } from '../../store';

export const FavoritesPage = () => {
  const favoriteItems = useCartStore(selectFavoriteItems);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <section className="space-y-4 md:space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Favorites</h1>
        <p className="mt-1 text-sm md:text-base text-slate-600">Quick access to products you liked.</p>
      </header>

      {favoriteItems.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          No favorite items yet. Tap the heart icon on product cards to save them.
        </p>
      ) : (
        <ProductGrid
          products={favoriteItems}
          isLoading={false}
          errorMessage={null}
          onAddToCart={addItem}
        />
      )}
    </section>
  );
};
