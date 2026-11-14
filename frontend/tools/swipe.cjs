// node tools/swipe.cjs [path...] -> swipe a phone all the way down each page; reports where scrolling gets stuck and what is under the finger
const puppeteer = require('puppeteer')
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/products', '/verticals', '/about']
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--force_high_performance_gpu'] })
  for (const path of paths) {
    const g = await b.newPage()
    await g.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36' })
    await g.evaluateOnNewDocument(() => { addEventListener('preloader:done', () => window.__pd = 1); addEventListener('page:ready', () => window.__pd = 1) })
    await g.goto('http://localhost:4173' + path, { waitUntil: 'load' })
    await g.waitForFunction('window.__pd', { timeout: path === '/' || path === '/products' ? 90000 : 3000 }).catch(() => {}); await new Promise(r => setTimeout(r, 2500))
    const st = () => g.evaluate(() => { const s = document.querySelector('#scroller'); return { y: Math.round(s ? s.scrollTop : scrollY), max: Math.round(s ? s.scrollHeight - s.clientHeight : 0) } })
    let last = -1, stuck = 0, i = 0, r
    for (; i < 160; i++) {
      await g.touchscreen.touchStart(200, 650); for (let k = 1; k <= 6; k++) { await g.touchscreen.touchMove(200, 650 - k * 70); await new Promise(r => setTimeout(r, 12)) } await g.touchscreen.touchEnd()
      await new Promise(r => setTimeout(r, 220)); r = await st()
      if (r.y >= r.max - 5) break
      if (Math.abs(r.y - last) < 3) { if (++stuck >= 3) break } else stuck = 0
      last = r.y
    }
    const under = await g.evaluate(() => { let e = document.elementFromPoint(200, 500), c = []; while (e && c.length < 5) { c.push(e.tagName.toLowerCase() + (typeof e.className === 'string' && e.className ? '.' + e.className.split(' ')[0] : '')); e = e.parentElement } return c.join(' < ') })
    const state = await g.evaluate(() => { const s = document.querySelector('#scroller'); return 'scroller class=' + s.className + ' overflow=' + getComputedStyle(s).overflowY + ' html=' + document.documentElement.className + ' modal=' + !!document.querySelector('.cp-modal.on, .cp-open, [class*=cp-sheet]') })
    console.log(path.padEnd(11), state, r.y >= r.max - 5 ? 'reached the bottom' : 'STUCK at ' + r.y + ' of ' + r.max, '| swipes', i, '| under finger:', under)
    await g.close()
  }
  await b.close()
})()
