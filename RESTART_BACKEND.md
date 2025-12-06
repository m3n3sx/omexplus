# ⚠️ WYMAGANY RESTART BACKENDU

## Problem
Admin Dashboard nie może połączyć się z backendem z powodu CORS.

## Rozwiązanie
Dodano `http://localhost:3001` do `ADMIN_CORS` w pliku `.env`

## WYMAGANE DZIAŁANIE

### Zatrzymaj backend:
1. Znajdź terminal z uruchomionym backendem
2. Naciśnij `Ctrl+C` aby zatrzymać

### Uruchom ponownie:
```bash
npm run dev
```

## Po restarcie
Dashboard powinien działać poprawnie i pokazywać:
- ✅ 1884 produkty
- ✅ 2 zamówienia  
- ✅ 4 klientów

## Sprawdzenie
```bash
# Test czy CORS działa
curl -H "Origin: http://localhost:3001" -H "Access-Control-Request-Method: GET" -X OPTIONS http://localhost:9000/admin/products -v
```

Powinno zwrócić:
```
Access-Control-Allow-Origin: http://localhost:3001
```
