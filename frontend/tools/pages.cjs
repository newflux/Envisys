// node tools/pages.cjs outDir -> full-page-ish screenshots of key pages at 3 scroll depths (for before/after visual checks)
const puppeteer = require('puppeteer'), fs = require('fs')
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true })
const pages = ['/', '/products', '/verticals', '/verticals/express', '/verticals/design', '/about', '/industries', '/resources', '/in-stock', '/products/et']
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--force_high_performance_gpu'] })
  for (const p of pages) {
    const pg = await b.newPage(); await pg.setViewport({ width: 1440, height: 900 })
    await pg.evaluateOnNewDocument(() => addEventListener('shaders:warm', () => window.__done = (window.__done || 0) + 1))
    await pg.goto('http://localhost:4173' + p, { waitUntil: 'load' }); if (p === '/') await pg.waitForFunction('window.__done >= 1', { timeout: 60000 }).catch(() => {}); await new Promise(r => setTimeout(r, 5000))
    for (const f of [0, 0.35, 0.7]) {
      await pg.evaluate(f => { const sc = document.querySelector('#scroller'), L = window.lenisInstance, t = (sc ? sc.scrollHeight : document.documentElement.scrollHeight) - innerHeight, y = t * f; L ? L.scrollTo(y, { immediate: true }) : sc ? (sc.scrollTop = y) : scrollTo(0, y) }, f)
      await new Promise(r => setTimeout(r, 1800))
      await pg.screenshot({ path: `${out}/${p.replace(/\//g, '_') || '_'}-${f}.png` })
    }
    await pg.close()
  }
  await b.close()
})()
