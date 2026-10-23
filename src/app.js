(function () {
"use strict";
const A = window.Astronomy;
const D = Math.PI / 180;
const $ = (s) => document.getElementById(s);
const cv = $("sky"), ctx = cv.getContext("2d");

if (!A) {
  $("name").textContent = "Couldn't load";
  $("kind").textContent = "Error";
  $("fact").textContent = "The astronomy library didn't load. Check your connection and reload the page.";
  return;
}

/* ---------- facts ---------- */
const FACTS = {
  Sirius: "The brightest star in the night sky, 8.6 light-years away. Look for it below and left of Orion's belt in winter.",
  Canopus: "Second-brightest star in the sky, a white supergiant in the far southern sky.",
  Arcturus: "Brightest star north of the celestial equator, an orange giant 37 light-years away. Follow the arc of the Big Dipper's handle to find it.",
  Vega: "One corner of the Summer Triangle, 25 light-years away. Overhead on summer evenings.",
  Capella: "A bright yellow point in Auriga that is really two pairs of stars, 43 light-years away.",
  Rigel: "Blue supergiant marking Orion's foot, several hundred light-years away.",
  Procyon: "The Little Dog's eye, only 11.5 light-years away.",
  Betelgeuse: "Red supergiant on Orion's shoulder. Its brightness varies noticeably over months.",
  Altair: "Summer Triangle corner, 17 light-years away. It spins so fast it is flattened at the poles.",
  Aldebaran: "The orange eye of Taurus the Bull, 65 light-years away. It sits in front of the Hyades cluster, not inside it.",
  Antares: "Red supergiant at the heart of Scorpius. The name means 'rival of Mars' for its colour.",
  Spica: "Brightest star in Virgo, a close pair of hot blue stars.",
  Pollux: "The brighter of the Gemini twins, an orange giant 34 light-years away.",
  Castor: "The other Gemini twin. A telescope splits it, and the whole system holds six stars.",
  Fomalhaut: "The lone bright star low in the south on autumn evenings, 25 light-years away.",
  Deneb: "Tail of Cygnus and a Summer Triangle corner. A supergiant so far away it outshines Vega by thousands of times.",
  Regulus: "Heart of Leo, at the bottom of the backwards question mark that forms the lion's head.",
  Polaris: "The North Star. It stays almost fixed while the rest of the sky turns around it, so it marks north.",
  Algol: "The Demon Star. It visibly dims every 2.87 days when a companion star passes in front of it.",
  Mizar: "In the Big Dipper's handle. Good eyes see its fainter neighbour Alcor right beside it.",
  Albireo: "Base of the Northern Cross. A small telescope shows a gold star and a blue one side by side.",
  Mira: "A pulsating giant that swings from easy naked-eye brightness to invisible over about 11 months.",
  Dubhe: "One of the two pointer stars. A line from Merak through Dubhe leads to Polaris.",
  Merak: "One of the two pointer stars. A line from Merak through Dubhe leads to Polaris.",
  Alcyone: "Brightest star of the Pleiades cluster.",
  Bellatrix: "Orion's other shoulder, a hot blue giant.",
  Alnilam: "The middle star of Orion's belt.",
  Alnitak: "The eastern star of Orion's belt. The Flame and Horsehead nebulae sit right beside it.",
  Mintaka: "The western star of Orion's belt, almost exactly on the celestial equator.",
  Alpheratz: "Shared corner of Andromeda and the Great Square of Pegasus.",
  Mirach: "Star-hop from here up two stars to find the Andromeda Galaxy.",
  Shedar: "One of the five stars forming the W of Cassiopeia.",
  Caph: "One of the five stars forming the W of Cassiopeia.",
  Alkaid: "The end of the Big Dipper's handle.",
  Alioth: "The brightest star in the Big Dipper.",
  Kochab: "One of the two guardian stars at the end of the Little Dipper's bowl.",
  Rasalhague: "Head of Ophiuchus, the serpent bearer.",
  Hamal: "Brightest star in Aries.",
  Menkar: "Marks the jaw of Cetus, the sea monster.",
  Diphda: "Brightest star in Cetus, alone in a sparse part of the autumn sky.",
  Enif: "The nose of Pegasus.",
  Markab: "Corner of the Great Square of Pegasus.",
  Scheat: "Corner of the Great Square of Pegasus, a red giant.",
  Algenib: "Corner of the Great Square of Pegasus.",
  Mirfak: "Brightest star in Perseus, inside a loose cluster that looks lovely in binoculars.",
  Denebola: "The tail of Leo the Lion.",
  Achernar: "End of the river Eridanus. It spins so fast it is squashed into an egg shape.",
  Hadar: "One of the two pointer stars that lead to the Southern Cross.",
  Acrux: "Brightest star of the Southern Cross.",
  Shaula: "The stinger of Scorpius, low in the south in summer.",
  Nunki: "Part of the Teapot in Sagittarius.",
  "Kaus Australis": "Brightest star of the Teapot in Sagittarius.",
};
const BODY_FACTS = {
  Sun: "Never look at the Sun directly or through binoculars.",
  Mercury: "Closest planet to the Sun. Only seen low in twilight, shortly after sunset or before sunrise.",
  Venus: "The brightest planet, often called the morning or evening star. Binoculars show its phase.",
  Mars: "The red planet. Its brightness changes a lot as Earth's distance to it changes.",
  Jupiter: "The largest planet. Binoculars held steady show up to four of its moons as tiny dots in a line.",
  Saturn: "The ringed planet. Any small telescope shows the rings.",
  Uranus: "At the edge of naked-eye visibility. Easy in binoculars if you know exactly where to look.",
  Neptune: "Too faint for the naked eye. You need binoculars or a telescope.",
  Pluto: "Counted as the ninth planet until 2006, when it was reclassified as a dwarf planet. You need a telescope of about 20 cm to see it.",
};
const MESSIER_FACTS = {
  M31: "The Andromeda Galaxy, the nearest large galaxy to our own. Under dark skies it shows as a faint smudge to the naked eye.",
  M45: "The Pleiades, or Seven Sisters. A young star cluster that most people see as six or seven stars; beautiful in binoculars.",
  M42: "The Orion Nebula, a star nursery in Orion's sword. Visible as a fuzzy star to the naked eye.",
  M44: "The Beehive Cluster in Cancer. A misty patch to the eye, dozens of stars in binoculars.",
  M13: "The Great Hercules Cluster, several hundred thousand stars packed into a ball. Binoculars show a fuzzy dot.",
  M8: "The Lagoon Nebula, visible in binoculars above the spout of the Sagittarius Teapot.",
  M7: "Ptolemy's Cluster, a bright cluster near the tail of Scorpius, easy in binoculars.",
  M33: "The Triangulum Galaxy. Large but faint; needs a dark sky.",
  M81: "Bode's Galaxy, a bright spiral near the Big Dipper, visible in binoculars from a dark site.",
  M57: "The Ring Nebula, a shell of gas thrown off by a dying star. Needs a telescope.",
  M27: "The Dumbbell Nebula, a dying star's gas shell. Binoculars show a faint patch.",
  M1: "The Crab Nebula, debris from a supernova seen in the year 1054.",
};
const TYPE = { gc: "Globular cluster", oc: "Open cluster", s: "Spiral galaxy", e: "Elliptical galaxy", i: "Irregular galaxy",
  sfr: "Nebula", pn: "Planetary nebula", snr: "Supernova remnant", rn: "Reflection nebula", pos: "Star field" };
const BODIES = [
  { n: "Sun", c: "#ffd36b", r: 9 }, { n: "Moon", c: "#e9e6dc", r: 9 },
  { n: "Mercury", c: "#cdbfae", r: 3.2 }, { n: "Venus", c: "#fff3d2", r: 4.6 }, { n: "Mars", c: "#ff8a5c", r: 3.8 },
  { n: "Jupiter", c: "#f4dcb4", r: 4.4 }, { n: "Saturn", c: "#ead39b", r: 4 },
  { n: "Uranus", c: "#a8e3e8", r: 2.6 }, { n: "Neptune", c: "#86a8ff", r: 2.4 }, { n: "Pluto", c: "#d6c3ae", r: 2 },
];

/* ---------- places & time zones ---------- */
const TZS = CITIES.tz, CROWS = CITIES.c; // rows: name, country, region, lat, lon, tz index, population (sorted by population)
const FOLD = { "ø": "o", "æ": "ae", "œ": "oe", "ß": "ss", "đ": "d", "ł": "l", "ı": "i", "þ": "th", "ð": "d", "’": "'", "‘": "'" };
const fold = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[øæœßđłıþð’‘]/g, (c) => FOLD[c]);
const CN = CROWS.map((c) => [fold(c[0]), fold(c[1])]);
const FMT = {};
function parts(ms, tz) {
  let f = FMT[tz];
  if (!f) f = FMT[tz] = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" });
  const o = {}; for (const p of f.formatToParts(new Date(ms))) o[p.type] = p.value;
  return o;
}
function validTz(tz) { try { parts(0, tz); return true; } catch (e) { return false; } }
function tzOff(ms, tz) {
  const o = parts(ms, tz), h = +o.hour === 24 ? 0 : +o.hour;
  return Date.UTC(+o.year, o.month - 1, +o.day, h, +o.minute, +o.second) - Math.floor(ms / 1000) * 1000;
}
function tzFor(lat, lon) {
  // time zone of the nearest listed city; over open ocean fall back to the nautical zone
  let best = -1, bd = 9;
  const p1 = lat * D, cl = Math.cos(p1), sl = Math.sin(p1);
  for (let i = 0; i < CROWS.length; i++) {
    const p2 = CROWS[i][3] * D;
    const d = Math.acos(Math.max(-1, Math.min(1, sl * Math.sin(p2) + cl * Math.cos(p2) * Math.cos((CROWS[i][4] - lon) * D))));
    if (d < bd) { bd = d; best = i; }
  }
  if (best >= 0 && bd * 6371 < 1200 && validTz(TZS[CROWS[best][5]])) return TZS[CROWS[best][5]];
  const n = Math.max(-12, Math.min(12, Math.round(lon / 15)));
  return n === 0 ? "Etc/UTC" : "Etc/GMT" + (n > 0 ? "-" : "+") + Math.abs(n);
}

/* ---------- settings ---------- */
const S = Object.assign({ lines: true, labels: true, red: false, camFov: null }, load());
function load() { try { return JSON.parse(localStorage.getItem("nightglass") || "{}"); } catch (e) { return {}; } }
function save() { try { localStorage.setItem("nightglass", JSON.stringify({ lat: S.lat, lon: S.lon, place: S.place, country: S.country, tz: S.tz, lines: S.lines, labels: S.labels, red: S.red, camFov: S.camFov, cardMode: S.cardMode })); } catch (e) {} }
function setCity(c) { S.lat = c[3]; S.lon = c[4]; S.place = c[0]; S.country = c[1]; S.tz = TZS[c[5]]; }
if (!(typeof S.lat === "number" && isFinite(S.lat) && typeof S.lon === "number" && isFinite(S.lon))) {
  // first visit: start in the biggest city of the browser's own time zone
  let tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
  const c = CROWS.find((r) => TZS[r[5]] === tz);
  if (c) setCity(c); else Object.assign(S, { lat: 51.478, lon: 0, place: "Greenwich", country: "United Kingdom", tz: "Europe/London" });
}
if (!S.tz || !validTz(S.tz)) S.tz = tzFor(S.lat, S.lon);
let T = null; // null = live; otherwise the chosen wall-clock time at the location, as a UTC-based ms count
const wallToUtc = (w) => { let u = w - tzOff(w, S.tz); return w - tzOff(u, S.tz); };
const utcToWall = (ms) => ms + tzOff(ms, S.tz);
const skyMs = () => (T === null ? Date.now() : wallToUtc(T));

/* ---------- data prep ---------- */
function eqv(ra, dec, out, i) {
  const r = ra * D, d = dec * D, c = Math.cos(d);
  out[i] = c * Math.cos(r); out[i + 1] = c * Math.sin(r); out[i + 2] = Math.sin(d);
}
const st = SKY.stars, NS = st.length / 4;
const sEq = new Float32Array(NS * 3), sH = new Float32Array(NS * 3);
const sCol = new Array(NS);
for (let i = 0; i < NS; i++) { eqv(st[i * 4], st[i * 4 + 1], sEq, i * 3); sCol[i] = bvColor(st[i * 4 + 3]); }
const NAMES = SKY.names;
const NL = SKY.lines.length / 2;
const lEq = new Float32Array(NL * 3), lH = new Float32Array(NL * 3);
for (let i = 0; i < NL; i++) eqv(SKY.lines[i * 2], SKY.lines[i * 2 + 1], lEq, i * 3);
const CONS = SKY.cons, cEq = new Float32Array(CONS.length * 3), cH = new Float32Array(CONS.length * 3);
CONS.forEach((c, i) => eqv(c[2], c[3], cEq, i * 3));
const MES = SKY.messier, mEq = new Float32Array(MES.length * 3), mH = new Float32Array(MES.length * 3);
MES.forEach((m, i) => eqv(m[4], m[5], mEq, i * 3));
const bod = BODIES.map((b) => ({ ...b, h: [0, 0, -1], mag: 0, alt: 0, az: 0 }));
let rot = null, moonPhase = 0, sunAlt = -30, skyDate = new Date();

function bvColor(bv) {
  const stops = [[-0.3, [155, 180, 255]], [0, [200, 214, 255]], [0.3, [246, 246, 255]], [0.6, [255, 243, 226]], [1.0, [255, 214, 165]], [1.5, [255, 182, 110]], [2.0, [255, 160, 90]]];
  if (bv <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) if (bv <= stops[i][0]) {
    const [a, ca] = stops[i - 1], [b, cb] = stops[i], t = (bv - a) / (b - a);
    return ca.map((v, k) => Math.round(v + (cb[k] - v) * t));
  }
  return stops[stops.length - 1][1];
}

function updateSky() {
  skyDate = new Date(skyMs());
  const t = A.MakeTime(skyDate), obs = new A.Observer(S.lat, S.lon, 0);
  const r = A.Rotation_EQJ_HOR(t, obs).rot;
  rot = r;
  const xf = (src, dst, n) => {
    for (let i = 0; i < n * 3; i += 3) {
      const x = src[i], y = src[i + 1], z = src[i + 2];
      const hx = r[0][0] * x + r[1][0] * y + r[2][0] * z;
      const hy = r[0][1] * x + r[1][1] * y + r[2][1] * z;
      const hz = r[0][2] * x + r[1][2] * y + r[2][2] * z;
      dst[i] = -hy; dst[i + 1] = hx; dst[i + 2] = hz; // east, north, up
    }
  };
  xf(sEq, sH, NS); xf(lEq, lH, NL); xf(cEq, cH, CONS.length); xf(mEq, mH, MES.length); xf(dEq, dH, NDS); xf(fEq, fH, DF.length);
  for (const b of bod) {
    try {
      const e = A.Equator(b.n, t, obs, true, true);
      const h = A.Horizon(t, obs, e.ra, e.dec);
      b.alt = h.altitude; b.az = h.azimuth;
      const ca = Math.cos(b.alt * D);
      b.h = [ca * Math.sin(b.az * D), ca * Math.cos(b.az * D), Math.sin(b.alt * D)];
      b.mag = A.Illumination(b.n, t).mag; b.dist = e.dist;
    } catch (err) { b.h = [0, 0, -1]; }
  }
  moonPhase = A.MoonPhase(t);
  sunAlt = bod[0].alt;
  updateMoonsMinor(t);
  dirty = true;
}

/* ---------- camera ---------- */
const V = { mode: "drag", az: 180, alt: 35, fov: 70 };
let F = [0, 1, 0], U = [0, 0, 1], R = [1, 0, 0];
let pF = null, pU = null; // smoothed sensor vectors
let cx = 0, cy = 0, sc = 1, W = 0, H = 0, DPR = 1, dirty = true;

function setDragCam() {
  const a = V.az * D, h = V.alt * D;
  F = [Math.sin(a) * Math.cos(h), Math.cos(a) * Math.cos(h), Math.sin(h)];
  R = [Math.cos(a), -Math.sin(a), 0];
  U = cross(R, F);
}
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2.5);
  W = cv.clientWidth; H = cv.clientHeight;
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  dirty = true;
}
function setScale() {
  cx = W / 2; cy = H / 2;
  // camera view uses a flat (gnomonic) projection so the map matches a camera lens
  sc = camOn ? (Math.min(W, H) / 2) / Math.tan(V.fov * D / 2) : (Math.min(W, H) / 2) / (2 * Math.tan(V.fov * D / 4));
}
const P = { x: 0, y: 0, c: 0 };
function proj(x, y, z) {
  const a = x * R[0] + y * R[1] + z * R[2], b = x * U[0] + y * U[1] + z * U[2], c = x * F[0] + y * F[1] + z * F[2];
  const k = camOn ? 1 / Math.max(c, 1e-3) : 2 / Math.max(1 + c, 1e-4);
  P.x = cx + a * k * sc; P.y = cy - b * k * sc; P.c = c;
  return P;
}
const onScreen = (m) => P.c > (camOn ? 0.1 : -0.2) && P.x > -m && P.x < W + m && P.y > -m && P.y < H + m;

