import { Module } from "@medusajs/framework/utils"
import TeamModuleService from "./service"

export const TEAM_MODULE = "team"

export default Module(TEAM_MODULE, {
  service: TeamModuleService,
})

export * from "./models/notification"
export * from "./models/internal-message"
export * from "./models/calendar-event"
export * from "./models/task"
export * from "./models/note"
