import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET - Pobierz wiadomości wewnętrzne
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { user_id, unread_only } = req.query
  const teamModule = req.scope.resolve("team")
  
  const filters: any = {}
  
  if (user_id) {
    filters.recipient_id = [user_id, null]
  }
  
  if (unread_only === "true") {
    filters.read = false
  }
  
  const messages = await teamModule.listInternalMessages(filters, {
    order: { created_at: "DESC" },
    take: 100,
  })
  
  res.json({ messages })
}

// POST - Wyślij wiadomość wewnętrzną
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { sender_id, sender_name, recipient_id, recipient_name, subject, content, priority } = req.body
  const teamModule = req.scope.resolve("team")
  
  const message = await teamModule.createInternalMessages({
    sender_id,
    sender_name,
    recipient_id,
    recipient_name,
    subject,
    content,
    priority: priority || "normal",
  })
  
  if (recipient_id) {
    await teamModule.createTeamNotifications({
      user_id: recipient_id,
      type: "message",
      title: `Nowa wiadomość od ${sender_name}`,
      message: subject || content.substring(0, 100),
      link: `/messages/${message.id}`,
    })
  }
  
  res.json({ message })
}
