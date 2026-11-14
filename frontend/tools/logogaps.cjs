// node tools/logogaps.cjs [base] -> dropped frames while the preloader logo animates (timed on the preloader's own timeline)
const puppeteer = require('puppeteer')
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--force_high_performance_gpu'] })
  // warm the GPU process first, like a real browser that is already open
  const w = await b.newPage(); await w.goto('about:blank'); await w.evaluate(() => { const c = document.createElement('canvas'); c.getContext('webgl2'); document.createElement('canvas').getContext('2d') }); await w.close()
  const pg = await b.newPage(); await pg.setViewport({ width: 1440, height: 800 })
  await pg.evaluateOnNewDocument(() => { window.__lg = []; let last = 0; addEventListener('preloader:logo', () => window.__lgEv = '[after logo evt]'); const f = t => { const tl = window.__preloaderTl; if (tl) { const lt = tl.time(); if (lt > 0.1 && lt < 1.9) window.__lg.push(Math.round(t - last)); if (t - last > 120) (window.__big = window.__big || []).push(Math.round(t - last) + '@tl' + lt.toFixed(2) + (window.__lgEv || '')) } last = t; requestAnimationFrame(f) }; requestAnimationFrame(f) })
  await pg.goto((process.argv[2] || 'http://localhost:4173') + '/', { waitUntil: 'load' }); await new Promise(r => setTimeout(r, 6000))
  console.log('long frames:', (await pg.evaluate(() => window.__big || [])).slice(0, 10).join('  '))
  const g = await pg.evaluate(() => window.__lg); const s = [...g].sort((a, b) => b - a)
  console.log('frames during logo', g.length, '| worst gaps (ms)', s.slice(0, 6).join(' '), '| >50ms:', g.filter(x => x > 50).length)
  await b.close()
})()
