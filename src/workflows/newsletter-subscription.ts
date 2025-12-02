import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

const subscribeToNewsletterStep = createStep(
  "subscribe-to-newsletter",
  async ({ email }: { email: string }) => {
    // Logika subskrypcji newslettera
    console.log(`Subscribing ${email} to newsletter`)
    
    return new StepResponse({ success: true, email })
  }
)

export const subscribeToNewsletterWorkflow = createWorkflow(
  "subscribe-to-newsletter",
  (input: { email: string }) => {
    const result = subscribeToNewsletterStep(input)
    return new WorkflowResponse(result)
  }
)
