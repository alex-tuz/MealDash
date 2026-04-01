import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ordersApi } from '../api/orders.api';
import { couponsApi } from '../api/coupons.api';
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

type AppliedCoupon = {
  code: string;
  discountPercent: number;
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
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponMessage, setCouponMessage] = useState<SubmitNotification | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const discountAmount = appliedCoupon
    ? Number(((subtotal * appliedCoupon.discountPercent) / 100).toFixed(2))
    : 0;
  const total = Number((subtotal - discountAmount).toFixed(2));

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
      couponCode: appliedCoupon?.code,
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
      setAppliedCoupon(null);
      setCouponCode('');
      setCouponMessage(null);
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

  const handleApplyCoupon = async () => {
    const normalizedCode = couponCode.trim().toUpperCase();

    if (!normalizedCode) {
      setCouponMessage({ tone: 'error', message: 'Enter coupon code first.' });
      return;
    }

    if (!/^[A-Z0-9_-]{3,40}$/.test(normalizedCode)) {
      setCouponMessage({ tone: 'error', message: 'Coupon format is invalid.' });
      return;
    }

    if (appliedCoupon?.code === normalizedCode) {
      setCouponMessage({ tone: 'error', message: 'This coupon is already applied.' });
      return;
    }

    setIsApplyingCoupon(true);
    setCouponMessage(null);

    try {
      const coupon = await couponsApi.apply(normalizedCode);
      setAppliedCoupon({ code: coupon.code.toUpperCase(), discountPercent: coupon.discountPercent });
      setCouponCode(coupon.code.toUpperCase());
      setCouponMessage({
        tone: 'success',
        message: `Coupon ${coupon.code.toUpperCase()} applied: ${coupon.discountPercent}% off.`,
      });
    } catch {
      setCouponMessage({ tone: 'error', message: 'Coupon is invalid or unavailable.' });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMessage(null);
  };

  return (
    <section className="space-y-4 md:space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Shopping Cart</h1>

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
                className="rounded-2xl border border-slate-200 bg-white p-3 md:p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="flex h-16 w-20 sm:w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl md:rounded-2xl border border-slate-200 bg-slate-50">
                      {item.image && !brokenImages[item.id] ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={() =>
                            setBrokenImages((current) => ({ ...current, [item.id]: true }))
                          }
                        />
                      ) : (
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                          {item.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-sm md:text-base font-semibold text-slate-900">{item.name}</h2>
                      <p className="mt-1 text-xs md:text-sm text-slate-600">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => decrementItem(item.id)}
                      className="h-8 w-8 min-h-[44px] min-w-[44px] sm:h-auto sm:w-auto sm:min-h-0 sm:min-w-0 rounded-lg border border-slate-300 px-2 sm:px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center text-xs md:text-sm font-semibold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => incrementItem(item.id)}
                      className="h-8 w-8 min-h-[44px] min-w-[44px] sm:h-auto sm:w-auto sm:min-h-0 sm:min-w-0 rounded-lg border border-slate-300 px-2 sm:px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                      aria-label="Increase quantity"
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
                      className="hidden sm:inline-block w-14 sm:w-16 rounded-lg border border-slate-300 px-2 py-1 text-center text-xs md:text-sm text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg border border-red-200 px-2 sm:px-3 py-1 text-xs md:text-sm font-medium text-red-700 hover:bg-red-50 transition whitespace-nowrap"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-2xl border border-slate-200 bg-white p-3 md:p-4">
            <div>
              <p className="text-xs md:text-sm text-slate-600">Items: {totalItems}</p>
              <p className="text-base md:text-lg font-semibold text-slate-900">Subtotal: ${subtotal.toFixed(2)}</p>
              <p className="text-sm text-slate-700">Discount: -${discountAmount.toFixed(2)}</p>
              <p className="text-lg font-bold text-slate-900">Total: ${total.toFixed(2)}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                clearCart();
                setAppliedCoupon(null);
                setCouponCode('');
                setCouponMessage(null);
              }}
              className="w-full sm:w-auto rounded-lg border border-slate-900 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 transition"
            >
              Clear cart
            </button>
          </div>

          <form
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-3 md:p-4"
            noValidate
            onSubmit={handleSubmit(handleOrderSubmit)}
          >
            <h2 className="text-base md:text-lg font-semibold text-slate-900">Order details</h2>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="mb-2 text-sm font-medium text-slate-700">Coupon</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-200 transition focus:ring min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon || items.length === 0}
                  className="rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500 min-h-[44px]"
                >
                  {isApplyingCoupon ? 'Applying...' : 'Apply'}
                </button>
                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition min-h-[44px]"
                  >
                    Remove
                  </button>
                )}
              </div>
              {appliedCoupon && (
                <p className="mt-2 text-xs text-emerald-700">
                  Applied {appliedCoupon.code}: {appliedCoupon.discountPercent}% off
                </p>
              )}
              {couponMessage && (
                <p
                  className={`mt-2 text-xs ${
                    couponMessage.tone === 'success' ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {couponMessage.message}
                </p>
              )}
            </div>

            <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Name
                <input
                  type="text"
                  autoComplete="name"
                  {...register('name')}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-200 transition focus:ring min-h-[44px]"
                />
                {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span>}
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-200 transition focus:ring min-h-[44px]"
                />
                {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span>}
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Phone
                <input
                  type="tel"
                  autoComplete="tel"
                  {...register('phone')}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-200 transition focus:ring min-h-[44px]"
                />
                {errors.phone && <span className="mt-1 block text-xs text-red-600">{errors.phone.message}</span>}
              </label>

              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                Address
                <textarea
                  rows={3}
                  autoComplete="street-address"
                  {...register('address')}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-200 transition focus:ring"
                />
                {errors.address && (
                  <span className="mt-1 block text-xs text-red-600">{errors.address.message}</span>
                )}
              </label>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <p className="text-xs md:text-sm text-slate-600">Submit is available only when all fields are valid.</p>
              <button
                type="submit"
                disabled={!isValid || isSubmitting || items.length === 0}
                className="w-full sm:w-auto rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500 min-h-[44px]"
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
