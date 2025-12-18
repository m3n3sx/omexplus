import { MedusaService } from "@medusajs/framework/utils"
import { ProductTranslation, CategoryTranslation } from "./models/translation"

type Locale = 'pl' | 'en' | 'de' | 'uk'

interface ProductTranslationData {
  title?: string
  description?: string
  subtitle?: string
  material?: string
  is_auto_translated?: boolean
}

interface CategoryTranslationData {
  name?: string
  description?: string
  is_auto_translated?: boolean
}

class OmexTranslationService extends MedusaService({
  ProductTranslation,
  CategoryTranslation,
}) {
  private readonly SUPPORTED_LOCALES: Locale[] = ['pl', 'en', 'de', 'uk']
  private readonly DEFAULT_LOCALE: Locale = 'pl'
  private readonly FALLBACK_LOCALE: Locale = 'en'

  // Product Translations
  async upsertProductTranslation(
    productId: string,
    locale: Locale,
    data: ProductTranslationData
  ) {
    this.validateLocale(locale)

    const existing = await this.listProductTranslations({
      filters: { product_id: productId, locale },
      take: 1,
    })

    if (existing.length > 0) {
      return this.updateProductTranslations({
        selector: { id: existing[0].id },
        data: { ...data, updated_at: new Date() },
      })
    }

    return this.createProductTranslations({
      product_id: productId,
      locale,
      ...data,
    })
  }

  async getProductTranslations(productId: string) {
    return this.listProductTranslations({
      filters: { product_id: productId },
    })
  }

  async getProductTranslation(productId: string, locale: Locale) {
    this.validateLocale(locale)

    const translations = await this.listProductTranslations({
      filters: { product_id: productId, locale },
      take: 1,
    })

    if (translations.length > 0) {
      return translations[0]
    }

    // Try fallback locale
    if (locale !== this.FALLBACK_LOCALE) {
      const fallback = await this.listProductTranslations({
        filters: { product_id: productId, locale: this.FALLBACK_LOCALE },
        take: 1,
      })
      return fallback[0] || null
    }

    return null
  }

  async deleteProductTranslation(productId: string, locale: Locale) {
    const existing = await this.listProductTranslations({
      filters: { product_id: productId, locale },
      take: 1,
    })

    if (existing.length > 0) {
      await this.deleteProductTranslations(existing[0].id)
      return true
    }
    return false
  }

  // Category Translations
  async upsertCategoryTranslation(
    categoryId: string,
    locale: Locale,
    data: CategoryTranslationData
  ) {
    this.validateLocale(locale)

    const existing = await this.listCategoryTranslations({
      filters: { category_id: categoryId, locale },
      take: 1,
    })

    if (existing.length > 0) {
      return this.updateCategoryTranslations({
        selector: { id: existing[0].id },
        data: { ...data, updated_at: new Date() },
      })
    }

    return this.createCategoryTranslations({
      category_id: categoryId,
      locale,
      ...data,
    })
  }

  async getCategoryTranslations(categoryId: string) {
    return this.listCategoryTranslations({
      filters: { category_id: categoryId },
    })
  }

  async getCategoryTranslation(categoryId: string, locale: Locale) {
    this.validateLocale(locale)

    const translations = await this.listCategoryTranslations({
      filters: { category_id: categoryId, locale },
      take: 1,
    })

    if (translations.length > 0) {
      return translations[0]
    }

    if (locale !== this.FALLBACK_LOCALE) {
      const fallback = await this.listCategoryTranslations({
        filters: { category_id: categoryId, locale: this.FALLBACK_LOCALE },
        take: 1,
      })
      return fallback[0] || null
    }

    return null
  }

  async deleteCategoryTranslation(categoryId: string, locale: Locale) {
    const existing = await this.listCategoryTranslations({
      filters: { category_id: categoryId, locale },
      take: 1,
    })

    if (existing.length > 0) {
      await this.deleteCategoryTranslations(existing[0].id)
      return true
    }
    return false
  }

  // Bulk operations
  async bulkUpsertProductTranslations(
    productId: string,
    translations: Record<Locale, ProductTranslationData>
  ) {
    const results = []
    for (const [locale, data] of Object.entries(translations)) {
      const result = await this.upsertProductTranslation(
        productId,
        locale as Locale,
        data
      )
      results.push(result)
    }
    return results
  }

  async bulkUpsertCategoryTranslations(
    categoryId: string,
    translations: Record<Locale, CategoryTranslationData>
  ) {
    const results = []
    for (const [locale, data] of Object.entries(translations)) {
      const result = await this.upsertCategoryTranslation(
        categoryId,
        locale as Locale,
        data
      )
      results.push(result)
    }
    return results
  }

  // Validation
  private validateLocale(locale: string): asserts locale is Locale {
    if (!this.SUPPORTED_LOCALES.includes(locale as Locale)) {
      throw new Error(
        `Invalid locale: ${locale}. Supported: ${this.SUPPORTED_LOCALES.join(', ')}`
      )
    }
  }

  getSupportedLocales(): Locale[] {
    return [...this.SUPPORTED_LOCALES]
  }

  getDefaultLocale(): Locale {
    return this.DEFAULT_LOCALE
  }

  getFallbackLocale(): Locale {
    return this.FALLBACK_LOCALE
  }
}

export default OmexTranslationService
