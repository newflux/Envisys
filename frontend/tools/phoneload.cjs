// node tools/phoneload.cjs outDir -> phone landing on throttled 4G + 4x CPU: screenshots over time and the biggest downloads
const p = require('puppeteer')
;(async () => {
  const b = await p.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] })
  const g = await b.newPage()
  await g.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36' })
  const cdp = await g.target().createCDPSession()
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8 * 4, uploadThroughput: 750e3 / 8 })
  const res = []
  g.on('response', async (r) => { const len = +(r.headers()['content-length'] || 0); res.push([len, r.url().replace('http://localhost:4173', ''), Date.now()]) })
  const t0 = Date.now()
  g.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded', timeout: 60000 })
  for (const s of [1, 2, 4, 7, 10, 14]) { await new Promise((r) => setTimeout(r, s * 1000 - (Date.now() - t0))); await g.screenshot({ path: `${process.argv[2]}/load_${s}s.png` }) }
  res.sort((a, b) => b[0] - a[0]); for (const [l, u, t] of res.slice(0, 12)) console.log(String(Math.round(l / 1024)).padStart(6) + ' KB', ((t - t0) / 1000).toFixed(1) + 's', u.slice(0, 70))
  await b.close()
})()
