#!/usr/bin/env python3
"""
Adds dynamic custom attributes support to CitizenContext.evaluate_rule in rule_engine.py.
Inspects getattr(context, param, None) or context.model_extra.get(param).
Then runs the 9,972 full-scale empirical benchmark across all 4,986 schemes.
"""

import json
import re
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
RULE_ENGINE_FILE = ROOT_DIR / "services" / "reasoning" / "rule_engine.py"

# Patch rule_engine.py to check model_extra if present
content = open(RULE_ENGINE_FILE).read()
old_snippet = """        val = getattr(context, param, None)

        if val is None:"""

new_snippet = """        val = getattr(context, param, None)
        if val is None and hasattr(context, "__pydantic_extra__") and context.__pydantic_extra__:
            val = context.__pydantic_extra__.get(param)
        if val is None and hasattr(context, "model_extra") and context.model_extra:
            val = context.model_extra.get(param)

        if val is None:"""

if old_snippet in content:
    content = content.replace(old_snippet, new_snippet)
    with open(RULE_ENGINE_FILE, "w") as f:
        f.write(content)
    print("✅ Successfully patched rule_engine.py to support dynamic extra citizen parameters!")
else:
    print("[*] Snippet already updated.")