/* ---------- drawing ---------- */
let cands = [];
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
function skyColor() {
  const night = [6, 10, 20], astro = [10, 16, 34], civil = [26, 40, 74], day = [38, 62, 108];
  const s = sunAlt;
  let c;
  if (s < -18) c = night; else if (s < -12) c = mix(night, astro, (s + 18) / 6);
  else if (s < -6) c = mix(astro, civil, (s + 12) / 6); else if (s < 0) c = mix(civil, day, (s + 6) / 6); else c = day;
  return c;
}

function draw() {
  if (V.mode === "drag" || !gotOri) setDragCam();
  setScale();
  cands = [];
  const sky = skyColor();
  if (camOn) { ctx.clearRect(0, 0, W, H); ctx.fillStyle = "rgba(0,0,0,0.22)"; ctx.fillRect(0, 0, W, H); }
  else { ctx.fillStyle = `rgb(${sky})`; ctx.fillRect(0, 0, W, H); }
  const zf = Math.min(1.9, Math.max(1, Math.pow(70 / V.fov, 0.35)));
  const limMag = Math.min(camOn ? 4.6 : 6.1, 5.0 + Math.log2(70 / V.fov) * 0.7);

  // constellation lines
  if (S.lines) {
    ctx.strokeStyle = "rgba(130,160,225,0.34)"; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < NL; i += 2) {
      const j = i * 3;
      proj(lH[j], lH[j + 1], lH[j + 2]); if (P.c < (camOn ? 0.12 : 0.05)) continue;
      const x1 = P.x, y1 = P.y;
      proj(lH[j + 3], lH[j + 4], lH[j + 5]); if (P.c < (camOn ? 0.12 : 0.05)) continue;
      // shorten ends so lines don't touch stars
      const dx = P.x - x1, dy = P.y - y1, L = Math.hypot(dx, dy);
      if (L < 14) continue;
      const g = 5 / L;
      ctx.moveTo(x1 + dx * g, y1 + dy * g); ctx.lineTo(P.x - dx * g, P.y - dy * g);
    }
    ctx.stroke();
  }

  // deep-sky objects
  ctx.lineWidth = 1;
  for (let i = 0; i < MES.length; i++) {
    const m = MES[i]; if (m[3] > limMag + 3) continue;
    proj(mH[i * 3], mH[i * 3 + 1], mH[i * 3 + 2]); if (!onScreen(20)) continue;
    const x = P.x, y = P.y;
    ctx.strokeStyle = "rgba(175,195,235,0.55)";
    ctx.beginPath();
    if (m[2] === "s" || m[2] === "e" || m[2] === "i") ctx.ellipse(x, y, 6, 3, -0.5, 0, Math.PI * 2);
    else if (m[2] === "gc" || m[2] === "oc") { ctx.setLineDash([2, 2]); ctx.arc(x, y, 4.5, 0, Math.PI * 2); }
    else ctx.rect(x - 4, y - 4, 8, 8);
    ctx.stroke(); ctx.setLineDash([]);
    cands.push({ t: "m", i, x, y, w: 6 - Math.min(m[3], 9) * 0.5 });
  }

  drawDSO();

  // stars
  for (let i = 0; i < NS; i++) {
    const mag = st[i * 4 + 2];
    if (mag > limMag) break; // sorted by magnitude
    const j = i * 3;
    proj(sH[j], sH[j + 1], sH[j + 2]);
    if (!onScreen(6)) continue;
    const r = Math.max(0.7, 0.74 * Math.pow(Math.max(0.2, 5.8 - mag), 0.92)) * zf;
    const col = sCol[i];
    const al = mag > 4.5 ? 0.55 + (limMag - mag) * 0.25 : 1;
    if (mag < 1.6) {
      const g = ctx.createRadialGradient(P.x, P.y, 0, P.x, P.y, r * 4);
      g.addColorStop(0, `rgba(${col},0.45)`); g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(P.x, P.y, r * 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = `rgba(${col},${Math.min(1, al)})`;
    if (r < 1.1) ctx.fillRect(P.x - r, P.y - r, r * 2, r * 2);
    else { ctx.beginPath(); ctx.arc(P.x, P.y, r, 0, Math.PI * 2); ctx.fill(); }
    if (mag < 4.8 || NAMES[i]) cands.push({ t: "s", i, x: P.x, y: P.y, w: (6 - mag) * 4 });
  }

  // sun, moon, planets (true size once zoomed in far enough)
  for (let k = bod.length - 1; k >= 0; k--) {
    const b = bod[k];
    proj(b.h[0], b.h[1], b.h[2]); if (!onScreen(30)) continue;
    const x = P.x, y = P.y, w = WIKI[b.n];
    const rTrue = w && b.dist ? (w.r / (b.dist * AU_KM)) * sc : 0;
    const r0 = b.r * Math.min(2.2, zf * (b.n === "Sun" || b.n === "Moon" ? 70 / V.fov : 1)), r = Math.max(r0, rTrue), big = rTrue > r0;
    if (b.n === "Moon") drawMoon(x, y, Math.max(7, r));
    else {
      if (b.n === "Saturn" && big) drawRings(b, false);
      if (!big) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
        g.addColorStop(0, b.c + "88"); g.addColorStop(1, b.c + "00");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = b.c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      if (b.n === "Saturn") {
        if (big) drawRings(b, true);
        else { ctx.strokeStyle = b.c; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(x, y, r * 2.1, r * 0.7, -0.35, 0, Math.PI * 2); ctx.stroke(); }
      }
    }
    cands.push({ t: "b", i: k, x, y, w: big ? Math.max(40, r) : 40 });
  }
  // moons of Jupiter and Saturn, once zoomed in far enough to tell them apart
  if (V.fov < 8) for (let i = 0; i < MOONS.length; i++) {
    const m = MOONS[i]; if (!m.h || (m.mag > 12 && V.fov > 2)) continue;
    proj(m.h[0], m.h[1], m.h[2]); if (!onScreen(10)) continue;
    const rr = Math.max(1.8, (m.r / (m.dist * AU_KM)) * sc);
    ctx.fillStyle = "#ece6d6"; ctx.beginPath(); ctx.arc(P.x, P.y, rr, 0, Math.PI * 2); ctx.fill();
    cands.push({ t: "n", i, x: P.x, y: P.y, w: 22 - m.mag });
  }
  // dwarf planets and large asteroids
  ctx.strokeStyle = "rgba(196,178,240,0.9)"; ctx.lineWidth = 1.2;
  for (let i = 0; i < minors.length; i++) {
    const m = minors[i]; if (!m.h) continue;
    proj(m.h[0], m.h[1], m.h[2]); if (!onScreen(10)) continue;
    const q = 3.2;
    ctx.beginPath(); ctx.moveTo(P.x, P.y - q); ctx.lineTo(P.x + q, P.y); ctx.lineTo(P.x, P.y + q); ctx.lineTo(P.x - q, P.y); ctx.closePath(); ctx.stroke();
    cands.push({ t: "k", i, x: P.x, y: P.y, w: 14 - m.mag * 0.5 });
  }

  // labels
  const boxes = [];
  const place = (txt, x, y, font, color, center) => {
    ctx.font = font;
    const w = ctx.measureText(txt).width, h = 14;
    const bx = center ? x - w / 2 : x, by = y - h + 3;
    for (const q of boxes) if (bx < q[0] + q[2] && bx + w > q[0] && by < q[1] + q[3] && by + h > q[1]) return;
    boxes.push([bx - 2, by - 2, w + 4, h + 4]);
    ctx.fillStyle = color; ctx.fillText(txt, bx, y);
  };
  if (camOn) { ctx.shadowColor = "rgba(0,0,0,0.95)"; ctx.shadowBlur = 4; }
  if (S.labels) {
    ctx.textBaseline = "alphabetic";
    for (let k = 0; k < bod.length; k++) {
      const b = bod[k]; proj(b.h[0], b.h[1], b.h[2]); if (!onScreen(0)) continue;
      place(b.n, P.x + 10, P.y + 4, "600 13px " + uiFont, b.n === "Pluto" ? "rgba(214,195,174,0.9)" : "#f3c98a");
    }
    if (V.fov < 4) for (const m of MOONS) {
      if (!m.h || (m.mag > 12 && V.fov > 2)) continue;
      proj(m.h[0], m.h[1], m.h[2]); if (!onScreen(0)) continue;
      place(m.n, P.x + 6, P.y - 5, "500 11.5px " + uiFont, "rgba(236,230,214,0.88)");
    }
    for (const m of minors) {
      if (!m.h || !(m.mag < 9 || V.fov < 30)) continue;
      proj(m.h[0], m.h[1], m.h[2]); if (!onScreen(0)) continue;
      place(m.el[0], P.x + 7, P.y + 4, "500 12px " + uiFont, "rgba(204,188,244,0.9)");
    }
    const starLim = 1.9 + Math.max(0, Math.log2(70 / V.fov)) * 1.3;
    for (let i = 0; i < NS; i++) {
      const mag = st[i * 4 + 2]; if (mag > starLim) break;
      const n = NAMES[i]; if (!n || !n[0]) continue;
      proj(sH[i * 3], sH[i * 3 + 1], sH[i * 3 + 2]); if (!onScreen(0)) continue;
      place(n[0], P.x + 7, P.y - 5, "500 12.5px " + uiFont, "rgba(225,232,245,0.82)");
    }
    for (let i = 0; i < MES.length; i++) {
      const m = MES[i]; if (m[3] > 6.5 && V.fov > 40) continue;
      proj(mH[i * 3], mH[i * 3 + 1], mH[i * 3 + 2]); if (!onScreen(0)) continue;
      place(m[1] || m[0], P.x + 8, P.y + 12, "italic 400 14px " + dispFont, "rgba(175,195,235,0.8)");
    }
    labelDSO(place);
    if (S.lines) for (let i = 0; i < CONS.length; i++) {
      proj(cH[i * 3], cH[i * 3 + 1], cH[i * 3 + 2]); if (!onScreen(0) || P.c < 0.2) continue;
      place(CONS[i][1].toUpperCase(), P.x, P.y, "500 11px " + uiFont, "rgba(150,172,222,0.62)", true);
    }
  }

  ctx.shadowBlur = 0;
  drawGround(sky);
  drawReticle();
}

const uiFont = '"Barlow Semi Condensed", "Arial Narrow", sans-serif';
const dispFont = '"Instrument Serif", Georgia, serif';

function drawMoon(x, y, r) {
  // bright limb faces the sun
  const s = bod[0]; proj(s.h[0], s.h[1], s.h[2]);
  const ang = Math.atan2(P.y - y, P.x - x);
  const ph = moonPhase * D; // 0 new, 180 full
  const k = Math.cos(ph); // 1 new .. -1 full
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.fillStyle = "rgba(60,64,72,0.9)"; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#ece8dc"; ctx.beginPath();
  ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false); // lit half toward +x (sun side)
  ctx.ellipse(0, 0, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, k > 0); // terminator
  ctx.fill();
  ctx.restore();
}

