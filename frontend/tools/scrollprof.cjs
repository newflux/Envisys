// node tools/scrollprof.cjs -> phone (4x CPU) touch-scrolling through the landing column: frame times + where main-thread time goes
const puppeteer = require('puppeteer')
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--force_high_performance_gpu'] })
  const g = await b.newPage()
  await g.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36' })
  await g.evaluateOnNewDocument(() => addEventListener('preloader:done', () => window.__pd = 1))
  await g.goto('http://localhost:4173/', { waitUntil: 'load' }); await g.waitForFunction('window.__pd', { timeout: 90000 }); await new Promise(r => setTimeout(r, 2500))
  await g.evaluate(at => { const s = document.querySelector('#scroller'); s.scrollTop = (window.__envTl.start + at) * 3.9007 * innerHeight / 100 }, +(process.env.AT || 20)); await new Promise(r => setTimeout(r, 1500))
  const c = await g.createCDPSession(); await c.send('Emulation.setCPUThrottlingRate', { rate: +(process.env.CPU || 4) })
  await g.evaluate(() => { window.__ft = []; let l = performance.now(); const f = t => { window.__ft.push(t - l); l = t; if (window.__ft.length < 100000) requestAnimationFrame(f) }; requestAnimationFrame(f) })
  await c.send('Profiler.enable'); await c.send('Profiler.setSamplingInterval', { interval: 1000 }); await c.send('Profiler.start')
  await g.tracing.start({ categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline'] })
  for (let i = 0; i < 14; i++) { await g.touchscreen.touchStart(200, 650); for (let k = 1; k <= 6; k++) { await g.touchscreen.touchMove(200, 650 - k * 60); await new Promise(r => setTimeout(r, 16)) } await g.touchscreen.touchEnd(); await new Promise(r => setTimeout(r, 300)) }
  const tr = JSON.parse(Buffer.from(await g.tracing.stop()).toString()).traceEvents
  const { profile } = await c.send('Profiler.stop')
  const ft = await g.evaluate(() => window.__ft.slice(5)); const s = [...ft].sort((a, b) => a - b)
  console.log('frames', ft.length, '| median', s[s.length >> 1].toFixed(1), 'ms | p90', s[Math.floor(s.length * 0.9)].toFixed(1), '| p99', s[Math.floor(s.length * 0.99)].toFixed(1), '| >33ms:', ft.filter(x => x > 33).length)
  // main-thread totals by event type
  const main = tr.find(e => e.name === 'thread_name' && e.args?.name === 'CrRendererMain' && tr.some(x => x.pid === e.pid && x.name === 'FunctionCall'))
  const tot = {}; for (const e of tr) if (e.pid === main?.pid && e.tid === main?.tid && e.dur && ['FunctionCall', 'Layout', 'UpdateLayoutTree', 'Paint', 'PrePaint', 'Layerize', 'Commit', 'RecalculateStyles', 'ParseHTML', 'Decode Image', 'FireAnimationFrame', 'HitTest'].includes(e.name)) tot[e.name] = (tot[e.name] || 0) + e.dur / 1000
  console.log('main thread:', Object.entries(tot).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ' ' + v.toFixed(0) + 'ms').join(' | '))
  const self = {}, byId = {}; profile.nodes.forEach(n => byId[n.id] = n)
  profile.samples.forEach((id, i) => { const n = byId[id], k = (n.callFrame.functionName || '(anon)') + ' ' + n.callFrame.url.split('/').pop() + ':' + n.callFrame.lineNumber; self[k] = (self[k] || 0) + profile.timeDeltas[i] / 1000 })
  console.log('top JS:'); Object.entries(self).filter(([k]) => !/^\((idle|program|garbage)/.test(k)).sort((a, b) => b[1] - a[1]).slice(0, 12).forEach(([k, v]) => console.log('  ' + v.toFixed(0).padStart(5) + 'ms ' + k))
  await b.close()
})()
