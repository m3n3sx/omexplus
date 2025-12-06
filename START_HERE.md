# 🎯 START TUTAJ - Wdrożenie w 3 krokach

## Twój sklep jest już częściowo online!

✅ **Frontend**: https://lucky-salmiakki-66fc35.netlify.app (DZIAŁA!)
⏳ **Backend**: Wymaga wdrożenia (5 minut)

---

## Krok 1: Wdróż Backend na Railway (5 minut)

### Metoda A: Przez przeglądarkę (ZALECANE)

1. **Otwórz** https://railway.app
2. **Zaloguj się** przez GitHub
3. **Kliknij** "New Project" → "Deploy from GitHub repo"
4. **Wybierz** swoje repozytorium
5. **Dodaj** PostgreSQL: kliknij "+ New" → "Database" → "PostgreSQL"
6. **Ustaw zmienne** (w zakładce Variables):
   ```
   STORE_CORS=https://lucky-salmiakki-66fc35.netlify.app
   ADMIN_CORS=https://lucky-salmiakki-66fc35.netlify.app
   AUTH_CORS=https://lucky-salmiakki-66fc35.netlify.app
   ```
7. **Wygeneruj sekrety** (w terminalu):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Dodaj jako `JWT_SECRET` i `COOKIE_SECRET`

8. **Wygeneruj domain** (Settings → Generate Domain)
9. **Skopiuj URL** (np. `https://omex-backend.up.railway.app`)

**Szczegóły**: Otwórz `RAILWAY_QUICK_START.md`

### Metoda B: Przez terminal

```bash
./deploy-backend.sh
```

---

## Krok 2: Połącz Frontend z Backendem (1 minuta)

```bash
cd storefront
netlify env:set NEXT_PUBLIC_MEDUSA_BACKEND_URL "https://twoj-backend.up.railway.app"
netlify deploy --prod
```

Zamień `https://twoj-backend.up.railway.app` na swój URL z Railway.

---

## Krok 3: Przetestuj (30 sekund)

### Test backendu:
```bash
curl https://twoj-backend.up.railway.app/health
```
Powinno zwrócić: `{"status":"ok"}`

### Test frontendu:
Otwórz: https://lucky-salmiakki-66fc35.netlify.app

---

## 🎉 Gotowe!

Twój sklep jest teraz w pełni online!

### Co dalej?

1. **Dodaj produkty**:
   - Przez panel admin: `https://twoj-backend.up.railway.app/app`
   - Lub użyj skryptów: patrz `DODAJ_PRODUKTY.md`

2. **Utwórz konto admin**:
   ```bash
   railway run npm run seed
   ```

3. **Dostosuj design**:
   - Edytuj komponenty w `storefront/components/`
   - Push do GitHub → automatyczne wdrożenie

---

## 📚 Więcej informacji:

- `RAILWAY_QUICK_START.md` - Szczegółowa instrukcja Railway
- `BACKEND_DEPLOYMENT.md` - Alternatywne platformy (Render, Heroku)
- `DEPLOYMENT_COMPLETE.md` - Kompletny przewodnik
- `SKLEP_ONLINE.md` - Status frontendu

---

## 💰 Koszty:

- **Netlify**: Darmowy
- **Railway**: $5/miesiąc (pierwszy miesiąc $5 credit gratis)
- **Łącznie**: ~$5/miesiąc

---

## 🆘 Problemy?

### Backend nie startuje?
- Sprawdź logi w Railway Dashboard
- Upewnij się że wszystkie zmienne są ustawione

### Frontend nie łączy się z backendem?
- Sprawdź czy URL backendu jest poprawny
- Sprawdź CORS w zmiennych backendu

### Potrzebujesz pomocy?
- Railway Docs: https://docs.railway.app
- Medusa Docs: https://docs.medusajs.com

---

**Powodzenia! 🚀**
