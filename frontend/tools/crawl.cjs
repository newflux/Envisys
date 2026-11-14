// node tools/crawl.cjs [base] -> every page on desktop+phone: failed requests, console errors, images that did not load
const puppeteer = require('puppeteer')
const base = process.argv[2] || 'https://envisys.vercel.app'
const pages = ['/', '/products', '/products/et', '/products/ets', '/products/mini', '/verticals', '/verticals/express', '/verticals/design', '/verticals/testing', '/verticals/rentals', '/verticals/aftersales', '/verticals/refurb', '/about', '/industries', '/resources', '/in-stock']
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] })
  for (const mode of ['desktop', 'phone']) for (const p of pages) {
    const pg = await b.newPage()
    if (mode === 'phone') await pg.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36' }); else await pg.setViewport({ width: 1440, height: 800 })
    const bad = [], errs = []
    pg.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url().replace(base, '')) })
    pg.on('requestfailed', r => { const u = r.url(); if (!/smoke\.webm|\.mp4/.test(u)) bad.push('FAIL ' + u.replace(base, '')) })
    pg.on('pageerror', e => errs.push(e.message.slice(0, 120)))
    await pg.goto(base + p, { waitUntil: 'load', timeout: 90000 }).catch(() => bad.push('NAV FAIL'))
    await new Promise(r => setTimeout(r, p === '/' ? 14000 : 6000))
    // scroll through so lazy images load
    await pg.evaluate(async () => { const sc = document.querySelector('#scroller'), L = window.lenisInstance, tot = sc ? sc.scrollHeight : document.body.scrollHeight; for (let i = 0; i <= 14; i++) { const y = tot * i / 14; L ? L.scrollTo(y, { immediate: true }) : sc ? (sc.scrollTop = y) : scrollTo(0, y); await new Promise(r => setTimeout(r, 350)) } }).catch(() => bad.push('PAGE NAVIGATED AWAY while scrolling'))
    await new Promise(r => setTimeout(r, 1500))
    const broken = await pg.evaluate(() => [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.currentSrc).map(i => i.currentSrc.split('/').slice(3).join('/'))).catch(() => []).catch(() => [])
    if (bad.length || errs.length || broken.length) console.log(mode.padEnd(7), p.padEnd(24), 'BAD:', [...new Set(bad)].slice(0, 5).join(' | '), 'BROKEN IMG:', broken.slice(0, 5).join(' | '), 'ERR:', errs.slice(0, 2).join(' | '))
    await pg.close()
  }
  console.log('crawl done'); await b.close()
})()
