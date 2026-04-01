import { type SubmitNotification } from '../model/cart.types';

interface SubmitNotificationToastProps {
  notification: SubmitNotification | null;
}

export const SubmitNotificationToast = ({ notification }: SubmitNotificationToastProps) => {
  if (!notification) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
        notification.tone === 'success'
          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border border-red-200 bg-red-50 text-red-700'
      }`}
    >
      {notification.message}
    </div>
  );
};
