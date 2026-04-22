# Project Construction Guide: tasks-app

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

This guide outlines the steps to build the `tasks-app` frontend, ensuring it correctly communicates with the backend at `http://localhost:4001`.

## 1. Project Initialization

Create a new React project with TypeScript using Vite.

```bash
npm create vite@latest tasks-app -- --template react-ts
cd tasks-app
npm install
```

## 2. Define Task Type

Create `src/types/Task.ts` to maintain consistent data structures.

```typescript
export interface Task {
  id: string;
  title: string;
  completed: boolean;
}
```

## 3. Create API Service

Create `src/api/tasks.ts` to handle all HTTP requests to the backend (Port 4001).

```typescript
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
    method: "PATCH", // or PUT depending on backend
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

Create `src/components/TaskItem.tsx` for displaying individual tasks.

```tsx
import { Task } from "../types/Task";

interface Props {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<Props> = ({ task, onToggle, onDelete }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderBottom: '1px solid #ccc' }}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => onToggle(task.id, e.target.checked)}
      />
      <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.title}
      </span>
      <button onClick={() => onDelete(task.id)} style={{ color: 'red', marginLeft: 'auto' }}>
        Delete
      </button>
    </div>
  );
};
```

## 5. Main Application Logic

Update `src/App.tsx` to orchestrate the state and API calls.

```tsx
import { useEffect, useState } from "react";
import { Task } from "./types/Task";
import { TaskItem } from "./components/TaskItem";
import * as api from "./api/tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    api.getTasks().then(setTasks).finally(() => setLoading(false));
  }, []);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    const newTask = await api.createTask(newTaskTitle);
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await api.updateTask(id, { completed });
    setTasks(tasks.map(t => t.id === id ? { ...t, completed } : t));
  };

  const handleDelete = async (id: string) => {
    await api.deleteTask(id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Task List</h1>
      <div style={{ marginBottom: '20px' }}>
        <input 
          value={newTaskTitle} 
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <div>
        {tasks.map(task => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onToggle={handleToggle} 
            onDelete={handleDelete} 
          />
        ))}
      </div>
    </div>
  );
}

export default App;
```

## 6. Run the Project

Ensure your backend is running on port 4001, then start the frontend.

```bash
npm run dev
```
