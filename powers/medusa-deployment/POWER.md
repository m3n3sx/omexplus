---
name: "medusa-deployment"
displayName: "Medusa Deployment Guide"
description: "Kompletny przewodnik po deploymencie sklepu Medusa - VPS, Netlify, environment variables, SSL, monitoring i backup strategies."
keywords: ["medusa", "deployment", "production", "vps", "netlify", "ssl"]
author: "Medusa Team"
---

# Medusa Deployment Guide

## Przegląd

Ten power zawiera wszystkie informacje potrzebne do wdrożenia sklepu Medusa na production. Obejmuje deployment backendu na VPS, frontendu na Netlify, konfigurację SSL, oraz monitoring.

## Architektura Production

```
┌─────────────────┐
│   Cloudflare    │  ← DNS + CDN + SSL
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼────┐ ┌─▼──────────┐
│ Netlify│ │ VPS Server │
│Frontend│ │  Backend   │
└────────┘ └─────┬──────┘
              ┌───┴───┐
         ┌────▼──┐ ┌──▼────┐
         │ Redis │ │ Postgres│
         └───────┘ └────────┘
```

## Workflow 1: Deployment Backendu na VPS

### Przygotowanie VPS

```bash
# 1. Połącz się z VPS
ssh root@your-vps-ip

# 2. Aktualizuj system
apt update && apt upgrade -y

# 3. Zainstaluj Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 4. Zainstaluj PostgreSQL
apt install -y postgresql postgresql-contrib

# 5. Zainstaluj Redis (opcjonalnie)
apt install -y redis-server

# 6. Zainstaluj PM2 (process manager)
npm install -g pm2

# 7. Zainstaluj Nginx
apt install -y nginx
```

### Konfiguracja Bazy Danych

```bash
# Przełącz się na użytkownika postgres
sudo -u postgres psql

# W PostgreSQL:
CREATE DATABASE medusa_prod;
CREATE USER medusa_user WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE medusa_prod TO medusa_user;
\q
```

### Deploy Aplikacji

```bash
# 1. Sklonuj repozytorium
cd /var/www
git clone https://github.com/your-repo/my-medusa-store.git
cd my-medusa-store

# 2. Zainstaluj zależności
npm install --production

# 3. Skopiuj i skonfiguruj .env
cp .env.vps .env
nano .env
```

**Przykład .env.vps:**

```bash
# Database
DATABASE_URL=postgresql://medusa_user:password@localhost:5432/medusa_prod

# Redis
REDIS_URL=redis://localhost:6379

# Server
PORT=9000
NODE_ENV=production

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Cookie
COOKIE_SECRET=your-super-secret-cookie-key-change-this

# Admin
ADMIN_CORS=https://admin.yourdomain.com
STORE_CORS=https://yourdomain.com

# Stripe
STRIPE_API_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

```bash
# 4. Build aplikacji
npm run build

# 5. Uruchom migracje
npm run medusa:migrate

# 6. Uruchom z PM2
pm2 start npm --name "medusa-backend" -- run start
pm2 save
pm2 startup
```

### Konfiguracja Nginx

```bash
# Utwórz config dla Nginx
nano /etc/nginx/sites-available/medusa
```

**Przykład konfiguracji:**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Aktywuj konfigurację
ln -s /etc/nginx/sites-available/medusa /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### SSL z Certbot

```bash
# 1. Zainstaluj Certbot
apt install -y certbot python3-certbot-nginx

# 2. Uzyskaj certyfikat
certbot --nginx -d api.yourdomain.com

# 3. Auto-renewal (już skonfigurowane)
certbot renew --dry-run
```

## Workflow 2: Deployment Frontendu na Netlify

### Przygotowanie Projektu

```bash
# W katalogu storefront
cd storefront

# Sprawdź czy build działa lokalnie
npm run build
```

### Konfiguracja Netlify

**netlify.toml** (w głównym katalogu projektu):

```toml
[build]
  base = "storefront"
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
  NEXT_TELEMETRY_DISABLED = "1"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables w Netlify

W Netlify Dashboard → Site settings → Environment variables:

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Deploy przez Git

```bash
# 1. Push do GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. W Netlify Dashboard:
# - New site from Git
# - Wybierz repozytorium
# - Ustaw build settings (już w netlify.toml)
# - Deploy site
```

### Custom Domain w Netlify

```
1. Netlify Dashboard → Domain settings
2. Add custom domain → yourdomain.com
3. Skonfiguruj DNS:
   - A record: @ → Netlify IP
   - CNAME: www → your-site.netlify.app
4. Enable HTTPS (automatyczne)
```

## Workflow 3: Continuous Deployment

### GitHub Actions dla Backendu

**.github/workflows/deploy-backend.yml:**

```yaml
name: Deploy Backend to VPS

on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'package.json'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/my-medusa-store
            git pull origin main
            npm install --production
            npm run build
            npm run medusa:migrate
            pm2 restart medusa-backend
```

### Secrets w GitHub

```
Settings → Secrets and variables → Actions:
- VPS_HOST: your-vps-ip
- VPS_USER: root
- VPS_SSH_KEY: (private SSH key)
```

## Workflow 4: Monitoring i Logi

### PM2 Monitoring

```bash
# Status wszystkich procesów
pm2 status

# Logi w czasie rzeczywistym
pm2 logs medusa-backend

# Logi z ostatnich 100 linii
pm2 logs medusa-backend --lines 100

# Monitoring zasobów
pm2 monit

# Restart aplikacji
pm2 restart medusa-backend

# Restart przy błędzie
pm2 restart medusa-backend --watch
```

