import { type Coupon } from '../../../api/coupons.api';

interface CouponCardProps {
  coupon: Coupon;
  isCopied: boolean;
  onCopy: (code: string) => void;
}

export const CouponCard = ({ coupon, isCopied, onCopy }: CouponCardProps) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <img
        src={coupon.image}
        alt={coupon.name}
        className="mb-3 h-36 w-full rounded-xl object-cover"
        loading="lazy"
      />
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{coupon.discountPercent}% OFF</p>
      <h2 className="mt-1 text-lg font-semibold text-slate-900">{coupon.name}</h2>
      <p className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm font-semibold tracking-wide text-slate-800">
        {coupon.code}
      </p>
      <button
        type="button"
        onClick={() => onCopy(coupon.code)}
        className={`mt-3 w-full rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
          isCopied
            ? 'border-emerald-700 bg-emerald-700 text-white'
            : 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
        }`}
      >
        {isCopied ? 'Copied' : 'Copy code'}
      </button>
    </article>
  );
};
