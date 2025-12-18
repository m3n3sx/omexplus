import { model } from "@medusajs/framework/utils"

const Conversation = model.define("conversation", {
  id: model.id().primaryKey(),
  customer_id: model.text().nullable(),
  customer_email: model.text(),
  customer_name: model.text(),
  status: model.enum(["open", "closed", "bot", "agent"]).default("bot"),
  metadata: model.json().nullable(),
})

const Message = model.define("message", {
  id: model.id().primaryKey(),
  conversation_id: model.text(),
  sender_type: model.enum(["customer", "bot", "agent"]),
  content: model.text(),
  metadata: model.json().nullable(),
})

const ContactForm = model.define("contact_form", {
  id: model.id().primaryKey(),
  name: model.text(),
  email: model.text(),
  phone: model.text().nullable(),
  subject: model.text(),
  message: model.text(),
  status: model.enum(["new", "in_progress", "resolved"]).default("new"),
  conversation_id: model.text().nullable(),
})

export { Conversation, Message, ContactForm }
