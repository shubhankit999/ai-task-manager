import { useState } from 'react';
import { useTasks } from './state/TaskContext.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import TaskForm from './components/TaskForm.jsx';
import FilterBar from './components/FilterBar.jsx';
import TaskList from './components/TaskList.jsx';

export default function App() {
  const { tasks, addTask, updateTask } = useTasks();
  const [editingTask, setEditingTask] = useState(null);

  const isEditing = Boolean(editingTask);

  const handleSubmitted = (payload) => {
    if (editingTask) {
      updateTask(editingTask.id, payload);
      setEditingTask(null);
    } else {
      addTask(payload);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-6 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              AI Task Manager
            </h1>
            <p className="mt-1 max-w-xl text-xs text-slate-600 dark:text-slate-400">
              Capture tasks, let AI break them into actionable steps, and stay on top of your
              priorities with filters, sorting, and drag-and-drop.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <main className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
          <section>
            <TaskForm
              isEditing={isEditing}
              initialTask={editingTask}
              onSubmit={handleSubmitted}
              onCancel={() => setEditingTask(null)}
            />
          </section>

          <section className="flex flex-col gap-3">
            <FilterBar />
            <TaskList onEdit={setEditingTask} />
            {tasks.length > 0 && (
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Pro tip: start with a high-level task and let the AI suggest subtasks; you can then
                drag to reorder tasks by importance.
              </p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}


