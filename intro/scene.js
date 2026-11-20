// The Envisys logo intro, drawn on a canvas as a pure function of time: render(t) always gives the same frame, so the film is
// recorded frame by frame (render.cjs) with no dropped frames. PARTS (the official logo's 12 paths, classified) is injected by render.cjs.
/* global PARTS, W, H */
const cv = document.getElementById('c'); cv.width = W; cv.height = H
const g = cv.getContext('2d')
const DUR = 6.5

// ---- timing (seconds) ----
const T = { trace0: 0.25, trace1: 1.55, lift0: 1.35, lift1: 2.45, letters: 2.05, blocks: 2.95, sweep: 3.45, tag: 3.75, reg: 4.35 }

const clamp = (v) => Math.min(1, Math.max(0, v))
const seg = (t, a, d) => clamp((t - a) / d)
const expo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x))
const cubic = (x) => 1 - Math.pow(1 - x, 3)
const inout = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const back = (x) => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2) }

// ---- the logo, fitted to the frame ----
const VB = [28, 28, 2130, 676]
const fitW = W > H ? W * 0.56 : W * 0.82
const S = fitW / VB[2]
const OX = (W - VB[2] * S) / 2 - VB[0] * S, OY = H * 0.5 - (VB[3] * S) / 2 - VB[1] * S - (W > H ? H * 0.01 : 0)
const parts = PARTS.map((p) => ({ ...p, path: new Path2D(p.d) }))
const letters = parts.filter((p) => p.kind === 'letter').sort((a, b) => a.bbox[0] - b.bbox[0])
const blocks = parts.filter((p) => p.kind === 'block').sort((a, b) => a.bbox[0] - b.bbox[0])
const tag = parts.find((p) => p.kind === 'tag'), reg = parts.find((p) => p.kind === 'reg')

// ---- film grain, from a fixed seed so frames repeat exactly ----
const grain = document.createElement('canvas'); grain.width = grain.height = 256
{ const gx = grain.getContext('2d'), im = gx.createImageData(256, 256); let s = 1234567
  for (let i = 0; i < im.data.length; i += 4) { s = (s * 1103515245 + 12345) & 0x7fffffff; const v = s % 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255 }
  gx.putImageData(im, 0, 0) }

// the temperature trace: hold, ramp up, hold hot, drop cold, settle (a chamber test profile), across the middle of the frame
const PROFILE = [[0, 0.5], [0.16, 0.5], [0.3, 0.3], [0.46, 0.3], [0.62, 0.72], [0.78, 0.72], [0.88, 0.5], [1, 0.5]]
function profileY(x) { for (let i = 1; i < PROFILE.length; i++) { const [x0, y0] = PROFILE[i - 1], [x1, y1] = PROFILE[i]; if (x <= x1) { const k = (x - x0) / (x1 - x0); return y0 + (y1 - y0) * inout(k) } } return 0.5 }

function drawTrace(t) {
  const draw = expo(seg(t, T.trace0, 1.15)), fade = seg(t, T.trace1 - 0.1, 0.6)
  if (draw <= 0 || fade >= 1) return
  const x0 = W * 0.12, x1 = W * 0.88, amp = H * 0.16, cy = H * 0.5
  const head = draw, n = 220
  g.save(); g.globalAlpha = 1 - fade; g.lineCap = 'round'; g.lineJoin = 'round'
  for (const [w, a, blur] of [[10, 0.18, 24], [3, 0.55, 8], [1.6, 1, 0]]) {
    g.beginPath()
    for (let i = 0; i <= n; i++) { const u = (i / n) * head; const x = x0 + (x1 - x0) * u, y = cy + (profileY(u) - 0.5) * amp * 2; i ? g.lineTo(x, y) : g.moveTo(x, y) }
    g.strokeStyle = `rgba(255, 122, 40, ${a})`; g.lineWidth = w * (W / 1920); g.shadowColor = 'rgba(255, 106, 26, 0.9)'; g.shadowBlur = blur * (W / 1920); g.stroke()
  }
  // the moving point at the head
  const hx = x0 + (x1 - x0) * head, hy = cy + (profileY(head) - 0.5) * amp * 2
  const r = (5 + 3 * Math.sin(t * 20)) * (W / 1920)
  const rg = g.createRadialGradient(hx, hy, 0, hx, hy, r * 6); rg.addColorStop(0, 'rgba(255,220,190,1)'); rg.addColorStop(0.25, 'rgba(255,122,40,0.8)'); rg.addColorStop(1, 'rgba(255,106,26,0)')
  g.fillStyle = rg; g.beginPath(); g.arc(hx, hy, r * 6, 0, Math.PI * 2); g.fill()
  // faint axis ticks under it, like the chamber's screen
  g.globalAlpha = (1 - fade) * 0.35 * draw; g.fillStyle = '#9fb3c8'; g.font = `${13 * (W / 1920)}px "Geist Mono", ui-monospace, monospace`
  ;['−40 °C', '0 °C', '+85 °C', '+180 °C'].forEach((s, i) => g.fillText(s, x0 - 70 * (W / 1920), cy + amp * (0.44 - i * 0.3)))
  g.restore()
}

