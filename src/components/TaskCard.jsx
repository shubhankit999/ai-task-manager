import { PRIORITIES, STATUSES } from '../state/TaskContext.jsx';

const priorityStyles = {
  High: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  Low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
};

const statusStyles = {
  Todo: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  Done: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const hasValidPriority = PRIORITIES.includes(task.priority);
  const hasValidStatus = STATUSES.includes(task.status);

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {task.description}
            </p>
          )}
          {task.deferReason && (
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Defer Reason: {task.deferReason}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {task.deadline && (
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Due {new Date(task.deadline).toLocaleDateString()}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-1">
            {hasValidPriority && (
              <span className={`badge ${priorityStyles[task.priority]}`}>{task.priority}</span>
            )}
            {hasValidStatus && (
              <span className={`badge ${statusStyles[task.status]}`}>{task.status}</span>
            )}
          </div>
        </div>
      </div>

      {Array.isArray(task.subtasks) && task.subtasks.length > 0 && (
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
          <p className="mb-1 font-medium text-slate-800 dark:text-slate-100">AI breakdown</p>
          <ul className="list-disc space-y-1 pl-4">
            {task.subtasks.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-1 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="btn-outline border-slate-200 px-2 py-1 text-xs dark:border-slate-700"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="btn bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

