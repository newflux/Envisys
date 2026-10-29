<template>
  <!-- The world as living type: every land cell is a letter or a symbol that keeps changing. Letters under the cursor turn white,
       a click throws them all across the screen, they fall and then find their way home. Routes of small dots run from Bengaluru
       with packets always travelling. Pins for distributors sit on a region's main city, not at an address. -->
  <section class="am">
    <div class="am-in" ref="inRef">
      <canvas class="am-cv" ref="cvRef" @pointermove="move" @pointerleave="leave" @click="click"></canvas>

      <div class="am-head">
        <span>From Bengaluru</span>
        <h3>{{ shown ? shown.n : 'To the world' }}</h3>
        <p>{{ shown ? shown.s : 'Four regional offices across India, and distributors across North America, Europe, the Middle East and South East Asia.' }}</p>
      </div>

      <div class="am-legend">
        <div v-for="g in groups" :key="g.title" class="am-lg">
          <em>{{ g.title }}</em>
          <button v-for="i in g.ids" :key="i" :class="{ on: shownI === i }" data-cursor="" @click="burst(i)" @pointerenter="legendHov = i" @pointerleave="legendHov = -1">
            <b>{{ routes[i].n }}</b><span>{{ routes[i].s }}</span>
          </button>
        </div>
      </div>

      <div class="am-tip" ref="tipRef"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'

type LL = [number, number]
type Pt = [number, number]
const HQ: LL = [77.520665, 13.0350511]
// every route leaves Bengaluru; pins on distributors are a region's main city
const routes = [
  { n: 'Faridabad', s: 'Regional office · North India', c: [77.3178, 28.4089] as LL },
  { n: 'Pune', s: 'Regional office · West India', c: [73.8567, 18.5204] as LL },
  { n: 'Coimbatore', s: 'Regional office · Tamil Nadu & Kerala', c: [76.9558, 11.0168] as LL },
  { n: 'Hyderabad', s: 'Regional office · Andhra Pradesh & Telangana', c: [78.4867, 17.385] as LL },
  { n: 'Gulf', s: 'Shivas Scientific Supplies FZE', c: [51, 25] as LL },
  { n: 'South East Asia', s: 'Higgs Boson Systems', c: [106.66, 10.82] as LL },
  { n: 'Russia', s: 'LLC Inteltest', c: [37.62, 55.75] as LL },
  { n: 'Ukraine', s: 'LLC Weimer Test', c: [30.52, 50.45] as LL },
  { n: 'UK & Ireland', s: 'JB Environmental Engineering Ltd', c: [-1.5, 53] as LL },
  { n: 'USA & Canada', s: 'ARES Distribution, LLC', c: [-98, 39] as LL }
]
const groups = [{ title: 'Offices', ids: [0, 1, 2, 3] }, { title: 'Distributors', ids: [4, 5, 6, 7, 8, 9] }]

const cvRef = ref<HTMLCanvasElement | null>(null)
const tipRef = ref<HTMLElement | null>(null)
const inRef = ref<HTMLElement | null>(null)
const shownI = ref(-1)
const shown = computed(() => (shownI.value >= 0 ? routes[shownI.value] : null))
let legendHov = -1

const CHARS = '0123456789+*=:'
const NCH = CHARS.length
const TINT = ['rgba(255,122,50,0.4)', 'rgba(255,140,70,0.85)', 'rgba(255,186,132,0.95)']

let land: any = null
let font = 'monospace'
let ptr: Pt | null = null
// the hover is a soft, drifting patch: it eases after the pointer and stretches along the way it is moving
let spx = 0, spy = 0, svx = 0, svy = 0, hasSp = false
let hover = -1, focus = -1, focusUntil = 0
let t0 = 0

