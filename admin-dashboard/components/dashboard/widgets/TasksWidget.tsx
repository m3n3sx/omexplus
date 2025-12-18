"use client"

import { useState, useEffect } from "react"
import { CheckSquare, Plus, Circle, CheckCircle2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

const STORAGE_KEY = 'omex_dashboard_tasks'

export default function TasksWidget() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setTasks(JSON.parse(stored))
      } catch {}
    }
  }, [])

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks))
  }

  const addTask = () => {
    if (!newTask.trim()) return
    
    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    }
    
    saveTasks([task, ...tasks])
    setNewTask("")
    setIsAdding(false)
  }

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    )
    saveTasks(updated)
  }

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id))
  }

  const pendingTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)

  return (
    <div className="space-y-3">
      {/* Add task */}
      {isAdding ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Nowe zadanie..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={addTask}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Dodaj
          </button>
          <button
            onClick={() => { setIsAdding(false); setNewTask("") }}
            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
          >
            Anuluj
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Dodaj zadanie
        </button>
      )}

      {/* Pending tasks */}
      {pendingTasks.length === 0 && completedTasks.length === 0 ? (
        <div className="text-center py-6">
          <CheckSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Brak zadań</p>
        </div>
      ) : (
        <div className="space-y-1">
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 group"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="text-gray-400 hover:text-blue-600"
              >
                <Circle className="w-5 h-5" />
              </button>
              <span className="flex-1 text-sm text-gray-700">{task.text}</span>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Completed tasks */}
          {completedTasks.length > 0 && (
            <>
              <div className="text-xs text-gray-400 pt-2 pb-1">
                Ukończone ({completedTasks.length})
              </div>
              {completedTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 group opacity-60"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="text-green-500"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <span className="flex-1 text-sm text-gray-500 line-through">{task.text}</span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex justify-between text-xs text-gray-400 pt-2 border-t">
        <span>{pendingTasks.length} do zrobienia</span>
        <span>{completedTasks.length} ukończonych</span>
      </div>
    </div>
  )
}
