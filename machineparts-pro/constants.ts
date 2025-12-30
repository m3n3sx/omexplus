// Data is now fetched via services/medusaService.ts
// This file is kept empty or for future configuration constants
export const APP_CONFIG = {
    API_VERSION: "v1",
    MEDUSA_BACKEND_URL: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
};

export const PART_CATEGORIES = [
  // Filtry
  'Filtry',
  'Filtr oleju',
  'Filtr paliwa',
  'Filtr powietrza',
  'Filtr hydrauliczny',
  'Filtr kabinowy',
  // Silnik
  'Silnik',
  'Układ paliwowy',
  'Układ chłodzenia',
  'Turbosprężarka',
  'Rozrząd',
  'Uszczelki silnika',
  // Hydraulika
  'Hydraulika',
  'Pompy hydrauliczne',
  'Rozdzielacze',
  'Siłowniki',
  'Węże hydrauliczne',
  'Uszczelki hydrauliczne',
  // Podwozie / Gąsienice
  'Podwozie',
  'Gąsienice',
  'Rolki jezdne',
  'Koła napędowe',
  'Koła napinające',
  'Ogniwa gąsienic',
  // Elektryka
  'Elektryka',
  'Rozruszniki',
  'Alternatory',
  'Czujniki',
  'Oświetlenie',
  'Instalacja elektryczna',
  // Kabina
  'Kabina',
  'Klimatyzacja',
  'Ogrzewanie',
  'Wycieraczki',
  'Lusterka',
  'Fotele',
  // Układ hamulcowy
  'Hamulce',
  'Tarcze hamulcowe',
  'Klocki hamulcowe',
  // Skrzynia biegów / Przekładnia
  'Skrzynia biegów',
  'Przekładnia',
  'Sprzęgło',
  // Osprzęt / Łyżki
  'Osprzęt',
  'Łyżki',
  'Ząb łyżki',
  'Adaptery',
  'Noże tnące',
  // Części zużyciowe
  'Części zużyciowe',
  'Sworznie',
  'Tuleje',
  'Łożyska',
  // Uszczelnienia
  'Uszczelki',
  'O-ringi',
  'Simmeringi',
  // Inne
  'Inne'
];
