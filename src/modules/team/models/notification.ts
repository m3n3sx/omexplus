import { model } from "@medusajs/framework/utils"

const TeamNotification = model.define("team_notification", {
  id: model.id().primaryKey(),
  user_id: model.text(), // ID użytkownika
  type: model.text(), // "chat", "order", "task", "calendar", "system"
  title: model.text(),
  message: model.text(),
  link: model.text().nullable(), // Link do szczegółów
  read: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export default TeamNotification
