# NightGlass

A sky map that runs in your phone's browser. Point the phone at the sky, or turn on the camera view, and it names the star, planet, moon, constellation or deep-sky object in the crosshair. Works for any place on Earth and any date from the year 1000 to 2999.

To find something, tap the magnifier button and search by name (stars, planets, moons, constellations, Messier, NGC/IC objects, deep fields), or tap an object and press the arrow button on its card. An arrow from the crosshair guides you as you move the phone. Objects get a light green ring; constellations get bold green lines.

Open it at https://marx1980.github.io/NightGlass/ and allow camera and motion access when asked.

## Layout

- `index.html`: the built app (GitHub Pages serves this)
- `src/`: page markup, styles and app code
- `data/`: catalogues the build bundles in
- `tools/build.sh`: rebuilds `index.html` and `dist/page.html`
- `tools/check.mjs`: sanity checks after a data change
- `tools/mkdso.py`: rebuilds the deep-sky list from OpenNGC plus the Wikipedia tables
- `UPDATING.md`: the monthly Wikipedia refresh procedure

## Data sources

- Star positions and names: d3-celestial (Yale Bright Star Catalogue)
- Star distances, spectral types and luminosities: HYG Database v4.1 (CC BY-SA 4.0), built on Hipparcos parallaxes
- Star sizes and masses: estimated from luminosity and temperature, typically within about 30% for nearby stars and rougher for distant supergiants
- Messier objects: messier-api (MIT), based on SEDS values
- About 3,000 NGC and IC objects: OpenNGC (CC BY-SA 4.0). Distances come from Wikipedia's Caldwell catalogue and globular cluster list where available, otherwise from redshift (Hubble's law, H₀ = 70 km/s/Mpc) for galaxies
- Hubble and Webb deep fields: Wikipedia
- Constellation areas: computed from the IAU boundaries
- Sun, Moon, planets, Pluto and Jupiter's moons: positions from astronomy-engine
- Saturn's eight main moons: Meeus chapter 46 via astronomia (MIT)
- Dwarf planets and large asteroids: Wikipedia orbital elements, two-body orbits (shown for 1990–2060, or 1900–2150 beyond Neptune)
- Sizes, masses, rotation, orbits, moon counts and discovery dates of Solar System bodies: Wikipedia, refreshed monthly (see `UPDATING.md`)
- Cities and time zones: city-timezones
