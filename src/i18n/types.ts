export type Locale = 'pl' | 'en' | 'de' | 'uk'

export interface Language {
  name: string
  nativeName: string
  flag: string
}

export interface TranslationNamespace {
  common: Record<string, string>
  navigation: Record<string, string>
  products: Record<string, string>
  cart: Record<string, string>
  checkout: Record<string, string>
  account: Record<string, string>
  footer: Record<string, string>
  validation: Record<string, string>
  messages: Record<string, string>
}

export interface I18nConfig {
  defaultLocale: Locale
  locales: Locale[]
  localeNames: Record<Locale, string>
  localeFlags: Record<Locale, string>
  fallbackLocale: Locale
  namespaces: string[]
}
