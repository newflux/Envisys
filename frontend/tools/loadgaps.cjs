// node tools/loadgaps.cjs [lowgpu] [path] -> frame gaps (ms) during page load; LOWGPU=1 uses the integrated GPU; CPU=4 throttles
const puppeteer = require('puppeteer')
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', ...(process.env.LOWGPU ? [] : ['--force_high_performance_gpu'])] })
  const pg = await b.newPage(); await pg.setViewport({ width: +(process.env.W || 1747), height: +(process.env.H || 862) })
  if (process.env.CPU) await (await pg.createCDPSession()).send('Emulation.setCPUThrottlingRate', { rate: +process.env.CPU })
  await pg.evaluateOnNewDocument(() => {
    window.__g = []; window.__ev = {}; let last = performance.now()
    const f = t => { window.__g.push([Math.round(t), Math.round(t - last)]); last = t; requestAnimationFrame(f) }; requestAnimationFrame(f)
    addEventListener('shaders:warm', () => (window.__ev.warm = window.__ev.warm || []).push(Math.round(performance.now())))
    addEventListener('preloader:done', () => window.__ev.done = Math.round(performance.now()))
  })
  await pg.goto('http://localhost:4173' + (process.argv[2] || '/'), { waitUntil: 'load' }); await new Promise(r => setTimeout(r, 22000))
  const r = await pg.evaluate(() => { const g = window.__g; return { ev: window.__ev, frames: g.length, over50: g.filter(x => x[1] > 50).length, over100: g.filter(x => x[1] > 100).length, max: Math.max(...g.map(x => x[1])), worst: g.filter(x => x[1] > 100).slice(0, 12).map(x => x.join('@')).join(' ') } })
  console.log(JSON.stringify(r)); await b.close()
})()
