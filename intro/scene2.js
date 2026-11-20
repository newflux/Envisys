// Envisys logo intro, take 2 (after the Anthropic brand film's opening): paper, grain, and only the logo's own shapes.
// The word builds out from the I and its three blocks; each new letter first appears as an environment it tests (cold, heat,
// humidity, vibration, altitude, temperature) and resolves into the letter. Hold. Then the lower cyan block stretches into a bar
// that opens onto real footage. render(t) is a pure function of time (async only to wait for footage frames).
/* global PARTS, W, H, FOOT */
const cv = document.getElementById('c'); cv.width = W; cv.height = H
const g = cv.getContext('2d')
const DUR = 7.2
const T = { build: 0.7, step: 0.19, tag: 2.15, reg: 2.6, exit: 4.75 }
const NAVY = '#002868', CYAN = '#08d0e0'

const clamp = (v) => Math.min(1, Math.max(0, v))
const seg = (t, a, d) => clamp((t - a) / d)
const expo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x))
const expoIn = (x) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10))
const inout = (x) => (x < 0.5 ? 16 * x ** 5 : 1 - Math.pow(-2 * x + 2, 5) / 2)
const back = (x) => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2) }

// ---- the logo ----
const VB = [28, 28, 2130, 676]
const S = (W > H ? W * 0.5 : W * 0.8) / VB[2]
const OX = (W - VB[2] * S) / 2 - VB[0] * S, OY = H / 2 - (VB[3] * S) / 2 - VB[1] * S
const parts = PARTS.map((p) => ({ ...p, path: new Path2D(p.d) }))
const L = parts.filter((p) => p.kind === 'letter').sort((a, b) => a.bbox[0] - b.bbox[0])   // E N V I S Y S
const blocks = parts.filter((p) => p.kind === 'block')
const tag = parts.find((p) => p.kind === 'tag'), reg = parts.find((p) => p.kind === 'reg')
const I = 3
const bar = blocks.reduce((a, b) => (b.bbox[1] > a.bbox[1] ? b : a))                           // the lowest block: the one that becomes the bar
const adv = L.map((p, i) => (i < L.length - 1 ? L[i + 1].bbox[0] - p.bbox[0] : p.bbox[2] - p.bbox[0]))
const ORDER = [2, 4, 1, 5, 0, 6]                                                                 // V, S, N, Y, E, S: outward from the I
const GLYPH = { 2: 'snow', 4: 'sun', 1: 'drop', 5: 'wave', 0: 'peak', 6: 'therm' }
const tIn = (i) => (i === I ? -1 : T.build + ORDER.indexOf(i) * T.step)

// where each letter sits once `set` letters are in: the missing ones collapse, the group stays centred on the full logo
const full = (L[0].bbox[0] + L[6].bbox[2]) / 2
function layout(n) {
  const vis = new Set([I, ...ORDER.slice(0, n)])
  const x = []; let shift = 0
  L.forEach((p, i) => { x[i] = p.bbox[0] - shift; if (!vis.has(i)) shift += adv[i] })
  const v = [...vis].sort((a, b) => a - b), lo = x[v[0]], hi = x[v.at(-1)] + (L[v.at(-1)].bbox[2] - L[v.at(-1)].bbox[0])
  const c = full - (lo + hi) / 2
  return L.map((p, i) => x[i] - p.bbox[0] + c)                                                   // offset from final position
}
const LAY = Array.from({ length: 7 }, (_, n) => layout(n))
function offsets(t) {
  let n = 0; for (let k = 0; k < 6; k++) if (t >= T.build + k * T.step) n = k + 1
  if (n === 0) return LAY[0]
  const k = expo(seg(t, T.build + (n - 1) * T.step, 0.16))
  return LAY[n].map((v, i) => LAY[n - 1][i] + (v - LAY[n - 1][i]) * k)
}

