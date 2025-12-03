# 🚀 OMEX Storefront - Next.js 15

## ⚡ Szybki Start

```bash
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000)

---

## ✅ Status: SKLEP GOTOWY DO SPRZEDAŻY! 🛒

Frontend jest w 100% funkcjonalny i gotowy do przyjmowania zamówień!

### Co działa:
- ✅ Next.js 15
- ✅ Tailwind CSS 3.4
- ✅ Medusa API Integration
- ✅ TypeScript
- ✅ Mobile Responsive (100%)
- ✅ Internationalization (4 języki)
- ✅ **Zaawansowana Wyszukiwarka (5 metod)** 🔍
- ✅ **Koszyk i Checkout** 🛒
- ✅ **Płatności Stripe** 💳
- ✅ **Konta Użytkowników** 👤
- ✅ **Historia Zamówień** 📦
- ✅ **Wszystkie Podstrony** 📄

---

## 📚 Dokumentacja

### Przeczytaj najpierw:
- **SKLEP_GOTOWY.md** - Sklep gotowy do sprzedaży! ⭐⭐⭐
- **START_HERE.md** - Szybki start (30 sekund) ⭐
- **STRONY_NAPRAWIONE.md** - Wszystkie strony naprawione
- **WYSZUKIWARKA_PRZYWROCONA.md** - Zaawansowana wyszukiwarka
- **../URUCHOM_FRONTEND.md** - Pełny przewodnik (PL)

### Szczegółowa dokumentacja:
- **HEADER_NAPRAWIONY.md** - Naprawa duplikacji headera ⭐
- **QUICK_FIX.md** - 5-minutowa naprawa
- **ERROR_FIXES.md** - Rozwiązania błędów
- **../CORS_FIX_GUIDE.md** - Problemy CORS
- **../STOREFRONT_RESTORATION_GUIDE.md** - Kompletny przewodnik

---

## 🔧 Konfiguracja

### Environment Variables (.env.local)
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_storefront_2024_token
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Wymagania
- Node.js 18+ lub 20+
- Backend Medusa na porcie 9000
- npm lub yarn

---

## 🧪 Testy

### Test API Connection
```bash
npx tsx test-api-connection.ts
```

### Test Backend
```bash
curl http://localhost:9000/health
```

---

## 🚨 Problemy?

### CORS Error
Edytuj `medusa-config.ts` w głównym katalogu:
```typescript
http: {
  storeCors: "http://localhost:3000"
}
```
Zrestartuj backend!

### Module Not Found
```bash
rm -rf .next
npm run dev
```

### Port Zajęty
```bash
lsof -i :3000
kill -9 <PID>
```

---

## 📁 Struktura

```
storefront/
├── app/              # Next.js App Router
├── components/       # React Components
├── lib/             # API Clients & Utils
├── hooks/           # Custom React Hooks
├── public/          # Static Assets
└── messages/        # i18n Translations
```

---

## 🎯 Następne kroki

1. Uruchom backend: `npm run dev` (w głównym katalogu)
2. Uruchom frontend: `npm run dev` (w tym katalogu)
3. Otwórz: http://localhost:3000
4. Sprawdź Console (F12) - brak błędów

---

## 📞 Wsparcie

Zobacz dokumentację w katalogu głównym:
- `WSZYSTKO_NAPRAWIONE.md`
- `URUCHOM_FRONTEND.md`
- `STOREFRONT_FIXED_SUMMARY.md`

---

**Status:** ✅ Gotowe  
**Wersja:** 1.0.0  
**Ostatnia aktualizacja:** 3 grudnia 2024
