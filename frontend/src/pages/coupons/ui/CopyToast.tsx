interface CopyToastProps {
  message: string | null;
}

export const CopyToast = ({ message }: CopyToastProps) => {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg"
    >
      {message}
    </div>
  );
};
