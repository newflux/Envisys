// node tools/prod.cjs [url] [mobile] -> console errors, failed requests and the preloader/scene timeline on a live url
const puppeteer = require('puppeteer')
const url = process.argv[2] || 'https://envisys.vercel.app/', mobile = process.argv[3] === 'mobile'
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--force_high_performance_gpu'] })
  const pg = await b.newPage()
  if (mobile) await pg.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36' }); else await pg.setViewport({ width: 1440, height: 800 })
  const bad = [], errs = []
  pg.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()) })
  pg.on('requestfailed', r => bad.push('FAIL ' + r.url() + ' ' + (r.failure() || {}).errorText))
  pg.on('pageerror', e => errs.push('PAGEERR ' + e.message.slice(0, 200)))
  pg.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 200)) })
  await pg.evaluateOnNewDocument(() => { window.__ev = {}; for (const e of ['shaders:warm', 'scene:ready', 'preloader:done']) addEventListener(e, () => (window.__ev[e] = window.__ev[e] || []).push(Math.round(performance.now()))) })
  const t0 = Date.now(); await pg.goto(url, { waitUntil: 'load', timeout: 90000 }); console.log('load event', Date.now() - t0, 'ms')
  for (const s of (process.env.TS || '3,6,10,15').split(',').map(Number)) { await new Promise(r => setTimeout(r, (s * 1000) - (Date.now() - t0))); console.log(s + 's', JSON.stringify(await pg.evaluate(() => ({ ev: window.__ev, ready: window.__sceneReady, y: (document.querySelector('#scroller') || {}).scrollTop }))) ) }
  console.log('BAD', bad.slice(0, 12).join('\n')); console.log('ERRS', errs.slice(0, 8).join('\n'))
  await pg.screenshot({ path: process.argv[4] || 'prod.png' }); await b.close()
})()
