import { Module } from "@medusajs/framework/utils"
import OmexCategoryService from "./service"

export const OMEX_CATEGORY_MODULE = "omexCategory"

// Export repository types and interfaces
export type {
  CategoryRepository,
  Category,
  CategoryTree,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryFilters,
} from "./repository"

export default Module(OMEX_CATEGORY_MODULE, {
  service: OmexCategoryService,
})
