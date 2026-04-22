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
        method: "PATCH", // or PUT depending on backend
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });
    return res.json();
};

export const deleteTask = async (id: string): Promise<void> => {
    await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });
};