// layout, rebuilt when the canvas changes size
let lw = 0, lh = 0, cw = 7, ch = 9, dpr1 = 1
let hx = new Float32Array(0), hy = new Float32Array(0), gx = new Float32Array(0), gy = new Float32Array(0)
let vx = new Float32Array(0), vy = new Float32Array(0), rt = new Float32Array(0)
let ci = new Uint8Array(0), mode = new Uint8Array(0)
let atlas: HTMLCanvasElement | null = null, acw = 0, ach = 0
let pins: Pt[] = [], hq: Pt = [0, 0], arcs: Pt[][] = []
// live traffic: packets run out from Bengaluru along each route, and a ripple spreads through the letters where one lands
type Packet = { r: number; t: number; v: number }
let packets: Packet[] = []
let scatterAt = 0

function buildAtlas(dpr: number) {
  acw = Math.ceil(cw * dpr * 1.6); ach = Math.ceil(ch * dpr * 1.6)
  atlas = document.createElement('canvas'); atlas.width = acw * NCH; atlas.height = ach * 3
  const a = atlas.getContext('2d')!
  a.font = `${Math.round(ch * 0.95 * dpr)}px ${font}`; a.textAlign = 'center'; a.textBaseline = 'middle'
  for (let r = 0; r < 3; r++) { a.fillStyle = TINT[r]; for (let i = 0; i < NCH; i++) a.fillText(CHARS[i], i * acw + acw / 2, r * ach + ach / 2) }
}

function layout(W: number, H: number, dpr: number) {
  lw = W; lh = H; dpr1 = dpr
  cw = Math.max(5.5, W / 200); ch = cw * 1.28
  buildAtlas(dpr)
  const proj = geoNaturalEarth1()
  const my = H * 0.07
  proj.fitExtent([[W * 0.03, my], [W * (W > 800 ? 0.8 : 0.97), H - my]], { type: 'MultiPoint', coordinates: [[-170, 5], [178, 5], [10, 75], [10, -52]] } as any)
  // rasterise the land once, then keep a letter wherever a grid cell falls on it
  const off = document.createElement('canvas'); off.width = W; off.height = H
  const o = off.getContext('2d', { willReadFrequently: true })!
  o.fillStyle = '#fff'; o.beginPath(); geoPath(proj, o)({ type: 'FeatureCollection', features: land.features.filter((f: any) => f.id !== '010') } as any); o.fill()
  const img = o.getImageData(0, 0, W, H).data
  const xs: number[] = [], ys: number[] = []
  for (let y = ch / 2; y < H; y += ch) for (let x = cw / 2; x < W; x += cw) if (img[((y | 0) * W + (x | 0)) * 4 + 3] > 110) { xs.push(x); ys.push(y) }
  const n = xs.length
  hx = Float32Array.from(xs); hy = Float32Array.from(ys); gx = Float32Array.from(xs); gy = Float32Array.from(ys)
  vx = new Float32Array(n); vy = new Float32Array(n); rt = new Float32Array(n); mode = new Uint8Array(n)
  ci = Uint8Array.from({ length: n }, () => (Math.random() * NCH) | 0)
  const at = (c: LL) => proj(c) as Pt
  hq = at(HQ); pins = routes.map((r) => at(r.c))
  arcs = pins.map((b) => {
    const dist = Math.hypot(b[0] - hq[0], b[1] - hq[1])
    const cx = (hq[0] + b[0]) / 2, cy = Math.min(hq[1], b[1]) - dist * 0.34
    return Array.from({ length: 121 }, (_, i) => { const t = i / 120, u = 1 - t; return [u * u * hq[0] + 2 * u * t * cx + t * t * b[0], u * u * hq[1] + 2 * u * t * cy + t * t * b[1]] as Pt })
  })
  packets = routes.flatMap((_r, i) => [0].map((o2) => ({ r: i, t: (o2 + i * 0.137) % 1, v: 0.055 + (i % 3) * 0.012 })))
}

