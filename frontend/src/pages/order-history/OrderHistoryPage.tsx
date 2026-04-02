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
    <section className="space-y-4 md:space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Order History</h1>
        <p className="mt-1 text-sm md:text-base text-slate-600">Search for your orders using email, phone, or order ID</p>
      </header>

      <OrderSearchForm
        isLoading={isLoading}
        errors={errors}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        onReset={handleReset}
      />

      {hasSearched && errorMessage && !isLoading && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <OrderResultsSection orders={orders} onReorder={handleReorder} />

      <ReorderToast message={reorderMessage} />
    </section>
  );
};
