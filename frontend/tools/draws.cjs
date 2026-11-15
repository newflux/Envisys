// node tools/draws.cjs -> phone landing: WebGL draw calls per second per canvas at points through the column
const puppeteer = require('puppeteer')
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--force_high_performance_gpu'] })
  const g = await b.newPage()
  await g.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36' })
  await g.evaluateOnNewDocument(() => {
    addEventListener('preloader:done', () => window.__pd = 1); window.__dc = {}
    for (const C of [WebGLRenderingContext, WebGL2RenderingContext]) for (const fn of ['drawElements', 'drawArrays']) {
      const o = C.prototype[fn]; C.prototype[fn] = function (...a) { const c = this.canvas; const k = (c.className || c.parentElement?.className || '?').toString().split(' ')[0]; window.__dc[k] = (window.__dc[k] || 0) + 1; return o.apply(this, a) }
    }
  })
  await g.goto('http://localhost:4173/', { waitUntil: 'load' }); await g.waitForFunction('window.__pd', { timeout: 90000 }); await new Promise(r => setTimeout(r, 2000))
  for (const at of [0, 60, 120, 200, 300, 400, 500]) {
    await g.evaluate(at => { document.querySelector('#scroller').scrollTop = (window.__envTl.start + at) * 3.9007 * innerHeight / 100 }, at); await new Promise(r => setTimeout(r, 1200))
    await g.evaluate(() => { window.__dc = {} }); await new Promise(r => setTimeout(r, 1000))
    const r = await g.evaluate(() => { const sec = [...document.querySelectorAll('.tr-scroll section, .tr-scroll > div > *')].find(s => { const b = s.getBoundingClientRect(); return b.top < innerHeight / 2 && b.bottom > innerHeight / 2 }); return { dc: window.__dc, sec: sec ? (sec.className || sec.tagName).toString().split(' ')[0] : '-', covered: document.documentElement.dataset.covered } })
    console.log('col+' + String(at).padEnd(4), 'section:', r.sec.padEnd(14), 'covered:', r.covered || '-', '| draws/s:', JSON.stringify(r.dc))
  }
  await b.close()
})()
