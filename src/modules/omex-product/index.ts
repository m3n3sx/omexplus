import { Module } from "@medusajs/framework/utils"
import OmexProductService from "./service"

export const OMEX_PRODUCT_MODULE = "omexProduct"

export default Module(OMEX_PRODUCT_MODULE, {
  service: OmexProductService,
})
