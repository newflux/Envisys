// node tools/newshots.cjs outDir -> product-page uses/standards + FAQ, logo hidden while scrolling down, products filters (?std=), footer credit; desktop + phone
const p = require('puppeteer')
const out = process.argv[2]
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const to = (g, sel, off = 0) => g.evaluate((sel, off) => { const el = document.querySelector(sel); const y = el.getBoundingClientRect().top + document.querySelector('#scroller').scrollTop + off; window.lenisInstance.scrollTo(y, { immediate: true }) }, sel, off)
;(async () => {
  const b = await p.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu'] })
  for (const mob of [0, 1]) {
    const k = mob ? 'm' : 'd'
    const g = await b.newPage()
    if (mob) await g.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13) Mobile' })
    else await g.setViewport({ width: 1440, height: 900 })
    await g.goto('http://localhost:4173/products/et', { waitUntil: 'load' }); await wait(5000)
    await to(g, '#standards'); await wait(2500); await g.screenshot({ path: `${out}/${k}_std.png` })
    await to(g, '#faq'); await wait(2500); await g.screenshot({ path: `${out}/${k}_faq.png` })
    // logo: scroll down in small steps so the nav sees a downward scroll
    await to(g, '#overview'); await wait(800)
    for (let i = 0; i < 6; i++) { await g.evaluate(() => window.lenisInstance.scrollTo(window.lenisInstance.scroll + 60, { immediate: true })); await wait(120) }
    await wait(900); console.log(k, 'navhid =', await g.evaluate(() => document.documentElement.hasAttribute('data-navhid')))
    await g.screenshot({ path: `${out}/${k}_logo.png`, clip: { x: 0, y: 0, width: mob ? 390 : 1440, height: 140 } })
    await g.goto('http://localhost:4173/products?std=IEC%2060529', { waitUntil: 'load' }); await wait(16000)
    await to(g, '.bx'); await wait(2500); await g.screenshot({ path: `${out}/${k}_filt.png` })
    await to(g, '.fn-base', -500); await wait(2500); await g.screenshot({ path: `${out}/${k}_foot.png` })
    await g.close()
  }
  await b.close()
})()
