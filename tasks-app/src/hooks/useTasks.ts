import { useState, useEffect } from "react";
import type { Task } from "../types/Task";
import * as api from "../api/tasks";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await api.getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (title: string) => {
    try {
      const newTask = await api.createTask(title);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      throw new Error("Error adding task");
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await api.updateTask(id, { completed });
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t));
    } catch (err) {
      throw new Error("Error updating task");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      throw new Error("Error deleting task");
    }
  };

  return {
    tasks,
    loading,
    error,
    handleAddTask,
    handleToggle,
    handleDelete,
    refresh: fetchTasks
  };
};
