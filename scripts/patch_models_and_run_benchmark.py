#!/usr/bin/env python3
"""
Adds dynamic parameters support to CitizenContext in packages/shared_types/models.py:
- custom_attributes: Dict[str, Any]
- overrides __getattr__ so context.indian_citizen_status seamlessly works!
"""

from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
MODELS_FILE = ROOT_DIR / "packages" / "shared_types" / "models.py"

content = open(MODELS_FILE).read()

old_block = """    existing_schemes_enrolled: List[str] = Field(default_factory=list)
    raw_query: Optional[str] = \"\""""

new_block = """    existing_schemes_enrolled: List[str] = Field(default_factory=list)
    raw_query: Optional[str] = \"\"
    custom_attributes: Dict[str, Any] = Field(default_factory=dict)

    def __getattr__(self, item: str) -> Any:
        if item in self.__dict__:
            return self.__dict__[item]
        if "custom_attributes" in self.__dict__ and item in self.__dict__["custom_attributes"]:
            return self.__dict__["custom_attributes"][item]
        raise AttributeError(f"'{self.__class__.__name__}' object has no attribute '{item}'")"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open(MODELS_FILE, "w") as f:
        f.write(content)
    print("✅ Successfully patched CitizenContext to support custom_attributes seamlessly!")
else:
    print("[*] CitizenContext already contains custom_attributes.")
