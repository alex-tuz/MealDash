import { useCouponsPageLogic } from './model/useCouponsPageLogic';
import { CouponsGrid } from './ui/CouponsGrid';
import { CopyToast } from './ui/CopyToast';
import { CouponsGridSkeleton } from './ui/CouponsGridSkeleton';

export const CouponsPage = () => {
  const { coupons, isLoading, errorMessage, copiedCode, copyToast, handleCopy } = useCouponsPageLogic();

  return (
    <section className="space-y-4 md:space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Coupons</h1>
        <p className="mt-1 text-sm md:text-base text-slate-600">Copy a promo code in one click and use it at checkout.</p>
      </header>

      {isLoading && <CouponsGridSkeleton items={6} />}

      {!isLoading && errorMessage && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && <CouponsGrid coupons={coupons} copiedCode={copiedCode} onCopy={handleCopy} />}

      <CopyToast message={copyToast} />
    </section>
  );
};
