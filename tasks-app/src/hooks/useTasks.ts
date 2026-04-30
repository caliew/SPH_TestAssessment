import { useEffect, useState } from "react";
import type { Task } from "../types/Task";
import * as api from "../api/tasks";
import { useApi } from "./useApi";
import { useNotification } from "../components/NotificationContext";

export const useTasks = () => {
  const { showNotification } = useNotification();
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const { loading, error, execute: fetchTasks } = useApi(api.getTasks, {
    onSuccess: (data) => setTasks(data),
    onError: (err) => showNotification(err, "error")
  });

  const { execute: addTaskApi } = useApi(api.createTask, {
    onSuccess: (newTask) => {
      setTasks(prev => [...prev, newTask]);
      showNotification("Task added successfully", "success");
    },
    onError: (err) => showNotification(err, "error")
  });

  const { execute: updateTaskApi } = useApi(api.updateTask, {
    onSuccess: (updatedTask) => {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    },
    onError: (err) => showNotification(err, "error")
  });

  const { execute: deleteTaskApi } = useApi(api.deleteTask, {
    onSuccess: (_, [id]) => { // Second arg is the params passed to execute
      setTasks(prev => prev.filter(t => t.id !== id));
      showNotification("Task deleted", "info");
    },
    onError: (err) => showNotification(err, "error")
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    handleAddTask: addTaskApi,
    handleToggle: (id: string, completed: boolean) => updateTaskApi(id, { completed }),
    handleDelete: deleteTaskApi,
    refresh: fetchTasks
  };
};
