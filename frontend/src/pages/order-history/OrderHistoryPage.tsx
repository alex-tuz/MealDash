import { useOrderHistoryLogic } from './model/useOrderHistoryLogic';
import { OrderSearchForm } from './ui/OrderSearchForm';
import { OrderResultsSection } from './ui/OrderResultsSection';
import { ReorderToast } from './ui/ReorderToast';

export const OrderHistoryPage = () => {
  const {
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
  } = useOrderHistoryLogic();

  return (
    <section className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Order History</h1>
          <p className="text-slate-600">Search for your orders using email, phone, or order ID</p>
        </div>

        <OrderSearchForm
          isLoading={isLoading}
          errors={errors}
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          onReset={handleReset}
        />

        {hasSearched && errorMessage && !isLoading && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-8">
            {errorMessage}
          </div>
        )}

        <OrderResultsSection orders={orders} onReorder={handleReorder} />
      </div>

      <ReorderToast message={reorderMessage} />
    </section>
  );
};
