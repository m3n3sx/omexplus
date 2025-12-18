import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// PATCH - Aktualizuj zadanie
export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const updateData = req.body
  const teamModule = req.scope.resolve("team")
  
  try {
    const tasks = await teamModule.updateTasks([{
      id,
      ...updateData
    }])
    
    res.json({ task: tasks[0] })
  } catch (error: any) {
    console.error("Error updating task:", error)
    res.status(500).json({ error: error.message })
  }
}

// DELETE - Usuń zadanie
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const teamModule = req.scope.resolve("team")
  
  try {
    await teamModule.deleteTasks([id])
    res.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting task:", error)
    res.status(500).json({ error: error.message })
  }
}
