const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://todoapi-9e6k.onrender.com/api"

export interface Task {
  id: number
  title: string
  description: string
  priority: 1 | 2 | 3
  compeleted: boolean
  due_date: string
  created_at: string
  updated: string
}

export interface AuthResponse {
  token: string
  username: string
  success?: string
  error?: string
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
  const data = await response.json()
  return { ...data, username }
}

export async function signup(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
  const data = await response.json()
  return { ...data, username }
}

export async function getTasks(token: string): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/tasks/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
  return response.json()
}

export async function createTask(token: string, task: Omit<Task, "id" | "created_at" | "updated">): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })
  return response.json()
}

export async function updateTask(token: string, taskId: number, updates: Partial<Task>): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/task/${taskId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  })
  return response.json()
}

export async function deleteTask(token: string, taskId: number): Promise<void> {
  await fetch(`${API_BASE_URL}/task/${taskId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
    },
  })
}

