import { type Coupon } from '../../../api/coupons.api';
import { CouponCard } from './CouponCard';

interface CouponsGridProps {
  coupons: Coupon[];
  copiedCode: string | null;
  onCopy: (code: string) => void;
}

export const CouponsGrid = ({ coupons, copiedCode, onCopy }: CouponsGridProps) => {
  if (coupons.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        No coupons available right now.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {coupons.map((coupon) => (
        <CouponCard
          key={coupon.id}
          coupon={coupon}
          isCopied={copiedCode === coupon.code}
          onCopy={onCopy}
        />
      ))}
    </div>
  );
};
