import { useCouponsPageLogic } from './model/useCouponsPageLogic';
import { CouponsGrid } from './ui/CouponsGrid';
import { CopyToast } from './ui/CopyToast';

export const CouponsPage = () => {
  const { coupons, isLoading, errorMessage, copiedCode, copyToast, handleCopy } = useCouponsPageLogic();

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Coupons</h1>
        <p className="mt-2 text-sm text-slate-600">Copy a promo code in one click and use it at checkout.</p>
      </header>

      {isLoading && <p className="text-sm text-slate-600">Loading coupons...</p>}

      {!isLoading && errorMessage && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && <CouponsGrid coupons={coupons} copiedCode={copiedCode} onCopy={handleCopy} />}

      <CopyToast message={copyToast} />
    </section>
  );
};
