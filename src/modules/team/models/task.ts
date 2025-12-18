import { model } from "@medusajs/framework/utils"

const Task = model.define("task", {
  id: model.id().primaryKey(),
  title: model.text(),
  description: model.text().nullable(),
  status: model.text().default("todo"), // "todo", "in_progress", "done", "cancelled"
  priority: model.text().default("medium"), // "low", "medium", "high", "urgent"
  assigned_to: model.text().nullable(),
  assigned_by: model.text(),
  due_date: model.dateTime().nullable(),
  completed_at: model.dateTime().nullable(),
  tags: model.json().nullable(), // Array of tags
  metadata: model.json().nullable(),
})

export default Task
