import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

const sendOrderConfirmationStep = createStep(
  "send-order-confirmation",
  async ({ orderId, email }: { orderId: string; email: string }) => {
    console.log(`Sending order confirmation for ${orderId} to ${email}`)
    
    return new StepResponse({ sent: true })
  }
)

const sendShippingNotificationStep = createStep(
  "send-shipping-notification",
  async ({ orderId, trackingNumber }: { orderId: string; trackingNumber: string }) => {
    console.log(`Sending shipping notification for ${orderId}`)
    
    return new StepResponse({ sent: true })
  }
)

export const orderNotificationWorkflow = createWorkflow(
  "order-notification",
  (input: { orderId: string; email: string; type: string }) => {
    if (input.type === "confirmation") {
      const result = sendOrderConfirmationStep(input)
      return new WorkflowResponse(result)
    }
    
    return new WorkflowResponse({ sent: false })
  }
)
