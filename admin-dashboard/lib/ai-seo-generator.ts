// AI SEO Content Generator using Gemini API

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

interface ProductData {
  title: string
  description?: string
  subtitle?: string
  category?: string
  brand?: string
  sku?: string
  price?: number
  features?: string[]
}

interface CategoryData {
  name: string
  description?: string
  parentCategory?: string
  productCount?: number
}

interface PageData {
  title: string
  content?: string
  type?: string
}

interface GenerationOptions {
  customInstructions?: string
  tone?: 'professional' | 'friendly' | 'technical' | 'sales'
  language?: 'pl' | 'en' | 'de'
  focusKeywords?: string[]
  targetAudience?: string
  includeEmoji?: boolean
  maxTitleLength?: number
  maxDescriptionLength?: number
}

interface SEOContent {
  metaTitle: string
  metaDescription: string
  keywords: string[]
  ogTitle: string
  ogDescription: string
  h1: string
  shortDescription: string
  longDescription: string
  tags: string[]
  altText?: string
  slug?: string
}

interface BulkSEOResult {
  id: string
  success: boolean
  content?: SEOContent
  error?: string
}

const DEFAULT_OPTIONS: GenerationOptions = {
  tone: 'professional',
  language: 'pl',
  includeEmoji: false,
  maxTitleLength: 60,
  maxDescriptionLength: 155,
}

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured')
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

function parseJSONResponse(text: string): any {
  // Extract JSON from markdown code blocks if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const jsonStr = jsonMatch ? jsonMatch[1] : text
  
  try {
    return JSON.parse(jsonStr.trim())
  } catch {
    // Try to find JSON object in text
    const objectMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (objectMatch) {
      return JSON.parse(objectMatch[0])
    }
    throw new Error('Failed to parse JSON response')
  }
}

function buildToneInstructions(tone: GenerationOptions['tone']): string {
  switch (tone) {
    case 'friendly':
      return 'Pisz w przyjaznym, ciepłym tonie. Używaj prostego języka.'
    case 'technical':
      return 'Pisz w technicznym, specjalistycznym tonie. Używaj branżowej terminologii.'
    case 'sales':
      return 'Pisz w perswazyjnym tonie sprzedażowym. Podkreślaj korzyści i zachęcaj do zakupu.'
    default:
      return 'Pisz w profesjonalnym, rzeczowym tonie.'
  }
}

function buildLanguageInstructions(language: GenerationOptions['language']): string {
  switch (language) {
    case 'en':
      return 'Write all content in English.'
    case 'de':
      return 'Schreibe alle Inhalte auf Deutsch.'
    default:
      return 'Pisz wszystkie treści po polsku.'
  }
}

export async function generateProductSEO(
  product: ProductData, 
  options: GenerationOptions = {}
): Promise<SEOContent> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  const customInstructionsBlock = opts.customInstructions 
    ? `\n\nDODATKOWE INSTRUKCJE OD UŻYTKOWNIKA:\n${opts.customInstructions}\n` 
    : ''
  
  const focusKeywordsBlock = opts.focusKeywords?.length 
    ? `\nSŁOWA KLUCZOWE DO UWZGLĘDNIENIA: ${opts.focusKeywords.join(', ')}` 
    : ''
  
  const targetAudienceBlock = opts.targetAudience 
    ? `\nGRUPA DOCELOWA: ${opts.targetAudience}` 
    : ''

  const prompt = `Jesteś ekspertem SEO dla sklepu z częściami do maszyn budowlanych OMEX.
Wygeneruj kompletne treści SEO dla produktu.

${buildLanguageInstructions(opts.language)}
${buildToneInstructions(opts.tone)}
${opts.includeEmoji ? 'Możesz używać emoji w opisach.' : 'NIE używaj emoji.'}
${customInstructionsBlock}
${focusKeywordsBlock}
${targetAudienceBlock}

DANE PRODUKTU:
- Nazwa: ${product.title}
- Opis: ${product.description || 'brak'}
- Podtytuł: ${product.subtitle || 'brak'}
- Kategoria: ${product.category || 'Części do maszyn'}
- Marka: ${product.brand || 'OMEX'}
- SKU: ${product.sku || 'brak'}
- Cena: ${product.price ? `${product.price} PLN` : 'brak'}

WYMAGANIA:
1. metaTitle: max ${opts.maxTitleLength} znaków, zawiera nazwę produktu i markę
2. metaDescription: max ${opts.maxDescriptionLength} znaków, zachęcający opis z CTA
3. keywords: 8-12 słów kluczowych (związane z branżą)
4. ogTitle: tytuł dla social media, max 60 znaków
5. ogDescription: opis dla social media, max 200 znaków
6. h1: nagłówek H1 dla strony produktu
7. shortDescription: 1-2 zdania, max 200 znaków
8. longDescription: 3-5 zdań, szczegółowy opis produktu z korzyściami
9. tags: 5-8 tagów do kategoryzacji
10. altText: tekst alternatywny dla obrazka produktu
11. slug: przyjazny URL (małe litery, myślniki)

Odpowiedz TYLKO w formacie JSON:
{
  "metaTitle": "...",
  "metaDescription": "...",
  "keywords": ["...", "..."],
  "ogTitle": "...",
  "ogDescription": "...",
  "h1": "...",
  "shortDescription": "...",
  "longDescription": "...",
  "tags": ["...", "..."],
  "altText": "...",
  "slug": "..."
}`

  const response = await callGemini(prompt)
  return parseJSONResponse(response)
}

