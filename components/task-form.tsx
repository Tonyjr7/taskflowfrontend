"use client"

import { useState } from "react"
import type { Task } from "@/utils/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "created_at" | "updated">) => Promise<void>
  initialData?: Partial<Task>
  submitLabel?: string
}

export function TaskForm({ onSubmit, initialData = {}, submitLabel = "Create Task" }: TaskFormProps) {
  const [title, setTitle] = useState(initialData.title || "")
  const [description, setDescription] = useState(initialData.description || "")
  const [priority, setPriority] = useState<string>(initialData.priority?.toString() || "2")
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialData.due_date ? new Date(initialData.due_date) : undefined,
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        title,
        description,
        priority: Number.parseInt(priority) as 1 | 2 | 3,
        compeleted: false,
        due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      })
      setTitle("")
      setDescription("")
      setPriority("2")
      setDueDate(undefined)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div>
        <Textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Low Priority</SelectItem>
              <SelectItem value="2">Medium Priority</SelectItem>
              <SelectItem value="3">High Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a due date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : submitLabel}
      </Button>
    </form>
  )
}

