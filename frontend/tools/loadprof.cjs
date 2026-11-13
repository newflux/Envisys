// node tools/loadprof.cjs [desktop] -> top self-time functions during page load, 4x CPU throttle (phone-class) by default
const puppeteer = require('puppeteer')
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', ...(process.env.LOWGPU ? [] : ['--force_high_performance_gpu'])] })
  const pg = await b.newPage(); const c = await pg.createCDPSession()
  if (process.env.DESKTOP) await pg.setViewport({ width: 1747, height: 862 }); else await pg.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36' })
  if (!process.env.DESKTOP) await c.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await c.send('Profiler.enable'); await c.send('Profiler.setSamplingInterval', { interval: 1000 }); await c.send('Profiler.start')
  await pg.goto('http://localhost:4173' + (process.argv[2] || '/'), { waitUntil: 'load' }); await new Promise(r => setTimeout(r, 20000))
  const { profile } = await c.send('Profiler.stop'), dt = profile.timeDeltas, self = {}, byId = {}; profile.nodes.forEach(n => byId[n.id] = n)
  profile.samples.forEach((id, i) => { const n = byId[id], k = n.callFrame.functionName + ' ' + n.callFrame.url.split('/').pop() + ':' + n.callFrame.lineNumber; self[k] = (self[k] || 0) + dt[i] / 1000 })
  Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([k, v]) => console.log(v.toFixed(0).padStart(6) + 'ms ' + k)); await b.close()
})()
