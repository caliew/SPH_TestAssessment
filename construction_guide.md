Backend Mock API: <https://github.com/hmuhein-sph/tasks-mock-api>
Create a frontend React app in Typescript using any framework. Backend mock api is
provided.
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
○ Toggling a checkbox sends PATCH /tasks/:id with the new completed
value.
○ The UI should reflect the latest state (optimistic or non-optimistic is fine; just be
consistent).
4. Delete Task
○ A “Delete” button per task that calls DELETE /tasks/:id.
○ Remove the task from the list when successful.
5. Code Quality Expectations
○ Use TypeScript types for Task, props, and component state.
○ Extract at least one reusable component (e.g. TaskItem).
○ Keep a simple, reasonable file structure (e.g. components/, api/).
○ Prefer clear naming and readable code over cleverness.
Stretch ideas (only if time allows, not required):
● Filter: all / completed / active
● Search by keyword
● Very simple routing (e.g. / vs /completed)

# Project Construction Guide: tasks-app

This guide outlines the steps to build the `tasks-app` frontend, ensuring it correctly communicates with the backend at `http://localhost:4001`.

## 1. Project Initialization

Create a new React project with TypeScript using Vite.

```bash
npm create vite@latest tasks-app -- --template react-ts
cd tasks-app
npm install
```

## 2. Define Task Type

Create `src/types/Task.ts`. We use `type` instead of `interface` for better compatibility with strict module syntax.

```typescript
export type Task = {
  id: string;
  title: string;
  completed: boolean;
};
```

## 3. Create API Service

Create `src/api/tasks.ts`. Ensure you use `import type` to avoid runtime syntax errors.

```typescript
import type { Task } from "../types/Task";

const BASE_URL = "http://localhost:4001";

export const getTasks = async (): Promise<Task[]> => {
  const res = await fetch(`${BASE_URL}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

export const createTask = async (title: string): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, completed: false }),
  });
  return res.json();
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return res.json();
};

export const deleteTask = async (id: string): Promise<void> => {
  await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });
};
```

## 4. Create TaskItem Component

Create `src/components/TaskItem.tsx`. This component handles individual task rendering and interactions.

```tsx
import type { Task } from "../types/Task";

interface Props {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<Props> = ({ task, onToggle, onDelete }) => {
  return (
    <div className="task-item">
      <div 
        className={`checkbox-wrapper ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggle(task.id, !task.completed)}
      >
        {task.completed && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
      </div>
      
      <span style={{ 
        textDecoration: task.completed ? 'line-through' : 'none',
        color: task.completed ? '#94a3b8' : 'white',
        fontSize: '1rem',
        fontWeight: 500
      }}>
        {task.title}
      </span>
      
      <button 
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        title="Delete Task"
      >
        ✕
      </button>
    </div>
  );
};
```

## 5. Main Application Logic

Update `src/App.tsx`. This version includes **Filtering**, **Search**, and derived state using `useMemo`.

```tsx
import { useEffect, useState, useMemo } from "react";
import type { Task } from "./types/Task";
import { TaskItem } from "./components/TaskItem";
import * as api from "./api/tasks";

type FilterStatus = "all" | "active" | "completed";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");

  useEffect(() => {
    api.getTasks()
      .then(setTasks)
      .catch(err => console.error("Failed to load tasks:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    try {
      const newTask = await api.createTask(newTaskTitle);
      setTasks(prev => [...prev, newTask]);
      setNewTaskTitle("");
    } catch (err) {
      alert("Error adding task");
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await api.updateTask(id, { completed });
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t));
    } catch (err) {
      alert("Error updating task");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert("Error deleting task");
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = 
        filter === "all" ? true :
        filter === "active" ? !task.completed :
        task.completed;
      
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, filter]);

  if (loading) return <div className="glass-card"><h2>Loading...</h2></div>;

  return (
    <div className="glass-card">
      <h1>Task List</h1>

      <form onSubmit={handleAddTask} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          style={{ flex: 2 }}
        />
        <button type="submit" className="primary">Add</button>
      </form>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
        />
      </div>

      <div className="filter-tabs">
        {(["all", "active", "completed"] as FilterStatus[]).map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ minHeight: '200px' }}>
        {filteredTasks.map(task => (
          <TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default App;
```

## 6. Styling (Premium UI)

Replace `src/index.css` with the following modern design.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  font-family: 'Inter', sans-serif;
  color-scheme: light dark;
  color: white;
  background-color: #0f172a;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-height: 100vh;
  background: radial-gradient(circle at top left, #1e293b 0%, #0f172a 100%);
}

#root { width: 100%; padding: 2rem; }

.glass-card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

h1 {
  background: linear-gradient(to right, #38bdf8, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

input[type="text"] {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: white;
  width: 100%;
  outline: none;
}

button.primary {
  background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: rgba(15, 23, 42, 0.3);
  padding: 4px;
  border-radius: 14px;
}

.filter-tab {
  flex: 1;
  padding: 0.5rem;
  background: transparent;
  color: #94a3b8;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.filter-tab.active { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }

.task-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.2);
  border-radius: 16px;
  margin-bottom: 0.75rem;
}

.checkbox-wrapper {
  width: 24px;
  height: 24px;
  border: 2px solid #38bdf8;
  border-radius: 50%;
  cursor: pointer;
}

.checkbox-wrapper.checked { background: #38bdf8; }

.delete-btn { margin-left: auto; color: #ef4444; background: none; border: none; cursor: pointer; }
```
