import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

const createReturnStep = createStep(
  "create-return",
  async ({ orderId, items }: { orderId: string; items: any[] }) => {
    console.log(`Creating return for order ${orderId}`)
    
    return new StepResponse({ 
      returnId: `return_${Date.now()}`,
      orderId,
      items 
    })
  }
)

const restockItemsStep = createStep(
  "restock-items",
  async ({ items }: { items: any[] }) => {
    console.log("Restocking returned items")
    
    return new StepResponse({ restocked: true })
  }
)

export const returnOrderWorkflow = createWorkflow(
  "return-order",
  (input: { orderId: string; items: any[] }) => {
    const returnData = createReturnStep(input)
    const restock = restockItemsStep(input)
    
    return new WorkflowResponse({ returnData, restock })
  }
)