// the light stage: soft daylight blue, brighter behind the logo
function drawStage() {
  const rg = g.createRadialGradient(W / 2, H * 0.46, 0, W / 2, H * 0.5, Math.max(W, H) * 0.75)
  rg.addColorStop(0, '#f7fafd'); rg.addColorStop(0.55, '#e7eef7'); rg.addColorStop(1, '#cfdbe9')
  g.fillStyle = rg; g.fillRect(0, 0, W, H)
}

// the black lifts off the light stage as a wave (the preloader's smoke, run backwards): crest sweeps down out of frame
function drawBlack(t) {
  const p = 1 - inout(seg(t, T.lift0, T.lift1 - T.lift0))   // 1 all black, 0 gone
  if (p <= 0) return
  if (p >= 1) { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); return }
  const crest = H * (1.15 - p * 1.4), amp = H * 0.12 * (0.4 + p)
  // one soft-edged shape: the blur gives the smoke's feathered crest
  g.save(); g.filter = `blur(${Math.round(H * 0.035)}px)`
  g.beginPath(); g.moveTo(-60, -60); g.lineTo(W + 60, -60)
  for (let x = W + 60; x >= -60; x -= W / 64) g.lineTo(x, crest + Math.sin((x / W) * Math.PI + t * 0.6) * amp)
  g.closePath(); g.fillStyle = '#000'; g.fill(); g.restore()
}

function inLogo(t, fn) {
  // a slow push-in from the moment the logo starts to form
  const k = 0.965 + 0.035 * cubic(seg(t, T.letters, DUR - T.letters))
  g.save(); g.translate(W / 2, H * 0.5); g.scale(k, k); g.translate(-W / 2, -H * 0.5); g.translate(OX, OY); g.scale(S, S); fn(); g.restore()
}

function drawLogo(t, mirror) {
  const ink = '#002868', blue = '#08d0e0'
  // letters: each rises out of its own baseline, sharp and quick, left to right
  letters.forEach((p, i) => {
    const k = expo(seg(t, T.letters + i * 0.075, 0.95)); if (k <= 0) return
    const [x0, y0, x1, y1] = p.bbox, h = y1 - y0
    g.save(); g.beginPath(); g.rect(x0 - 20, y0 - 40, x1 - x0 + 40, h + 60); g.clip()
    g.translate(0, (1 - k) * h * 1.05); g.globalAlpha = clamp(k * 1.6)
    g.fillStyle = p.color === 'blue' ? blue : ink; g.fill(p.path, 'evenodd'); g.restore()
  })
  // the blocks drop in and lock (the impact in the sound lands on the first one)
  blocks.forEach((p, i) => {
    const s = seg(t, T.blocks + i * 0.11, 0.6); if (s <= 0) return
    const k = back(s), [x0, y0, x1, y1] = p.bbox, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    g.save(); g.translate(cx + (1 - k) * 160, cy - (1 - k) * 260); g.rotate((1 - k) * 0.5); g.translate(-cx, -cy)
    g.globalAlpha = clamp(s * 3); g.fillStyle = p.color === 'blue' ? blue : ink; g.fill(p.path, 'evenodd'); g.restore()
    // a quick ring of light where it locks
    const f = seg(t, T.blocks + i * 0.11 + 0.32, 0.5)
    if (!mirror && f > 0 && f < 1) { g.save(); g.globalAlpha = (1 - f) * 0.45; g.strokeStyle = blue; g.lineWidth = (1 - f) * 6 + 1.5; g.beginPath(); g.arc(cx, cy, 40 + cubic(f) * 260, 0, Math.PI * 2); g.stroke(); g.restore() }
  })
  // tagline wipes in from the left
  const tk = cubic(seg(t, T.tag, 0.9))
  if (tk > 0) { const [x0, y0, x1, y1] = tag.bbox; g.save(); g.beginPath(); g.rect(x0 - 10, y0 - 10, (x1 - x0 + 20) * tk, y1 - y0 + 20); g.clip(); g.globalAlpha = clamp(tk * 1.4); g.fillStyle = ink; g.fill(tag.path, 'evenodd'); g.restore() }
  // registered mark
  const rk = back(seg(t, T.reg, 0.45))
  if (rk > 0 && reg) { const [x0, y0, x1, y1] = reg.bbox, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2; g.save(); g.translate(cx, cy); g.scale(rk, rk); g.translate(-cx, -cy); g.globalAlpha = clamp(rk); g.fillStyle = ink; g.fill(reg.path, 'evenodd'); g.restore() }
}

