import { Module } from "@medusajs/framework/utils"
import OmexSearchService from "./service"
import AdvancedSearchService from "./advanced-search.service"

export const OMEX_SEARCH_MODULE = "omexSearch"

export default Module(OMEX_SEARCH_MODULE, {
  service: OmexSearchService,
})

// Export advanced search service separately
export { AdvancedSearchService }
