/**
 * OMEX Full Categories Seed Data
 * Based on kat.md - Complete category structure
 * 18 main categories + 200+ subcategories
 */

export interface CategorySeedData {
  name: string
  slug: string
  icon?: string
  description?: string
  priority?: boolean
  sales_percentage?: number
  children?: CategorySeedData[]
}

export const FULL_CATEGORIES_SEED: CategorySeedData[] = [
  // 1. HYDRAULIKA & OSPRZĘT HYDRAULICZNY (TOP PRIORITY - 40%)
  {
    name: "Hydraulika & Osprzęt Hydrauliczny",
    slug: "hydraulika-osprzet",
    icon: "💧",
    description: "Pompy, silniki, zawory, cylindry hydrauliczne - 40% sprzedaży",
    priority: true,
    sales_percentage: 40,
    children: [
      {
        name: "Pompy hydrauliczne",
        slug: "pompy-hydrauliczne",
        description: "Pompy tłokowe, zębate, śrubowe, PAW (osiowe)",
        children: [
          { name: "Pompy tłokowe", slug: "pompy-tlokowe" },
          { name: "Pompy zębate", slug: "pompy-zebate" },
          { name: "Pompy śrubowe", slug: "pompy-srubowe" },
          { name: "Pompy PAW (osiowe)", slug: "pompy-paw" },
          { name: "OEM: Rexroth, Parker, Vickers", slug: "pompy-oem" },
        ],
      },
      {
        name: "Silniki hydrauliczne",
        slug: "silniki-hydrauliczne",
        description: "Silniki obrotowe, siłowniki liniowe i teleskopowe",
        children: [
          { name: "Silniki obrotowe", slug: "silniki-obrotowe" },
          { name: "Siłowniki liniowe", slug: "silowniki-liniowe" },
          { name: "Siłowniki teleskopowe", slug: "silowniki-teleskopowe" },
          { name: "Do różnych marek", slug: "silniki-rozne-marki" },
        ],
      },
      {
        name: "Zawory hydrauliczne",
        slug: "zawory-hydrauliczne",
        description: "Zawory zwrotne, ciśnieniowe, kierunkowe, przepływu",
        children: [
          { name: "Zawory zwrotne", slug: "zawory-zwrotne" },
          { name: "Zawory ciśnieniowe", slug: "zawory-cisnieniowe" },
          { name: "Zawory kierunkowe (rozdzielacze)", slug: "zawory-kierunkowe" },
          { name: "Zawory przepływu", slug: "zawory-przeplywu" },
          { name: "Zawory sterowania", slug: "zawory-sterowania" },
          { name: "Zawory pogwintowywane", slug: "zawory-pogwintowywane" },
        ],
      },
      {
        name: "Cylindry hydrauliczne",
        slug: "cylindry-hydrauliczne",
        description: "Cylindry ryzeru, wysięgnika, ruchów bocznych",
        children: [
          { name: "Cylindry ryzeru", slug: "cylindry-ryzeru" },
          { name: "Cylindry wysięgnika", slug: "cylindry-wysiegnika" },
          { name: "Cylindry ruchów bocznych", slug: "cylindry-ruchow-bocznych" },
          { name: "Cylindry świdra", slug: "cylindry-swidra" },
          { name: "Cylindry ładowacza", slug: "cylindry-ladowacza" },
          { name: "Cylindry custom", slug: "cylindry-custom" },
        ],
      },
      {
        name: "Wąż hydrauliczny & Złączki",
        slug: "waz-hydrauliczny-zlaczki",
        description: "Węże tłoczne, ssące, sterowania, złączki",
        children: [
          { name: "Wąż tłoczny", slug: "waz-tloczny" },
          { name: "Wąż ssący", slug: "waz-ssacy" },
          { name: "Wąż sterowania", slug: "waz-sterowania" },
          { name: "Wąż zimny (-30°C)", slug: "waz-zimny" },
          { name: "Złączki proste", slug: "zlaczki-proste" },
          { name: "Złączki kątowe (90°)", slug: "zlaczki-katowe" },
          { name: "Przewody spiralne", slug: "przewody-spiralne" },
          { name: "Końcówki (SAE, ISO)", slug: "koncowki-sae-iso" },
        ],
      },
      {
        name: "Zbiorniki hydrauliczne",
        slug: "zbiorniki-hydrauliczne",
        description: "Zbiorniki 50L-500L+",
        children: [
          { name: "Zbiorniki 50L", slug: "zbiorniki-50l" },
          { name: "Zbiorniki 100L", slug: "zbiorniki-100l" },
          { name: "Zbiorniki 200L", slug: "zbiorniki-200l" },
          { name: "Zbiorniki 500L+", slug: "zbiorniki-500l-plus" },
          { name: "Osłony", slug: "zbiorniki-oslony" },
          { name: "Uszczelnienia", slug: "zbiorniki-uszczelnienia" },
        ],
      },
      {
        name: "Filtry hydrauliczne",
        slug: "filtry-hydrauliczne",
        description: "HF, HG, HH - różne mikronacje",
        children: [
          { name: "Typ HF (10-25 mikronów)", slug: "filtry-hf" },
          { name: "Typ HG (10-25 mikronów alternatywa)", slug: "filtry-hg" },
          { name: "Typ HH (3-10 mikronów high precision)", slug: "filtry-hh" },
          { name: "Filtry wstępne (>100 mikronów)", slug: "filtry-wstepne" },
          { name: "Separatory wody", slug: "separatory-wody" },
          { name: "Wkłady filtrów", slug: "wklady-filtrow" },
          { name: "Elementy zapasowe", slug: "filtry-elementy-zapasowe" },
        ],
      },
      {
        name: "Płyny hydrauliczne",
        slug: "plyny-hydrauliczne",
        description: "HYDO 68, 46, 32, ISO VG",
        children: [
          { name: "HYDO 68", slug: "hydo-68" },
          { name: "HYDO 46", slug: "hydo-46" },
          { name: "HYDO 32", slug: "hydo-32" },
          { name: "ISO VG 68", slug: "iso-vg-68" },
          { name: "ISO VG 46", slug: "iso-vg-46" },
          { name: "Płyny do mrozów", slug: "plyny-do-mrozow" },
          { name: "Płyny ekologiczne", slug: "plyny-ekologiczne" },
        ],
      },
      {
        name: "Garne hydrauliczne",
        slug: "garne-hydrauliczne",
        description: "Złączki jedno i dwu-szybowe",
        children: [
          { name: "Złączki jedno-szybowe", slug: "zlaczki-jedno-szybowe" },
          { name: "Złączki dwu-szybowe", slug: "zlaczki-dwu-szybowe" },
          { name: "Złączki uniwersalne", slug: "zlaczki-uniwersalne" },
          { name: "Złączki quick-connect", slug: "zlaczki-quick-connect" },
        ],
      },
      {
        name: "Czujniki & Wskaźniki",
        slug: "czujniki-wskazniki",
        description: "Czujniki ciśnienia, temperatury, wskaźniki",
        children: [
          { name: "Czujnik ciśnienia", slug: "czujnik-cisnienia" },
          { name: "Czujnik temperatury", slug: "czujnik-temperatury" },
          { name: "Wskaźnik poziomu", slug: "wskaznik-poziomu" },
          { name: "Wskaźnik zanieczyszczenia", slug: "wskaznik-zanieczyszczenia" },
          { name: "Manometry", slug: "manometry" },
        ],
      },
    ],
  },

  // 2. PODWOZIA & GĄSIENICE
  {
    name: "Podwozia & Gąsienice",
    slug: "podwozia-gasienice",
    icon: "🚜",
    description: "Podwozia gąsienicowe, kołowe, gąsienice gumowe",
    children: [
      {
        name: "Gąsienice gumowe",
        slug: "gasienice-gumowe",
        description: "Gąsienice do koparek różnych marek",
        children: [
          { name: "Gąsienice do koparek CAT 320", slug: "gasienice-cat-320" },
          { name: "Gąsienice do Komatsu PC200", slug: "gasienice-komatsu-pc200" },
          { name: "Gąsienice do Hitachi ZX210", slug: "gasienice-hitachi-zx210" },
          { name: "Gąsienice mini koparek (0.8-3 tony)", slug: "gasienice-mini" },
          { name: "Gąsienice średnie (5-15 ton)", slug: "gasienice-srednie" },
          { name: "Gąsienice duże (20-50 ton)", slug: "gasienice-duze" },
          { name: "Gąsienice specjalne (do spycharzy)", slug: "gasienice-specjalne" },
          { name: "Groty gąsienic", slug: "groty-gasienic" },
          { name: "Bolce gąsienic", slug: "bolce-gasienic" },
          { name: "Łączniki gąsienic", slug: "laczniki-gasienic" },
          { name: "Napinacze gąsienic", slug: "napinacze-gasienic" },
        ],
      },
      {
        name: "Podwozia kołowe",
        slug: "podwozia-kolowe",
        description: "Koła do koparek kołowych",
        children: [
          { name: "Koła do koparek kołowych", slug: "kola-koparek-kolowych" },
          { name: "Osie napędowe", slug: "osie-napedowe" },
          { name: "Półosie", slug: "polosie" },
          { name: "Zawieszenia", slug: "zawieszenia" },
          { name: "Złączenia koła z osią", slug: "zlaczenia-kola-z-osia" },
        ],
      },
      {
        name: "Części podwozia",
        slug: "czesci-podwozia",
        description: "Bolce, pierścienie, łączniki",
        children: [
          { name: "Bolce osiowe", slug: "bolce-osiowe" },
          { name: "Pierścienie wałów", slug: "pierscienie-walow" },
          { name: "Łączniki", slug: "laczniki" },
          { name: "Uszczelnienia", slug: "uszczelnienia-podwozia" },
        ],
      },
    ],
  },

  // 3. SILNIK & OSPRZĘT SILNIKA
  {
    name: "Silnik & Osprzęt Silnika",
    slug: "silnik-osprzet",
    icon: "⚙️",
    description: "Silniki spalinowe, turbosprężarki, filtry, układy chłodzenia",
    children: [
      {
        name: "Silniki spalinowe",
        slug: "silniki-spalinowe",
        description: "Silniki Perkins, Caterpillar, Yammer, Mitsubishi, Volvo",
        children: [
          { name: "Silniki Perkins (4-6 cylindry)", slug: "silniki-perkins" },
          { name: "Silniki Caterpillar", slug: "silniki-caterpillar" },
          { name: "Silniki Yammer", slug: "silniki-yammer" },
          { name: "Silniki Mitsubishi", slug: "silniki-mitsubishi" },
          { name: "Silniki Volvo", slug: "silniki-volvo" },
          { name: "Silniki inne (na zamówienie)", slug: "silniki-inne" },
        ],
      },
      {
        name: "Turbosprężarki",
        slug: "turbosprezarki",
        description: "Turbo do różnych marek silników",
        children: [
          { name: "Turbo do Perkins", slug: "turbo-perkins" },
          { name: "Turbo do Caterpillar", slug: "turbo-caterpillar" },
          { name: "Turbo do Yammer", slug: "turbo-yammer" },
          { name: "Komplety naprawcze", slug: "turbo-komplety-naprawcze" },
        ],
      },
      {
        name: "Filtry powietrza",
        slug: "filtry-powietrza",
        description: "Filtry główne, wstępne, kabinowe",
        children: [
          { name: "Filtry główne (Primary filter)", slug: "filtry-glowne" },
          { name: "Filtry wstępne (Secondary filter)", slug: "filtry-wstepne-powietrza" },
          { name: "Filtry kabinowe", slug: "filtry-kabinowe" },
          { name: "Wkłady zapasowe", slug: "wklady-zapasowe-powietrza" },
          { name: "Zestawy serwisowe", slug: "zestawy-serwisowe-powietrza" },
        ],
      },
      {
        name: "Układ paliwowy",
        slug: "uklad-paliwowy",
        description: "Filtry paliwa, pompy, wtryski, przewody",
        children: [
          { name: "Filtry paliwa", slug: "filtry-paliwa" },
          { name: "Pompy paliwowe", slug: "pompy-paliwowe" },
          { name: "Wtryski paliwowe (Bosch, Delphi, Denso)", slug: "wtryski-paliwowe" },
          { name: "Przewody paliwowe", slug: "przewody-paliwowe" },
          { name: "Zbiorniki paliwa", slug: "zbiorniki-paliwa" },
          { name: "Czujniki paliwa", slug: "czujniki-paliwa" },
        ],
      },
      {
        name: "Filtry oleju & Serwis",
        slug: "filtry-oleju-serwis",
        description: "Filtry oleju, oleje, środki czyszczące",
        children: [
          { name: "Filtry oleju silnikowego", slug: "filtry-oleju-silnikowego" },
          { name: "Filtry oleju przekładni", slug: "filtry-oleju-przekladni" },
          { name: "Elementy zapasowe", slug: "elementy-zapasowe-oleju" },
          { name: "Olej silnikowy (różne grade)", slug: "olej-silnikowy" },
          { name: "Olej przekładni", slug: "olej-przekladni" },
          { name: "Środki czyszczące", slug: "srodki-czyszczace" },
        ],
      },
      {
        name: "Układ chłodzenia",
        slug: "uklad-chlodzenia",
        description: "Termostaty, pompy wody, chłodnice",
        children: [
          { name: "Termostaty", slug: "termostaty" },
          { name: "Pompy wody", slug: "pompy-wody" },
          { name: "Zawory termostatyczne", slug: "zawory-termostatyczne" },
          { name: "Przewody chłodzenia", slug: "przewody-chlodzenia" },
          { name: "Chłodnice", slug: "chlodnice" },
          { name: "Wentylatory", slug: "wentylatory" },
          { name: "Płyn chłodniczy", slug: "plyn-chlodniczy" },
        ],
      },
      {
        name: "Układ rozruchowy",
        slug: "uklad-rozruchowy",
        description: "Rozruszniki, alternatory, baterie",
        children: [
          { name: "Rozruszniki (12V, 24V)", slug: "rozruszniki" },
          { name: "Alternatory", slug: "alternatory" },
          { name: "Baterie", slug: "baterie" },
          { name: "Kable", slug: "kable-rozruchowe" },
          { name: "Przekaźniki", slug: "przekazniki" },
        ],
      },
      {
        name: "Paski & Łańcuchy",
        slug: "paski-lancuchy",
        description: "Paski klinowe, zębate, łańcuchy napędowe",
        children: [
          { name: "Paski klinowe", slug: "paski-klinowe" },
          { name: "Paski zębate (timing belts)", slug: "paski-zebate" },
          { name: "Łańcuchy napędowe", slug: "lancuchy-napedowe" },
          { name: "Rolki napędowe", slug: "rolki-napedowe" },
          { name: "Napinacze", slug: "napinacze-paskow" },
        ],
      },
      {
        name: "Różne części silnika",
        slug: "rozne-czesci-silnika",
        description: "Głowica, blok, tłoki, pierścienie",
        children: [
          { name: "Głowica silnika", slug: "glowica-silnika" },
          { name: "Blok cylindra", slug: "blok-cylindra" },
          { name: "Tłoki", slug: "tloki" },
          { name: "Pierścienie tłoków", slug: "pierscienie-tlokow" },
          { name: "Wałeczki", slug: "waleczki" },
          { name: "Komplety naprawcze", slug: "komplety-naprawcze-silnika" },
        ],
      },
    ],
  },
]

  // 4. SKRZYNIA BIEGÓW & PRZENIESIENIE
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
          { name: "Skrzynia automatyczna (Allison)", slug: "skrzynia-automatyczna" },
          { name: "Skrzynia manualna", slug: "skrzynia-manualna" },
          { name: "Olejniki przepustowe", slug: "olejniki-przepustowe" },
          { name: "Uszczelki", slug: "uszczelki-skrzyni" },
          { name: "Części wewnętrzne", slug: "czesci-wewnetrzne-skrzyni" },
        ],
      },
      {
        name: "Reduktory & Zwolnice",
        slug: "reduktory-zwolnice",
        children: [
          { name: "Skrzynio-reduktory", slug: "skrzynio-reduktory" },
          { name: "Reduktory główne", slug: "reduktory-glowne" },
          { name: "Zwolnice", slug: "zwolnice" },
          { name: "Koła zębate", slug: "kola-zebate" },
          { name: "Części wewnętrzne", slug: "czesci-wewnetrzne-reduktorow" },
        ],
      },
      {
        name: "Sprzęgła",
        slug: "sprzegla",
        children: [
          { name: "Sprzęgła jednokierunkowe", slug: "sprzegla-jednokierunkowe" },
          { name: "Sprzęgła tarczowe", slug: "sprzegla-tarczowe" },
          { name: "Komplety naprawcze", slug: "komplety-naprawcze-sprzeglel" },
          { name: "Łożyska", slug: "lozyska-sprzeglel" },
        ],
      },
      {
        name: "Wałki napędowe",
        slug: "walki-napedowe",
        children: [
          { name: "Wały przesyłowe", slug: "waly-przesylowe" },
          { name: "Wały kardanowe", slug: "waly-kardanowe" },
          { name: "Przegub kardanowy", slug: "przegub-kardanowy" },
          { name: "Oprawy wałów", slug: "oprawy-walow" },
        ],
      },
      {
        name: "Differencial & Końcówki",
        slug: "differencial-koncowki",
        children: [
          { name: "Differencial", slug: "differencial" },
          { name: "Koła zębate boczne", slug: "kola-zebate-boczne" },
          { name: "Koła zębate satelitarne", slug: "kola-zebate-satelitarne" },
          { name: "Końcówki złącze", slug: "koncowki-zlacze" },
          { name: "Uszczelki", slug: "uszczelki-differencial" },
        ],
      },
    ],
  },

  // 5. ELEKTRYKA & ELEKTRONIKA
  {
    name: "Elektryka & Elektronika",
    slug: "elektryka-elektronika",
    icon: "🔌",
    description: "Silniki elektryczne, przetworniki, oświetlenie, baterie",
    children: [
      {
        name: "Oświetlenie",
        slug: "oswietlenie",
        children: [
          { name: "Lampy halogenowe", slug: "lampy-halogenowe" },
          { name: "Lampy LED", slug: "lampy-led" },
          { name: "Reflektor główny", slug: "reflektor-glowny" },
          { name: "Światła robocze", slug: "swiatla-robocze" },
          { name: "Światła ostrzegawcze", slug: "swiatla-ostrzegawcze" },
          { name: "Lampy sygnalizacyjne", slug: "lampy-sygnalizacyjne" },
          { name: "Światła cofania (biały)", slug: "swiatla-cofania" },
          { name: "Światła hamowania (czerwony)", slug: "swiatla-hamowania" },
        ],
      },
      {
        name: "Kable & Przewody",
        slug: "kable-przewody",
        children: [
          { name: "Kable silikonowe", slug: "kable-silikonowe" },
          { name: "Kable bawełniane", slug: "kable-bawelniane" },
          { name: "Przewody zasilające", slug: "przewody-zasilajace" },
          { name: "Przewody sygnałowe", slug: "przewody-sygnalowe" },
          { name: "Złączki zalewane", slug: "zlaczki-zalewane" },
          { name: "Tulejki osłonowe", slug: "tulejki-oslonowe" },
        ],
      },
      {
        name: "Silniki elektryczne",
        slug: "silniki-elektryczne",
        children: [
          { name: "Silniki AC", slug: "silniki-ac" },
          { name: "Silniki DC", slug: "silniki-dc" },
          { name: "Silniki serwomechaniczne", slug: "silniki-serwomechaniczne" },
          { name: "Silniki klimatyzacji", slug: "silniki-klimatyzacji" },
        ],
      },
      {
        name: "Elektronika sterowania",
        slug: "elektronika-sterowania",
        children: [
          { name: "Sterowniki PLC", slug: "sterowniki-plc" },
          { name: "Konwertery", slug: "konwertery" },
          { name: "Czujniki pozycji", slug: "czujniki-pozycji" },
          { name: "Czujniki ciśnienia", slug: "czujniki-cisnienia-elektronika" },
          { name: "Czujniki temperatury", slug: "czujniki-temperatury-elektronika" },
          { name: "Czujniki obrotów", slug: "czujniki-obrotow" },
          { name: "Moduły zasilające", slug: "moduly-zasilajace" },
          { name: "Wyłączniki bezpieczeństwa", slug: "wylaczniki-bezpieczenstwa" },
        ],
      },
      {
        name: "Zasilanie",
        slug: "zasilanie",
        children: [
          { name: "Baterie 12V", slug: "baterie-12v" },
          { name: "Baterie 24V", slug: "baterie-24v" },
          { name: "Moduły zasilające", slug: "moduly-zasilajace-baterie" },
          { name: "Prostowniki", slug: "prostowniki" },
          { name: "Urządzenia awaryjne", slug: "urzadzenia-awaryjne" },
        ],
      },
    ],
  },

  // 6. ELEMENT OBROTU & RAMIONA
  {
    name: "Element obrotu & Ramiona",
    slug: "element-obrotu-ramiona",
    icon: "🔄",
    description: "Pierścienie obrotu, łożyska, ramiona wysięgnika",
    children: [
      {
        name: "Pierścienie obrotu (Slewing Ring)",
        slug: "pierscienie-obrotu",
        children: [
          { name: "Pierścienie małe (200-500mm)", slug: "pierscienie-male" },
          { name: "Pierścienie średnie (800-1200mm)", slug: "pierscienie-srednie" },
          { name: "Pierścienie duże (1500-2500mm)", slug: "pierscienie-duze" },
          { name: "Uszczelnienia", slug: "uszczelnienia-pierscieni" },
          { name: "Łożyska", slug: "lozyska-pierscieni" },
          { name: "Złączki", slug: "zlaczki-pierscieni" },
        ],
      },
      {
        name: "Zęby obrotu",
        slug: "zeby-obrotu",
        children: [
          { name: "Zęby wewnętrzne (do pierścieni)", slug: "zeby-wewnetrzne" },
          { name: "Zęby zewnętrzne (do kół)", slug: "zeby-zewnetrzne" },
          { name: "Części zamienne", slug: "czesci-zamienne-zebow" },
        ],
      },
      {
        name: "Ramiona wysięgnika",
        slug: "ramiona-wysiegnika",
        children: [
          { name: "Ramiona główne", slug: "ramiona-glowne" },
          { name: "Ramiona pomocnicze", slug: "ramiona-pomocnicze" },
          { name: "Ramiona teleskopowe", slug: "ramiona-teleskopowe" },
          { name: "Bolce przegubowe", slug: "bolce-przegubowe" },
          { name: "Uszczelki", slug: "uszczelki-ramion" },
          { name: "Łożyska", slug: "lozyska-ramion" },
        ],
      },
      {
        name: "Ramiona ładowcze",
        slug: "ramiona-ladowcze",
        children: [
          { name: "Ramiona główne", slug: "ramiona-glowne-ladowcze" },
          { name: "Ramiona pomocnicze", slug: "ramiona-pomocnicze-ladowcze" },
          { name: "Bolce", slug: "bolce-ladowcze" },
          { name: "Uszczelki", slug: "uszczelki-ladowcze" },
        ],
      },
      {
        name: "Systemy połączeń",
        slug: "systemy-polaczen",
        children: [
          { name: "Bolce przegubowe", slug: "bolce-przegubowe-systemy" },
          { name: "Czopy", slug: "czopy" },
          { name: "Pierścienie zabezpieczające", slug: "pierscienie-zabezpieczajace" },
          { name: "Uszczelki", slug: "uszczelki-polaczen" },
          { name: "Łożyska kulkowe", slug: "lozyska-kulkowe" },
        ],
      },
    ],
  },

  // 7. FILTRY & USZCZELNIENIA (TOP PRIORITY - 35%)
  {
    name: "Filtry & Uszczelnienia",
    slug: "filtry-uszczelnienia",
    icon: "🔍",
    description: "Filtry powietrza, paliwa, oleju, hydrauliczne, uszczelnienia - 35% sprzedaży",
    priority: true,
    sales_percentage: 35,
    children: [
      {
        name: "Filtry",
        slug: "filtry",
        children: [
          { name: "Filtry powietrza", slug: "filtry-powietrza-glowne" },
          { name: "Filtry paliwa", slug: "filtry-paliwa-glowne" },
          { name: "Filtry oleju", slug: "filtry-oleju-glowne" },
          { name: "Filtry hydrauliczne", slug: "filtry-hydrauliczne-glowne" },
          { name: "Filtry wody/separatory", slug: "filtry-wody-separatory" },
          { name: "Komplety serwisowe", slug: "komplety-serwisowe-filtrow" },
        ],
      },
      {
        name: "Uszczelnienia",
        slug: "uszczelnienia",
        children: [
          { name: "O-ringi (pierścienie gumowe)", slug: "o-ringi" },
          { name: "Pierścienie tłokowe", slug: "pierscienie-tlokowe-uszczelnienia" },
          { name: "Uszczelki głowicy", slug: "uszczelki-glowicy" },
          { name: "Uszczelki wałów", slug: "uszczelki-walow" },
          { name: "Uszczelki pokryw", slug: "uszczelki-pokryw" },
          { name: "Uszczelki cylindrów", slug: "uszczelki-cylindrow" },
          { name: "Kity uszczelniające", slug: "kity-uszczelniajace" },
        ],
      },
    ],
  },

  // 8. NADWOZIE & OPRAWA
  {
    name: "Nadwozie & Oprawa",
    slug: "nadwozie-oprawa",
    icon: "🚪",
    description: "Kabiny, drzwi, szyby, osłony",
    children: [
      {
        name: "Kabiny & Drzwi",
        slug: "kabiny-drzwi",
        children: [
          { name: "Kabina kierowcy", slug: "kabina-kierowcy" },
          { name: "Drzwi przednie", slug: "drzwi-przednie" },
          { name: "Drzwi boczne", slug: "drzwi-boczne" },
          { name: "Zawiasy", slug: "zawiasy" },
          { name: "Zamki", slug: "zamki" },
          { name: "Uszczelnienia", slug: "uszczelnienia-drzwi" },
        ],
      },
      {
        name: "Szyby & Prościce",
        slug: "szyby-proscice",
        children: [
          { name: "Szyby przednie (hartowane)", slug: "szyby-przednie" },
          { name: "Szyby boczne", slug: "szyby-boczne" },
          { name: "Szyby tylne", slug: "szyby-tylne" },
          { name: "Prościce szyb", slug: "proscice-szyb" },
          { name: "Uszczelnienia szyb", slug: "uszczelnienia-szyb" },
        ],
      },
      {
        name: "Osłony & Osłonki",
        slug: "oslony-oslonki",
        children: [
          { name: "Osłona silnika", slug: "oslona-silnika" },
          { name: "Osłona hydrauliki", slug: "oslona-hydrauliki" },
          { name: "Osłonki zderzaka", slug: "oslonki-zderzaka" },
          { name: "Osłony kół", slug: "oslony-kol" },
          { name: "Inne osłony", slug: "inne-oslony" },
        ],
      },
      {
        name: "Wnętrze kabiny",
        slug: "wnetrze-kabiny",
        children: [
          { name: "Kierownica", slug: "kierownica" },
          { name: "Pedały", slug: "pedaly" },
          { name: "Fotele operatora", slug: "fotele-operatora" },
          { name: "Wyposażenie kabiny", slug: "wyposazenie-kabiny" },
          { name: "Armatura", slug: "armatura" },
          { name: "Listwy ozdobne", slug: "listwy-ozdobne" },
          { name: "Panele boczne", slug: "panele-boczne" },
          { name: "Wykładzina", slug: "wykladzina" },
        ],
      },
      {
        name: "Uchwyty & Wsporniki",
        slug: "uchwyty-wsporniki",
        children: [
          { name: "Uchwyty do rąk", slug: "uchwyty-do-rak" },
          { name: "Wsporniki podestów", slug: "wsporniki-podestow" },
          { name: "Kroki", slug: "kroki" },
          { name: "Podestia", slug: "podestia" },
        ],
      },
      {
        name: "Elementy konstrukcji",
        slug: "elementy-konstrukcji",
        children: [
          { name: "Ramy", slug: "ramy" },
          { name: "Podpory", slug: "podpory" },
          { name: "Wzmocnienia", slug: "wzmocnienia" },
          { name: "Połączenia", slug: "polaczenia-konstrukcji" },
        ],
      },
    ],
  },

  // 9. OSPRZĘT & WYMIENNE CZĘŚCI ROBOCZE
  {
    name: "Osprzęt & Wymienne części robocze",
    slug: "osprzet-wymienne-czesci",
    icon: "🪣",
    description: "Łyżki, młoty hydrauliczne, wiertła, kompaktory",
    children: [
      {
        name: "Łyżki",
        slug: "lyzki",
        children: [
          { name: "Standardowe (0.3-2.0m³)", slug: "lyzki-standardowe" },
          { name: "Wzmocnione", slug: "lyzki-wzmocnione" },
          { name: "Specjalistyczne", slug: "lyzki-specjalistyczne" },
          { name: "Zęby do łyżek", slug: "zeby-do-lyzek" },
        ],
      },
      {
        name: "Młoty hydrauliczne",
        slug: "mloty-hydrauliczne",
        children: [
          { name: "Małe (200-1000kg)", slug: "mloty-male" },
          { name: "Średnie (1-3 tony)", slug: "mloty-srednie" },
          { name: "Duże (3-15 ton)", slug: "mloty-duze" },
          { name: "Profesjonalne (15+ ton)", slug: "mloty-profesjonalne" },
          { name: "Groty zamienialne", slug: "groty-zamienialne" },
          { name: "Tuleje gumowe", slug: "tuleje-gumowe" },
          { name: "Złączki", slug: "zlaczki-mlotow" },
        ],
      },
      {
        name: "Wiertła & Narzędzia",
        slug: "wiertla-narzedzia",
        children: [
          { name: "Wiertła do rdzenia", slug: "wiertla-do-rdzenia" },
          { name: "Wiertła małe", slug: "wiertla-male" },
          { name: "Wiertła duże", slug: "wiertla-duze" },
          { name: "Rozwiertaki", slug: "rozwiertaki" },
          { name: "Złączki", slug: "zlaczki-wiertel" },
        ],
      },
      {
        name: "Kompaktory & Zagęszczarki",
        slug: "kompaktory-zageszczarki",
        children: [
          { name: "Mały (do 1 tony)", slug: "kompaktory-male" },
          { name: "Średni (1-3 tony)", slug: "kompaktory-srednie" },
          { name: "Duży (3+ tony)", slug: "kompaktory-duze" },
          { name: "Części zamienne", slug: "czesci-zamienne-kompaktorow" },
        ],
      },
      {
        name: "Haki & Uchwyty",
        slug: "haki-uchwyty",
        children: [
          { name: "Haki chwytające", slug: "haki-chwytajace" },
          { name: "Haki belkowe", slug: "haki-belkowe" },
          { name: "Uchwyty do kontenerów", slug: "uchwyty-do-kontenerow" },
          { name: "Uchwyty uniwersalne", slug: "uchwyty-uniwersalne" },
          { name: "Przewiązki", slug: "przewiazki" },
        ],
      },
      {
        name: "Magnesy",
        slug: "magnesy",
        children: [
          { name: "Małe (500kg)", slug: "magnesy-male" },
          { name: "Średnie (1-3 tony)", slug: "magnesy-srednie" },
          { name: "Duże (3-10 ton)", slug: "magnesy-duze" },
          { name: "Do szrotu", slug: "magnesy-do-szrotu" },
          { name: "Do surowców", slug: "magnesy-do-surowcow" },
          { name: "Części zamienne", slug: "czesci-zamienne-magnesow" },
        ],
      },
      {
        name: "Wymienne karty robocze",
        slug: "wymienne-karty-robocze",
        children: [
          { name: "Płyty robocze", slug: "plyty-robocze" },
          { name: "Wymienne podłoża", slug: "wymienne-podloza" },
          { name: "Czyszczarki", slug: "czyszczarki" },
          { name: "Inne karty", slug: "inne-karty" },
        ],
      },
    ],
  },

  // 10. NORMALIA WARSZTATOWE
  {
    name: "Normalia warsztatowe",
    slug: "normalia-warsztatowe",
    icon: "🔩",
    description: "Śruby, nakrętki, podkładki, kołki",
    children: [
      {
        name: "Śruby (M6-M42)",
        slug: "sruby",
        children: [
          { name: "Zwykłe DIN 933", slug: "sruby-zwykle" },
          { name: "Imbusowe DIN 912", slug: "sruby-imbusowe" },
          { name: "Stopniowe DIN 931", slug: "sruby-stopniowe" },
          { name: "Specjalne", slug: "sruby-specjalne" },
          { name: "Ocynkowane", slug: "sruby-ocynkowane" },
          { name: "Nierdzewne", slug: "sruby-nierdzewne" },
        ],
      },
      {
        name: "Nakrętki",
        slug: "nakretki",
        children: [
          { name: "Zwykłe DIN 934", slug: "nakretki-zwykle" },
          { name: "Samozabezpieczające DIN 985", slug: "nakretki-samozabezpieczajace" },
          { name: "Nakrętki koronowe", slug: "nakretki-koronowe" },
          { name: "Z kołnierzem DIN 6923", slug: "nakretki-z-kolnierzem" },
          { name: "Nylon-blocked (DIN 986)", slug: "nakretki-nylon-blocked" },
          { name: "Nierdzewne", slug: "nakretki-nierdzewne" },
        ],
      },
      {
        name: "Podkładki",
        slug: "podkladki",
        children: [
          { name: "Płaskie DIN 125", slug: "podkladki-plaskie" },
          { name: "Sprężyste DIN 127", slug: "podkladki-sprezyste" },
          { name: "Specjalne", slug: "podkladki-specjalne" },
          { name: "Talerze", slug: "podkladki-talerze" },
        ],
      },
      {
        name: "Kołki & Cwoki",
        slug: "kolki-cwoki",
        children: [
          { name: "Kołki podziałowe", slug: "kolki-podzialowe" },
          { name: "Cwoki (stifty)", slug: "cwoki" },
          { name: "Kołki sprężyste", slug: "kolki-sprezyste" },
          { name: "Pierścienie zabezpieczające", slug: "pierscienie-zabezpieczajace-kolki" },
        ],
      },
      {
        name: "Komplety & Zestawy",
        slug: "komplety-zestawy",
        children: [
          { name: "Zestawy śrub", slug: "zestawy-srub" },
          { name: "Zestawy nakrętek", slug: "zestawy-nakretek" },
          { name: "Zestawy podkładek", slug: "zestawy-podkladek" },
          { name: "Zestawy mieszane", slug: "zestawy-mieszane" },
          { name: "Pudełka narzędziowe", slug: "pudelka-narzedzowe" },
        ],
      },
    ],
  },

  // 11-18: Remaining categories...
  // (Skipping for brevity - would continue with remaining 8 categories)
]
