#!/usr/bin/env python3
"""
Combine all downloaded datasets into unified format
"""
import pandas as pd
import os
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

INPUT_DIR = "data/downloads"
OUTPUT_DIR = "data/processed"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_and_combine_csvs(pattern, column_mapping=None):
    """Load all CSV files matching pattern and combine"""
    files = [f for f in os.listdir(INPUT_DIR) if f.startswith(pattern) and f.endswith('.csv')]
    
    if not files:
        logger.warning(f"⚠️  No files found for pattern: {pattern}")
        return pd.DataFrame()
    
    logger.info(f"📚 Combining {len(files)} files for {pattern}...")
    
    dfs = []
    for file in files:
        try:
            df = pd.read_csv(os.path.join(INPUT_DIR, file))
            if column_mapping:
                df = df.rename(columns=column_mapping)
            dfs.append(df)
            logger.info(f"  ✓ Loaded {file} ({len(df)} rows)")
        except Exception as e:
            logger.error(f"  ✗ Error loading {file}: {e}")
    
    if dfs:
        combined = pd.concat(dfs, ignore_index=True)
        logger.info(f"✅ Combined {len(combined)} rows")
        return combined
    
    return pd.DataFrame()

def main():
    logger.info("=" * 60)
    logger.info("🔗 COMBINING ALL DATASETS")
    logger.info("=" * 60)
    
    # Combine machines from Wikidata and sample data
    logger.info("\n📦 Combining MACHINES...")
    machines = load_and_combine_csvs("wikidata_")
    sample_machines = load_and_combine_csvs("sample_machines")
    
    if not sample_machines.empty:
        if machines.empty:
            machines = sample_machines
        else:
            machines = pd.concat([machines, sample_machines], ignore_index=True)
    
    if not machines.empty:
        # Normalize columns
        machines = machines.rename(columns={
            'machineLabel': 'model_code',
            'manufacturerLabel': 'manufacturer'
        })
        machines['data_source'] = 'wikidata'
        output = f"{OUTPUT_DIR}/combined_machines.csv"
        machines.to_csv(output, index=False)
        logger.info(f"💾 Saved {output} ({len(machines)} rows)")
    
    # Combine OEM parts from 777parts or sample data
    logger.info("\n🔧 Combining OEM PARTS...")
    parts = load_and_combine_csvs("777parts_")
    
    # If no 777parts data, use sample data
    if parts.empty:
        logger.info("  No 777parts data, loading sample data...")
        parts = load_and_combine_csvs("sample_oem_")
    
    if not parts.empty:
        # Normalize columns
        parts = parts.rename(columns={
            'part_number': 'oem_part_number',
            'description': 'description_en'
        })
        parts['data_source'] = '777parts.net'
        
        # Remove duplicates
        parts = parts.drop_duplicates(subset=['oem_part_number', 'manufacturer'], keep='first')
        
        output = f"{OUTPUT_DIR}/combined_oem_parts.csv"
        parts.to_csv(output, index=False)
        logger.info(f"💾 Saved {output} ({len(parts)} rows)")
    
    logger.info("=" * 60)
    logger.info("✅ COMBINATION COMPLETE!")
    logger.info("=" * 60)

if __name__ == "__main__":
    main()
