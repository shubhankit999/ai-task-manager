import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'ai-task-manager-tasks-v1';
const THEME_KEY = 'ai-task-manager-theme';

export const PRIORITIES = ['High', 'Medium', 'Low'];
export const STATUSES = ['Todo', 'In Progress', 'Done', 'Deferred'];

const TaskContext = createContext(null);

function loadInitialTasks() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(loadInitialTasks);
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('deadlineAsc');
  const [theme, setTheme] = useState(loadInitialTheme);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const addTask = (task) => {
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...task
      }
    ]);
  };

  const updateTask = (id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const reorderTasks = (sourceIndex, destinationIndex) => {
    setTasks((prev) => {
      const next = Array.from(prev);
      const [removed] = next.splice(sourceIndex, 1);
      next.splice(destinationIndex, 0, removed);
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const filteredSortedTasks = useMemo(() => {
    let result = [...tasks];

    if (filterPriority !== 'All') {
      result = result.filter((t) => t.priority === filterPriority);
    }
    if (filterStatus !== 'All') {
      result = result.filter((t) => t.status === filterStatus);
    }

    if (sortBy === 'deadlineAsc') {
      result.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    } else if (sortBy === 'deadlineDesc') {
      result.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(b.deadline) - new Date(a.deadline);
      });
    } else if (sortBy === 'priority') {
      const weight = { High: 0, Medium: 1, Low: 2 };
      result.sort((a, b) => (weight[a.priority] ?? 3) - (weight[b.priority] ?? 3));
    }

    return result;
  }, [tasks, filterPriority, filterStatus, sortBy]);

  const value = {
    tasks,
    filteredSortedTasks,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    theme,
    toggleTheme
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return ctx;
}

