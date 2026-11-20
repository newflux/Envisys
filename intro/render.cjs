// SCENE=scene2.js node render.cjs <w> <h> <out.mp4> [audio.mp3] [audioOffsetSec] [--still t1,t2,...]
// Records the scene (scene.js by default) frame by frame at 60 fps (no real-time playback, so no dropped frames) and encodes with ffmpeg.
const fs = require('fs'), path = require('path'), http = require('http'), { spawn } = require('child_process')
const puppeteer = require('../frontend/node_modules/puppeteer')
const ffmpeg = require('ffmpeg-static')
const [W, H] = [+process.argv[2], +process.argv[3]], out = process.argv[4]
const audio = process.argv[5] && !process.argv[5].startsWith('--') ? process.argv[5] : null
const aoff = +(process.argv[6] || 0)
const stillArg = process.argv.indexOf('--still')
const FPS = 60
const SCENE = process.env.SCENE || 'scene.js'

// the official logo's 12 paths, sorted into letters, blocks, tagline and (R) by colour and size
function parts() {
  const svg = fs.readFileSync(path.join(__dirname, '../frontend/public/brand/envisys-logo.svg'), 'utf8')
  const ps = [...svg.matchAll(/<path fill="([^"]+)"[^>]*\sd="([^"]+)"/g)].map(([, fill, d]) => {
    const n = d.match(/-?\d+(\.\d+)?/g).map(Number), xs = n.filter((_, i) => i % 2 === 0), ys = n.filter((_, i) => i % 2 === 1)
    return { d, color: fill.toLowerCase() === '#08d0e0' ? 'blue' : 'ink', bbox: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] }
  })
  for (const p of ps) {
    const [x0, y0, x1, y1] = p.bbox, w = x1 - x0, h = y1 - y0
    p.kind = y0 > 580 ? 'tag' : x0 > 2000 ? 'reg' : h < 160 ? 'block' : 'letter'
  }
  const count = (k) => ps.filter((p) => p.kind === k).length
  console.log('parts:', ps.length, { letter: count('letter'), block: count('block'), tag: count('tag'), reg: count('reg') })
  if (ps.length !== 12 || count('tag') !== 1 || count('reg') !== 1) throw new Error('logo parts not as expected')
  return ps
}

;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--use-angle=d3d11', '--enable-gpu'] })
  const pg = await b.newPage()
  await pg.setViewport({ width: W, height: H, deviceScaleFactor: 1 })
  const foot = fs.existsSync(path.join(__dirname, 'foot')) ? fs.readdirSync(path.join(__dirname, 'foot')).length : 0
  const html = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent;overflow:hidden}canvas{display:block}</style><canvas id="c"></canvas>
<script>const W=${W},H=${H},FOOT=${foot},HOLE=${JSON.stringify(process.env.HOLE || '')},PARTS=${JSON.stringify(parts())};</script><script>${fs.readFileSync(path.join(__dirname, SCENE), 'utf8')}</script>`
  // served from this folder (same origin), so footage frames can be drawn into the canvas and read back
  const srv = http.createServer((q, r) => { if (q.url === '/') { r.setHeader('content-type', 'text/html'); return r.end(html) } const f = path.join(__dirname, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(__dirname) || !fs.existsSync(f)) { r.statusCode = 404; return r.end() } r.end(fs.readFileSync(f)) }).listen(0)
  pg.on('pageerror', (e) => console.log('pageerror', e.message))
  await pg.goto(`http://127.0.0.1:${srv.address().port}/`, { waitUntil: 'load' })
  await pg.waitForFunction('window.ready')
  const dur = await pg.evaluate('window.DUR')
  const grab = async (t) => {
    const url = await pg.evaluate(async (t) => { await window.render(t); return document.getElementById('c').toDataURL('image/png') }, t)
    return Buffer.from(url.split(',')[1], 'base64')
  }
  if (stillArg > 0) {
    for (const t of process.argv[stillArg + 1].split(',').map(Number)) fs.writeFileSync(`${out}_${t}.png`, await grab(t))
    await b.close(); srv.close(); return
  }
  const args = ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-']
  if (audio) args.push('-itsoffset', String(aoff), '-i', audio)
  // CODEC=prores keeps the alpha channel (transparent window), for editors; default is a plain H.264 mp4
  if (process.env.CODEC === 'prores') args.push('-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', '-vendor', 'apl0')
  else args.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-movflags', '+faststart')
  if (audio) args.push('-c:a', 'aac', '-b:a', '256k', '-af', `afade=t=out:st=${dur - 0.6}:d=0.6`, '-shortest')
  args.push(out)
  const ff = spawn(ffmpeg, args, { stdio: ['pipe', 'ignore', 'pipe'] })
  let err = ''; ff.stderr.on('data', (d) => (err += d))
  const n = Math.round(dur * FPS)
  for (let i = 0; i < n; i++) {
    const buf = await grab(i / FPS)
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r))
    if (i % 60 === 0) process.stdout.write(`${i}/${n} `)
  }
  ff.stdin.end()
  const code = await new Promise((r) => ff.on('close', r))
  await b.close(); srv.close()
  if (code) { console.log(err.slice(-1500)); process.exit(1) }
  console.log('\nwrote', out)
})()