function drawGround(sky) {
  const steps = 120, bands = [0, -6, -16, -32, -55, -90];
  ctx.beginPath();
  const pt = (az, alt) => {
    const a = az * D, h = alt * D, c = Math.cos(h);
    proj(c * Math.sin(a), c * Math.cos(a), Math.sin(h));
    return [Math.max(-2e4, Math.min(2e4, P.x)), Math.max(-2e4, Math.min(2e4, P.y)), P.c];
  };
  for (let b = 0; b < bands.length - 1; b++) {
    for (let s = 0; s < steps; s++) {
      const a0 = s * 360 / steps, a1 = (s + 1) * 360 / steps;
      const p = [pt(a0, bands[b]), pt(a1, bands[b]), pt(a1, bands[b + 1]), pt(a0, bands[b + 1])];
      if (p.some((q) => q[2] < -0.35)) continue;
      ctx.moveTo(p[0][0], p[0][1]); ctx.lineTo(p[1][0], p[1][1]); ctx.lineTo(p[2][0], p[2][1]); ctx.lineTo(p[3][0], p[3][1]); ctx.closePath();
    }
  }
  ctx.fillStyle = "rgba(12,17,14,0.80)";
  if (!camOn) ctx.fill("nonzero"); // in camera view the real ground is visible
  // horizon line
  ctx.beginPath(); let pen = false;
  for (let s = 0; s <= steps; s++) {
    const q = pt(s * 360 / steps, 0);
    if (q[2] < (camOn ? 0.12 : -0.2)) { pen = false; continue; }
    if (pen) ctx.lineTo(q[0], q[1]); else { ctx.moveTo(q[0], q[1]); pen = true; }
  }
  ctx.strokeStyle = "rgba(241,180,92,0.55)"; ctx.lineWidth = 1.2; ctx.stroke();
  // cardinal points
  const card = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  ctx.textAlign = "center";
  card.forEach((c, i) => {
    const q = pt(i * 45, -3.2); if (q[2] < 0.1 || q[0] < -20 || q[0] > W + 20 || q[1] < -20 || q[1] > H + 20) return;
    ctx.font = (c.length === 1 ? "600 16px " : "500 12px ") + uiFont;
    ctx.fillStyle = c === "N" ? "#ff8a6b" : "rgba(241,180,92,0.9)";
    ctx.fillText(c, q[0], q[1] + 6);
  });
  ctx.textAlign = "left";
}

