// node tools/shots.cjs mobile|desktop outPrefix u1 u2 ... -> landing screenshots at timeline positions
const puppeteer = require('puppeteer')
const [mode, pre, ...us] = process.argv.slice(2)
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--force_high_performance_gpu'] })
  const pg = await b.newPage()
  if (mode === 'mobile') await pg.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36' })
  else await pg.setViewport({ width: +(process.env.W || 1440), height: +(process.env.H || 900) })
  await pg.evaluateOnNewDocument(() => addEventListener('shaders:warm', () => window.__done = (window.__done || 0) + 1))
  await pg.goto('http://localhost:4173/' + (process.env.Q || ''), { waitUntil: 'load' }); await pg.waitForFunction('window.__done >= 2', { timeout: 90000 }).catch(() => {}); await new Promise(r => setTimeout(r, 2500))
  for (const u of us) {
    await pg.evaluate(u => window.lenisInstance.scrollTo(u * 3.9007 * innerHeight / 100, { immediate: true }), +u); await new Promise(r => setTimeout(r, 1800))
    await pg.screenshot({ path: `${pre}-${u}.png` })
  }
  await b.close()
})()
