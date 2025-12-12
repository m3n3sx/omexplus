# OMEX E-commerce Store

Profesjonalny sklep internetowy oparty na **Medusa.js v2** z nowoczesnym frontendem **Next.js 15**.

## 🚀 Quick Start

### Development (Lokalnie)

```bash
# 1. Backend (Medusa)
npm run dev

# 2. Storefront (Next.js) - w nowym terminalu
cd storefront
npm run dev

# 3. Admin Dashboard (opcjonalnie) - w nowym terminalu
cd admin-dashboard
npm run dev
```

### URLs Development:
- **Sklep:** http://localhost:3000
- **Backend API:** http://localhost:9000
- **Medusa Admin:** http://localhost:9000/app
- **Custom Admin:** http://localhost:3001

### Login do Admina:
- Email: `admin@medusa-test.com`
- Hasło: `supersecret`

---

## 📦 Struktura Projektu

```
omex-store/
├── src/                    # Backend Medusa.js
│   ├── api/               # Custom API endpoints
│   ├── modules/           # Business logic modules
│   └── workflows/         # Medusa workflows
├── storefront/            # Frontend Next.js 15
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── contexts/         # Global state
│   ├── lib/              # Utilities & API client
│   └── messages/         # i18n translations
├── admin-dashboard/       # Custom admin panel (opcjonalnie)
├── DevTeamSwarm/          # 🤖 Zespół AI Agentów (8 specjalistów)
│   ├── src/              # Kod źródłowy zespołu
│   └── docs/             # Kompletna dokumentacja (11 plików)
├── docs/                  # Dokumentacja projektu
│   ├── deployment/       # Instrukcje wdrożenia
│   └── archive/          # Archiwum
├── scripts/               # Utility scripts
├── nginx/                 # Nginx config (produkcja)
└── docker/                # Docker setup (produkcja)
```

---

## 🎯 Funkcje

### Sklep (Storefront)
- ✅ Responsywny design (mobile-first)
- ✅ Multi-language: Polski, English, Deutsch, Українська
- ✅ Multi-currency: PLN, EUR, USD, GBP, UAH
- ✅ Zaawansowana wyszukiwarka produktów
- ✅ Filtry i sortowanie
- ✅ Koszyk i checkout
- ✅ Integracja Stripe
- ✅ SEO optimized

### Backend (Medusa)
- ✅ RESTful API
- ✅ PostgreSQL database
- ✅ 1884+ produktów
- ✅ Multi-currency pricing (11 walut)
- ✅ Automatyczna konwersja walut
- ✅ Zarządzanie zamówieniami
- ✅ Zarządzanie klientami
- ✅ Stripe payments
- ✅ Wbudowany Medusa Admin

### Admin Panel
- ✅ Medusa Admin (wbudowany) - dla pracowników
- ✅ Custom Dashboard (opcjonalnie) - dla developerów
- ✅ Zarządzanie produktami (ceny, zdjęcia, warianty)
- ✅ Zarządzanie zamówieniami
- ✅ Zarządzanie klientami

---

## 🤖 Dev Team Swarm - Zespół AI Agentów

**Nowa funkcjonalność!** Zespół 8 wyspecjalizowanych agentów AI, którzy współpracują jak prawdziwy zespół deweloperski.

### 👥 Zespół
- 🎯 **Project Manager** - Koordynacja i roadmap
- 🎨 **UX/UI Designer** - User experience i design systems
- 🖌️ **Designer** - Visual design i branding
- 💻 **Senior Developer** - Full-stack development
- 👨‍💻 **Senior Programista** - Zaawansowane rozwiązania
- ⚙️ **DevOps Engineer** - Infrastruktura i CI/CD
- 📢 **Marketing Specialist** - Strategia marketingowa
- 🔍 **SEO Specialist** - Optymalizacja SEO

### ⚡ Quick Start
```bash
cd DevTeamSwarm
agentcore dev

# W nowym terminalu
agentcore invoke --dev '{"prompt": "Stwórz landing page dla produktu SaaS"}'
```

### 📚 Dokumentacja
- **[DevTeamSwarm/README.md](DevTeamSwarm/README.md)** - Start tutaj!
- **[DevTeamSwarm/INDEX.md](DevTeamSwarm/INDEX.md)** - Mapa dokumentacji
- **[DevTeamSwarm/EXAMPLE_PROMPTS.md](DevTeamSwarm/EXAMPLE_PROMPTS.md)** - 50+ gotowych promptów

### 💡 Przykłady Użycia
```bash
# Design system
agentcore invoke --dev '{"prompt": "Stwórz design system dla e-commerce z Tailwind CSS"}'

# Full-stack feature
agentcore invoke --dev '{"prompt": "Dodaj wishlist system do Medusa.js e-commerce"}'

# Marketing campaign
agentcore invoke --dev '{"prompt": "Stwórz 3-miesięczną strategię marketingową z SEO"}'
```

**Więcej:** Zobacz [DevTeamSwarm/](DevTeamSwarm/) dla kompletnej dokumentacji.

---

## 🔧 Technologie

### Backend
- **Framework:** Medusa.js v2
- **Runtime:** Node.js 20+
- **Language:** TypeScript
- **Database:** PostgreSQL 15
- **Cache:** Redis (opcjonalnie)

### Frontend
- **Framework:** Next.js 15
- **UI Library:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4
- **i18n:** next-intl
- **State:** React Context API

### Payments
- **Provider:** Stripe
- **Currencies:** PLN, EUR, USD, GBP, CZK, SEK, NOK, DKK, CHF, HUF, RON
- **Auto-conversion:** Tak
- **API:** Multi-currency pricing endpoints

