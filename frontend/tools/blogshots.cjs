// node tools/blogshots.cjs outDir -> blog article (banner cover, infographic cover), more-to-read, resources grid; desktop + phone
const p = require('puppeteer')
const out = process.argv[2], wait = (ms) => new Promise((r) => setTimeout(r, ms))
;(async () => {
  const b = await p.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu'] })
  for (const mob of [0, 1]) {
    const g = await b.newPage(), k = mob ? 'm' : 'd'
    if (mob) await g.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13) Mobile' }); else await g.setViewport({ width: 1440, height: 900 })
    const go = async (u) => { await g.goto('http://localhost:4173' + u, { waitUntil: 'load' }); await wait(4000) }
    const to = async (y) => { await g.evaluate((y) => window.lenisInstance.scrollTo(y, { immediate: true }), y); await wait(1200) }
    await go('/blog/thermal-shock-chamber-rental'); await g.screenshot({ path: `${out}/${k}_a1.png` }); await to(mob ? 700 : 600); await g.screenshot({ path: `${out}/${k}_a2.png` })
    await go('/blog/economics-of-environmental-testing'); await to(mob ? 300 : 250); await g.screenshot({ path: `${out}/${k}_b1.png` })
    await g.evaluate(() => { const e = document.querySelector('.bp-more'); window.lenisInstance.scrollTo(e, { immediate: true, offset: -80 }) }); await wait(1500); await g.screenshot({ path: `${out}/${k}_more.png` })
    await go('/resources'); await to(mob ? 1600 : 1500); await g.screenshot({ path: `${out}/${k}_rs.png` })
    await g.close()
  }
  await b.close()
})()
