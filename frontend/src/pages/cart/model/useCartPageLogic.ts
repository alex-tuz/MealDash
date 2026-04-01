import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ordersApi } from '../../../api/orders.api';
import { couponsApi } from '../../../api/coupons.api';
import {
  selectCartSubtotal,
  selectCartTotalItems,
  useCartStore,
} from '../../../store';
import { cartOrderFormSchema, type CartOrderFormValues } from './cart-order-form.schema';
import {
  type AppliedCoupon,
  type SubmitNotification,
  NOTIFICATION_AUTO_HIDE_MS,
  ORDER_CREATE_SUCCESS_STATUS,
} from './cart.types';

export const useCartPageLogic = () => {
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

  const discountAmount = useMemo(
    () => (appliedCoupon ? Number(((subtotal * appliedCoupon.discountPercent) / 100).toFixed(2)) : 0),
    [appliedCoupon, subtotal],
  );
  const total = useMemo(() => Number((subtotal - discountAmount).toFixed(2)), [subtotal, discountAmount]);

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

  const clearCartAndCouponState = () => {
    clearCart();
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMessage(null);
  };

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

      clearCartAndCouponState();
      reset();
      setSubmitNotification({
        tone: 'success',
        message: `Order #${createdOrderResult.order.orderNumber} was created successfully.`,
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

  return {
    items,
    totalItems,
    subtotal,
    discountAmount,
    total,
    brokenImages,
    couponCode,
    appliedCoupon,
    couponMessage,
    isApplyingCoupon,
    submitNotification,
    register,
    handleSubmit,
    errors,
    isValid,
    isSubmitting,
    incrementItem,
    decrementItem,
    setItemQuantity,
    removeItem,
    setBrokenImages,
    setCouponCode,
    clearCartAndCouponState,
    handleOrderSubmit,
    handleApplyCoupon,
    handleRemoveCoupon,
  };
};
