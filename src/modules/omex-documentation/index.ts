import { Module } from "@medusajs/framework/utils"
import DocumentationService from "./service"

export const OMEX_DOCUMENTATION_MODULE = "omexDocumentation"

export default Module(OMEX_DOCUMENTATION_MODULE, {
  service: DocumentationService,
})
