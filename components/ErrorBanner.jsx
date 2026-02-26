export default function ErrorBanner({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="mb-3 flex items-start justify-between rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-700 dark:bg-red-950/60 dark:text-red-200">
      <p>{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-3 text-xs font-medium text-red-700 underline hover:text-red-900 dark:text-red-300"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}

