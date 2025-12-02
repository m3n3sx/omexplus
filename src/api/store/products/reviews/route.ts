import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PRODUCT_REVIEW_MODULE } from "../../../../modules/product-review"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const productReviewService = req.scope.resolve(PRODUCT_REVIEW_MODULE)
  
  const review = await productReviewService.createReview({
    productId: req.body.productId,
    customerId: req.auth_context?.actor_id,
    rating: req.body.rating,
    comment: req.body.comment,
  })

  res.json({ review })
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productReviewService = req.scope.resolve(PRODUCT_REVIEW_MODULE)
  const { productId } = req.query
  
  const reviews = await productReviewService.getProductReviews(productId as string)
  
  res.json({ reviews })
}
