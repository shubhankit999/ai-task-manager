export default function EmptyState() {
  return (
    <div className="card flex flex-col items-center justify-center gap-2 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
      <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
        <span className="inline-flex h-full w-full items-center justify-center text-lg">✓</span>
      </div>
      <p className="font-medium text-slate-700 dark:text-slate-200">No tasks yet</p>
      <p className="max-w-xs text-xs">
        Start by creating a task on the left. You can ask the AI to break it down into clear steps.
      </p>
    </div>
  );
}

