"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getTasks, createTask, updateTask, deleteTask, type Task } from "@/utils/api"
import { TaskForm } from "@/components/task-form"
import { TaskList } from "@/components/task-list"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { token, logout, username } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }

    loadTasks()
  }, [token, router])

  const loadTasks = async () => {
    try {
      const tasks = await getTasks(token!)
      setTasks(tasks)
    } catch (err) {
      setError("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData: Omit<Task, "id" | "created_at" | "updated">) => {
    try {
      const newTask = await createTask(token!, taskData)
      setTasks((prev) => [...prev, newTask])
    } catch (err) {
      setError("Failed to create task")
    }
  }

  const handleToggleComplete = async (taskId: number, completed: boolean) => {
    try {
      await updateTask(token!, taskId, { compeleted: completed })
      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, compeleted: completed } : task)))
    } catch (err) {
      setError("Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(token!, taskId)
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
    } catch (err) {
      setError("Failed to delete task")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-background text-foreground">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            {username && <p className="text-muted-foreground mt-1">Hi, {username}</p>}
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-card rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Create New Task</h2>
            <TaskForm onSubmit={handleCreateTask} />
          </div>
          {error && <div className="text-destructive mb-4">{error}</div>}
          <TaskList tasks={tasks} onToggleComplete={handleToggleComplete} onDelete={handleDeleteTask} />
        </div>
      </main>
    </div>
  )
}

