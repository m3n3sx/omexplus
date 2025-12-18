import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET - Pobierz szczegóły konwersacji z wiadomościami
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const chatModule = req.scope.resolve("chat")
  
  const conversation = await chatModule.retrieveConversation(id)
  const messages = await chatModule.listMessages({
    conversation_id: id
  })

  res.json({ 
    conversation,
    messages: messages.sort((a: any, b: any) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  })
}

// PATCH - Aktualizuj status konwersacji
export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const { status } = req.body
  
  const chatModule = req.scope.resolve("chat")
  
  const conversation = await chatModule.updateConversations(id, { status })

  res.json({ conversation })
}