let target = null, pinned = null;
function drawReticle() {
  // pick object nearest the crosshair
  let best = null, bs = 1e9;
  const rad = Math.max(34, Math.min(W, H) * 0.07);
  for (const c of cands) {
    const d = Math.hypot(c.x - cx, c.y - cy); if (d > rad) continue;
    const s = d - c.w; if (s < bs) { bs = s; best = c; }
  }
  target = best;
  const show = pinned ? findCand(pinned) : target;
  ctx.strokeStyle = target && !pinned ? "rgba(241,180,92,0.95)" : "rgba(233,237,246,0.55)";
  ctx.lineWidth = 1.4;
  const g = 22;
  for (let q = 0; q < 4; q++) {
    const a = q * Math.PI / 2 + Math.PI / 4;
    ctx.beginPath(); ctx.arc(cx, cy, g, a - 0.45, a + 0.45); ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(cx, cy, 1.6, 0, Math.PI * 2); ctx.fillStyle = ctx.strokeStyle; ctx.fill();
  if (show) {
    ctx.strokeStyle = "#f1b45c"; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(show.x, show.y, 13, 0, Math.PI * 2); ctx.stroke();
  }
}
function findCand(p) { return cands.find((c) => c.t === p.t && c.i === p.i) || null; }

/* ---------- card ---------- */
const COMPASS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
const dirTxt = (az) => `${Math.round(az)}° ${COMPASS[Math.round(az / 22.5) % 16]}`;
const altaz = (h) => ({ alt: Math.asin(Math.max(-1, Math.min(1, h[2]))) / D, az: (Math.atan2(h[0], h[1]) / D + 360) % 360 });
function conAt(h) {
  if (!rot) return null;
  const hx = h[1], hy = -h[0], hz = h[2];
  const x = rot[0][0] * hx + rot[0][1] * hy + rot[0][2] * hz;
  const y = rot[1][0] * hx + rot[1][1] * hy + rot[1][2] * hz;
  const z = rot[2][0] * hx + rot[2][1] * hy + rot[2][2] * hz;
  const ra = ((Math.atan2(y, x) / D / 15) + 24) % 24, dec = Math.asin(Math.max(-1, Math.min(1, z))) / D;
  try { return A.Constellation(ra, dec).name; } catch (e) { return null; }
}
function phaseName(p) {
  if (p < 10 || p > 350) return "New moon"; if (p < 80) return "Waxing crescent"; if (p < 100) return "First quarter";
  if (p < 170) return "Waxing gibbous"; if (p < 190) return "Full moon"; if (p < 260) return "Waning gibbous";
  if (p < 280) return "Last quarter"; return "Waning crescent";
}
/* ---------- object facts ---------- */
const MEANING = { And: "The chained princess", Ant: "The air pump", Aps: "The bird of paradise", Aqr: "The water bearer", Aql: "The eagle", Ara: "The altar",
  Ari: "The ram", Aur: "The charioteer", Boo: "The herdsman", Cae: "The chisel", Cam: "The giraffe", Cnc: "The crab", CVn: "The hunting dogs",
  CMa: "The great dog", CMi: "The little dog", Cap: "The sea goat", Car: "The keel of the ship Argo", Cas: "The queen", Cen: "The centaur", Cep: "The king",
  Cet: "The sea monster", Cha: "The chameleon", Cir: "The drawing compass", Col: "The dove", Com: "Berenice's hair", CrA: "The southern crown",
  CrB: "The northern crown", Crv: "The crow", Crt: "The cup", Cru: "The Southern Cross", Cyg: "The swan", Del: "The dolphin", Dor: "The dolphinfish",
  Dra: "The dragon", Equ: "The little horse", Eri: "The river", For: "The furnace", Gem: "The twins", Gru: "The crane", Her: "The hero Hercules",
  Hor: "The pendulum clock", Hya: "The water snake", Hyi: "The lesser water snake", Ind: "The Indian", Lac: "The lizard", Leo: "The lion",
  LMi: "The little lion", Lep: "The hare", Lib: "The scales", Lup: "The wolf", Lyn: "The lynx", Lyr: "The lyre", Men: "Table Mountain",
  Mic: "The microscope", Mon: "The unicorn", Mus: "The fly", Nor: "The carpenter's square", Oct: "The octant", Oph: "The serpent bearer",
  Ori: "The hunter", Pav: "The peacock", Peg: "The winged horse", Per: "The hero Perseus", Phe: "The phoenix", Pic: "The painter's easel",
  Psc: "The fishes", PsA: "The southern fish", Pup: "The stern of the ship Argo", Pyx: "The ship's compass", Ret: "The net", Sge: "The arrow",
  Sgr: "The archer", Sco: "The scorpion", Scl: "The sculptor", Sct: "The shield", Ser: "The serpent", Sex: "The sextant", Tau: "The bull",
  Tel: "The telescope", Tri: "The triangle", TrA: "The southern triangle", Tuc: "The toucan", UMa: "The great bear", UMi: "The little bear",
  Vel: "The sails of the ship Argo", Vir: "The maiden", Vol: "The flying fish", Vul: "The little fox" };
const ZODIAC = new Set(["Ari", "Tau", "Gem", "Cnc", "Leo", "Vir", "Lib", "Sco", "Sgr", "Cap", "Aqr", "Psc"]);
const R_SUN = 695700, M_SUN = 1.989e30, R_E = 109.2, M_E = 332946; // Earths per Sun
const KINDS = ["Main-sequence star", "Subgiant", "Giant star", "Bright giant", "Supergiant"];
const nf = (x, d) => Number(x).toLocaleString([], { maximumFractionDigits: d });
function sig(x, n) { if (!x) return 0; const p = Math.pow(10, n - 1 - Math.floor(Math.log10(Math.abs(x)))); return Math.round(x * p) / p; }
function fmtNum(x) { const v = sig(x, x >= 100 ? 3 : 2); return nf(v, v < 1 ? 3 : v < 10 ? 1 : 0); }
function fmtLy(ly) {
  if (!(ly > 0)) return "unknown";
  if (ly >= 1e9) return nf(sig(ly / 1e9, 2), 1) + " billion ly";
  if (ly >= 1e6) return nf(sig(ly / 1e6, 2), 1) + " million ly";
  return fmtNum(ly) + " ly";
}
function fmtYears(y) {
  if (y >= 1e9) return nf(sig(y / 1e9, 2), 1) + " billion years";
  if (y >= 1e6) return nf(sig(y / 1e6, 2), 1) + " million years";
  return fmtNum(y) + " years";
}
// the user's rule: in Suns, switching to Earths below 0.01 Suns
function fmtSunsEarths(suns, perSun) {
  if (!(suns > 0)) return "—";
  if (suns < 0.01) { const e = suns * perSun; return fmtNum(e) + (e > 0.95 && e < 1.05 ? " Earth" : " Earths"); }
  return fmtNum(suns) + (suns > 0.95 && suns < 1.05 ? " Sun" : " Suns");
}
const fmtSize = (r) => fmtSunsEarths(r, R_E), fmtMass = (m) => fmtSunsEarths(m, M_E);
function fmtLight(au) {
  const s = au * 499.005;
  if (s < 60) return nf(sig(s, 2), 1) + " light-s";
  if (s < 3600) return nf(sig(s / 60, 2), 1) + " light-min";
  return nf(sig(s / 3600, 2), 1) + " light-h";
}
function fmtKm(au) {
  const km = au * 1.495979e8;
  if (km >= 1e9) return nf(sig(km / 1e9, 3), 2) + " billion km";
  if (km >= 1e6) return nf(sig(km / 1e6, 3), 1) + " million km";
  return nf(Math.round(km / 100) * 100, 0) + " km";
}
function lightLeft(ly) {
  if (!(ly >= 1)) return "";
  if (ly >= 10000) return `The light you see left it ${fmtYears(ly)} ago`;
  const step = ly > 1000 ? 100 : ly > 100 ? 10 : 1;
  const yr = Math.round((skyDate.getUTCFullYear() - ly) / step) * step;
  return yr > 0 ? `The light you see left it around ${yr}` : `The light you see left it around ${Math.max(1, -yr)} BC`;
}
function colorWord(T) { return T > 25000 ? "blue" : T > 10000 ? "blue-white" : T > 7500 ? "white" : T > 6000 ? "yellow-white" : T > 5200 ? "yellow" : T > 3950 ? "orange" : T > 3500 ? "orange-red" : "red"; }
function powerTxt(L) {
  if (L >= 1.5) return `gives off ${fmtNum(L)} times the Sun's energy`;
  if (L >= 0.67) return "gives off about as much energy as the Sun";
  return `gives off ${Math.round(L * 100)}% of the Sun's energy`;
}
const here = () => S.place || "here";
function riseTxt(dec) {
  const lat = S.lat;
  if (lat >= 0 ? dec > 90 - lat : dec < -90 - lat) return `Never sets from ${here()}`;
  if (lat >= 0 ? dec < lat - 90 : dec > lat + 90) return `Never rises from ${here()}`;
  return "";
}
function conVis(min, max) {
  const lat = S.lat, lo = lat >= 0 ? lat - 90 : -90, hi = lat >= 0 ? 90 : lat + 90;
  if (max < lo || min > hi) return `It never rises from ${here()}.`;
  if (min >= lo && max <= hi) {
    const circ = lat >= 0 ? min > 90 - lat : max < -90 - lat;
    return circ ? `It never sets from ${here()}.` : `All of it rises above the horizon from ${here()}.`;
  }
  return `Only part of it rises above the horizon from ${here()}.`;
}
function bestMonth(ra) {
  // on the meridian around 9 pm when the Sun sits about 135° of right ascension behind it
  const day = 79 + ((ra - 135 + 720) % 360) / 0.9856;
  return new Date(Date.UTC(2001, 0, 1) + (day % 365) * 864e5).toLocaleString([], { month: "long", timeZone: "UTC" });
}
const ord = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th");
const sentence = (parts) => { const p = parts.filter(Boolean); return p.length ? p.join(". ") + "." : ""; };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
function conSymAt(h) {
  if (!rot) return null;
  const hx = h[1], hy = -h[0], hz = h[2];
  const x = rot[0][0] * hx + rot[0][1] * hy + rot[0][2] * hz, y = rot[1][0] * hx + rot[1][1] * hy + rot[1][2] * hz, z = rot[2][0] * hx + rot[2][1] * hy + rot[2][2] * hz;
  try { return A.Constellation(((Math.atan2(y, x) / D / 15) + 24) % 24, Math.asin(Math.max(-1, Math.min(1, z))) / D); } catch (e) { return null; }
}
function seasonHere(s) { if (S.lat >= 0) return s.toLowerCase(); return ({ Winter: "summer", Summer: "winter", Spring: "autumn", Autumn: "spring" }[s] || s.toLowerCase()); }
function starName(i) { const n = NAMES[i], inf = SINFO[i]; return (n && (n[0] || n[1])) || (inf && inf[0] ? "HIP " + inf[0] : "Unnamed star"); }

// Dwarf planets and large asteroids: Wikipedia orbital elements (ecliptic J2000), two-body Kepler orbits

function minorHelio(el, jdTT) {
  // heliocentric position, equatorial J2000 (EQJ), AU
  const d2r = Math.PI / 180, [, , ep, a, e, i, O, w, M0, nn] = el;
  const n = nn || 0.9856076686 / Math.pow(a, 1.5);
  let M = ((M0 + n * (jdTT - ep)) % 360) * d2r, E = M;
  for (let k = 0; k < 30; k++) { const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= dE; if (Math.abs(dE) < 1e-12) break; }
  const xv = a * (Math.cos(E) - e), yv = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const cO = Math.cos(O * d2r), sO = Math.sin(O * d2r), cw = Math.cos(w * d2r), sw = Math.sin(w * d2r), ci = Math.cos(i * d2r), si = Math.sin(i * d2r);
  const x = (cO * cw - sO * sw * ci) * xv + (-cO * sw - sO * cw * ci) * yv;
  const y = (sO * cw + cO * sw * ci) * xv + (-sO * sw + cO * cw * ci) * yv;
  const z = (sw * si) * xv + (cw * si) * yv;
  const eps = 23.4392911 * d2r, ce = Math.cos(eps), se = Math.sin(eps);
  return [x, y * ce - z * se, y * se + z * ce];
}
function minorMag(H, r, delta, phaseRad) {
  const G = 0.15, t = Math.tan(phaseRad / 2);
  const p1 = Math.exp(-3.33 * Math.pow(t, 0.63)), p2 = Math.exp(-1.87 * Math.pow(t, 1.22));
  return H + 5 * Math.log10(r * delta) - 2.5 * Math.log10((1 - G) * p1 + G * p2);
}

/* ---------- Solar System: values from Wikipedia (data/solar.json, refreshed monthly) ---------- */
const WIKI = SOLAR.bodies, MOONS = SOLAR.moons;
const MINOR = SOLAR.minor.map((o) => [o.name, o.kind, o.epochJD, o.a, o.e, o.i, o.node, o.peri, o.M, o.n, o.H, o.radiusKm, o.massKg, o.discovered, o.moons, o.periodYr]);
const MINOR_FACTS = Object.fromEntries(SOLAR.minor.map((o) => [o.name, o.fact]));
// "List of gravitationally rounded objects of the Solar System": radius km, mass kg, surface gravity m/s², rotation days,
// orbit days, mean distance from the Sun km, known moons (moon pages, 2026), discovery

const EARTH_R = 6378.1366, EARTH_M = 5.972e24, AU_KM = 1.495978707e8;
// moons drawn on the map: radius km, mass kg, orbit days, distance from planet km, discovered, typical magnitude (List of natural satellites)


const minors = MINOR.map((el) => ({ el, h: null, mag: 99, dist: 0, rsun: 0 }));
let ringGeo = null;
const ECL = A.Rotation_EQJ_ECL();
function horOf(x, y, z) {
  const r = rot;
  return [-(r[0][1] * x + r[1][1] * y + r[2][1] * z), r[0][0] * x + r[1][0] * y + r[2][0] * z, r[0][2] * x + r[1][2] * y + r[2][2] * z];
}
function helioEcl2000(name, jde) {
  const v = A.RotateVector(ECL, A.HelioVector(name, A.AstroTime.FromTerrestrialTime(jde - 2451545.0)));
  return { lon: Math.atan2(v.y, v.x), lat: Math.atan2(v.z, Math.hypot(v.x, v.y)), range: Math.hypot(v.x, v.y, v.z) };
}
// direction of a moon or ring point: the parent's topocentric direction plus the geocentric offset
function offsetDir(parent, g0, g) {
  const a = horOf(g0.x, g0.y, g0.z), b = horOf(g[0], g[1], g[2]), la = Math.hypot(a[0], a[1], a[2]), lb = Math.hypot(b[0], b[1], b[2]);
  const v = [parent.h[0] + b[0] / lb - a[0] / la, parent.h[1] + b[1] / lb - a[1] / la, parent.h[2] + b[2] / lb - a[2] / la], l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
}
function updateMoonsMinor(t) {
  const jup = bod.find((b) => b.n === "Jupiter"), sat = bod.find((b) => b.n === "Saturn");
  try {
    const jv = A.GeoVector("Jupiter", t, true), jd = Math.hypot(jv.x, jv.y, jv.z);
    const mo = A.JupiterMoons(t.AddDays(-jd / 173.1446));
    ["io", "europa", "ganymede", "callisto"].forEach((k, i) => {
      const v = mo[k], g = [jv.x + v.x, jv.y + v.y, jv.z + v.z];
      MOONS[i].h = offsetDir(jup, jv, g); MOONS[i].dist = Math.hypot(g[0], g[1], g[2]);
    });
  } catch (e) { for (let i = 0; i < 4; i++) MOONS[i].h = null; }
  try {
    // Meeus ch. 46 via astronomia; X toward Saturn's west, Y along its pole, rotated onto the sky by the pole's position angle
    const sv = A.GeoVector("Saturn", t, true), sd = Math.hypot(sv.x, sv.y, sv.z);
    const ra = Math.atan2(sv.y, sv.x), dec = Math.asin(sv.z / sd), T = t.tt / 36525;
    const a0 = (40.589 - 0.036 * T) * D, d0 = (83.537 - 0.004 * T) * D;
    const P = Math.atan2(Math.cos(d0) * Math.sin(a0 - ra), Math.sin(d0) * Math.cos(dec) - Math.cos(d0) * Math.sin(dec) * Math.cos(a0 - ra));
    const ev = [-Math.sin(ra), Math.cos(ra), 0], nv = [-Math.sin(dec) * Math.cos(ra), -Math.sin(dec) * Math.sin(ra), Math.cos(dec)];
    const RS = WIKI.Saturn.r / AU_KM, pos = SatMoons.saturnMoons(t.tt + 2451545.0, helioEcl2000);
    pos.forEach((p, i) => {
      const E = (-p.x * Math.cos(P) + p.y * Math.sin(P)) * RS, N = (p.x * Math.sin(P) + p.y * Math.cos(P)) * RS;
      const g = [sv.x + E * ev[0] + N * nv[0], sv.y + E * ev[1] + N * nv[1], sv.z + E * ev[2] + N * nv[2]];
      MOONS[4 + i].h = offsetDir(sat, sv, g); MOONS[4 + i].dist = sd;
    });
    ringGeo = { sv, sd, pole: [Math.cos(d0) * Math.cos(a0), Math.cos(d0) * Math.sin(a0), Math.sin(d0)] };
  } catch (e) { for (let i = 4; i < 12; i++) MOONS[i].h = null; ringGeo = null; }
  const jdTT = t.tt + 2451545.0, yr = skyDate.getUTCFullYear();
  let E = null; try { E = A.HelioVector("Earth", t); } catch (e) {}
  for (const m of minors) {
    // two-body orbits drift away from reality over decades, so only show them near the elements' epoch
    const far = m.el[3] > 30, ok = E && (far ? yr >= 1900 && yr <= 2150 : yr >= 1990 && yr <= 2060);
    if (!ok) { m.h = null; continue; }
    const hh = minorHelio(m.el, jdTT), g = [hh[0] - E.x, hh[1] - E.y, hh[2] - E.z];
    const d = Math.hypot(g[0], g[1], g[2]), rr = Math.hypot(hh[0], hh[1], hh[2]);
    const ph = Math.acos(Math.max(-1, Math.min(1, (hh[0] * g[0] + hh[1] * g[1] + hh[2] * g[2]) / (rr * d))));
    const hv = horOf(g[0], g[1], g[2]);
    m.h = [hv[0] / d, hv[1] / d, hv[2] / d]; m.dist = d; m.rsun = rr; m.mag = minorMag(m.el[10], rr, d, ph);
  }
}
function drawRings(sat, front) {
  if (!ringGeo) return;
  const { sv, sd, pole } = ringGeo, s = [sv.x / sd, sv.y / sd, sv.z / sd];
  const u0 = cross(pole, [0, 0, 1]), lu = Math.hypot(u0[0], u0[1], u0[2]), u = [u0[0] / lu, u0[1] / lu, u0[2] / lu], v = cross(pole, u);
  const fFront = Math.atan2(-dot(v, s), -dot(u, s)); // ring azimuth nearest to us
  const arc = (Rkm, f0, f1) => {
    const R = Rkm / AU_KM, pts = [];
    for (let k = 0; k <= 48; k++) {
      const f = f0 + (f1 - f0) * k / 48, c = Math.cos(f) * R, sn = Math.sin(f) * R;
      const h = offsetDir(sat, sv, [sv.x + c * u[0] + sn * v[0], sv.y + c * u[1] + sn * v[1], sv.z + c * u[2] + sn * v[2]]);
      proj(h[0], h[1], h[2]); pts.push([P.x, P.y]);
    }
    return pts;
  };
  const f0 = front ? fFront - Math.PI / 2 : 0, f1 = front ? fFront + Math.PI / 2 : 2 * Math.PI;
  const outer = arc(136775, f0, f1), inner = arc(92000, f0, f1).reverse();
  ctx.beginPath();
  outer.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  if (front) inner.forEach(([x, y]) => ctx.lineTo(x, y));
  else { ctx.closePath(); inner.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); }
  ctx.fillStyle = "rgba(226,204,150,0.55)"; ctx.fill("evenodd");
}
// formatting in Earths for anything in the Solar System except the Sun
function fmtTiny(x) {
  if (!(x > 0)) return "—";
  if (x >= 0.001) return fmtNum(x);
  const ex = Math.floor(Math.log10(x)), mant = sig(x / Math.pow(10, ex), 2);
  const sup = String(ex).replace(/-/g, "⁻").replace(/\d/g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]);
  return nf(mant, 1) + "×10" + sup;
}
const earths = (x) => fmtTiny(x) + (x > 0.95 && x < 1.05 ? " Earth" : " Earths");
const sizeE = (km) => earths(km / EARTH_R), massE = (kg) => (kg ? earths(kg / EARTH_M) : "—");
function fmtDur(days) {
  if (days >= 730) return nf(sig(days / 365.25, 3), 2) + " Earth years";
  if (days >= 2) return nf(sig(days, 3), 1) + " days";
  const h = days * 24, hh = Math.floor(h), mm = Math.round((h - hh) * 60);
  return mm === 60 ? `${hh + 1} h` : `${hh} h ${mm} min`;
}
const fmtKmPlain = (km) => (km >= 1e9 ? nf(sig(km / 1e9, 3), 2) + " billion km" : km >= 1e6 ? nf(sig(km / 1e6, 3), 1) + " million km" : nf(Math.round(km), 0) + " km");
const lightPhrase = (au) => fmtLight(au).replace("light-", "").replace("min", "minutes").replace(/ s$/, " seconds").replace(/ h$/, " hours");
function seeTxt(mag) {
  return mag < 5.5 ? "Visible to the naked eye from a dark site" : mag < 9.5 ? "Visible in binoculars" : mag < 13.5 ? "Needs a small telescope"
    : mag < 16 ? "Needs a large amateur telescope" : "Far too faint to see; only long-exposure photos through big telescopes show it";
}
function describeBody(o) {
  const b = bod[o.i], w = WIKI[b.n], con = conAt(b.h) || "";
  const kind = b.n === "Sun" ? "Star · G2 V" : b.n === "Moon" ? "Moon · " + con : b.n === "Pluto" ? "Dwarf planet · " + con : "Planet · " + con;
  let s1l = "Brightness", s1 = "mag " + b.mag.toFixed(1), fact = BODY_FACTS[b.n] || "";
  if (b.n === "Moon") { s1l = "Phase"; s1 = phaseName(moonPhase); fact = `${Math.round((1 - Math.cos(moonPhase * D)) / 2 * 100)}% of the side facing us is lit.`; }
  const sun = b.n === "Sun";
  const parts = [];
  if (sun) parts.push("It's about 4.6 billion years old and holds 99.8% of all the mass in the Solar System", `It spins once every ${fmtDur(w.rot)} at its equator`);
  else if (b.n === "Moon") parts.push(`It orbits Earth every ${fmtDur(w.orb)} at an average ${fmtKmPlain(w.dpar)}, always keeping the same side towards us`);
  else {
    parts.push(`A year there lasts ${fmtDur(w.orb)}, and it spins once every ${fmtDur(w.rot)}${w.retro ? ", backwards" : ""}`);
    parts.push(w.moons ? `${nf(w.moons, 0)} known moon${w.moons > 1 ? "s" : ""}${w.asOf ? " as of " + w.asOf : ""}${w.big ? ": " + w.big : ""}` : "It has no moons");
    if (w.disc) parts.push(`Discovered in ${w.disc}`);
    parts.push(`Average distance from the Sun ${fmtKmPlain(w.au)}`);
  }
  if (!sun) parts.push(`Gravity ${w.gas ? "at the cloud tops " : "at the surface "}is ${nf(sig(w.g / 9.80665, 2), 2)} times Earth's`);
  parts.push(`Now ${fmtKm(b.dist)} away; its light takes ${lightPhrase(b.dist)} to reach you`);
  if (b.n === "Jupiter" || b.n === "Saturn") parts.push("Zoom in close to see its moons");
  return { key: "b" + o.i, kind, name: b.n, alias: sun ? "Our own star" : "",
    a: [["Distance", fmtLight(b.dist)], ["Size", sun ? "1 Sun" : sizeE(w.r)], ["Mass", sun ? "1 Sun" : massE(w.m)]],
    s1l, s1, alt: b.alt, az: b.az, fact, meta: sentence(parts) };
}
function describeMoon(o) {
  const m = MOONS[o.i], aa = altaz(m.h);
  return { key: "n" + o.i, kind: "Moon of " + m.p, name: m.n, alias: m.p === "Jupiter" ? "Galilean moon" : "",
    a: [["Distance", fmtLight(m.dist)], ["Size", sizeE(m.r)], ["Mass", massE(m.m)]],
    s1l: "Brightness", s1: "mag " + m.mag, alt: aa.alt, az: aa.az, fact: m.f,
    meta: sentence([`It orbits ${m.p} every ${fmtDur(m.per)}, ${fmtKmPlain(m.a)} out`, `Discovered in ${m.disc}`,
      m.mag < 6 ? "Visible in steady binoculars as a dot beside Jupiter" : m.mag < 9 ? "Needs a small telescope" : m.mag < 12 ? "Needs a telescope of about 15 cm or more" : "Needs a large amateur telescope"]) };
}
function describeMinor(o) {
  const mn = minors[o.i], el = mn.el, aa = altaz(mn.h), con = conAt(mn.h) || "";
  const period = el[15] || Math.pow(el[3], 1.5);
  return { key: "k" + o.i, kind: el[1] + (con ? " · " + con : ""), name: el[0], alias: el[1] === "Asteroid" ? "Asteroid belt" : el[3] > 30 ? "Beyond Neptune" : "Asteroid belt",
    a: [["Distance", fmtLight(mn.dist)], ["Size", sizeE(el[11])], ["Mass", el[12] ? massE(el[12]) : "unknown"]],
    s1l: "Brightness", s1: "mag " + mn.mag.toFixed(1), alt: aa.alt, az: aa.az, fact: MINOR_FACTS[el[0]] || "",
    meta: sentence([`It orbits the Sun every ${fmtDur(period * 365.25)}`, `Discovered in ${el[13]}`, el[14] ? `${el[14]} known moon${el[14] > 1 ? "s" : ""}` : "",
      `Now ${fmtKm(mn.dist)} away, ${nf(sig(mn.rsun, 3), 1)} times Earth's distance from the Sun`, seeTxt(mn.mag),
      el[3] < 30 && "Position from a simple orbit, good to about a degree"]) };
}

