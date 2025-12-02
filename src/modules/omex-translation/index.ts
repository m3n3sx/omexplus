import { Module } from "@medusajs/framework/utils"
import OmexTranslationService from "./service"

export const OMEX_TRANSLATION_MODULE = "omexTranslation"

export default Module(OMEX_TRANSLATION_MODULE, {
  service: OmexTranslationService,
})