// ---- the environment glyphs, drawn in logo units around a letter's centre, bold like the letters ----
function glyph(kind, cx, cy, h, col) {
  g.save(); g.translate(cx, cy); g.transform(1, 0, -0.2, 1, 0, 0); g.fillStyle = col; g.strokeStyle = col; g.lineCap = 'round'; g.lineJoin = 'round'
  const r = h / 2, lw = h * 0.13
  g.lineWidth = lw
  if (kind === 'snow') {
    for (let a = 0; a < 6; a++) {
      g.save(); g.rotate((a * Math.PI) / 3); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -r)
      g.moveTo(0, -r * 0.55); g.lineTo(-r * 0.28, -r * 0.8); g.moveTo(0, -r * 0.55); g.lineTo(r * 0.28, -r * 0.8); g.stroke(); g.restore()
    }
  } else if (kind === 'sun') {
    g.beginPath(); g.arc(0, 0, r * 0.42, 0, Math.PI * 2); g.fill()
    for (let a = 0; a < 8; a++) { g.save(); g.rotate((a * Math.PI) / 4); g.beginPath(); g.moveTo(0, -r * 0.62); g.lineTo(0, -r * 0.98); g.stroke(); g.restore() }
  } else if (kind === 'drop') {
    g.beginPath(); g.moveTo(0, -r); g.bezierCurveTo(r * 0.15, -r * 0.6, r * 0.7, -r * 0.1, r * 0.7, r * 0.3)
    g.arc(0, r * 0.3, r * 0.7, 0, Math.PI); g.bezierCurveTo(-r * 0.7, -r * 0.1, -r * 0.15, -r * 0.6, 0, -r); g.fill()
  } else if (kind === 'wave') {
    for (const yy of [-0.55, 0, 0.55]) { g.beginPath(); for (let u = -1; u <= 1.001; u += 0.05) { const x = u * r * 0.95, y = yy * r + Math.sin(u * Math.PI * 2) * r * 0.16; u === -1 ? g.moveTo(x, y) : g.lineTo(x, y) } g.stroke() }
  } else if (kind === 'peak') {
    g.beginPath(); g.moveTo(-r, r * 0.8); g.lineTo(-r * 0.25, -r * 0.55); g.lineTo(0.05 * r, -r * 0.05); g.lineTo(r * 0.38, -r * 0.85); g.lineTo(r, r * 0.8); g.closePath(); g.fill()
  } else if (kind === 'therm') {
    g.beginPath(); g.arc(0, r * 0.55, r * 0.38, 0, Math.PI * 2); g.fill()
    g.beginPath(); g.moveTo(0, r * 0.5); g.lineTo(0, -r * 0.85); g.lineWidth = h * 0.2; g.stroke()
    g.lineWidth = lw * 0.7; for (const yy of [-0.55, -0.25, 0.05]) { g.beginPath(); g.moveTo(r * 0.22, yy * r); g.lineTo(r * 0.5, yy * r); g.stroke() }
  }
  g.restore()
}

