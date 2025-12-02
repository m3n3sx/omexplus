import { Module } from "@medusajs/framework/utils"
import OmexCategoryService from "./service"

export const OMEX_CATEGORY_MODULE = "omexCategory"

export default Module(OMEX_CATEGORY_MODULE, {
  service: OmexCategoryService,
})
