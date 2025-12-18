import { model } from "@medusajs/framework/utils"

const InternalMessage = model.define("internal_message", {
  id: model.id().primaryKey(),
  sender_id: model.text(),
  sender_name: model.text(),
  recipient_id: model.text().nullable(), // null = broadcast do wszystkich
  recipient_name: model.text().nullable(),
  subject: model.text().nullable(),
  content: model.text(),
  read: model.boolean().default(false),
  priority: model.text().default("normal"), // "low", "normal", "high", "urgent"
  metadata: model.json().nullable(),
})

export default InternalMessage
