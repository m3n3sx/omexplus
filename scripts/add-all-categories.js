/**
 * Script to add all 13 main categories with subcategories via API
 * Run: node scripts/add-all-categories.js
 */

const BACKEND_URL = 'http://localhost:9000';

const categories = [
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
      { name: "Płytki gąsienicy stopy gąsienicy do koparek", slug: "plytki-gasienicy-stopy-gasienicy", priority: 8 },
      { name: "Śruby i nakrętki", slug: "sruby-i-nakretki", priority: 9 },
      { name: "Nakładki gumowe na płytki", slug: "nakladki-gumowe-na-plytki", priority: 10 },
      { name: "Łańcuchy gąsienicy, gąsienice stalowe", slug: "lancuchy-gasienicy-gasienice-stalowe", priority: 11 },
    ],
  },
  {
    name: "Układ Hydrauliczny",
    slug: "uklad-hydrauliczny",
    description: "Pompy, regulatory, rozdzielacze, siłowniki, zawory hydrauliczne",
    priority: 5,
    children: [
      { name: "Regulatory i sterowniki", slug: "regulatory-i-sterowniki", priority: 1 },
      { name: "Pompy pilota i doładowcze", slug: "pompy-pilota-i-doladowcze", priority: 2 },
      { name: "Pompy zębate", slug: "pompy-zebate", priority: 3 },
      { name: "Pompy tłoczkowe", slug: "pompy-tloczkowee", priority: 4 },
      { name: "Pompy łopatkowe", slug: "pompy-lopatkowe", priority: 5 },
      { name: "Elektrozawory", slug: "elektrozawory", priority: 6 },
      { name: "Cewki", slug: "cewki", priority: 7 },
      { name: "Zawory hydrauliczne", slug: "zawory-hydrauliczne", priority: 8 },
      { name: "Zębatki do koparek", slug: "zebatki-do-koparek", priority: 9 },
      { name: "Silniki jazdy, silnik napędowe", slug: "silniki-jazdy-silnik-napedowe", priority: 10 },
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
      { name: "Oleje do mostów i zwolnic", slug: "oleje-do-mostow-i-zwolnic", priority: 3 },
      { name: "Oleje do skrzyń biegów", slug: "oleje-do-skrzyn-biegow", priority: 4 },
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
      { name: "Węże do chłodnic wody", slug: "weze-do-chlodnic-wody", priority: 5 },
      { name: "Zbiorniki wyrównawcze płynu", slug: "zbiorniki-wyrownawcze-plynu", priority: 6 },
      { name: "Kompresory", slug: "kompresory", priority: 7 },
      { name: "Osuszacze", slug: "osuszacze", priority: 8 },
      { name: "Pozostałe", slug: "pozostale-chlodzenie", priority: 9 },
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
      { name: "Części do zwolnic, koła zębate, koła słoneczne", slug: "czesci-do-zwolnic-kola-zebate", priority: 3 },
      { name: "Półosie w moście i zwolnicy", slug: "polosie-w-moscie-i-zwolnicy", priority: 4 },
      { name: "Wałki atakujące i koła talerzowe", slug: "walki-atakujace-i-kola-talerzowe", priority: 5 },
      { name: "Uszczelniacze do zwolnic", slug: "uszczelniacze-do-zwolnic", priority: 6 },
      { name: "Uszczelniacze półosi", slug: "uszczelniacze-polosii", priority: 7 },
      { name: "Sworznie, łożyska i uszczelniacze do zwrotnic", slug: "sworznie-lozyska-uszczelniacze-zwrotnic", priority: 8 },
      { name: "Odbojniki mostu", slug: "odbojniki-mostu", priority: 9 },
      { name: "Sworznie do mostów", slug: "sworznie-do-mostow", priority: 10 },
      { name: "Drążki kierownicze", slug: "drazki-kierownicze", priority: 11 },
      { name: "Flansze", slug: "flansze", priority: 12 },
      { name: "Krzyżaki wału napędowego", slug: "krzyzaki-walu-napedowego", priority: 13 },
      { name: "Krzyżaki półosi", slug: "krzyzaki-polosii", priority: 14 },
      { name: "Łożyska", slug: "lozyska", priority: 15 },
      { name: "Piasty", slug: "piasty", priority: 16 },
      { name: "Szpilki", slug: "szpilki", priority: 17 },
      { name: "Wały napędowe", slug: "waly-napedowe-jezdny", priority: 18 },
      { name: "Tarczki cierne i przekładki", slug: "tarczki-cierne-i-przekladki", priority: 19 },
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
      { name: "Regulatory napięcia", slug: "regulatory-napiecia", priority: 3 },
      { name: "Bezpieczniki", slug: "bezpieczniki", priority: 4 },
      { name: "Cewki gaszenia", slug: "cewki-gaszenia-elektryka", priority: 5 },
      { name: "Czujniki", slug: "czujniki", priority: 6 },
      { name: "Przełączniki", slug: "przelaczniki", priority: 7 },
      { name: "Przekaźniki", slug: "przekazniki", priority: 8 },
      { name: "Stacyjki", slug: "stacyjki", priority: 9 },
      { name: "Liczniki", slug: "liczniki", priority: 10 },
      { name: "Wskaźniki", slug: "wskazniki", priority: 11 },
      { name: "Kluczyki", slug: "kluczyki", priority: 12 },
      { name: "Akumulatory", slug: "akumulatory", priority: 13 },
      { name: "Joysticki", slug: "joysticki", priority: 14 },
      { name: "Diody", slug: "diody", priority: 15 },
      { name: "Dźwignie", slug: "dzwignie", priority: 16 },
      { name: "Sterowniki", slug: "sterowniki", priority: 17 },
    ],
  },
  {
    name: "Ślizgi",
    slug: "slizgi",
    description: "Podkładki do ślizgów, ślizgi wysięgnika, ślizgi na stabilizatory",
    priority: 10,
    children: [
      { name: "Podkładki do ślizgów", slug: "podkladki-do-slizgow", priority: 1 },
      { name: "Ślizgi wysięgnika ramienia, teleskopu", slug: "slizgi-wysiegnika-ramienia-teleskopu", priority: 2 },
      { name: "Ślizgi na stabilizatory", slug: "slizgi-na-stabilizatory", priority: 3 },
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
      { name: "Podkładki dystansowe", slug: "podkladki-dystansowe", priority: 5 },
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
      { name: "Błotniki", slug: "blotniki", priority: 3 },
      { name: "Klamki", slug: "klamki", priority: 4 },
      { name: "Lusterka", slug: "lusterka", priority: 5 },
      { name: "Zamki, wkładki zamków", slug: "zamki-wkladki-zamkow", priority: 6 },
      { name: "Wycieraczki, ramiona wycieraczek, silniki wycieraczek", slug: "wycieraczki-ramiona-wycieraczek", priority: 7 },
      { name: "Pokrywy silnika, osłony", slug: "pokrywy-silnika-oslony", priority: 8 },
      { name: "Lampy przednie, lampy tylne, halogeny", slug: "lampy-przednie-lampy-tylne-halogeny", priority: 9 },
      { name: "Odbojniki, zatrzaski", slug: "odbojniki-zatrzaski", priority: 10 },
      { name: "Kierunkowskazy", slug: "kierunkowskazy", priority: 11 },
      { name: "Przyciski, włączniki", slug: "przyciski-wlaczniki", priority: 12 },
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
      { name: "Łączniki", slug: "laczniki", priority: 3 },
      { name: "Śruby", slug: "sruby", priority: 4 },
      { name: "Obejmy", slug: "obejmy", priority: 5 },
      { name: "Nakrętki", slug: "nakretki", priority: 6 },
      { name: "Opaski", slug: "opaski", priority: 7 },
      { name: "Klemy", slug: "klemy", priority: 8 },
      { name: "Węże", slug: "weze", priority: 9 },
      { name: "Zaślepki", slug: "zaslepki", priority: 10 },
      { name: "Zatyczki", slug: "zatyczki", priority: 11 },
      { name: "Rurki", slug: "rurki", priority: 12 },
    ],
  },
];