function burst(i: number) {
  focus = i; focusUntil = performance.now() + 3200
  for (let n = 0; n < 6; n++) packets.push({ r: i, t: -n * 0.07, v: 0.42 })
}
// a click throws every letter away from the pointer; they fall, bounce, and drift home
function scatter(at: Pt) {
  scatterAt = performance.now()
  for (let i = 0; i < hx.length; i++) {
    const dx = gx[i] - at[0], dy = gy[i] - at[1], d = Math.hypot(dx, dy) || 1
    const m = 320 + 900 * Math.exp(-d / 240) * (0.6 + Math.random() * 0.7)
    vx[i] = (dx / d) * m + (Math.random() - 0.5) * 220
    vy[i] = (dy / d) * m - 260 - Math.random() * 380
    rt[i] = 2.3 + Math.random() * 1.4
    mode[i] = 1
  }
}
const move = (e: PointerEvent) => { const b = cvRef.value!.getBoundingClientRect(); ptr = [e.clientX - b.left, e.clientY - b.top] }
const leave = () => { ptr = null; hover = -1 }
const click = () => { if (hover >= 0) burst(hover); else if (ptr) scatter(ptr) }

let last = performance.now()
function draw(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now
  const c = cvRef.value!
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  const W = c.clientWidth, H = c.clientHeight
  if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr) }
  if (land && (W !== lw || H !== lh || dpr !== dpr1)) layout(W, H, dpr)
  if (!atlas || !hx.length) return
  const ctx = c.getContext('2d')!
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, c.width, c.height)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  if (!t0) t0 = now
  const intro = Math.min(1, (now - t0) / 1800)
  const since = scatterAt ? (now - scatterAt) / 1000 : 99

  if (focus >= 0 && now > focusUntil) focus = -1
  const lit = hover >= 0 ? hover : legendHov >= 0 ? legendHov : focus
  shownI.value = lit
  const rad = 82
  if (ptr) {
    if (!hasSp) { spx = ptr[0]; spy = ptr[1]; hasSp = true }
    const nx = spx + (ptr[0] - spx) * 0.16, ny = spy + (ptr[1] - spy) * 0.16
    svx += ((nx - spx) - svx) * 0.2; svy += ((ny - spy) - svy) * 0.2; spx = nx; spy = ny
  } else { hasSp = false; svx *= 0.9; svy *= 0.9 }
  const speed = Math.hypot(svx, svy), ca = speed > 0.01 ? svx / speed : 1, sa = speed > 0.01 ? svy / speed : 0, stretch = 1 + Math.min(1.1, speed / 7)

  for (let i = 0; i < hx.length; i++) {
    let x = gx[i], y = gy[i], row = 0, s = 1
    if (mode[i] === 0) {
      if (hx[i] > intro * (W + 100)) continue
      let h = 0, nxo = 0, nyo = 0
      if (ptr) {
        const dx = hx[i] - spx, dy = hy[i] - spy
        if (dx * dx + dy * dy < rad * rad * 2.6) {
          const u = dx * ca + dy * sa, w = -dx * sa + dy * ca, d = Math.hypot(u / stretch, w * Math.sqrt(stretch))
          const ang = Math.atan2(dy, dx), edge = rad * (1 + 0.2 * Math.sin(ang * 3 + now * 0.0012) + 0.1 * Math.sin(ang * 5 - now * 0.0009))
          if (d < edge) { const q = 1 - d / edge; h = q * q * (3 - 2 * q); nxo = (dx / (d + 8)) * 4 * h; nyo = (dy / (d + 8)) * 4 * h }
        }
      }
      if (Math.random() < (h > 0.05 ? 0.05 : 0.0008)) ci[i] = (Math.random() * NCH) | 0
      row = h > 0.5 ? 2 : h > 0.07 ? 1 : 0
      s = 1 + 0.38 * h * h
      x = hx[i] + nxo; y = hy[i] + nyo
    } else {
      // flying, then returning
      if (since < rt[i]) {
        vy[i] += 1500 * dt; gx[i] += vx[i] * dt; gy[i] += vy[i] * dt
        if (gy[i] > H - 8) { gy[i] = H - 8; vy[i] *= -0.35; vx[i] *= 0.82 }
        if (gx[i] < 4 || gx[i] > W - 4) vx[i] *= -0.6
        if (Math.random() < 0.05) ci[i] = (Math.random() * NCH) | 0
      } else {
        const k = Math.min(1, dt * 5)
        gx[i] += (hx[i] - gx[i]) * k; gy[i] += (hy[i] - gy[i]) * k
        if (Math.abs(hx[i] - gx[i]) + Math.abs(hy[i] - gy[i]) < 0.6) { mode[i] = 0; gx[i] = hx[i]; gy[i] = hy[i] }
      }
      row = 1; x = gx[i]; y = gy[i]
    }
    ctx.drawImage(atlas, ci[i] * acw, row * ach, acw, ach, x - (cw * 1.6 * s) / 2, y - (ch * 1.6 * s) / 2, cw * 1.6 * s, ch * 1.6 * s)
  }

  // routes are drawn as dots while the map is whole, and step aside while it is scattered
  const vis = since > 90 ? 1 : Math.min(1, Math.max(0, (since - 1.2) / 2.2))
  ctx.globalAlpha = vis
  routes.forEach((_r, i) => {
    const on = i === lit
    ctx.fillStyle = on ? '#ff7a2a' : lit >= 0 ? 'rgba(255,170,110,0.2)' : 'rgba(255,170,110,0.38)'
    const sz = on ? 2.2 : 1.4
    for (let j = 0; j < arcs[i].length; j += on ? 2 : 3) { const p = arcs[i][j]; ctx.fillRect(p[0] - sz / 2, p[1] - sz / 2, sz, sz) }
  })

  // packets: a bright head with a short tail, one ripple where each lands
  const live: Packet[] = []
  for (const k of packets) {
    k.t += dt * k.v * (k.r === lit ? 2.2 : 1)
    if (k.t >= 1) { if (k.v > 0.3) continue; k.t -= 1 }
    live.push(k)
    if (k.t < 0) continue
    const a = arcs[k.r], f = Math.min(120, k.t * 120)
    for (let tail = 0; tail < 4; tail++) {
      const p = a[Math.max(0, Math.round(f) - tail * 2)]
      const s = tail ? 2.2 - tail * 0.4 : 3
      ctx.fillStyle = tail ? `rgba(255,190,130,${(0.6 - tail * 0.09).toFixed(2)})` : '#fff'
      if (!tail) { ctx.shadowBlur = 6; ctx.shadowColor = '#ff8a3d' }
      ctx.fillRect(p[0] - s / 2, p[1] - s / 2, s, s); ctx.shadowBlur = 0
    }
  }
  packets = live
  ctx.globalAlpha = 1

  // what the pointer is over: the nearest pin, or the nearest point on a route
  let best = -1, bd = 14
  if (ptr && vis > 0.9) routes.forEach((_r, i) => {
    const d = Math.hypot(pins[i][0] - ptr![0], pins[i][1] - ptr![1]); if (d < bd) { bd = d; best = i }
    for (let j = 0; j < arcs[i].length; j += 2) { const e = Math.hypot(arcs[i][j][0] - ptr![0], arcs[i][j][1] - ptr![1]); if (e < Math.min(bd, 8)) { bd = e; best = i } }
  })
  hover = best
  c.style.cursor = best >= 0 ? 'pointer' : 'crosshair'

  // pins: a small white block, orange when lit; Bengaluru pulses
  ctx.globalAlpha = vis
  ctx.font = `10px ${font}`
  ;(ctx as any).letterSpacing = '1.4px'
  routes.forEach((r, i) => {
    const on = i === lit, p = pins[i]
    ctx.fillStyle = on ? '#ff7a2a' : '#fff'; ctx.fillRect(p[0] - (on ? 4 : 2.6), p[1] - (on ? 4 : 2.6), on ? 8 : 5.2, on ? 8 : 5.2)
    if (on) { ctx.fillStyle = '#fff'; ctx.fillText(r.n.toUpperCase(), p[0] + 11, p[1] + 3.5) }
  })
  const b = (now / 3200) % 1
  ctx.fillStyle = '#ff6a1a'; ctx.fillRect(hq[0] - 4.5, hq[1] - 4.5, 9, 9)
  ctx.globalAlpha = (1 - b) * vis * 0.5; ctx.strokeStyle = '#ff6a1a'; ctx.lineWidth = 1; ctx.strokeRect(hq[0] - 5 - b * 14, hq[1] - 5 - b * 14, 10 + b * 28, 10 + b * 28)
  ctx.globalAlpha = vis; ctx.fillStyle = '#fff'; ctx.fillText('BENGALURU', hq[0] + 12, hq[1] + 3.5)
  ctx.globalAlpha = 1

  // tooltip for the hovered route
  const tip = tipRef.value!
  if (hover >= 0 && ptr) {
    tip.innerHTML = `<b>${routes[hover].n}</b><span>${routes[hover].s}</span><em>Bengaluru → ${routes[hover].n}</em>`
    tip.style.transform = `translate(${ptr[0] + 16}px, ${ptr[1] + 16}px)`; tip.style.opacity = '1'
  } else tip.style.opacity = '0'
}

