"use client"

import { useState } from "react"
import type { Task } from "@/utils/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (taskId: number, completed: boolean) => Promise<void>
  onDelete: (taskId: number) => Promise<void>
}

const priorityColors = {
  1: "bg-blue-100 text-blue-800",
  2: "bg-yellow-100 text-yellow-800",
  3: "bg-red-100 text-red-800",
}

const priorityLabels = {
  1: "Low",
  2: "Medium",
  3: "High",
}

export function TaskList({ tasks, onToggleComplete, onDelete }: TaskListProps) {
  const [loading, setLoading] = useState<number | null>(null)

  const handleToggle = async (taskId: number, completed: boolean) => {
    setLoading(taskId)
    await onToggleComplete(taskId, completed)
    setLoading(null)
  }

  const handleDelete = async (taskId: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setLoading(taskId)
      await onDelete(taskId)
      setLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className={task.compeleted ? "opacity-75" : ""}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={task.compeleted}
                onCheckedChange={(checked) => handleToggle(task.id, checked as boolean)}
                disabled={loading === task.id}
              />
              <CardTitle className={`text-xl ${task.compeleted ? "line-through text-gray-500" : ""}`}>
                {task.title}
              </CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className={priorityColors[task.priority]}>
                {priorityLabels[task.priority]}
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)} disabled={loading === task.id}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className={`text-gray-600 ${task.compeleted ? "line-through" : ""}`}>{task.description}</p>
            <p className="text-sm text-gray-500 mt-2">Due: {format(new Date(task.due_date), "PPP")}</p>
          </CardContent>
        </Card>
      ))}
      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">No tasks yet. Create one to get started!</div>
      )}
    </div>
  )
}

