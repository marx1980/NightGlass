#!/bin/sh
# Assemble the single-page app from src/ and data/.
#   dist/page.html  page body, as published to the Claude artifact
#   index.html      full standalone page, served by GitHub Pages
set -e
cd "$(dirname "$0")/.."
mkdir -p dist
{
  cat src/head.html src/body.html
  echo '<script src="https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js"></script>'
  echo '<script>'
  cat data/stars.js; echo
  cat data/cities.js; echo
  printf 'const SINFO='; cat data/sinfo.json
  printf ';\nconst MINFO='; cat data/minfo.json
  printf ';\nconst CINFO='; cat data/cinfo.json
  printf ';\nconst DSO='; cat data/dso.json
  printf ';\nconst SOLAR='; cat data/solar.json
  echo ';'
  echo '</script>'
  echo '<script>'; cat data/satmoons.js; echo; echo '</script>'
  echo '<script>'; cat src/app.js; echo '</script>'
} > dist/page.html
{
  echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#060a14"><style>html,body{margin:0}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style></head><body>'
  cat dist/page.html
  echo '</body></html>'
} > index.html
echo "built index.html ($(wc -c < index.html) bytes)"
