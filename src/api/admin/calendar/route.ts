import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// OPTIONS - CORS preflight
export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  res.status(200).end()
}

// GET - Pobierz wydarzenia
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { start_date, end_date, user_id } = req.query
    const teamModule = req.scope.resolve("team")
    
    const filters: any = {}
    
    const events = await teamModule.listCalendarEvents(filters, {
      order: { start_date: "ASC" },
    })
    
    // Filtruj po datach
    let filteredEvents = events
    if (start_date || end_date) {
      filteredEvents = events.filter((event: any) => {
        const eventStart = new Date(event.start_date)
        if (start_date && eventStart < new Date(start_date as string)) return false
        if (end_date && eventStart > new Date(end_date as string)) return false
        return true
      })
    }
    
    // Filtruj po użytkowniku jeśli podano
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
    const body = req.body as {
      title?: string
      description?: string
      start_date?: string
      end_date?: string
      all_day?: boolean
      location?: string
      type?: string
      color?: string
      created_by?: string
      user_id?: string
      attendees?: string[]
    }
    
    const { title, description, start_date, end_date, all_day, location, type, color, created_by, user_id, attendees } = body
    const teamModule = req.scope.resolve("team") as any
    
    if (!start_date) {
      return res.status(400).json({ message: "start_date jest wymagane" })
    }
    
    const event = await teamModule.createCalendarEvents({
      title,
      description,
      start_date: new Date(start_date),
      end_date: end_date ? new Date(end_date) : new Date(start_date),
      all_day: all_day || false,
      location: location || null,
      type: type || "meeting",
      color: color || "#3b82f6",
      created_by: created_by || user_id || "admin",
      attendees: attendees || null,
    })
    
    // Powiadom uczestników
    if (attendees && attendees.length > 0) {
      for (const attendeeId of attendees) {
        try {
          await teamModule.createTeamNotifications({
            user_id: attendeeId,
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
