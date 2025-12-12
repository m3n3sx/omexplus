#!/bin/bash
# ===========================================
# OMEX Store - Backup Script
# ===========================================
# Automatyczny backup bazy danych i plików
# ===========================================

set -e

echo "💾 OMEX Store - Backup Script"
echo "=============================="
echo ""

# Konfiguracja
BACKUP_DIR="backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Kolory
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Utwórz katalog backup jeśli nie istnieje
mkdir -p $BACKUP_DIR

# Pobierz DATABASE_URL z .env
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
else
    warning ".env nie znaleziony, używam domyślnych wartości"
fi

echo "📦 Krok 1: Backup bazy danych..."
if [ ! -z "$DATABASE_URL" ]; then
    pg_dump $DATABASE_URL > $BACKUP_DIR/database_$DATE.sql
    success "Backup bazy danych: $BACKUP_DIR/database_$DATE.sql"
    
    # Kompresja
    gzip $BACKUP_DIR/database_$DATE.sql
    success "Skompresowano: $BACKUP_DIR/database_$DATE.sql.gz"
else
    warning "DATABASE_URL nie znaleziony w .env"
fi

echo ""
echo "📁 Krok 2: Backup plików uploads (jeśli istnieją)..."
if [ -d "uploads" ]; then
    tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz uploads/
    success "Backup uploads: $BACKUP_DIR/uploads_$DATE.tar.gz"
else
    warning "Katalog uploads nie istnieje"
fi

echo ""
echo "🧹 Krok 3: Czyszczenie starych backupów (starsze niż $RETENTION_DAYS dni)..."
find $BACKUP_DIR -name "database_*.sql.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
success "Stare backupy usunięte"

echo ""
echo "✅ Backup zakończony!"
echo ""
echo "📊 Dostępne backupy:"
ls -lh $BACKUP_DIR/ | tail -n +2
echo ""
echo "💡 Przywracanie z backup:"
echo "  Database: gunzip -c $BACKUP_DIR/database_$DATE.sql.gz | psql \$DATABASE_URL"
echo "  Uploads:  tar -xzf $BACKUP_DIR/uploads_$DATE.tar.gz"
echo ""
