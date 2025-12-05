# ⚡ CMS - Szybki Start (5 minut)

## 🎯 Co dostałeś?

Pełny system CMS jak WordPress - edytuj wszystko przez panel!

## 🚀 Uruchomienie (3 komendy)

```bash
# 1. Inicjalizuj bazę danych
npm run init-cms

# 2. Uruchom backend
npm run dev

# 3. Uruchom panel (nowy terminal)
cd admin-dashboard
npm run dev
```

## 🎨 Otwórz Panel

**Panel CMS:** http://localhost:3001/cms

**Demo strona:** http://localhost:3000/pl/cms-demo

## 📝 Pierwsze kroki

### 1. Dodaj swój pierwszy element

1. Otwórz http://localhost:3001/cms
2. Kliknij **"+ Dodaj Element"**
3. Wypełnij:
   - Key: `my-hero`
   - Typ: `hero`
   - Nazwa: `Mój Hero`
   - Zawartość:
     ```json
     {
       "title": "Witaj!",
       "subtitle": "To jest mój CMS"
     }
     ```
4. Kliknij **"Zapisz"**

### 2. Użyj na frontendzie

W dowolnym komponencie:

```typescript
import DynamicSection from '@/components/cms/DynamicSection'

<DynamicSection sectionKey="my-hero" locale="pl" />
```

### 3. Gotowe! 🎉

Twój element się pojawi i możesz go edytować przez panel!

## 🎯 Co możesz edytować?

✅ **Header** - Logo, menu, wyszukiwarka  
✅ **Footer** - Copyright, linki, social media  
✅ **Menu** - Wszystkie menu nawigacyjne  
✅ **Hero** - Główne sekcje z tytułami  
✅ **Sekcje** - Dowolne sekcje treści  
✅ **Teksty** - Pojedyncze teksty  
✅ **Przyciski** - CTA buttons  
✅ **Bannery** - Promocje, ogłoszenia  

## 📚 Dokumentacja

- **CMS_INSTRUKCJA_PL.md** - Pełna instrukcja
- **CMS_README.md** - Dokumentacja techniczna
- **CMS_SETUP_GUIDE.md** - Przewodnik (EN)

## 🔧 Komponenty gotowe do użycia

```typescript
// Dynamiczny header
import DynamicHeader from '@/components/cms/DynamicHeader'
<DynamicHeader locale="pl" />

// Dynamiczny footer
import DynamicFooter from '@/components/cms/DynamicFooter'
<DynamicFooter locale="pl" />

// Dowolna sekcja
import DynamicSection from '@/components/cms/DynamicSection'
<DynamicSection sectionKey="twoj-key" locale="pl" />
```

## 💡 Przykłady

### Hero Section

**Panel CMS:**
```json
{
  "key": "home-hero",
  "type": "hero",
  "content": {
    "title": "Części do Maszyn",
    "subtitle": "Najlepsza jakość",
    "backgroundImage": "/hero.jpg"
  }
}
```

**Frontend:**
```typescript
<DynamicSection sectionKey="home-hero" locale="pl" />
```

### Menu

**Panel:** `/cms/menus`
1. Dodaj menu "main-menu"
2. Dodaj pozycje: Home, Products, Contact

**Frontend:**
```typescript
<DynamicHeader locale="pl" />
```

Menu automatycznie się pojawi!

## 🌍 Języki

System wspiera:
- `pl` - Polski
- `en` - English
- `de` - Deutsch
- `uk` - Українська

## 🆘 Problemy?

### Nie widzę elementów?

```bash
# Sprawdź czy backend działa
npm run dev

# Sprawdź czy tabele istnieją
npm run init-cms

# Testuj API
npm run test-cms
```

### Błąd 404?

- Backend musi działać na porcie 9000
- Sprawdź `NEXT_PUBLIC_MEDUSA_BACKEND_URL` w `.env`

### Nie mogę zapisać?

- Sprawdź czy wszystkie pola są wypełnione
- Key musi być unikalny
- Sprawdź logi backendu

## ✅ Checklist

- [ ] Uruchomiłem `npm run init-cms`
- [ ] Backend działa (`npm run dev`)
- [ ] Panel działa (`cd admin-dashboard && npm run dev`)
- [ ] Otworzyłem http://localhost:3001/cms
- [ ] Dodałem pierwszy element
- [ ] Użyłem na frontendzie
- [ ] Działa! 🎉

## 🎯 Następne kroki

1. Przeczytaj **CMS_INSTRUKCJA_PL.md**
2. Zobacz demo: http://localhost:3000/pl/cms-demo
3. Dodaj swoje elementy
4. Edytuj przez panel
5. Ciesz się CMS-em! 🚀

---

**Gotowe w 5 minut!** ⚡
