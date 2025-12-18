import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET - Pobierz wydarzenia z kalendarza
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { start_date, end_date, type } = req.query
  const teamModule = req.scope.resolve("team")
  
  const filters: any = {}
  
  if (type) filters.type = type
  
  const events = await teamModule.listCalendarEvents(filters, {
    order: { start_date: "ASC" },
  })
  
  let filteredEvents = events
  if (start_date || end_date) {
    filteredEvents = events.filter((event: any) => {
      const eventStart = new Date(event.start_time)
      if (start_date && eventStart < new Date(start_date as string)) return false
      if (end_date && eventStart > new Date(end_date as string)) return false
      return true
    })
  }
  
  res.json({ events: filteredEvents })
}

// POST - Utwórz wydarzenie
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { title, description, type, start_time, end_time, location, attendees, created_by } = req.body
  const teamModule = req.scope.resolve("team")
  
  const event = await teamModule.createCalendarEvents({
    title,
    description,
    type: type || "meeting",
    start_time: new Date(start_time),
    end_time: new Date(end_time),
    location,
    attendees,
    created_by,
  })
  
  if (attendees && attendees.length > 0) {
    for (const userId of attendees) {
      await teamModule.createTeamNotifications({
        user_id: userId,
        type: "calendar",
        title: `Nowe wydarzenie: ${title}`,
        message: `${new Date(start_time).toLocaleString("pl-PL")}`,
        link: `/calendar/${event.id}`,
      })
    }
  }
  
  res.json({ event })
}
