# Backup bazy danych

## Pliki backup

- `medusa_db_backup.sql` - Pełny backup bazy danych (44 MB)
- `medusa_db_backup.sql.gz` - Skompresowany backup (3.4 MB)

## Zawartość bazy

- **Produkty**: 3051 produktów z wariantami
- **Kategorie**: Pełna hierarchia kategorii
- **Zamówienia**: 924 zamówienia z historią
- **Klienci**: Wszyscy klienci (B2C + 10 klientów B2B)
- **Strony CMS**: Wszystkie strony contentowe
- **Stany magazynowe**: Pełne dane inventory

## Przywracanie bazy

### Z pliku nieskompresowanego
```bash
psql postgres://postgres:postgres@localhost/medusa_db < medusa_db_backup.sql
```

### Z pliku skompresowanego
```bash
gunzip -c medusa_db_backup.sql.gz | psql postgres://postgres:postgres@localhost/medusa_db
```

### Utworzenie nowej bazy i przywrócenie
```bash
# Usuń starą bazę (UWAGA: traci wszystkie dane!)
dropdb medusa_db

# Utwórz nową bazę
createdb medusa_db

# Przywróć backup
psql postgres://postgres:postgres@localhost/medusa_db < medusa_db_backup.sql
```

## Tworzenie nowego backupu

```bash
# Backup do pliku SQL
pg_dump postgres://postgres:postgres@localhost/medusa_db > medusa_db_backup_$(date +%Y%m%d).sql

# Backup skompresowany
pg_dump postgres://postgres:postgres@localhost/medusa_db | gzip > medusa_db_backup_$(date +%Y%m%d).sql.gz
```

## Automatyczny backup

Użyj skryptu:
```bash
bash scripts/backup.sh
```

## Data utworzenia backupu

Backup utworzony: 12 grudnia 2024, 16:57
