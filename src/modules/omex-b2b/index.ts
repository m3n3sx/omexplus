import { Module } from "@medusajs/framework/utils"
import B2BService from "./service"

export const OMEX_B2B_MODULE = "omexB2b"

export default Module(OMEX_B2B_MODULE, {
  service: B2BService,
})
