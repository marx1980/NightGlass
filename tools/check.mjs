// Sanity checks after a data refresh: node tools/check.mjs   (no dependencies)
import fs from 'fs';
const fail = []; const ok = (c, m) => { if (!c) fail.push(m); };
const S = JSON.parse(fs.readFileSync('data/solar.json', 'utf8'));
ok(/^\d{4}-\d{2}-\d{2}$/.test(S.checked), 'solar.json: "checked" must be a YYYY-MM-DD date');
for (const [n, b] of Object.entries(S.bodies)) {
  ok(b.r > 100 && b.r < 1e6, `${n}: radius km out of range`); ok(b.m > 1e20 && b.m < 1e31, `${n}: mass kg out of range`);
  if ('moons' in b) ok(Number.isInteger(b.moons) && b.moons >= 0 && b.moons < 1000, `${n}: moons must be a whole number`);
  if (b.orb) ok(b.orb > 1 && b.orb < 2e5, `${n}: orbit days out of range`);
}
ok(S.moons.length === 12, 'moons: the 12 drawn moons must stay, in order (4 of Jupiter, then Mimas…Iapetus)');
['Io','Europa','Ganymede','Callisto','Mimas','Enceladus','Tethys','Dione','Rhea','Titan','Hyperion','Iapetus'].forEach((n, i) => ok(S.moons[i] && S.moons[i].n === n, `moons[${i}] must be ${n}`));
for (const m of S.moons) { ok(m.r > 10 && m.r < 3000, `${m.n}: radius`); ok(m.m > 1e15 && m.m < 1e24, `${m.n}: mass`); ok(m.per > 0.1 && m.per < 100, `${m.n}: period days`); }
for (const o of S.minor) {
  ok(o.epochJD > 2440000 && o.epochJD < 2500000, `${o.name}: epochJD`); ok(o.a > 1.5 && o.a < 2000, `${o.name}: a`); ok(o.e >= 0 && o.e < 1, `${o.name}: e`);
  ok(o.i >= 0 && o.i < 180, `${o.name}: i`); for (const k of ['node', 'peri', 'M']) ok(o[k] >= 0 && o[k] < 360, `${o.name}: ${k}`);
  ok(o.H > -3 && o.H < 10, `${o.name}: H`); ok(o.n === null || (o.n > 0 && o.n < 1), `${o.name}: n (deg/day) or null`);
}
const D = JSON.parse(fs.readFileSync('data/dso.json', 'utf8'));
ok(D.dso.length > 2500 && D.dso.length < 6000, 'dso.json: expected a few thousand objects');
ok(D.fields.length >= 4, 'dso.json: deep fields missing');
const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
ok(scripts.length >= 3, 'index.html: inline scripts missing');
scripts.forEach((s, i) => { try { new Function(s); } catch (e) { fail.push(`index.html script ${i}: ${e.message}`); } });
if (fail.length) { console.error('CHECK FAILED\n- ' + fail.join('\n- ')); process.exit(1); }
console.log(`check passed: ${Object.keys(S.bodies).length} bodies, ${S.moons.length} moons, ${S.minor.length} minor bodies, ${D.dso.length} deep-sky objects`);
