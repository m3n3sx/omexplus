import { model } from "@medusajs/framework/utils"

export const Currency = model.define("currency", {
  code: model.text().primaryKey(), // ISO 4217: PLN, USD, EUR, GBP
  name: model.text(),
  symbol: model.text(),
  exchange_rate: model.number(), // Rate relative to base currency (PLN)
  is_active: model.boolean().default(true),
  decimal_places: model.number().default(2),
  created_at: model.dateTime().default("now"),
  updated_at: model.dateTime().default("now"),
})

export default Currency
