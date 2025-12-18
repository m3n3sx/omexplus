import { Module } from "@medusajs/framework/utils"
import ManufacturerService from "./service"

export const OMEX_MANUFACTURER_MODULE = "omexManufacturer"

export default Module(OMEX_MANUFACTURER_MODULE, {
  service: ManufacturerService,
})
