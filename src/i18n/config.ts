export const i18nConfig = {
  defaultLocale: "pl",
  locales: ["pl", "en", "de", "uk"],
  localeNames: {
    pl: "Polski",
    en: "English",
    de: "Deutsch",
    uk: "Українська",
  },
  localeFlags: {
    pl: "🇵🇱",
    en: "🇬🇧",
    de: "🇩🇪",
    uk: "🇺🇦",
  },
  fallbackLocale: "en",
  namespaces: [
    "common",
    "navigation",
    "products",
    "cart",
    "checkout",
    "account",
    "footer",
    "validation",
    "messages",
  ],
}

export type Locale = "pl" | "en" | "de" | "uk"
