import csv,json,os,sys
# usage: python3 tools/mkmgal.py <path to OpenNGC clone>   (run from the repo root)
# Writes data/mgal.json: Messier galaxy shape for the map icons: {"M31": [kind, major arcmin, minor arcmin, position angle]}
# kind: s spiral, w weakly barred spiral (SAB), b barred spiral (SB), l lenticular, e elliptical, i irregular.
# Sizes and position angles come from OpenNGC; the kind is the de Vaucouleurs class from Wikipedia (OpenNGC's Hubble type has no bar information).
B=os.path.join(sys.argv[1] if len(sys.argv)>1 else 'openngc','database_files')+'/'
KIND={'M31':'s','M32':'e','M33':'s','M49':'e','M51':'s','M58':'w','M59':'e','M60':'e','M61':'w','M63':'s','M64':'s','M65':'w','M66':'w','M74':'s','M77':'s',
 'M81':'s','M82':'i','M83':'w','M84':'e','M85':'l','M86':'e','M87':'e','M88':'s','M89':'e','M90':'w','M91':'b','M94':'s','M95':'b','M96':'w','M98':'w','M99':'s',
 'M100':'w','M101':'w','M102':'l','M104':'s','M105':'e','M106':'w','M108':'b','M109':'b','M110':'e'}
rows=list(csv.DictReader(open(B+'NGC.csv',encoding='utf-8'),delimiter=';'))+list(csv.DictReader(open(B+'addendum.csv',encoding='utf-8'),delimiter=';'))
byName={r['Name']:r for r in rows}; byM={'M'+str(int(r['M'])):r for r in rows if r['M'] and r['Type']=='G'}
byM['M102']=byName['NGC5866']  # OpenNGC lists M102 as a duplicate of M101; M102 is usually taken to be NGC 5866
def f(x):
    try: return float(x)
    except: return 0
out={}
for m,k in KIND.items():
    r=byM[m]; out[m]=[k,f(r['MajAx']),f(r['MinAx']),int(f(r['PosAng'])) if r['PosAng'] else -1]
json.dump(out,open('data/mgal.json','w'),separators=(',',':'))
print(len(out),'Messier galaxies')
