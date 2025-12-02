import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

const sendAbandonedCartEmailStep = createStep(
  "send-abandoned-cart-email",
  async ({ cartId, email }: { cartId: string; email: string }) => {
    console.log(`Sending abandoned cart email for ${cartId} to ${email}`)
    
    return new StepResponse({ sent: true })
  }
)

export const abandonedCartWorkflow = createWorkflow(
  "abandoned-cart",
  (input: { cartId: string; email: string }) => {
    const result = sendAbandonedCartEmailStep(input)
    return new WorkflowResponse(result)
  }
)
