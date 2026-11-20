// node tools/vizshots.cjs outDir path -> each chart section and the compare table, desktop (1440x900) and phone (390x844)
const p = require('puppeteer')
;(async () => {
  const [out, path] = process.argv.slice(2)
  const b = await p.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu'] })
  for (const mob of [0, 1]) {
    const g = await b.newPage()
    if (mob) await g.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13) Mobile' })
    else await g.setViewport({ width: 1440, height: 900 })
    await g.goto('http://localhost:4173' + path, { waitUntil: 'load' }); await new Promise(r => setTimeout(r, 5000))
    const n = await g.evaluate(() => [...document.querySelectorAll('.vz, #technical, #explore')].length)
    for (let i = 0; i < n; i++) {
      await g.evaluate(i => { const el = [...document.querySelectorAll('#explore, .vz, #technical')][i]; const y = el.getBoundingClientRect().top + document.querySelector('#scroller').scrollTop; window.lenisInstance.scrollTo(y, { immediate: true }) }, i)
      await new Promise(r => setTimeout(r, 3500)); await g.screenshot({ path: `${out}/${mob ? 'm' : 'd'}${i}.png` })
    }
    await g.close()
  }
  await b.close()
})()
