import { model } from "@medusajs/framework/utils"

export const Category = model.define("category", {
  id: model.id().primaryKey(),
  name: model.text(),
  name_en: model.text().nullable(),
  slug: model.text().unique(),
  description: model.text().nullable(),
  icon: model.text().nullable(),
  priority: model.number().default(0),
  parent_id: model.text().nullable(),
  metadata: model.text().nullable(), // JSON stored as text
  created_at: model.dateTime().default("now"),
  updated_at: model.dateTime().default("now"),
})

export default Category