/* ---------- NGC / IC deep-sky objects (OpenNGC + Wikipedia distances) and deep fields ---------- */
const DTYPE = { G: "Galaxy", GGroup: "Galaxy group", GPair: "Galaxy pair", GTrpl: "Galaxy triplet", OCl: "Open cluster", GCl: "Globular cluster",
  "Cl+N": "Cluster with nebula", PN: "Planetary nebula", HII: "Emission nebula", EmN: "Emission nebula", Neb: "Nebula", RfN: "Reflection nebula",
  SNR: "Supernova remnant", DrkN: "Dark nebula", "*Ass": "Star association" };
const DFACT = { "Open cluster": "A loose group of young stars born together from the same cloud.", "Globular cluster": "A dense ball of very old stars orbiting our galaxy.",
  "Planetary nebula": "A glowing shell of gas thrown off by a dying Sun-like star.", "Emission nebula": "A cloud of hydrogen glowing as hot young stars nearby energise it.",
  "Reflection nebula": "Dust reflecting the light of nearby stars, which makes it look blue in photos.", "Supernova remnant": "The expanding debris of an exploded star.",
  "Dark nebula": "A cloud of dust thick enough to block the light behind it.", "Nebula": "A cloud of gas and dust in our galaxy.",
  "Cluster with nebula": "Young stars still surrounded by the gas cloud they formed from.", "Star association": "A loose, scattered group of young stars moving together.",
  "Elliptical galaxy": "A smooth, ball-shaped galaxy of mostly old stars.", "Spiral galaxy": "A disc galaxy with spiral arms, like our own Milky Way.",
  "Barred spiral galaxy": "A spiral galaxy with a bar of stars across its centre, like our own Milky Way.", "Lenticular galaxy": "A disc galaxy without spiral arms.",
  "Irregular galaxy": "A galaxy without a regular shape.", "Galaxy": "A separate galaxy, far beyond the Milky Way.",
  "Galaxy pair": "Galaxies close together in space, held by gravity.", "Galaxy triplet": "Galaxies close together in space, held by gravity.", "Galaxy group": "Galaxies close together in space, held by gravity." };
