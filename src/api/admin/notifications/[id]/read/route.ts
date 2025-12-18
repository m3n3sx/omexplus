import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST - Oznacz jako przeczytane
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const teamModule = req.scope.resolve("team")
  
  await teamModule.updateTeamNotifications(id, { read: true })
  
  res.json({ success: true })
}
