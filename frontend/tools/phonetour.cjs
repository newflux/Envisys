// node tools/phonetour.cjs outDir [base] -> phone screenshots of every page at 8 scroll points (+ the open hamburger menu)
const puppeteer = require('puppeteer'), fs = require('fs')
const out = process.argv[2], base = process.argv[3] || 'http://localhost:4173'; fs.mkdirSync(out, { recursive: true })
const pages = (process.env.PAGES || '/,/products,/products/et,/verticals,/verticals/express,/verticals/rentals,/about,/industries,/resources,/in-stock').split(',')
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--force_high_performance_gpu'] })
  for (const p of pages) {
    const pg = await b.newPage()
    await pg.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36' })
    await pg.evaluateOnNewDocument(() => { addEventListener('preloader:done', () => window.__pd = 1); addEventListener('page:ready', () => window.__pd = 1) })
    await pg.goto(base + p, { waitUntil: 'load', timeout: 90000 })
    await pg.waitForFunction('window.__pd', { timeout: p === '/' || p === '/products' ? 60000 : 4000 }).catch(() => {})
    await new Promise(r => setTimeout(r, 3500))
    const n = p === '/' ? 'home' : p.slice(1).replace(/\//g, '_')
    const total = await pg.evaluate(() => { const s = document.querySelector('#scroller'); return s ? s.scrollHeight - innerHeight : 0 })
    const N = +(process.env.N || 8); for (let i = 0; i < N; i++) {
      await pg.evaluate(y => { const L = window.lenisInstance, s = document.querySelector('#scroller'); L ? L.scrollTo(y, { immediate: true }) : s && (s.scrollTop = y) }, Math.round(total * i / (N - 1)))
      await new Promise(r => setTimeout(r, 1300)); await pg.screenshot({ path: `${out}/${n}-${i}.png` })
    }
    if (p === '/about') { await pg.evaluate(() => { const L = window.lenisInstance; L && L.scrollTo(0, { immediate: true }) }); await new Promise(r => setTimeout(r, 600)); const hb = await pg.$('.hamburger, [class*="hamburger"], [aria-label*="menu" i]'); if (hb) { await hb.click(); await new Promise(r => setTimeout(r, 1400)); await pg.screenshot({ path: `${out}/menu.png` }) } }
    await pg.close()
  }
  await b.close()
})()
