import { type FieldErrors, type UseFormHandleSubmit, type UseFormRegister } from 'react-hook-form';
import { type AppliedCoupon, type SubmitNotification } from '../model/cart.types';
import { type CartOrderFormValues } from '../model/cart-order-form.schema';

interface OrderDetailsFormProps {
  couponCode: string;
  appliedCoupon: AppliedCoupon | null;
  couponMessage: SubmitNotification | null;
  isApplyingCoupon: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  hasItems: boolean;
  errors: FieldErrors<CartOrderFormValues>;
  register: UseFormRegister<CartOrderFormValues>;
  handleSubmit: UseFormHandleSubmit<CartOrderFormValues>;
  onSubmit: (values: CartOrderFormValues) => Promise<void>;
  onCouponCodeChange: (value: string) => void;
  onApplyCoupon: () => Promise<void>;
  onRemoveCoupon: () => void;
}

export const OrderDetailsForm = ({
  couponCode,
  appliedCoupon,
  couponMessage,
  isApplyingCoupon,
  isValid,
  isSubmitting,
  hasItems,
  errors,
  register,
  handleSubmit,
  onSubmit,
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
}: OrderDetailsFormProps) => {
  return (
    <form
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-3 md:p-4"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-base md:text-lg font-semibold text-slate-900">Order details</h2>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-sm font-medium text-slate-700">Coupon</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={couponCode}
            onChange={(event) => onCouponCodeChange(event.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-200 transition focus:ring min-h-[44px]"
          />
          <button
            type="button"
            onClick={onApplyCoupon}
            disabled={isApplyingCoupon || !hasItems}
            className="rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500 min-h-[44px]"
          >
            {isApplyingCoupon ? 'Applying...' : 'Apply'}
          </button>
          {appliedCoupon && (
            <button
              type="button"
              onClick={onRemoveCoupon}
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
          disabled={!isValid || isSubmitting || !hasItems}
          className="w-full sm:w-auto rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500 min-h-[44px]"
        >
          {isSubmitting ? 'Submitting...' : 'Submit order'}
        </button>
      </div>
    </form>
  );
};
