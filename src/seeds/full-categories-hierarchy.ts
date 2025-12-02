/**
 * PEŁNA HIERARCHIA KATEGORII - 18+ głównych kategorii
 * Bazując na kat.md i szukajka.md
 * Struktura dla OMEX B2B E-commerce
 */

export interface CategoryHierarchy {
  id: string
  name: string
  name_en: string
  slug: string
  icon: string
  description: string
  priority: number
  parent_id?: string
  metadata?: {
    salesPercentage?: number
    productCount?: number
    topPriority?: boolean
  }
}

export const FULL_CATEGORY_HIERARCHY: CategoryHierarchy[] = [
  // ============================================================================
  // 1️⃣ HYDRAULIKA & OSPRZĘT HYDRAULICZNY (TOP PRIORITY - 40% sprzedaży)
  // ============================================================================
  {
    id: 'cat-hydraulika',
    name: 'Hydraulika & Osprzęt Hydrauliczny',
    name_en: 'Hydraulics & Hydraulic Equipment',
    slug: 'hydraulika',
    icon: '💧',
    description: 'Pompy, silniki, zawory, cylindry hydrauliczne',
    priority: 1,
    metadata: {
      salesPercentage: 40,
      topPriority: true,
    },
  },
  {
    id: 'cat-hydraulika-pompy',
    name: 'Pompy hydrauliczne',
    name_en: 'Hydraulic Pumps',
    slug: 'hydraulika/pompy',
    icon: '🔧',
    description: 'Pompy tłokowe, zębate, śrubowe',
    priority: 1,
    parent_id: 'cat-hydraulika',
  },
  {
    id: 'cat-hydraulika-silniki',
    name: 'Silniki hydrauliczne',
    name_en: 'Hydraulic Motors',
    slug: 'hydraulika/silniki',
    icon: '🔄',
    description: 'Silniki obrotowe, siłowniki',
    priority: 2,
    parent_id: 'cat-hydraulika',
  },
  {
    id: 'cat-hydraulika-zawory',
    name: 'Zawory hydrauliczne',
    name_en: 'Hydraulic Valves',
    slug: 'hydraulika/zawory',
    icon: '🚦',
    description: 'Zawory zwrotne, ciśnieniowe, kierunkowe',
    priority: 3,
    parent_id: 'cat-hydraulika',
  },
  {
    id: 'cat-hydraulika-cylindry',
    name: 'Cylindry hydrauliczne',
    name_en: 'Hydraulic Cylinders',
    slug: 'hydraulika/cylindry',
    icon: '⚙️',
    description: 'Cylindry ryzeru, wysięgnika, świdra',
    priority: 4,
    parent_id: 'cat-hydraulika',
  },
  {
    id: 'cat-hydraulika-waz',
    name: 'Wąż hydrauliczny & Złączki',
    name_en: 'Hydraulic Hoses & Fittings',
    slug: 'hydraulika/waz-zlaczki',
    icon: '🔌',
    description: 'Węże tłoczne, ssące, złączki',
    priority: 5,
    parent_id: 'cat-hydraulika',
  },
  {
    id: 'cat-hydraulika-zbiorniki',
    name: 'Zbiorniki hydrauliczne',
    name_en: 'Hydraulic Tanks',
    slug: 'hydraulika/zbiorniki',
    icon: '🪣',
    description: 'Zbiorniki 50L-500L+',
    priority: 6,
    parent_id: 'cat-hydraulika',
  },
  {
    id: 'cat-hydraulika-filtry',
    name: 'Filtry hydrauliczne',
    name_en: 'Hydraulic Filters',
    slug: 'hydraulika/filtry',
    icon: '🔍',
    description: 'HF, HG, HH - różne typy',
    priority: 7,
    parent_id: 'cat-hydraulika',
  },
  {
    id: 'cat-hydraulika-plyny',
    name: 'Płyny hydrauliczne',
    name_en: 'Hydraulic Fluids',
    slug: 'hydraulika/plyny',
    icon: '💧',
    description: 'HYDO 68, 46, 32, ISO VG',
    priority: 8,
    parent_id: 'cat-hydraulika',
  },

  // ============================================================================
  // 2️⃣ PODWOZIA & GĄSIENICE
  // ============================================================================
  {
    id: 'cat-podwozia',
    name: 'Podwozia & Gąsienice',
    name_en: 'Undercarriage & Tracks',
    slug: 'podwozia-gasienice',
    icon: '🐛',
    description: 'Gąsienice gumowe, podwozia, części',
    priority: 2,
    metadata: {
      salesPercentage: 15,
    },
  },
  {
    id: 'cat-podwozia-gasienice',
    name: 'Gąsienice gumowe',
    name_en: 'Rubber Tracks',
    slug: 'podwozia-gasienice/gasienice',
    icon: '🐛',
    description: 'Do koparek, minikoparek, ładowarek',
    priority: 1,
    parent_id: 'cat-podwozia',
  },
  {
    id: 'cat-podwozia-kolowe',
    name: 'Podwozia kołowe',
    name_en: 'Wheel Undercarriage',
    slug: 'podwozia-gasienice/kolowe',
    icon: '🛞',
    description: 'Koła, osie, zawieszenia',
    priority: 2,
    parent_id: 'cat-podwozia',
  },

  // ============================================================================
  // 3️⃣ SILNIK & OSPRZĘT SILNIKA
  // ============================================================================
  {
    id: 'cat-silnik',
    name: 'Silnik & Osprzęt Silnika',
    name_en: 'Engine & Engine Parts',
    slug: 'silnik',
    icon: '🔥',
    description: 'Silniki spalinowe, turbo, filtry',
    priority: 3,
    metadata: {
      salesPercentage: 15,
    },
  },
  {
    id: 'cat-silnik-spalinowe',
    name: 'Silniki spalinowe',
    name_en: 'Diesel Engines',
    slug: 'silnik/spalinowe',
    icon: '🔥',
    description: 'Perkins, Caterpillar, Yanmar',
    priority: 1,
    parent_id: 'cat-silnik',
  },
  {
    id: 'cat-silnik-turbo',
    name: 'Turbosprężarki',
    name_en: 'Turbochargers',
    slug: 'silnik/turbo',
    icon: '🌪️',
    description: 'Turbo do różnych marek',
    priority: 2,
    parent_id: 'cat-silnik',
  },
  {
    id: 'cat-silnik-filtry-powietrza',
    name: 'Filtry powietrza',
    name_en: 'Air Filters',
    slug: 'silnik/filtry-powietrza',
    icon: '🌬️',
    description: 'Główne, wstępne, kabinowe',
    priority: 3,
    parent_id: 'cat-silnik',
  },
  {
    id: 'cat-silnik-uklad-paliwowy',
    name: 'Układ paliwowy',
    name_en: 'Fuel System',
    slug: 'silnik/uklad-paliwowy',
    icon: '⛽',
    description: 'Filtry, pompy, wtryski',
    priority: 4,
    parent_id: 'cat-silnik',
  },
  {
    id: 'cat-silnik-chlodzenie',
    name: 'Układ chłodzenia',
    name_en: 'Cooling System',
    slug: 'silnik/chlodzenie',
    icon: '❄️',
    description: 'Termostaty, pompy wody, chłodnice',
    priority: 5,
    parent_id: 'cat-silnik',
  },

  // ============================================================================
  // 4️⃣ SKRZYNIA BIEGÓW & PRZENIESIENIE
  // ============================================================================
  {
    id: 'cat-skrzynia',
    name: 'Skrzynia Biegów & Przeniesienie',
    name_en: 'Transmission & Drivetrain',
    slug: 'skrzynia-przeniesienie',
    icon: '⚙️',
    description: 'Skrzynie, reduktory, sprzęgła',
    priority: 4,
  },
  {
    id: 'cat-skrzynia-biegow',
    name: 'Skrzynia biegów',
    name_en: 'Gearbox',
    slug: 'skrzynia-przeniesienie/skrzynia',
    icon: '🔧',
    description: 'Automatyczne, manualne',
    priority: 1,
    parent_id: 'cat-skrzynia',
  },
  {
    id: 'cat-skrzynia-reduktory',
    name: 'Reduktory & Zwolnice',
    name_en: 'Reducers & Final Drives',
    slug: 'skrzynia-przeniesienie/reduktory',
    icon: '⚙️',
    description: 'Skrzynio-reduktory, zwolnice',
    priority: 2,
    parent_id: 'cat-skrzynia',
  },

  // ============================================================================
  // 5️⃣ ELEKTRYKA & ELEKTRONIKA
  // ============================================================================
  {
    id: 'cat-elektryka',
    name: 'Elektryka & Elektronika',
    name_en: 'Electrical & Electronics',
    slug: 'elektryka',
    icon: '⚡',
    description: 'Oświetlenie, kable, silniki elektryczne',
    priority: 5,
  },
  {
    id: 'cat-elektryka-oswietlenie',
    name: 'Oświetlenie',
    name_en: 'Lighting',
    slug: 'elektryka/oswietlenie',
    icon: '💡',
    description: 'LED, halogen, światła robocze',
    priority: 1,
    parent_id: 'cat-elektryka',
  },
  {
    id: 'cat-elektryka-kable',
    name: 'Kable & Przewody',
    name_en: 'Cables & Wires',
    slug: 'elektryka/kable',
    icon: '🔌',
    description: 'Kable zasilające, sygnałowe',
    priority: 2,
    parent_id: 'cat-elektryka',
  },

  // ============================================================================
  // 6️⃣ ELEMENT OBROTU & RAMIONA
  // ============================================================================
  {
    id: 'cat-obrot',
    name: 'Element Obrotu & Ramiona',
    name_en: 'Swing & Boom Parts',
    slug: 'obrot-ramiona',
    icon: '🔄',
    description: 'Pierścienie obrotu, ramiona',
    priority: 6,
  },
  {
    id: 'cat-obrot-pierscienie',
    name: 'Pierścienie obrotu',
    name_en: 'Slewing Rings',
    slug: 'obrot-ramiona/pierscienie',
    icon: '🔄',
    description: 'Różne rozmiary 200-2500mm',
    priority: 1,
    parent_id: 'cat-obrot',
  },
  {
    id: 'cat-obrot-ramiona',
    name: 'Ramiona wysięgnika',
    name_en: 'Boom Arms',
    slug: 'obrot-ramiona/ramiona',
    icon: '📐',
    description: 'Główne, pomocnicze, teleskopowe',
    priority: 2,
    parent_id: 'cat-obrot',
  },

  // ============================================================================
  // 7️⃣ FILTRY & USZCZELNIENIA (TOP PRIORITY - 35% sprzedaży)
  // ============================================================================
  {
    id: 'cat-filtry-uszczelnienia',
    name: 'Filtry & Uszczelnienia',
    name_en: 'Filters & Seals',
    slug: 'filtry-uszczelnienia',
    icon: '🔍',
    description: 'Wszystkie typy filtrów i uszczelek',
    priority: 7,
    metadata: {
      salesPercentage: 35,
      topPriority: true,
    },
  },
  {
    id: 'cat-filtry',
    name: 'Filtry',
    name_en: 'Filters',
    slug: 'filtry-uszczelnienia/filtry',
    icon: '🔍',
    description: 'Powietrza, paliwa, oleju, hydrauliczne',
    priority: 1,
    parent_id: 'cat-filtry-uszczelnienia',
  },
  {
    id: 'cat-uszczelnienia',
    name: 'Uszczelnienia',
    name_en: 'Seals',
    slug: 'filtry-uszczelnienia/uszczelnienia',
    icon: '🔐',
    description: 'O-ringi, pierścienie, komplety',
    priority: 2,
    parent_id: 'cat-filtry-uszczelnienia',
  },

  // ============================================================================
  // 8️⃣ NADWOZIE & OPRAWA
  // ============================================================================
  {
    id: 'cat-nadwozie',
    name: 'Nadwozie & Oprawa',
    name_en: 'Body & Cabin',
    slug: 'nadwozie',
    icon: '🚪',
    description: 'Kabiny, szyby, osłony',
    priority: 8,
  },
  {
    id: 'cat-nadwozie-kabiny',
    name: 'Kabiny & Drzwi',
    name_en: 'Cabins & Doors',
    slug: 'nadwozie/kabiny',
    icon: '🚪',
    description: 'Kabina kierowcy, drzwi',
    priority: 1,
    parent_id: 'cat-nadwozie',
  },
  {
    id: 'cat-nadwozie-szyby',
    name: 'Szyby & Prościce',
    name_en: 'Glass & Frames',
    slug: 'nadwozie/szyby',
    icon: '🪟',
    description: 'Szyby przednie, boczne, tylne',
    priority: 2,
    parent_id: 'cat-nadwozie',
  },

  // ============================================================================
  // 9️⃣ OSPRZĘT & WYMIENNE CZĘŚCI ROBOCZE
  // ============================================================================
  {
    id: 'cat-osprzet',
    name: 'Osprzęt & Wymienne Części Robocze',
    name_en: 'Attachments & Work Tools',
    slug: 'osprzet',
    icon: '🪣',
    description: 'Łyżki, młoty, wiertła',
    priority: 9,
  },
  {
    id: 'cat-osprzet-lyzki',
    name: 'Łyżki',
    name_en: 'Buckets',
    slug: 'osprzet/lyzki',
    icon: '🪣',
    description: 'Standardowe, wzmocnione, specjalistyczne',
    priority: 1,
    parent_id: 'cat-osprzet',
  },
  {
    id: 'cat-osprzet-mloty',
    name: 'Młoty hydrauliczne',
    name_en: 'Hydraulic Hammers',
    slug: 'osprzet/mloty',
    icon: '🔨',
    description: 'Małe, średnie, duże',
    priority: 2,
    parent_id: 'cat-osprzet',
  },

  // ============================================================================
  // 🔟 NORMALIA WARSZTATOWE
  // ============================================================================
  {
    id: 'cat-normalia',
    name: 'Normalia Warsztatowe',
    name_en: 'Workshop Standards',
    slug: 'normalia',
    icon: '🔩',
    description: 'Śruby, nakrętki, podkładki',
    priority: 10,
  },
  {
    id: 'cat-normalia-sruby',
    name: 'Śruby',
    name_en: 'Bolts',
    slug: 'normalia/sruby',
    icon: '🔩',
    description: 'M6-M42, różne typy',
    priority: 1,
    parent_id: 'cat-normalia',
  },
  {
    id: 'cat-normalia-nakretki',
    name: 'Nakrętki',
    name_en: 'Nuts',
    slug: 'normalia/nakretki',
    icon: '🔗',
    description: 'Zwykłe, samozabezpieczające',
    priority: 2,
    parent_id: 'cat-normalia',
  },

  // ============================================================================
  // 1️⃣1️⃣ WTRYSKI & SYSTEMY PALIWOWE
  // ============================================================================
  {
    id: 'cat-wtryski',
    name: 'Wtryski & Systemy Paliwowe',
    name_en: 'Injectors & Fuel Systems',
    slug: 'wtryski',
    icon: '💉',
    description: 'Wtryski, pompy paliwowe',
    priority: 11,
  },

  // ============================================================================
  // 1️⃣2️⃣ UKŁAD HAMULCOWY
  // ============================================================================
  {
    id: 'cat-hamulce',
    name: 'Układ Hamulcowy',
    name_en: 'Brake System',
    slug: 'hamulce',
    icon: '🛑',
    description: 'Klocki, tarcze, cylindry',
    priority: 12,
  },

  // ============================================================================
  // 1️⃣3️⃣ UKŁAD STEROWANIA & CZUJNIKI
  // ============================================================================
  {
    id: 'cat-sterowanie',
    name: 'Układ Sterowania & Czujniki',
    name_en: 'Control System & Sensors',
    slug: 'sterowanie-czujniki',
    icon: '📍',
    description: 'Czujniki, przełączniki, moduły',
    priority: 13,
  },

  // ============================================================================
  // 1️⃣4️⃣ AKCESORIA
  // ============================================================================
  {
    id: 'cat-akcesoria',
    name: 'Akcesoria',
    name_en: 'Accessories',
    slug: 'akcesoria',
    icon: '💡',
    description: 'Lampy, manetki, pasy bezpieczeństwa',
    priority: 14,
  },

  // ============================================================================
  // 1️⃣5️⃣ CZĘŚCI DO KONKRETNYCH MAREK
  // ============================================================================
  {
    id: 'cat-marki',
    name: 'Części do Konkretnych Marek',
    name_en: 'Brand-Specific Parts',
    slug: 'marki',
    icon: '🏭',
    description: 'CAT, Komatsu, Hitachi, Volvo, JCB',
    priority: 15,
  },
  {
    id: 'cat-marki-cat',
    name: 'CAT (Caterpillar)',
    name_en: 'CAT (Caterpillar)',
    slug: 'marki/cat',
    icon: '🐱',
    description: 'Części do maszyn Caterpillar',
    priority: 1,
    parent_id: 'cat-marki',
  },
  {
    id: 'cat-marki-komatsu',
    name: 'Komatsu',
    name_en: 'Komatsu',
    slug: 'marki/komatsu',
    icon: '🔷',
    description: 'Części do maszyn Komatsu',
    priority: 2,
    parent_id: 'cat-marki',
  },
  {
    id: 'cat-marki-hitachi',
    name: 'Hitachi',
    name_en: 'Hitachi',
    slug: 'marki/hitachi',
    icon: '⭕',
    description: 'Części do maszyn Hitachi',
    priority: 3,
    parent_id: 'cat-marki',
  },
  {
    id: 'cat-marki-volvo',
    name: 'Volvo',
    name_en: 'Volvo',
    slug: 'marki/volvo',
    icon: '🅅',
    description: 'Części do maszyn Volvo',
    priority: 4,
    parent_id: 'cat-marki',
  },
  {
    id: 'cat-marki-jcb',
    name: 'JCB',
    name_en: 'JCB',
    slug: 'marki/jcb',
    icon: '🔶',
    description: 'Części do maszyn JCB',
    priority: 5,
    parent_id: 'cat-marki',
  },

  // ============================================================================
  // 1️⃣6️⃣ CZĘŚCI WYCINKOWE & SPECJALNE
  // ============================================================================
  {
    id: 'cat-specjalne',
    name: 'Części Wycinkowe & Specjalne',
    name_en: 'Special & Custom Parts',
    slug: 'specjalne',
    icon: '🔨',
    description: 'Zęby do młotów, groty, adaptery',
    priority: 16,
  },

  // ============================================================================
  // 1️⃣7️⃣ CZĘŚCI ROLNICZE
  // ============================================================================
  {
    id: 'cat-rolnicze',
    name: 'Części Rolnicze',
    name_en: 'Agricultural Parts',
    slug: 'rolnicze',
    icon: '🚜',
    description: 'Do ciągników, maszyn rolniczych',
    priority: 17,
  },

  // ============================================================================
  // 1️⃣8️⃣ CZĘŚCI DROGOWE & SPECJALNE
  // ============================================================================
  {
    id: 'cat-drogowe',
    name: 'Części Drogowe & Specjalne',
    name_en: 'Road & Special Equipment',
    slug: 'drogowe',
    icon: '🛣️',
    description: 'Do walcarek, kopiarek asfaltu',
    priority: 18,
  },
]

// Helper function to get category tree
export function getCategoryTree(): Map<string, CategoryHierarchy[]> {
  const tree = new Map<string, CategoryHierarchy[]>()
  
  FULL_CATEGORY_HIERARCHY.forEach(category => {
    const parentId = category.parent_id || 'root'
    if (!tree.has(parentId)) {
      tree.set(parentId, [])
    }
    tree.get(parentId)!.push(category)
  })
  
  return tree
}

// Helper function to get top-level categories
export function getTopLevelCategories(): CategoryHierarchy[] {
  return FULL_CATEGORY_HIERARCHY
    .filter(cat => !cat.parent_id)
    .sort((a, b) => a.priority - b.priority)
}

// Helper function to get subcategories
export function getSubcategories(parentId: string): CategoryHierarchy[] {
  return FULL_CATEGORY_HIERARCHY
    .filter(cat => cat.parent_id === parentId)
    .sort((a, b) => a.priority - b.priority)
}
