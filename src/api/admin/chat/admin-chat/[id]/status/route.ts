import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// PATCH - Zmień status konwersacji
export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const { status } = req.body

  if (!status) {
    return res.status(400).json({ error: "status is required" })
  }

  try {
    const chatModule = req.scope.resolve("chat")
    
    await chatModule.updateConversations(id, { status })

    res.json({ success: true, status })
  } catch (error: any) {
    console.error("[Admin Chat API] Error updating status:", error)
    res.status(500).json({ 
      error: "Failed to update status",
      details: error.message 
    })
  }
}
