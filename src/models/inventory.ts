import { model } from "@medusajs/framework/utils"

export const Inventory = model.define("inventory", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  warehouse_id: model.text(),
  quantity: model.number().default(0),
  reserved: model.number().default(0),
  updated_at: model.dateTime().default("now"),
})

export default Inventory
