import { useCartPageLogic } from './model/useCartPageLogic';
import { CartItemsList } from './ui/CartItemsList';
import { CartSummaryCard } from './ui/CartSummaryCard';
import { OrderDetailsForm } from './ui/OrderDetailsForm';
import { SubmitNotificationToast } from './ui/SubmitNotificationToast';

export const CartPage = () => {
  const {
    items,
    totalItems,
    subtotal,
    discountAmount,
    total,
    brokenImages,
    couponCode,
    appliedCoupon,
    couponMessage,
    isApplyingCoupon,
    submitNotification,
    register,
    handleSubmit,
    errors,
    isValid,
    isSubmitting,
    incrementItem,
    decrementItem,
    setItemQuantity,
    removeItem,
    setBrokenImages,
    setCouponCode,
    clearCartAndCouponState,
    handleOrderSubmit,
    handleApplyCoupon,
    handleRemoveCoupon,
  } = useCartPageLogic();

  return (
    <section className="space-y-4 md:space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Shopping Cart</h1>

      {items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          Cart is empty. Add items from the Shop page.
        </p>
      ) : (
        <div className="space-y-4">
          <CartItemsList
            items={items}
            brokenImages={brokenImages}
            onImageError={(itemId) => setBrokenImages((current) => ({ ...current, [itemId]: true }))}
            onIncrement={incrementItem}
            onDecrement={decrementItem}
            onSetQuantity={setItemQuantity}
            onRemove={removeItem}
          />

          <CartSummaryCard
            totalItems={totalItems}
            subtotal={subtotal}
            discountAmount={discountAmount}
            total={total}
            onClearCart={clearCartAndCouponState}
          />

          <OrderDetailsForm
            couponCode={couponCode}
            appliedCoupon={appliedCoupon}
            couponMessage={couponMessage}
            isApplyingCoupon={isApplyingCoupon}
            isValid={isValid}
            isSubmitting={isSubmitting}
            hasItems={items.length > 0}
            errors={errors}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={handleOrderSubmit}
            onCouponCodeChange={setCouponCode}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
          />
        </div>
      )}

      <SubmitNotificationToast notification={submitNotification} />
    </section>
  );
};
