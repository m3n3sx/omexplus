"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { StickyNote, Plus, Pin, Trash2 } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  category: string
  color: string
  created_by: string
  shared_with: string[] | null
  pinned: boolean
  created_at: string
  updated_at: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [showNewNote, setShowNewNote] = useState(false)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "general",
    color: "#fbbf24",
    pinned: false,
  })

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/team/notes?user_id=admin`,
        {
          headers: {
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
        }
      )
      const data = await response.json()
      setNotes(data.notes || [])
    } catch (error) {
      console.error("Error loading notes:", error)
    }
  }

  const createNote = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/team/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({
          ...newNote,
          created_by: "admin",
          shared_with: ["all"],
        }),
      })
      setShowNewNote(false)
      setNewNote({ title: "", content: "", category: "general", color: "#fbbf24", pinned: false })
      loadNotes()
    } catch (error) {
      console.error("Error creating note:", error)
    }
  }

  const colors = [
    { name: "Żółty", value: "#fbbf24" },
    { name: "Niebieski", value: "#3b82f6" },
    { name: "Zielony", value: "#10b981" },
    { name: "Różowy", value: "#ec4899" },
    { name: "Fioletowy", value: "#8b5cf6" },
    { name: "Pomarańczowy", value: "#f97316" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Notatki</h1>
          <button
            onClick={() => setShowNewNote(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Nowa notatka
          </button>
        </div>

        {/* Pinned Notes */}
        {notes.some(n => n.pinned) && (
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Pin className="w-5 h-5" />
              Przypięte
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {notes.filter(n => n.pinned).map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: note.color + "40" }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{note.title}</h3>
                    <Pin className="w-4 h-4 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-4">
                    {note.content}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{note.category}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(note.updated_at).toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Notes */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Wszystkie notatki</h2>
          <div className="grid grid-cols-4 gap-4">
            {notes.filter(n => !n.pinned).map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                style={{ backgroundColor: note.color + "40" }}
              >
                <h3 className="font-semibold mb-2">{note.title}</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-4">
                  {note.content}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{note.category}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(note.updated_at).toLocaleDateString("pl-PL")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Note Modal */}
        {showNewNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Nowa notatka</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Tytuł notatki"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
                <textarea
                  placeholder="Treść notatki"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={6}
                />
                <select
                  value={newNote.category}
                  onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="general">Ogólne</option>
                  <option value="work">Praca</option>
                  <option value="personal">Osobiste</option>
                  <option value="ideas">Pomysły</option>
                </select>
                <div>
                  <label className="block text-sm font-medium mb-2">Kolor</label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNewNote({ ...newNote, color: color.value })}
                        className={`w-8 h-8 rounded-full ${newNote.color === color.value ? "ring-2 ring-offset-2 ring-gray-400" : ""}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newNote.pinned}
                    onChange={(e) => setNewNote({ ...newNote, pinned: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Przypnij notatkę</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={createNote}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Utwórz
                  </button>
                  <button
                    onClick={() => setShowNewNote(false)}
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
