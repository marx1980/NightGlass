import csv,json,re,math,sys,os
# usage: python3 tools/mkdso.py <path to OpenNGC clone>   (run from the repo root)
B=os.path.join(sys.argv[1] if len(sys.argv)>1 else 'openngc','database_files')+'/'
rows=list(csv.DictReader(open(B+'NGC.csv',encoding='utf-8'),delimiter=';'))+list(csv.DictReader(open(B+'addendum.csv',encoding='utf-8'),delimiter=';'))
def nid(s):  # NGC0224 -> NGC 224
    m=re.match(r'^(NGC|IC)0*(\d+)([A-Z]?)$',s.strip()); return f"{m.group(1)} {m.group(2)}{m.group(3)}" if m else s
cald={};
for r in csv.DictReader(open('data/wikipedia/caldwell.csv')): cald[r['ID']]=r
glob={r['ID']:float(r['DistLy']) for r in csv.DictReader(open('data/wikipedia/globulars.csv'))}
KEEP={'G','GGroup','GPair','GTrpl','OCl','GCl','Cl+N','PN','HII','EmN','Neb','RfN','SNR','DrkN','*Ass'}
NEB={'Cl+N','HII','EmN','Neb','RfN','SNR','DrkN'}
GREEK={'alf':'α','bet':'β','gam':'γ','del':'δ','eps':'ε','zet':'ζ','eta':'η','tet':'θ','iot':'ι','kap':'κ','lam':'λ','mu.':'μ','nu.':'ν','ksi':'ξ','omi':'ο','pi.':'π','rho':'ρ','sig':'σ','tau':'τ','ups':'υ','phi':'φ','chi':'χ','psi':'ψ','ome':'ω'}
def greek(s): return re.sub(r'\b(alf|bet|gam|del|eps|zet|eta|tet|iot|kap|lam|mu\.|nu\.|ksi|omi|pi\.|rho|sig|tau|ups|phi|chi|psi|ome)\b',lambda m:GREEK[m.group(1)],s)
def hms(s):
    h,m,x=s.split(':'); return (float(h)+float(m)/60+float(x)/3600)*15
def dms(s):
    sg=-1 if s.strip().startswith('-') else 1; d,m,x=s.strip().lstrip('+-').split(':'); return sg*(float(d)+float(m)/60+float(x)/3600)
def f(x):
    try: return float(x)
    except: return None
out=[];src={'wiki':0,'z':0}
for r in rows:
    if r['Type'] not in KEEP or r['M'] or ' ' in r['Name'].strip() or not r['RA']: continue
    name=nid(r['Name']); maj=f(r['MajAx']) or 0
    c=cald.get(name); vm=[x for x in (f(r['V-Mag']),f(r['B-Mag'])) if x is not None]; mag=(f(c['Mag']) if c and c['Mag'] else None) or (min(vm) if vm else None); common=(c['Name'] if c and c['Name'] else greek(r['Common names'].split(',')[0])) if (c or r['Common names']) else ''
    ok=(mag is not None and mag<=13) or common or c or (r['Type'] in NEB and maj>=10)
    if not ok: continue
    dist=0;ds=0
    if c and c['Dist']: dist=float(c['Dist'])*1000; ds=1
    elif name in glob: dist=glob[name]; ds=1
    else:
        z=f(r['Redshift']); rv=f(r['RadVel'])
        cz=rv if rv else (z*299792.458 if z else None)
        if r['Type'] in ('G','GPair','GTrpl','GGroup') and cz and cz>1000:
            dist=cz/70*3.26156e6; ds=2
    if ds==1: src['wiki']+=1
    if ds==2: src['z']+=1
    rv=f(r['RadVel']) or ((f(r['Redshift']) or 0)*299792.458 or None)
    out.append([name,common,r['Type'],round(hms(r['RA']),4),round(dms(r['Dec']),4),round(maj,2),round(f(r['MinAx']) or 0,2),int(f(r['PosAng']) or -1),
                mag if mag is not None else None,r['Const'],int(round(dist)) if dist else 0,ds,r['Hubble'],int(round(rv)) if rv else 0,int(c['C']) if c else 0])
out.sort(key=lambda x:(x[8] if x[8] is not None else 14))
df=json.load(open('data/wikipedia/deepfields.json'))
for d in df: d['ra']=round(hms(d['ra']),5); d['dec']=round(dms(d['dec']),5)
json.dump({'dso':out,'fields':df},open('data/dso.json','w'),separators=(',',':'),ensure_ascii=False)
import collections
print(len(out),src,collections.Counter(x[2] for x in out).most_common())
