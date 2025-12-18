/**
 * Price Rule Model
 * 
 * Automatyczne reguły cenowe - marże, rabaty, zaokrąglenia
 */

import { model } from "@medusajs/framework/utils"

const PriceRule = model.define("price_rule", {
  id: model.id().primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  type: model.enum(["percentage_margin", "fixed_margin", "percentage_discount", "fixed_price"]),
  active: model.boolean().default(true),
  priority: model.number().default(0),
  
  // Conditions
  collection_ids: model.json().nullable(),
  category_ids: model.json().nullable(),
  product_ids: model.json().nullable(),
  min_cost_price: model.number().nullable(),
  max_cost_price: model.number().nullable(),
  
  // Rules
  margin_percentage: model.number().nullable(),
  margin_fixed: model.number().nullable(),
  discount_percentage: model.number().nullable(),
  fixed_price: model.number().nullable(),
  
  // Rounding
  round_to: model.number().nullable(), // Round to nearest X (e.g., 0.99, 5, 10)
  round_type: model.enum(["up", "down", "nearest"]).nullable(),
  
  // Metadata
  created_by: model.text().nullable(),
  last_applied_at: model.dateTime().nullable(),
  products_affected: model.number().default(0),
  
  created_at: model.dateTime().default("now"),
  updated_at: model.dateTime().default("now"),
})

export default PriceRule
