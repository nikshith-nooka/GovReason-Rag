#!/usr/bin/env python3
"""
Validates extracted schemes and merges them with data/processed/schemes.json.
Produces data/processed/full_schemes.json (the extended catalog) while safely
preserving data/processed/schemes.json compatibility.
"""

import json
import re
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
SCHEMES_FILE = ROOT_DIR / "data" / "processed" / "schemes.json"
EXTRACTED_FILE = ROOT_DIR / "data" / "full_schemes" / "extracted_schemes.jsonl"
FULL_SCHEMES_FILE = ROOT_DIR / "data" / "processed" / "full_schemes.json"

ISO_DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def main():
    if not SCHEMES_FILE.exists():
        print(f"[!] Error: {SCHEMES_FILE} does not exist.")
        sys.exit(1)

    existing_data = load_json(SCHEMES_FILE)
    existing_schemes = existing_data.get("schemes", [])
    existing_ids = {s["id"]: s for s in existing_schemes}

    print(f"[*] Base schemes currently loaded: {len(existing_schemes)}")

    new_schemes = []
    if EXTRACTED_FILE.exists():
        with open(EXTRACTED_FILE, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    new_schemes.append(json.loads(line))
        print(f"[*] Extracted schemes from manifest: {len(new_schemes)}")
    else:
        print(f"[!] Warning: {EXTRACTED_FILE} not found. Proceeding with existing.")

    merged_map = dict(existing_ids)
    added_count = 0
    updated_count = 0

    for s in new_schemes:
        sid = s["id"]
        # Validation checks
        assert s.get("name"), f"Missing name in scheme {sid}"
        assert s.get("rules") and len(s["rules"]) > 0, f"Missing rules in scheme {sid}"

        if sid in merged_map:
            # If new has more rules or versions, enrich
            curr = merged_map[sid]
            if len(s["rules"]) > len(curr.get("rules", [])):
                merged_map[sid] = s
                updated_count += 1
        else:
            merged_map[sid] = s
            added_count += 1

    final_schemes_list = list(merged_map.values())
    # Sort for deterministic output
    final_schemes_list.sort(key=lambda x: x["id"])

    full_payload = {
        "_notice": f"GovReasonRAG Master Knowledge Base (IndiGov Extended) - Total {len(final_schemes_list)} Schemes covering Indian Central & Constitutional Policies",
        "schemes": final_schemes_list
    }

    with open(FULL_SCHEMES_FILE, "w", encoding="utf-8") as f:
        json.dump(full_payload, f, indent=2)

    print(f"✅ Merged {len(final_schemes_list)} total schemes (Added: {added_count}, Updated: {updated_count})")
    print(f"   Output written to: {FULL_SCHEMES_FILE}")

    # Also update schemes.json in-place so all existing services, tests, and endpoints immediately reflect it!
    with open(SCHEMES_FILE, "w", encoding="utf-8") as f:
        json.dump(full_payload, f, indent=2)
    print(f"   Synchronized to: {SCHEMES_FILE}")

if __name__ == "__main__":
    main()
