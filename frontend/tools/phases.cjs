// node tools/phases.cjs [mobile] -> landing fps at fixed timeline positions (u); needs `vite preview` on :4173
const puppeteer = require('puppeteer')
const mobile = process.argv[2] === 'mobile'
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', ...(process.env.LOWGPU ? [] : ['--force_high_performance_gpu']), '--disable-frame-rate-limit', '--disable-gpu-vsync'] })
  const pg = await b.newPage()
  if (mobile) await pg.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36' })
  else await pg.setViewport({ width: 1440, height: 900 })
  await pg.evaluateOnNewDocument(() => addEventListener('shaders:warm', () => window.__done = (window.__done || 0) + 1))
  await pg.goto('http://localhost:4173/' + (process.env.Q || ''), { waitUntil: 'load' }); await pg.waitForFunction('window.__done >= 2', { timeout: 90000 }).catch(() => {}); await new Promise(r => setTimeout(r, 2500))
  const us = mobile ? [2, 20, 60, 90, 120, 200, 400, 600] : [5, 40, 90, 120, 135, 150, 170, 300, 500]
  for (const u of us) {
    const r = await pg.evaluate(async u => {
      window.lenisInstance.scrollTo(u * 3.9007 * innerHeight / 100, { immediate: true }); await new Promise(r => setTimeout(r, 1200))
      const ts = []; let on = true; const f = t => { ts.push(t); on && requestAnimationFrame(f) }; requestAnimationFrame(f)
      await new Promise(r => setTimeout(r, 2000)); on = false
      const d = ts.slice(1).map((t, i) => t - ts[i]).sort((a, b) => a - b)
      return { fps: Math.round(1000 / (d.reduce((a, b) => a + b, 0) / d.length)), p99ms: Math.round(d[Math.floor(d.length * .99)]) }
    }, u)
    console.log('u', u, JSON.stringify(r))
  }
  await b.close()
})()
