import { model } from "@medusajs/framework/utils"

export const ProductTranslation = model.define("product_translation", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  locale: model.enum(["pl", "en", "de"]),
  title: model.text(),
  description: model.text().nullable(),
  created_at: model.dateTime().default("now"),
  updated_at: model.dateTime().default("now"),
})

export default ProductTranslation
