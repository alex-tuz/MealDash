import { useEffect, useState } from 'react';
import { type Product } from '../../../api/products.api';
import { useCartStore } from '../../../store';

interface UseAddToCartFeedbackResult {
  addedToCartMessage: string | null;
  handleAddToCart: (product: Product) => void;
}

export const useAddToCartFeedback = (): UseAddToCartFeedbackResult => {
  const [addedToCartMessage, setAddedToCartMessage] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!addedToCartMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setAddedToCartMessage(null);
    }, 1600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [addedToCartMessage]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setAddedToCartMessage(`${product.name} was added to cart`);
  };

  return {
    addedToCartMessage,
    handleAddToCart,
  };
};
