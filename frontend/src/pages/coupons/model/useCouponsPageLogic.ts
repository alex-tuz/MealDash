import { useEffect, useState } from 'react';
import { couponsApi, type Coupon } from '../../../api/coupons.api';
import { copyCouponCode } from './copy.utils';

const COPY_TOAST_HIDE_MS = 1800;

export const useCouponsPageLogic = () => {
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
    }, COPY_TOAST_HIDE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copyToast]);

  const handleCopy = async (code: string) => {
    const copied = await copyCouponCode(code);

    if (copied) {
      setCopiedCode(code);
      setCopyToast(`Copied ${code}`);
      return;
    }

    setCopyToast('Copy is not available in this browser context');
  };

  return {
    coupons,
    isLoading,
    errorMessage,
    copiedCode,
    copyToast,
    handleCopy,
  };
};
