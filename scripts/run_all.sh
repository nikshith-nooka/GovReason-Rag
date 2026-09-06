#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "======================================================================"
echo "🚀 GovReasonRAG: One-Shot Indian Policy & Schemes Expansion Pipeline"
echo "======================================================================"

cd "$ROOT_DIR"

echo ""
echo "=== Step 1: Scrape & Build External Verified Manifest ==="
python3 scripts/scrape_schemes.py

echo ""
echo "=== Step 2: Extract AST Rules, Eligibility Thresholds & Citations ==="
python3 scripts/extract_rules.py

echo ""
echo "=== Step 3: Validate, Merge & Synchronize Knowledge Base ==="
python3 scripts/validate_and_merge.py

echo ""
echo "=== Step 4: Verify Integration with Pytest Suite ==="
python3 -m pytest tests/

echo ""
echo "======================================================================"
echo "✅ All Steps Completed Successfully!"
echo "Master Catalog: $ROOT_DIR/data/processed/schemes.json"
echo "Full Schemes:   $ROOT_DIR/data/processed/full_schemes.json"
echo "======================================================================"
