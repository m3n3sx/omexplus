import { Module } from "@medusajs/framework/utils"
import SEOService from "./service"

export const OMEX_SEO_MODULE = "omexSeo"

export default Module(OMEX_SEO_MODULE, {
  service: SEOService,
})
