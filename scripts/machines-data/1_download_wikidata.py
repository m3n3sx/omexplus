#!/usr/bin/env python3
"""
Download machine data from Wikidata SPARQL endpoint
"""
import requests
import csv
import os
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql"
OUTPUT_DIR = "data/downloads"

os.makedirs(OUTPUT_DIR, exist_ok=True)

SPARQL_QUERIES = {
    "excavators": """
        SELECT ?machine ?machineLabel ?manufacturer ?manufacturerLabel ?yearFrom ?yearTo
        WHERE {
            ?machine wdt:P31 wd:Q107099.
            ?machine wdt:P176 ?manufacturer.
            OPTIONAL { ?machine wdt:P571 ?yearFrom. }
            OPTIONAL { ?machine wdt:P576 ?yearTo. }
            SERVICE wikibase:label { 
                bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". 
            }
        }
        LIMIT 1000
    """,
    
    "wheel_loaders": """
        SELECT ?machine ?machineLabel ?manufacturer ?manufacturerLabel
        WHERE {
            ?machine wdt:P31 wd:Q1452524.
            ?machine wdt:P176 ?manufacturer.
            SERVICE wikibase:label { 
                bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". 
            }
        }
        LIMIT 500
    """,
    
    "dozers": """
        SELECT ?machine ?machineLabel ?manufacturer ?manufacturerLabel
        WHERE {
            ?machine wdt:P31 wd:Q1230649.
            ?machine wdt:P176 ?manufacturer.
            SERVICE wikibase:label { 
                bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". 
            }
        }
        LIMIT 500
    """,
    
    "engines": """
        SELECT ?engine ?engineLabel ?manufacturer ?manufacturerLabel ?displacement
        WHERE {
            ?engine wdt:P31 wd:Q615645.
            ?engine wdt:P176 ?manufacturer.
            OPTIONAL { ?engine wdt:P1672 ?displacement. }
            SERVICE wikibase:label { 
                bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". 
            }
        }
        LIMIT 2000
    """
}

def download_wikidata_query(query_name, sparql_query):
    """Download data from Wikidata SPARQL endpoint"""
    logger.info(f"📥 Downloading {query_name}...")
    
    try:
        response = requests.get(
            WIKIDATA_ENDPOINT,
            params={
                "query": sparql_query,
                "format": "csv"
            },
            headers={
                "User-Agent": "OMEX-DataBot/1.0 (https://ooxo.pl)"
            },
            timeout=60
        )
        response.raise_for_status()
        
        output_file = f"{OUTPUT_DIR}/wikidata_{query_name}.csv"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(response.text)
        
        # Count rows
        rows = len(response.text.split('\n')) - 2
        logger.info(f"✅ Downloaded {rows} rows to {output_file}")
        
        return output_file
        
    except Exception as e:
        logger.error(f"❌ Error downloading {query_name}: {e}")
        return None

def main():
    logger.info("=" * 60)
    logger.info("🌐 DOWNLOADING DATA FROM WIKIDATA")
    logger.info("=" * 60)
    
    for query_name, sparql_query in SPARQL_QUERIES.items():
        download_wikidata_query(query_name, sparql_query)
    
    logger.info("✅ Wikidata download complete!")

if __name__ == "__main__":
    main()
