#!/usr/bin/env python3
"""
Import real verified machine data to database
Removes fake data and imports verified machines with correct production years
"""
import psycopg2
from psycopg2.extras import execute_batch
import logging
from real_machines_data import get_all_machines

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database config
DB_HOST = 'localhost'
DB_NAME = 'medusa_db'
DB_USER = 'postgres'
DB_PASS = 'postgres'

def connect_db():
    """Connect to PostgreSQL"""
    try:
        conn = psycopg2.connect(
            host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS
        )
        logger.info(f"✅ Connected to database {DB_NAME}")
        return conn
    except Exception as e:
        logger.error(f"❌ Database connection error: {e}")
        return None

def clear_fake_data(conn):
    """Remove all fake/sample data from database"""
    logger.info("🗑️  Removing fake data...")
    cursor = conn.cursor()
    
    try:
        # Delete fake OEM parts (all of them were generated)
        cursor.execute("DELETE FROM omex.oem_part_products")
        cursor.execute("DELETE FROM omex.machine_serial_part_map")
        cursor.execute("DELETE FROM omex.oem_parts")
        deleted_parts = cursor.rowcount
        
        # Delete fake machines
        cursor.execute("DELETE FROM omex.machines")
        deleted_machines = cursor.rowcount
        
        # Clear import stats
        cursor.execute("DELETE FROM omex.import_stats")
        
        conn.commit()
        logger.info(f"  ✓ Deleted {deleted_machines} fake machines")
        logger.info(f"  ✓ Deleted {deleted_parts} fake OEM parts")
    except Exception as e:
        conn.rollback()
        logger.error(f"❌ Error clearing data: {e}")
    
    cursor.close()


def import_real_machines(conn):
    """Import verified real machine data"""
    logger.info("📥 Importing real machine data...")
    
    machines = get_all_machines()
    cursor = conn.cursor()
    
    insert_query = """
        INSERT INTO omex.machines 
        (manufacturer, model_code, model_family, serial_range_start, serial_range_end,
         year_from, year_to, engine_manufacturer, engine_model, data_source, notes,
         created_at, updated_at)
        VALUES (%s, %s, %s, '', '', %s, %s, %s, %s, %s, %s, NOW(), NOW())
        ON CONFLICT (manufacturer, model_code, serial_range_start, serial_range_end)
        DO UPDATE SET
            year_from = EXCLUDED.year_from,
            year_to = EXCLUDED.year_to,
            engine_manufacturer = EXCLUDED.engine_manufacturer,
            engine_model = EXCLUDED.engine_model,
            notes = EXCLUDED.notes,
            updated_at = NOW()
    """
    
    rows = []
    for m in machines:
        # Extract engine manufacturer from engine model
        engine = m.get('engine', '')
        engine_mfg = ''
        if engine:
            parts = engine.split(' ')
            if len(parts) > 0:
                engine_mfg = parts[0]
        
        # Determine model family from model code
        model = m.get('model', '')
        model_family = ''
        if model:
            # Extract letters/numbers prefix
            for i, c in enumerate(model):
                if c.isdigit():
                    model_family = model[:max(i, 2)]
                    break
            if not model_family:
                model_family = model[:3]
        
        rows.append((
            m.get('manufacturer', ''),
            model,
            model_family,
            m.get('year_from'),
            m.get('year_to'),
            engine_mfg,
            engine,
            'verified_specs',
            f"Type: {m.get('type', '')}, Weight: {m.get('weight_kg', '')}kg"
        ))
    
    try:
        execute_batch(cursor, insert_query, rows, page_size=100)
        conn.commit()
        logger.info(f"✅ Imported {len(rows)} verified machines")
    except Exception as e:
        conn.rollback()
        logger.error(f"❌ Error importing machines: {e}")
    
    cursor.close()
    return len(rows)

def log_import_stats(conn, source, entity_type, count):
    """Log import statistics"""
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO omex.import_stats (source, entity_type, count_imported, count_skipped, errors)
        VALUES (%s, %s, %s, 0, 0)
    """, (source, entity_type, count))
    conn.commit()
    cursor.close()

def show_summary(conn):
    """Show summary of imported data"""
    cursor = conn.cursor()
    
    logger.info("\n" + "=" * 60)
    logger.info("📊 IMPORT SUMMARY")
    logger.info("=" * 60)
    
    # Count by manufacturer
    cursor.execute("""
        SELECT manufacturer, COUNT(*) as count
        FROM omex.machines
        GROUP BY manufacturer
        ORDER BY count DESC
    """)
    
    logger.info("\nMachines by manufacturer:")
    total = 0
    for mfg, count in cursor.fetchall():
        logger.info(f"  • {mfg}: {count} models")
        total += count
    logger.info(f"\n  TOTAL: {total} machines")
    
    # Count by type
    cursor.execute("""
        SELECT 
            CASE 
                WHEN notes LIKE '%excavator%' THEN 'Excavators'
                WHEN notes LIKE '%wheel_loader%' THEN 'Wheel Loaders'
                WHEN notes LIKE '%dozer%' THEN 'Dozers'
                WHEN notes LIKE '%backhoe%' THEN 'Backhoe Loaders'
                WHEN notes LIKE '%telehandler%' THEN 'Telehandlers'
                ELSE 'Other'
            END as machine_type,
            COUNT(*) as count
        FROM omex.machines
        GROUP BY machine_type
        ORDER BY count DESC
    """)
    
    logger.info("\nMachines by type:")
    for mtype, count in cursor.fetchall():
        logger.info(f"  • {mtype}: {count}")
    
    # Sample machines
    cursor.execute("""
        SELECT manufacturer, model_code, year_from, year_to, engine_model
        FROM omex.machines
        ORDER BY manufacturer, model_code
        LIMIT 10
    """)
    
    logger.info("\nSample machines:")
    for mfg, model, yf, yt, engine in cursor.fetchall():
        year_range = f"{yf or '?'}-{yt or 'present'}"
        logger.info(f"  • {mfg} {model} ({year_range}) - {engine}")
    
    cursor.close()

def main():
    logger.info("=" * 60)
    logger.info("🔧 IMPORTING REAL VERIFIED MACHINE DATA")
    logger.info("=" * 60)
    
    conn = connect_db()
    if not conn:
        return
    
    # Step 1: Clear fake data
    clear_fake_data(conn)
    
    # Step 2: Import real machines
    count = import_real_machines(conn)
    
    # Step 3: Log stats
    log_import_stats(conn, 'verified_specs', 'machines', count)
    
    # Step 4: Show summary
    show_summary(conn)
    
    conn.close()
    
    logger.info("\n" + "=" * 60)
    logger.info("✅ IMPORT COMPLETE!")
    logger.info("=" * 60)

if __name__ == "__main__":
    main()
