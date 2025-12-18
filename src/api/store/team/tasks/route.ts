import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET - Pobierz zadania
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { assigned_to, status, priority } = req.query
  const teamModule = req.scope.resolve("team")
  
  const filters: any = {}
  
  if (assigned_to) filters.assigned_to = assigned_to
  if (status) filters.status = status
  if (priority) filters.priority = priority
  
  const tasks = await teamModule.listTasks(filters, {
    order: { created_at: "DESC" },
  })
  
  res.json({ tasks })
}

// POST - Utwórz zadanie
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { title, description, status, priority, assigned_to, assigned_by, due_date, tags } = req.body
  const teamModule = req.scope.resolve("team")
  
  const task = await teamModule.createTasks({
    title,
    description,
    status: status || "todo",
    priority: priority || "medium",
    assigned_to,
    assigned_by,
    due_date: due_date ? new Date(due_date) : null,
    tags,
  })
  
  // Powiadom przypisaną osobę
  if (assigned_to) {
    await teamModule.createTeamNotifications({
      user_id: assigned_to,
      type: "task",
      title: `Nowe zadanie: ${title}`,
      message: description || "Sprawdź szczegóły zadania",
      link: `/tasks/${task.id}`,
    })
  }
  
  res.json({ task })
}
