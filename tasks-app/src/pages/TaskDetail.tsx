import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { Task } from "../types/Task";
import * as api from "../api/tasks";

export const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getTasks()
        .then(tasks => {
          const found = tasks.find(t => t.id === id);
          if (found) setTask(found);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="glass-card"><h2>Loading details...</h2></div>;
  if (!task) return <div className="glass-card"><h2>Task not found</h2><Link to="/">Back to list</Link></div>;

  return (
    <div className="glass-card">
      <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none', marginBottom: '1rem', display: 'block' }}>
        ← Back to List
      </Link>
      <h1>Task Details</h1>
      <div style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.2)', borderRadius: '16px' }}>
        <h2 style={{ margin: '0 0 1rem 0' }}>{task.title}</h2>
        <p>Status: <span style={{ color: task.completed ? '#10b981' : '#f59e0b' }}>
          {task.completed ? "Completed" : "Active"}
        </span></p>
        <p>ID: {task.id}</p>
      </div>
      
      <button 
        onClick={() => navigate('/')} 
        className="primary" 
        style={{ marginTop: '1.5rem', width: '100%' }}
      >
        Done
      </button>
    </div>
  );
};
