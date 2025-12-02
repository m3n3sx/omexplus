# System Wielojęzyczności (i18n)

## Szybki Start

### 1. Użycie w Komponencie

```tsx
import { useTranslation } from '../hooks/useTranslation'

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button>{t('products.addToCart')}</button>
    </div>
  )
}
```

### 2. Zmiana Języka

```tsx
function LanguageSwitcher() {
  const changeLanguage = async (locale: string) => {
    await fetch('/store/i18n/locale', {
      method: 'POST',
      body: JSON.stringify({ locale })
    })
    window.location.reload()
  }

  return (
    <select onChange={(e) => changeLanguage(e.target.value)}>
      <option value="pl">🇵🇱 Polski</option>
      <option value="en">🇬🇧 English</option>
      <option value="de">🇩🇪 Deutsch</option>
      <option value="uk">🇺🇦 Українська</option>
    </select>
  )
}
```

### 3. Formatowanie

```tsx
import { formatCurrency, formatDate } from '../i18n/utils'

const price = formatCurrency(99.99, 'pl') // "99,99 zł"
const date = formatDate(new Date(), 'pl') // "1 stycznia 2024"
```

## Pliki Tłumaczeń

Wszystkie tłumaczenia znajdują się w `src/i18n/locales/`:
- `pl.json` - Polski
- `en.json` - Angielski
- `de.json` - Niemiecki
- `uk.json` - Ukraiński

## Dodawanie Nowych Tłumaczeń

1. Edytuj odpowiedni plik JSON
2. Dodaj nowy klucz w strukturze zagnieżdżonej
3. Przetłumacz dla wszystkich języków

```json
{
  "products": {
    "newKey": "Nowe tłumaczenie"
  }
}
```

## Więcej Informacji

Zobacz pełną dokumentację w `I18N_GUIDE.md`
