export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-primary-500 dark:border-slate-600 dark:border-t-primary-400" />
      <span>{label}</span>
    </div>
  );
}