// ---- paper: an off-white sheet with soft blotches and fibres, made once from a fixed seed ----
const paper = document.createElement('canvas'); paper.width = W; paper.height = H
{
  const p = paper.getContext('2d'); let s = 99
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  p.fillStyle = '#eeede8'; p.fillRect(0, 0, W, H)
  // a faint unevenness, like real paper (kept very low: anything stronger reads as dirt)
  for (let i = 0; i < 90; i++) { const x = rnd() * W, y = rnd() * H, r = (0.08 + rnd() * 0.2) * W; const gr = p.createRadialGradient(x, y, 0, x, y, r); const a = rnd() * 0.012; gr.addColorStop(0, rnd() > 0.35 ? `rgba(255,255,252,${a * 1.6})` : `rgba(150,145,130,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); p.fillStyle = gr; p.fillRect(x - r, y - r, r * 2, r * 2) }
  // fine speckle
  for (let i = 0; i < 9000; i++) { p.fillStyle = `rgba(90,85,70,${0.03 + rnd() * 0.06})`; const d = (0.5 + rnd()) * (W / 1920); p.fillRect(rnd() * W, rnd() * H, d, d) }
  p.lineCap = 'round'
  for (let i = 0; i < 700; i++) { const x = rnd() * W, y = rnd() * H, l = (2 + rnd() * 10) * (W / 1920), a = rnd() * Math.PI; p.strokeStyle = `rgba(120,115,100,${0.04 + rnd() * 0.06})`; p.lineWidth = 0.6 * (W / 1920); p.beginPath(); p.moveTo(x, y); p.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); p.stroke() }
  const vg = p.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.72)
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(60,55,45,0.10)'); p.fillStyle = vg; p.fillRect(0, 0, W, H)
}
const grain = document.createElement('canvas'); grain.width = grain.height = 512
{ const gx = grain.getContext('2d'), im = gx.createImageData(512, 512); let s = 7
  for (let i = 0; i < im.data.length; i += 4) { s = (s * 1103515245 + 12345) & 0x7fffffff; const v = 128 + ((s % 255) - 127) * 0.9; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255 }
  gx.putImageData(im, 0, 0) }

// ---- footage frames (for the window the bar opens) ----
const frames = []
const loadFrame = (i) => (frames[i] ??= new Promise((r) => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = `foot/f${String(i + 1).padStart(3, '0')}.jpg` }))

const toScreen = (x, y) => [OX + x * S, OY + y * S]

function drawLogo(t, off, slide) {
  g.save(); g.translate(OX - slide, OY); g.scale(S, S)
  L.forEach((p, i) => {
    const t0 = tIn(i); if (t < t0) return
    const col = p.color === 'blue' ? CYAN : NAVY
    const [x0, y0, x1, y1] = p.bbox, cx = (x0 + x1) / 2 + off[i], cy = (y0 + y1) / 2
    const life = t - t0, gEnd = 0.17
    if (i !== I && life < gEnd + 0.04) {                     // the environment, popping in, then giving way to the letter
      const k = expo(clamp(life / 0.07)), fade = 1 - clamp((life - gEnd) / 0.04)
      g.globalAlpha = fade; glyph(GLYPH[i], cx, cy, (y1 - y0) * 0.92 * (0.55 + 0.45 * k), col); g.globalAlpha = 1
    }
    if (i === I || life >= gEnd) {
      const k = i === I ? 1 : clamp((life - gEnd) / 0.04)
      g.save(); g.translate(off[i], 0); g.globalAlpha = k; g.fillStyle = col; g.fill(p.path, 'evenodd'); g.restore()
    }
  })
  // the blocks ride with the I (the bar block hands over to the stretching bar at the exit)
  for (const b of blocks) {
    if (b === bar && t >= T.exit) continue
    g.save(); g.translate(off[I], 0); g.fillStyle = b.color === 'blue' ? CYAN : NAVY; g.fill(b.path, 'evenodd'); g.restore()
  }
  const tk = expo(seg(t, T.tag, 0.9))
  if (tk > 0) { const [x0, y0, x1, y1] = tag.bbox; g.save(); g.beginPath(); g.rect(x0 - 10, y0 - 20, (x1 - x0 + 20) * tk, y1 - y0 + 40); g.clip(); g.fillStyle = NAVY; g.fill(tag.path, 'evenodd'); g.restore() }
  const rk = back(seg(t, T.reg, 0.35))
  if (rk > 0) { const [x0, y0, x1, y1] = reg.bbox, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2; g.save(); g.translate(cx, cy); g.scale(rk, rk); g.translate(-cx, -cy); g.fillStyle = NAVY; g.fill(reg.path, 'evenodd'); g.restore() }
  g.restore()
}

// the bar: the block's own parallelogram, stretched across the frame, then opened top to bottom into a window
function barPoly(t, off) {
  const [bx0, by0, bx1, by1] = bar.bbox
  const [sx0, sy0] = toScreen(bx0 + off[I], by0), [sx1, sy1] = toScreen(bx1 + off[I], by1)
  const slant = (sx1 - sx0) * 0.42
  const a = inout(seg(t, T.exit, 0.62)), b = inout(seg(t, T.exit + 0.42, 0.75))
  const x0 = sx0 + (-W * 0.25 - sx0) * a, x1 = sx1 + (W * 1.25 - sx1) * a
  const y0 = sy0 + (-H * 0.35 - sy0) * b, y1 = sy1 + (H * 1.35 - sy1) * b
  const sl = slant * (1 + b * 4)
  return [[x0 + sl, y0], [x1 + sl, y0], [x1, y1], [x0, y1]]   // leaning like the logo's blocks
}

async function frame(t, shot) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'
  g.drawImage(paper, 0, 0)
  const off = offsets(t)
  // at the exit the word slides off to the left, fast, as the bar pulls the other way
  const sl = expoIn(seg(t, T.exit + 0.05, 0.55)) * W * 0.9
  drawLogo(t, off, sl)
  if (t >= T.exit) {
    const P = barPoly(t, off)
    g.save(); g.beginPath(); P.forEach(([x, y], k) => (k ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath()
    g.fillStyle = CYAN; g.fill(); g.clip()
    const fk = seg(t, T.exit + 0.35, 0.35)
    if (shot && fk > 0) { g.globalAlpha = fk; const sc = 1.12 - 0.08 * seg(t, T.exit, DUR - T.exit); const w = W * sc, h = (shot.height / shot.width) * w; g.drawImage(shot, (W - w) / 2, (H - h) / 2, w, h) }
    g.restore()
  }
  // grain over everything, changing 24 times a second like film
  g.save(); g.globalCompositeOperation = 'overlay'; g.globalAlpha = 0.11
  const f = Math.floor(t * 24), ox = (f * 173) % 512, oy = (f * 311) % 512
  g.translate(-ox, -oy); g.fillStyle = g.createPattern(grain, 'repeat'); g.fillRect(0, 0, W + 512, H + 512); g.restore()
}

const acc = document.createElement('canvas'); acc.width = W; acc.height = H
const ac = acc.getContext('2d')
window.render = async (t, fps = 60, sub = 6) => {
  const fi = Math.floor((t - T.exit - 0.3) * 60)
  const shot = fi >= 0 && fi < FOOT ? await loadFrame(fi) : fi >= FOOT ? await loadFrame(FOOT - 1) : null
  ac.clearRect(0, 0, W, H)
  for (let i = 0; i < sub; i++) { await frame(t + (i / sub) * (0.5 / fps), shot); ac.globalAlpha = 1 / (i + 1); ac.drawImage(cv, 0, 0) }
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.drawImage(acc, 0, 0)
}
window.DUR = DUR
window.ready = true
