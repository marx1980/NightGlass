# Data refresh

There are two scheduled runs:

- **Yearly, 1 January: full refresh** of every Wikipedia-sourced value in the table below.
- **Quarterly, 1 April, July, October: moon counts only** (the `bodies.*.moons` and `asOf` row; see "Quarterly moon-count check" at the end). The January full refresh covers the fourth quarter.

The rest of this file describes the full refresh. It keeps the Wikipedia-sourced values in `data/` current, rebuilds the page, and publishes it.

## What gets refreshed

| File | What it holds | Wikipedia source |
|---|---|---|
| `data/solar.json` → `bodies` | Sun, planets, Moon, Pluto: radius `r` (km), mass `m` (kg), surface gravity `g` (m/s²), rotation `rot` (days), orbit `orb` (days), mean distance from the Sun `au` (km, despite the name) | [List of gravitationally rounded objects of the Solar System](https://en.wikipedia.org/wiki/List_of_gravitationally_rounded_objects_of_the_Solar_System) |
| `bodies.*.moons`, `asOf` | Known moon counts and the "as of" date | Lead sentence of [Moons of Jupiter](https://en.wikipedia.org/wiki/Moons_of_Jupiter), [Moons of Saturn](https://en.wikipedia.org/wiki/Moons_of_Saturn), [Moons of Uranus](https://en.wikipedia.org/wiki/Moons_of_Uranus), [Moons of Neptune](https://en.wikipedia.org/wiki/Moons_of_Neptune), [Moons of Pluto](https://en.wikipedia.org/wiki/Moons_of_Pluto), [Moons of Mars](https://en.wikipedia.org/wiki/Moons_of_Mars) |
| `data/solar.json` → `moons` | The 12 moons drawn on the map: radius, mass, orbit, distance, magnitude | Gravitationally rounded list (Hyperion: [Hyperion (moon)](https://en.wikipedia.org/wiki/Hyperion_(moon))); magnitudes from [List of natural satellites](https://en.wikipedia.org/wiki/List_of_natural_satellites) |
| `data/solar.json` → `minor` | Orbital elements, H, size, mass of 12 asteroids and dwarf planets | Each object's infobox: [Ceres](https://en.wikipedia.org/wiki/Ceres_(dwarf_planet)), [4 Vesta](https://en.wikipedia.org/wiki/4_Vesta), [2 Pallas](https://en.wikipedia.org/wiki/2_Pallas), [3 Juno](https://en.wikipedia.org/wiki/3_Juno), [10 Hygiea](https://en.wikipedia.org/wiki/10_Hygiea), [Haumea](https://en.wikipedia.org/wiki/Haumea), [Makemake](https://en.wikipedia.org/wiki/Makemake), [Eris](https://en.wikipedia.org/wiki/Eris_(dwarf_planet)), [Orcus](https://en.wikipedia.org/wiki/Orcus_(dwarf_planet)), [Quaoar](https://en.wikipedia.org/wiki/Quaoar), [Gonggong](https://en.wikipedia.org/wiki/Gonggong_(dwarf_planet)), [Sedna](https://en.wikipedia.org/wiki/Sedna_(dwarf_planet)) |
| `data/wikipedia/caldwell.csv` | Caldwell names, distances (thousands of ly), magnitudes | [Caldwell catalogue](https://en.wikipedia.org/wiki/Caldwell_catalogue) |
| `data/wikipedia/globulars.csv` | Globular cluster distances (ly) | First table of [List of globular clusters](https://en.wikipedia.org/wiki/List_of_globular_clusters) |
| `data/wikipedia/stars.csv` | Radius (Suns) and mass (Suns) of named stars (`HIP,Name,Page,R,M`); the card shows these without "≈". Rows come from `data/sinfo.json` targets: the 493 proper-named stars | Each star's article infobox (Sirius, Alpha Phoenicis, ...). Use the star's own page; for ranges use the midpoint, for equatorial/polar radii the equatorial; leave blank if the page gives none or an ambiguous value |
| `data/wikipedia/messier.csv` | Messier distances (thousands of ly) | Table in [Messier object](https://en.wikipedia.org/wiki/Messier_object) (midpoint of ranges) |
| `data/wikipedia/galaxies.csv` | Distances (ly) of galaxies brighter than magnitude 11 (`ID,Page,DistLy`); used before the redshift estimate | Each galaxy's infobox (Mly → ly; midpoint of ranges) |
| `data/wikipedia/deepfields.json` | Deep-field coordinates and facts | [Hubble Deep Field](https://en.wikipedia.org/wiki/Hubble_Deep_Field), [Hubble Ultra-Deep Field](https://en.wikipedia.org/wiki/Hubble_Ultra-Deep_Field), [Hubble Deep Field South](https://en.wikipedia.org/wiki/Hubble_Deep_Field_South), [SMACS 0723](https://en.wikipedia.org/wiki/SMACS_0723) |

Not refreshed by this routine: star positions and spectral data (`data/stars.js`, `sinfo.json` from the HYG catalogue), the other Messier data (`minfo.json`), constellation statistics (`cinfo.json`), cities. Those don't change.

## Rules

1. **Read each page with WebSearch first, then WebFetch.** WebFetch only opens a URL that has already appeared in a WebSearch result in the same run (anything else fails with `URL_NOT_ON_ALLOWLIST`, no matter the site). So for every page in the table above: run `WebSearch` with `allowed_domains: ["en.wikipedia.org"]` and the exact page title as the query (for example `Sedna (dwarf planet)`), check that the page's URL is in the results, then `WebFetch` that exact URL with a prompt asking for the specific values (infobox rows, or the table rows needed; for long tables such as Caldwell or the globular list, fetch in parts with `offset`). One search per page; a single multi-page query does not reliably return every page. No subagents. The shell can't reach Wikipedia. A value that can't be read from the fetched page stays as it is and goes in the report as unchecked.
2. **Change a value only when the page clearly states a different one.** Keep the units shown above. If a page is unreachable or garbled, keep the existing value and say so in the report.
3a. **Stars and galaxies: do all rows.** Check every row of `stars.csv` and `galaxies.csv`, and try again every target that has no row yet (`stars_targets`: the 493 proper-named stars; `galaxies`: those brighter than magnitude 11 whose distance isn't from another table). Rows with no usable page stay out of the CSV. A WebSearch tool call is limited per turn, so a long run may need several turns; keep going until every row is done.
3. **Moon counts:** take the number from the lead sentence and copy its "as of" date into `asOf` as "Month YYYY". Set `asOf` for Jupiter and Saturn; other planets can stay without it.
4. **Orbital elements:** some infoboxes print an epoch date and a JD that disagree. Check this with the "Time of perihelion" line: the mean anomaly M should be about (days from perihelion to epoch) × (mean motion), where mean motion is 0.9856 / a^1.5 °/day. Use the epoch that fits, as a JD number. Angles stay in degrees on the J2000 ecliptic. `n` is the mean motion in °/day when the infobox gives one (keep `null` otherwise).
5. **Don't add or remove** entries in `moons` (the map draws exactly these 12, in order) or in `minor`, unless the user asked for it. You can add a new body's moon count to `bodies`.
6. Set `checked` in `data/solar.json` to today's date (YYYY-MM-DD), even if nothing else changed.

## Rebuild and check

```sh
# only if caldwell.csv, globulars.csv, galaxies.csv or deepfields.json changed:
git clone --depth 1 https://github.com/mattiaverga/OpenNGC /tmp/openngc
python3 tools/mkdso.py /tmp/openngc
# only if stars.csv or messier.csv changed:
python3 tools/mkwiki.py

sh tools/build.sh        # writes index.html and dist/page.html
node tools/check.mjs     # must print "check passed"
```

If the check fails, fix the data, not the check. If it can't be fixed, revert `data/` with `git checkout data/` and report what went wrong.

## Publish

1. Commit everything with a message that lists each changed value (old → new) and its source page, then push to `main`. GitHub Pages republishes https://marx1980.github.io/NightGlass/ within about a minute.
2. If the Artifact tool is available, read the artifact `https://claude.ai/artifact/9NkThKpgLWBJRZjtk4WafF`, then publish `dist/page.html` to that same `url`.
3. Report: what changed (or "no changes"), anything that couldn't be checked, and whether the push and the artifact update succeeded.

## Quarterly moon-count check (April, July, October)

Only these steps; change nothing else.

1. For Jupiter, Saturn, Uranus, Neptune, Pluto and Mars: WebSearch (`allowed_domains: ["en.wikipedia.org"]`, query = page title, e.g. `Moons of Saturn`), then WebFetch that URL and read the count from the lead sentence.
2. If a count changed, update `bodies.*.moons` in `data/solar.json` and set `asOf` ("Month YYYY") for Jupiter and Saturn to the date in the lead sentence. Set `checked` to today.
3. Rebuild and check (`sh tools/build.sh`, `node tools/check.mjs`), commit, push to `main`, and publish `dist/page.html` to the artifact as in "Publish". If no count changed, change nothing and just report "no changes".
