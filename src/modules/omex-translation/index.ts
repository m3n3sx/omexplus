import { Module } from "@medusajs/framework/utils"
import OmexTranslationService from "./service"
import { ProductTranslation, CategoryTranslation } from "./models/translation"

export const OMEX_TRANSLATION_MODULE = "omexTranslation"

export default Module(OMEX_TRANSLATION_MODULE, {
  service: OmexTranslationService,
})

export { ProductTranslation, CategoryTranslation }
