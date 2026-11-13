#!/bin/bash
# bash tools/bench.sh outdir base  -> Lighthouse mobile+desktop for the key pages (needs `vite preview` on the base url)
OUT=${1:-bench}; BASE=${2:-http://localhost:4173}; mkdir -p $OUT
CP=$(node -e "console.log(require('puppeteer').executablePath())")
F="--headless=new --use-angle=d3d11 --enable-gpu --ignore-gpu-blocklist --force_high_performance_gpu"
for p in "" products verticals verticals/express about industries resources in-stock; do
  n=$(echo "home/$p" | tr '/' '_')
  CHROME_PATH="$CP" npx lighthouse "$BASE/$p" --quiet --chrome-flags="$F" --output=json --output-path=$OUT/$n-mobile.json --only-categories=performance,accessibility,best-practices,seo > /dev/null 2>&1
  CHROME_PATH="$CP" npx lighthouse "$BASE/$p" --quiet --preset=desktop --chrome-flags="$F" --output=json --output-path=$OUT/$n-desktop.json --only-categories=performance,accessibility,best-practices,seo > /dev/null 2>&1
done
echo finished > $OUT/DONE
