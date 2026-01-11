/**
 * Skrypt automatycznego przypisywania produktów do kategorii
 * Na podstawie nazwy i opisu produktu
 */

import { Client } from "pg"

const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost/medusa_db"

// Mapowanie słów kluczowych -> kategoria
// Kolejność ma znaczenie - bardziej szczegółowe wzorce najpierw
const CATEGORY_RULES: Array<{ keywords: string[], categoryId: string, priority: number }> = [
  // Filtry
  { keywords: ['filtr powietrza', 'filtr powietrzny'], categoryId: 'pcat_filtry_powietrza', priority: 10 },
  { keywords: ['filtr hydraul', 'filtr oleju hydraul'], categoryId: 'pcat_filtry_hydrauliczne', priority: 10 },
  { keywords: ['filtr oleju', 'filtr olejowy'], categoryId: 'pcat_filtry_oleju', priority: 10 },
  { keywords: ['filtr paliwa', 'filtr paliwowy'], categoryId: 'pcat_filtry_paliwa', priority: 10 },
  { keywords: ['filtr kabin', 'filtr klimatyzacji'], categoryId: 'pcat_filtry_kabinowe', priority: 10 },
  { keywords: ['filtr adblue'], categoryId: 'pcat_filtry_adblue', priority: 10 },
  { keywords: ['filtr odpowietrz'], categoryId: 'pcat_filtry_odpowietrzajace', priority: 10 },
  { keywords: ['filtr'], categoryId: 'pcat_filtry', priority: 5 },

  // Silniki jazdy i obrotu
  { keywords: ['wałek silnika jazdy', 'walek silnika jazdy', 'travel motor shaft'], categoryId: 'pcat_czesci_silnikow_jazdy', priority: 15 },
  { keywords: ['wałek silnika obrotu', 'walek silnika obrotu', 'swing motor shaft', 'silnika hydraulicznego obrotu'], categoryId: 'pcat_czesci_silnikow_obrotu', priority: 15 },
  { keywords: ['wałek obrotu', 'walek obrotu'], categoryId: 'pcat_czesci_silnikow_obrotu', priority: 12 },
  { keywords: ['silnik jazdy', 'silnik napędowy'], categoryId: 'pcat_silniki_jazdy_hyd', priority: 10 },
  { keywords: ['silnik obrotu'], categoryId: 'pcat_silniki_obrotu_main', priority: 10 },
  { keywords: ['reduktor jazdy'], categoryId: 'pcat_reduktory_jazdy', priority: 10 },
  { keywords: ['reduktor obrotu'], categoryId: 'pcat_reduktory_obrotu_main', priority: 10 },
  { keywords: ['zwolnica', 'obudowa zwolnicy'], categoryId: 'pcat_zwolnice', priority: 10 },
  { keywords: ['wieniec obrotu', 'łożysko obrotu'], categoryId: 'pcat_obrot', priority: 10 },

  // Pompy
  { keywords: ['pompa hydraul', 'pompa tłoczkowa', 'pompa zębata', 'pompa łopatkowa'], categoryId: 'pcat_pompy_hyd', priority: 10 },
  { keywords: ['pompa wody', 'pompa wodna'], categoryId: 'pcat_pompy_wody', priority: 10 },
  { keywords: ['pompa oleju'], categoryId: 'pcat_pompy_oleju', priority: 10 },
  { keywords: ['pompa wtryskowa'], categoryId: 'pcat_pompy_wtryskowe', priority: 10 },
  { keywords: ['pompka paliwa', 'pompa paliwa', 'pompa podawcza'], categoryId: 'pcat_pompki_paliwa', priority: 10 },
  { keywords: ['pompa pilota', 'pompa doładowcza'], categoryId: 'pcat_pompy_pilota', priority: 10 },
  { keywords: ['pompka hamulc'], categoryId: 'pcat_pompki_hamulcowe', priority: 10 },

  // Siłowniki
  { keywords: ['siłownik', 'silownik', 'cylinder hydraul'], categoryId: 'pcat_silowniki_hyd', priority: 10 },
  { keywords: ['tłoczysko', 'tloczysko'], categoryId: 'pcat_tloczyska', priority: 10 },
  { keywords: ['dławica', 'dlawica'], categoryId: 'pcat_dlawice', priority: 10 },

  // Rozdzielacze
  { keywords: ['rozdzielacz'], categoryId: 'pcat_rozdzielacze_hyd', priority: 10 },
  { keywords: ['suwak rozdzielacza', 'suwak do rozdzielacza'], categoryId: 'pcat_suwaki', priority: 10 },
  { keywords: ['elektrozawór', 'elektrozawor'], categoryId: 'pcat_elektrozawory_hyd', priority: 10 },

  // Zawory
  { keywords: ['zawór hydraul', 'zawor hydraul'], categoryId: 'pcat_zawory_hyd', priority: 10 },
  { keywords: ['zawór', 'zawor'], categoryId: 'pcat_zawory', priority: 5 },

  // Uszczelki i uszczelniacze
  { keywords: ['uszczelka tłoka', 'uszczelka tloka', 'uszczelka siłownika', 'uszczelka silownika'], categoryId: 'pcat_uszczelki_silownikow', priority: 12 },
  { keywords: ['uszczelka pompy', 'zestaw uszczelek pompy'], categoryId: 'pcat_uszczelki_pomp', priority: 12 },
  { keywords: ['uszczelka rozdzielacza'], categoryId: 'pcat_uszczelki_rozdzielaczy', priority: 12 },
  { keywords: ['uszczelniacz półosi', 'uszczelniacz polosii'], categoryId: 'pcat_uszczelniacze_polosii', priority: 12 },
  { keywords: ['uszczelniacz zwolnicy'], categoryId: 'pcat_uszczelniacze_zwolnic', priority: 12 },
  { keywords: ['uszczelka tulei'], categoryId: 'pcat_uszczelki_tulei', priority: 12 },
  { keywords: ['uszczelka hamulc'], categoryId: 'pcat_uszczelki_ham', priority: 12 },
  { keywords: ['uszczelka', 'oring', 'o-ring', 'simering', 'simmering'], categoryId: 'pcat_uszczelki_pomp', priority: 5 },

  // Mosty i zwolnice
  { keywords: ['most', 'mostu'], categoryId: 'pcat_mosty', priority: 8 },
  { keywords: ['półoś', 'polos', 'półosi'], categoryId: 'pcat_polosie', priority: 10 },
  { keywords: ['wałek atakujący', 'walek atakujacy', 'koło talerzowe', 'kolo talerzowe'], categoryId: 'pcat_walki_atakujace', priority: 10 },
  { keywords: ['tarcza cierna', 'tarczka cierna'], categoryId: 'pcat_tarczki_cierne', priority: 10 },
  { keywords: ['piasta'], categoryId: 'pcat_piasty', priority: 10 },
  { keywords: ['flansza', 'kołnierz'], categoryId: 'pcat_flansze', priority: 10 },

  // Podwozie
  { keywords: ['gąsienica', 'gasienica'], categoryId: 'pcat_podwozia', priority: 10 },
  { keywords: ['napinacz gąsienicy', 'napinacz gasienicy'], categoryId: 'pcat_napinacze', priority: 10 },
  { keywords: ['koło napędowe', 'kolo napedowe', 'zębatka', 'zebatka'], categoryId: 'pcat_zebatki', priority: 10 },
  { keywords: ['rolka', 'rolki'], categoryId: 'pcat_podwozia', priority: 8 },

  // Ramię i wysięgnik
  { keywords: ['tuleja ramienia', 'tulejka ramienia'], categoryId: 'pcat_tuleje_ramienia', priority: 10 },
  { keywords: ['sworzeń ramienia', 'sworznia ramienia', 'sworzen ramienia'], categoryId: 'pcat_sworznie_ramienia', priority: 10 },
  { keywords: ['ślizg wysięgnika', 'slizg wysiegnika', 'ślizg ramienia'], categoryId: 'pcat_slizgi_wysiegnika', priority: 10 },
  { keywords: ['ślizg', 'slizg'], categoryId: 'pcat_slizgi', priority: 8 },
  { keywords: ['tuleja', 'tulejka'], categoryId: 'pcat_tuleje_ramienia', priority: 5 },
  { keywords: ['sworzeń', 'sworzen'], categoryId: 'pcat_sworznie_ramienia', priority: 5 },

  // Zwrotnica
  { keywords: ['zwrotnica', 'zwrotnicy'], categoryId: 'pcat_sworznie_zwrotnic', priority: 10 },

  // Elektryka
  { keywords: ['alternator'], categoryId: 'pcat_alternatory', priority: 10 },
  { keywords: ['rozrusznik'], categoryId: 'pcat_rozruszniki', priority: 10 },
  { keywords: ['czujnik'], categoryId: 'pcat_czujniki', priority: 10 },
  { keywords: ['przekaźnik', 'przekaznik'], categoryId: 'pcat_przekazniki', priority: 10 },
  { keywords: ['przełącznik', 'przelacznik'], categoryId: 'pcat_przelaczniki', priority: 10 },
  { keywords: ['stacyjka'], categoryId: 'pcat_stacyjki', priority: 10 },
  { keywords: ['kluczyk'], categoryId: 'pcat_kluczyki', priority: 10 },
  { keywords: ['joystick'], categoryId: 'pcat_joysticki', priority: 10 },
  { keywords: ['cewka gaszenia'], categoryId: 'pcat_cewki_gaszenia_el', priority: 10 },
  { keywords: ['cewka'], categoryId: 'pcat_cewki_hyd', priority: 8 },
  { keywords: ['bezpiecznik'], categoryId: 'pcat_bezpieczniki', priority: 10 },
  { keywords: ['akumulator'], categoryId: 'pcat_akumulatory', priority: 10 },

  // Silnik spalinowy
  { keywords: ['tłok silnika', 'tlok silnika', 'zestaw tłok'], categoryId: 'pcat_silnik', priority: 10 },
  { keywords: ['korbowód', 'korbowod'], categoryId: 'pcat_silnik', priority: 10 },
  { keywords: ['wał korbowy', 'wal korbowy'], categoryId: 'pcat_silnik', priority: 10 },
  { keywords: ['panewka', 'panewki'], categoryId: 'pcat_panewki', priority: 10 },
  { keywords: ['głowica silnika', 'glowica silnika'], categoryId: 'pcat_glowice', priority: 10 },
  { keywords: ['wtrysk', 'wtryskiwacz'], categoryId: 'pcat_wtryski', priority: 10 },
  { keywords: ['turbo', 'turbosprężarka', 'turbosprezarka'], categoryId: 'pcat_silnik', priority: 10 },
  { keywords: ['pasek klinowy', 'pasek rozrządu'], categoryId: 'pcat_silnik', priority: 10 },
  { keywords: ['termostat'], categoryId: 'pcat_termostaty_chl', priority: 10 },
  { keywords: ['tłumik'], categoryId: 'pcat_tlumiki', priority: 10 },

  // Chłodzenie
  { keywords: ['chłodnica', 'chlodnica'], categoryId: 'pcat_chlodnice', priority: 10 },
  { keywords: ['wentylator'], categoryId: 'pcat_wentylatory', priority: 10 },
  { keywords: ['wąż chłodnicy', 'waz chlodnicy', 'przewód chłodniczy'], categoryId: 'pcat_weze_chlodnic', priority: 10 },
  { keywords: ['zbiornik wyrównawczy', 'zbiornik wyrownawczy'], categoryId: 'pcat_zbiorniki_wyrownawcze', priority: 10 },

  // Hamulce
  { keywords: ['klocek hamulc', 'klocki hamulc'], categoryId: 'pcat_klocki', priority: 10 },
  { keywords: ['tarcza hamulc'], categoryId: 'pcat_tarcze_hamulcowe', priority: 10 },
  { keywords: ['okładzina hamulc', 'okladzina hamulc'], categoryId: 'pcat_okladziny', priority: 10 },
  { keywords: ['przewód hamulc', 'wąż hamulc'], categoryId: 'pcat_przewody_hamulcowe', priority: 10 },
  { keywords: ['hamulc'], categoryId: 'pcat_hamulcowy', priority: 5 },

  // Nadwozie
  { keywords: ['szyba', 'szybę'], categoryId: 'pcat_nadwozie', priority: 8 },
  { keywords: ['drzwi'], categoryId: 'pcat_nadwozie', priority: 8 },
  { keywords: ['błotnik', 'blotnik'], categoryId: 'pcat_blotniki', priority: 10 },
  { keywords: ['amortyzator szyby', 'amortyzator drzwi', 'amortyzator pokrywy'], categoryId: 'pcat_amortyzatory_szyb', priority: 10 },
  { keywords: ['amortyzator gumowy', 'odbojnik'], categoryId: 'pcat_amortyzatory_gumowe', priority: 10 },
  { keywords: ['lusterko', 'lustro'], categoryId: 'pcat_nadwozie', priority: 8 },
  { keywords: ['fotel', 'siedzenie'], categoryId: 'pcat_nadwozie', priority: 8 },

  // Łożyska
  { keywords: ['łożysko', 'lozysko'], categoryId: 'pcat_lozyska_jezdny', priority: 8 },

  // Wały
  { keywords: ['wał napędowy', 'wal napedowy', 'krzyżak wału'], categoryId: 'pcat_waly_napedowe_jezdny', priority: 10 },
  { keywords: ['krzyżak', 'krzyzak'], categoryId: 'pcat_krzyzaki_walu', priority: 10 },

  // Drążki kierownicze
  { keywords: ['drążek kierowniczy', 'drazek kierowniczy', 'końcówka drążka'], categoryId: 'pcat_drazki_kierownicze', priority: 10 },

  // Oleje i smary
  { keywords: ['olej silnikowy'], categoryId: 'pcat_oleje_silnikowe', priority: 10 },
  { keywords: ['olej hydrauliczny'], categoryId: 'pcat_oleje_hydrauliczne', priority: 10 },
  { keywords: ['olej przekładniowy', 'olej do skrzyni'], categoryId: 'pcat_oleje_skrzyn', priority: 10 },
  { keywords: ['smar'], categoryId: 'pcat_smary', priority: 10 },
  { keywords: ['kalamitka', 'smarowniczka'], categoryId: 'pcat_elementy_smarne', priority: 10 },

  // Koła zębate
  { keywords: ['koło zębate', 'kolo zebate', 'koło słoneczne', 'kolo sloneczne', 'satelita'], categoryId: 'pcat_czesci_zwolnic', priority: 10 },

  // Podkładki i elementy złączne
  { keywords: ['podkładka dystansowa', 'podkladka dystansowa'], categoryId: 'pcat_podkladki_dystansowe', priority: 10 },
  { keywords: ['podkładka', 'podkladka'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['nakrętka', 'nakretka'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['szpilka koła', 'szpilka kola'], categoryId: 'pcat_szpilki', priority: 10 },
  { keywords: ['szpilka'], categoryId: 'pcat_szpilki', priority: 8 },
  { keywords: ['seger', 'pierścień osadczy'], categoryId: 'pcat_akcesoria', priority: 5 },

  // Skrzynia biegów
  { keywords: ['skrzynia biegów', 'skrzyni biegów', 'skrzynia'], categoryId: 'pcat_akcesoria', priority: 6 },

  // Lemiesze i łyżki
  { keywords: ['lemiesz', 'nóż lemiesza'], categoryId: 'pcat_akcesoria', priority: 8 },
  { keywords: ['łyżka', 'lyzka', 'zęby łyżki'], categoryId: 'pcat_akcesoria', priority: 8 },

  // Koło napinające i podwozie
  { keywords: ['koło napinające', 'kolo napinajace'], categoryId: 'pcat_podwozia', priority: 10 },

  // Zbiorniki i korki
  { keywords: ['zbiornik paliwa'], categoryId: 'pcat_nadwozie', priority: 8 },
  { keywords: ['zbiornik płynu', 'zbiornik spryskiwaczy'], categoryId: 'pcat_nadwozie', priority: 8 },
  { keywords: ['korek wlewu paliwa', 'korek zbiornika'], categoryId: 'pcat_nadwozie', priority: 8 },

  // Zawias i pokrywy
  { keywords: ['zawias', 'pokrywa silnika'], categoryId: 'pcat_nadwozie', priority: 8 },

  // Wieniec i sprzęgło
  { keywords: ['wieniec koła zamachowego', 'koło zamachowe'], categoryId: 'pcat_wience', priority: 10 },
  { keywords: ['sprzęgło', 'sprzeglo', 'wkład elastyczny sprzęgła'], categoryId: 'pcat_silnik', priority: 8 },

  // Wskaźniki i liczniki
  { keywords: ['wskaźnik', 'wskaznik'], categoryId: 'pcat_wskazniki', priority: 10 },
  { keywords: ['licznik'], categoryId: 'pcat_liczniki', priority: 10 },

  // Linka sterowania
  { keywords: ['linka sterowania', 'linka gazu', 'cięgno'], categoryId: 'pcat_akcesoria', priority: 8 },

  // Uszczelnienia ogólne
  { keywords: ['uszczelnienie olejowe', 'uszczelnienie'], categoryId: 'pcat_uszczelki_pomp', priority: 6 },

  // Zestaw naprawczy silnika
  { keywords: ['zestaw naprawczy silnika', 'zestaw uszczelek silnika'], categoryId: 'pcat_silnik', priority: 10 },

  // Ogólne kategorie (niski priorytet)
  { keywords: ['hydraul'], categoryId: 'pcat_hydrauliczny', priority: 3 },
  { keywords: ['elektr'], categoryId: 'pcat_elektryka', priority: 3 },
  
  // Dodatkowe reguły
  { keywords: ['amortyzator pod silnik', 'poduszka pod silnik'], categoryId: 'pcat_poduszki_silnik', priority: 10 },
  { keywords: ['amortyzator gazowy', 'amortyzator'], categoryId: 'pcat_amortyzatory_gumowe', priority: 6 },
  { keywords: ['aktuator'], categoryId: 'pcat_hydrauliczny', priority: 8 },
  { keywords: ['łącznik drążka', 'lacznik drazka'], categoryId: 'pcat_drazki_kierownicze', priority: 10 },
  { keywords: ['linka obrotomierza'], categoryId: 'pcat_akcesoria', priority: 8 },
  { keywords: ['blacha'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['blokada sworznia', 'blokada zęba'], categoryId: 'pcat_akcesoria', priority: 8 },
  { keywords: ['chlapacz'], categoryId: 'pcat_nadwozie', priority: 8 },
  { keywords: ['cylinder'], categoryId: 'pcat_silnik', priority: 5 },
  { keywords: ['komplet uszczelek', 'zestaw uszczelek'], categoryId: 'pcat_uszczelki_pomp', priority: 8 },
  { keywords: ['tłok kompletny', 'tlok kompletny', 'tłok silnika'], categoryId: 'pcat_silnik', priority: 10 },
  { keywords: ['poduszka'], categoryId: 'pcat_poduszki_silnik', priority: 6 },
  { keywords: ['szybkozłącze', 'szybkozlacze'], categoryId: 'pcat_akcesoria', priority: 8 },
  { keywords: ['przekładka', 'przekladka'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['śruba pompy', 'sruba pompy'], categoryId: 'pcat_akcesoria', priority: 6 },
  { keywords: ['śruba głowicy', 'sruba glowicy'], categoryId: 'pcat_silnik', priority: 8 },
  { keywords: ['śruba', 'sruba'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['przecinak'], categoryId: 'pcat_akcesoria', priority: 8 },
  { keywords: ['synchronizator'], categoryId: 'pcat_akcesoria', priority: 8 },
  
  // Więcej reguł
  { keywords: ['pióro wycieraczki', 'pioro wycieraczki', 'wycieraczka'], categoryId: 'pcat_nadwozie', priority: 8 },
  { keywords: ['wyłącznik masy', 'wylacznik masy'], categoryId: 'pcat_elektryka', priority: 10 },
  { keywords: ['zmiennik momentu', 'konwerter'], categoryId: 'pcat_akcesoria', priority: 8 },
  { keywords: ['zestaw uszczelniaczy'], categoryId: 'pcat_uszczelki_pomp', priority: 8 },
  { keywords: ['felga'], categoryId: 'pcat_felgi', priority: 10 },
  { keywords: ['koło pasowe', 'kolo pasowe'], categoryId: 'pcat_silnik', priority: 8 },
  { keywords: ['kolumna obrotu'], categoryId: 'pcat_obrot', priority: 10 },
  { keywords: ['kolano wydechu', 'kolano wydechowe'], categoryId: 'pcat_tlumiki', priority: 10 },
  { keywords: ['klamka'], categoryId: 'pcat_nadwozie', priority: 8 },
  { keywords: ['guma podpory', 'guma stabilizatora'], categoryId: 'pcat_amortyzatory_gumowe', priority: 10 },
  { keywords: ['jarzmo'], categoryId: 'pcat_czesci_reduktorow_obrotu', priority: 8 },
  { keywords: ['grzybek pompy'], categoryId: 'pcat_czesci_pomp', priority: 10 },
  { keywords: ['dyferencjał', 'dyferencjal', 'mechanizm różnicowy'], categoryId: 'pcat_mosty', priority: 10 },
  { keywords: ['dysk'], categoryId: 'pcat_tarczki_cierne', priority: 6 },
  { keywords: ['dźwignia', 'dzwignia'], categoryId: 'pcat_dzwignie', priority: 8 },
  { keywords: ['sprężyna sprzęgła', 'sprezyna sprzegla'], categoryId: 'pcat_silnik', priority: 8 },
  { keywords: ['sprężyna', 'sprezyna'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['element mocowania'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['symbol', 'naklejka', 'oznaczenie'], categoryId: 'pcat_nadwozie', priority: 5 },
  { keywords: ['opona'], categoryId: 'pcat_podwozia', priority: 8 },
  { keywords: ['dętka', 'detka'], categoryId: 'pcat_podwozia', priority: 8 },
  { keywords: ['ramię', 'ramie'], categoryId: 'pcat_elementy_obrotu', priority: 5 },
  { keywords: ['wysięgnik', 'wysiegnik'], categoryId: 'pcat_elementy_obrotu', priority: 5 },
  { keywords: ['stabilizator', 'łapa stabilizatora'], categoryId: 'pcat_nadwozie', priority: 6 },
  { keywords: ['osłona', 'oslona'], categoryId: 'pcat_nadwozie', priority: 5 },
  { keywords: ['obudowa'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['korpus'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['wkładka', 'wkladka'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['pierścień', 'pierscien'], categoryId: 'pcat_akcesoria', priority: 4 },
  
  // Ostatnie reguły
  { keywords: ['uszczelniacz wałka obrotu', 'uszczelniacz walka obrotu'], categoryId: 'pcat_uszczelki_silnikow_obrotu', priority: 12 },
  { keywords: ['uszczelniacz wałka silnika obrotu'], categoryId: 'pcat_uszczelki_silnikow_obrotu', priority: 12 },
  { keywords: ['uszczelniacz wałka', 'uszczelniacz walka'], categoryId: 'pcat_uszczelki_pomp', priority: 8 },
  { keywords: ['uszczelniacz'], categoryId: 'pcat_uszczelki_pomp', priority: 5 },
  { keywords: ['orbitrol', 'układ kierowniczy'], categoryId: 'pcat_hydrauliczny', priority: 10 },
  { keywords: ['zestaw rozrządu', 'rozrząd'], categoryId: 'pcat_silnik', priority: 10 },
  { keywords: ['wkład filtra'], categoryId: 'pcat_filtry', priority: 8 },
  { keywords: ['przewód', 'wąż'], categoryId: 'pcat_hydrauliczny', priority: 4 },
  { keywords: ['złącze', 'zlacze', 'przyłącze'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['zębnik', 'zebnik'], categoryId: 'pcat_czesci_zwolnic', priority: 8 },
  { keywords: ['tłoczek', 'tloczek'], categoryId: 'pcat_czesci_pomp', priority: 8 },
  { keywords: ['płyta', 'plyta'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['pokrywa'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['wspornik'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['uchwyt'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['mocowanie'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['adapter'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['redukcja'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['końcówka', 'koncowka'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['głowica', 'glowica'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['wałek', 'walek'], categoryId: 'pcat_akcesoria', priority: 3 },
  { keywords: ['korek'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['zatyczka'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['zaślepka', 'zaslepka'], categoryId: 'pcat_akcesoria', priority: 4 },
  
  // Finalne reguły
  { keywords: ['świeca żarowa', 'swieca zarowa'], categoryId: 'pcat_elektryka', priority: 10 },
  { keywords: ['świeca zapłonowa', 'swieca zaplonowa'], categoryId: 'pcat_elektryka', priority: 10 },
  { keywords: ['pierścienie tłokowe', 'pierscienie tlokowe'], categoryId: 'pcat_silnik', priority: 10 },
  { keywords: ['miarka oleju', 'bagnet oleju'], categoryId: 'pcat_bagnety', priority: 10 },
  { keywords: ['zestaw uszczelnień', 'komplet uszczelnień'], categoryId: 'pcat_uszczelki_pomp', priority: 8 },
  { keywords: ['komplet szpilek'], categoryId: 'pcat_szpilki', priority: 8 },
  { keywords: ['regulator obrotów'], categoryId: 'pcat_silnik', priority: 8 },
  { keywords: ['gaźnik', 'gaznik'], categoryId: 'pcat_silnik', priority: 8 },
  { keywords: ['membrana'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['sprężarka', 'sprezarka', 'kompresor'], categoryId: 'pcat_kompresory', priority: 10 },
  { keywords: ['klimatyzacja', 'klimatyzacji'], categoryId: 'pcat_kompresory', priority: 8 },
  { keywords: ['parownik'], categoryId: 'pcat_kompresory', priority: 8 },
  { keywords: ['skraplacz'], categoryId: 'pcat_kompresory', priority: 8 },
  { keywords: ['nagrzewnica'], categoryId: 'pcat_nadwozie', priority: 8 },
  { keywords: ['dmuchawa'], categoryId: 'pcat_nadwozie', priority: 8 },
  { keywords: ['reflektor', 'lampa', 'światło'], categoryId: 'pcat_elektryka', priority: 8 },
  { keywords: ['żarówka', 'zarowka'], categoryId: 'pcat_elektryka', priority: 8 },
  { keywords: ['wiązka przewodów', 'wiazka przewodow', 'instalacja elektryczna'], categoryId: 'pcat_elektryka', priority: 8 },
  { keywords: ['potencjometr'], categoryId: 'pcat_elektryka', priority: 8 },
  { keywords: ['włącznik', 'wlacznik'], categoryId: 'pcat_przelaczniki', priority: 8 },
  
  // Ostatnie reguły
  { keywords: ['miarka poziomu oleju', 'miarka oleju'], categoryId: 'pcat_bagnety', priority: 10 },
  { keywords: ['ząb', 'zab', 'zęby'], categoryId: 'pcat_akcesoria', priority: 6 },
  { keywords: ['rura wydechowa', 'rura wydechu'], categoryId: 'pcat_tlumiki', priority: 10 },
  { keywords: ['taśma', 'tasma'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['króciec', 'krociec'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['kołek', 'kolek'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['wpust'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['klin'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['tulejka'], categoryId: 'pcat_tuleje_ramienia', priority: 4 },
  { keywords: ['prowadnica'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['docisk'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['sprzęgło'], categoryId: 'pcat_silnik', priority: 5 },
  { keywords: ['tarcza'], categoryId: 'pcat_tarczki_cierne', priority: 4 },
  { keywords: ['wał', 'wal'], categoryId: 'pcat_akcesoria', priority: 3 },
  { keywords: ['koło', 'kolo'], categoryId: 'pcat_akcesoria', priority: 3 },
  
  // Finalne
  { keywords: ['pasek wielorowkowy', 'pasek klinowy', 'pasek'], categoryId: 'pcat_silnik', priority: 6 },
  { keywords: ['wyłącznik', 'wylacznik'], categoryId: 'pcat_przelaczniki', priority: 8 },
  { keywords: ['silnik wycieraczki'], categoryId: 'pcat_elektryka', priority: 10 },
  { keywords: ['pompa jazdy'], categoryId: 'pcat_pompy_hyd', priority: 10 },
  { keywords: ['zawleczka', 'zabezpieczenie'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['zacisk'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['obejma'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['opaska'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['klips'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['zatrzask'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['zamek'], categoryId: 'pcat_nadwozie', priority: 5 },
  { keywords: ['rączka', 'raczka'], categoryId: 'pcat_nadwozie', priority: 5 },
  { keywords: ['pedał', 'pedal'], categoryId: 'pcat_nadwozie', priority: 5 },
  { keywords: ['manetka'], categoryId: 'pcat_nadwozie', priority: 5 },
  { keywords: ['gałka', 'galka'], categoryId: 'pcat_nadwozie', priority: 5 },
  { keywords: ['panel'], categoryId: 'pcat_nadwozie', priority: 4 },
  { keywords: ['konsola'], categoryId: 'pcat_nadwozie', priority: 4 },
  { keywords: ['kratka'], categoryId: 'pcat_nadwozie', priority: 4 },
  { keywords: ['maskownica'], categoryId: 'pcat_nadwozie', priority: 4 },
  
  // Ostateczne
  { keywords: ['mata gumowa', 'wykładzina'], categoryId: 'pcat_nadwozie', priority: 8 },
  { keywords: ['reparaturka', 'zestaw naprawczy'], categoryId: 'pcat_akcesoria', priority: 6 },
  { keywords: ['zbiorniczek wyrównawczy'], categoryId: 'pcat_zbiorniki_wyrownawcze', priority: 10 },
  { keywords: ['wymiennik ciepła', 'wymiennik ciepla'], categoryId: 'pcat_chlodnice', priority: 10 },
  { keywords: ['odma silnika', 'odpowietrznik'], categoryId: 'pcat_silnik', priority: 8 },
  { keywords: ['intercooler'], categoryId: 'pcat_chlodnice', priority: 10 },
  { keywords: ['radiator'], categoryId: 'pcat_chlodnice', priority: 8 },
  { keywords: ['chłodnica oleju', 'chlodnica oleju'], categoryId: 'pcat_chlodnice', priority: 10 },
  { keywords: ['zbiornik'], categoryId: 'pcat_nadwozie', priority: 4 },
  { keywords: ['bak'], categoryId: 'pcat_nadwozie', priority: 4 },
  { keywords: ['kanister'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['wlew'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['kolanko'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['trójnik'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['reduktor'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['łącznik', 'lacznik'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['złączka', 'zlaczka'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['nypel', 'nipel'], categoryId: 'pcat_akcesoria', priority: 4 },
  
  // Finalne reguły
  { keywords: ['pompka podawcza'], categoryId: 'pcat_pompki_paliwa', priority: 10 },
  { keywords: ['klosz lampy', 'klosz'], categoryId: 'pcat_elektryka', priority: 8 },
  { keywords: ['linka'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['d-ring', 'ring'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['hak'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['oko'], categoryId: 'pcat_akcesoria', priority: 3 },
  { keywords: ['ucho'], categoryId: 'pcat_akcesoria', priority: 3 },
  { keywords: ['zaczep'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['bolec'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['trzpień', 'trzpien'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['popychacz'], categoryId: 'pcat_silnik', priority: 6 },
  { keywords: ['dźwigienka', 'dzwigienka'], categoryId: 'pcat_silnik', priority: 6 },
  { keywords: ['wahacz'], categoryId: 'pcat_silnik', priority: 6 },
  { keywords: ['rozrząd', 'rozrzad'], categoryId: 'pcat_silnik', priority: 6 },
  
  // Ostatnie
  { keywords: ['miska olejowa'], categoryId: 'pcat_silnik', priority: 10 },
  { keywords: ['grill', 'atrapa'], categoryId: 'pcat_nadwozie', priority: 8 },
  { keywords: ['szczotka węglowa', 'szczotka weglowa'], categoryId: 'pcat_elektryka', priority: 10 },
  { keywords: ['przegub'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['kołyska', 'kolyska'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['widły', 'widly'], categoryId: 'pcat_akcesoria', priority: 6 },
  { keywords: ['lemiesz'], categoryId: 'pcat_akcesoria', priority: 6 },
  { keywords: ['nóż', 'noz'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['ostrze'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['zgarniacz'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['skrobak'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['szczotka'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['pędzel', 'pedzel'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['sito'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['sitko'], categoryId: 'pcat_akcesoria', priority: 4 },
  { keywords: ['cedzak'], categoryId: 'pcat_akcesoria', priority: 4 },
  
  // Absolutnie ostatnie
  { keywords: ['konik'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['sanki'], categoryId: 'pcat_akcesoria', priority: 5 },
  { keywords: ['silnik wycieraczek', 'silnik wycieraczki'], categoryId: 'pcat_elektryka', priority: 10 },
  { keywords: ['zestaw podkładek'], categoryId: 'pcat_podkladki_dystansowe', priority: 8 },
  { keywords: ['odbój', 'odboj'], categoryId: 'pcat_amortyzatory_gumowe', priority: 6 },
  { keywords: ['guma', 'gumy'], categoryId: 'pcat_akcesoria', priority: 3 },
  { keywords: ['plastik'], categoryId: 'pcat_akcesoria', priority: 3 },
  { keywords: ['metal'], categoryId: 'pcat_akcesoria', priority: 3 },
  { keywords: ['stal'], categoryId: 'pcat_akcesoria', priority: 3 },
  { keywords: ['aluminium'], categoryId: 'pcat_akcesoria', priority: 3 },
  { keywords: ['mosiądz'], categoryId: 'pcat_akcesoria', priority: 3 },
  { keywords: ['miedź', 'miedz'], categoryId: 'pcat_akcesoria', priority: 3 },
]

function findBestCategory(title: string, description: string): string | null {
  const text = `${title} ${description}`.toLowerCase()
  
  let bestMatch: { categoryId: string, priority: number } | null = null
  
  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        if (!bestMatch || rule.priority > bestMatch.priority) {
          bestMatch = { categoryId: rule.categoryId, priority: rule.priority }
        }
        break // Znaleziono dopasowanie dla tej reguły
      }
    }
  }
  
  return bestMatch?.categoryId || null
}

async function assignCategories() {
  console.log("🏷️ Przypisuję produkty do kategorii...\n")

  const client = new Client({ connectionString: DATABASE_URL })
  await client.connect()

  // Pobierz istniejące kategorie
  const categoriesResult = await client.query(`
    SELECT id FROM product_category WHERE deleted_at IS NULL
  `)
  const validCategories = new Set(categoriesResult.rows.map(r => r.id))
  console.log(`Znaleziono ${validCategories.size} kategorii\n`)

  // Pobierz produkty bez kategorii lub wszystkie do ponownego przypisania
  const productsResult = await client.query(`
    SELECT p.id, p.title, p.description 
    FROM product p
    WHERE p.deleted_at IS NULL
  `)

  console.log(`Przetwarzam ${productsResult.rows.length} produktów...\n`)

  let assigned = 0
  let skipped = 0
  let noMatch = 0
  const categoryStats: Record<string, number> = {}

  for (const product of productsResult.rows) {
    const categoryId = findBestCategory(product.title || '', product.description || '')
    
    if (categoryId && validCategories.has(categoryId)) {
      // Sprawdź czy już przypisany do tej kategorii
      const existingResult = await client.query(`
        SELECT 1 FROM product_category_product 
        WHERE product_id = $1 AND product_category_id = $2
      `, [product.id, categoryId])
      
      if (existingResult.rows.length === 0) {
        // Przypisz do kategorii
        await client.query(`
          INSERT INTO product_category_product (product_id, product_category_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [product.id, categoryId])
        
        assigned++
        categoryStats[categoryId] = (categoryStats[categoryId] || 0) + 1
        
        if (assigned <= 10) {
          console.log(`✅ "${product.title.substring(0, 50)}..." → ${categoryId}`)
        } else if (assigned % 200 === 0) {
          console.log(`   Przypisano ${assigned} produktów...`)
        }
      } else {
        skipped++
      }
    } else {
      noMatch++
      if (noMatch <= 5) {
        console.log(`⚠️ Brak dopasowania: "${product.title.substring(0, 60)}..."`)
      }
    }
  }

  await client.end()

  console.log(`\n🏁 Zakończono!`)
  console.log(`   ✅ Przypisano: ${assigned} produktów`)
  console.log(`   ⏭️ Już przypisane: ${skipped}`)
  console.log(`   ❓ Bez dopasowania: ${noMatch}`)
  
  console.log(`\n📊 Top kategorie:`)
  const sortedStats = Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
  
  for (const [catId, count] of sortedStats) {
    console.log(`   ${catId}: ${count}`)
  }
}

assignCategories().catch(console.error)
