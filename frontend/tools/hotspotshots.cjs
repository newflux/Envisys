// node tools/hotspotshots.cjs outDir -> product pages with one hotspot opened (desktop ET, ETA; phone ET)
const p = require('puppeteer')
;(async () => {
  const b = await p.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu'] })
  for (const [n, u, mob, k] of [['hs_et', '/products/et', 0, 1], ['hs_eta', '/products/eta', 0, 3], ['hs_m', '/products/et', 1, 0]]) {
    const g = await b.newPage()
    if (mob) await g.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13) Mobile' })
    else await g.setViewport({ width: 1440, height: 900 })
    await g.goto('http://localhost:4173' + u, { waitUntil: 'load' }); await new Promise(r => setTimeout(r, 4500))
    const btn = (await g.$$('.pd-hp'))[k]
    if (btn) { await btn.click(); await new Promise(r => setTimeout(r, 700)) } else console.log(n, 'no hotspots')
    await g.screenshot({ path: process.argv[2] + '/' + n + '.png' }); await g.close()
  }
  await b.close()
})()
