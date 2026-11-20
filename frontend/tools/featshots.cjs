// node tools/featshots.cjs outDir -> search finder, standards index + page, blog post, downloads anchor, quote prefill (desktop; phone for blog + finder)
const p = require('puppeteer')
const out = process.argv[2]
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
;(async () => {
  const b = await p.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu'] })
  const page = async (mob) => { const g = await b.newPage(); if (mob) await g.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13) Mobile' }); else await g.setViewport({ width: 1440, height: 900 }); g.on('pageerror', (e) => console.log('pageerror', e.message)); return g }
  const go = async (g, u, ms = 4500) => { await g.goto('http://localhost:4173' + u, { waitUntil: 'load' }); await wait(ms) }
  for (const mob of [0, 1]) {
    const k = mob ? 'm' : 'd', g = await page(mob)
    await go(g, '/standards/iec-60068'); await g.screenshot({ path: `${out}/${k}_std.png` })
    await g.evaluate(() => window.lenisInstance.scrollTo(900, { immediate: true })); await wait(1500); await g.screenshot({ path: `${out}/${k}_std2.png` })
    await go(g, '/blog/high-altitude-test-chamber/'); await g.screenshot({ path: `${out}/${k}_blog.png` })
    await g.evaluate(() => window.lenisInstance.scrollTo(1400, { immediate: true })); await wait(1500); await g.screenshot({ path: `${out}/${k}_blog2.png` })
    // finder: open search, pick a test
    await g.evaluate(() => window.dispatchEvent(new Event('envisys:search'))); await wait(1200); await g.screenshot({ path: `${out}/${k}_find0.png` })
    await g.evaluate(() => [...document.querySelectorAll('.so-chips button')].find((x) => x.textContent.includes('Water'))?.click()); await wait(800); await g.screenshot({ path: `${out}/${k}_find1.png` })
    await g.close()
  }
  const g = await page(0)
  await go(g, '/standards'); await g.screenshot({ path: `${out}/d_stdix.png` })
  await go(g, '/resources#downloads', 6000); await g.screenshot({ path: `${out}/d_dl.png` })
  await go(g, '/products/et?m=ET300'); await g.evaluate(() => document.querySelector('.pd-act .ps-pill').click()); await wait(1500)
  console.log('prefill:', await g.evaluate(() => document.querySelector('.cp-form textarea').value))
  await g.screenshot({ path: `${out}/d_quote.png` })
  await b.close()
})()
