import { model } from "@medusajs/framework/utils"

export const CategoryTranslation = model.define("category_translation", {
  id: model.id().primaryKey(),
  category_id: model.text(),
  locale: model.enum(["pl", "en", "de"]),
  name: model.text(),
  description: model.text().nullable(),
  created_at: model.dateTime().default("now"),
  updated_at: model.dateTime().default("now"),
})

export default CategoryTranslation
