/**
 * OMEX Categories Seed Data
 * 18+ głównych kategorii z podkategoriami
 * Based on szukajka.md specification
 */

export interface CategorySeedData {
  name: string
  slug: string
  icon?: string
  description?: string
  children?: CategorySeedData[]
}

export const CATEGORIES_SEED: CategorySeedData[] = [
  {
    name: "Podwozia & Gąsienice",
    slug: "podwozia-gasienice",
    icon: "🚜",
    description: "Podwozia gąsienicowe, kołowe, gąsienice gumowe",
    children: [
      {
        name: "Podwozia gąsienicowe",
        slug: "podwozia-gasienicowe",
        children: [
          { name: "Do koparek (CAT, Komatsu, Hitachi, Volvo, JCB)", slug: "do-koparek" },
          { name: "Do minikoparek (do 6 ton)", slug: "do-minikoparek" },
          { name: "Do ładowarek gąsienicowych", slug: "do-ladowarek-gasienicowych" },
          { name: "OEM + zamienniki", slug: "oem-zamienniki" },
        ],
      },
      {
        name: "Gąsienice gumowe",
        slug: "gasienice-gumowe",
        children: [
          { name: "Groty gąsienic", slug: "groty-gasienic" },
          { name: "Bolce gąsienic", slug: "bolce-gasienic" },
          { name: "Łączniki gąsienic", slug: "laczniki-gasienic" },
          { name: "Napinacze", slug: "napinacze" },
        ],
      },
      {
        name: "Podwozia kołowe",
        slug: "podwozia-kolowe",
        children: [
          { name: "Koła do koparek kołowych", slug: "kola-koparek-kolowych" },
          { name: "Osie", slug: "osie" },
          { name: "Połowiska", slug: "polowiska" },
          { name: "Zawieszenia", slug: "zawieszenia" },
        ],
      },
    ],
  },
  {
    name: "Hydraulika",
    slug: "hydraulika",
    icon: "💧",
    description: "Pompy, silniki, zawory, cylindry hydrauliczne - 40% sprzedaży",
    children: [
      {
        name: "Pompy hydrauliczne",
        slug: "pompy-hydrauliczne",
        children: [
          { name: "Pompy tłokowe", slug: "pompy-tlokowe" },
          { name: "Pompy zębate", slug: "pompy-zebate" },
          { name: "Pompy śrubowe", slug: "pompy-srubowe" },
          { name: "OEM: Rexroth, Parker, Vickers", slug: "oem-rexroth-parker-vickers" },
        ],
      },
      {
        name: "Silniki hydrauliczne",
        slug: "silniki-hydrauliczne",
        children: [
          { name: "Silniki obrotowe", slug: "silniki-obrotowe" },
          { name: "Siłowniki", slug: "silowniki" },
          { name: "Do różnych marek maszyn", slug: "do-roznych-marek" },
        ],
      },
      {
        name: "Zawory hydrauliczne",
        slug: "zawory-hydrauliczne",
        children: [
          { name: "Zawory zwrotne", slug: "zawory-zwrotne" },
          { name: "Zawory ciśnieniowe", slug: "zawory-cisnieniowe" },
          { name: "Zawory rozdzielacze", slug: "zawory-rozdzielacze" },
          { name: "Zawory sterowania", slug: "zawory-sterowania" },
        ],
      },
      {
        name: "Cylindry hydrauliczne",
        slug: "cylindry-hydrauliczne",
        children: [
          { name: "Cylindry ryzeru", slug: "cylindry-ryzeru" },
          { name: "Cylindry wysięgnika", slug: "cylindry-wysiegnika" },
          { name: "Cylindry świdra", slug: "cylindry-swidra" },
          { name: "Custom cylindry", slug: "custom-cylindry" },
        ],
      },
      {
        name: "Węże hydrauliczne",
        slug: "weze-hydrauliczne",
        children: [
          { name: "Tłoczne", slug: "tloczne" },
          { name: "Ssące", slug: "ssace" },
          { name: "Sterowania", slug: "sterowania" },
          { name: "Złączki i końcówki", slug: "zlaczki-koncowki" },
        ],
      },
      { name: "Zbiorniki hydrauliczne", slug: "zbiorniki-hydrauliczne" },
      { name: "Filtry hydrauliczne (HF, HG, HH)", slug: "filtry-hydrauliczne" },
      { name: "Płyny hydrauliczne", slug: "plyny-hydrauliczne" },
      { name: "Garny i złączki hydrauliczne", slug: "garny-zlaczki" },
    ],
  },
  {
    name: "Silnik & Osprzęt",
    slug: "silnik-osprzet",
    icon: "⚙️",
    description: "Silniki spalinowe, turbosprężarki, filtry, układy chłodzenia",
    children: [
      {
        name: "Silniki spalinowe",
        slug: "silniki-spalinowe",
        children: [
          { name: "Silniki Perkins", slug: "silniki-perkins" },
          { name: "Silniki Yanmar", slug: "silniki-yanmar" },
          { name: "Silniki Mitsubishi", slug: "silniki-mitsubishi" },
          { name: "OEM dla każdej marki maszyny", slug: "oem-wszystkie-marki" },
        ],
      },
      { name: "Turbosprężarki", slug: "turbosprezarki" },
      {
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        children: [
          { name: "Główne", slug: "glowne" },
          { name: "Wstępne", slug: "wstepne" },
          { name: "Kabinowe", slug: "kabinowe" },
        ],
      },
      { name: "Filtry paliwa", slug: "filtry-paliwa" },
      { name: "Filtry oleju", slug: "filtry-oleju" },
      { name: "Wymienniki ciepła", slug: "wymienniki-ciepla" },
      {
        name: "Układy chłodzenia",
        slug: "uklady-chlodzenia",
        children: [
          { name: "Termostaty", slug: "termostaty" },
          { name: "Pompy wody", slug: "pompy-wody" },
          { name: "Zawory termostatyczne", slug: "zawory-termostatyczne" },
        ],
      },
      { name: "Paski klinowe", slug: "paski-klinowe" },
      { name: "Rozruszniki", slug: "rozruszniki" },
      { name: "Alternatory", slug: "alternatory" },
    ],
  },
  {
    name: "Skrzynia biegów & Przeniesienie",
    slug: "skrzynia-biegow-przeniesienie",
    icon: "⚡",
    description: "Skrzynie biegów, sprzęgła, wałki napędowe",
    children: [
      {
        name: "Skrzynia biegów",
        slug: "skrzynia-biegow",
        children: [
          { name: "Skrzynio-reduktory", slug: "skrzynio-reduktory" },
          { name: "Przekładnie", slug: "przekladnie" },
          { name: "Zwolnice", slug: "zwolnice" },
          { name: "Olejniki przepustowe", slug: "olejniki-przepustowe" },
        ],
      },
      { name: "Sprzęgła", slug: "sprzegla" },
      { name: "Wałki napędowe", slug: "walki-napedowe" },
      { name: "Łańcuchy napędowe", slug: "lancuchy-napedowe" },
      { name: "Koła zębate", slug: "kola-zebate" },
    ],
  },
  {
    name: "Elektryka & Elektronika",
    slug: "elektryka-elektronika",
    icon: "🔌",
    description: "Silniki elektryczne, przetworniki, oświetlenie, baterie",
    children: [
      { name: "Silniki elektryczne", slug: "silniki-elektryczne" },
      { name: "Przetworniki", slug: "przetworniki" },
      { name: "Wyłączniki", slug: "wylaczniki" },
      { name: "Rozdzielnice", slug: "rozdzielnice" },
      { name: "Kable i przewody", slug: "kable-przewody" },
      { name: "Złączki elektryczne", slug: "zlaczki-elektryczne" },
      {
        name: "Oświetlenie",
        slug: "oswietlenie",
        children: [
          { name: "Halogeny", slug: "halogeny" },
          { name: "LED", slug: "led" },
          { name: "Światła ostrzegawcze", slug: "swiatla-ostrzegawcze" },
        ],
      },
      { name: "Urządzenia pomiarowe", slug: "urzadzenia-pomiarowe" },
      { name: "Baterie i akumulatory", slug: "baterie-akumulatory" },
    ],
  },
  {
    name: "Elementy obrotu & Ramion",
    slug: "elementy-obrotu-ramion",
    icon: "🔄",
    description: "Pierścienie obrotu, łożyska, ramiona wysięgnika",
    children: [
      { name: "Pierścienie obrotu (slewing ring)", slug: "pierscienie-obrotu" },
      { name: "Łożyska obrotu", slug: "lozyska-obrotu" },
      { name: "Zęby obrotu", slug: "zeby-obrotu" },
      {
        name: "Ramiona wysięgnika",
        slug: "ramiona-wysiegnika",
        children: [
          { name: "Główne", slug: "glowne" },
          { name: "Pomocnicze", slug: "pomocnicze" },
          { name: "Teleskopowe", slug: "teleskopowe" },
        ],
      },
      { name: "Ramiona ładowcze", slug: "ramiona-ladowcze" },
      { name: "Układy zawieszenia", slug: "uklady-zawieszenia" },
      { name: "Bolce przegubowe", slug: "bolce-przegubowe" },
    ],
  },
  {
    name: "Filtry & Uszczelnienia",
    slug: "filtry-uszczelnienia",
    icon: "🔧",
    description: "Wszystkie typy filtrów i uszczelek - TOP PRIORITY",
    children: [
      {
        name: "Filtry",
        slug: "filtry",
        children: [
          {
            name: "Filtry powietrza",
            slug: "filtry-powietrza-all",
            children: [
              { name: "Primary", slug: "primary" },
              { name: "Secondary", slug: "secondary" },
              { name: "Cabin", slug: "cabin" },
            ],
          },
          { name: "Filtry paliwa", slug: "filtry-paliwa-all" },
          { name: "Filtry oleju", slug: "filtry-oleju-all" },
          {
            name: "Filtry hydrauliczne",
            slug: "filtry-hydrauliczne-all",
            children: [
              { name: "Typ HF (najczęstszy)", slug: "typ-hf" },
              { name: "Typ HG", slug: "typ-hg" },
              { name: "Typ HH", slug: "typ-hh" },
            ],
          },
          { name: "Filtry wody/separatory", slug: "filtry-wody-separatory" },
        ],
      },
      {
        name: "Uszczelnienia",
        slug: "uszczelnienia",
        children: [
          { name: "Pierścienie tłokowe", slug: "pierscienie-tlokowe" },
          { name: "Uszczelki głowicy", slug: "uszczelki-glowicy" },
          { name: "Uszczelki pokryw", slug: "uszczelki-pokryw" },
          { name: "O-ringi (ISO 3384)", slug: "o-ringi" },
          { name: "Uszczelki wałów", slug: "uszczelki-walow" },
          { name: "Uszczelki cylindrów", slug: "uszczelki-cylindrow" },
          { name: "Kity uszczelniające", slug: "kity-uszczelniajace" },
        ],
      },
    ],
  },
  {
    name: "Nadwozie & Oprawa",
    slug: "nadwozie-oprawa",
    icon: "🏗️",
    description: "Kabiny, szyby, osłony, fotele operatora",
    children: [
      { name: "Kabiny i drzwi", slug: "kabiny-drzwi" },
      { name: "Szyby", slug: "szyby" },
      { name: "Osłony", slug: "oslony" },
      { name: "Osłonki zderzaka", slug: "oslonki-zderzaka" },
      { name: "Kierownica", slug: "kierownica" },
      { name: "Pedały", slug: "pedaly" },
      { name: "Fotele operatora", slug: "fotele-operatora" },
      { name: "Wyposażenie kabiny", slug: "wyposazenie-kabiny" },
    ],
  },
  {
    name: "Osprzęt & Wymienne części robocze",
    slug: "osprzet-wymienne-czesci",
    icon: "🔨",
    description: "Łyżki, zęby, młoty hydrauliczne, wiertła",
    children: [
      {
        name: "Łyżki",
        slug: "lyzki",
        children: [
          { name: "Standardowe", slug: "standardowe" },
          { name: "Wzmocnione", slug: "wzmocnione" },
          { name: "Różne szerokości (600-1600mm)", slug: "rozne-szerokosci" },
          { name: "Specjalistyczne", slug: "specjalistyczne" },
        ],
      },
      { name: "Zęby do łyżek", slug: "zeby-do-lyzek" },
      { name: "Adaptery do łyżek", slug: "adaptery-do-lyzek" },
      {
        name: "Młoty hydrauliczne",
        slug: "mloty-hydrauliczne",
        children: [
          { name: "Małe (do 1 tony)", slug: "male-do-1-tony" },
          { name: "Średnie (1-3 tony)", slug: "srednie-1-3-tony" },
          { name: "Duże (3+ tony)", slug: "duze-3-plus-tony" },
          { name: "Groty zamienialne", slug: "groty-zamienialne" },
        ],
      },
      { name: "Wiertła", slug: "wiertla" },
      { name: "Kompaktory", slug: "kompaktory" },
      { name: "Haki chwytające", slug: "haki-chwytajace" },
      { name: "Magnesy", slug: "magnesy" },
      { name: "Wymienne karty robocze", slug: "wymienne-karty-robocze" },
    ],
  },
  {
    name: "Normalia warsztatowe",
    slug: "normalia-warsztatowe",
    icon: "🔩",
    description: "Śruby, nakrętki, podkładki, kołki",
    children: [
      {
        name: "Śruby (M6 - M42)",
        slug: "sruby",
        children: [
          { name: "Zwykłe", slug: "zwykle" },
          { name: "Imbusowe", slug: "imbusowe" },
          { name: "Stopniowe", slug: "stopniowe" },
          { name: "Specjalne", slug: "specjalne" },
        ],
      },
      {
        name: "Nakrętki",
        slug: "nakretki",
        children: [
          { name: "Zwykłe", slug: "zwykle" },
          { name: "Samozabezpieczające", slug: "samozabezpieczajace" },
          { name: "Koronowe", slug: "koronowe" },
        ],
      },
      {
        name: "Podkładki",
        slug: "podkladki",
        children: [
          { name: "Płaskie", slug: "plaskie" },
          { name: "Sprężyste", slug: "sprezyste" },
          { name: "Specjalne", slug: "specjalne" },
        ],
      },
      { name: "Kołki podziałowe", slug: "kolki-podzialowe" },
      { name: "Sworzeń", slug: "sworzen" },
      { name: "Pierścienie zabezpieczające", slug: "pierscienie-zabezpieczajace" },
      { name: "Pierścienie zaporowe", slug: "pierscienie-zaporowe" },
      { name: "Zestawy naprawcze", slug: "zestawy-naprawcze" },
    ],
  },
  {
    name: "Wtryski & Systemy paliwowe",
    slug: "wtryski-systemy-paliwowe",
    icon: "⛽",
    description: "Wtryski, pompy paliwowe, filtry, czujniki",
    children: [
      { name: "Wtryski paliwowe", slug: "wtryski-paliwowe" },
      { name: "Pompy paliwowe", slug: "pompy-paliwowe" },
      { name: "Filtry paliwowe", slug: "filtry-paliwowe-wtryski" },
      { name: "Części systemu zasilania", slug: "czesci-systemu-zasilania" },
      { name: "Czujniki paliwa", slug: "czujniki-paliwa" },
    ],
  },
  {
    name: "Układ hamulcowy",
    slug: "uklad-hamulcowy",
    icon: "🛑",
    description: "Klocki, tarcze, bomby, siłowniki hamulcowe",
    children: [
      {
        name: "Klocki hamulcowe",
        slug: "klocki-hamulcowe",
        children: [
          { name: "Organiczne", slug: "organiczne" },
          { name: "Semi-metallic", slug: "semi-metallic" },
          { name: "Ceramiczne", slug: "ceramiczne" },
          { name: "Hartowane", slug: "hartowane" },
        ],
      },
      { name: "Tarcze hamulcowe", slug: "tarcze-hamulcowe" },
      { name: "Bomby hamulcowe", slug: "bomby-hamulcowe" },
      { name: "Pompy hamulcowe", slug: "pompy-hamulcowe" },
      { name: "Siłowniki hamulcowe", slug: "silowniki-hamulcowe" },
      { name: "Przewody hamulcowe", slug: "przewody-hamulcowe" },
      { name: "Płyn hamulcowy", slug: "plyn-hamulcowy" },
      { name: "Czujniki zużycia", slug: "czujniki-zuzycia" },
    ],
  },
  {
    name: "Układ sterowania & Czujniki",
    slug: "uklad-sterowania-czujniki",
    icon: "📡",
    description: "Czujniki pozycji, ciśnienia, temperatury, prędkości",
    children: [
      { name: "Czujniki pozycji", slug: "czujniki-pozycji" },
      { name: "Czujniki ciśnienia", slug: "czujniki-cisnienia" },
      { name: "Czujniki temperatury", slug: "czujniki-temperatury" },
      { name: "Czujniki prędkości", slug: "czujniki-predkosci" },
      { name: "Czujniki poziomu", slug: "czujniki-poziomu" },
      { name: "Czujniki level", slug: "czujniki-level" },
      { name: "Przełączniki", slug: "przelaczniki" },
      { name: "Elektroniczne moduły sterowania", slug: "elektroniczne-moduly-sterowania" },
    ],
  },
  {
    name: "Akcesoria",
    slug: "akcesoria",
    icon: "🎯",
    description: "Lampy, manetki, joysticki, wyłączniki bezpieczeństwa",
    children: [
      { name: "Lampy ostrzegawcze", slug: "lampy-ostrzegawcze" },
      { name: "Manetki sterowania", slug: "manetki-sterowania" },
      { name: "Drążki", slug: "drazki" },
      { name: "Dźwignie", slug: "dzwignie" },
      { name: "Joysticki", slug: "joysticki" },
      { name: "Przyciski", slug: "przyciski" },
      { name: "Wyłączniki bezpieczeństwa", slug: "wylaczniki-bezpieczenstwa" },
      { name: "Pasy bezpieczeństwa", slug: "pasy-bezpieczenstwa" },
      { name: "Uchwyty", slug: "uchwyty" },
      { name: "Dodatkowe wyposażenie", slug: "dodatkowe-wyposazenie" },
    ],
  },
  {
    name: "Części do konkretnych marek",
    slug: "czesci-do-marek",
    icon: "🏭",
    description: "CAT, Komatsu, Hitachi, Volvo, JCB i inne",
    children: [
      {
        name: "CAT (Caterpillar)",
        slug: "cat-caterpillar",
        children: [
          { name: "Serie mini (301, 305, 308)", slug: "serie-mini" },
          { name: "Koparki 320-390", slug: "koparki-320-390" },
          { name: "Koparki 390F-420F", slug: "koparki-390f-420f" },
          { name: "Ładowarki", slug: "ladowarki" },
          { name: "Spycharki", slug: "spycharki" },
        ],
      },
      {
        name: "KOMATSU",
        slug: "komatsu",
        children: [
          { name: "PC50 - PC200", slug: "pc50-pc200" },
          { name: "PC300+", slug: "pc300-plus" },
          { name: "WA (ładowarka)", slug: "wa-ladowarka" },
          { name: "D (spychacz)", slug: "d-spychacz" },
        ],
      },
      {
        name: "HITACHI",
        slug: "hitachi",
        children: [
          { name: "ZX (seria koparka)", slug: "zx-seria-koparka" },
          { name: "WH (ładowarka)", slug: "wh-ladowarka" },
          { name: "Części specjalne", slug: "czesci-specjalne" },
        ],
      },
      { name: "VOLVO", slug: "volvo" },
      { name: "JCB", slug: "jcb" },
      { name: "KOBELCO", slug: "kobelco" },
      { name: "HYUNDAI", slug: "hyundai" },
      { name: "BOBCAT", slug: "bobcat" },
      { name: "DOOSAN", slug: "doosan" },
      { name: "YUCHAI", slug: "yuchai" },
      { name: "ATLAS", slug: "atlas" },
    ],
  },
  {
    name: "Części wycinkowe (Special)",
    slug: "czesci-wycinkowe",
    icon: "⭐",
    description: "Zęby do młotów, groty, ścierżyny, adaptery",
    children: [
      { name: "Zęby do młotów (OEM numery)", slug: "zeby-do-mlotow" },
      { name: "Groty do wycinarek", slug: "groty-do-wycinarek" },
      { name: "Ścierżyny", slug: "scierzyny" },
      { name: "Adaptery uniwersalne", slug: "adaptery-uniwersalne" },
      { name: "Części zamiennego zastosowania", slug: "czesci-zamiennego-zastosowania" },
    ],
  },
  {
    name: "Części rolnicze",
    slug: "czesci-rolnicze",
    icon: "🌾",
    description: "Do ciągników, maszyn rolniczych, pługów",
    children: [
      { name: "Do ciągników (JCB 3CX, etc)", slug: "do-ciagnikow" },
      { name: "Do maszyn rolniczych", slug: "do-maszyn-rolniczych" },
      { name: "Części do pługów", slug: "czesci-do-plugow" },
      { name: "Lemiesze", slug: "lemiesze" },
    ],
  },
  {
    name: "Części drogowe & Specjalne",
    slug: "czesci-drogowe-specjalne",
    icon: "🛣️",
    description: "Do walcarek, werterin, kopiarek asfaltu",
    children: [
      { name: "Do walcarek", slug: "do-walcarek" },
      { name: "Do werterin", slug: "do-werterin" },
      { name: "Do kopiarek asfaltu", slug: "do-kopiarek-asfaltu" },
      { name: "Części specjalistyczne", slug: "czesci-specjalistyczne" },
    ],
  },
]

/**
 * Helper function to flatten category tree for database insertion
 */
export function flattenCategories(
  categories: CategorySeedData[],
  parentId: string | null = null,
  result: Array<CategorySeedData & { parent_id: string | null }> = []
): Array<CategorySeedData & { parent_id: string | null }> {
  for (const category of categories) {
    const { children, ...categoryData } = category
    result.push({ ...categoryData, parent_id: parentId })
    
    if (children && children.length > 0) {
      flattenCategories(children, category.slug, result)
    }
  }
  
  return result
}

/**
 * Get total count of categories (including subcategories)
 */
export function getCategoryCount(categories: CategorySeedData[]): number {
  let count = 0
  for (const category of categories) {
    count++
    if (category.children) {
      count += getCategoryCount(category.children)
    }
  }
  return count
}

// Export stats
export const CATEGORY_STATS = {
  mainCategories: CATEGORIES_SEED.length,
  totalCategories: getCategoryCount(CATEGORIES_SEED),
  maxDepth: 4, // Maximum nesting level
}
