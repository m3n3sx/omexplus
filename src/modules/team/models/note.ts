import { model } from "@medusajs/framework/utils"

const Note = model.define("note", {
  id: model.id().primaryKey(),
  title: model.text(),
  content: model.text(),
  category: model.text().default("general"), // "general", "meeting", "idea", "important"
  color: model.text().default("#fbbf24"),
  created_by: model.text(),
  shared_with: model.json().nullable(), // Array of user IDs, null = private
  pinned: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export default Note
