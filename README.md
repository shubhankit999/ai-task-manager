# AI Task Manager (React + Vite + Tailwind)

A small **AI-powered task manager** built with **React.js**, **Vite**, **Tailwind CSS**, and **react-beautiful-dnd**.

You can:

- **Add, edit, delete tasks** with title, description, priority, deadline, and status.
- **Ask AI** (OpenAI) to suggest a **step-by-step breakdown** of any task.
- **Filter** by priority and status, **sort** by deadline or priority.
- **Drag and drop** to reorder tasks.
- **Persist tasks** in your browser using `localStorage`.
- Use a **clean, modern UI** with **dark/light mode toggle**.
- Enjoy a **fully responsive** layout (mobile and desktop).

This README is written assuming you are **new to React**.

---

## 1. Tech stack

- **React 18** (functional components + hooks)
- **Vite** (fast local dev server / bundler)
- **Tailwind CSS** (utility-first styling)
- **react-beautiful-dnd** (drag-and-drop)
- **localStorage** (browser persistence)

Optional (for AI):

- **OpenAI API** via `fetch`

---

## 2. Project structure (what each file does)

Top-level files:

- **`package.json`**: Lists dependencies (React, Vite, Tailwind, etc.) and scripts like `npm run dev`.
- **`vite.config.mjs`**: Vite configuration (tells Vite to use the React plugin).
- **`tailwind.config.cjs`**: Tailwind configuration (dark mode, where to scan for classes).
- **`postcss.config.cjs`**: Connects Tailwind and Autoprefixer into the build.
- **`index.html`**: Main HTML file. Vite injects your React app into the `div` with `id="root"`.

Source folder:

- **`src/main.jsx`**
  - Entry point for React.
  - Renders the `App` component into `#root`.
  - Wraps everything in `TaskProvider` (Context).

- **`src/index.css`**
  - Imports Tailwind layers: `@tailwind base; @tailwind components; @tailwind utilities;`.
  - Defines some small utility classes (`.card`, `.btn`, `.input`, etc.) used across components.

State and services:

- **`src/state/TaskContext.jsx`**
  - Uses **React Context + hooks** (`useState`, `useEffect`, `useContext`, `useMemo`).
  - Stores all tasks and UI settings in one place.
  - Persists tasks and theme using `localStorage`.
  - Exposes:
    - `tasks`, `filteredSortedTasks`
    - `addTask`, `updateTask`, `deleteTask`, `reorderTasks`
    - `filterPriority`, `setFilterPriority`
    - `filterStatus`, `setFilterStatus`
    - `sortBy`, `setSortBy`
    - `theme`, `toggleTheme`

- **`src/services/aiService.js`**
  - Handles the **AI call** using the OpenAI API.
  - Reads `VITE_OPENAI_API_KEY` from an environment variable.
  - If no API key is set, returns a **simple fallback list of generic subtasks**.

Components:

- **`src/App.jsx`**
  - Main layout of the app.
  - Uses `useTasks()` from the context.
  - Renders:
    - Header with title and `ThemeToggle`.
    - Left side: `TaskForm` (add/edit a task).
    - Right side: `FilterBar` + `TaskList`.
  - Manages which task is currently being edited.

- **`src/components/ThemeToggle.jsx`**
  - Button to switch between **dark** and **light** mode.
  - Uses `theme` and `toggleTheme` from context.
  - Stores theme in `localStorage` and toggles Tailwind `dark` class on `<html>`.

- **`src/components/TaskForm.jsx`**
  - Form to **add or edit** a task.
  - Fields: title, description, priority, status, deadline.
  - Uses `getTaskBreakdown` from `aiService.js`:
    - Button: **“Suggest with AI”**.
    - Shows loading state and error messages if AI call fails.
    - Displays the suggested subtasks list.
  - Calls `onSubmit` with the task data and (if editing) `onCancel` to stop editing.

- **`src/components/FilterBar.jsx`**
  - Small toolbar above the list.
  - Dropdowns for:
    - Priority filter (All / High / Medium / Low).
    - Status filter (All / Todo / In Progress / Done).
    - Sort order (deadline ascending, deadline descending, priority).

- **`src/components/TaskList.jsx`**
  - Renders the list of tasks from `filteredSortedTasks`.
  - Uses **`react-beautiful-dnd`** for drag-and-drop:
    - Wrapped with `DragDropContext`, `Droppable`, and `Draggable`.
    - Calls `reorderTasks` from context when you drop a task.
  - Includes a note:
    - Drag-and-drop reordering is **enabled only when no filters are applied**, to keep the logic simple.
  - Shows `EmptyState` when there are no tasks.

