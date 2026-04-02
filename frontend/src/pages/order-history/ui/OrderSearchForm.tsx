import { type FieldErrors, type UseFormHandleSubmit, type UseFormRegister } from 'react-hook-form';
import { type SearchOrderForm } from '../model/search-order.schema';

interface OrderSearchFormProps {
  isLoading: boolean;
  errors: FieldErrors<SearchOrderForm>;
  register: UseFormRegister<SearchOrderForm>;
  handleSubmit: UseFormHandleSubmit<SearchOrderForm>;
  onSubmit: (data: SearchOrderForm) => Promise<void>;
  onReset: () => void;
}

export const OrderSearchForm = ({
  isLoading,
  errors,
  register,
  handleSubmit,
  onSubmit,
  onReset,
}: OrderSearchFormProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
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
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
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
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
          </div>

          <div>
            <label htmlFor="orderId" className="block text-sm font-medium text-slate-700 mb-2">
              Order ID
            </label>
            <input
              id="orderId"
              type="text"
              placeholder="e.g. 1024"
              {...register('orderId')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:border-slate-900 focus:outline-none"
            />
            {errors.orderId && <p className="mt-1 text-xs text-red-600">{errors.orderId.message}</p>}
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
            onClick={onReset}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};
