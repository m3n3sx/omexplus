#!/usr/bin/env python3
"""
Validate imported data and generate report
"""
import psycopg2
import os
import json
import logging
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Hardcoded to avoid .env conflicts
DB_HOST = 'localhost'
DB_NAME = 'medusa_db'
DB_USER = 'postgres'
DB_PASS = 'postgres'

def validate_data():
    """Validate imported data"""
    logger.info("=" * 60)
    logger.info("✅ VALIDATING DATA")
    logger.info("=" * 60)
    
    try:
        conn = psycopg2.connect(
            host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS
        )
        cursor = conn.cursor()
        
        stats = {}
        
        # Count machines
        cursor.execute("SELECT COUNT(*) FROM omex.machines")
        machine_count = cursor.fetchone()[0]
        stats['machines'] = machine_count
        logger.info(f"📦 Machines: {machine_count}")
        
        # Count OEM parts
        cursor.execute("SELECT COUNT(*) FROM omex.oem_parts")
        parts_count = cursor.fetchone()[0]
        stats['oem_parts'] = parts_count
        logger.info(f"🔧 OEM Parts: {parts_count}")
        
        # Count mappings
        cursor.execute("SELECT COUNT(*) FROM omex.machine_serial_part_map")
        map_count = cursor.fetchone()[0]
        stats['mappings'] = map_count
        logger.info(f"🔗 Mappings: {map_count}")
        
        # Count manufacturers (machines)
        cursor.execute("SELECT COUNT(DISTINCT manufacturer) FROM omex.machines")
        mfg_count = cursor.fetchone()[0]
        stats['machine_manufacturers'] = mfg_count
        logger.info(f"🏭 Machine Manufacturers: {mfg_count}")
        
        # Count manufacturers (parts)
        cursor.execute("SELECT COUNT(DISTINCT manufacturer) FROM omex.oem_parts")
        parts_mfg_count = cursor.fetchone()[0]
        stats['parts_manufacturers'] = parts_mfg_count
        logger.info(f"🏭 Parts Manufacturers: {parts_mfg_count}")
        
        # Top machine manufacturers
        cursor.execute("""
            SELECT manufacturer, COUNT(*) as count
            FROM omex.machines
            GROUP BY manufacturer
            ORDER BY count DESC
            LIMIT 10
        """)
        
        logger.info("\n📊 Top Machine Manufacturers:")
        top_mfg = []
        for mfg, count in cursor.fetchall():
            logger.info(f"  • {mfg}: {count} models")
            top_mfg.append({'manufacturer': mfg, 'count': count})
        stats['top_machine_manufacturers'] = top_mfg
        
        # Top parts manufacturers
        cursor.execute("""
            SELECT manufacturer, COUNT(*) as count
            FROM omex.oem_parts
            GROUP BY manufacturer
            ORDER BY count DESC
            LIMIT 10
        """)
        
        logger.info("\n📊 Top Parts Manufacturers:")
        top_parts_mfg = []
        for mfg, count in cursor.fetchall():
            logger.info(f"  • {mfg}: {count} parts")
            top_parts_mfg.append({'manufacturer': mfg, 'count': count})
        stats['top_parts_manufacturers'] = top_parts_mfg
        
        # Import history
        cursor.execute("""
            SELECT source, entity_type, count_imported, import_date
            FROM omex.import_stats
            ORDER BY import_date DESC
            LIMIT 10
        """)
        
        logger.info("\n📜 Recent Imports:")
        imports = []
        for source, entity, count, date in cursor.fetchall():
            logger.info(f"  • {date}: {source} -> {entity} ({count} records)")
            imports.append({
                'source': source,
                'entity_type': entity,
                'count': count,
                'date': str(date)
            })
        stats['recent_imports'] = imports
        
        cursor.close()
        conn.close()
        
        # Save stats
        os.makedirs("data/processed", exist_ok=True)
        stats_file = "data/processed/validation_report.json"
        with open(stats_file, 'w') as f:
            json.dump(stats, f, indent=2)
        
        logger.info(f"\n✅ Validation complete! Report: {stats_file}")
        
        return stats
        
    except Exception as e:
        logger.error(f"❌ Validation error: {e}")
        return None

if __name__ == "__main__":
    validate_data()
