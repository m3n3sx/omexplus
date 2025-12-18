import { Locale } from "../i18n/config"

interface TranslationResult {
  text: string
  sourceLanguage: string
  targetLanguage: string
}

interface TranslationCache {
  [key: string]: {
    translation: string
    timestamp: number
  }
}

/**
 * Google Translate Service
 * Supports both free API and Cloud Translation API (with key)
 */
export class TranslationService {
  private cache: TranslationCache = {}
  private cacheExpiry = 24 * 60 * 60 * 1000 // 24 hours
  private apiKey?: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_TRANSLATE_API_KEY
  }

  /**
   * Translate text using Google Translate
   */
  async translate(
    text: string,
    targetLang: Locale,
    sourceLang: Locale = "pl"
  ): Promise<TranslationResult> {
    if (!text || text.trim() === "") {
      return { text: "", sourceLanguage: sourceLang, targetLanguage: targetLang }
    }

    if (sourceLang === targetLang) {
      return { text, sourceLanguage: sourceLang, targetLanguage: targetLang }
    }

    const cacheKey = this.getCacheKey(text, sourceLang, targetLang)
    const cached = this.getFromCache(cacheKey)
    if (cached) {
      return { text: cached, sourceLanguage: sourceLang, targetLanguage: targetLang }
    }

    try {
      const translatedText = this.apiKey
        ? await this.translateWithCloudAPI(text, targetLang, sourceLang)
        : await this.translateWithFreeAPI(text, targetLang, sourceLang)

      this.setCache(cacheKey, translatedText)

      return {
        text: translatedText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      }
    } catch (error) {
      console.error("Translation error:", error)
      return { text, sourceLanguage: sourceLang, targetLanguage: targetLang }
    }
  }

  /**
   * Translate multiple texts at once
   */
  async translateBatch(
    texts: string[],
    targetLang: Locale,
    sourceLang: Locale = "pl"
  ): Promise<TranslationResult[]> {
    const results = await Promise.all(
      texts.map((text) => this.translate(text, targetLang, sourceLang))
    )
    return results
  }

  /**
   * Translate product data
   */
  async translateProduct(
    product: {
      title?: string
      description?: string
      subtitle?: string
      material?: string
    },
    targetLang: Locale,
    sourceLang: Locale = "pl"
  ): Promise<{
    title?: string
    description?: string
    subtitle?: string
    material?: string
  }> {
    const [title, description, subtitle, material] = await Promise.all([
      product.title ? this.translate(product.title, targetLang, sourceLang) : null,
      product.description ? this.translate(product.description, targetLang, sourceLang) : null,
      product.subtitle ? this.translate(product.subtitle, targetLang, sourceLang) : null,
      product.material ? this.translate(product.material, targetLang, sourceLang) : null,
    ])

    return {
      title: title?.text,
      description: description?.text,
      subtitle: subtitle?.text,
      material: material?.text,
    }
  }

  /**
   * Translate category data
   */
  async translateCategory(
    category: { name?: string; description?: string },
    targetLang: Locale,
    sourceLang: Locale = "pl"
  ): Promise<{ name?: string; description?: string }> {
    const [name, description] = await Promise.all([
      category.name ? this.translate(category.name, targetLang, sourceLang) : null,
      category.description ? this.translate(category.description, targetLang, sourceLang) : null,
    ])

    return {
      name: name?.text,
      description: description?.text,
    }
  }

  /**
   * Free Google Translate API (no key required, rate limited)
   */
  private async translateWithFreeAPI(
    text: string,
    targetLang: string,
    sourceLang: string
  ): Promise<string> {
    const url = new URL("https://translate.googleapis.com/translate_a/single")
    url.searchParams.set("client", "gtx")
    url.searchParams.set("sl", sourceLang)
    url.searchParams.set("tl", targetLang)
    url.searchParams.set("dt", "t")
    url.searchParams.set("q", text)

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    })

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.status}`)
    }

    const data = await response.json()
    
    // Response format: [[["translated text","original text",null,null,10]],null,"pl",...]
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return data[0].map((item: any[]) => item[0]).join("")
    }

    throw new Error("Unexpected response format")
  }

  /**
   * Google Cloud Translation API (requires API key)
   */
  private async translateWithCloudAPI(
    text: string,
    targetLang: string,
    sourceLang: string
  ): Promise<string> {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text",
      }),
    })

    if (!response.ok) {
      throw new Error(`Cloud Translation failed: ${response.status}`)
    }

    const data = await response.json()
    return data.data.translations[0].translatedText
  }

  private getCacheKey(text: string, source: string, target: string): string {
    return `${source}:${target}:${text.substring(0, 100)}`
  }

  private getFromCache(key: string): string | null {
    const cached = this.cache[key]
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.translation
    }
    return null
  }

  private setCache(key: string, translation: string): void {
    this.cache[key] = {
      translation,
      timestamp: Date.now(),
    }
  }

  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.cache = {}
  }
}

// Singleton instance
export const translationService = new TranslationService()
