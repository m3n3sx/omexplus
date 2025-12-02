import { Module } from "@medusajs/framework/utils"
import OmexPricingService from "./service"

export const OMEX_PRICING_MODULE = "omexPricing"

export default Module(OMEX_PRICING_MODULE, {
  service: OmexPricingService,
})
