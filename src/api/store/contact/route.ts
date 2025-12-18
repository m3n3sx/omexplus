import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST - Formularz kontaktowy
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { name, email, phone, subject, message } = req.body

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ 
      error: "name, email, subject and message are required" 
    })
  }

  const chatModule = req.scope.resolve("chat")
  
  // Utwórz zgłoszenie kontaktowe
  const contactForm = await chatModule.createContactForms({
    name,
    email,
    phone,
    subject,
    message,
    status: "new"
  })

  // Opcjonalnie: utwórz konwersację
  const conversation = await chatModule.createConversations({
    customer_email: email,
    customer_name: name,
    status: "agent",
    metadata: { 
      source: "contact_form",
      subject 
    }
  })

  // Dodaj wiadomość z formularza
  await chatModule.createMessages({
    conversation_id: conversation.id,
    sender_type: "customer",
    content: `${subject}\n\n${message}`,
    metadata: { 
      phone,
      from_contact_form: true
    }
  })

  // Aktualizuj formularz z ID konwersacji
  await chatModule.updateContactForms(contactForm.id, {
    conversation_id: conversation.id
  })

  res.json({ 
    success: true,
    contact_form: contactForm,
    conversation_id: conversation.id
  })
}

// GET - Lista zgłoszeń (dla admina)
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const chatModule = req.scope.resolve("chat")
  
  const contactForms = await chatModule.listContactForms({})

  res.json({ contact_forms: contactForms })
}
