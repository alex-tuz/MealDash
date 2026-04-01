interface CartSummaryCardProps {
  totalItems: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  onClearCart: () => void;
}

export const CartSummaryCard = ({
  totalItems,
  subtotal,
  discountAmount,
  total,
  onClearCart,
}: CartSummaryCardProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-2xl border border-slate-200 bg-white p-3 md:p-4">
      <div>
        <p className="text-xs md:text-sm text-slate-600">Items: {totalItems}</p>
        <p className="text-base md:text-lg font-semibold text-slate-900">Subtotal: ${subtotal.toFixed(2)}</p>
        <p className="text-sm text-slate-700">Discount: -${discountAmount.toFixed(2)}</p>
        <p className="text-lg font-bold text-slate-900">Total: ${total.toFixed(2)}</p>
      </div>

      <button
        type="button"
        onClick={onClearCart}
        className="w-full sm:w-auto rounded-lg border border-slate-900 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 transition"
      >
        Clear cart
      </button>
    </div>
  );
};
