import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST - Oznacz powiadomienie jako przeczytane
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const teamModule = req.scope.resolve("team")
  
  const notification = await teamModule.updateTeamNotifications(id, {
    read: true,
  })
  
  res.json({ notification })
}
