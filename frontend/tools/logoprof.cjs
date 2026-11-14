// node tools/logoprof.cjs -> what runs on the main thread while the preloader logo animates (first ~2.6 s)
const puppeteer = require('puppeteer')
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--force_high_performance_gpu'] })
  const pg = await b.newPage(); await pg.setViewport({ width: 1440, height: 800 }); const c = await pg.createCDPSession()
  await c.send('Profiler.enable'); await c.send('Profiler.setSamplingInterval', { interval: 500 }); await c.send('Profiler.start')
  await pg.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' }); await new Promise(r => setTimeout(r, 2600))
  const { profile } = await c.send('Profiler.stop'), byId = {}; profile.nodes.forEach(n => byId[n.id] = n)
  const parent = {}; profile.nodes.forEach(n => (n.children || []).forEach(ch => parent[ch] = n.id))
  const self = {}, incl = {}
  profile.samples.forEach((id, i) => {
    const d = profile.timeDeltas[i] / 1000, n = byId[id], k = n.callFrame.functionName + ' ' + n.callFrame.url.split('/').pop() + ':' + n.callFrame.lineNumber
    self[k] = (self[k] || 0) + d
    const seen = new Set(); let p = id; while (p) { const f = byId[p].callFrame; const kk = (f.functionName || '(anon)') + ' ' + f.url.split('/').pop() + ':' + f.lineNumber; if (!seen.has(kk) && f.url) { incl[kk] = (incl[kk] || 0) + d; seen.add(kk) } p = parent[p] }
  })
  console.log('SELF'); Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([k, v]) => console.log(v.toFixed(0).padStart(6) + 'ms ' + k))
  console.log('INCLUSIVE (app code)'); Object.entries(incl).filter(([k]) => /App-|index-|Preloader|tres|Reticle|three/.test(k)).sort((a, b) => b[1] - a[1]).slice(0, 16).forEach(([k, v]) => console.log(v.toFixed(0).padStart(6) + 'ms ' + k))
  await b.close()
})()
