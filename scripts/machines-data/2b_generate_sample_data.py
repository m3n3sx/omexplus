#!/usr/bin/env python3
"""
Generate sample parts data for testing
Since 777parts blocks scraping, we'll create realistic sample data
"""
import csv
import os
import logging
import random

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

OUTPUT_DIR = "data/downloads"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Sample data based on real part patterns
MANUFACTURERS = {
    'CATERPILLAR': {
        'prefix': 'CAT',
        'models': ['320D', '320E', '330D', '336D', '349D', 'D6T', 'D8T', '950H', '966H', '980H'],
        'part_prefixes': ['1R-', '5I-', '7C-', '9M-', '320-', '326-', '330-'],
    },
    'KOMATSU': {
        'prefix': 'KOM',
        'models': ['PC200', 'PC210', 'PC300', 'PC350', 'PC400', 'WA320', 'WA380', 'D65', 'D85'],
        'part_prefixes': ['600-', '6136-', '6151-', '6211-', '6742-', '07000-'],
    },
    'HITACHI': {
        'prefix': 'HIT',
        'models': ['ZX200', 'ZX210', 'ZX330', 'ZX350', 'ZX470', 'ZW220', 'ZW310'],
        'part_prefixes': ['4649267', '4654748', '4656608', '4657039', '4658677'],
    },
    'VOLVO': {
        'prefix': 'VOL',
        'models': ['EC210', 'EC240', 'EC290', 'EC360', 'EC480', 'L90', 'L120', 'L150'],
        'part_prefixes': ['VOE', '14', '15', '17', '20'],
    },
    'DOOSAN': {
        'prefix': 'DOO',
        'models': ['DX225', 'DX300', 'DX340', 'DX420', 'DX520', 'DL300', 'DL420'],
        'part_prefixes': ['K10', 'K90', '2474-', '400-', '65-'],
    },
    'JCB': {
        'prefix': 'JCB',
        'models': ['JS200', 'JS220', 'JS330', 'JS370', '3CX', '4CX', '535-95'],
        'part_prefixes': ['32/', '320/', '333/', '02/', '05/'],
    },
}

PART_TYPES = [
    ('filter', 'Filtr', ['oleju', 'paliwa', 'powietrza', 'hydrauliczny', 'kabinowy']),
    ('pump', 'Pompa', ['hydrauliczna', 'paliwa', 'wody', 'oleju']),
    ('seal', 'Uszczelka', ['cylindra', 'pompy', 'silnika', 'skrzyni']),
    ('bearing', 'Łożysko', ['wału', 'koła', 'przekładni', 'silnika']),
    ('gasket', 'Uszczelka', ['głowicy', 'miski olejowej', 'pokrywy']),
    ('belt', 'Pasek', ['klinowy', 'rozrządu', 'alternatora']),
    ('hose', 'Wąż', ['hydrauliczny', 'paliwowy', 'chłodnicy']),
    ('cylinder', 'Cylinder', ['hydrauliczny', 'łyżki', 'wysięgnika', 'ramienia']),
]

def generate_part_number(mfg_data):
    """Generate realistic part number"""
    prefix = random.choice(mfg_data['part_prefixes'])
    suffix = ''.join([str(random.randint(0, 9)) for _ in range(4)])
    return f"{prefix}{suffix}"

def generate_parts_for_manufacturer(mfg_name, mfg_data, count=500):
    """Generate sample parts for a manufacturer"""
    parts = []
    
    for _ in range(count):
        part_type, part_name_pl, subtypes = random.choice(PART_TYPES)
        subtype = random.choice(subtypes)
        model = random.choice(mfg_data['models'])
        
        part_number = generate_part_number(mfg_data)
        description_en = f"{part_type.title()} {subtype} for {mfg_name} {model}"
        description_pl = f"{part_name_pl} {subtype} do {mfg_name} {model}"
        
        parts.append({
            'oem_part_number': part_number,
            'description_en': description_en,
            'description_pl': description_pl,
            'manufacturer': mfg_name,
            'model': model,
            'part_type': part_type,
            'data_source': 'sample_data',
        })
    
    return parts

def main():
    logger.info("=" * 60)
    logger.info("🔧 GENERATING SAMPLE PARTS DATA")
    logger.info("=" * 60)
    
    all_parts = []
    
    for mfg_name, mfg_data in MANUFACTURERS.items():
        logger.info(f"📦 Generating parts for {mfg_name}...")
        parts = generate_parts_for_manufacturer(mfg_name, mfg_data, count=500)
        all_parts.extend(parts)
        logger.info(f"  ✓ Generated {len(parts)} parts")
    
    # Save to CSV
    output_file = f"{OUTPUT_DIR}/sample_oem_parts.csv"
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=all_parts[0].keys())
        writer.writeheader()
        writer.writerows(all_parts)
    
    logger.info(f"\n💾 Saved {len(all_parts)} parts to {output_file}")
    
    # Also generate sample machines
    machines = []
    for mfg_name, mfg_data in MANUFACTURERS.items():
        for model in mfg_data['models']:
            year_from = random.randint(2005, 2020)
            machines.append({
                'manufacturer': mfg_name,
                'model_code': model,
                'model_family': model[:2] if len(model) > 2 else model,
                'year_from': year_from,
                'year_to': year_from + random.randint(3, 10),
                'data_source': 'sample_data',
            })
    
    machines_file = f"{OUTPUT_DIR}/sample_machines.csv"
    with open(machines_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=machines[0].keys())
        writer.writeheader()
        writer.writerows(machines)
    
    logger.info(f"💾 Saved {len(machines)} machines to {machines_file}")
    
    logger.info("=" * 60)
    logger.info("✅ SAMPLE DATA GENERATION COMPLETE!")
    logger.info("=" * 60)

if __name__ == "__main__":
    main()
