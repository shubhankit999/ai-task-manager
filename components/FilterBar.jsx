import { PRIORITIES, STATUSES, useTasks } from '../state/TaskContext.jsx';

export default function FilterBar() {
  const {
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy
  } = useTasks();

  return (
    <div className="card mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Priority
          </label>
          <select
            className="select max-w-[140px]"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">All</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Status</label>
          <select
            className="select max-w-[160px]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Sort by
        </label>
        <select
          className="select max-w-[200px]"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="deadlineAsc">Deadline (earliest first)</option>
          <option value="deadlineDesc">Deadline (latest first)</option>
          <option value="priority">Priority (High → Low)</option>
        </select>
      </div>
    </div>
  );
}

