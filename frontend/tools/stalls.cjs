// node tools/stalls.cjs [path] -> link/compile stalls (>150ms) during load with deep stacks; LOWGPU=1 for integrated GPU
const puppeteer = require('puppeteer')
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', ...(process.env.LOWGPU ? [] : ['--force_high_performance_gpu'])] })
  const pg = await b.newPage(); await pg.setViewport({ width: 1747, height: 862 })
  await pg.evaluateOnNewDocument(() => {
    window.__sh = []
    for (const C of [WebGL2RenderingContext]) {
      const o = C.prototype.getProgramInfoLog
      C.prototype.getProgramInfoLog = function (p) { const t = performance.now(), r = o.call(this, p), d = performance.now() - t
        if (d > 120) window.__sh.push([Math.round(t), Math.round(d), new Error().stack.split('\n').slice(3, 30).map(l => l.trim().replace(/\(https?:\/\/[^/]*\/assets\//, '(').replace(/^at /, '')).join(' < ')]); return r }
    }
  })
  await pg.goto('http://localhost:' + (process.env.PORT || 4173) + '' + (process.argv[2] || '/'), { waitUntil: 'load' }); await new Promise(r => setTimeout(r, 20000))
  const s = await pg.evaluate(() => window.__sh); console.log(s.length, 'stalls', s.reduce((a, x) => a + x[1], 0), 'ms'); s.slice(0, 40).forEach(x => console.log(x[0] + '@' + x[1] + ' ' + x[2])); await b.close()
})()