// a band of light passes across the finished logo, only on its own shapes
const off = document.createElement('canvas'); off.width = W; off.height = H
const og = off.getContext('2d')
function drawSweep(t) {
  const k = inout(seg(t, T.sweep, 1.0)); if (k <= 0 || k >= 1) return
  og.clearRect(0, 0, W, H); og.save()
  const s = g; // draw logo shapes as a mask on the offscreen canvas
  og.setTransform(g.getTransform())
  inLogoOn(og, t)
  og.globalCompositeOperation = 'source-in'
  og.setTransform(1, 0, 0, 1, 0, 0)
  const cx = -W * 0.3 + k * W * 1.6
  const lg = og.createLinearGradient(cx - W * 0.12, 0, cx + W * 0.12, H * 0.4)
  lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(0.5, 'rgba(255,255,255,0.75)'); lg.addColorStop(1, 'rgba(255,255,255,0)')
  og.fillStyle = lg; og.fillRect(0, 0, W, H); og.restore()
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.55; g.drawImage(off, 0, 0); g.restore()
}
function inLogoOn(ctx, t) {
  const k = 0.965 + 0.035 * cubic(seg(t, T.letters, DUR - T.letters))
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(W / 2, H * 0.5); ctx.scale(k, k); ctx.translate(-W / 2, -H * 0.5); ctx.translate(OX, OY); ctx.scale(S, S)
  ctx.fillStyle = '#fff'; for (const p of [...letters, ...blocks]) ctx.fill(p.path, 'evenodd')
}

function frame(t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'
  drawStage()
  inLogo(t, () => drawLogo(t, false))
  drawSweep(t)
  drawBlack(t)
  drawTrace(t)
  // grain: stronger on black, barely there on light
  g.save(); g.globalCompositeOperation = 'overlay'; g.globalAlpha = 0.06
  const ox = (Math.floor(t * 24) * 97) % 256, oy = (Math.floor(t * 24) * 57) % 256
  g.translate(-ox, -oy); g.fillStyle = g.createPattern(grain, 'repeat'); g.fillRect(0, 0, W + 256, H + 256); g.restore()
  // vignette
  const vg = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75)
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.18)'); g.fillStyle = vg; g.fillRect(0, 0, W, H)
}

// motion blur: average a few moments inside the shutter (half a frame), like a real camera
const acc = document.createElement('canvas'); acc.width = W; acc.height = H
const ac = acc.getContext('2d')
window.render = (t, fps = 60, sub = 5) => {
  ac.clearRect(0, 0, W, H)
  for (let i = 0; i < sub; i++) {
    frame(t + (i / sub) * (0.5 / fps))
    ac.globalAlpha = 1 / (i + 1); ac.drawImage(cv, 0, 0)
  }
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.drawImage(acc, 0, 0)
}
window.DUR = DUR
window.ready = true
