import { model } from "@medusajs/framework/utils"

const CalendarEvent = model.define("calendar_event", {
  id: model.id().primaryKey(),
  title: model.text(),
  description: model.text().nullable(),
  start_date: model.dateTime(),
  end_date: model.dateTime(),
  all_day: model.boolean().default(false),
  location: model.text().nullable(),
  type: model.text().default("meeting"), // "meeting", "deadline", "reminder", "holiday"
  color: model.text().default("#3b82f6"),
  created_by: model.text(),
  attendees: model.json().nullable(), // Array of user IDs
  metadata: model.json().nullable(),
})

export default CalendarEvent