export async function generateCategorySEO(
  category: CategoryData,
  options: GenerationOptions = {}
): Promise<SEOContent> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  const customInstructionsBlock = opts.customInstructions 
    ? `\n\nDODATKOWE INSTRUKCJE OD UŻYTKOWNIKA:\n${opts.customInstructions}\n` 
    : ''

  const prompt = `Jesteś ekspertem SEO dla sklepu z częściami do maszyn budowlanych OMEX.
Wygeneruj kompletne treści SEO dla kategorii produktów.

${buildLanguageInstructions(opts.language)}
${buildToneInstructions(opts.tone)}
${opts.includeEmoji ? 'Możesz używać emoji w opisach.' : 'NIE używaj emoji.'}
${customInstructionsBlock}

DANE KATEGORII:
- Nazwa: ${category.name}
- Opis: ${category.description || 'brak'}
- Kategoria nadrzędna: ${category.parentCategory || 'brak'}
- Liczba produktów: ${category.productCount || 'nieznana'}

WYMAGANIA:
1. metaTitle: max ${opts.maxTitleLength} znaków, zawiera nazwę kategorii
2. metaDescription: max ${opts.maxDescriptionLength} znaków, opisuje zawartość kategorii
3. keywords: 8-12 słów kluczowych dla kategorii
4. ogTitle: tytuł dla social media
5. ogDescription: opis dla social media
6. h1: nagłówek H1 dla strony kategorii
7. shortDescription: krótki opis kategorii (1-2 zdania)
8. longDescription: rozbudowany opis kategorii z informacjami o produktach
9. tags: 5-8 tagów
10. slug: przyjazny URL

Odpowiedz TYLKO w formacie JSON:
{
  "metaTitle": "...",
  "metaDescription": "...",
  "keywords": ["...", "..."],
  "ogTitle": "...",
  "ogDescription": "...",
  "h1": "...",
  "shortDescription": "...",
  "longDescription": "...",
  "tags": ["...", "..."],
  "slug": "..."
}`

  const response = await callGemini(prompt)
  return parseJSONResponse(response)
}

export async function generatePageSEO(
  page: PageData,
  options: GenerationOptions = {}
): Promise<SEOContent> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  const customInstructionsBlock = opts.customInstructions 
    ? `\n\nDODATKOWE INSTRUKCJE OD UŻYTKOWNIKA:\n${opts.customInstructions}\n` 
    : ''

  const prompt = `Jesteś ekspertem SEO dla sklepu z częściami do maszyn budowlanych OMEX.
Wygeneruj kompletne treści SEO dla strony.

${buildLanguageInstructions(opts.language)}
${buildToneInstructions(opts.tone)}
${customInstructionsBlock}

DANE STRONY:
- Tytuł: ${page.title}
- Treść: ${page.content?.substring(0, 500) || 'brak'}
- Typ: ${page.type || 'informacyjna'}

WYMAGANIA:
1. metaTitle: max ${opts.maxTitleLength} znaków
2. metaDescription: max ${opts.maxDescriptionLength} znaków
3. keywords: 6-10 słów kluczowych
4. ogTitle: tytuł dla social media
5. ogDescription: opis dla social media
6. h1: nagłówek H1
7. shortDescription: krótki opis strony
8. longDescription: rozbudowany opis
9. tags: 4-6 tagów

Odpowiedz TYLKO w formacie JSON:
{
  "metaTitle": "...",
  "metaDescription": "...",
  "keywords": ["...", "..."],
  "ogTitle": "...",
  "ogDescription": "...",
  "h1": "...",
  "shortDescription": "...",
  "longDescription": "...",
  "tags": ["...", "..."]
}`

  const response = await callGemini(prompt)
  return parseJSONResponse(response)
}

