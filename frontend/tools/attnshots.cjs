// node tools/attnshots.cjs outDir -> the key screens (desktop + phone) for the attention model
const puppeteer = require('puppeteer'), fs = require('fs')
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true })
const screens = [['home', '/', 0], ['home-fleet', '/', 90], ['products', '/products', 0], ['verticals', '/verticals', 0], ['express', '/verticals/express', 0], ['about', '/about', 0], ['chamber', '/products/et', 0]]
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--force_high_performance_gpu'] })
  for (const mode of ['d', 'm']) for (const [name, path, u] of screens) {
    if (mode === 'm' && u) continue
    const pg = await b.newPage()
    if (mode === 'm') await pg.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36' }); else await pg.setViewport({ width: 1440, height: 900 })
    await pg.evaluateOnNewDocument(() => { addEventListener('preloader:done', () => window.__pd = 1); addEventListener('page:ready', () => window.__pd = 1) })
    await pg.goto('http://localhost:4173' + path, { waitUntil: 'load' })
    await pg.waitForFunction('window.__pd', { timeout: path === '/' || path === '/products' ? 90000 : 3000 }).catch(() => {})
    await new Promise(r => setTimeout(r, 4000))
    if (u) { await pg.evaluate(u => window.lenisInstance.scrollTo(u * 3.9007 * innerHeight / 100, { immediate: true }), u); await new Promise(r => setTimeout(r, 2500)) }
    await pg.screenshot({ path: `${out}/${mode}-${name}.png` }); await pg.close()
  }
  await b.close()
})()
