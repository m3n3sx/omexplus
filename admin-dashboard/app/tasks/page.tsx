"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { CheckCircle, Circle, Clock, AlertCircle, Plus, Filter } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  assigned_to: string
  assigned_by: string
  due_date: string
  completed_at: string
  created_at: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState("all")
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
  })

  useEffect(() => {
    loadTasks()
  }, [filter])

  const loadTasks = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/team/tasks?assigned_to=admin${filter !== "all" ? `&status=${filter}` : ""}`
      const response = await fetch(url, {
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
      })
      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error("Error loading tasks:", error)
    }
  }

  const createTask = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/team/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({
          ...newTask,
          assigned_to: "admin",
          assigned_by: "admin",
        }),
      })
      setShowNewTask(false)
      setNewTask({ title: "", description: "", priority: "medium", due_date: "" })
      loadTasks()
    } catch (error) {
      console.error("Error creating task:", error)
    }
  }

  const updateTaskStatus = async (id: string, status: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/team/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({ status }),
      })
      loadTasks()
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-600 bg-red-50"
      case "high": return "text-orange-600 bg-orange-50"
      case "medium": return "text-yellow-600 bg-yellow-50"
      case "low": return "text-green-600 bg-green-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done": return <CheckCircle className="w-5 h-5 text-green-600" />
      case "in_progress": return <Clock className="w-5 h-5 text-blue-600" />
      case "cancelled": return <AlertCircle className="w-5 h-5 text-red-600" />
      default: return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === "todo").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    done: tasks.filter(t => t.status === "done").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Zadania</h1>
            <p className="text-gray-600">Zarządzaj swoimi zadaniami</p>
          </div>
          <button
            onClick={() => setShowNewTask(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Nowe zadanie
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Wszystkie</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Do zrobienia</p>
            <p className="text-2xl font-bold text-gray-600">{stats.todo}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">W trakcie</p>
            <p className="text-2xl font-bold text-blue-600">{stats.in_progress}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Ukończone</p>
            <p className="text-2xl font-bold text-green-600">{stats.done}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {["all", "todo", "in_progress", "done"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg ${filter === f ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
            >
              {f === "all" ? "Wszystkie" : f === "todo" ? "Do zrobienia" : f === "in_progress" ? "W trakcie" : "Ukończone"}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <button onClick={() => {
                  const newStatus = task.status === "done" ? "todo" : task.status === "todo" ? "in_progress" : "done"
                  updateTaskStatus(task.id, newStatus)
                }}>
                  {getStatusIcon(task.status)}
                </button>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-semibold ${task.status === "done" ? "line-through text-gray-400" : ""}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.due_date && (
                    <p className="text-xs text-gray-500 mt-2">
                      Termin: {new Date(task.due_date).toLocaleDateString("pl-PL")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Task Modal */}
        {showNewTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Nowe zadanie</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Tytuł zadania"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
                <textarea
                  placeholder="Opis (opcjonalnie)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                />
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="low">Niski priorytet</option>
                  <option value="medium">Średni priorytet</option>
                  <option value="high">Wysoki priorytet</option>
                  <option value="urgent">Pilne</option>
                </select>
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={createTask}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Utwórz
                  </button>
                  <button
                    onClick={() => setShowNewTask(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
