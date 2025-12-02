import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

const processRefundStep = createStep(
  "process-refund",
  async ({ orderId, amount }: { orderId: string; amount: number }) => {
    console.log(`Processing refund for order ${orderId}: ${amount}`)
    
    return new StepResponse({ 
      refunded: true, 
      orderId, 
      amount 
    })
  }
)

const notifyCustomerStep = createStep(
  "notify-customer-refund",
  async ({ orderId, email }: { orderId: string; email: string }) => {
    console.log(`Notifying customer about refund: ${email}`)
    
    return new StepResponse({ notified: true })
  }
)

export const refundOrderWorkflow = createWorkflow(
  "refund-order",
  (input: { orderId: string; amount: number; email: string }) => {
    const refund = processRefundStep(input)
    const notification = notifyCustomerStep(input)
    
    return new WorkflowResponse({ refund, notification })
  }
)
