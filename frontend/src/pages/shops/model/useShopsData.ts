import { useEffect, useState } from 'react';
import { shopsApi, type Shop } from '../../../api/shops.api';

interface UseShopsDataResult {
  shops: Shop[];
  isLoading: boolean;
  errorMessage: string | null;
}

export const useShopsData = (): UseShopsDataResult => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadShops = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await shopsApi.getAll();

        if (!isMounted) {
          return;
        }

        setShops(data);
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage('Failed to load shops. Please try again.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadShops();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    shops,
    isLoading,
    errorMessage,
  };
};
