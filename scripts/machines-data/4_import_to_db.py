#!/usr/bin/env python3
"""
Import combined data to PostgreSQL database
"""
import pandas as pd
import psycopg2
from psycopg2.extras import execute_batch
import os
import logging
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database config - use same DB as Medusa (hardcoded to avoid .env conflicts)
DB_HOST = 'localhost'
DB_NAME = 'medusa_db'
DB_USER = 'postgres'
DB_PASS = 'postgres'

INPUT_DIR = "data/processed"

def connect_db():
    """Connect to PostgreSQL"""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        logger.info(f"✅ Connected to database {DB_NAME}")
        return conn
    except Exception as e:
        logger.error(f"❌ Database connection error: {e}")
        return None

def setup_schema(conn):
    """Create schema and tables if not exist"""
    logger.info("📊 Setting up schema...")
    
    cursor = conn.cursor()
    
    # Read and execute setup SQL
    sql_file = "scripts/machines-data/setup_db.sql"
    if os.path.exists(sql_file):
        with open(sql_file, 'r') as f:
            sql = f.read()
        
        try:
            cursor.execute(sql)
            conn.commit()
            logger.info("✅ Schema created/updated")
        except Exception as e:
            conn.rollback()
            logger.error(f"❌ Schema setup error: {e}")
    
    cursor.close()

def import_machines(conn, df):
    """Import machines data"""
    logger.info(f"📥 Importing {len(df)} machines...")
    
    cursor = conn.cursor()
    
    insert_query = """
        INSERT INTO omex.machines 
        (manufacturer, model_code, model_family, serial_range_start, serial_range_end,
         year_from, year_to, data_source, source_url, created_at, updated_at)
        VALUES (%s, %s, %s, '', '', %s, %s, %s, %s, NOW(), NOW())
        ON CONFLICT (manufacturer, model_code, serial_range_start, serial_range_end)
        DO NOTHING
    """
    
    rows = []
    for _, row in df.iterrows():
        manufacturer = str(row.get('manufacturer', '')).strip()
        model_code = str(row.get('model_code', '')).strip()
        
        if not manufacturer or not model_code:
            continue
            
        rows.append((
            manufacturer[:100],
            model_code[:100],
            '',  # model_family
            int(row.get('yearFrom', 0)) if pd.notna(row.get('yearFrom')) else None,
            int(row.get('yearTo', 0)) if pd.notna(row.get('yearTo')) else None,
            str(row.get('data_source', 'unknown'))[:255],
            str(row.get('machine', ''))[:500],  # source_url (wikidata ID)
        ))
    
    try:
        execute_batch(cursor, insert_query, rows, page_size=100)
        conn.commit()
        logger.info(f"✅ Imported {len(rows)} machines")
    except Exception as e:
        conn.rollback()
        logger.error(f"❌ Error importing machines: {e}")
    
    cursor.close()

def import_oem_parts(conn, df):
    """Import OEM parts data"""
    logger.info(f"📥 Importing {len(df)} OEM parts...")
    
    cursor = conn.cursor()
    
    insert_query = """
        INSERT INTO omex.oem_parts 
        (manufacturer, oem_part_number, description_en, 
         subsystem, component_type, data_source, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())
        ON CONFLICT (manufacturer, oem_part_number) DO NOTHING
    """
    
    rows = []
    for _, row in df.iterrows():
        manufacturer = str(row.get('manufacturer', '')).strip()
        part_number = str(row.get('oem_part_number', '')).strip()
        description = str(row.get('description_en', '')).strip()
        
        if not manufacturer or not part_number:
            continue
            
        rows.append((
            manufacturer[:100],
            part_number[:150],
            description[:1000] if description else 'No description',
            'general',
            'part',
            str(row.get('data_source', 'unknown'))[:255],
        ))
    
    try:
        execute_batch(cursor, insert_query, rows, page_size=100)
        conn.commit()
        logger.info(f"✅ Imported {len(rows)} OEM parts")
    except Exception as e:
        conn.rollback()
        logger.error(f"❌ Error importing OEM parts: {e}")
    
    cursor.close()

def log_import_stats(conn, source, entity_type, imported, skipped, errors):
    """Log import statistics"""
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO omex.import_stats (source, entity_type, count_imported, count_skipped, errors)
        VALUES (%s, %s, %s, %s, %s)
    """, (source, entity_type, imported, skipped, errors))
    conn.commit()
    cursor.close()

def main():
    logger.info("=" * 60)
    logger.info("💾 IMPORTING DATA TO DATABASE")
    logger.info("=" * 60)
    
    conn = connect_db()
    if not conn:
        return
    
    # Setup schema first
    setup_schema(conn)
    
    # Import machines
    machines_file = f"{INPUT_DIR}/combined_machines.csv"
    if os.path.exists(machines_file):
        df_machines = pd.read_csv(machines_file)
        import_machines(conn, df_machines)
        log_import_stats(conn, 'wikidata', 'machines', len(df_machines), 0, 0)
    else:
        logger.warning(f"⚠️  File not found: {machines_file}")
    
    # Import OEM parts
    parts_file = f"{INPUT_DIR}/combined_oem_parts.csv"
    if os.path.exists(parts_file):
        df_parts = pd.read_csv(parts_file)
        import_oem_parts(conn, df_parts)
        log_import_stats(conn, '777parts', 'oem_parts', len(df_parts), 0, 0)
    else:
        logger.warning(f"⚠️  File not found: {parts_file}")
    
    conn.close()
    logger.info("=" * 60)
    logger.info("✅ IMPORT COMPLETE!")
    logger.info("=" * 60)

if __name__ == "__main__":
    main()
