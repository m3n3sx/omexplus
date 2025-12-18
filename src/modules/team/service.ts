import { MedusaService } from "@medusajs/framework/utils"
import TeamNotification from "./models/notification"
import InternalMessage from "./models/internal-message"
import CalendarEvent from "./models/calendar-event"
import Task from "./models/task"
import Note from "./models/note"

class TeamModuleService extends MedusaService({
  TeamNotification,
  InternalMessage,
  CalendarEvent,
  Task,
  Note,
}) {}

export default TeamModuleService
