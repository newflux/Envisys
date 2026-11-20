// node tools/wheelprof.cjs [path...] -> desktop wheel-scrolling down each page: frame-time stats, long frames, and where they happen
const p = require('puppeteer')
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/about', '/products/et', '/resources', '/blog/high-altitude-test-chamber', '/standards/iec-60068']
;(async () => {
  const b = await p.launch({ headless: 'new', ...(process.env.PROFILE ? { userDataDir: process.env.PROFILE } : {}), args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', ...(process.env.LOWGPU ? [] : ['--force_high_performance_gpu'])] })
  for (const path of paths) {
    const g = await b.newPage(); await g.setViewport({ width: +(process.env.VW || 1440), height: +(process.env.VH || 900), deviceScaleFactor: +(process.env.DPR || 1) })
    await g.goto((process.env.PORT ? 'http://localhost:' + process.env.PORT : 'http://localhost:4173') + path, { waitUntil: 'load' }); if (process.env.CSS) await g.addStyleTag({ content: process.env.CSS }); await new Promise((r) => setTimeout(r, path === '/products' ? 16000 : 5000))
    await g.evaluate(() => {
      window.__f = []; window.__lt = []
      let last = performance.now(); const loop = (t) => { window.__f.push([t - last, window.lenisInstance?.scroll | 0]); last = t; requestAnimationFrame(loop) }; requestAnimationFrame(loop)
      new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push([Math.round(e.duration), window.lenisInstance?.scroll | 0]))).observe({ type: 'longtask', buffered: false })
    })
    await g.mouse.move(720, 450)
    if (process.env.TWICE) { for (let i = 0; i < 90; i++) { await g.mouse.wheel({ deltaY: 120 }); await new Promise((r) => setTimeout(r, 30)) } await g.evaluate(() => window.lenisInstance.scrollTo(0, { immediate: true })); await new Promise((r) => setTimeout(r, 1500)); await g.evaluate(() => { window.__f = []; window.__lt = [] }) }
    for (let i = 0; i < 90; i++) { await g.mouse.wheel({ deltaY: 120 }); await new Promise((r) => setTimeout(r, 70)) }
    await new Promise((r) => setTimeout(r, 1500))
    const { f, lt } = await g.evaluate(() => ({ f: window.__f.slice(2), lt: window.__lt }))
    const d = f.map((x) => x[0]).sort((a, b) => a - b), q = (k) => d[Math.floor(d.length * k)].toFixed(1)
    const long = f.filter((x) => x[0] > 25)
    console.log(`${path}: frames ${d.length} median ${q(0.5)} p95 ${q(0.95)} max ${d[d.length - 1].toFixed(0)} ms | >25ms: ${long.length} at y ${[...new Set(long.map((x) => Math.round(x[1] / 100) * 100))].slice(0, 12).join(',')} | longtasks ${lt.map((x) => x.join('@')).slice(0, 10).join(' ')}`)
    await g.close()
  }
  await b.close()
})()
