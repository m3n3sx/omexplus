/**
 * Stock Movement Model
 * 
 * Audit log dla wszystkich zmian stanów magazynowych
 */

import { model } from "@medusajs/framework/utils"

const StockMovement = model.define("stock_movement", {
  id: model.id().primaryKey(),
  variant_id: model.text(),
  product_id: model.text(),
  quantity_change: model.number(),
  quantity_before: model.number(),
  quantity_after: model.number(),
  reason: model.text(),
  notes: model.text().nullable(),
  performed_by: model.text().nullable(),
  performed_by_email: model.text().nullable(),
  location_id: model.text().nullable(),
  reference_id: model.text().nullable(), // Order ID, Transfer ID, etc.
  reference_type: model.text().nullable(), // 'order', 'adjustment', 'transfer', etc.
  created_at: model.dateTime().default("now"),
})

export default StockMovement
