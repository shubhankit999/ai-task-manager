import { useEffect, useState } from 'react';
import { PRIORITIES, STATUSES } from '../state/TaskContext.jsx';
import { getTaskBreakdown } from '../services/aiService.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import ErrorBanner from './ErrorBanner.jsx';

const defaultTask = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Todo',
  deadline: '',
  subtasks: [],
  deferReason: ''
};

export default function TaskForm({ onSubmit, initialTask, onCancel, isEditing }) {
  const [values, setValues] = useState(defaultTask);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setValues({
        ...defaultTask,
        ...initialTask,
        deadline: initialTask.deadline ? initialTask.deadline.slice(0, 10) : ''
      });
    } else {
      setValues(defaultTask);
    }
    setAiError('');
    setAiLoading(false);
  }, [initialTask]);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.title.trim()) {
      setAiError('Please enter a task title.');
      return;
    }
    setAiError('');
    onSubmit({
      ...values,
      deadline: values.deadline || '',
      subtasks: Array.isArray(values.subtasks) ? values.subtasks : []
    });
    if (!isEditing) {
      setValues(defaultTask);
    }
  };

  const handleSuggestWithAI = async () => {
    if (!values.title.trim()) {
      setAiError('Please add a title so the AI knows what your task is.');
      return;
    }
    setAiError('');
    setAiLoading(true);
    try {
      const steps = await getTaskBreakdown({
        title: values.title,
        description: values.description
      });
      setValues((prev) => ({ ...prev, subtasks: steps }));
    } catch (err) {
      setAiError(err.message || 'Something went wrong while talking to the AI.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          {isEditing ? 'Edit task' : 'Add a new task'}
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400"
          >
            Cancel edit
          </button>
        )}
      </div>

      <ErrorBanner message={aiError} onClose={() => setAiError('')} />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Title<span className="text-red-500">*</span>
        </label>
        <input
          className="input"
          placeholder="e.g. Prepare project report"
          value={values.title}
          onChange={handleChange('title')}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Description
        </label>
        <textarea
          className="textarea"
          placeholder="Add more context to help the AI suggest useful steps..."
          value={values.description}
          onChange={handleChange('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Priority
          </label>
          <select
            className="select"
            value={values.priority}
            onChange={handleChange('priority')}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Status
          </label>
          <select className="select" value={values.status} onChange={handleChange('status')}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Deadline
        </label>
        <input
          type="date"
          className="input"
          value={values.deadline}
          onChange={handleChange('deadline')}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Defer Reason
        </label>
        <input
          className="input"
          placeholder="e.g. Not enough time to complete"
          value={values.deferReason}
          onChange={handleChange('deferReason')}
        />
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-900/60">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-100">
              AI-powered breakdown (optional)
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              We&apos;ll use your title and description to propose clear subtasks.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSuggestWithAI}
            disabled={aiLoading}
            className="btn-primary whitespace-nowrap px-3 py-1 text-xs"
          >
            {aiLoading ? 'Asking AI...' : 'Suggest with AI'}
          </button>
        </div>

        {aiLoading && <LoadingSpinner label="Waiting for AI suggestions..." />}

        {Array.isArray(values.subtasks) && values.subtasks.length > 0 && (
          <div className="mt-1 rounded-md bg-white px-3 py-2 text-[11px] text-slate-700 shadow-sm dark:bg-slate-950/60 dark:text-slate-200">
            <p className="mb-1 font-medium text-slate-800 dark:text-slate-100">Suggested steps</p>
            <ul className="list-disc space-y-1 pl-4">
              {values.subtasks.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-2 flex justify-end gap-2">
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline px-3 py-2 text-xs md:text-sm"
          >
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary px-4 py-2 text-xs md:text-sm">
          {isEditing ? 'Save changes' : 'Add task'}
        </button>
      </div>
    </form>
  );
}

