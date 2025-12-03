# 🔑 Naprawa błędu "Publishable API key required"

## 🚨 Problem:
```
Publishable API key required in the request header: x-publishable-api-key
```

Backend Medusa wymaga API key do dostępu do Store API.

---

## ✅ Rozwiązanie (2 opcje):

### Opcja 1: Automatyczne utworzenie klucza (ZALECANE)

```bash
node create-api-key.js
```

Skrypt:
1. Sprawdzi czy klucz już istnieje
2. Jeśli nie, utworzy nowy
3. Wyświetli token do skopiowania

**Skopiuj token i dodaj do `storefront/.env.local`:**
```env
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxxxxxx
```

**Zrestartuj frontend:**
```bash
cd storefront
npm run dev
```

---

### Opcja 2: Ręczne utworzenie w Admin Panel

1. **Otwórz Medusa Admin:**
   ```
   http://localhost:9000/app
   ```

2. **Zaloguj się** (jeśli potrzebne)

3. **Przejdź do Settings → API Key Management**

4. **Kliknij "Create API Key"**
   - Type: Publishable
   - Title: Storefront Key
   - Kliknij Save

5. **Skopiuj wygenerowany token**

6. **Dodaj do `storefront/.env.local`:**
   ```env
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxxxxxx
   ```

7. **Zrestartuj frontend:**
   ```bash
   cd storefront
   npm run dev
   ```

---

## 🧪 Test:

### Test 1: Sprawdź czy klucz działa
```bash
curl -H "x-publishable-api-key: pk_xxxxxxxxxxxxx" \
  http://localhost:9000/store/products
```

Powinno zwrócić JSON z produktami (nie błąd).

### Test 2: Sprawdź w przeglądarce

1. Otwórz http://localhost:3000
2. Naciśnij F12 → Console
3. Szukaj logów:
   ```
   🔑 API Key configured: Yes
   📦 Products response: 200
   ✅ Products loaded: X
   ```

---

## 🔍 Debugowanie:

### Sprawdź czy klucz jest w .env.local:
```bash
cd storefront
cat .env.local | grep PUBLISHABLE
```

Powinno pokazać:
```
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxxxxxx
```

### Sprawdź czy Next.js widzi zmienną:
W `storefront/app/[locale]/page.tsx` dodaj console.log:
```typescript
console.log('API Key:', process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY)
```

---

## ⚠️ Ważne:

1. **Zmienna MUSI zaczynać się od `NEXT_PUBLIC_`**
   - Inaczej Next.js nie wyeksportuje jej do przeglądarki

2. **Restart wymagany po zmianie .env.local**
   - Zatrzymaj frontend (Ctrl+C)
   - Uruchom ponownie: `npm run dev`

3. **Nie commituj klucza do git!**
   - `.env.local` jest w `.gitignore`
   - Używaj `.env.example` dla szablonu

---

## 📝 Pełna konfiguracja .env.local:

```env
# Backend API URL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Publishable API Key (WYMAGANE!)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxxxxxx

# Stripe (opcjonalne)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

---

## 🚀 Po naprawie:

1. ✅ Klucz utworzony
2. ✅ Dodany do `.env.local`
3. ✅ Frontend zrestartowany
4. ✅ Strona ładuje się bez błędów
5. ✅ Produkty i kategorie wyświetlają się

---

## 📞 Jeśli nadal nie działa:

### 1. Sprawdź czy backend wymaga klucza:
```bash
curl http://localhost:9000/store/products
```

Jeśli zwraca błąd o kluczu - klucz jest wymagany.

### 2. Sprawdź czy klucz jest poprawny:
```bash
curl -H "x-publishable-api-key: TWOJ_KLUCZ" \
  http://localhost:9000/store/products
```

Jeśli zwraca produkty - klucz działa.

### 3. Sprawdź Network tab w przeglądarce:
- F12 → Network
- Odśwież stronę
- Kliknij na request do `/store/products`
- Sprawdź Headers → Request Headers
- Powinien być: `x-publishable-api-key: pk_xxxxx`

---

**Status:** Naprawione po dodaniu klucza  
**Czas:** 2 minuty  
**Kluczowe:** Klucz MUSI być w .env.local i frontend MUSI być zrestartowany!
