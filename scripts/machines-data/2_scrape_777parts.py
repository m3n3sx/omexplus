#!/usr/bin/env python3
"""
Scrape parts data from 777parts.net
"""
import requests
from bs4 import BeautifulSoup
import csv
import os
import logging
from time import sleep

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

OUTPUT_DIR = "data/downloads"
os.makedirs(OUTPUT_DIR, exist_ok=True)

BASE_URL = "https://777parts.net"
MANUFACTURERS = [
    'caterpillar',
    'komatsu',
    'doosan',
    'jcb',
    'case',
    'newholland',
    'bobcat',
    'hitachi',
    'volvo',
    'terex',
    'hyundai',
    'yanmar',
]

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

def scrape_manufacturer(mfg_name):
    """Scrape parts for single manufacturer from 777parts"""
    logger.info(f"🔍 Scraping {mfg_name.upper()} from 777parts.net...")
    
    url = f"{BASE_URL}/{mfg_name}/search.html"
    parts_list = []
    
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find parts table - adjust selector based on actual HTML structure
        tables = soup.find_all('table')
        
        if not tables:
            logger.warning(f"⚠️  No tables found for {mfg_name}")
            return parts_list
        
        for table in tables:
            rows = table.find_all('tr')[1:]  # Skip header
            
            for row in rows:
                cols = row.find_all('td')
                if len(cols) >= 2:
                    part_data = {
                        'part_number': cols[0].text.strip() if len(cols) > 0 else '',
                        'description': cols[1].text.strip() if len(cols) > 1 else '',
                        'model': cols[2].text.strip() if len(cols) > 2 else '',
                        'manufacturer': mfg_name.upper(),
                        'source': '777parts.net',
                        'source_url': url
                    }
                    parts_list.append(part_data)
        
        logger.info(f"✅ Scraped {len(parts_list)} parts for {mfg_name}")
        
        # Save to CSV
        output_file = f"{OUTPUT_DIR}/777parts_{mfg_name}.csv"
        if parts_list:
            keys = parts_list[0].keys()
            with open(output_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=keys)
                writer.writeheader()
                writer.writerows(parts_list)
            logger.info(f"💾 Saved to {output_file}")
        
        # Be nice to the server
        sleep(2)
        
        return parts_list
        
    except Exception as e:
        logger.error(f"❌ Error scraping {mfg_name}: {e}")
        return []

def main():
    logger.info("=" * 60)
    logger.info("🕷️  SCRAPING 777PARTS.NET")
    logger.info("=" * 60)
    logger.info(f"🔄 Will scrape {len(MANUFACTURERS)} manufacturers")
    logger.info("⏳ This takes 5-10 minutes, be patient...")
    logger.info("=" * 60)
    
    total_parts = 0
    for mfg in MANUFACTURERS:
        parts = scrape_manufacturer(mfg)
        total_parts += len(parts)
    
    logger.info("=" * 60)
    logger.info(f"✅ COMPLETE! Scraped {total_parts} parts total")
    logger.info("=" * 60)

if __name__ == "__main__":
    main()
