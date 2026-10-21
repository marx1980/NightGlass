# Nightglass

A sky map that runs in your phone's browser. Point the phone at the sky, or turn on the camera view, and it names the star, planet, constellation or deep-sky object in the crosshair. Works for any place on Earth and any date from the year 1000 to 2999.

Open it at https://marx1980.github.io/NightGlass/ and allow camera and motion access when asked.

Everything is in `index.html`. Data sources:

- Star positions and names: d3-celestial (Yale Bright Star Catalogue)
- Star distances, spectral types and luminosities: HYG Database v4.1 (CC BY-SA 4.0), built on Hipparcos parallaxes
- Star sizes and masses: estimated from luminosity and temperature, typically within about 30% for nearby stars and rougher for distant supergiants
- Messier distances and sizes: messier-api (MIT), based on SEDS values
- Constellation areas: computed from the IAU boundaries
- Planet, Moon and Sun positions and distances: astronomy-engine
- Cities and time zones: city-timezones