### Nginx Logi

```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log

# Filtrowanie błędów 500
grep "500" /var/log/nginx/access.log
```

### PostgreSQL Monitoring

```bash
# Połączenia do bazy
psql medusa_prod -c "SELECT count(*) FROM pg_stat_activity;"

# Rozmiar bazy
psql medusa_prod -c "SELECT pg_size_pretty(pg_database_size('medusa_prod'));"

# Najwolniejsze query
psql medusa_prod -c "SELECT query, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"
```

## Workflow 5: Backup Strategy

### Automatyczny Backup Bazy

**Skrypt backup:** `/root/scripts/backup-db.sh`

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/medusa"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="medusa_prod_$DATE.sql"

# Utwórz katalog jeśli nie istnieje
mkdir -p $BACKUP_DIR

# Backup bazy
pg_dump medusa_prod > $BACKUP_DIR/$FILENAME

# Kompresja
gzip $BACKUP_DIR/$FILENAME

# Usuń backupy starsze niż 7 dni
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: $FILENAME.gz"
```

```bash
# Nadaj uprawnienia
chmod +x /root/scripts/backup-db.sh

# Dodaj do crontab (codziennie o 2:00)
crontab -e
0 2 * * * /root/scripts/backup-db.sh >> /var/log/backup.log 2>&1
```

### Backup Plików

```bash
# Backup uploaded files (jeśli są na VPS)
tar -czf /var/backups/medusa/uploads_$(date +%Y%m%d).tar.gz /var/www/my-medusa-store/uploads

# Backup do S3 (opcjonalnie)
aws s3 sync /var/backups/medusa s3://your-bucket/backups/
```

## Workflow 6: Rollback Strategy

### Rollback Backendu

```bash
# 1. Sprawdź poprzedni commit
cd /var/www/my-medusa-store
git log --oneline -5

# 2. Rollback do poprzedniej wersji
git checkout <previous-commit-hash>

# 3. Reinstall dependencies
npm install --production

# 4. Rebuild
npm run build

# 5. Rollback migracji (jeśli potrzeba)
npm run typeorm migration:revert

# 6. Restart
pm2 restart medusa-backend
```

### Rollback Frontendu (Netlify)

```
1. Netlify Dashboard → Deploys
2. Znajdź poprzedni working deploy
3. Kliknij "Publish deploy"
```

## Workflow 7: Performance Optimization

### Redis Cache

```bash
# Zainstaluj Redis
apt install redis-server

# Konfiguracja w .env
REDIS_URL=redis://localhost:6379

# Test połączenia
redis-cli ping
# Powinno zwrócić: PONG
```

### Database Indexing

```sql
-- Dodaj indexy dla często używanych query
CREATE INDEX idx_product_status ON product(status);
CREATE INDEX idx_order_created_at ON "order"(created_at);
CREATE INDEX idx_product_collection ON product(collection_id);

-- Sprawdź istniejące indexy
\di
```

### Nginx Caching

```nginx
# W /etc/nginx/sites-available/medusa
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Best Practices

- **Używaj environment variables** - Nigdy nie commituj secrets do repo
- **Automatyzuj backupy** - Codzienne backupy bazy i plików
- **Monitoruj logi** - Regularnie sprawdzaj logi błędów
- **Testuj przed deploymentem** - Zawsze testuj lokalnie przed push
- **Używaj SSL** - Zawsze HTTPS w production
- **Rollback plan** - Miej plan na szybki rollback
- **Monitor zasobów** - Sprawdzaj CPU, RAM, disk space

## Checklist Przed Deploymentem

- [ ] Wszystkie testy przechodzą
- [ ] Environment variables skonfigurowane
- [ ] SSL certyfikaty zainstalowane
- [ ] Backup strategy w miejscu
- [ ] Monitoring skonfigurowany
- [ ] CORS poprawnie ustawiony
- [ ] Stripe webhooks skonfigurowane
- [ ] DNS records ustawione
- [ ] Rollback plan przygotowany
- [ ] Dokumentacja zaktualizowana

## Troubleshooting

### Problem: 502 Bad Gateway

**Przyczyna:** Backend nie działa lub Nginx nie może się połączyć

**Rozwiązanie:**
```bash
# Sprawdź status backendu
pm2 status

# Sprawdź logi
pm2 logs medusa-backend

# Restart
pm2 restart medusa-backend

# Sprawdź Nginx config
nginx -t
```

### Problem: Database Connection Failed

**Przyczyna:** Błędne credentials lub PostgreSQL nie działa

**Rozwiązanie:**
```bash
# Sprawdź status PostgreSQL
systemctl status postgresql

# Restart PostgreSQL
systemctl restart postgresql

# Sprawdź connection string w .env
cat .env | grep DATABASE_URL

# Test połączenia
psql medusa_prod -c "SELECT 1;"
```

### Problem: Out of Memory

**Przyczyna:** Za mało RAM na VPS

**Rozwiązanie:**
```bash
# Sprawdź użycie pamięci
free -h

# Dodaj swap
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Permanent swap
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

## Dodatkowe Zasoby

- [Medusa Deployment Docs](https://docs.medusajs.com/deployments/server)
- [Netlify Next.js Docs](https://docs.netlify.com/frameworks/next-js/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Deployment:** VPS + Netlify
**Monitoring:** PM2 + Nginx logs
**Type:** Knowledge Base Power
