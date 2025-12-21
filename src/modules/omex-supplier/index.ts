import { Module } from "@medusajs/framework/utils"
import SupplierService from "./service"

export const OMEX_SUPPLIER_MODULE = "omexSupplier"

export default Module(OMEX_SUPPLIER_MODULE, {
  service: SupplierService,
})
