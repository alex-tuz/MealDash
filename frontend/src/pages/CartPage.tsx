import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ordersApi } from '../api/orders.api';
import { cartOrderFormSchema, type CartOrderFormValues } from './cart-order-form.schema';
import {
  selectCartSubtotal,
  selectCartTotalItems,
  useCartStore,
} from '../store';

const QTY_MIN = 1;
const QTY_STEP = 1;
const NOTIFICATION_AUTO_HIDE_MS = 3_000;
const ORDER_CREATE_SUCCESS_STATUS = {
  ok: 200,
  created: 201,
} as const;

type SubmitNotification = {
  tone: 'success' | 'error';
  message: string;
};

export const CartPage = () => {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore(selectCartTotalItems);
  const subtotal = useCartStore(selectCartSubtotal);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const setItemQuantity = useCartStore((state) => state.setItemQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const [submitNotification, setSubmitNotification] = useState<SubmitNotification | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CartOrderFormValues>({
    resolver: zodResolver(cartOrderFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const handleOrderSubmit = async (values: CartOrderFormValues) => {
    const orderPayload = {
      ...values,
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const createdOrderResult = await ordersApi.create(orderPayload);

      if (
        createdOrderResult.status !== ORDER_CREATE_SUCCESS_STATUS.ok &&
        createdOrderResult.status !== ORDER_CREATE_SUCCESS_STATUS.created
      ) {
        throw new Error(`Unexpected order status: ${createdOrderResult.status}`);
      }

      clearCart();
      reset();
      setSubmitNotification({
        tone: 'success',
        message: `Order ${createdOrderResult.order.id} was created successfully.`,
      });
      window.setTimeout(() => {
        setSubmitNotification((current) => (current?.tone === 'success' ? null : current));
      }, NOTIFICATION_AUTO_HIDE_MS);
    } catch (error) {
      console.error('Failed to submit order', error);
      setSubmitNotification({
        tone: 'error',
        message: 'Failed to create order. Please try again.',
      });
    }
  };

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Shopping Cart</h1>

      {items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          Cart is empty. Add items from the Shop page.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-slate-900">{item.name}</h2>
                    <p className="mt-1 text-sm text-slate-600">${item.price.toFixed(2)} each</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => decrementItem(item.id)}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="min-w-8 text-center text-sm font-semibold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => incrementItem(item.id)}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100"
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
                      onChange={(event) =>
                        setItemQuantity(item.id, Number.parseInt(event.target.value, 10))
                      }
                      className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-center text-sm text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="ml-1 rounded-lg border border-red-200 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div>
              <p className="text-sm text-slate-600">Items: {totalItems}</p>
              <p className="text-lg font-semibold text-slate-900">Subtotal: ${subtotal.toFixed(2)}</p>
            </div>

            <button
              type="button"
              onClick={clearCart}
              className="rounded-lg border border-slate-900 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
            >
              Clear cart
            </button>
          </div>

          <form
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4"
            noValidate
            onSubmit={handleSubmit(handleOrderSubmit)}
          >
            <h2 className="text-lg font-semibold text-slate-900">Order details</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Name
                <input
                  type="text"
                  autoComplete="name"
                  {...register('name')}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-slate-200 transition focus:ring"
                />
                {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span>}
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-slate-200 transition focus:ring"
                />
                {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span>}
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Phone
                <input
                  type="tel"
                  autoComplete="tel"
                  {...register('phone')}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-slate-200 transition focus:ring"
                />
                {errors.phone && <span className="mt-1 block text-xs text-red-600">{errors.phone.message}</span>}
              </label>

              <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                Address
                <textarea
                  rows={3}
                  autoComplete="street-address"
                  {...register('address')}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-slate-200 transition focus:ring"
                />
                {errors.address && (
                  <span className="mt-1 block text-xs text-red-600">{errors.address.message}</span>
                )}
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">Submit is available only when all fields are valid.</p>
              <button
                type="submit"
                disabled={!isValid || isSubmitting || items.length === 0}
                className="rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500"
              >
                {isSubmitting ? 'Submitting...' : 'Submit order'}
              </button>
            </div>

          </form>
        </div>
      )}

      {submitNotification && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
            submitNotification.tone === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {submitNotification.message}
        </div>
      )}
    </section>
  );
};