- **`src/components/TaskCard.jsx`**
  - Individual task item.
  - Displays title, description, priority badge, status badge, and deadline.
  - Shows AI-generated subtasks as a bullet list if they exist.
  - Buttons for **Edit** and **Delete** (wired to callbacks from parent).

- **`src/components/EmptyState.jsx`**
  - Friendly view when there are **no tasks yet**.
  - Encourages you to create your first task and try AI breakdown.

- **`src/components/LoadingSpinner.jsx`**
  - Tiny spinner with label, used for AI loading state.

- **`src/components/ErrorBanner.jsx`**
  - Reusable small error message box with an optional Dismiss button.
  - Used in the form to show validation + AI errors.

---

## 3. Getting started (step-by-step)

### 3.1. Prerequisites

- Install **Node.js** (version 18 or later recommended).
- Install **npm** (comes with Node).

You can check your versions:

```bash
node -v
npm -v
```

### 3.2. Install dependencies

From the project root (`notify-sender-svc`):

```bash
npm install
```

This will download React, Vite, Tailwind, react-beautiful-dnd, etc.

### 3.3. (Optional but recommended) Configure OpenAI API key

To use real AI suggestions, you need an **OpenAI API key**.

1. Create a file named **`.env`** in the **project root** (same folder as `package.json`).
2. Add this line (replace with your key):

```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

> ⚠ **Important:** Putting API keys in frontend code is fine for local learning and experiments, but **not recommended for production apps**, because users can inspect and copy the key from the browser bundle. For a real app, you should proxy the AI request through a small backend service.

If you **do not** set this variable, the app will still work and show a **generic fallback breakdown** when you click “Suggest with AI”.

### 3.4. Start the dev server

Run:

```bash
npm run dev
```

Vite will print a URL, usually:

```text
http://localhost:5173
```

Open that link in your browser.

---

## 4. How to use the app

1. **Add a task**
   - Fill in the **Title** (required).
   - Optionally, fill **Description**, select **Priority**, **Status**, and **Deadline**.
   - Click **“Add task”**.

2. **Ask AI to break it down**
   - Before saving (or when editing), click **“Suggest with AI”**.
   - If the API key is configured, the app calls OpenAI and shows 3–7 subtasks.
   - If no key is configured, you get generic example steps.
   - Subtasks are saved with the task and shown on the task card.

3. **Edit a task**
   - Click **“Edit”** on any task card.
   - The form loads the task’s values; change what you want.
   - Click **“Save changes”**.

4. **Delete a task**
   - Click **“Delete”** on a task card.

5. **Filter & sort**
   - Use the **Priority** and **Status** dropdowns in the `FilterBar`.
   - Change **Sort by** to modify the order (deadline or priority).

6. **Drag and drop to reorder**
   - Clear all filters (Priority = All, Status = All).
   - Click and drag a task card to a new position.
   - Release to drop; the new order is saved in `localStorage`.

7. **Dark / light mode**
   - Use the **Dark/Light mode toggle** in the header.
   - Your choice is saved in `localStorage` and remembered on next visit.

8. **Persistence**
   - All tasks and their subtasks are stored in your **browser’s localStorage**.
   - If you refresh the page, your tasks remain.

---

## 5. React concepts used

- **`useState`**: local component state (form fields, editing state, loading flags).
- **`useEffect`**:
  - Saving tasks to `localStorage` when they change.
  - Reading initial tasks and theme from `localStorage`.
  - Updating the `<html>` `class` for dark mode.
- **`useContext`**:
  - Global state for tasks and filters lives in `TaskContext`.
  - `TaskProvider` wraps `App`, and `useTasks()` gives access inside components.
- **`useMemo`**:
  - Computes `filteredSortedTasks` efficiently when filters/sort settings or tasks change.

---

## 6. Next steps / ideas

If you want to extend this project as you learn:

- Add **search** by task title.
- Add **tags** or **categories**.
- Allow **checking off** individual subtasks.
- Add a small **backend** (Node/Express) to hide the AI API key from the frontend.
- Add **user authentication** to sync tasks across devices.

---

## 7. Summary

This app shows a complete beginner-friendly example of:

- Setting up **React + Vite + Tailwind**.
- Using **Context API** and hooks for global state.
- Integrating a **real AI API** for task breakdowns.
- Adding **drag-and-drop**, filters, sorting, and **localStorage persistence**.

Feel free to tweak the UI, experiment with the code, and use this as a template for your own productivity tools.

