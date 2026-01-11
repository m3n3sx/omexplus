"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, X } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  all_day: boolean
  location: string
  type: string
  color: string
}

const EVENT_COLORS = [
  { name: "Niebieski", value: "#3B82F6" },
  { name: "Zielony", value: "#10B981" },
  { name: "Czerwony", value: "#EF4444" },
  { name: "Żółty", value: "#F59E0B" },
  { name: "Fioletowy", value: "#8B5CF6" },
  { name: "Różowy", value: "#EC4899" },
]

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [showDayEvents, setShowDayEvents] = useState(false)
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    all_day: true,
    location: "",
    type: "meeting",
    color: "#3B82F6",
  })

  useEffect(() => {
    loadEvents()
  }, [currentDate])

  const loadEvents = async () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      const token = localStorage.getItem("medusa_admin_token")
      
      const response = await fetch(
        `${BACKEND_URL}/admin/calendar?start_date=${startOfMonth.toISOString()}&end_date=${endOfMonth.toISOString()}&user_id=admin`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
          },
        }
      )
      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error("Error loading events:", error)
    }
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Puste dni przed pierwszym dniem miesiąca
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Dni miesiąca
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getEventsForDate = (date: Date | null) => {
    if (!date) return []
    return events.filter(event => {
      const eventDate = new Date(event.start_date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const openNewEventModal = (date?: Date) => {
    const targetDate = date || new Date()
    const dateStr = targetDate.toISOString().split('T')[0]
    setNewEvent({
      title: "",
      description: "",
      start_date: dateStr,
      end_date: dateStr,
      all_day: true,
      location: "",
      type: "meeting",
      color: "#3B82F6",
    })
    setShowNewEvent(true)
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvent.title || !newEvent.start_date) {
      alert("Tytuł i data są wymagane")
      return
    }

    try {
      setSaving(true)
      setError(null)
      const token = localStorage.getItem("medusa_admin_token")
      const response = await fetch(
        `${BACKEND_URL}/admin/calendar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            ...newEvent,
            user_id: "admin",
          }),
        }
      )
      
      const data = await response.json()
      
      if (response.ok) {
        setShowNewEvent(false)
        loadEvents()
      } else {
        setError(data.message || "Błąd podczas tworzenia wydarzenia")
      }
    } catch (error: any) {
      console.error("Error creating event:", error)
      setError(error.message || "Błąd podczas tworzenia wydarzenia")
    } finally {
      setSaving(false)
    }
  }

  const handleDateClick = (date: Date) => {
    const dayEvents = getEventsForDate(date)
    setSelectedDate(date)
    
    if (dayEvents.length > 0) {
      // Jeśli są wydarzenia - pokaż listę
      setSelectedDayEvents(dayEvents)
      setShowDayEvents(true)
    } else {
      // Jeśli brak wydarzeń - otwórz formularz nowego
      openNewEventModal(date)
    }
  }

  const handleAddEventFromDayView = () => {
    setShowDayEvents(false)
    if (selectedDate) {
      openNewEventModal(selectedDate)
    }
  }

  // Pobierz nadchodzące wydarzenia (dzisiaj i później)
  const getUpcomingEvents = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return events
      .filter(e => {
        const eventDate = new Date(e.start_date)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate >= today
      })
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
      .slice(0, 5)
  }

  const days = getDaysInMonth()
  const monthName = currentDate.toLocaleDateString("pl-PL", { month: "long", year: "numeric" })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kalendarz</h1>
          <button
            onClick={() => openNewEventModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Nowe wydarzenie
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={previousMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold capitalize text-gray-900 dark:text-white">{monthName}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              const dayEvents = date ? getEventsForDate(date) : []
              const isToday = date && date.toDateString() === new Date().toDateString()
              
              return (
                <div
                  key={index}
                  className={`min-h-24 p-2 border rounded-lg ${
                    date ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" : "bg-gray-50 dark:bg-gray-900"
                  } ${isToday ? "border-blue-500 border-2" : "border-gray-200 dark:border-gray-700"}`}
                  onClick={() => date && handleDateClick(date)}
                >
                  {date && (
                    <>
                      <div className={`text-sm font-semibold mb-1 ${isToday ? "text-blue-600" : "text-gray-900 dark:text-white"}`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="text-xs p-1 rounded truncate"
                            style={{ backgroundColor: event.color + "20", color: event.color }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">+{dayEvents.length - 2} więcej</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Nadchodzące wydarzenia</h3>
          <div className="space-y-3">
            {getUpcomingEvents().length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Brak nadchodzących wydarzeń</p>
            ) : (
              getUpcomingEvents().map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div
                    className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{event.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(event.start_date).toLocaleDateString("pl-PL", { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </p>
                    {event.location && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">📍 {event.location}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Day Events Modal */}
        {showDayEvents && selectedDate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedDate.toLocaleDateString("pl-PL", { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </h3>
                <button
                  onClick={() => setShowDayEvents(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {selectedDayEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                    style={{ borderLeftColor: event.color, borderLeftWidth: '4px' }}
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                    {event.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
                    )}
                    {event.location && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">📍 {event.location}</p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {event.all_day ? "Całodniowe" : new Date(event.start_date).toLocaleTimeString("pl-PL", { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleAddEventFromDayView}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Dodaj wydarzenie
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Event Modal */}
        {showNewEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nowe wydarzenie</h3>
                <button
                  onClick={() => setShowNewEvent(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <form onSubmit={handleCreateEvent} className="p-4 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tytuł *
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Nazwa wydarzenia"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data rozpoczęcia *
                    </label>
                    <input
                      type="date"
                      value={newEvent.start_date}
                      onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data zakończenia
                    </label>
                    <input
                      type="date"
                      value={newEvent.end_date}
                      onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lokalizacja
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="np. Biuro, Online"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Opis
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Szczegóły wydarzenia..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kolor
                  </label>
                  <div className="flex gap-2">
                    {EVENT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setNewEvent({ ...newEvent, color: color.value })}
                        className={`w-8 h-8 rounded-full border-2 ${
                          newEvent.color === color.value ? "border-gray-900 dark:border-white" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="all_day"
                    checked={newEvent.all_day}
                    onChange={(e) => setNewEvent({ ...newEvent, all_day: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="all_day" className="text-sm text-gray-700 dark:text-gray-300">
                    Całodniowe wydarzenie
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowNewEvent(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? "Zapisywanie..." : "Utwórz"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
