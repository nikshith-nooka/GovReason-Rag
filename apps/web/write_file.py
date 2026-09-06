import sys

target = sys.argv[1]
content = sys.stdin.read()
with open(target, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"Wrote {len(content)} bytes to {target}")
