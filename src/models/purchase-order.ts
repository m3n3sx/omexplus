import { model } from "@medusajs/framework/utils"

const PurchaseOrder = model.define("purchase_order", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  po_number: model.text().unique(),
  items: model.json(),
  total_amount: model.bigNumber(),
  payment_terms: model.text().nullable(),
  delivery_date: model.dateTime().nullable(),
  status: model.text().default("pending"),
  notes: model.text().nullable(),
})

export default PurchaseOrder
