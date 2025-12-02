import { MedusaService } from "@medusajs/framework/utils"

type Locale = 'pl' | 'en' | 'de'

interface Translation {
  title?: string
  name?: string
  description?: string
}

class OmexTranslationService extends MedusaService({}) {
  private readonly SUPPORTED_LOCALES: Locale[] = ['pl', 'en', 'de']
  private readonly DEFAULT_LOCALE: Locale = 'pl'
  private readonly FALLBACK_LOCALE: Locale = 'en'

  async addProductTranslation(productId: string, locale: Locale, translation: Translation) {
    this.validateLocale(locale)
    
    if (!productId) {
      throw new Error("Product ID is required")
    }

    if (!translation.title) {
      throw new Error("Title is required for product translation")
    }

    return {
      id: `prod_trans_${Date.now()}`,
      product_id: productId,
      locale,
      title: translation.title,
      description: translation.description,
      created_at: new Date(),
    }
  }

  async addCategoryTranslation(categoryId: string, locale: Locale, translation: Translation) {
    this.validateLocale(locale)
    
    if (!categoryId) {
      throw new Error("Category ID is required")
    }

    if (!translation.name) {
      throw new Error("Name is required for category translation")
    }

    return {
      id: `cat_trans_${Date.now()}`,
      category_id: categoryId,
      locale,
      name: translation.name,
      description: translation.description,
      created_at: new Date(),
    }
  }

  async getProductTranslation(productId: string, locale: Locale) {
    this.validateLocale(locale)

    if (!productId) {
      throw new Error("Product ID is required")
    }

    // In real implementation, fetch from product_translation table
    // If not found, try fallback locale
    const translation = null // await this.fetchProductTranslation(productId, locale)
    
    if (!translation && locale !== this.FALLBACK_LOCALE) {
      // Try fallback locale
      return this.getProductTranslation(productId, this.FALLBACK_LOCALE)
    }

    return translation
  }

  async getCategoryTranslation(categoryId: string, locale: Locale) {
    this.validateLocale(locale)

    if (!categoryId) {
      throw new Error("Category ID is required")
    }

    // In real implementation, fetch from category_translation table
    const translation = null // await this.fetchCategoryTranslation(categoryId, locale)
    
    if (!translation && locale !== this.FALLBACK_LOCALE) {
      // Try fallback locale
      return this.getCategoryTranslation(categoryId, this.FALLBACK_LOCALE)
    }

    return translation
  }

  async validateAllLanguagesPresent(entityId: string, entityType: 'product' | 'category'): Promise<boolean> {
    // Check if translations exist for all supported locales
    const missingLocales: Locale[] = []

    for (const locale of this.SUPPORTED_LOCALES) {
      let translation
      if (entityType === 'product') {
        translation = await this.getProductTranslation(entityId, locale)
      } else {
        translation = await this.getCategoryTranslation(entityId, locale)
      }

      if (!translation) {
        missingLocales.push(locale)
      }
    }

    if (missingLocales.length > 0) {
      throw new Error(
        `Missing translations for ${entityType} ${entityId} in languages: ${missingLocales.join(', ')}`
      )
    }

    return true
  }

  async bulkAddTranslations(
    entityId: string,
    entityType: 'product' | 'category',
    translations: Record<Locale, Translation>
  ) {
    const results = []

    for (const [locale, translation] of Object.entries(translations)) {
      try {
        let result
        if (entityType === 'product') {
          result = await this.addProductTranslation(entityId, locale as Locale, translation)
        } else {
          result = await this.addCategoryTranslation(entityId, locale as Locale, translation)
        }
        results.push(result)
      } catch (error) {
        console.error(`Failed to add ${locale} translation:`, error)
        throw error
      }
    }

    return results
  }

  private validateLocale(locale: string): asserts locale is Locale {
    if (!this.SUPPORTED_LOCALES.includes(locale as Locale)) {
      throw new Error(
        `Invalid locale: ${locale}. Supported locales are: ${this.SUPPORTED_LOCALES.join(', ')}`
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
