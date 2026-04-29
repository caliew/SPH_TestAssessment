import { useState, useMemo } from "react";
import { useTasks } from "../hooks/useTasks";
import { TaskItem } from "../components/TaskItem";

type FilterStatus = "all" | "active" | "completed";

export const Home = () => {
  const { tasks, loading, error, handleAddTask, handleToggle, handleDelete } = useTasks();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");

  const onAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      await handleAddTask(newTaskTitle);
      setNewTaskTitle("");
    } catch (err) {
      alert(err);
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
  if (error) return <div className="glass-card"><h2 style={{ color: '#ef4444' }}>{error}</h2></div>;

  return (
    <div className="glass-card">
      <h1>Task List</h1>

      <form onSubmit={onAddSubmit} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
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
