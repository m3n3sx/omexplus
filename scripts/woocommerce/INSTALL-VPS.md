# Instalacja API Supplier Feed na VPS

## Krok 1: Utwórz katalog API na VPS

```bash
ssh root@your-vps-ip
mkdir -p /www/wwwroot/ooxo.pl/api
```

## Krok 2: Skopiuj plik PHP na VPS

Z lokalnego komputera:
```bash
scp scripts/woocommerce/supplier-feed.php root@your-vps-ip:/www/wwwroot/ooxo.pl/api/
```

Lub ręcznie utwórz plik na VPS:
```bash
nano /www/wwwroot/ooxo.pl/api/supplier-feed.php
# Wklej zawartość pliku supplier-feed.php
```

## Krok 3: Ustaw uprawnienia

```bash
chmod 644 /www/wwwroot/ooxo.pl/api/supplier-feed.php
chown www-data:www-data /www/wwwroot/ooxo.pl/api/supplier-feed.php
```

## Krok 4: Testuj API

```bash
# Test dla omexplus
curl "https://ooxo.pl/api/supplier-feed.php?store=omexplus&key=omex_supplier_sync_2024_secret"

# Test dla kolaiwalki
curl "https://ooxo.pl/api/supplier-feed.php?store=kolaiwalki&key=omex_supplier_sync_2024_secret"
```

## Krok 5: Zmień klucz API (WAŻNE!)

Edytuj plik na VPS i zmień `SECRET_KEY`:
```php
define('SECRET_KEY', 'twoj_wlasny_bezpieczny_klucz');
```

Następnie zaktualizuj klucz w:
- `src/api/admin/suppliers/[id]/sync/route.ts` - zmienna `REMOTE_API_KEY`
- `scripts/sync-woo-suppliers.js` - zmienna `API_KEY`

## Synchronizacja

### Ręczna synchronizacja z panelu admin:
1. Otwórz panel admin: http://localhost:3001/suppliers
2. Kliknij na dostawcę (OMEX Plus lub Kola i Walki)
3. Kliknij przycisk "Synchronizuj"

### Ręczna synchronizacja ze skryptu:
```bash
node scripts/sync-woo-suppliers.js
```

### Automatyczna synchronizacja (cron):
Dodaj do crontab na lokalnym serwerze:
```bash
# Synchronizacja co 6 godzin
0 */6 * * * cd /path/to/medusa && node scripts/sync-woo-suppliers.js >> /var/log/supplier-sync.log 2>&1
```

## Rozwiązywanie problemów

### Błąd 401 - Invalid API key
Sprawdź czy klucz w URL zgadza się z `SECRET_KEY` w pliku PHP.

### Błąd 500 - Database error
Sprawdź dane dostępowe do bazy MySQL w pliku PHP.

### Brak produktów
Upewnij się, że produkty w WooCommerce mają status "publish".
