-- Import kategorii z kat.md do bazy danych
-- Główne kategorie (10 najważniejszych)

-- Główne kategorie
INSERT INTO product_category (id, name, handle, description, mpath, is_active, is_internal, rank, metadata, created_at, updated_at)
VALUES 
('pcat_hydraulika', 'Hydraulika & Osprzęt Hydrauliczny', 'hydraulika-osprzet', 'Pompy, silniki, zawory, cylindry hydrauliczne - 40% sprzedaży', 'pcat_hydraulika.', true, false, 1, '{"icon": "💧", "priority": true, "sales_percentage": 40}', NOW(), NOW()),
('pcat_podwozia', 'Podwozia & Gąsienice', 'podwozia-gasienice', 'Podwozia gąsienicowe, kołowe, gąsienice gumowe', 'pcat_podwozia.', true, false, 2, '{"icon": "🚜"}', NOW(), NOW()),
('pcat_silnik', 'Silnik & Osprzęt Silnika', 'silnik-osprzet', 'Silniki spalinowe, turbosprężarki, filtry, układy chłodzenia', 'pcat_silnik.', true, false, 3, '{"icon": "⚙️"}', NOW(), NOW()),
('pcat_skrzynia', 'Skrzynia biegów & Przeniesienie', 'skrzynia-biegow-przeniesienie', 'Skrzynie biegów, sprzęgła, wałki napędowe', 'pcat_skrzynia.', true, false, 4, '{"icon": "⚡"}', NOW(), NOW()),
('pcat_elektryka', 'Elektryka & Elektronika', 'elektryka-elektronika', 'Silniki elektryczne, przetworniki, oświetlenie, baterie', 'pcat_elektryka.', true, false, 5, '{"icon": "🔌"}', NOW(), NOW()),
('pcat_obrotu', 'Element obrotu & Ramiona', 'element-obrotu-ramiona', 'Pierścienie obrotu, łożyska, ramiona wysięgnika', 'pcat_obrotu.', true, false, 6, '{"icon": "🔄"}', NOW(), NOW()),
('pcat_filtry', 'Filtry & Uszczelnienia', 'filtry-uszczelnienia', 'Filtry powietrza, paliwa, oleju, hydrauliczne, uszczelnienia - 35% sprzedaży', 'pcat_filtry.', true, false, 7, '{"icon": "🔍", "priority": true, "sales_percentage": 35}', NOW(), NOW()),
('pcat_nadwozie', 'Nadwozie & Oprawa', 'nadwozie-oprawa', 'Kabiny, drzwi, szyby, osłony', 'pcat_nadwozie.', true, false, 8, '{"icon": "🚪"}', NOW(), NOW()),
('pcat_osprzet', 'Osprzęt & Wymienne części robocze', 'osprzet-wymienne-czesci', 'Łyżki, młoty hydrauliczne, wiertła, kompaktory', 'pcat_osprzet.', true, false, 9, '{"icon": "🪣"}', NOW(), NOW()),
('pcat_normalia', 'Normalia warsztatowe', 'normalia-warsztatowe', 'Śruby, nakrętki, podkładki, kołki', 'pcat_normalia.', true, false, 10, '{"icon": "🔩"}', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- Podkategorie Hydrauliki
INSERT INTO product_category (id, name, handle, description, mpath, parent_category_id, is_active, is_internal, rank, created_at, updated_at)
VALUES 
('pcat_pompy_hyd', 'Pompy hydrauliczne', 'pompy-hydrauliczne', 'Pompy tłokowe, zębate, śrubowe, PAW', 'pcat_hydraulika.pcat_pompy_hyd.', 'pcat_hydraulika', true, false, 1, NOW(), NOW()),
('pcat_silniki_hyd', 'Silniki hydrauliczne', 'silniki-hydrauliczne', 'Silniki obrotowe, siłowniki liniowe i teleskopowe', 'pcat_hydraulika.pcat_silniki_hyd.', 'pcat_hydraulika', true, false, 2, NOW(), NOW()),
('pcat_zawory_hyd', 'Zawory hydrauliczne', 'zawory-hydrauliczne', 'Zawory zwrotne, ciśnieniowe, kierunkowe, przepływu', 'pcat_hydraulika.pcat_zawory_hyd.', 'pcat_hydraulika', true, false, 3, NOW(), NOW()),
('pcat_cylindry_hyd', 'Cylindry hydrauliczne', 'cylindry-hydrauliczne', 'Cylindry ryzeru, wysięgnika, ruchów bocznych', 'pcat_hydraulika.pcat_cylindry_hyd.', 'pcat_hydraulika', true, false, 4, NOW(), NOW()),
('pcat_waz_hyd', 'Wąż hydrauliczny & Złączki', 'waz-hydrauliczny-zlaczki', 'Węże tłoczne, ssące, sterowania, złączki', 'pcat_hydraulika.pcat_waz_hyd.', 'pcat_hydraulika', true, false, 5, NOW(), NOW()),
('pcat_zbiorniki_hyd', 'Zbiorniki hydrauliczne', 'zbiorniki-hydrauliczne', 'Zbiorniki 50L-500L+', 'pcat_hydraulika.pcat_zbiorniki_hyd.', 'pcat_hydraulika', true, false, 6, NOW(), NOW()),
('pcat_filtry_hyd', 'Filtry hydrauliczne', 'filtry-hydrauliczne', 'HF, HG, HH - różne mikronacje', 'pcat_hydraulika.pcat_filtry_hyd.', 'pcat_hydraulika', true, false, 7, NOW(), NOW()),
('pcat_plyny_hyd', 'Płyny hydrauliczne', 'plyny-hydrauliczne', 'HYDO 68, 46, 32, ISO VG', 'pcat_hydraulika.pcat_plyny_hyd.', 'pcat_hydraulika', true, false, 8, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  parent_category_id = EXCLUDED.parent_category_id,
  mpath = EXCLUDED.mpath,
  updated_at = NOW();

-- Podkategorie Podwozia
INSERT INTO product_category (id, name, handle, description, mpath, parent_category_id, is_active, is_internal, rank, created_at, updated_at)
VALUES 
('pcat_gasienice', 'Gąsienice gumowe', 'gasienice-gumowe', 'Gąsienice do koparek różnych marek', 'pcat_podwozia.pcat_gasienice.', 'pcat_podwozia', true, false, 1, NOW(), NOW()),
('pcat_podwozia_kolowe', 'Podwozia kołowe', 'podwozia-kolowe', 'Koła do koparek kołowych', 'pcat_podwozia.pcat_podwozia_kolowe.', 'pcat_podwozia', true, false, 2, NOW(), NOW()),
('pcat_czesci_podwozia', 'Części podwozia', 'czesci-podwozia', 'Bolce, pierścienie, łączniki', 'pcat_podwozia.pcat_czesci_podwozia.', 'pcat_podwozia', true, false, 3, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  parent_category_id = EXCLUDED.parent_category_id,
  mpath = EXCLUDED.mpath,
  updated_at = NOW();

-- Podkategorie Silnika
INSERT INTO product_category (id, name, handle, description, mpath, parent_category_id, is_active, is_internal, rank, created_at, updated_at)
VALUES 
('pcat_silniki_spalinowe', 'Silniki spalinowe', 'silniki-spalinowe', 'Silniki Perkins, Caterpillar, Yammer, Mitsubishi, Volvo', 'pcat_silnik.pcat_silniki_spalinowe.', 'pcat_silnik', true, false, 1, NOW(), NOW()),
('pcat_turbosprezarki', 'Turbosprężarki', 'turbosprezarki', 'Turbo do różnych marek silników', 'pcat_silnik.pcat_turbosprezarki.', 'pcat_silnik', true, false, 2, NOW(), NOW()),
('pcat_filtry_powietrza', 'Filtry powietrza', 'filtry-powietrza', 'Filtry główne, wstępne, kabinowe', 'pcat_silnik.pcat_filtry_powietrza.', 'pcat_silnik', true, false, 3, NOW(), NOW()),
('pcat_uklad_paliwowy', 'Układ paliwowy', 'uklad-paliwowy', 'Filtry paliwa, pompy, wtryski, przewody', 'pcat_silnik.pcat_uklad_paliwowy.', 'pcat_silnik', true, false, 4, NOW(), NOW()),
('pcat_filtry_oleju', 'Filtry oleju & Serwis', 'filtry-oleju-serwis', 'Filtry oleju, oleje, środki czyszczące', 'pcat_silnik.pcat_filtry_oleju.', 'pcat_silnik', true, false, 5, NOW(), NOW()),
('pcat_uklad_chlodzenia', 'Układ chłodzenia', 'uklad-chlodzenia', 'Termostaty, pompy wody, chłodnice', 'pcat_silnik.pcat_uklad_chlodzenia.', 'pcat_silnik', true, false, 6, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  parent_category_id = EXCLUDED.parent_category_id,
  mpath = EXCLUDED.mpath,
  updated_at = NOW();

-- Podkategorie Filtrów
INSERT INTO product_category (id, name, handle, description, mpath, parent_category_id, is_active, is_internal, rank, created_at, updated_at)
VALUES 
('pcat_filtry_all', 'Filtry', 'filtry', 'Wszystkie typy filtrów', 'pcat_filtry.pcat_filtry_all.', 'pcat_filtry', true, false, 1, NOW(), NOW()),
('pcat_uszczelnienia', 'Uszczelnienia', 'uszczelnienia', 'O-ringi, pierścienie, uszczelki', 'pcat_filtry.pcat_uszczelnienia.', 'pcat_filtry', true, false, 2, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  parent_category_id = EXCLUDED.parent_category_id,
  mpath = EXCLUDED.mpath,
  updated_at = NOW();

SELECT COUNT(*) as "Liczba kategorii" FROM product_category WHERE deleted_at IS NULL;
SELECT name, handle, parent_category_id FROM product_category WHERE deleted_at IS NULL AND parent_category_id IS NULL ORDER BY rank;
