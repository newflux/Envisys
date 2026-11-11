// Renders tools/tile-reveal/index.html frame by frame (deterministic, so no dropped frames) into PNGs, for ffmpeg to assemble.
// SLOW=2 renders at half speed (the site film is 2 = about 9.4 s). usage (from frontend/):  node tools/tile-reveal/render.cjs <outDir> [fps=60] [width=1920] [height=1080] [mode=loop|hold] [times=comma list: render just these seconds]
const fs = require('fs'), path = require('path'), puppeteer = require('puppeteer')
const [out, fps = '60', W = '1920', H = '1080', mode = 'loop', only] = process.argv.slice(2)
const root = path.resolve(__dirname, '../..'), html = fs.readFileSync(path.join(__dirname, 'index.html'))
const SLOW = +(process.env.SLOW || 1) // 2 = half speed: every moment lasts twice as long
const LEN = (mode === 'loop' ? 3.5 + 0.9 + 0.3 : 3.5) * SLOW
;(async () => {
  fs.mkdirSync(out, { recursive: true })
  const b = await puppeteer.launch({ headless: 'new', protocolTimeout: 600000, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl'] })
  const p = await b.newPage(); await p.setViewport({ width: +W, height: +H, deviceScaleFactor: 1 })
  p.on('pageerror', (e) => console.log('pageerror', e.message.slice(0, 200)))
  p.on('console', (m) => { if (m.type() === 'error') console.log('console', m.text().slice(0, 200)) })
  await p.setRequestInterception(true)
  p.on('request', (r) => {
    const u = r.url(), m = u.match(/cdn\.jsdelivr\.net\/npm\/three@[^/]+\/(.*)$/)
    if (u.startsWith('http://tile.local/')) return r.respond({ status: 200, contentType: 'text/html', body: html })
    if (m) { const f = path.join(root, 'node_modules/three', m[1]); return fs.existsSync(f) ? r.respond({ status: 200, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(f) }) : r.respond({ status: 404, body: '' }) }
    r.continue()
  })
  await p.goto('http://tile.local/index.html' + (mode === 'loop' ? '?loop' : ''), { waitUntil: 'load' })
  await p.waitForFunction('window.__ready === true', { timeout: 120000 })
  const times = only ? only.split(',').map(Number) : Array.from({ length: Math.round(LEN * +fps) }, (_, i) => i / +fps)
  for (const [i, t] of times.entries()) {
    const url = await p.evaluate((t, m, slow) => { window.__renderAt(t / slow, m); return document.getElementById('c').toDataURL('image/png') }, t, mode, SLOW)
    fs.writeFileSync(path.join(out, only ? `t_${String(t).replace('.', '_')}.png` : `f_${String(i).padStart(4, '0')}.png`), Buffer.from(url.split(',')[1], 'base64'))
    if (!only && i % 30 === 0) console.log('frame', i, '/', times.length)
  }
  await b.close(); console.log('done', times.length)
})()