async function createCategory(categoryData, parentId = null) {
  try {
    const response = await fetch(`${BACKEND_URL}/admin/omex-categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description || '',
        priority: categoryData.priority || 0,
        parent_id: parentId,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Failed to create ${categoryData.name}: ${error}`);
      return null;
    }

    const result = await response.json();
    console.log(`✅ Created: ${categoryData.name}`);
    return result.category;
  } catch (error) {
    console.error(`❌ Error creating ${categoryData.name}:`, error.message);
    return null;
  }
}

async function seedCategories() {
  console.log('🚀 Starting category seeding...\n');
  
  let created = 0;
  let failed = 0;

  for (const mainCategory of categories) {
    console.log(`\n📁 Creating main category: ${mainCategory.name}`);
    
    const parent = await createCategory(mainCategory);
    if (!parent) {
      failed++;
      continue;
    }
    created++;

    if (mainCategory.children && mainCategory.children.length > 0) {
      console.log(`  └─ Creating ${mainCategory.children.length} subcategories...`);
      
      for (const child of mainCategory.children) {
        const subcategory = await createCategory(child, parent.id);
        if (subcategory) {
          created++;
        } else {
          failed++;
        }
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✨ Seeding completed!');
  console.log(`✅ Created: ${created} categories`);
  console.log(`❌ Failed: ${failed} categories`);
  console.log('='.repeat(60));
}

seedCategories().catch(console.error);
