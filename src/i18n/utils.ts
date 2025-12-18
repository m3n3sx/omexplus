import { i18nConfig, Locale } from "./config"

export function getTranslation(
  translations: Record<string, any>,
  key: string,
  params?: Record<string, string | number>
): string {
  const keys = key.split(".")
  let value = translations

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      return key
    }
  }

  if (typeof value !== "string") {
    return key
  }

  if (params) {
    return Object.entries(params).reduce(
      (str, [paramKey, paramValue]) =>
        str.replace(new RegExp(`{{${paramKey}}}`, "g"), String(paramValue)),
      value
    )
  }

  return value
}

export function detectLocale(acceptLanguage?: string): Locale {
  if (!acceptLanguage) return i18nConfig.defaultLocale as Locale

  const languages = acceptLanguage.split(",").map((lang) => {
    const [code] = lang.trim().split(";")
    return code.split("-")[0]
  })

  for (const lang of languages) {
    if (i18nConfig.locales.includes(lang)) {
      return lang as Locale
    }
  }

  return i18nConfig.defaultLocale as Locale
}

export function formatCurrency(
  amount: number,
  locale: Locale,
  currency: string = "PLN"
): string {
  const currencyMap: Record<Locale, string> = {
    pl: "PLN",
    en: "USD",
    de: "EUR",
    uk: "UAH",
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency || currencyMap[locale],
  }).format(amount)
}

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}
