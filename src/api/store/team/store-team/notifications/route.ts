import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET - Pobierz powiadomienia
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { user_id, unread_only } = req.query
  const teamModule = req.scope.resolve("team")
  
  const filters: any = {}
  
  if (user_id) filters.user_id = user_id
  if (unread_only === "true") filters.read = false
  
  const notifications = await teamModule.listTeamNotifications(filters, {
    order: { created_at: "DESC" },
    take: 50,
  })
  
  res.json({ notifications })
}

// POST - Utwórz powiadomienie
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { user_id, type, title, message, link } = req.body
  const teamModule = req.scope.resolve("team")
  
  const notification = await teamModule.createTeamNotifications({
    user_id,
    type,
    title,
    message,
    link,
  })
  
  res.json({ notification })
}
