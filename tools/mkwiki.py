import csv, json, sys
# Applies the Wikipedia star radius and mass (data/wikipedia/stars.csv) to data/sinfo.json. Run from the repo root.
# sinfo rows: [hip, ly, spectral, K, luminosity, radius (Suns), mass (Suns), kind, varname, vmin, vmax, wikiflags]
# wikiflags: 1 = radius from Wikipedia, 2 = mass from Wikipedia. Safe to run again.
rows = json.load(open('data/sinfo.json'))
by = {r[0]: r for r in rows}
n = 0
for r in csv.DictReader(open('data/wikipedia/stars.csv', encoding='utf-8')):
    s = by.get(int(r['HIP']))
    if not s: print('no such HIP', r['HIP']); continue
    while len(s) < 12: s.append(0)
    f = 0
    if r['R']: s[5] = float(r['R']); f |= 1
    if r['M']: s[6] = float(r['M']); f |= 2
    s[11] = f; n += bool(f)
json.dump(rows, open('data/sinfo.json', 'w'), separators=(',', ':'), ensure_ascii=False)
print(n, 'stars with Wikipedia values')
# Messier distances (thousand ly; the midpoint when Wikipedia prints a range) -> data/minfo.json field 2, in light-years
mi = json.load(open('data/minfo.json')); k = 0
for r in csv.DictReader(open('data/wikipedia/messier.csv')):
    if r['M'] in mi: mi[r['M']][2] = int(round(float(r['DistKly']) * 1000)); k += 1
json.dump(mi, open('data/minfo.json', 'w'), separators=(',', ':'), ensure_ascii=False)
print(k, 'Messier distances from Wikipedia')
