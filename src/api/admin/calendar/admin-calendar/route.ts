import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET - Pobierz wydarzenia
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { start_date, end_date, user_id } = req.query
  const teamModule = req.scope.resolve("team")
  
  const filters: any = {}
  
  if (start_date && end_date) {
    filters.start_date = { $gte: new Date(start_date as string) }
    filters.end_date = { $lte: new Date(end_date as string) }
  }
  
  const events = await teamModule.listCalendarEvents(filters, {
    order: { start_date: "ASC" },
  })
  
  // Filtruj po użytkowniku jeśli podano
  let filteredEvents = events
  if (user_id) {
    filteredEvents = events.filter((event: any) => 
      event.created_by === user_id || 
      (event.attendees && event.attendees.includes(user_id))
    )
  }
  
  res.json({ events: filteredEvents })
}

// POST - Utwórz wydarzenie
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { title, description, start_date, end_date, all_day, location, type, color, created_by, attendees } = req.body
  const teamModule = req.scope.resolve("team")
  
  const event = await teamModule.createCalendarEvents({
    title,
    description,
    start_date: new Date(start_date),
    end_date: new Date(end_date),
    all_day: all_day || false,
    location,
    type: type || "meeting",
    color: color || "#3b82f6",
    created_by,
    attendees,
  })
  
  // Powiadom uczestników
  if (attendees && attendees.length > 0) {
    for (const attendeeId of attendees) {
      await teamModule.createTeamNotifications({
        user_id: attendeeId,
        type: "calendar",
        title: `Nowe wydarzenie: ${title}`,
        message: `${new Date(start_date).toLocaleString("pl-PL")}`,
        link: `/calendar/${event.id}`,
      })
    }
  }
  
  res.json({ event })
}