---

## 📚 Dokumentacja

### Dla Początkujących:
1. **[START_HERE.md](START_HERE.md)** - Zacznij tutaj! 👋
2. **[PRODUCTION_READY.md](PRODUCTION_READY.md)** - Status projektu
3. **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Checklist wdrożenia

### Dla Zaawansowanych:
- **[docs/deployment/DEPLOYMENT_GUIDE.md](docs/deployment/DEPLOYMENT_GUIDE.md)** - Pełna instrukcja VPS
- **[docs/MULTI_CURRENCY_API.md](docs/MULTI_CURRENCY_API.md)** - API wielowalutowe
- **[Medusa Docs](https://docs.medusajs.com)** - Oficjalna dokumentacja
- **[Next.js Docs](https://nextjs.org/docs)** - Next.js deployment

---

## 🔐 Konfiguracja

### 1. Environment Variables

```bash
# Skopiuj szablon
cp .env.example .env

# Edytuj wartości
nano .env
```

### 2. Wymagane Zmienne

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/medusa

# Backend URL
MEDUSA_BACKEND_URL=http://localhost:9000

# CORS
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:3001,http://localhost:9000

# Security (ZMIEŃ!)
JWT_SECRET=your-random-secret-64-chars
COOKIE_SECRET=your-random-secret-64-chars

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Medusa Publishable Key
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
```

### 3. Generowanie Secrets

```bash
# JWT_SECRET i COOKIE_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Deployment na VPS

### Metoda 1: Quick Deploy (Zalecane)

```bash
# 1. Na VPS - clone repo
git clone your-repo omex-store
cd omex-store

# 2. Setup environment
cp .env.example .env
nano .env  # Edytuj wartości

# 3. Install dependencies
npm ci --only=production
cd storefront && npm ci --only=production && cd ..

# 4. Build
npm run build
cd storefront && npm run build && cd ..

# 5. Start with PM2
pm2 start npm --name "omex-backend" -- start
cd storefront && pm2 start npm --name "omex-storefront" -- start

# 6. Save PM2 config
pm2 save
pm2 startup
```

### Metoda 2: Docker

```bash
# Na VPS
cd omex-store
docker-compose up -d
```

### Szczegółowa Instrukcja

Zobacz: **[docs/deployment/DEPLOYMENT_GUIDE.md](docs/deployment/DEPLOYMENT_GUIDE.md)**

---

## 🔒 Security Checklist

Przed wdrożeniem na produkcję:

- [ ] Zmienione `JWT_SECRET` i `COOKIE_SECRET`
- [ ] Stripe w trybie live (`sk_live_...`)
- [ ] SSL certificates zainstalowane
- [ ] Firewall skonfigurowany
- [ ] PostgreSQL tylko localhost
- [ ] `.env` nie w git (sprawdź `.gitignore`)
- [ ] Rate limiting włączony (Nginx)
- [ ] Backup automatyczny
- [ ] Monitoring włączony

---

## 📊 Monitoring

### PM2 Commands

```bash
# Status
pm2 status

# Logs
pm2 logs
pm2 logs omex-backend
pm2 logs omex-storefront

# Restart
pm2 restart all
pm2 restart omex-backend

# Stop
pm2 stop all
```

### Docker Commands

```bash
# Status
docker-compose ps

# Logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose down
```

---

## 🆘 Troubleshooting

### Backend nie startuje

```bash
# Sprawdź logi
pm2 logs omex-backend

# Sprawdź database connection
psql $DATABASE_URL -c "SELECT 1"

# Restart
pm2 restart omex-backend
```

### Storefront nie ładuje się

```bash
# Sprawdź logi
pm2 logs omex-storefront

# Sprawdź czy backend działa
curl http://localhost:9000/health

# Sprawdź .env
cat storefront/.env.local
```

### 502 Bad Gateway

```bash
# Sprawdź Nginx
sudo nginx -t
sudo systemctl restart nginx

# Sprawdź czy aplikacje działają
pm2 status
```

---

## 💾 Backup

### Manual Backup

```bash
# Database
pg_dump medusa_prod > backup_$(date +%Y%m%d).sql

# Uploads (jeśli są)
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

### Automatic Backup (Cron)

```bash
# Dodaj do crontab
crontab -e

# Daily backup o 2:00
0 2 * * * /var/www/omex-store/scripts/backup.sh
```

---

## 📞 Support

### Dokumentacja:
- **Projekt:** [START_HERE.md](START_HERE.md)
- **Deployment:** [docs/deployment/DEPLOYMENT_GUIDE.md](docs/deployment/DEPLOYMENT_GUIDE.md)
- **Medusa:** https://docs.medusajs.com
- **Next.js:** https://nextjs.org/docs

### Kontakt:
- **Issues:** GitHub Issues
- **Email:** support@omex.pl

---

## 📝 Changelog

### v1.0.0 (2024-12)
- ✅ Initial release
- ✅ 1884 produktów
- ✅ Multi-language (4 języki)
- ✅ Multi-currency (5 walut)
- ✅ Stripe integration
- ✅ Medusa Admin
- ✅ Custom Admin Dashboard
- ✅ Production ready

---

## 📄 License

Proprietary - OMEX © 2024

---

## 🎉 Ready to Deploy!

Projekt jest gotowy do wdrożenia na produkcję. Wszystkie komponenty przetestowane i działają.

**Następne kroki:**
1. Przeczytaj [START_HERE.md](START_HERE.md)
2. Sprawdź [PRODUCTION_READY.md](PRODUCTION_READY.md)
3. Postępuj według [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

**Powodzenia!** 🚀
