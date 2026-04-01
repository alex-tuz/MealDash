import { NavLink, Outlet } from 'react-router-dom';

const baseNavClassName =
  'rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-lg font-semibold tracking-tight">MealDash</p>
          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${baseNavClassName} ${
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
                `${baseNavClassName} ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`
              }
            >
              Shopping Cart
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
