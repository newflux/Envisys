// node tools/imgmap.cjs path -> every image/video on the page: scroll position, decoded size (megapixels), shown size; biggest first
const p = require('puppeteer')
;(async () => {
  const b = await p.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu'] })
  const g = await b.newPage(); await g.setViewport({ width: 1440, height: 900 })
  await g.goto('http://localhost:4173' + process.argv[2], { waitUntil: 'load' }); await new Promise((r) => setTimeout(r, 5000))
  const rows = await g.evaluate(() => {
    const sc = document.querySelector('#scroller')
    return [...document.querySelectorAll('img, video')].map((e) => {
      const r = e.getBoundingClientRect()
      return { y: Math.round(r.top + (sc?.scrollTop || 0)), mp: +((e.naturalWidth || e.videoWidth) * (e.naturalHeight || e.videoHeight) / 1e6).toFixed(1), nat: `${e.naturalWidth || e.videoWidth}x${e.naturalHeight || e.videoHeight}`, shown: `${Math.round(r.width)}x${Math.round(r.height)}`, src: (e.currentSrc || e.src).replace(location.origin, '').slice(0, 60) }
    }).sort((a, b) => b.mp - a.mp)
  })
  for (const r of rows.slice(0, 18)) console.log(String(r.y).padStart(6), String(r.mp).padStart(5) + 'MP', r.nat.padEnd(11), 'shown', r.shown.padEnd(10), r.src)
  await b.close()
})()
