import { model } from "@medusajs/framework/utils"

export const ProductTranslation = model.define("product_translation", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  locale: model.text(),
  title: model.text().nullable(),
  description: model.text().nullable(),
  subtitle: model.text().nullable(),
  material: model.text().nullable(),
  is_auto_translated: model.boolean().default(false),
})
.indexes([
  { on: ["product_id", "locale"], unique: true },
  { on: ["product_id"] },
  { on: ["locale"] },
])

export const CategoryTranslation = model.define("category_translation", {
  id: model.id().primaryKey(),
  category_id: model.text(),
  locale: model.text(),
  name: model.text().nullable(),
  description: model.text().nullable(),
  is_auto_translated: model.boolean().default(false),
})
.indexes([
  { on: ["category_id", "locale"], unique: true },
  { on: ["category_id"] },
  { on: ["locale"] },
])
