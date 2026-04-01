import { useEffect, useState } from 'react';

import { couponsApi, type Coupon } from '../api/coupons.api';

const copyWithFallback = (value: string): boolean => {
  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }

  document.body.removeChild(textArea);
  return copied;
};

export const CouponsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCoupons = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await couponsApi.getAll();
        if (!isMounted) {
          return;
        }
        setCoupons(data);
      } catch {
        if (!isMounted) {
          return;
        }
        setErrorMessage('Failed to load coupons. Please try again.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCoupons();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!copyToast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopyToast(null);
      setCopiedCode(null);
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copyToast]);

  const handleCopy = async (code: string) => {
    let copied = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(code);
        copied = true;
      } catch {
        copied = copyWithFallback(code);
      }
    } else {
      copied = copyWithFallback(code);
    }

    if (copied) {
      setCopiedCode(code);
      setCopyToast(`Copied ${code}`);
      return;
    }

    setCopyToast('Copy is not available in this browser context');
  };

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

      {!isLoading && !errorMessage && coupons.length === 0 && (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">No coupons available right now.</p>
      )}

      {!isLoading && !errorMessage && coupons.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => {
            const isCopied = copiedCode === coupon.code;

            return (
              <article key={coupon.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
                  onClick={() => handleCopy(coupon.code)}
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
          })}
        </div>
      )}

      {copyToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg"
        >
          {copyToast}
        </div>
      )}
    </section>
  );
};
