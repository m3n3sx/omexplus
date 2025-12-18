/**
 * Stock Alert Model
 * 
 * Automatyczne alerty przy niskich stanach magazynowych
 */

import { model } from "@medusajs/framework/utils"

const StockAlert = model.define("stock_alert", {
  id: model.id().primaryKey(),
  variant_id: model.text(),
  product_id: model.text(),
  
  // Thresholds
  low_stock_threshold: model.number(),
  critical_stock_threshold: model.number().nullable(),
  
  // Alert settings
  active: model.boolean().default(true),
  alert_frequency: model.enum(["once", "daily", "weekly"]).default("once"),
  last_alerted_at: model.dateTime().nullable(),
  
  // Actions
  actions: model.json(), // Array of actions: email, notification, auto-order
  
  // Auto-order settings
  auto_order_enabled: model.boolean().default(false),
  auto_order_quantity: model.number().nullable(),
  supplier_id: model.text().nullable(),
  
  // Metadata
  created_by: model.text().nullable(),
  times_triggered: model.number().default(0),
  
  created_at: model.dateTime().default("now"),
  updated_at: model.dateTime().default("now"),
})

export default StockAlert
