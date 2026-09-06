#!/usr/bin/env python3
"""
Downloads all authentic schemes from api.myscheme.gov.in using Elasticsearch pagination (from=X&size=Y).
Stores full raw response in data/raw_downloads/myscheme_4772_raw.json.
"""

import json
import time
import urllib.request
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
OUT_FILE = ROOT_DIR / "data" / "raw_downloads" / "myscheme_4772_raw.json"

API_BASE = "https://api.myscheme.gov.in/search/v6/schemes?lang=en"
API_KEY = "tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc"
PAGE_SIZE = 100
MAX_SCHEMES = 4772

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)",
    "x-api-key": API_KEY,
    "Accept": "application/json"
}

def main():
    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    all_items = []
    offset = 0

    print(f"[*] Starting download of all real schemes from api.myscheme.gov.in...")
    
    while offset < MAX_SCHEMES:
        url = f"{API_BASE}&from={offset}&size={PAGE_SIZE}"
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                items = data.get("data", {}).get("hits", {}).get("items", [])
                if not items:
                    print(f"[*] No items returned at offset {offset}. Done.")
                    break
                all_items.extend(items)
                print(f"  -> Offset {offset:04d}: Fetched {len(items)} schemes | Total: {len(all_items)}/{MAX_SCHEMES}")
                offset += len(items)
                time.sleep(0.05)
        except Exception as e:
            print(f"[!] Exception at offset {offset}: {e}. Retrying in 1s...")
            time.sleep(1)

    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_items, f, indent=2)

    print(f"\n✅ Finished! Successfully saved {len(all_items)} raw real schemes to:")
    print(f"   {OUT_FILE}")

if __name__ == "__main__":
    main()