let vis = false
let io: IntersectionObserver | null = null
function tick() { if (vis) draw(performance.now()) }

onMounted(async () => {
  font = getComputedStyle(document.documentElement).getPropertyValue('--font-body').trim() || 'monospace'
  io = new IntersectionObserver(([e]) => { vis = e.isIntersecting }, { rootMargin: '10% 0px' })
  io.observe(inRef.value!)
  gsap.ticker.add(tick)
  try {
    const topo = await (await fetch('/data/countries-110m.json')).json()
    land = feature(topo, topo.objects.countries)
  } catch { /* without the land there is nothing to draw */ }
})
onUnmounted(() => { gsap.ticker.remove(tick); io?.disconnect() })
</script>

<style scoped>
.am { position: relative; background: #000; color: #fff; }
.am-in { position: relative; height: 100vh; min-height: 640px; overflow: hidden; }
.am-cv { position: absolute; inset: 0; width: 100%; height: 100%; }

.am-head { position: absolute; left: 4vw; bottom: 9vh; width: min(400px, 80vw); pointer-events: none; }
.am-head span { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.55; }
.am-head h3 { margin: 1.4vh 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(26px, 2.8vw, 52px); line-height: 1.02; letter-spacing: -0.05em; }
.am-head p { margin: 0; font-family: var(--font-body); font-size: 13px; line-height: 1.55; color: rgba(255, 255, 255, 0.78); }

.am-legend { position: absolute; right: 4vw; top: 50%; translate: 0 -50%; display: flex; flex-direction: column; gap: 22px; text-align: right; }
.am-lg { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.am-lg em { font-style: normal; font-family: var(--font-body); font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.4; margin-bottom: 6px; }
.am-lg button { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; padding: 6px 0; border: 0; background: none; color: #fff; cursor: pointer; font-family: var(--font-body); text-transform: uppercase; opacity: 0.5; transition: opacity 0.3s ease, transform 0.4s var(--ease, ease); }
.am-lg button b { font-weight: 400; font-size: 10px; letter-spacing: 0.12em; }
.am-lg button span { font-size: 8.5px; letter-spacing: 0.1em; opacity: 0.55; }
.am-lg button:hover, .am-lg button.on { opacity: 1; transform: translateX(-6px); }
.am-lg button.on b { color: #ff7a2a; }

.am-tip { position: absolute; left: 0; top: 0; padding: 10px 14px; display: flex; flex-direction: column; gap: 3px; background: rgba(10, 10, 14, 0.85); border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 6px; font-family: var(--font-body); text-transform: uppercase; opacity: 0; pointer-events: none; transition: opacity 0.2s ease; will-change: transform; }
.am-tip b { font-weight: 400; font-size: 11px; letter-spacing: 0.12em; }
.am-tip span { font-size: 9px; letter-spacing: 0.1em; opacity: 0.65; }
.am-tip em { font-style: normal; font-size: 9px; letter-spacing: 0.1em; color: #ff7a2a; }

@media (max-width: 800px) {
  .am-legend { display: none; }
  .am-head h3 { font-size: 28px; }
}
</style>
