// node tools/headershots.cjs outDir -> header crops: landing (dark) desktop, products (light) desktop, landing phone
const p = require('puppeteer')
;(async () => {
  const b = await p.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--force_high_performance_gpu'] })
  for (const [n, u, mob] of [['hd_home', '/', 0], ['hd_prod', '/products', 0], ['hd_m', '/', 1]]) {
    const q = await b.newPage()
    if (mob) await q.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13) Mobile' })
    else await q.setViewport({ width: 1440, height: 800 })
    await q.evaluateOnNewDocument(() => { addEventListener('preloader:done', () => window.__pd = 1); addEventListener('page:ready', () => window.__pd = 1) })
    await q.goto('http://localhost:4173' + u, { waitUntil: 'load' }); await q.waitForFunction('window.__pd', { timeout: 90000 }).catch(() => {})
    await new Promise(r => setTimeout(r, 4000))
    await q.screenshot({ path: `${process.argv[2]}/${n}.png`, clip: mob ? { x: 0, y: 0, width: 390, height: 120 } : { x: 0, y: 0, width: 1440, height: 110 } })
    await q.close()
  }
  await b.close()
})()
