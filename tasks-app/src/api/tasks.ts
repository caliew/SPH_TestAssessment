import { api } from "./apiClient";
import type { Task } from "../types/Task";

export const getTasks = () => api.get<Task[]>("/tasks");

export const createTask = (title: string) => 
    api.post<Task>("/tasks", { title, completed: false });

export const updateTask = (id: string, updates: Partial<Task>) => 
    api.patch<Task>(`/tasks/${id}`, updates);

export const deleteTask = (id: string) => 
    api.delete<void>(`/tasks/${id}`);
