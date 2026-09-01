"""Merge (key, vi, en) triples into src/utils/locales/{vi,en}.json.

Both catalogs are written from the same input, so a key can never exist in one
language and not the other. Reads TSV on stdin: key<TAB>vi<TAB>en
"""
import json, sys, os

BASE = os.path.join('src', 'utils', 'locales')
rows = []
for line in sys.stdin.read().split('\n'):
    if not line.strip() or line.startswith('#'):
        continue
    parts = line.split('\t')
    if len(parts) != 3:
        sys.exit(f'bad row (expected 3 tab-separated fields): {line!r}')
    rows.append([p.strip() for p in parts])

for lang, idx in (('vi', 1), ('en', 2)):
    path = os.path.join(BASE, f'{lang}.json')
    data = json.load(open(path, encoding='utf-8')) if os.path.exists(path) else {}
    for key, vi, en in rows:
        data[key] = (vi, en)[idx - 1]
    data = dict(sorted(data.items()))
    with open(path, 'w', encoding='utf-8') as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
        fh.write('\n')
    print(f'{lang}.json: {len(data)} keys')
