import { NavLink, Outlet } from 'react-router-dom';
import { useCartStore, selectCartTotalItems, selectFavoritesCount } from '../store';

const baseNavClassName =
  'rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 relative';

export const AppLayout = () => {
  const cartTotalItems = useCartStore(selectCartTotalItems);
  const favoritesCount = useCartStore(selectFavoritesCount);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-start gap-4 sm:gap-6 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${baseNavClassName} text-xs sm:text-sm ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `${baseNavClassName} text-xs sm:text-sm relative ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`
              }
            >
              Shopping Cart
              {cartTotalItems > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold leading-none">
                  {cartTotalItems}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `${baseNavClassName} text-xs sm:text-sm relative ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`
              }
            >
              Favorites
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-rose-500 text-white text-xs font-bold leading-none">
                  {favoritesCount}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `${baseNavClassName} text-xs sm:text-sm ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`
              }
            >
              History
            </NavLink>
            <NavLink
              to="/coupons"
              className={({ isActive }) =>
                `${baseNavClassName} text-xs sm:text-sm ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`
              }
            >
              Coupons
            </NavLink>
          </nav>
          <p className="ml-auto text-lg font-semibold tracking-tight">MealDash</p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 pt-4 pb-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
