import { type CreatedOrder } from '../../../api/orders.api';
import { OrderCard } from './OrderCard';

interface OrderResultsSectionProps {
  orders: CreatedOrder[];
  onReorder: (order: CreatedOrder) => void;
}

export const OrderResultsSection = ({ orders, onReorder }: OrderResultsSectionProps) => {
  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">
        Found {orders.length} order{orders.length !== 1 ? 's' : ''}
      </h2>

      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onReorder={onReorder} />
      ))}
    </div>
  );
};
