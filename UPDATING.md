# Monthly data refresh

This is the procedure for the monthly scheduled refresh. It keeps the Wikipedia-sourced values in `data/` current, rebuilds the page, and publishes it.

## What gets refreshed

| File | What it holds | Wikipedia source |
|---|---|---|
| `data/solar.json` → `bodies` | Sun, planets, Moon, Pluto: radius `r` (km), mass `m` (kg), surface gravity `g` (m/s²), rotation `rot` (days), orbit `orb` (days), mean distance from the Sun `au` (km, despite the name) | [List of gravitationally rounded objects of the Solar System](https://en.wikipedia.org/wiki/List_of_gravitationally_rounded_objects_of_the_Solar_System) |
| `bodies.*.moons`, `asOf` | Known moon counts and the "as of" date | Lead sentence of [Moons of Jupiter](https://en.wikipedia.org/wiki/Moons_of_Jupiter), [Moons of Saturn](https://en.wikipedia.org/wiki/Moons_of_Saturn), [Moons of Uranus](https://en.wikipedia.org/wiki/Moons_of_Uranus), [Moons of Neptune](https://en.wikipedia.org/wiki/Moons_of_Neptune), [Moons of Pluto](https://en.wikipedia.org/wiki/Moons_of_Pluto), [Moons of Mars](https://en.wikipedia.org/wiki/Moons_of_Mars) |
| `data/solar.json` → `moons` | The 12 moons drawn on the map: radius, mass, orbit, distance, magnitude | Gravitationally rounded list (Hyperion: [Hyperion (moon)](https://en.wikipedia.org/wiki/Hyperion_(moon))); magnitudes from [List of natural satellites](https://en.wikipedia.org/wiki/List_of_natural_satellites) |
| `data/solar.json` → `minor` | Orbital elements, H, size, mass of 12 asteroids and dwarf planets | Each object's infobox: [Ceres](https://en.wikipedia.org/wiki/Ceres_(dwarf_planet)), [4 Vesta](https://en.wikipedia.org/wiki/4_Vesta), [2 Pallas](https://en.wikipedia.org/wiki/2_Pallas), [3 Juno](https://en.wikipedia.org/wiki/3_Juno), [10 Hygiea](https://en.wikipedia.org/wiki/10_Hygiea), [Haumea](https://en.wikipedia.org/wiki/Haumea), [Makemake](https://en.wikipedia.org/wiki/Makemake), [Eris](https://en.wikipedia.org/wiki/Eris_(dwarf_planet)), [Orcus](https://en.wikipedia.org/wiki/Orcus_(dwarf_planet)), [Quaoar](https://en.wikipedia.org/wiki/Quaoar), [Gonggong](https://en.wikipedia.org/wiki/Gonggong_(dwarf_planet)), [Sedna](https://en.wikipedia.org/wiki/Sedna_(dwarf_planet)) |
| `data/wikipedia/caldwell.csv` | Caldwell names, distances (thousands of ly), magnitudes | [Caldwell catalogue](https://en.wikipedia.org/wiki/Caldwell_catalogue) |
| `data/wikipedia/globulars.csv` | Globular cluster distances (ly) | First table of [List of globular clusters](https://en.wikipedia.org/wiki/List_of_globular_clusters) |
| `data/wikipedia/deepfields.json` | Deep-field coordinates and facts | [Hubble Deep Field](https://en.wikipedia.org/wiki/Hubble_Deep_Field), [Hubble Ultra-Deep Field](https://en.wikipedia.org/wiki/Hubble_Ultra-Deep_Field), [Hubble Deep Field South](https://en.wikipedia.org/wiki/Hubble_Deep_Field_South), [SMACS 0723](https://en.wikipedia.org/wiki/SMACS_0723) |

Not refreshed monthly: stars (`data/stars.js`, `sinfo.json` from the HYG catalogue), Messier data (`minfo.json`), constellation statistics (`cinfo.json`), cities. Those don't change.

## Rules

1. **Read with WebFetch only.** Ask for the exact printed values. The shell can't reach Wikipedia.
2. **Change a value only when the page clearly states a different one.** Keep the units shown above. If a page is unreachable or garbled, keep the existing value and say so in the report.
3. **Moon counts:** take the number from the lead sentence and copy its "as of" date into `asOf` as "Month YYYY". Set `asOf` for Jupiter and Saturn; other planets can stay without it.
4. **Orbital elements:** some infoboxes print an epoch date and a JD that disagree. Check this with the "Time of perihelion" line: the mean anomaly M should be about (days from perihelion to epoch) × (mean motion), where mean motion is 0.9856 / a^1.5 °/day. Use the epoch that fits, as a JD number. Angles stay in degrees on the J2000 ecliptic. `n` is the mean motion in °/day when the infobox gives one (keep `null` otherwise).
5. **Don't add or remove** entries in `moons` (the map draws exactly these 12, in order) or in `minor`, unless the user asked for it. You can add a new body's moon count to `bodies`.
6. Set `checked` in `data/solar.json` to today's date (YYYY-MM-DD), even if nothing else changed.

## Rebuild and check

```sh
# only if caldwell.csv, globulars.csv or deepfields.json changed:
git clone --depth 1 https://github.com/mattiaverga/OpenNGC /tmp/openngc
python3 tools/mkdso.py /tmp/openngc

sh tools/build.sh        # writes index.html and dist/page.html
node tools/check.mjs     # must print "check passed"
```

If the check fails, fix the data, not the check. If it can't be fixed, revert `data/` with `git checkout data/` and report what went wrong.

## Publish

1. Commit everything with a message that lists each changed value (old → new) and its source page, then push to `main`. GitHub Pages republishes https://marx1980.github.io/NightGlass/ within about a minute.
2. If the Artifact tool is available, read the artifact `https://claude.ai/artifact/9NkThKpgLWBJRZjtk4WafF`, then publish `dist/page.html` to that same `url`.
3. Report: what changed (or "no changes"), anything that couldn't be checked, and whether the push and the artifact update succeeded.
