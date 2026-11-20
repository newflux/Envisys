// node tools/phonelanding.cjs outDir -> phone landing: real touch swipes down the page, a screenshot after each, and how far each swipe moved
const p = require('puppeteer')
const out = process.argv[2]
;(async () => {
  const b = await p.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] })
  const g = await b.newPage()
  await g.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36' })
  g.on('pageerror', (e) => console.log('pageerror', e.message))
  await g.evaluateOnNewDocument(() => addEventListener('preloader:done', () => (window.__pd = 1)))
  await g.goto('http://localhost:4173/', { waitUntil: 'load' })
  await g.waitForFunction('window.__pd', { timeout: 90000 }); await new Promise((r) => setTimeout(r, 2500))
  const cdp = await g.target().createCDPSession()
  // a real flick: 6 moves of 70 px, 12 ms apart (about 3500 px/s), then let go
  const swipe = async () => { await g.touchscreen.touchStart(200, 650); for (let k = 1; k <= 6; k++) { await g.touchscreen.touchMove(200, 650 - k * 70); await new Promise((r) => setTimeout(r, 12)) } await g.touchscreen.touchEnd() }
  if (process.env.EXP) await g.evaluate((e) => { window.lenisInstance.options.touchInertiaExponent = +e }, process.env.EXP)
  await g.evaluate(() => { const l = window.lenisInstance; window.__v = []; l.on('scroll', () => window.__v.push(Math.round(l.velocity))) })
  for (let i = 0; i < +(process.env.N || 26); i++) {
    const y0 = await g.evaluate(() => document.querySelector('#scroller').scrollTop | 0)
    await swipe(); await new Promise((r) => setTimeout(r, 900))
    const y1 = await g.evaluate(() => document.querySelector('#scroller').scrollTop | 0)
    console.log(`swipe ${i}: ${y0} -> ${y1} (moved ${y1 - y0}) velocities ${(await g.evaluate(() => { const v = window.__v.slice(-12); window.__v = []; return v.join(',') }))}`)
    await g.screenshot({ path: `${out}/sw${String(i).padStart(2, '0')}.png` })
  }
  await b.close()
})()
