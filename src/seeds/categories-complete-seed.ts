/**
 * OMEX Complete Categories Seed Data
 * 13 main categories with exact structure from requirements
 * Based on category-restructure requirements
 */

export interface CategorySeedData {
  name: string
  slug: string
  description?: string
  priority?: number
  children?: CategorySeedData[]
}

export const CATEGORIES_COMPLETE_SEED: CategorySeedData[] = [
  {
    name: "Filtry",
    slug: "filtry",
    description: "Filtry powietrza, hydrauliczne, oleju, paliwa, kabinowe, Adblue, klimatyzacji",
    priority: 1,
    children: [
      { name: "Filtry powietrza", slug: "filtry-powietrza", priority: 1 },
      { name: "Filtry hydrauliczne", slug: "filtry-hydrauliczne", priority: 2 },
      { name: "Filtry oleju", slug: "filtry-oleju", priority: 3 },
      { name: "Filtry paliwa", slug: "filtry-paliwa", priority: 4 },
      { name: "Filtry kabinowe", slug: "filtry-kabinowe", priority: 5 },
      { name: "Filtry Adblue", slug: "filtry-adblue", priority: 6 },
      { name: "Filtry klimatyzacji", slug: "filtry-klimatyzacji", priority: 7 },
      { name: "Filtry odpowietrzające", slug: "filtry-odpowietrzajace", priority: 8 },
    ],
  },
  {
    name: "Silnik Części & Osprzęt Silnika",
    slug: "silnik-czesci-osprzet-silnika",
    description: "Uszczelki, rozrząd, tłoki, korbowody, pompy, wtryski, bloki silnika",
    priority: 2,
    children: [
      { name: "Zestawy uszczelek na silnik i uszczelki", slug: "zestawy-uszczelek-na-silnik", priority: 1 },
      { name: "Uszczelki pod głowicę", slug: "uszczelki-pod-glowice", priority: 2 },
      { name: "Uszczelniacze wału korbowego", slug: "uszczelniacze-walu-korbowego", priority: 3 },
      { name: "Pozostałe uszczelki, uszczelniacze", slug: "pozostale-uszczelki-uszczelniacze", priority: 4 },
      { name: "Rozrząd, napinacze rozrządu, koła", slug: "rozrzad-napinacze-rozrzadu-kola", priority: 5 },
      { name: "Koła pasowe", slug: "kola-pasowe", priority: 6 },
      { name: "Paski klinowe", slug: "paski-klinowe", priority: 7 },
      { name: "Tłoki do silnika", slug: "tloki-do-silnika", priority: 8 },
      { name: "Pierścienie tłokowe, sworznie tłokowe itp", slug: "pierscienie-tlokowe-sworznie-tlokowe", priority: 9 },
      { name: "Tuleje cylindra", slug: "tuleje-cylindra", priority: 10 },
      { name: "Korbowody", slug: "korbowody", priority: 11 },
      { name: "Wały napędowe", slug: "waly-napedowe", priority: 12 },
      { name: "Panewki główne i panewki korbowodowe", slug: "panewki-glowne-panewki-korbowodowe", priority: 13 },
      { name: "Wieńce koła zamachowego i koła zamachowe", slug: "wience-kola-zamachowego-kola-zamachowe", priority: 14 },
      { name: "Głowice silnika", slug: "glowice-silnika", priority: 15 },
      { name: "Zawory, prowadnice zaworowe, popychacze", slug: "zawory-prowadnice-zaworowe-popychacze", priority: 16 },
      { name: "Pompy wtryskowe", slug: "pompy-wtryskowe", priority: 17 },
      { name: "Wtryski, końcówki wtrysków, sekcje pomp wtryskowych", slug: "wtryski-koncowki-sekcje-pomp", priority: 18 },
      { name: "Pompki paliwa (podawcze)", slug: "pompki-paliwa-podawcze", priority: 19 },
      { name: "Pompy oleju silnikowego", slug: "pompy-oleju-silnikowego", priority: 20 },
      { name: "Rurki paliwowe", slug: "rurki-paliwowe", priority: 21 },
      { name: "Cewki gaszenia", slug: "cewki-gaszenia", priority: 22 },
      { name: "Bloki silnika", slug: "bloki-silnika", priority: 23 },
      { name: "Termostaty", slug: "termostaty", priority: 24 },
      { name: "Tłumiki", slug: "tlumiki", priority: 25 },
      { name: "Poduszki pod silnik", slug: "poduszki-pod-silnik", priority: 26 },
      { name: "Inne części silnikowe", slug: "inne-czesci-silnikowe", priority: 27 },
    ],
  },
  {
    name: "Układ Hamulcowy",
    slug: "uklad-hamulcowy",
    description: "Klocki, tarcze, pompy, przewody hamulcowe",
    priority: 3,
    children: [
      { name: "Klocki hamulcowe", slug: "klocki-hamulcowe", priority: 1 },
      { name: "Pompki hamulcowe", slug: "pompki-hamulcowe", priority: 2 },
      { name: "Przewody hamulcowe, węże hamulcowe", slug: "przewody-hamulcowe-weze-hamulcowe", priority: 3 },
      { name: "Tarcze hamulcowe", slug: "tarcze-hamulcowe", priority: 4 },
      { name: "Okładziny hamulcowe", slug: "okladziny-hamulcowe", priority: 5 },
      { name: "Zbiorniczki płynu hamulcowego", slug: "zbiorniczki-plynu-hamulcowego", priority: 6 },
      { name: "Uszczelki", slug: "uszczelki-hamulcowe", priority: 7 },
      { name: "Tarczki hamulcowe", slug: "tarczki-hamulcowe", priority: 8 },
    ],
  },
  {
    name: "Podwozia do Maszyn Budowlanych",
    slug: "podwozia-do-maszyn-budowlanych",
    description: "Gąsienice, rolki, napinacze, zwolnice, reduktory jazdy",
    priority: 4,
    children: [
      { name: "Koła napinające do koparek", slug: "kola-napinajace-do-koparek", priority: 1 },
      { name: "Koła napędowe do koparek", slug: "kola-napedowe-do-koparek", priority: 2 },
      { name: "Gąsienice gumowe do koparek", slug: "gasienice-gumowe-do-koparek", priority: 3 },
      { name: "Koła napędowe do maszyn budowlanych", slug: "kola-napedowe-do-maszyn-budowlanych", priority: 4 },
      { name: "Rolki górne do koparek", slug: "rolki-gorne-do-koparek", priority: 5 },
      { name: "Rolki dolne (jezdne) do koparek", slug: "rolki-dolne-jezdne-do-koparek", priority: 6 },
      { name: "Ślizgi / Osłony", slug: "slizgi-oslony", priority: 7 },
      {
        name: "Napinacze gąsienicy do koparek",
        slug: "napinacze-gasienicy-do-koparek",
        priority: 8,
        children: [
          { name: "Uszczelki napinacza gąsienicy", slug: "uszczelki-napinacza-gasienicy", priority: 1 },
          { name: "Tłoki do napinacza gąsienicy", slug: "tloki-do-napinacza-gasienicy", priority: 2 },
          { name: "Zawory smarne kalamitki napinacza gąsienicy", slug: "zawory-smarne-kalamitki-napinacza", priority: 3 },
        ],
      },
      { name: "Płytki gąsienicy stopy gąsienicy do koparek", slug: "plytki-gasienicy-stopy-gasienicy", priority: 9 },
      { name: "Śruby i nakrętki", slug: "sruby-i-nakretki", priority: 10 },
      { name: "Nakładki gumowe na płytki", slug: "nakladki-gumowe-na-plytki", priority: 11 },
      { name: "Łańcuchy gąsienicy, gąsienice stalowe", slug: "lancuchy-gasienicy-gasienice-stalowe", priority: 12 },
      {
        name: "Zwolnice",
        slug: "zwolnice",
        priority: 13,
        children: [
          {
            name: "Reduktory jazdy",
            slug: "reduktory-jazdy",
            priority: 1,
            children: [
              { name: "Kompletne reduktory jazdy", slug: "kompletne-reduktory-jazdy", priority: 1 },
              { name: "Części do reduktorów jazdy", slug: "czesci-do-reduktorow-jazdy", priority: 2 },
            ],
          },
          {
            name: "Silniki jazdy",
            slug: "silniki-jazdy",
            priority: 2,
            children: [
              { name: "Kompletne silniki jazdy", slug: "kompletne-silniki-jazdy", priority: 1 },
              { name: "Części do silników jazdy", slug: "czesci-do-silnikow-jazdy", priority: 2 },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Układ Hydrauliczny",
    slug: "uklad-hydrauliczny",
    description: "Pompy, regulatory, rozdzielacze, siłowniki, zawory hydrauliczne",
    priority: 5,
    children: [
      {
        name: "Pompy hydrauliczne",
        slug: "pompy-hydrauliczne",
        priority: 1,
        children: [
          {
            name: "Części do pomp hydraulicznych",
            slug: "czesci-do-pomp-hydraulicznych",
            priority: 1,
            children: [
              { name: "Bieżnie tłoczków", slug: "bieznia-tlocznikow", priority: 1 },
              { name: "Kołyski", slug: "kolyski", priority: 2 },
              { name: "Kule", slug: "kule", priority: 3 },
              { name: "Sprężyny", slug: "sprezyny", priority: 4 },
              { name: "Separatory tłoczków", slug: "separatory-tlocznikow", priority: 5 },
            ],
          },
          { name: "Cylindry do pomp hydraulicznych", slug: "cylindry-do-pomp-hydraulicznych", priority: 2 },
          { name: "Tłoczki do pomp hydraulicznych", slug: "tloczki-do-pomp-hydraulicznych", priority: 3 },
          { name: "Tarcze cierne i rozdzielcze", slug: "tarcze-cierne-i-rozdzielcze", priority: 4 },
          { name: "Łożyska do pomp hydraulicznych", slug: "lozyska-do-pomp-hydraulicznych", priority: 5 },
          { name: "Uszczelki i zestawy uszczelek", slug: "uszczelki-i-zestawy-uszczelek", priority: 6 },
          { name: "Pozostałe części do pomp hydraulicznych", slug: "pozostale-czesci-do-pomp-hydraulicznych", priority: 7 },
        ],
      },
      { name: "Regulatory i sterowniki", slug: "regulatory-i-sterowniki", priority: 2 },
      { name: "Pompy pilota i doładowcze", slug: "pompy-pilota-i-doladowcze", priority: 3 },
      { name: "Pompy zębate", slug: "pompy-zebate", priority: 4 },
      { name: "Pompy tłoczkowe", slug: "pompy-tloczkowee", priority: 5 },
      { name: "Pompy łopatkowe", slug: "pompy-lopatkowe", priority: 6 },
      { name: "Elektrozawory", slug: "elektrozawory", priority: 7 },
      { name: "Cewki", slug: "cewki", priority: 8 },
      {
        name: "Rozdzielacze hydrauliczne",
        slug: "rozdzielacze-hydrauliczne",
        priority: 9,
        children: [
          { name: "Suwaki do rozdzielaczy", slug: "suwaki-do-rozdzielaczy", priority: 1 },
          { name: "Uszczelki do rozdzielaczy", slug: "uszczelki-do-rozdzielaczy", priority: 2 },
          { name: "Zawory do rozdzielaczy", slug: "zawory-do-rozdzielaczy", priority: 3 },
          { name: "Cewki i elektrozawory do rozdzielaczy", slug: "cewki-i-elektrozawory-do-rozdzielaczy", priority: 4 },
          { name: "Czujniki do rozdzielaczy", slug: "czujniki-do-rozdzielaczy", priority: 5 },
        ],
      },
      {
        name: "Siłowniki hydrauliczne",
        slug: "silowniki-hydrauliczne",
        priority: 10,
        children: [
          { name: "Uszczelki do silownikow hydraulicznych", slug: "uszczelki-do-silownikow-hydraulicznych", priority: 1 },
          { name: "Tloczyskaado silownikow, korpusy", slug: "tloczyskaado-silownikow-korpusy", priority: 2 },
          { name: "Dławice do silownikow", slug: "dławice-do-silownikow-hyd", priority: 3 },
          { name: "Tuleje i lozyska do silownikow", slug: "tuleje-i-lozyska-do-silownikow", priority: 4 },
        ],
      },
      { name: "Zawory hydrauliczne", slug: "zawory-hydrauliczne", priority: 11 },
      { name: "Zebatki do koparek", slug: "zebatki-do-koparek", priority: 12 },
      { name: "Silniki jazdy, silnik napedowe", slug: "silniki-jazdy-silnik-napedowe", priority: 13 },
      {
        name: "Obrot / Kolumny obrotu",
        slug: "obrot-kolumny-obrotu",
        priority: 14,
        children: [
          {
            name: "Silniki obrotu",
            slug: "silniki-obrotu",
            priority: 1,
            children: [
              { name: "Kompletne silniki obrotu", slug: "kompletne-silniki-obrotu", priority: 1 },
              { name: "Czesci do silnikow obrotu", slug: "czesci-do-silnikow-obrotu", priority: 2 },
            ],
          },
          { name: "Walki obrotu do koparek", slug: "walki-obrotu-do-koparek", priority: 2 },
          { name: "Uszczelki do silnikow obrotu", slug: "uszczelki-do-silnikow-obrotu", priority: 3 },
          {
            name: "Reduktory obrotu",
            slug: "reduktory-obrotu",
            priority: 4,
            children: [
              { name: "Kompletne reduktory obrotu", slug: "kompletne-reduktory-obrotu", priority: 1 },
              { name: "Czesci do reduktorow obrotu", slug: "czesci-do-reduktorow-obrotu", priority: 2 },
              { name: "Uszczelki reduktorow", slug: "uszczelki-reduktorow", priority: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Smarowanie",
    slug: "smarowanie",
    description: "Oleje silnikowe, hydrauliczne, smary, elementy smarne",
    priority: 6,
    children: [
      { name: "Oleje silnikowe", slug: "oleje-silnikowe", priority: 1 },
      { name: "Oleje hydrauliczne", slug: "oleje-hydrauliczne", priority: 2 },
      { name: "Oleje do mostow i zwolnic", slug: "oleje-do-mostow-i-zwolnic", priority: 3 },
      { name: "Oleje do skrzyn biegow", slug: "oleje-do-skrzyn-biegow", priority: 4 },
      { name: "Smary", slug: "smary", priority: 5 },
      { name: "Elementy smarne, kalamitki", slug: "elementy-smarne-kalamitki", priority: 6 },
    ],
  },
  {
    name: "Układ Chłodzenia",
    slug: "uklad-chlodzenia",
    description: "Chłodnice, pompy wody, termostaty, wentylatory",
    priority: 7,
    children: [
      { name: "Chłodnice", slug: "chlodnice", priority: 1 },
      { name: "Pompy wody", slug: "pompy-wody", priority: 2 },
      { name: "Termostaty", slug: "termostaty-chlodzenia", priority: 3 },
      { name: "Wentylatory", slug: "wentylatory", priority: 4 },
      { name: "Weze do chlodnic wody", slug: "weze-do-chlodnic-wody", priority: 5 },
      { name: "Zbiorniki wyrownawcze plynu", slug: "zbiorniki-wyrownawcze-plynu", priority: 6 },
      { name: "Kompresory", slug: "kompresory", priority: 7 },
      { name: "Osuszacze", slug: "osuszacze", priority: 8 },
      { name: "Pozostale", slug: "pozostale-chlodzenie", priority: 9 },
    ],
  },
  {
    name: "Układ Jezdny",
    slug: "uklad-jezdny",
    description: "Felgi, mosty, półosie, wałki, łożyska, amortyzatory",
    priority: 8,
    children: [
      { name: "Felgi", slug: "felgi", priority: 1 },
      { name: "Mosty", slug: "mosty", priority: 2 },
      { name: "Czesci do zwolnic, kola zebate, kola sloneczne", slug: "czesci-do-zwolnic-kola-zebate", priority: 3 },
      { name: "Polosie w moscie i zwolnicy", slug: "polosie-w-moscie-i-zwolnicy", priority: 4 },
      { name: "Walki atakujace i kola talerzowe", slug: "walki-atakujace-i-kola-talerzowe", priority: 5 },
      { name: "Uszczelniacze do zwolnic", slug: "uszczelniacze-do-zwolnic", priority: 6 },
      { name: "Uszczelniacze polosii", slug: "uszczelniacze-polosii", priority: 7 },
      { name: "Sworznie, lozyska i uszczelniacze do zwrotnic", slug: "sworznie-lozyska-uszczelniacze-zwrotnic", priority: 8 },
      { name: "Odbojniki mostu", slug: "odbojniki-mostu", priority: 9 },
      { name: "Sworznie do mostow", slug: "sworznie-do-mostow", priority: 10 },
      { name: "Drazki kierownicze", slug: "drazki-kierownicze", priority: 11 },
      { name: "Flansze", slug: "flansze", priority: 12 },
      { name: "Krzyzaki walu napedowego", slug: "krzyzaki-walu-napedowego", priority: 13 },
      { name: "Krzyzaki polosii", slug: "krzyzaki-polosii", priority: 14 },
      { name: "Lozyska", slug: "lozyska", priority: 15 },
      { name: "Piasty", slug: "piasty", priority: 16 },
      { name: "Szpilki", slug: "szpilki", priority: 17 },
      { name: "Waly napedowe", slug: "waly-napedowe-jezdny", priority: 18 },
      { name: "Tarczki cierne i przekladki", slug: "tarczki-cierne-i-przekladki", priority: 19 },
      { name: "Amortyzatory gumowe, odbojniki", slug: "amortyzatory-gumowe-odbojniki", priority: 20 },
    ],
  },
  {
    name: "Elektryka",
    slug: "elektryka",
    description: "Alternatory, rozruszniki, czujniki, przełączniki, akumulatory",
    priority: 9,
    children: [
      { name: "Alternatory", slug: "alternatory", priority: 1 },
      { name: "Rozruszniki", slug: "rozruszniki", priority: 2 },
      { name: "Regulatory napiecia", slug: "regulatory-napiecia", priority: 3 },
      { name: "Bezpieczniki", slug: "bezpieczniki", priority: 4 },
      { name: "Cewki gaszenia", slug: "cewki-gaszenia-elektryka", priority: 5 },
      { name: "Czujniki", slug: "czujniki", priority: 6 },
      { name: "Przelaczniki", slug: "przelaczniki", priority: 7 },
      { name: "Przekazniki", slug: "przekazniki", priority: 8 },
      { name: "Stacyjki", slug: "stacyjki", priority: 9 },
      { name: "Liczniki", slug: "liczniki", priority: 10 },
      { name: "Wskazniki", slug: "wskazniki", priority: 11 },
      { name: "Kluczyki", slug: "kluczyki", priority: 12 },
      { name: "Akumulatory", slug: "akumulatory", priority: 13 },
      { name: "Joysticki", slug: "joysticki", priority: 14 },
      { name: "Diody", slug: "diody", priority: 15 },
      { name: "Dzwignie", slug: "dzwignie", priority: 16 },
      { name: "Sterowniki", slug: "sterowniki", priority: 17 },
    ],
  },
  {
    name: "Slizgi",
    slug: "slizgi",
    description: "Podkładki do ślizgów, ślizgi wysięgnika, ślizgi na stabilizatory",
    priority: 10,
    children: [
      { name: "Podkladki do slizgow", slug: "podkladki-do-slizgow", priority: 1 },
      { name: "Slizgi wysiegnika ramienia, teleskopu", slug: "slizgi-wysiegnika-ramienia-teleskopu", priority: 2 },
      { name: "Slizgi na stabilizatory", slug: "slizgi-na-stabilizatory", priority: 3 },
    ],
  },
  {
    name: "Elementy Obrotu i Ramion",
    slug: "elementy-obrotu-i-ramion",
    description: "Tuleje ramienia, sworznie, uszczelki, zabezpieczenia",
    priority: 11,
    children: [
      { name: "Tuleje ramienia", slug: "tuleje-ramienia", priority: 1 },
      { name: "Sworznie ramienia", slug: "sworznie-ramienia", priority: 2 },
      { name: "Uszczelki tulei", slug: "uszczelki-tulei", priority: 3 },
      { name: "Zabezpieczenia sworni", slug: "zabezpieczenia-sworni", priority: 4 },
      { name: "Podkladki dystansowe", slug: "podkladki-dystansowe", priority: 5 },
    ],
  },
  {
    name: "Nadwozie",
    slug: "nadwozie",
    description: "Szyby, drzwi, błotniki, klamki, lusterka, lampy",
    priority: 12,
    children: [
      { name: "Szyby", slug: "szyby", priority: 1 },
      { name: "Drzwi", slug: "drzwi", priority: 2 },
      { name: "Blotniki", slug: "blotniki", priority: 3 },
      { name: "Klamki", slug: "klamki", priority: 4 },
      { name: "Lusterka", slug: "lusterka", priority: 5 },
      { name: "Zamki, wkladki zamkow", slug: "zamki-wkladki-zamkow", priority: 6 },
      { name: "Wycieraczki, ramiona wycieraczek, silniki wycieraczek", slug: "wycieraczki-ramiona-wycieraczek", priority: 7 },
      { name: "Pokrywy silnika, oslony", slug: "pokrywy-silnika-oslony", priority: 8 },
      { name: "Lampy przednie, lampy tylne, halogeny", slug: "lampy-przednie-lampy-tylne-halogeny", priority: 9 },
      { name: "Odbojniki, zatrzaski", slug: "odbojniki-zatrzaski", priority: 10 },
      { name: "Kierunkowskazy", slug: "kierunkowskazy", priority: 11 },
      { name: "Przyciski, wlaczniki", slug: "przyciski-wlaczniki", priority: 12 },
      { name: "Nagrzewnice", slug: "nagrzewnice", priority: 13 },
      { name: "Naklejki", slug: "naklejki", priority: 14 },
      { name: "Amortyzatory do szyb, drzwi, pokryw", slug: "amortyzatory-do-szyb-drzwi-pokryw", priority: 15 },
    ],
  },
  {
    name: "Akcesoria",
    slug: "akcesoria",
    description: "Bagnety, dyski, łączniki, śruby, obejmy, węże",
    priority: 13,
    children: [
      { name: "Bagnety", slug: "bagnety", priority: 1 },
      { name: "Dyski", slug: "dyski", priority: 2 },
      { name: "Laczniki", slug: "laczniki", priority: 3 },
      { name: "Sruby", slug: "sruby", priority: 4 },
      { name: "Obejmy", slug: "obejmy", priority: 5 },
      { name: "Nakretki", slug: "nakretki", priority: 6 },
      { name: "Opaski", slug: "opaski", priority: 7 },
      { name: "Klemy", slug: "klemy", priority: 8 },
      { name: "Weze", slug: "weze", priority: 9 },
      { name: "Zaslepki", slug: "zaslepki", priority: 10 },
      { name: "Zatyczki", slug: "zatyczki", priority: 11 },
      { name: "Rurki", slug: "rurki", priority: 12 },
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
 * Get total count of categories
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

/**
 * Get maximum nesting depth
 */
export function getMaxDepth(categories: CategorySeedData[], currentDepth: number = 0): number {
  let maxDepth = currentDepth
  for (const category of categories) {
    if (category.children && category.children.length > 0) {
      const childDepth = getMaxDepth(category.children, currentDepth + 1)
      maxDepth = Math.max(maxDepth, childDepth)
    }
  }
  return maxDepth
}

/**
 * Verify category structure integrity
 */
export function verifyCategoryStructure(categories: CategorySeedData[]): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  const slugs = new Set<string>()

  function validateRecursive(cats: CategorySeedData[], depth: number = 0) {
    for (const category of cats) {
      if (slugs.has(category.slug)) {
        errors.push(`Duplicate slug found: "${category.slug}"`)
      }
      slugs.add(category.slug)

      if (!category.name || !category.slug) {
        errors.push(`Category missing name or slug: ${JSON.stringify(category)}`)
      }

      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category.slug)) {
        errors.push(`Invalid slug format (must be kebab-case): "${category.slug}"`)
      }

      if (depth > 5) {
        warnings.push(`Deep nesting detected at slug "${category.slug}" (depth: ${depth})`)
      }

      if (category.children && category.children.length > 0) {
        validateRecursive(category.children, depth + 1)
      }
    }
  }

  validateRecursive(categories)

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

// Export statistics
export const CATEGORY_STATS = {
  mainCategories: CATEGORIES_COMPLETE_SEED.length,
  totalCategories: getCategoryCount(CATEGORIES_COMPLETE_SEED),
  maxDepth: getMaxDepth(CATEGORIES_COMPLETE_SEED),
}

/**
 * Seed execution function
 */
export async function seedCategories(categoryService: any): Promise<{
  success: boolean
  created: number
  errors: string[]
}> {
  const errors: string[] = []
  let created = 0

  try {
    const verification = verifyCategoryStructure(CATEGORIES_COMPLETE_SEED)
    if (!verification.valid) {
      return {
        success: false,
        created: 0,
        errors: verification.errors,
      }
    }

    const flatCategories = flattenCategories(CATEGORIES_COMPLETE_SEED)

    for (const categoryData of flatCategories) {
      try {
        const existing = await categoryService.findBySlug(categoryData.slug)
        if (existing) {
          console.log(`Category already exists: ${categoryData.slug}`)
          continue
        }

        await categoryService.create({
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          priority: categoryData.priority || 0,
          parent_id: categoryData.parent_id,
        })

        created++
        console.log(`Created category: ${categoryData.name} (${categoryData.slug})`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        errors.push(`Failed to create category "${categoryData.slug}": ${errorMessage}`)
        console.error(`Error creating category ${categoryData.slug}:`, error)
      }
    }

    try {
      await categoryService.rebuildCache()
      console.log("Cache rebuilt successfully")
    } catch (error) {
      console.warn("Warning: Failed to rebuild cache after seeding", error)
    }

    return {
      success: errors.length === 0,
      created,
      errors,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      created,
      errors: [errorMessage],
    }
  }
}
