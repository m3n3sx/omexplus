import { Module } from "@medusajs/framework/utils"
import OmexInventoryService from "./service"

export const OMEX_INVENTORY_MODULE = "omexInventory"

export default Module(OMEX_INVENTORY_MODULE, {
  service: OmexInventoryService,
})
