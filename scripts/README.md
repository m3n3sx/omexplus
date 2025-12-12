# Skrypty pomocnicze

## Skrypty produkcyjne

### Dane początkowe
- `add-all-categories.js` - Dodaje wszystkie kategorie produktów do bazy
- `add-missing-pages.js` - Dodaje brakujące strony CMS
- `import-cms-pages.js` - Importuje strony CMS z plików
- `seed-b2b-customers.js` - Tworzy 10 klientów B2B z prawdziwymi danymi

### Zarządzanie danymi
- `fix-inventory.js` - Naprawia stany magazynowe
- `fix-order-totals.js` - Naprawia sumy zamówień
- `generate-historical-orders.js` - Generuje historyczne zamówienia
- `simulate-real-sales.js` - Symuluje realistyczne sprzedaże

### Testowanie
- `test-order-creation.js` - Testuje tworzenie zamówień

### Backup
- `backup.sh` - Tworzy backup bazy danych

## Użycie

```bash
# Uruchom skrypt Node.js
node scripts/nazwa-skryptu.js

# Uruchom skrypt bash
bash scripts/nazwa-skryptu.sh
```
