import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ordersApi, type CreatedOrder } from '../api/orders.api';
import { useCartStore } from '../store';

const searchOrderSchema = z.object({
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().min(5, 'Phone must be at least 5 characters').optional().or(z.literal('')),
  orderId: z.string().uuid('Invalid order ID format').optional().or(z.literal('')),
}).refine(
  (data) => data.email || data.phone || data.orderId,
  {
    message: 'Please enter at least one search criteria',
    path: ['email'],
  }
);

type SearchOrderForm = z.infer<typeof searchOrderSchema>;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<CreatedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [reorderMessage, setReorderMessage] = useState<string | null>(null);
  const reorder = useCartStore((state) => state.reorder);

  const handleReorder = (order: CreatedOrder) => {
    const result = reorder(
      order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        name: item.name,
        image: item.image,
        unitPrice: item.unitPrice,
      })),
    );
    setReorderMessage(result.message);
    setTimeout(() => setReorderMessage(null), 2500);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SearchOrderForm>({
    resolver: zodResolver(searchOrderSchema),
  });

  const onSubmit = async (data: SearchOrderForm) => {
    setIsLoading(true);
    setErrorMessage(null);
    setOrders([]);

    try {
      const results = await ordersApi.search(
        data.email || undefined,
        data.phone || undefined,
        data.orderId || undefined,
      );

      setOrders(results);
      setHasSearched(true);

      if (results.length === 0) {
        setErrorMessage('No orders found matching your search criteria.');
      }
    } catch (error) {
      setHasSearched(true);
      setErrorMessage('Failed to search orders. Please try again.');
      console.error('Order search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setOrders([]);
    setErrorMessage(null);
    setHasSearched(false);
  };

  return (
    <section className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Order History</h1>
          <p className="text-slate-600">Search for your orders using email, phone, or order ID</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 mb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:border-slate-900 focus:outline-none"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...register('phone')}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:border-slate-900 focus:outline-none"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-slate-700 mb-2">
                  Order ID
                </label>
                <input
                  id="orderId"
                  type="text"
                  placeholder="uuid"
                  {...register('orderId')}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:border-slate-900 focus:outline-none"
                />
                {errors.orderId && (
                  <p className="mt-1 text-xs text-red-600">{errors.orderId.message}</p>
                )}
              </div>
            </div>

            {errors.root && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errors.root.message}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {hasSearched && errorMessage && !isLoading && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-8">
            {errorMessage}
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Found {orders.length} order{orders.length !== 1 ? 's' : ''}
            </h2>

            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{order.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">Order #{order.id.slice(0, 8)}</p>
                  </div>
                  <div className="mt-3 md:mt-0 text-right">
                    <p className="text-2xl font-bold text-slate-900">{formatPrice(order.totalPrice)}</p>
                    <p className="text-xs text-slate-600 mt-1">{formatDate(order.createdAt)}</p>
                                    <div className="mt-3 md:mt-0 md:ml-4">
                                      <button
                                        type="button"
                                        onClick={() => handleReorder(order)}
                                        className="whitespace-nowrap rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                                      >
                                        Reorder
                                      </button>
                                    </div>
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
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 text-sm">
                          <p className="font-medium text-slate-900">{item.name}</p>
                          <p className="text-slate-600">
                            {item.quantity} × {formatPrice(item.unitPrice)} = {formatPrice(item.unitPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {reorderMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg"
        >
          {reorderMessage}
        </div>
      )}
    </section>
  );
};
