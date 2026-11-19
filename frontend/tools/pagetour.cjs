// node tools/pagetour.cjs outDir path [n] [w h] -> screenshots down a page (desktop by default)
const p = require('puppeteer')
const [out, path, n = 10, w = 1440, h = 900] = process.argv.slice(2)
;(async () => {
  const b = await p.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu'] })
  const g = await b.newPage(); await g.setViewport({ width: +w, height: +h })
  await g.goto('http://localhost:4173' + path, { waitUntil: 'load' }); await new Promise(r => setTimeout(r, 4500))
  const H = await g.evaluate(() => document.querySelector('#scroller').scrollHeight)
  for (let i = 0; i < +n; i++) {
    await g.evaluate(y => window.lenisInstance.scrollTo(y, { immediate: true }), Math.round((H - +h) * i / (+n - 1)))
    await new Promise(r => setTimeout(r, 1200)); await g.screenshot({ path: `${out}/pt${i}.png` })
  }
  await b.close()
})()
