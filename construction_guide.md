Backend Mock API: <https://github.com/hmuhein-sph/tasks-mock-api>
Create a frontend React app in Typescript using any framework. Backend mock api is provided.
The app should integrate with the backend api and have the features including:

1. Task List View
○ Fetch tasks from GET /tasks on load.
○ Display each task’s title and a completed checkbox.
○ Show a basic loading state while fetching.
○ Show a basic error state if the fetch fails.
2. Add Task
○ An input + button to create a new task via POST /tasks.
○ Update the UI without a full page reload.
○ Basic validation (e.g. don’t allow empty titles).
3. Toggle Complete
○ Toggling a checkbox sends PATCH /tasks/:id with the new completed value.
○ The UI should reflect the latest state.
4. Delete Task
○ A “Delete” button per task that calls DELETE /tasks/:id.
○ Remove the task from the list when successful.
5. Code Quality Expectations
○ Use TypeScript types for Task, props, and component state.
○ Extract at least one reusable component (e.g. TaskItem).
○ Keep a simple, reasonable file structure (e.g. components/, api/, hooks/, pages/).
○ Prefer clear naming and readable code over cleverness.

# Project Construction Guide: tasks-app (Standard Template)

This guide outlines the steps to build a modern, scalable React application using **Custom Hooks** and **React Router**.

## 1. Project Initialization

Create a new React project with TypeScript using Vite.

```bash
npm create vite@latest tasks-app -- --template react-ts
cd tasks-app
npm install react-router-dom axios # axios is optional but recommended
npm install
```

## 2. Folder Structure

Organize your `src` folder to keep concerns separated:
- `api/` - Pure fetch/axios functions.
- `components/` - Reusable UI elements.
- `hooks/` - Business logic and state management.
- `pages/` - Full screen views.
- `types/` - TypeScript interfaces.

## 3. Custom Hook Pattern (`src/hooks/useTasks.ts`)

Encapsulate all task-related logic here. This keeps your components "dumb" and focused only on UI.

```typescript
import { useState, useEffect } from "react";
import type { Task } from "../types/Task";
import * as api from "../api/tasks";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleAddTask = async (title: string) => {
    const newTask = await api.createTask(title);
    setTasks(prev => [...prev, newTask]);
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await api.updateTask(id, { completed });
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t));
  };

  const handleDelete = async (id: string) => {
    await api.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, loading, error, handleAddTask, handleToggle, handleDelete };
};
```

## 4. Routing Setup (`src/App.tsx`)

Use `Routes` and `Route` to manage navigation.

```tsx
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { TaskDetail } from "./pages/TaskDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/task/:id" element={<TaskDetail />} />
    </Routes>
  );
}
```

Don't forget to wrap `<App />` in `<BrowserRouter>` in your `main.tsx`.

## 5. Clean Components (`src/components/TaskItem.tsx`)

Use `Link` for navigation and avoid complex logic inside the component.

```tsx
import { Link } from "react-router-dom";
import type { Task } from "../types/Task";

export const TaskItem = ({ task, onToggle, onDelete }) => (
  <div className="task-item">
    <input 
      type="checkbox" 
      checked={task.completed} 
      onChange={() => onToggle(task.id, !task.completed)} 
    />
    <Link to={`/task/${task.id}`} style={{ flex: 1 }}>{task.title}</Link>
    <button onClick={() => onDelete(task.id)}>✕</button>
  </div>
);
```

## 6. Pro Tips for Live Coding

1.  **Loading States**: Always show a spinner or "Loading..." text during fetches.
2.  **Error Handling**: Use `try/catch` and show user-friendly error messages.
3.  **Derived State**: Use `useMemo` for filters and search queries to avoid unnecessary re-renders.
4.  **Controlled Inputs**: Always link `input` values to React state.
