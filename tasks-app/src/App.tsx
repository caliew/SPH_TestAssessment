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

  // Filtered and Searched Tasks
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

  if (loading) {
    return (
      <div className="glass-card" style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#38bdf8' }}>Loading your tasks...</h2>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h1>Task List</h1>

      {/* Search & Add Section */}
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

      {/* Filter Tabs */}
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

      {/* Task List */}
      <div style={{ minHeight: '200px' }}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={handleToggle} 
              onDelete={handleDelete} 
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            {searchQuery || filter !== 'all' ? "No tasks match your criteria" : "Your list is empty. Add a task to get started!"}
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>{tasks.filter(t => !t.completed).length} tasks remaining</span>
        <span>{tasks.length} total</span>
      </div>
    </div>
  );
}

export default App;