function galaxyWord(h) {
  if (!h) return "Galaxy";
  if (/^(S0|SA0|SB0|SAB0)/.test(h)) return "Lenticular galaxy";
  if (/^E/.test(h)) return "Elliptical galaxy";
  if (/^SB/.test(h)) return "Barred spiral galaxy";
  if (/^S/.test(h)) return "Spiral galaxy";
  if (/^I/.test(h)) return "Irregular galaxy";
  return "Galaxy";
}
const DS = DSO.dso, NDS = DS.length, dEq = new Float32Array(NDS * 3), dH = new Float32Array(NDS * 3);
DS.forEach((o, i) => eqv(o[3], o[4], dEq, i * 3));
const DF = DSO.fields, fEq = new Float32Array(DF.length * 3), fH = new Float32Array(DF.length * 3);
DF.forEach((o, i) => eqv(o.ra, o.dec, fEq, i * 3));
const dMag = (o) => (o[8] == null ? (o[1] ? 10 : 12) : o[8]);
function fmtArc(am) {
  if (am >= 60) return nf(sig(am / 60, 2), 1) + "°";
  if (am >= 1) return nf(sig(am, 2), 1) + "′";
  return nf(Math.round(am * 60), 0) + "″";
}
function viewTxt(m) { return m == null ? "Dark site" : m <= 8.5 ? "Binoculars" : m <= 10.5 ? "Small scope" : m <= 12.5 ? "15–20 cm scope" : "Large scope"; }
// screen direction of a position angle (from north through east) at an equatorial position
function paAngle(raDeg, decDeg, pa, x, y) {
  const a = raDeg * D, d = decDeg * D, c = Math.cos(d), p = [c * Math.cos(a), c * Math.sin(a), Math.sin(d)], e = 0.002;
  const n = [-Math.sin(d) * Math.cos(a), -Math.sin(d) * Math.sin(a), Math.cos(d)], ea = [-Math.sin(a), Math.cos(a), 0];
  const pt = (v) => { const h = horOf(p[0] + v[0] * e, p[1] + v[1] * e, p[2] + v[2] * e), l = Math.hypot(h[0], h[1], h[2]); proj(h[0] / l, h[1] / l, h[2] / l); return [P.x - x, P.y - y]; };
  const N = pt(n), E = pt(ea), q = pa * D;
  return Math.atan2(N[1] * Math.cos(q) + E[1] * Math.sin(q), N[0] * Math.cos(q) + E[0] * Math.sin(q));
}
function drawDSO() {
  const lim = Math.min(14, 8 + Math.log2(70 / V.fov) * 1.4), pxArc = sc * D / 60;
  ctx.lineWidth = 1;
  for (let i = 0; i < NDS; i++) {
    const o = DS[i], m = dMag(o); if (m > lim) continue;
    proj(dH[i * 3], dH[i * 3 + 1], dH[i * 3 + 2]); if (!onScreen(30)) continue;
    const x = P.x, y = P.y, gal = o[2] !== "GCl" && o[2][0] === "G";
    const rMaj = o[5] * pxArc / 2, rMin = (o[6] || o[5]) * pxArc / 2;
    ctx.strokeStyle = "rgba(160,182,228,0.5)";
    ctx.beginPath();
    if (rMaj > 7) {
      const ang = o[7] >= 0 ? paAngle(o[3], o[4], o[7], x, y) : 0;
      if (o[2] === "OCl" || o[2] === "GCl") ctx.setLineDash([3, 3]);
      ctx.ellipse(x, y, rMaj, Math.max(2, rMin), ang, 0, Math.PI * 2);
    } else if (gal) ctx.ellipse(x, y, 4.5, 2.2, -0.5, 0, Math.PI * 2);
    else if (o[2] === "OCl" || o[2] === "GCl" || o[2] === "*Ass") { ctx.setLineDash([2, 2]); ctx.arc(x, y, 3.5, 0, Math.PI * 2); }
    else if (o[2] === "PN") { ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.moveTo(x + 5, y); ctx.lineTo(x + 3, y); ctx.moveTo(x - 5, y); ctx.lineTo(x - 3, y); }
    else ctx.rect(x - 3.5, y - 3.5, 7, 7);
    ctx.stroke(); ctx.setLineDash([]);
    cands.push({ t: "d", i, x, y, w: Math.max(0, 5 - m * 0.4) });
  }
  ctx.strokeStyle = "rgba(118,214,204,0.9)"; ctx.lineWidth = 1.2;
  for (let i = 0; i < DF.length; i++) {
    proj(fH[i * 3], fH[i * 3 + 1], fH[i * 3 + 2]); if (!onScreen(10)) continue;
    ctx.strokeRect(P.x - 4, P.y - 4, 8, 8);
    cands.push({ t: "f", i, x: P.x, y: P.y, w: 3 });
  }
}
function labelDSO(place) {
  const lim = Math.min(14, 8 + Math.log2(70 / V.fov) * 1.4);
  for (let i = 0; i < NDS; i++) {
    const o = DS[i], m = dMag(o);
    if (m > lim || !(o[1] ? m <= lim - 1.5 || V.fov < 15 : V.fov < 5)) continue;
    proj(dH[i * 3], dH[i * 3 + 1], dH[i * 3 + 2]); if (!onScreen(0)) continue;
    place(o[1] || o[0], P.x + 8, P.y + 12, "italic 400 13px " + dispFont, "rgba(160,182,228,0.75)");
  }
  for (let i = 0; i < DF.length; i++) {
    proj(fH[i * 3], fH[i * 3 + 1], fH[i * 3 + 2]); if (!onScreen(0)) continue;
    place(DF[i].name, P.x + 8, P.y + 4, "500 12px " + uiFont, "rgba(118,214,204,0.9)");
  }
}
function describeDSO(o) {
  const d = DS[o.i], h = [dH[o.i * 3], dH[o.i * 3 + 1], dH[o.i * 3 + 2]], aa = altaz(h), con = SKY.full[d[9]] || conAt(h) || "";
  const gal = d[2] !== "GCl" && d[2][0] === "G", type = d[2] === "G" ? galaxyWord(d[12]) : DTYPE[d[2]] || "Deep-sky object";
  const dist = d[10], est = d[11] === 2, mag = d[8], sizeLy = dist && d[5] ? dist * d[5] / 60 * D : 0;
  const ang = d[5] ? fmtArc(d[5]) + (d[6] && d[6] !== d[5] ? " × " + fmtArc(d[6]) : "") : "";
  return { key: "d" + o.i, kind: type + (con ? " · " + con : ""), name: d[1] || d[0], alias: [d[1] ? d[0] : "", d[14] ? "Caldwell " + d[14] : ""].filter(Boolean).join(" · "),
    a: [["Distance", dist ? (est ? "≈" : "") + fmtLy(dist) : "unknown"], ["Size", sizeLy >= 1 ? (est ? "≈" : "") + fmtNum(sizeLy) + " ly" : ang ? fmtArc(d[5]) + " wide" : "—"], ["Viewing", viewTxt(mag)]],
    s1l: "Brightness", s1: mag != null ? "mag " + mag.toFixed(1) : "—", alt: aa.alt, az: aa.az, fact: DFACT[type] || "",
    meta: sentence([ang && (d[5] >= 25 ? `It spans ${nf(sig(d[5] / 31, 2), 1)} times the width of the full Moon` : `It looks ${ang} across`),
      d[13] ? `It is moving ${d[13] > 0 ? "away from" : "towards"} us at ${nf(Math.abs(d[13]), 0)} km/s` : "", est && "Its distance is estimated from that speed, so treat it as rough",
      gal && d[12] && `Hubble type ${d[12]}`, riseTxt(d[4])]) };
}
function describeField(o) {
  const f = DF[o.i], h = [fH[o.i * 3], fH[o.i * 3 + 1], fH[o.i * 3 + 2]], aa = altaz(h), yrs = (f.taken.match(/\d{4}/g) || []);
  const when = yrs.length ? (yrs[0] === yrs[yrs.length - 1] ? yrs[0] : yrs[0] + "–" + yrs[yrs.length - 1].slice(2)) : "—";
  return { key: "f" + o.i, kind: "Deep field · " + (SKY.full[f.con] || ""), name: f.name, alias: "",
    a: [["Width", f.width.replace(/^about /, "≈")], ["Galaxies", f.galaxies ? f.galaxies.replace(/^About /, "≈") : "—"], ["Taken", when]],
    s1l: "Brightness", s1: "Very faint", alt: aa.alt, az: aa.az, fact: f.fact,
    meta: sentence([f.dist && `The cluster at its centre is about ${fmtLy(f.dist)} away`, (/^Released/.test(f.taken) ? f.taken.replace(/^Released/, "Released on") : `Observed ${f.taken}`),
      "There is nothing to see here without a large telescope and long exposures", riseTxt(f.dec)]) };
}

let lastKey = "";
function describe(o) {
  if (!o) {
    const aa = altaz(F), c = conSymAt(F), ci = c && CINFO[c.symbol];
    const hint = aa.alt < 0 ? "The crosshair is below the horizon." : sunAlt > -6 ? "The Sun is up, so stars aren't visible right now. Tap the clock and choose Tonight at dark." : "";
    if (!ci) return { key: "c?", kind: "Sky", name: "—", alias: "", a: [], s1l: "Brightness", s1: "—", alt: aa.alt, az: aa.az, fact: hint, meta: "" };
    const [area, raC, dmin, dmax, count, bi, rank] = ci, bn = bi >= 0 ? starName(bi) : "—";
    return { key: "c" + c.symbol, kind: "Constellation" + (ZODIAC.has(c.symbol) ? " · Zodiac" : ""), name: c.name, alias: MEANING[c.symbol] || "",
      a: [["Area", nf(area, 0) + " sq°"], ["Size rank", ord(rank) + " of 88"], ["Visible stars", nf(count, 0)]],
      s1l: "Brightest", s1: bn, alt: aa.alt, az: aa.az,
      fact: (hint ? hint + " " : "") + `Best seen in the evening in ${bestMonth(raC)}. ` + conVis(dmin, dmax),
      meta: sentence([bi >= 0 && `Its brightest star is ${bn}, magnitude ${st[bi * 4 + 2].toFixed(1)}`,
        `It covers ${nf(sig(area / 412.53, 2), 1)}% of the whole sky`,
        c.symbol === "Oph" && "The Sun passes through it every December, although it isn't one of the traditional zodiac signs"]) };
  }
  if (o.t === "b") return describeBody(o);
  if (o.t === "n") return describeMoon(o);
  if (o.t === "k") return describeMinor(o);
  if (o.t === "d") return describeDSO(o);
  if (o.t === "f") return describeField(o);
  if (o.t === "s") {
    const i = o.i, n = NAMES[i], h = [sH[i * 3], sH[i * 3 + 1], sH[i * 3 + 2]], aa = altaz(h), inf = SINFO[i] || [];
    const [hip, ly, sp, T, L, R, M, kc, vname, vmin, vmax] = inf;
    const con = (n && SKY.full[n[2]]) || conAt(h) || "", name = starName(i);
    const desig = n && n[0] && n[1] ? n[1] : "";
    const spec = sp ? sp.replace(/([0-9.])(Iab|Ia|Ib|III|II|IV|V|I)/, "$1 $2") : "";
    const far = ly > 1500, est = (s) => (s === "—" ? s : "≈" + s);
    return { key: "s" + i, kind: (kc >= 0 ? KINDS[kc] : "Star") + (con ? " · " + con : ""), name, alias: [desig, spec].filter(Boolean).join(" · "),
      a: [["Distance", (far ? "≈" : "") + fmtLy(ly)], ["Size", R ? est(fmtSize(R)) : "—"], ["Mass", M ? est(fmtMass(M)) : "—"]],
      s1l: "Brightness", s1: "mag " + st[i * 4 + 2].toFixed(1), alt: aa.alt, az: aa.az,
      fact: (n && FACTS[n[0]]) || (st[i * 4 + 2] < 2 ? "One of the brightest stars in the sky." : ""),
      meta: sentence([T && `Its surface is about ${nf(sig(T - 273, 2), 0)} °C, which looks ${colorWord(T)}`, L && cap(powerTxt(L)),
        vname && vmin != null && vmin - vmax > 0.1 && "Its brightness varies", riseTxt(st[i * 4 + 1]),
        far && "Distance, size and mass are rough this far out"]) };
  }
  const m = MES[o.i], h = [mH[o.i * 3], mH[o.i * 3 + 1], mH[o.i * 3 + 2]], aa = altaz(h), mi = MINFO[m[0]], con = conAt(h) || "";
  if (!mi) return { key: "m" + o.i, kind: TYPE[m[2]] || "Deep-sky object", name: m[1] || m[0], alias: m[0], a: [], s1l: "Brightness", s1: "mag " + m[3], alt: aa.alt, az: aa.az, fact: "", meta: "" };
  const [mname, mtype, mdist, msize, season, diff, alts, ang] = mi;
  const amax = Math.max(...String(ang).split("×").map((x) => parseFloat(x)));
  return { key: "m" + o.i, kind: mtype + (con ? " · " + con : ""), name: m[1] || mname, alias: [m[0], m[6], ...(alts || [])].filter(Boolean).join(" · "),
    a: [["Distance", fmtLy(mdist)], ["Size", msize >= 1 ? fmtNum(msize) + " ly" : "—"], ["Viewing", diff]],
    s1l: "Brightness", s1: "mag " + m[3], alt: aa.alt, az: aa.az,
    fact: MESSIER_FACTS[m[0]] || (m[3] <= 6 ? "Visible in binoculars from a dark site." : "Needs binoculars or a telescope and a dark sky."),
    meta: sentence([amax >= 25 ? `It spans ${nf(sig(amax / 31, 2), 1)} times the width of the full Moon` : `It looks ${ang.replace(/'/g, "′")} across`,
      `Best seen in ${seasonHere(season)}`, riseTxt(m[5])]) };
}
let cardT = 0;
function updateCard(force) {
  const now = performance.now(); if (!force && now - cardT < 180) return; cardT = now;
  const o = pinned || target, d = describe(o);
  const k = d.key + d.s1 + Math.round(d.alt * 2) + Math.round(d.az) + (d.a[0] ? d.a[0][1] : "") + d.fact.length;
  if (k === lastKey) return; lastKey = k;
  $("kind").textContent = d.kind; $("name").textContent = d.name;
  $("alias").textContent = d.alias; $("alias").hidden = !d.alias;
  $("statsA").hidden = !d.a.length;
  d.a.forEach(([l, v], j) => { $("a" + (j + 1) + "l").textContent = l; $("a" + (j + 1)).textContent = v; $("a" + (j + 1)).title = v; });
  $("s1l").textContent = d.s1l; $("s1").textContent = d.s1; $("s1").title = d.s1;
  $("s2").textContent = (d.alt >= 0 ? "" : "−") + Math.abs(d.alt).toFixed(0) + "°";
  $("s3").textContent = dirTxt(d.az);
  $("fact").textContent = d.fact; $("fact").hidden = !d.fact;
  $("meta").textContent = d.meta; $("meta").hidden = !d.meta;
  $("unpin").hidden = !pinned;
}

