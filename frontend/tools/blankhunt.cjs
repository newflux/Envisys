// node tools/blankhunt.cjs [n] [path] -> load a page n times as a phone; report errors, failed requests and whether anything was drawn
const p = require('puppeteer')
const n = +(process.argv[2] || 8), path = process.argv[3] || '/', location0 = path
;(async () => {
  const b = await p.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] })
  for (let i = 0; i < n; i++) {
    const g = await b.newPage()
    await g.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36' })
    const cdp = await g.target().createCDPSession()
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8 * 4, uploadThroughput: 750e3 / 8 })
    const errs = [], fails = []
    g.on('pageerror', (e) => errs.push(e.message.slice(0, 120)))
    g.on('console', (m) => m.type() === 'error' && errs.push('console: ' + m.text().slice(0, 120)))
    g.on('requestfailed', (r) => fails.push(r.url().replace('http://localhost:4173', '') + ' ' + r.failure()?.errorText))
    await g.evaluateOnNewDocument(() => { window.__ev = []; const t0 = performance.now(); for (const n of ['preloader:logo', 'scene:progress', 'scene:ready', 'shaders:warm', 'page:ready', 'preloader:done']) addEventListener(n, () => { if (n !== 'scene:progress' || !window.__ev.some((e) => e.startsWith(n))) window.__ev.push(n + '@' + ((performance.now() - t0) / 1000).toFixed(1)) }) })
    g.on('requestfinished', (r) => /\.glb|draco|index-.*js|App-.*js|ProductsPage-.*js/.test(r.url()) && fails.push('done ' + r.url().split('/').pop().slice(0, 18)))
    const t0 = Date.now()
    await g.goto('http://localhost:4173' + path, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch((e) => errs.push('goto ' + e.message))
    let state = ''
    for (let s = 0; s < 40; s++) {
      await new Promise((r) => setTimeout(r, 1000))
      state = await g.evaluate(() => `${document.querySelector('#app')?.children.length ? 'app' : 'NOAPP'} pre=${!!document.querySelector('.pl, .preloader, [class*=pl-]')} ready=${window.__sceneReady} done=${!!window.__pdone}`).catch((e) => 'eval ' + e.message)
      if (/ready=true/.test(state) || (location0 !== '/' && /page:ready/.test(await g.evaluate(() => window.__ev.join(' ')).catch(() => '')))) break
    }
    const evs = await g.evaluate(() => window.__ev.join(' ')).catch(() => '')
    console.log(`#${i} ${((Date.now() - t0) / 1000).toFixed(1)}s ${state} | ${evs} | errors: ${errs.join(' ; ') || '-'} | failed: ${fails.join(' ; ') || '-'}`)
    await g.close()
  }
  await b.close()
})()
