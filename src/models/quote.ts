import { model } from "@medusajs/framework/utils"

const Quote = model.define("quote", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  items: model.json(),
  total_amount: model.bigNumber(),
  valid_until: model.dateTime().nullable(),
  status: model.text().default("draft"),
  notes: model.text().nullable(),
})

export default Quote