/* ---------- clock & place ---------- */
const pad = (n) => String(n).padStart(2, "0");
const fmtTime = (ms, o) => new Date(ms).toLocaleString([], Object.assign({ timeZone: S.tz }, o));
const hm = (ms) => (ms == null ? "—" : fmtTime(ms, { hour: "2-digit", minute: "2-digit" }));
function fmtCoord() {
  return `${Math.abs(S.lat).toFixed(2)}° ${S.lat >= 0 ? "N" : "S"}, ${Math.abs(S.lon).toFixed(2)}° ${S.lon >= 0 ? "E" : "W"}`;
}
function tzLabel(ms) {
  const m = Math.round(tzOff(ms, S.tz) / 60000), a = Math.abs(m);
  return "UTC" + (m ? (m < 0 ? "−" : "+") + Math.floor(a / 60) + (a % 60 ? ":" + pad(a % 60) : "") : "");
}
function fmtClock() {
  const ms = skyDate.getTime(), other = parts(ms, S.tz).year !== parts(Date.now(), S.tz).year;
  const s = fmtTime(ms, other ? { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }
    : { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  $("clock").textContent = s;
  $("timeBtn").setAttribute("aria-label", (T === null ? "Live time " : "Chosen time ") + s + ". Change date and time");
  $("clock").className = T === null ? "" : "shift";
  $("placeName").textContent = S.place || fmtCoord();
}
const placeLine = () => [S.place && S.place + (S.country ? ", " + S.country : ""), fmtCoord(), S.tz.replace(/_/g, " ") + " (" + tzLabel(skyDate.getTime()) + ")"].filter(Boolean).join(" · ");

/* ---------- interaction: drag, pinch, tap ---------- */
const ptrs = new Map();
let pinch0 = 0, fov0 = 0, downX = 0, downY = 0, moved = false;
cv.addEventListener("pointerdown", (e) => {
  cv.setPointerCapture(e.pointerId);
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptrs.size === 1) { downX = e.clientX; downY = e.clientY; moved = false; cv.classList.add("grabbing"); }
  if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); fov0 = V.fov; moved = true; }
});
cv.addEventListener("pointermove", (e) => {
  const p = ptrs.get(e.pointerId); if (!p) return;
  const dx = e.clientX - p.x, dy = e.clientY - p.y;
  p.x = e.clientX; p.y = e.clientY;
  if (ptrs.size === 2) {
    const [a, b] = [...ptrs.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (pinch0 > 0) setFov(fov0 * pinch0 / d);
    return;
  }
  if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) moved = true;
  if ((V.mode === "drag" || !gotOri) && moved) {
    const dpp = V.fov / Math.min(W, H);
    V.az = (V.az - dx * dpp + 360) % 360;
    V.alt = Math.max(-89, Math.min(89, V.alt + dy * dpp));
    dirty = true;
  }
});
const up = (e) => {
  const wasTap = ptrs.size === 1 && !moved;
  ptrs.delete(e.pointerId);
  if (ptrs.size < 2) pinch0 = 0;
  if (!ptrs.size) cv.classList.remove("grabbing");
  if (wasTap && e.type === "pointerup") tap(e.clientX, e.clientY);
};
cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
cv.addEventListener("wheel", (e) => { e.preventDefault(); setFov(V.fov * Math.exp(e.deltaY * 0.0012)); }, { passive: false });
function setFov(f) {
  V.fov = Math.max(0.04, Math.min(camOn ? 100 : 120, f)); dirty = true;
  if (camOn) { S.camFov = V.fov; save(); }
}
$("zin").onclick = () => setFov(V.fov / 1.35);
$("zout").onclick = () => setFov(V.fov * 1.35);

function tap(x, y) {
  let best = null, bd = 30;
  for (const c of cands) { const d = Math.hypot(c.x - x, c.y - y) - Math.min(c.w, 20) * 0.3; if (d < bd) { bd = d; best = c; } }
  pinned = best ? { t: best.t, i: best.i } : null;
  dirty = true; updateCard(true);
}
$("unpin").onclick = () => { pinned = null; dirty = true; updateCard(true); };
const cardHead = document.querySelector(".card-head");
// object card: full, name only, or off (older saved settings map onto these)
if (!["full", "name", "off"].includes(S.cardMode)) S.cardMode = S.cardHidden ? "off" : S.cardMin ? "name" : "full";
function setCardMode(m) {
  S.cardMode = m; save();
  $("card").classList.toggle("name", m === "name");
  document.querySelector(".dock").hidden = m === "off"; $("showCard").hidden = m !== "off";
  const b = $("sizeCard"); b.classList.toggle("up", m === "name");
  b.setAttribute("aria-label", m === "name" ? "Show details" : "Show name only");
  document.querySelectorAll("#cardModeSeg button").forEach((x) => x.setAttribute("aria-pressed", x.dataset.mode === m));
  lastKey = ""; updateCard(true);
}
document.querySelector(".card-btns").addEventListener("click", (e) => e.stopPropagation());
$("sizeCard").onclick = () => setCardMode(S.cardMode === "name" ? "full" : "name");
cardHead.onclick = (e) => { if (!e.target.closest("button")) setCardMode(S.cardMode === "name" ? "full" : "name"); };
$("hideCard").onclick = () => setCardMode("off");
$("showCard").onclick = () => setCardMode("full");
document.querySelectorAll("#cardModeSeg button").forEach((x) => (x.onclick = () => setCardMode(x.dataset.mode)));

/* ---------- point mode: device orientation ---------- */
let oriListening = false, gotOri = false, iosOff = null, oriTimer = null, wakeLock = null;
function screenAngle() { return (screen.orientation && screen.orientation.angle) || window.orientation || 0; }
function onOri(e) {
  if (e.alpha == null || e.beta == null) return;
  let a = e.alpha;
  if (typeof e.webkitCompassHeading === "number" && !isNaN(e.webkitCompassHeading)) {
    const d = ((360 - e.webkitCompassHeading - a + 540) % 360) - 180;
    if (iosOff === null) iosOff = d; else iosOff += (((d - iosOff + 540) % 360) - 180) * 0.08;
    a += iosOff;
  }
  gotOri = true;
  const al = a * D, be = e.beta * D, ga = (e.gamma || 0) * D;
  const cA = Math.cos(al), sA = Math.sin(al), cB = Math.cos(be), sB = Math.sin(be), cG = Math.cos(ga), sG = Math.sin(ga);
  const X = [cA * cG - sA * sB * sG, cG * sA + cA * sB * sG, -cB * sG];
  const Y = [-cB * sA, cA * cB, sB];
  const Z = [cG * sA * sB + cA * sG, sA * sG - cA * cG * sB, cB * cG];
  const th = screenAngle() * D, ct = Math.cos(th), st2 = Math.sin(th);
  const up = [ct * Y[0] + st2 * X[0], ct * Y[1] + st2 * X[1], ct * Y[2] + st2 * X[2]];
  const fw = [-Z[0], -Z[1], -Z[2]];
  if (!pF) { pF = fw; pU = up; }
  else { const k = 0.22; pF = norm(pF.map((v, i) => v + (fw[i] - v) * k)); pU = norm(pU.map((v, i) => v + (up[i] - v) * k)); }
  if (V.mode === "point") {
    const th = calYaw * D; // compass correction from Align
    F = rotz(pF, th); R = norm(cross(F, rotz(pU, th))); U = cross(R, F);
    dirty = true;
  }
}
// Motion permission is asked at most once per visit. iOS needs a tap for it; other phones grant it silently.
let motionOK = null;
const MOTION_NEEDS_TAP = !!(window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function");
async function askMotion() {
  if (motionOK !== null) return motionOK;
  if (MOTION_NEEDS_TAP) {
    try { motionOK = (await DeviceOrientationEvent.requestPermission()) === "granted"; } catch (e) { motionOK = false; }
  } else motionOK = !!window.DeviceOrientationEvent;
  return motionOK;
}
async function enterPoint(explicit = true) {
  const ok = await askMotion();
  if (!ok) return explicit ? failPoint("Motion access was refused, so Point mode can't follow your phone. Drag mode still works. To allow it, close this tab, open the site again and choose Allow.") : setMode("drag");
  if (!oriListening) {
    const ev = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    window.addEventListener(ev, onOri); oriListening = true;
  }
  setMode("point");
  clearTimeout(oriTimer);
  oriTimer = setTimeout(() => {
    if (gotOri) return;
    if (explicit) failPoint("No compass or tilt data reached the app here. Point mode needs a phone and the app opened directly in its browser over https.");
    else setMode("drag");
  }, 2500);
  try { if (navigator.wakeLock && !wakeLock) wakeLock = await navigator.wakeLock.request("screen"); } catch (e) {}
}
function failPoint(msg) {
  setMode("drag"); toast(msg);
}
function setMode(m) {
  V.mode = m;
  $("modeDrag").setAttribute("aria-pressed", m === "drag"); $("modePoint").setAttribute("aria-pressed", m === "point");
  $("alignBtn").hidden = m !== "point";
  if (m === "drag" && camOn) stopCam();
  if (m === "drag" && F) { // keep looking where the phone pointed
    const aa = altaz(F); V.az = aa.az; V.alt = Math.max(-89, Math.min(89, aa.alt));
    if (wakeLock) { try { wakeLock.release(); } catch (e) {} wakeLock = null; }
  }
  dirty = true;
}
$("modeDrag").onclick = () => setMode("drag");
$("modePoint").onclick = () => enterPoint();

/* ---------- camera view ---------- */
let camOn = false, camStream = null, fovBeforeCam = 70, calYaw = 0;
const rotz = (v, t) => { const c = Math.cos(t), s = Math.sin(t); return [v[0] * c + v[1] * s, -v[0] * s + v[1] * c, v[2]]; };
const CAM_MSG = "The camera isn't available here. The Claude viewer blocks it, so open the standalone file in your phone's browser from an https address.";
function autoCamFov() {
  // estimate what the screen shows of a typical 26 mm-equivalent phone camera (about 69° along the long side)
  const v = $("cam"), long = Math.max(v.videoWidth || 4, v.videoHeight || 3), short = Math.min(v.videoWidth || 4, v.videoHeight || 3);
  const portrait = H >= W, tl = Math.tan(34.5 * D), ts = tl * short / long;
  const dw = portrait ? short : long, dh = portrait ? long : short, tw = portrait ? ts : tl, th = portrait ? tl : ts;
  const s = Math.max(W / dw, H / dh);
  const visW = tw * W / (s * dw), visH = th * H / (s * dh);
  return 2 * Math.atan(W <= H ? visW : visH) / D;
}
let camRelease = null;
const camLive = () => camStream && camStream.getVideoTracks().some((t) => t.readyState === "live");
function releaseCam() {
  clearTimeout(camRelease); camRelease = null;
  if (camStream) camStream.getTracks().forEach((t) => t.stop());
  camStream = null;
  if (!camOn) $("cam").srcObject = null;
}
async function startCam() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return toast(CAM_MSG);
  await enterPoint(); // asks for motion access while the tap still counts (only the first time)
  if (V.mode !== "point") return;
  clearTimeout(camRelease); camRelease = null;
  const first = !camLive();
  if (first) {
    try {
      camStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } } });
    } catch (e) {
      return toast(e && e.name === "NotAllowedError" ? "Camera access was refused. Allow the camera for this site in your browser settings, then tap the camera button again." : CAM_MSG);
    }
  }
  if (V.mode !== "point") { releaseCam(); return; }
  const v = $("cam");
  v.onloadedmetadata = () => { if (camOn && S.camFov == null) { V.fov = autoCamFov(); dirty = true; } };
  if (v.srcObject !== camStream) v.srcObject = camStream;
  v.hidden = false;
  try { await v.play(); } catch (e) {}
  camOn = true; fovBeforeCam = V.fov; V.fov = S.camFov || 40;
  if (S.camFov == null && v.videoWidth) V.fov = autoCamFov();
  $("camBtn").setAttribute("aria-pressed", true);
  if (first) toast("Hold the phone up to the sky. If the labels sit beside the real stars, put a bright one you can see in the crosshair and tap Align. Pinch to match the map's scale to the camera.");
  dirty = true;
}
function stopCam() {
  const v = $("cam"); v.hidden = true; try { v.pause(); } catch (e) {}
  if (camOn) V.fov = fovBeforeCam;
  camOn = false; $("camBtn").setAttribute("aria-pressed", false); dirty = true;
  clearTimeout(camRelease); camRelease = setTimeout(releaseCam, 120000);
}
document.addEventListener("visibilitychange", () => { if (document.hidden && !camOn) releaseCam(); });
$("camBtn").onclick = () => (camOn ? stopCam() : startCam());
$("alignBtn").onclick = () => {
  // the user has a real bright object in the crosshair: snap the compass so the map agrees
  const aim = altaz(F);
  let best = null, bs = 1e9;
  const consider = (h, mag, name) => {
    const d = Math.acos(Math.max(-1, Math.min(1, dot(h, F)))) / D;
    if (d > 25) return;
    const s = d + 4 * mag;
    if (s < bs) { bs = s; best = { h, name }; }
  };
  bod.forEach((b) => { if (b.n !== "Sun" && b.alt > -2) consider(b.h, b.n === "Moon" ? -12 : b.mag, b.n === "Moon" ? "the Moon" : b.n); });
  for (let i = 0; i < NS && st[i * 4 + 2] < 2.6; i++) {
    if (sH[i * 3 + 2] < -0.03) continue;
    const n = NAMES[i];
    consider([sH[i * 3], sH[i * 3 + 1], sH[i * 3 + 2]], st[i * 4 + 2], (n && (n[0] || n[1])) || "a bright star");
  }
  if (!best) return toast("There's no bright star or planet within 25° of the crosshair. Aim at the brightest thing you can see and try again.");
  const ta = altaz(best.h);
  calYaw = ((calYaw + ta.az - aim.az) % 360 + 540) % 360 - 180;
  dirty = true;
  toast(`Aligned on ${best.name}. Compass corrected by ${Math.abs(Math.round(calYaw))}°. If that isn't what you aimed at, center it again and tap Align.`);
};
$("resetCam").onclick = () => {
  calYaw = 0; S.camFov = null; save();
  if (camOn) V.fov = autoCamFov();
  dirty = true; toast("Compass correction and camera scale are back to their defaults.");
};

