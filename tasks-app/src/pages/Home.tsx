import { useState, useMemo } from "react";
import { useTasks } from "../hooks/useTasks";
import { TaskItem } from "../components/TaskItem";
import { useForm } from "../hooks/useForm";

type FilterStatus = "all" | "active" | "completed";

export const Home = () => {
  const { tasks, loading, error, handleAddTask, handleToggle, handleDelete } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");

  const { values, handleChange, handleSubmit, resetForm, isSubmitting } = useForm({
    initialValues: { title: "" },
    onSubmit: async (values) => {
      if (!values.title.trim()) return;
      await handleAddTask(values.title);
      resetForm();
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.title.trim()) errors.title = "Title is required";
      return errors;
    }
  });

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

  if (loading && tasks.length === 0) return <div className="glass-card"><h2>Loading...</h2></div>;
  // Note: we don't return early for error here because the Notification system handles it, 
  // but we could still show a UI state if we wanted.

  return (
    <div className="glass-card">
      <h1>Task List</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <input
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          placeholder="Add a new task..."
          style={{ flex: 2 }}
          disabled={isSubmitting}
        />
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add"}
        </button>
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
        {filteredTasks.length === 0 && !loading && (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>No tasks found.</p>
        )}
        {filteredTasks.map(task => (
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
};
