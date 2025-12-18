import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET - Pobierz notatki
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { user_id, category, pinned_only } = req.query
  const teamModule = req.scope.resolve("team")
  
  const filters: any = {}
  
  if (category) filters.category = category
  if (pinned_only === "true") filters.pinned = true
  
  const notes = await teamModule.listNotes(filters, {
    order: { pinned: "DESC", created_at: "DESC" },
  })
  
  let filteredNotes = notes
  if (user_id) {
    filteredNotes = notes.filter((note: any) => 
      note.created_by === user_id || 
      !note.shared_with ||
      note.shared_with.includes(user_id) ||
      note.shared_with.includes("all")
    )
  }
  
  res.json({ notes: filteredNotes })
}

// POST - Utwórz notatkę
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { title, content, category, color, created_by, shared_with, pinned } = req.body
  const teamModule = req.scope.resolve("team")
  
  const note = await teamModule.createNotes({
    title,
    content,
    category: category || "general",
    color: color || "#fbbf24",
    created_by,
    shared_with,
    pinned: pinned || false,
  })
  
  res.json({ note })
}