/* ---------- red light ---------- */
function applyRed() { $("redlight").hidden = !S.red; $("redBtn").setAttribute("aria-pressed", S.red); }
$("redBtn").onclick = () => { S.red = !S.red; applyRed(); save(); };

/* ---------- sheets ---------- */
const openS = (id) => { document.querySelectorAll(".scrim").forEach((s) => (s.hidden = s.id !== id)); };
const closeS = (id) => { $(id).hidden = true; };
document.querySelectorAll(".scrim").forEach((s) => s.addEventListener("pointerdown", (e) => { if (e.target === s) closeS(s.id); }));
document.querySelectorAll("[data-close]").forEach((b) => (b.onclick = () => closeS(b.closest(".scrim").id)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") document.querySelectorAll(".scrim").forEach((s) => (s.hidden = true)); });
document.querySelectorAll(".sheet").forEach((f) => f.addEventListener("submit", (e) => e.preventDefault()));
const fine = window.matchMedia && matchMedia("(pointer: fine)").matches;

/* location */
function openLoc() {
  $("fSearch").value = ""; renderResults();
  $("fLat").value = +S.lat.toFixed(4); $("fLon").value = +S.lon.toFixed(4);
  $("curPlace").textContent = "Showing " + placeLine();
  openS("locScrim");
  if (fine) setTimeout(() => $("fSearch").focus(), 30);
}
function applyPlace() { save(); updateSky(); fmtClock(); closeS("locScrim"); }
function search(q) {
  const parts2 = fold(q).split(",").map((s) => s.trim()), qn = parts2[0], qc = parts2[1] || "";
  if (qn.length < 2) return [];
  const out = [];
  for (let i = 0; i < CROWS.length && out.length < 400; i++) {
    const n = CN[i][0];
    let s = n.startsWith(qn) ? 0 : (" " + n).includes(" " + qn) || n.includes("-" + qn) ? 1 : n.includes(qn) ? 2 : CN[i][1].startsWith(qn) ? 3 : -1;
    if (s < 0 || (qc && !CN[i][1].startsWith(qc))) continue;
    out.push([s, i]);
  }
  out.sort((a, b) => a[0] - b[0] || a[1] - b[1]); // rows are already in population order
  return out.slice(0, 8).map((x) => x[1]);
}
function renderResults() {
  const q = $("fSearch").value, ul = $("results"), r = search(q);
  ul.textContent = "";
  $("noRes").hidden = !(q.trim().length >= 2 && !r.length);
  for (const i of r) {
    const c = CROWS[i], li = document.createElement("li"), b = document.createElement("button");
    const nb = document.createElement("b"), sp = document.createElement("span");
    b.type = "button"; b.className = "res";
    nb.textContent = c[0];
    const region = c[2] && !fold(c[2]).includes(CN[i][0]) ? c[2] : "";
    sp.textContent = [region, c[1]].filter(Boolean).join(", ");
    b.append(nb, sp); b.onclick = () => { setCity(c); applyPlace(); };
    li.append(b); ul.append(li);
  }
}
$("fSearch").oninput = renderResults;
$("fSearch").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); const b = $("results").querySelector("button"); if (b) b.click(); } });
["fLat", "fLon"].forEach((id) => $(id).addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); $("coordBtn").click(); } }));
$("coordBtn").onclick = () => {
  const la = parseFloat($("fLat").value), lo = parseFloat($("fLon").value);
  if (!(isFinite(la) && la >= -90 && la <= 90)) return toast("Latitude must be a number from −90 to 90.");
  if (!(isFinite(lo) && lo >= -180 && lo <= 180)) return toast("Longitude must be a number from −180 to 180.");
  S.lat = la; S.lon = lo; S.place = ""; S.country = ""; S.tz = tzFor(la, lo);
  applyPlace();
};
$("geoBtn").onclick = () => {
  const fail = () => { $("geoBtn").textContent = "Use my location"; toast("Your browser didn't share a location here. Search for a city or enter coordinates instead."); };
  if (!navigator.geolocation) return fail();
  $("geoBtn").textContent = "Finding you…";
  try {
    navigator.geolocation.getCurrentPosition((p) => {
      $("geoBtn").textContent = "Use my location";
      let tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
      S.lat = +p.coords.latitude.toFixed(4); S.lon = +p.coords.longitude.toFixed(4);
      S.place = "My location"; S.country = ""; S.tz = tz && validTz(tz) ? tz : tzFor(S.lat, S.lon);
      applyPlace();
    }, fail, { timeout: 8000, maximumAge: 600000 });
  } catch (e) { fail(); }
};
$("placeBtn").onclick = openLoc;

/* time */
const curWall = () => (T === null ? utcToWall(Date.now()) : T);
function night() {
  // the night that contains the chosen moment: search forward from the preceding local noon
  const w = curWall(), day = Math.floor(w / 864e5) * 864e5;
  const noon = day + 12 * 36e5 - (w - day < 12 * 36e5 ? 864e5 : 0);
  const obs = new A.Observer(S.lat, S.lon, 0), t0 = A.MakeTime(new Date(wallToUtc(noon)));
  const ms = (x) => (x ? x.date.getTime() : null), at = (m) => A.MakeTime(new Date(m));
  const q = (f) => { try { return ms(f()); } catch (e) { return null; } };
  const set = q(() => A.SearchRiseSet("Sun", obs, -1, t0, 1));
  const dark = q(() => A.SearchAltitude("Sun", obs, -1, t0, 1, -18));
  const naut = q(() => A.SearchAltitude("Sun", obs, -1, t0, 1, -12));
  const dawn = dark ? q(() => A.SearchAltitude("Sun", obs, +1, at(dark), 1, -18)) : null;
  const rise = q(() => A.SearchRiseSet("Sun", obs, +1, set ? at(set) : t0, 1));
  let noonAlt = 0;
  try { const e = A.Equator("Sun", t0, obs, true, true); noonAlt = A.Horizon(t0, obs, e.ra, e.dec).altitude; } catch (e) {}
  return { set, dark, naut, dawn, rise, noonAlt };
}
function fillTime() {
  const w = new Date(curWall());
  $("fDate").value = `${String(w.getUTCFullYear()).padStart(4, "0")}-${pad(w.getUTCMonth() + 1)}-${pad(w.getUTCDate())}`;
  $("fTime").value = `${pad(w.getUTCHours())}:${pad(w.getUTCMinutes())}`;
  $("tzNote").textContent = `Local time in ${S.place || fmtCoord()}, ${tzLabel(skyDate.getTime())}.` + (T === null ? " Following the clock live." : "");
  $("liveBtn").setAttribute("aria-pressed", T === null);
  const n = night();
  if (!n.set && !n.rise) {
    $("nightA").textContent = n.noonAlt > 0 ? "The Sun stays up all night on this date." : "The Sun stays below the horizon all day on this date.";
    $("nightB").textContent = n.dark ? `Fully dark from ${hm(n.dark)} to ${hm(n.dawn)}.` : "";
  } else {
    $("nightA").textContent = `Sunset ${hm(n.set)}, sunrise ${hm(n.rise)}.`;
    $("nightB").textContent = n.dark ? `Fully dark from ${hm(n.dark)} to ${hm(n.dawn)}.` : "The sky never gets fully dark this night, because the Sun stays less than 18° below the horizon.";
  }
}
function setWall(w) {
  const y = new Date(w).getUTCFullYear();
  if (y < 1000 || y > 2999) return toast("Pick a date between the years 1000 and 2999.");
  T = w; updateSky(); fmtClock(); fillTime();
}
function readInputs() {
  const d = $("fDate").value.split("-").map(Number), t = ($("fTime").value || "00:00").split(":").map(Number);
  if (d.length !== 3 || d.some((x) => !isFinite(x))) return;
  const w = new Date(0); w.setUTCFullYear(d[0], d[1] - 1, d[2]); w.setUTCHours(t[0] || 0, t[1] || 0, 0, 0);
  setWall(w.getTime());
}
$("fDate").onchange = readInputs; $("fTime").onchange = readInputs;
document.querySelectorAll("[data-step]").forEach((b) => (b.onclick = () => setWall(curWall() + +b.dataset.step * 60000)));
$("liveBtn").onclick = () => { T = null; updateSky(); fmtClock(); fillTime(); };
$("duskBtn").onclick = () => {
  const n = night(), t = n.dark || n.naut || (n.set != null ? n.set + 36e5 : null);
  const w = curWall(), day = Math.floor(w / 864e5) * 864e5 - (w % 864e5 < 12 * 36e5 ? 864e5 : 0);
  setWall(t != null ? Math.ceil(utcToWall(t) / 3e5) * 3e5 : day + 22 * 36e5);
};
$("timeBtn").onclick = () => { fillTime(); openS("timeScrim"); };

/* display */
$("setBtn").onclick = () => { $("fLines").checked = S.lines; $("fLabels").checked = S.labels; openS("viewScrim"); };
$("fLines").onchange = () => { S.lines = $("fLines").checked; save(); dirty = true; };
$("fLabels").onchange = () => { S.labels = $("fLabels").checked; save(); dirty = true; };

let toastT = null;
function toast(msg) { const t = $("toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), 5200); }

(function () {
  const d = new Date(SOLAR.checked + "T12:00:00Z").toLocaleDateString([], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  $("dataNote").textContent = `Planet, moon, asteroid and dwarf-planet values come from Wikipedia, last checked ${d}. Stars come from the HYG catalogue, and ${nf(NDS + MES.length, 0)} deep-sky objects from OpenNGC and the Messier catalogue, with distances from Wikipedia where it lists them.`;
})();

/* ---------- loop ---------- */
window.addEventListener("resize", resize);
resize(); applyRed(); updateSky(); fmtClock(); setCardMode(S.cardMode);
if (window.DeviceOrientationEvent && window.matchMedia && matchMedia("(pointer: coarse)").matches) {
  if (MOTION_NEEDS_TAP) {
    // iOS: show Point as chosen, and ask for motion access on the first tap anywhere
    setMode("point");
    toast("Tap anywhere to let the map follow your phone.");
    const first = (e) => {
      document.removeEventListener("click", first, true); document.removeEventListener("touchend", first, true);
      if (e.target.closest && e.target.closest("#modeDrag")) return;
      if (V.mode === "point" && motionOK === null) enterPoint(true);
    };
    document.addEventListener("click", first, true); document.addEventListener("touchend", first, true);
  } else enterPoint(false);
}
setInterval(() => { if (T === null) { updateSky(); fmtClock(); } }, 5000);
function loop() {
  if (dirty) { dirty = false; draw(); updateCard(); }
  requestAnimationFrame(loop);
}
// redraw once fonts arrive so labels use the right face
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => (dirty = true));
loop();
})();
