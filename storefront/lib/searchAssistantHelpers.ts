/**
 * Helper functions for Search & Assistant Integration
 */

export interface SearchData {
  machineType?: string | null
  manufacturer?: string | null
  model?: string | null
  symptom?: string | null
  category?: string | null
  partId?: string | null
}

/**
 * Extract search data from natural language query
 */
export function extractSearchDataFromQuery(query: string): Partial<SearchData> {
  const lowerQuery = query.toLowerCase()
  const data: Partial<SearchData> = {}

  // Machine types
  const machineTypes = ['excavator', 'loader', 'bulldozer', 'grader', 'compactor', 'crane', 'forklift']
  for (const type of machineTypes) {
    if (lowerQuery.includes(type)) {
      data.machineType = type
      break
    }
  }

  // Manufacturers
  const manufacturers = ['cat', 'caterpillar', 'komatsu', 'jcb', 'volvo', 'hitachi', 'john deere', 'case']
  for (const mfg of manufacturers) {
    if (lowerQuery.includes(mfg)) {
      data.manufacturer = mfg === 'caterpillar' ? 'cat' : mfg
      break
    }
  }

  // Categories
  const categories = ['hydraulic', 'engine', 'electrical', 'transmission', 'brake', 'cooling']
  for (const cat of categories) {
    if (lowerQuery.includes(cat)) {
      data.category = cat
      break
    }
  }

  // Symptoms
  const symptoms = ['leak', 'broken', 'not working', 'noise', 'overheating', 'no power']
  for (const symptom of symptoms) {
    if (lowerQuery.includes(symptom)) {
      data.symptom = symptom
      break
    }
  }

  return data
}

/**
 * Calculate search completion percentage
 */
export function calculateSearchCompletion(data: SearchData): number {
  const fields = ['machineType', 'manufacturer', 'model', 'symptom', 'category']
  const completed = fields.filter(field => data[field as keyof SearchData]).length
  return (completed / fields.length) * 100
}

/**
 * Generate search summary text
 */
export function generateSearchSummary(data: SearchData, language: string = 'en'): string {
  const parts: string[] = []

  if (data.machineType) {
    parts.push(language === 'pl' ? `Typ: ${data.machineType}` : `Type: ${data.machineType}`)
  }
  if (data.manufacturer) {
    parts.push(language === 'pl' ? `Producent: ${data.manufacturer}` : `Manufacturer: ${data.manufacturer}`)
  }
  if (data.model) {
    parts.push(language === 'pl' ? `Model: ${data.model}` : `Model: ${data.model}`)
  }
  if (data.category) {
    parts.push(language === 'pl' ? `Kategoria: ${data.category}` : `Category: ${data.category}`)
  }

  return parts.join(' • ')
}

/**
 * Determine next recommended step
 */
export function getNextRecommendedStep(data: SearchData): number {
  if (!data.machineType) return 1
  if (!data.manufacturer) return 2
  if (!data.model) return 3
  if (!data.symptom) return 4
  if (!data.category) return 5
  return 6
}

/**
 * Validate search data completeness
 */
export function validateSearchData(data: SearchData): { isValid: boolean; missingFields: string[] } {
  const requiredFields = ['machineType', 'manufacturer', 'model', 'category']
  const missingFields = requiredFields.filter(field => !data[field as keyof SearchData])

  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}

/**
 * Format part name for display
 */
export function formatPartName(name: string, maxLength: number = 50): string {
  if (name.length <= maxLength) return name
  return name.substring(0, maxLength - 3) + '...'
}

/**
 * Generate help message for step
 */
export function getHelpMessageForStep(step: number, language: string = 'en'): string {
  const messages: Record<number, { en: string; pl: string }> = {
    1: {
      en: "What type of machinery do you have? For example: excavator, loader, bulldozer.",
      pl: "Jaki typ maszyny posiadasz? Na przykład: koparka, ładowarka, spychacz."
    },
    2: {
      en: "Which manufacturer made your machine? Popular brands: CAT, Komatsu, JCB, Volvo.",
      pl: "Jaki producent wykonał Twoją maszynę? Popularne marki: CAT, Komatsu, JCB, Volvo."
    },
    3: {
      en: "What's your machine model? Check the plate on your machine or manual.",
      pl: "Jaki jest model Twojej maszyny? Sprawdź tabliczką na maszynie lub w instrukcji."
    },
    4: {
      en: "Describe the problem: 'pump leaking', 'no power', 'strange noise', etc.",
      pl: "Opisz problem: 'pompa przecieka', 'brak mocy', 'dziwny dźwięk', itp."
    },
    5: {
      en: "Based on your issue, I'll suggest the right part category.",
      pl: "Na podstawie Twojego problemu zasugeruję odpowiednią kategorię części."
    },
    6: {
      en: "Review the compatible parts and select the one that matches your needs.",
      pl: "Przejrzyj kompatybilne części i wybierz tę, która odpowiada Twoim potrzebom."
    }
  }

  return messages[step]?.[language] || messages[1][language]
}

/**
 * Check if search data has changed
 */
export function hasSearchDataChanged(oldData: SearchData, newData: SearchData): boolean {
  const fields: (keyof SearchData)[] = ['machineType', 'manufacturer', 'model', 'symptom', 'category', 'partId']
  return fields.some(field => oldData[field] !== newData[field])
}

/**
 * Merge search data (new data overwrites old)
 */
export function mergeSearchData(oldData: SearchData, newData: Partial<SearchData>): SearchData {
  return {
    ...oldData,
    ...newData
  }
}

/**
 * Generate analytics event name
 */
export function generateAnalyticsEventName(action: string, data: any): string {
  const parts = [action]
  
  if (data.machineType) parts.push(data.machineType)
  if (data.category) parts.push(data.category)
  
  return parts.join('_')
}
