import { MedusaService } from "@medusajs/framework/utils"
import { Conversation, Message, ContactForm } from "./models/conversation"

class ChatModuleService extends MedusaService({
  Conversation,
  Message,
  ContactForm,
}) {}

export default ChatModuleService
