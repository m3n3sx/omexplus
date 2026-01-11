import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET - Pobierz wydarzenia z kalendarza
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { start_date, end_date, type, user_id } = req.query
    const teamModule = req.scope.resolve("team")
    
    const filters: any = {}
    
    if (type) filters.type = type
    
    const events = await teamModule.listCalendarEvents(filters, {
      order: { start_date: "ASC" },
    })
    
    let filteredEvents = events
    
    // Filtruj po datach
    if (start_date || end_date) {
      filteredEvents = events.filter((event: any) => {
        const eventStart = new Date(event.start_date)
        if (start_date && eventStart < new Date(start_date as string)) return false
        if (end_date && eventStart > new Date(end_date as string)) return false
        return true
      })
    }
    
    // Filtruj po użytkowniku
    if (user_id) {
      filteredEvents = filteredEvents.filter((event: any) => 
        event.created_by === user_id || 
        (event.attendees && event.attendees.includes(user_id))
      )
    }
    
    res.json({ events: filteredEvents })
  } catch (error: any) {
    console.error("Error fetching calendar events:", error)
    res.json({ events: [] })
  }
}

// POST - Utwórz wydarzenie
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { title, description, type, start_date, end_date, all_day, location, color, attendees, created_by, user_id } = req.body
    const teamModule = req.scope.resolve("team")
    
    const event = await teamModule.createCalendarEvents({
      title,
      description,
      type: type || "meeting",
      start_date: new Date(start_date),
      end_date: end_date ? new Date(end_date) : new Date(start_date),
      all_day: all_day || false,
      location,
      color: color || "#3b82f6",
      attendees,
      created_by: created_by || user_id || "admin",
    })
    
    // Powiadom uczestników
    if (attendees && attendees.length > 0) {
      for (const userId of attendees) {
        try {
          await teamModule.createTeamNotifications({
            user_id: userId,
            type: "calendar",
            title: `Nowe wydarzenie: ${title}`,
            message: `${new Date(start_date).toLocaleString("pl-PL")}`,
            link: `/calendar/${event.id}`,
          })
        } catch (e) {
          console.warn("Could not create notification:", e)
        }
      }
    }
    
    res.json({ event })
  } catch (error: any) {
    console.error("Error creating calendar event:", error)
    res.status(500).json({ message: error.message || "Błąd podczas tworzenia wydarzenia" })
  }
}
