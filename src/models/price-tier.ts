import { model } from "@medusajs/framework/utils"

export const PriceTier = model.define("price_tier", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  customer_type: model.enum(["retail", "b2b", "wholesale"]),
  quantity_min: model.number(),
  quantity_max: model.number().nullable(),
  price: model.bigNumber(),
  created_at: model.dateTime().default("now"),
  updated_at: model.dateTime().default("now"),
})

export default PriceTier
