// node tools/shotsall.cjs outDir -> desktop + phone screenshots of every page (top + two scroll stops) for before/after diffs
const puppeteer = require('puppeteer'), fs = require('fs')
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true })
const pages = ['/', '/products', '/products/et', '/verticals', '/verticals/express', '/verticals/design', '/verticals/rentals', '/about', '/industries', '/resources', '/in-stock']
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--force_high_performance_gpu'] })
  for (const mode of ['d', 'm']) for (const p of pages) {
    const pg = await b.newPage()
    if (mode === 'm') await pg.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36' }); else await pg.setViewport({ width: 1440, height: 900 })
    await pg.evaluateOnNewDocument(() => addEventListener('shaders:warm', () => window.__done = (window.__done || 0) + 1))
    await pg.goto('http://localhost:4173' + p, { waitUntil: 'load' })
    if (p === '/') await pg.waitForFunction('window.__done >= 2', { timeout: 90000 }).catch(() => {})
    await new Promise(r => setTimeout(r, p === '/' ? 5000 : 3500))
    const n = (mode + p.replace(/\//g, '_')) || mode + '_home'
    await pg.screenshot({ path: `${out}/${n}-0.png` })
    for (const [i, y] of [[1, 1400], [2, 3200]]) {
      await pg.evaluate(y => { const L = window.lenisInstance, sc = document.querySelector('#scroller'); if (L) L.scrollTo(y, { immediate: true }); else if (sc) sc.scrollTop = y }, p === '/' ? y * 4 : y)
      await new Promise(r => setTimeout(r, 1400)); await pg.screenshot({ path: `${out}/${n}-${i}.png` })
    }
    await pg.close()
  }
  await b.close()
})()
