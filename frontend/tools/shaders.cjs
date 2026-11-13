// node tools/shaders.cjs /path -> shader-compile stalls (>100ms) during a full scroll, with callers
const puppeteer = require('puppeteer')
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl', '--force_high_performance_gpu', ...(process.env.LOWGPU ? [] : ['--force_high_performance_gpu'])] })
  const pg = await b.newPage(); await pg.setViewport({ width: 1440, height: 900 })
  await pg.evaluateOnNewDocument(() => {
    window.__sh = []; addEventListener('shaders:warm', () => window.__done = (window.__done || 0) + 1)
    for (const C of [WebGLRenderingContext, WebGL2RenderingContext]) {
      const o = C.prototype.getProgramInfoLog
      C.prototype.getProgramInfoLog = function (p) {
        const t = performance.now(), r = o.call(this, p), d = performance.now() - t
        if (d > 100) window.__sh.push([Math.round(t), Math.round(d), new Error().stack.split('\n').slice(2, 8).map(l => l.trim().replace(/https?:\/\/[^ ]*\//, '')).join(' < ')])
        return r
      }
    }
  })
  await pg.goto('http://localhost:4173' + (process.argv[2] || '/'), { waitUntil: 'load' }); await pg.waitForFunction('window.__done >= 2', { timeout: 60000 }).catch(() => {}); await new Promise(r => setTimeout(r, 4000))
  await pg.evaluate(async () => { window.__t0 = performance.now(); const L = window.lenisInstance, total = document.querySelector('#scroller').scrollHeight; for (let i = 0; i <= 60; i++) { L.scrollTo((total - innerHeight) * i / 60, { immediate: true }); await new Promise(r => setTimeout(r, 150)) } })
  const s = (await pg.evaluate(() => [window.__t0, window.__sh])); const t0 = s[0]; s.splice(0, 2, ...s[1].filter(x => x[0] >= t0))
  console.log(s.length, 'stalls >100ms, total', s.reduce((a, x) => a + x[1], 0), 'ms')
  s.slice(0, 40).forEach(x => console.log(x.join(' | ')))
  await b.close()
})()
