import { Module } from "@medusajs/framework/utils"
import OmexBulkImportService from "./service"

export const OMEX_BULK_IMPORT_MODULE = "omexBulkImport"

export default Module(OMEX_BULK_IMPORT_MODULE, {
  service: OmexBulkImportService,
})
