import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { CartPage } from './pages/cart';
import { CouponsPage } from './pages/coupons';
import { FavoritesPage } from './pages/favorites';
import { NotFoundPage } from './pages/not-found';
import { ShopsPage } from './pages/shops';
import { OrderHistoryPage } from './pages/order-history';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ShopsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
