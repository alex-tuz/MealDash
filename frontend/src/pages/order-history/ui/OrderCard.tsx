import { useState } from 'react';
import { type CreatedOrder } from '../../../api/orders.api';
import { formatDate, formatPrice } from '../model/order-history.utils';

interface OrderCardProps {
  order: CreatedOrder;
  onReorder: (order: CreatedOrder) => void;
}

export const OrderCard = ({ order, onReorder }: OrderCardProps) => {
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{order.name}</h3>
          <p className="text-sm text-slate-600 mt-1">Order #{order.orderNumber}</p>
        </div>
        <div className="mt-3 md:mt-0 flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">{formatPrice(order.totalPrice)}</p>
            <p className="text-xs text-slate-600 mt-1">{formatDate(order.createdAt)}</p>
          </div>
          <button
            type="button"
            onClick={() => onReorder(order)}
            className="whitespace-nowrap rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Reorder
          </button>
        </div>
      </div>

      <div className="mb-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-600">Email</p>
            <p className="text-slate-900 font-medium">{order.email}</p>
          </div>
          <div>
            <p className="text-slate-600">Phone</p>
            <p className="text-slate-900 font-medium">{order.phone}</p>
          </div>
        </div>
        <div>
          <p className="text-slate-600 text-sm">Address</p>
          <p className="text-slate-900 font-medium">{order.address}</p>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h4 className="font-semibold text-slate-900 mb-3">Items</h4>
        <div className="space-y-2">
          {order.items.map((item, index) => {
            const imageKey = `${item.productId}-${index}`;

            return (
              <div key={imageKey} className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                {item.image && !brokenImages[imageKey] ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={() =>
                      setBrokenImages((current) => ({
                        ...current,
                        [imageKey]: true,
                      }))
                    }
                  />
                ) : (
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                    {item.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="text-slate-600">
                  {item.quantity} × {formatPrice(item.unitPrice)} = {formatPrice(item.unitPrice * item.quantity)}
                </p>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
