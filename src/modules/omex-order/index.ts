import { Module } from "@medusajs/framework/utils"
import OmexOrderService from "./service"

export const OMEX_ORDER_MODULE = "omexOrder"

export default Module(OMEX_ORDER_MODULE, {
  service: OmexOrderService,
})