export async function generateBulkProductSEO(
  products: Array<ProductData & { id: string }>,
  onProgress?: (current: number, total: number) => void
): Promise<BulkSEOResult[]> {
  const results: BulkSEOResult[] = []
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    onProgress?.(i + 1, products.length)
    
    try {
      const content = await generateProductSEO(product)
      results.push({ id: product.id, success: true, content })
      
      // Rate limiting - wait 1 second between requests
      if (i < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      results.push({
        id: product.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  return results
}

export async function improveDescription(
  currentDescription: string,
  productTitle: string,
  targetLength: 'short' | 'medium' | 'long' = 'medium'
): Promise<string> {
  const lengthGuide = {
    short: '50-100 słów',
    medium: '100-200 słów',
    long: '200-400 słów'
  }

  const prompt = `Jesteś copywriterem dla sklepu z częściami do maszyn budowlanych.
Popraw i rozbuduj opis produktu.

PRODUKT: ${productTitle}
OBECNY OPIS: ${currentDescription || 'brak opisu'}
DOCELOWA DŁUGOŚĆ: ${lengthGuide[targetLength]}

WYMAGANIA:
- Pisz po polsku
- Używaj języka korzyści
- Dodaj informacje o jakości i zastosowaniu
- Uwzględnij słowa kluczowe dla SEO
- Zachowaj profesjonalny ton

Odpowiedz TYLKO poprawionym opisem (bez dodatkowych komentarzy):`

  return await callGemini(prompt)
}

export async function generateAltTexts(
  productTitle: string,
  imageCount: number = 1
): Promise<string[]> {
  const prompt = `Wygeneruj ${imageCount} różnych tekstów alternatywnych (alt text) dla zdjęć produktu.

PRODUKT: ${productTitle}
KONTEKST: Sklep z częściami do maszyn budowlanych OMEX

WYMAGANIA:
- Każdy alt text max 125 znaków
- Opisuj co widać na zdjęciu
- Uwzględnij słowa kluczowe
- Każdy alt text powinien być unikalny

Odpowiedz w formacie JSON:
["alt text 1", "alt text 2", ...]`

  const response = await callGemini(prompt)
  return parseJSONResponse(response)
}

export async function suggestRelatedKeywords(
  mainKeyword: string,
  count: number = 10
): Promise<string[]> {
  const prompt = `Zaproponuj ${count} powiązanych słów kluczowych dla branży części do maszyn budowlanych.

GŁÓWNE SŁOWO KLUCZOWE: ${mainKeyword}

WYMAGANIA:
- Słowa kluczowe po polsku
- Mix: long-tail i short-tail
- Uwzględnij synonimy i warianty
- Dodaj słowa związane z intencją zakupową

Odpowiedz w formacie JSON:
["słowo 1", "słowo 2", ...]`

  const response = await callGemini(prompt)
  return parseJSONResponse(response)
}

export async function generateFAQ(
  productOrCategory: string,
  count: number = 5
): Promise<Array<{ question: string; answer: string }>> {
  const prompt = `Wygeneruj ${count} pytań i odpowiedzi FAQ dla strony produktu/kategorii.

TEMAT: ${productOrCategory}
KONTEKST: Sklep z częściami do maszyn budowlanych OMEX

WYMAGANIA:
- Pytania jakie zadają klienci
- Odpowiedzi informacyjne i pomocne
- Uwzględnij aspekty: jakość, dostawa, gwarancja, kompatybilność
- Optymalizuj pod SEO (featured snippets)

Odpowiedz w formacie JSON:
[
  {"question": "...", "answer": "..."},
  ...
]`

  const response = await callGemini(prompt)
  return parseJSONResponse(response)
}
