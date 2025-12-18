"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react"

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

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showNewEvent, setShowNewEvent] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [currentDate])

  const loadEvents = async () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/team/calendar?start_date=${startOfMonth.toISOString()}&end_date=${endOfMonth.toISOString()}&user_id=admin`,
        {
          headers: {
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
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

  const days = getDaysInMonth()
  const monthName = currentDate.toLocaleDateString("pl-PL", { month: "long", year: "numeric" })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Kalendarz</h1>
          <button
            onClick={() => setShowNewEvent(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Nowe wydarzenie
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold capitalize">{monthName}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
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
                    date ? "bg-white hover:bg-gray-50 cursor-pointer" : "bg-gray-50"
                  } ${isToday ? "border-blue-500 border-2" : "border-gray-200"}`}
                  onClick={() => date && setSelectedDate(date)}
                >
                  {date && (
                    <>
                      <div className={`text-sm font-semibold mb-1 ${isToday ? "text-blue-600" : ""}`}>
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
                          <div className="text-xs text-gray-500">+{dayEvents.length - 2} więcej</div>
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
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Nadchodzące wydarzenia</h3>
          <div className="space-y-3">
            {events
              .filter(e => new Date(e.start_date) >= new Date())
              .slice(0, 5)
              .map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div
                    className="w-3 h-3 rounded-full mt-1"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(event.start_date).toLocaleString("pl-PL")}
                    </p>
                    {event.location && (
                      <p className="text-xs text-gray-500 mt-1">📍 {event.location}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
