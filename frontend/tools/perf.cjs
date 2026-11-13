// node tools/perf.cjs [base] [mobile]  -> load cost + scroll fps per page
const puppeteer = require('puppeteer')
const base = process.argv[2] || 'http://localhost:4173'
const mobile = process.argv[3] === 'mobile'
const pages = ['/', '/products', '/product/et', '/products/et', '/verticals', '/verticals/express', '/verticals/design', '/about', '/industries', '/resources', '/in-stock']
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl', ...(process.env.LOWGPU ? [] : ['--force_high_performance_gpu']), '--disable-frame-rate-limit', '--disable-gpu-vsync'] })
  const out = []
  for (const p of pages) {
    const pg = await b.newPage()
    if (mobile) { await pg.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36' }); const c = await pg.createCDPSession(); await c.send('Emulation.setCPUThrottlingRate', { rate: 4 }) }
    else await pg.setViewport({ width: 1440, height: 900 })
    let bytes = 0
    pg.on('response', async r => { try { const l = r.headers()['content-length']; bytes += +l || 0 } catch {} })
    await pg.evaluateOnNewDocument(() => { window.__lt = 0; addEventListener('shaders:warm', () => window.__done = (window.__done || 0) + 1); new PerformanceObserver(l => l.getEntries().forEach(e => window.__lt += e.duration)).observe({ type: 'longtask', buffered: true }) })
    const t0 = Date.now()
    await pg.goto(base + p, { waitUntil: 'load', timeout: 60000 }).catch(() => {})
    if (p === '/') await pg.waitForFunction('window.__done >= 2', { timeout: 60000 }).catch(() => {})
    await new Promise(r => setTimeout(r, 4000))
    const fps = await pg.evaluate(async () => {
      const H = innerHeight, sc = document.querySelector('#scroller'), el = sc && sc.scrollHeight > sc.clientHeight + 50 ? sc : null, total = el ? el.scrollHeight : document.documentElement.scrollHeight, L = window.lenisInstance
      const ts = []; let on = true
      const loop = t => { ts.push(t); if (on) requestAnimationFrame(loop) }; requestAnimationFrame(loop)
      const steps = 60, dur = 9000
      for (let i = 0; i <= steps; i++) {
        const y = (total - H) * i / steps
        L ? L.scrollTo(y, { immediate: true }) : el ? (el.scrollTop = y) : scrollTo(0, y)
        await new Promise(r => setTimeout(r, dur / steps))
      }
      on = false
      const d = ts.slice(1).map((t, i) => t - ts[i]).sort((a, b) => a - b)
      const avg = 1000 / (d.reduce((a, b) => a + b, 0) / d.length), p1 = 1000 / d[Math.floor(d.length * 0.99)]
      return { avg: +avg.toFixed(0), low1: +p1.toFixed(0), long: Math.round(window.__lt), h: total }
    })
    out.push({ page: p, ...fps, kb: Math.round(bytes / 1024) })
    console.log(JSON.stringify(out[out.length - 1]))
    await pg.close()
  }
  await b.close()
})()
