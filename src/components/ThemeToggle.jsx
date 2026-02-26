import { useTasks } from '../state/TaskContext.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTasks();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn-outline flex items-center gap-2"
      aria-label="Toggle dark/light mode"
    >
      <span className="h-4 w-4">
        {theme === 'dark' ? (
          <span className="inline-block h-4 w-4 rounded-full bg-yellow-300 shadow" />
        ) : (
          <span className="inline-block h-4 w-4 rounded-full border border-slate-500" />
        )}
      </span>
      <span className="text-xs md:text-sm">{theme === 'dark' ? 'Dark' : 'Light'} mode</span>
    </button>
  );
}

