// node tools/prof.cjs /path  -> top self-time functions while scrolling
const puppeteer = require('puppeteer')
const base = 'http://localhost:4173', path = process.argv[2] || '/'
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl', '--force_high_performance_gpu', ...(process.env.LOWGPU ? [] : ['--force_high_performance_gpu'])] })
  const pg = await b.newPage(); await pg.setViewport({ width: 1440, height: 900 })
  await pg.evaluateOnNewDocument(() => addEventListener('shaders:warm', () => window.__done = (window.__done || 0) + 1))
  await pg.goto(base + path, { waitUntil: 'load' }); if (path === '/') await pg.waitForFunction('window.__done >= 2', { timeout: 90000 }).catch(() => {}); await new Promise(r => setTimeout(r, 4000))
  const c = await pg.createCDPSession(); await c.send('Profiler.enable'); await c.send('Profiler.setSamplingInterval', { interval: 500 }); await c.send('Profiler.start')
  await pg.evaluate(async () => { const sc = document.querySelector('#scroller'), el = sc && sc.scrollHeight > sc.clientHeight + 50 ? sc : null, L = window.lenisInstance, total = el ? el.scrollHeight : document.documentElement.scrollHeight
    for (let i = 0; i <= 60; i++) { const y = (total - innerHeight) * i / 60; L ? L.scrollTo(y, { immediate: true }) : el ? (el.scrollTop = y) : scrollTo(0, y); await new Promise(r => setTimeout(r, 150)) } })
  const { profile } = await c.send('Profiler.stop')
  const dt = profile.timeDeltas, self = {}, byId = {}; profile.nodes.forEach(n => byId[n.id] = n)
  profile.samples.forEach((id, i) => { const n = byId[id], k = n.callFrame.functionName + ' ' + n.callFrame.url.split('/').pop() + ':' + n.callFrame.lineNumber; self[k] = (self[k] || 0) + dt[i] / 1000 })
  const tot = Object.values(self).reduce((a, b) => a + b, 0)
  Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 14).forEach(([k, v]) => console.log((v / 1).toFixed(0).padStart(6) + 'ms ' + k))
  console.log('total', tot.toFixed(0)); await b.close()
})()
