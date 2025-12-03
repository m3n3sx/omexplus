# 🚀 URUCHOM TERAZ - Dodawanie Produktów

## Krok 1: Utwórz Konto Admin

### Otwórz Admin Panel:
```
http://localhost:7001
```

### Utwórz konto z danymi:
- **Email**: meneswczesny@gmail.com
- **Hasło**: CAnabis123#$
- **Imię**: Twoje imię
- **Nazwisko**: Twoje nazwisko

### LUB zaloguj się jeśli konto już istnieje

---

## Krok 2: Uruchom Skrypt

Po utworzeniu/zalogowaniu się, uruchom w terminalu:

```bash
node add-products-to-medusa.js
```

---

## Co się stanie:

Skrypt doda **680 produktów**:
- 5 kategorii głównych
- 34 podkategorie
- 20 produktów w każdej podkategorii

**Czas**: ~10-15 minut

---

## Sprawdź Rezultat:

```
Frontend: http://localhost:3000/pl/products
API: http://localhost:9000/store/products
```

---

## ⚠️ Jeśli Admin Panel nie działa:

Sprawdź czy backend działa:
```bash
curl http://localhost:9000/health
```

Jeśli nie, uruchom:
```bash
cd my-medusa-store
npm run dev
```

---

**WAŻNE**: Skrypt jest już skonfigurowany z Twoimi danymi logowania!

Wystarczy tylko:
1. Otworzyć http://localhost:7001
2. Utworzyć konto
3. Uruchomić: `node add-products-to-medusa.js`

🎉 **Gotowe!**
