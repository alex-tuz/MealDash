import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ordersApi, type CreatedOrder } from '../../../api/orders.api';
import { useCartStore } from '../../../store';
import { searchOrderSchema, type SearchOrderForm } from './search-order.schema';

const REORDER_MESSAGE_TIMEOUT_MS = 2_500;

export const useOrderHistoryLogic = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<CreatedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [reorderMessage, setReorderMessage] = useState<string | null>(null);
  const reorder = useCartStore((state) => state.reorder);
  const setCheckoutDraft = useCartStore((state) => state.setCheckoutDraft);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SearchOrderForm>({
    resolver: zodResolver(searchOrderSchema),
  });

  const handleReorder = (order: CreatedOrder) => {
    setCheckoutDraft({
      name: order.name,
      email: order.email,
      phone: order.phone,
      address: order.address,
    });

    const result = reorder(
      order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        name: item.name,
        image: item.image,
        unitPrice: item.unitPrice,
      })),
    );
    setReorderMessage(result.message);
    window.setTimeout(() => setReorderMessage(null), REORDER_MESSAGE_TIMEOUT_MS);
    navigate('/cart');
  };

  const onSubmit = async (data: SearchOrderForm) => {
    setIsLoading(true);
    setErrorMessage(null);
    setOrders([]);

    try {
      const results = await ordersApi.search(
        data.email || undefined,
        data.phone || undefined,
        data.orderId || undefined,
      );

      setOrders(results);
      setHasSearched(true);

      if (results.length === 0) {
        setErrorMessage('No orders found matching your search criteria.');
      }
    } catch (error) {
      setHasSearched(true);
      setErrorMessage('Failed to search orders. Please try again.');
      console.error('Order search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setOrders([]);
    setErrorMessage(null);
    setHasSearched(false);
  };

  return {
    orders,
    isLoading,
    errorMessage,
    hasSearched,
    reorderMessage,
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleReset,
    handleReorder,
  };
};
