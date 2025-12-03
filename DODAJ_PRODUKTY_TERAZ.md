# 🚀 DODAJ PRODUKTY - TERAZ

Masz konto w adminie ale skrypt nie działa? Oto 2 proste rozwiązania:

## ✅ ROZWIĄZANIE 1: Podaj Swoje Dane (30 sekund)

Uruchom interaktywny skrypt:

```bash
node add-products-interactive.js
```

Wpisz swój email i hasło z Admin Panel.

Skrypt doda 5 produktów testowych aby sprawdzić czy wszystko działa.

---

## ✅ ROZWIĄZANIE 2: Zaktualizuj Skrypt (1 minuta)

Edytuj `add-products-to-medusa.js` linijki 6-7:

```javascript
const ADMIN_EMAIL = 'TWOJ_EMAIL@example.com'  // ← Zmień na swój email
const ADMIN_PASSWORD = 'TWOJE_HASLO'           // ← Zmień na swoje hasło
```

Następnie uruchom:

```bash
node add-products-to-medusa.js
```

---

## ✅ ROZWIĄZANIE 3: Dodaj Ręcznie (Admin Panel)

1. Otwórz: http://localhost:7001
2. Zaloguj się
3. Kliknij "Products" → "New Product"
4. Wypełnij formularz:
   - Title: "Pompa hydrauliczna Rexroth A100"
   - Description: "Wysokiej jakości pompa..."
   - Handle: "pompa-rexroth-a100"
   - Status: Published
5. Dodaj wariant:
   - SKU: "PUMP-0001"
   - Price: 4500 PLN
   - Inventory: 15
6. Save

---

## 🔍 Sprawdź Czy Produkty Są Widoczne

```
Frontend: http://localhost:3000/pl/products
API: curl http://localhost:9000/store/products
```

---

## 💡 Dlaczego Skrypt Nie Działa?

Skrypt używa domyślnych danych logowania:
- Email: `admin@medusa-test.com`
- Hasło: `supersecret`

Jeśli użyłeś innych danych, musisz je zaktualizować w skrypcie.

---

## ✨ Po Dodaniu Testowego Produktu

Jeśli testowy produkt działa, możesz:

1. Dodać więcej ręcznie przez Admin Panel
2. Zaktualizować skrypt z właściwymi danymi i uruchomić ponownie
3. Użyć funkcji importu CSV w Admin Panel

---

**Wybierz najłatwiejsze rozwiązanie dla Ciebie!**

Data: 3 grudnia 2024
