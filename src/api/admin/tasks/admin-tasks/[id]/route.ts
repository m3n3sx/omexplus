import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// PATCH - Aktualizuj zadanie
export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const updates = req.body
  const teamModule = req.scope.resolve("team")
  
  // Jeśli zmiana statusu na "done", ustaw completed_at
  if (updates.status === "done" && !updates.completed_at) {
    updates.completed_at = new Date()
  }
  
  const task = await teamModule.updateTasks(id, updates)
  
  res.json({ task })
}

// DELETE - Usuń zadanie
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const teamModule = req.scope.resolve("team")
  
  await teamModule.deleteTasks(id)
  
  res.json({ success: true })
}
