// node tools/csp.cjs "<policy>" -> serves the local build with that CSP header and lists every violation on every page
const puppeteer = require('puppeteer')
const policy = process.argv[2]
const pages = ['/', '/products', '/products/et', '/verticals', '/verticals/express', '/verticals/design', '/about', '/industries', '/resources', '/in-stock']
;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu', '--force_high_performance_gpu'] })
  const all = new Set()
  for (const p of pages) {
    const pg = await b.newPage(); await pg.setViewport({ width: 1440, height: 800 })
    await pg.setRequestInterception(true)
    pg.on('request', async req => {
      if (req.resourceType() !== 'document') return req.continue()
      try { const r = await fetch(req.url()); const body = await r.text(); req.respond({ status: r.status, headers: { 'content-type': 'text/html; charset=utf-8', 'content-security-policy': policy }, body }) } catch { req.continue() }
    })
    await pg.evaluateOnNewDocument(() => { window.__v = []; addEventListener('securitypolicyviolation', e => window.__v.push(e.violatedDirective + ' <- ' + (e.blockedURI || 'inline') + (e.sourceFile ? ' @' + e.sourceFile.split('/').pop() : ''))) })
    await pg.goto('http://localhost:4173' + p, { waitUntil: 'load', timeout: 90000 }).catch(() => {})
    await new Promise(r => setTimeout(r, p === '/' ? 15000 : 5000))
    await pg.evaluate(async () => { const s = document.querySelector('#scroller'), L = window.lenisInstance; if (!s) return; for (let i = 0; i <= 10; i++) { const y = s.scrollHeight * i / 10; L ? L.scrollTo(y, { immediate: true }) : (s.scrollTop = y); await new Promise(r => setTimeout(r, 400)) } }).catch(() => {})
    const v = await pg.evaluate(() => window.__v).catch(() => [])
    v.forEach(x => all.add(x)); console.log(p.padEnd(20), v.length ? [...new Set(v)].slice(0, 6).join(' | ') : 'no violations')
    await pg.close()
  }
  await b.close()
})()
