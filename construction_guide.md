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

# Project Construction Guide: tasks-app (Premium Template)

This guide outlines the steps to build a modern, scalable React application using **Custom Hooks**, **Generic API Utilities**, and **React Router**.

## 1. Project Initialization

Create a new React project with TypeScript using Vite.

```bash
npm create vite@latest tasks-app -- --template react-ts
cd tasks-app
npm install react-router-dom
npm install
```

## 2. Advanced Folder Structure

Organize your `src` folder to keep concerns separated:
- `api/` - Centralized `apiClient` and domain-specific endpoints.
- `components/` - Reusable UI elements, Context providers, and Layouts.
- `hooks/` - Generic hooks (`useApi`, `useForm`) and business logic (`useTasks`).
- `pages/` - Full screen views.
- `types/` - TypeScript interfaces.

## 3. The Power of Generic Hooks

To save time during assessments, use generic hooks to handle repetitive logic.

### Generic API Hook (`src/hooks/useApi.ts`)
Handles `loading`, `error`, and `data` states for any async function.

```typescript
export const useApi = <T, Args extends any[]>(
  apiFunc: (...args: Args) => Promise<T>,
  options: { onSuccess?: (data: T, args: Args) => void; onError?: (error: string) => void } = {}
) => {
  const [state, setState] = useState({ data: null, loading: false, error: null });
  const execute = useCallback(async (...args: Args) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await apiFunc(...args);
      setState({ data, loading: false, error: null });
      options.onSuccess?.(data, args);
      return data;
    } catch (err) {
      const msg = err.message || "Error occurred";
      setState({ data: null, loading: false, error: msg });
      options.onError?.(msg);
      throw err;
    }
  }, [apiFunc, options]);
  return { ...state, execute };
};
```

### Generic Form Hook (`src/hooks/useForm.ts`)
Manages input states and submission logic.

```typescript
export const useForm = ({ initialValues, onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const handleChange = (e) => setValues(v => ({ ...v, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(values); };
  return { values, handleChange, handleSubmit };
};
```

## 4. Refined Domain Logic (`src/hooks/useTasks.ts`)

By using `useApi`, your domain hooks become much shorter and more readable.

```typescript
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { showNotification } = useNotification();

  const { loading, execute: fetchTasks } = useApi(api.getTasks, {
    onSuccess: (data) => setTasks(data)
  });

  const { execute: handleAddTask } = useApi(api.createTask, {
    onSuccess: (newTask) => {
      setTasks(prev => [...prev, newTask]);
      showNotification("Task added!", "success");
    }
  });

  return { tasks, loading, handleAddTask, refresh: fetchTasks };
};
```

## 5. Global Setup (`src/App.tsx`)

Wrap your app in providers and a common layout.

```tsx
function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/task/:id" element={<TaskDetail />} />
          </Routes>
        </Layout>
      </NotificationProvider>
    </ErrorBoundary>
  );
}
```

## 6. Pro Tips for Assessment Success

1.  **Notification Feedback**: Use the `useNotification` hook to give immediate visual feedback on API actions.
2.  **Centralized API**: Use an `apiClient` to handle base URLs and headers in one place.
3.  **Error Boundaries**: Always wrap your app in an `ErrorBoundary` to handle unexpected crashes gracefully.
4.  **Loading states**: Disable buttons (`isSubmitting`) during API calls to prevent double submissions.
5.  **Clean JSX**: Keep components small and logic-free by pushing everything into custom hooks.
