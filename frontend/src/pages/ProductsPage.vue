<template>
  <PageShell title="Products" blue v-slot="{ contact }">
    <!-- on arrival: the landing page's smoke fills the screen, then sinks away to reveal the scene -->
    <Teleport to="body"><canvas v-if="!plDone" class="pl" ref="plRef" aria-hidden="true"></canvas></Teleport>
    <!-- 1 · the flagships, one scene each, each in its own empty room (a gradient drawn from a reference space). Light first; for a couple of them the landing page's smoke rolls in and the light falls. -->
    <section class="hx" ref="showRef" :style="{ height: (mainProducts.length + 1) * 100 + 'vh' }">
      <div class="hx-pin" ref="pinRef" :class="{ dk }">
        <!-- a dark frame cut into panels by slanted gaps; the main panel holds the room, the rest hold the controls -->
        <div class="fx" aria-hidden="true">
          <div class="fx-sk">
            <div class="pn p1">
              <!-- light rooms sit under the smoke, dark rooms above it -->
              <div v-for="(p, i) in mainProducts" :key="p.slug" class="hx-bg" :class="[`g-${p.slug}`, darkScenes.has(p.slug) ? 'd' : 'l', { on: i === cur }]"></div>
              <canvas class="hx-smoke" ref="smokeRef"></canvas>
            </div>
            <div class="pn p2"></div>
            <div class="pn p3"></div>
            <div class="pn p4"></div>
          </div>
          <div class="hx-spot"></div>
        </div>

        <!-- the chambers: all front-on, each rising from the floor -->
        <div class="hx-stage" ref="stageRef">
          <div class="hx-shadow"></div>
          <img v-for="(p, i) in mainProducts" :key="p.slug" class="hx-img" :class="i === cur ? 'on' : i < cur ? 'past' : 'next'" :style="{ '--s': scale[p.slug] ?? 0.8 }" :src="img(p, 'hero')" :alt="p.name" draggable="false" />
          <button class="hx-hit" data-cursor="SPECS" aria-label="View specification" @click="sheet = active"></button>
        </div>
        <div class="hx-grain" aria-hidden="true"></div>

        <nav class="hx-side" aria-label="Chamber tools">
          <button data-cursor="" @click="toBento"><i><svg viewBox="0 0 12 12"><path d="M8 2L4 6l4 4" fill="none" stroke="currentColor" stroke-width="1.2" /></svg></i><span>All chambers</span></button>
          <button data-cursor="" @click="sheet = active"><i><svg viewBox="0 0 12 12"><rect x="1.5" y="2.5" width="9" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="1.1" /><path d="M1.5 8l3-3 2.5 2.5L8.5 6l2 2" fill="none" stroke="currentColor" stroke-width="1.1" /></svg></i><span>Gallery</span></button>
          <a v-if="active.brochure" :href="active.brochure" target="_blank" rel="noopener" data-cursor=""><i><svg viewBox="0 0 12 12"><path d="M6 1.5v6.5M3.2 5.5L6 8.2l2.8-2.7M2 10.5h8" fill="none" stroke="currentColor" stroke-width="1.1" /></svg></i><span>Brochure</span></a>
        </nav>

        <Transition name="roll" mode="out-in">
          <div class="hx-name" :key="active.slug">
            <span>0{{ cur + 1 }} / 0{{ mainProducts.length }}</span>
            <h1>{{ active.name }}</h1>
            <p>{{ active.tagline }}</p>
          </div>
        </Transition>

        <!-- top right: a test cycle, running live, drawn from this chamber's own range -->
        <div class="hx-md">
          <header><span><u class="live"></u>Example cycle</span><small>time-lapse</small></header>
          <div class="cy-r"><b ref="cyTxt">—</b><i>°C</i><em ref="cyState">—</em></div>
          <canvas class="cy" ref="cyRef" aria-hidden="true"></canvas>
          <footer><span>{{ cyLo }}</span><span>{{ cy.note }}</span><span>{{ cyHi }}</span></footer>
        </div>

        <Transition name="roll" mode="out-in">
          <div class="hx-ex" :key="active.slug" :style="{ pointerEvents: undefined }">
            <header><span>{{ active.models[0].label }}</span><b>{{ active.models[0].items.length }}</b></header>
            <div class="ch" style="pointer-events: auto">
              <a v-for="m in active.models[0].items.slice(0, 6)" :key="m" :href="`/products/${active.slug}?m=${encodeURIComponent(m)}`" data-cursor="">{{ m }}</a>
            </div>
            <p v-if="active.features[0]">{{ active.features[0] }}</p>
          </div>
        </Transition>

        <ul class="hx-rule" aria-label="Range">
          <li v-for="(p, i) in mainProducts" :key="p.slug" :class="{ on: i === cur }" data-cursor="" @click="jump(i)"><span>{{ p.code }}</span><i></i></li>
          <u :style="{ top: (prog * 100).toFixed(2) + '%' }"></u>
        </ul>

        <div class="hx-read">
          <Transition name="roll" mode="out-in">
            <dl :key="active.slug">
              <div v-for="h in active.hud" :key="h[0]"><dt>{{ h[0] }}</dt><dd>{{ h[1] }}<small>{{ h[2] }}</small></dd></div>
            </dl>
          </Transition>
        </div>

        <div class="hx-act">
          <div class="hx-menu">
            <button class="hi" data-cursor="" @click="sheet = active">View specification</button>
            <button data-cursor="" @click="contact()">Get a quote</button>
            <a v-if="active.brochure" :href="active.brochure" target="_blank" rel="noopener" data-cursor="">Download brochure</a>
            <button data-cursor="" @click="cur < mainProducts.length - 1 ? jump(cur + 1) : toBento()">{{ cur < mainProducts.length - 1 ? `Next · ${mainProducts[cur + 1].name}` : 'The rest of the range' }}</button>
          </div>
          <div class="hx-dial" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" class="d-tr" />
              <circle cx="60" cy="60" r="52" class="d-arc" :style="{ strokeDashoffset: (1 - prog) * 327 }" />
              <g class="d-tk"><line v-for="k in 40" :key="k" x1="60" y1="2" x2="60" :y2="k % 8 === 1 ? 9 : 5" :transform="`rotate(${k * 9} 60 60)`" /></g>
            </svg>
            <b>0{{ cur + 1 }}</b><small>of 0{{ mainProducts.length }}</small>
          </div>
        </div>
      </div>
    </section>

    <!-- 2 · type, on light -->
    <section class="ty">
      <div class="ty-top rv"><span>(01)</span><span>The range</span><span>{{ products.length }} series</span></div>
      <h2 class="ty-h" data-words>One chamber for every test, designed, proven and serviced under one roof.</h2>
      <div class="ty-row">
        <h3 data-words>Design it.<br />Prove it.<br />Keep it running.</h3>
        <div class="ty-body">
          <p class="rv">Envisys designs and builds environmental test chambers in Peenya, Bengaluru, from a bench chamber for a single component to a walk-in room that takes an entire vehicle.</p>
          <p class="rv" style="--d: 0.06s">Vistara, our NABL-accredited testing lab, runs qualification and reliability tests on the same kind of chambers, by the people who build them.</p>
          <p class="rv" style="--d: 0.12s">When it is time to replace one, we refurbish it, buy it back, or keep it calibrated under an AMC, with engineers across India.</p>
        </div>
      </div>
    </section>

    <!-- a photograph, as it is -->
    <section class="ph" ref="phRef" aria-hidden="true">
      <img ref="phImg" src="/media/step-1.jpg" alt="" loading="lazy" />
      <p data-words>Built in Peenya,<br />Bengaluru.</p>
    </section>

    <!-- 3 · the smoke rolls in and the page goes black; everything after it is dark -->
    <section class="cl" ref="cloudRef">
      <div class="cl-stage">
        <canvas class="cl-smoke" ref="cloudSmokeRef" aria-hidden="true"></canvas>
        <h2 class="cl-h" :class="{ lit: cloudLit }">One company.<br />Three stages.</h2>
      </div>
    </section>

    <div class="dkp">
      <section class="st">
        <ol>
          <li v-for="(s, i) in stages" :key="s.t" class="rv" :style="{ '--d': i * 0.1 + 's' }">
            <span class="st-n">O{{ i + 1 }}</span>
            <i><u></u></i>
            <h3>{{ s.t }}</h3>
            <p>{{ s.d }}</p>
          </li>
        </ol>
      </section>

      <section class="nm">
        <div class="ty-top rv"><span>(02)</span><span>The range in numbers</span><span></span></div>
        <ul>
          <li v-for="(n, i) in numbers" :key="n.l" class="rv" :style="{ '--d': i * 0.07 + 's' }"><b>{{ n.v }}</b><span>{{ n.l }}</span></li>
        </ul>
        <div class="nm-two">
          <div class="rv"><span>Express factory</span><p>Standard models kept in stock and shipped fast, across India and abroad.</p></div>
          <div class="rv" style="--d: 0.08s"><span>Project factory</span><p>Complex, custom work, built to your specification by the design team.</p></div>
        </div>
      </section>

      <!-- the rest of the range, as a bento -->
      <section class="bt" ref="bentoRef">
        <i class="bt-orb a"></i><i class="bt-orb b"></i>
        <div class="ty-top rv"><span>(03)</span><span>The rest of the range</span><button data-cursor="" @click="openSearch">Search by model or test</button></div>
        <div class="bt-frame">
          <div class="bt-grid">
            <button v-for="(p, i) in catalogue" :key="p.slug" class="bt-tile" :class="`s${i % 8}`" data-cursor="SPECS" @click="sheet = p">
              <div class="bt-un">
                <div class="bt-in rv" :style="{ '--d': (i % 4) * 0.05 + 's' }">
                  <div class="bt-img" :class="{ photo: p.photo }"><i class="bt-glow"></i><img :src="img(p, 'hero')" :alt="p.name" loading="lazy" /></div>
                  <div class="bt-tx"><b>{{ p.name }}</b><small>{{ p.group }}</small></div>
                  <i class="bt-plus"><svg viewBox="0 0 10 10"><path d="M5 1v8M1 5h8" stroke="currentColor" stroke-width="1.1" /></svg></i>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section class="en">
        <div class="ty-top rv"><span>(04)</span><span>Something else</span><span></span></div>
        <h2 class="ty-h" data-words>Don't see your test in the range? We'll build the chamber for it.</h2>
        <div class="en-cta rv" style="--d: 0.1s">
          <button class="ps-pill light" data-cursor="" @click="contact()"><span>Start a project</span><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg></button>
          <a href="/verticals" data-cursor="">Or rent one for a short test →</a>
        </div>
      </section>

      <NextUp label="Next" title="How we work with you" text="Design and build, testing services, rentals, refurbishment, after-sales and express delivery." href="/verticals" />
    </div>

    <SpecSheet :product="sheet" @close="sheet = null" @quote="sheet = null; contact()" />
  </PageShell>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import PageShell from '../components/PageShell.vue'
import NextUp from '../components/NextUp.vue'
import SpecSheet from '../components/SpecSheet.vue'
import { createSmoke } from '../utils/smokeWave'
import { products, mainProducts, catalogue, img, type Product } from '../config/products'

// how tall each chamber stands, relative to the others, so a bench model reads smaller than a walk-in room
const scale: Record<string, number> = { et: 0.9, ets: 0.9, eta: 0.8, mini: 0.74, 'walk-in': 0.7 }
// the scenes where the light falls
const darkScenes = new Set(['ets', 'eta'])

// the cut of the frame for each chamber: width of the main panel (vw), where the right column splits (%, 100 = no split), the slant (deg), where the far strip starts (vw)
const layout = [
  { w: 77, sp: 56, sk: 10, st: 105 }, // ET: the standard cut
  { w: 66, sp: 100, sk: 14, st: 107 }, // ETS: tall and narrow, the right column becomes one tall panel
  { w: 80, sp: 52, sk: 6, st: 105 }, // ETA: almost upright, a wide stage
  { w: 72, sp: 70, sk: 12, st: 106 }, // Mini: small, a larger panel above
  { w: 78, sp: 100, sk: 13, st: 107 } // Walk-in: wide, one tall panel again
]
// the example cycle: each chamber's real range (from its specification) and what is special about it
type Cy = { lo: number | null; hi: number | null; kind: 'ramp' | 'shock' | 'alt' | 'slow'; note: string }
const cycles: Record<string, Cy> = {
  et: { lo: -70, hi: 180, kind: 'ramp', note: '3–20 °C/min' },
  ets: { lo: -70, hi: 200, kind: 'shock', note: 'transfer < 10 s' },
  eta: { lo: -70, hi: 180, kind: 'alt', note: 'down to 10 mbar' },
  mini: { lo: null, hi: null, kind: 'ramp', note: 'range per model' },
  'walk-in': { lo: -65, hi: 180, kind: 'slow', note: '10k–22k L' }
}
const stages = [
  { t: 'Design and build', d: 'Standard chambers, or built to your specification by a dedicated design and development team.' },
  { t: 'Test', d: 'Vistara, our NABL-accredited lab in Peenya, runs qualification and reliability tests, by the people who build the chambers.' },
  { t: 'Keep it running', d: 'Rentals, refurbishment and buy-back, calibration and AMCs, with engineers across India.' }
]
const numbers = [
  { v: String(products.length), l: 'series in the range' },
  { v: '−70°', l: 'coldest chamber, °C' },
  { v: '+200°', l: 'hottest chamber, °C' },
  { v: '22,000', l: 'litres, the largest walk-in' }
]

const showRef = ref<HTMLElement | null>(null)
const bentoRef = ref<HTMLElement | null>(null)
const smokeRef = ref<HTMLCanvasElement | null>(null)
const cloudRef = ref<HTMLElement | null>(null)
const cloudSmokeRef = ref<HTMLCanvasElement | null>(null)
const plRef = ref<HTMLCanvasElement | null>(null)
const plDone = ref(false)
const pinRef = ref<HTMLElement | null>(null)
const cyRef = ref<HTMLCanvasElement | null>(null)
const cyTxt = ref<HTMLElement | null>(null)
const cyState = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const phRef = ref<HTMLElement | null>(null)
const phImg = ref<HTMLImageElement | null>(null)
const cur = ref(0)
const prog = ref(0)
const dk = ref(false)
const cloudLit = ref(false)
const sheet = ref<Product | null>(null)
const active = computed(() => mainProducts[cur.value])
const cy = computed(() => cycles[active.value.slug])
const fmtT = (n: number) => `${n < 0 ? '−' : '+'}${Math.abs(n)}°`
const cyLo = computed(() => (cy.value.lo === null ? '—' : fmtT(cy.value.lo)))
const cyHi = computed(() => (cy.value.hi === null ? '—' : fmtT(cy.value.hi)))
const openSearch = () => window.dispatchEvent(new Event('envisys:search'))

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number) => a * a * (3 - 2 * a)
const scroller = () => document.querySelector('#scroller') as HTMLElement
const topOf = (el: HTMLElement) => el.getBoundingClientRect().top + scroller().scrollTop
function jump(i: number) {
  const r = showRef.value!
  ;(window as any).lenisInstance?.scrollTo(topOf(r) + ((i + 0.08) / mainProducts.length) * (r.offsetHeight - window.innerHeight), { duration: 1.4 })
}
const toBento = () => (window as any).lenisInstance?.scrollTo(topOf(bentoRef.value!) - 40, { duration: 1.6 })

// scene smoke: 0 = light room, 1 = the light has fallen. It rises when a dark scene arrives and sinks again after.
const fall = { v: 0 }
let smoke: ReturnType<typeof createSmoke> | null = null
let cloud: ReturnType<typeof createSmoke> | null = null
let lean = 0, leanT = 0
watch(cur, () => {
  dk.value = darkScenes.has(active.value.slug)
  gsap.to(fall, { v: dk.value ? 1 : 0, duration: 1.8, ease: 'power2.inOut', overwrite: true })
})
let tx = 0, ty = 0, txT = 0, tyT = 0, mx = 0, my = 0, mxT = 0, myT = 0
const onMove = (e: PointerEvent) => {
  leanT = e.clientX / window.innerWidth - 0.5
  txT = leanT * 2; tyT = (e.clientY / window.innerHeight - 0.5) * 2
  mxT = e.clientX; myT = e.clientY
}

// the cycle: 0 = cold, 1 = hot, over one period u (0..1)
const sstep = (a: number, b: number, x: number) => smooth(clamp01((x - a) / (b - a)))
function shape(kind: Cy['kind'], u: number) {
  if (kind === 'shock') return sstep(0.22, 0.25, u) - sstep(0.5, 0.53, u) + sstep(0.72, 0.75, u) - sstep(0.97, 1, u)
  if (kind === 'slow') return sstep(0.1, 0.5, u) - sstep(0.6, 1, u)
  return sstep(0.15, 0.45, u) - sstep(0.6, 0.9, u)
}
const pressure = (u: number) => 1 - 0.93 * (sstep(0.1, 0.3, u) - sstep(0.7, 0.9, u))
const view = { lo: -70, hi: 180, has: 1 }
// what the chamber is doing at this point of the cycle
function phase(kind: Cy['kind'], u: number) {
  if (kind === 'shock') return (u < 0.22 || (u >= 0.53 && u < 0.72)) ? 'Cold zone' : ((u >= 0.25 && u < 0.5) || (u >= 0.75 && u < 0.97)) ? 'Hot zone' : 'Transfer'
  if (kind === 'slow') return u < 0.1 ? 'Cold dwell' : u < 0.5 ? 'Heating' : u < 0.6 ? 'Hot dwell' : 'Cooling'
  return u < 0.15 || u >= 0.9 ? 'Cold dwell' : u < 0.45 ? 'Heating' : u < 0.6 ? 'Hot dwell' : 'Cooling'
}
let lastPhase = ''
function drawCycle(now: number) {
  const c = cyRef.value
  if (!c || !c.clientWidth) return
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5), W = c.clientWidth, H = c.clientHeight
  if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr) }
  const g = c.getContext('2d')!
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.clearRect(0, 0, W, H)
  const T = cy.value
  view.lo += ((T.lo ?? 0) - view.lo) * 0.08; view.hi += ((T.hi ?? 1) - view.hi) * 0.08; view.has += ((T.lo === null ? 0 : 1) - view.has) * 0.08
  const ink = dk.value ? '238,241,246' : '13,35,64'
  const P = 14, headX = W * 0.8, pps = headX / 12, yBase = H * 0.86
  const yOf = (v: number) => H * 0.14 + (1 - v) * H * 0.7
  const at = (t: number) => ((t / P) % 1 + 1) % 1
  const timeAt = (x: number) => now - (headX - x) / pps
  g.lineJoin = 'round'; g.lineCap = 'round'

  // grid: dotted lines, the 0 °C line when the range crosses it, and ticks that slide past like a chart recorder
  g.lineWidth = 1; g.strokeStyle = `rgba(${ink},0.16)`; g.setLineDash([1, 5])
  for (let k = 0; k <= 4; k++) { const y = Math.round(H * 0.14 + (k / 4) * H * 0.7) + 0.5; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke() }
  if (view.has > 0.5 && view.lo < 0 && view.hi > 0) { const y = yOf((0 - view.lo) / (view.hi - view.lo)); g.setLineDash([3, 4]); g.strokeStyle = `rgba(${ink},0.4)`; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke() }
  g.setLineDash([])
  g.strokeStyle = `rgba(${ink},0.28)`
  for (let k = Math.ceil(timeAt(0)); k <= Math.floor(timeAt(W)); k++) { const x = Math.round(headX - (now - k) * pps) + 0.5; g.beginPath(); g.moveTo(x, H - (k % 5 === 0 ? 8 : 4)); g.lineTo(x, H); g.stroke() }

  const path = (fn: (u: number) => number, x0: number, x1: number) => { g.beginPath(); for (let x = x0; x <= x1; x += 2) { const y = yOf(fn(at(timeAt(x)))); x === x0 ? g.moveTo(x, y) : g.lineTo(x, y) } }
  const sh = (u: number) => shape(T.kind, u)
  // the soft area under the line, brighter toward the probe
  path(sh, 0, headX); g.lineTo(headX, yBase); g.lineTo(0, yBase); g.closePath()
  const fill = g.createLinearGradient(0, 0, headX, 0)
  fill.addColorStop(0, `rgba(${ink},0)`); fill.addColorStop(1, `rgba(${ink},0.14)`)
  g.fillStyle = fill; g.fill()
  // the line itself, fading in toward the probe
  const gr = g.createLinearGradient(0, 0, headX, 0)
  gr.addColorStop(0, `rgba(${ink},0)`); gr.addColorStop(0.55, `rgba(${ink},0.55)`); gr.addColorStop(1, `rgba(${ink},1)`)
  g.lineWidth = 2; g.strokeStyle = gr; g.shadowColor = `rgba(${ink},0.35)`; g.shadowBlur = 6
  path(sh, 0, headX); g.stroke(); g.shadowBlur = 0
  if (T.kind === 'alt') { g.setLineDash([3, 4]); g.lineWidth = 1.2; g.strokeStyle = `rgba(${ink},0.6)`; path(pressure, 0, headX); g.stroke(); g.setLineDash([]) }
  // what is still to come
  g.lineWidth = 1.2; g.setLineDash([2, 4]); g.strokeStyle = `rgba(${ink},0.3)`; path(sh, headX, W); g.stroke(); g.setLineDash([])

  // the probe
  const u = at(now), v = sh(u), yh = yOf(v)
  const vl = g.createLinearGradient(0, 0, 0, H)
  vl.addColorStop(0, `rgba(${ink},0)`); vl.addColorStop(0.5, `rgba(${ink},0.22)`); vl.addColorStop(1, `rgba(${ink},0)`)
  g.strokeStyle = vl; g.lineWidth = 1; g.beginPath(); g.moveTo(headX + 0.5, 0); g.lineTo(headX + 0.5, H); g.stroke()
  g.fillStyle = 'rgba(255,106,26,0.2)'; g.beginPath(); g.arc(headX, yh, 8 + 3 * Math.sin(now * 3), 0, 7); g.fill()
  g.shadowColor = 'rgba(255,106,26,0.9)'; g.shadowBlur = 12
  g.fillStyle = '#ff6a1a'; g.beginPath(); g.arc(headX, yh, 3.6, 0, 7); g.fill(); g.shadowBlur = 0

  if (cyTxt.value) {
    const val = view.lo + (view.hi - view.lo) * v
    cyTxt.value.textContent = T.lo === null ? '—' : `${val < 0 ? '−' : '+'}${Math.abs(val).toFixed(1)}`
  }
  const ph = T.lo === null ? 'Per model' : phase(T.kind, u)
  if (cyState.value && ph !== lastPhase) { lastPhase = ph; cyState.value.textContent = ph }
}

let small = false // phones get plain veils instead of WebGL smoke, and fewer effects
let navDark = false
function tick() {
  const H = window.innerHeight
  lean += (leanT - lean) * 0.06

  const r = showRef.value!.getBoundingClientRect()
  if (r.bottom > 0 && r.top < H) {
    const p = clamp01(-r.top / (r.height - H))
    prog.value = p
    const i = Math.min(mainProducts.length - 1, Math.floor(p * mainProducts.length))
    if (i !== cur.value) cur.value = i
    smoke?.draw(fall.v, lean)
    if (!small) drawCycle(performance.now() / 1000)

    // the frame re-cuts itself with the scroll: it settles for each chamber, and eases toward the next one as you leave
    const f = p * mainProducts.length, k = Math.min(mainProducts.length - 1, Math.floor(f))
    const e = k < mainProducts.length - 1 ? smooth(clamp01((f - k - 0.55) / 0.45)) : 0
    const a = layout[k], b = layout[Math.min(layout.length - 1, k + 1)]
    const m = (x: number, y: number) => x + (y - x) * e
    const pin = pinRef.value
    if (pin) {
      pin.style.setProperty('--w1', `${m(a.w, b.w).toFixed(2)}vw`)
      pin.style.setProperty('--cx', `${((m(a.w, b.w) - 15) / 2).toFixed(2)}vw`)
      pin.style.setProperty('--sp', `${m(a.sp, b.sp).toFixed(2)}%`)
      pin.style.setProperty('--sk', `${(-m(a.sk, b.sk)).toFixed(2)}deg`)
      pin.style.setProperty('--st', `${m(a.st, b.st).toFixed(2)}vw`)
      pin.style.setProperty('--k', (0.9 + (m(a.w, b.w) - 72) * 0.012).toFixed(3)) // the chamber grows with its panel
      pin.style.setProperty('--ex', clamp01((m(a.sp, b.sp) - 70) / 25).toFixed(3)) // more information appears when the right column becomes one tall panel
      // the chamber leans toward the cursor; a soft light follows it across the panels
      tx += (txT - tx) * 0.07; ty += (tyT - ty) * 0.07; mx += (mxT - mx) * 0.14; my += (myT - my) * 0.14
      if (stageRef.value) stageRef.value.style.transform = `perspective(1600px) rotateY(${(tx * 2.4).toFixed(2)}deg) rotateX(${(-ty * 1.8).toFixed(2)}deg)`
      pin.style.setProperty('--mx', `${mx.toFixed(0)}px`)
      pin.style.setProperty('--my', `${my.toFixed(0)}px`)
    }
  }

  // the page-wide smoke: scroll-driven, and it ends black
  const c = cloudRef.value!.getBoundingClientRect()
  const cp = clamp01(-c.top / (c.height - H))
  const wp = smooth(clamp01((cp - 0.12) / 0.7))
  if (c.top < H && c.bottom > -H) cloud?.draw(wp, lean)
  cloudLit.value = wp > 0.55

  // lines of type rise word by word with the scroll; hairlines draw themselves
  for (const { el, words } of reveal) {
    const q = el.getBoundingClientRect()
    if (q.bottom < -50 || q.top > H) continue
    const t = clamp01((H * 0.92 - q.top) / (H * 0.5)) * (1 + 0.14 * words.length)
    words.forEach((w, k) => { const a = smooth(clamp01(t - 0.14 * k)); w.style.transform = `translate3d(0, ${((1 - a) * 108).toFixed(1)}%, 0)` })
  }
  for (const el of lines) {
    const q = el.getBoundingClientRect()
    if (q.top < H && q.bottom > -50) el.style.setProperty('--p', clamp01((H * 0.95 - q.top) / (H * 0.3)).toFixed(3))
  }

  // photograph parallax
  const pr = phRef.value!.getBoundingClientRect()
  if (pr.bottom > 0 && pr.top < H && phImg.value) phImg.value.style.transform = `translate3d(0, ${(((H - pr.top) / (H + pr.height) - 0.5) * -12).toFixed(2)}vh, 0)`

  // the header turns light wherever the page behind it is dark
  const d = (r.top <= 0 && r.bottom > 44 && dk.value) || wp > 0.55
  if (d !== navDark) { navDark = d; document.documentElement.classList.toggle('hx-dark', d) }
}
const reveal: { el: HTMLElement; words: HTMLElement[] }[] = []
let lines: HTMLElement[] = []
// wraps every word of a heading in its own mask, so it can rise on its own as the page scrolls
function splitWords(el: HTMLElement) {
  const words: HTMLElement[] = []
  const nodes = [...el.childNodes]
  el.setAttribute('aria-label', el.textContent ?? '')
  el.textContent = ''
  for (const n of nodes) {
    if (n.nodeName === 'BR') { el.appendChild(n); continue }
    for (const w of (n.textContent ?? '').split(/\s+/).filter(Boolean)) {
      const m = document.createElement('span'), i = document.createElement('i')
      m.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.12em;margin-bottom:-.12em'
      i.style.cssText = 'display:inline-block;font-style:normal;will-change:transform;transform:translate3d(0,108%,0)'
      i.textContent = w; i.setAttribute('aria-hidden', 'true')
      m.appendChild(i); el.appendChild(m); el.appendChild(document.createTextNode(' '))
      words.push(i)
    }
  }
  reveal.push({ el, words })
}
onMounted(() => {
  small = window.matchMedia('(max-width: 800px)').matches
  if (plRef.value) {
    const pl = createSmoke(plRef.value, true, small), v = { p: 1 }
    const lenis = () => (window as any).lenisInstance
    pl.draw(1, 0)
    setTimeout(() => lenis()?.stop(), 0) // the page shell creates its scroller just after this runs
    gsap.to(v, { p: 0, duration: 1.7, delay: 0.35, ease: 'power2.inOut', onUpdate: () => pl.draw(v.p, 0), onComplete: () => { plDone.value = true; lenis()?.start() } })
  }
  document.querySelectorAll<HTMLElement>('[data-words]').forEach(splitWords)
  lines = [...document.querySelectorAll<HTMLElement>('.ty-top, .st li > i')]
  if (smokeRef.value) smoke = createSmoke(smokeRef.value, false, small)
  if (cloudSmokeRef.value) cloud = createSmoke(cloudSmokeRef.value, false, small)
  window.addEventListener('pointermove', onMove, { passive: true })
  gsap.ticker.add(tick)
})
onUnmounted(() => { document.documentElement.classList.remove('hx-dark'); gsap.ticker.remove(tick); window.removeEventListener('pointermove', onMove); gsap.killTweensOf(fall) })
</script>

<style scoped>
.pl { position: fixed; inset: 0; z-index: 9990; width: 100%; height: 100%; pointer-events: none; }
/* ───────── the scene: a dark frame, cut into panels by slanted gaps ───────── */
.hx-pin { --tx: #0d2340; --pn: #d7d8db; --sh: rgba(20, 28, 44, 0.34); --hl: rgba(13, 35, 64, 0.2); --hi: #0d2340; --hi-t: #fff;
  position: sticky; top: 0; height: 100vh; overflow: hidden; background: #0b0c0e; color: var(--tx); transition: color 0.8s ease; }
.hx-pin.dk { --tx: #eef1f6; --pn: #16171b; --sh: rgba(0, 0, 0, 0.8); --hl: rgba(255, 255, 255, 0.18); --hi: #fff; --hi-t: #0d2340; }

.fx { position: absolute; inset: 10px; z-index: 1; border-radius: 26px; overflow: hidden; background: #0b0c0e; }
.fx-sk { position: absolute; top: 0; bottom: 0; left: -15vw; width: 130vw; transform: skewX(var(--sk, -10deg)); }
.pn { position: absolute; overflow: hidden; border-radius: 26px; background: var(--pn); transition: background 0.8s ease; }
.p1 { left: 0; width: var(--w1, 77vw); top: 0; bottom: 0; background: #cfd0d4; }
.p2 { left: calc(var(--w1, 77vw) + 0.7vw); width: calc(var(--st, 105vw) - 1vw - var(--w1, 77vw) - 0.7vw); top: 0; height: calc(var(--sp, 56%) - 5px); }
.p3 { left: calc(var(--w1, 77vw) + 0.7vw); width: calc(var(--st, 105vw) - 1vw - var(--w1, 77vw) - 0.7vw); bottom: 0; height: max(0px, calc(100% - var(--sp, 56%) - 5px)); }
.p4 { left: var(--st, 105vw); width: calc(130vw - var(--st, 105vw)); top: 0; bottom: 0; }

.hx-bg { position: absolute; inset: 0; opacity: 0; transition: opacity 1.2s ease; pointer-events: none; }
.hx-bg.on { opacity: 1; }
.hx-bg.l { z-index: 1; } .hx-bg.d { z-index: 3; }
.hx-smoke { position: absolute; inset: 0; z-index: 2; width: 100%; height: 100%; pointer-events: none; }
/* the light in each room: one soft source low in the panel, falling away to the edges */
.g-et { background: radial-gradient(70% 90% at 32% 112%, #fff 0%, #e6e7ea 40%, #c4c6cb 100%); }
.g-mini { background: radial-gradient(62% 85% at 62% 108%, #fff 0%, #dedfe3 46%, #bcbfc6 100%); }
.g-walk-in { background: radial-gradient(85% 75% at 48% 118%, #fff 0%, #e1e2e6 44%, #b6b9c1 100%); }
.g-ets { background: radial-gradient(58% 82% at 24% 106%, #dadadc 0%, #6c6d72 30%, #18191c 62%, #050506 100%); }
.g-eta { background: radial-gradient(56% 78% at 66% 108%, #d0d1d4 0%, #5e5f64 30%, #151618 62%, #040405 100%); }

.hx-grain { position: absolute; inset: 0; z-index: 5; pointer-events: none; opacity: 0.16; mix-blend-mode: overlay; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }

/* the chamber stands in the main panel */
.hx-stage { position: absolute; inset: 0; z-index: 4; will-change: transform; }
/* a soft light under the cursor; on the near-black gaps it barely shows */
.hx-spot { position: absolute; inset: 0; z-index: 5; pointer-events: none; mix-blend-mode: soft-light; opacity: 0.8; background: radial-gradient(380px circle at calc(var(--mx, 50vw) - 10px) calc(var(--my, 50vh) - 10px), rgba(255, 255, 255, 0.6), transparent 70%); }
.hx-shadow { position: absolute; left: var(--cx, 31vw); bottom: 12vh; width: 36vw; height: 5vh; translate: -50% 50%; border-radius: 50%; background: radial-gradient(closest-side, var(--sh), transparent); filter: blur(10px); }
.hx-img { position: absolute; left: var(--cx, 31vw); bottom: 12vh; height: calc(84vh * var(--s) * var(--k, 1)); max-width: 44vw; object-fit: contain; object-position: bottom center; translate: -50% 0; user-select: none; pointer-events: none; transition: opacity 1s ease, transform 1.3s cubic-bezier(0.16, 0.9, 0.2, 1), filter 1s ease; }
.hx-img.on { opacity: 1; transform: none; filter: drop-shadow(0 30px 40px var(--sh)); -webkit-box-reflect: below 0 linear-gradient(transparent 68%, rgba(255, 255, 255, 0.18)); }
.hx-img.past, .hx-img.next { opacity: 0; transform: translateY(16vh) scale(0.95); filter: blur(12px); }
.hx-hit { position: absolute; left: var(--cx, 31vw); bottom: 12vh; width: 26vw; height: 62vh; translate: -50% 0; border: 0; background: transparent; cursor: pointer; }

.hx-side, .hx-name, .hx-md, .hx-rule, .hx-read, .hx-act { z-index: 6; }

/* main panel: the name at the top, a column of small tools, the readouts at the foot */
.hx-name { position: absolute; left: 2.6vw; top: 13vh; max-width: 17vw; pointer-events: none; }
.hx-name span { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.14em; opacity: 0.55; }
.hx-name h1 { margin: 1.2vh 0 0.8vh; font-weight: 400; font-family: var(--font-display); font-size: clamp(18px, 1.7vw, 30px); line-height: 1.04; letter-spacing: -0.045em; }
.hx-name p { margin: 0; font-family: var(--font-body); font-size: 11px; line-height: 1.55; opacity: 0.66; }

.hx-side { position: absolute; left: 2.6vw; top: 44vh; display: flex; flex-direction: column; gap: 10px; }
.hx-side button, .hx-side a { position: relative; display: flex; align-items: center; padding: 0; height: 34px; border: 0; background: transparent; color: inherit; text-decoration: none; cursor: pointer; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; }
.hx-side i { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%; background: rgba(255, 255, 255, 0.35); border: 1px solid var(--hl); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); transition: background 0.3s ease, color 0.3s ease, transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1); }
.dk .hx-side i { background: rgba(255, 255, 255, 0.06); }
.hx-side i svg { width: 12px; height: 12px; }
.hx-side span { position: absolute; left: 44px; white-space: nowrap; opacity: 0; transform: translateX(-6px); pointer-events: none; transition: opacity 0.3s ease, transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1); }
.hx-side button:hover i, .hx-side a:hover i { background: var(--hi); color: var(--hi-t); transform: scale(1.06); }
.hx-side button:hover span, .hx-side a:hover span { opacity: 1; transform: none; }

.hx-read { position: absolute; left: 2.6vw; bottom: 4.6vh; }
.hx-read dl { margin: 0; display: flex; gap: 2.4vw; }
.hx-read dt { font-family: var(--font-body); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.55; margin-bottom: 6px; }
.hx-read dd { margin: 0; font-family: var(--font-display); font-size: clamp(14px, 1.25vw, 22px); letter-spacing: -0.04em; white-space: nowrap; }
.hx-read dd small { margin-left: 5px; font-family: var(--font-body); font-size: 9px; letter-spacing: 0.06em; opacity: 0.6; }

/* top-right panel: a live example cycle */
.hx-md { position: absolute; right: calc(119vw - var(--st, 105vw)); top: 16vh; width: min(260px, 17.5vw); }
.hx-md header { display: flex; justify-content: space-between; align-items: center; padding: 0 2px 8px; font-family: var(--font-body); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; }
.hx-md header span { display: flex; align-items: center; gap: 8px; opacity: 0.75; }
.hx-md header small { font-size: 8.5px; opacity: 0.4; }
.live { width: 6px; height: 6px; border-radius: 50%; background: #ff6a1a; text-decoration: none; animation: livepulse 1.8s ease-out infinite; }
@keyframes livepulse { 0% { box-shadow: 0 0 0 0 rgba(255, 106, 26, 0.5); } 70% { box-shadow: 0 0 0 7px rgba(255, 106, 26, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 106, 26, 0); } }
.cy-r { display: flex; align-items: baseline; gap: 6px; padding: 2px 2px 12px; }
.cy-r b { min-width: 5.6ch; font-weight: 400; font-family: var(--font-display); font-size: clamp(26px, 2.3vw, 42px); line-height: 1; letter-spacing: -0.055em; font-variant-numeric: tabular-nums; }
.cy-r i { font-style: normal; font-family: var(--font-body); font-size: 11px; opacity: 0.5; }
.cy-r em { margin-left: auto; align-self: center; font-style: normal; font-family: var(--font-body); font-size: 8.5px; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 9px; border: 1px solid var(--hl); border-radius: 20px; white-space: nowrap; }
.cy { display: block; width: 100%; height: 120px; border-top: 1px solid var(--hl); border-bottom: 1px solid var(--hl); }
.hx-md footer { display: flex; justify-content: space-between; padding: 10px 2px 0; font-family: var(--font-body); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.6; }

/* shown only when the right column is one tall panel: the same panel, with more in it */
.hx-ex { position: absolute; z-index: 6; right: calc(119vw - var(--st, 105vw)); top: 50vh; width: min(260px, 17.5vw); opacity: var(--ex, 0); pointer-events: none; }
.hx-ex header { display: flex; justify-content: space-between; align-items: baseline; padding: 0 2px 10px; font-family: var(--font-body); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; }
.hx-ex header span { opacity: 0.6; }
.hx-ex header b { font-weight: 400; font-family: var(--font-display); font-size: 15px; letter-spacing: -0.04em; }
.hx-ex .ch { display: flex; flex-wrap: wrap; gap: 6px; }
.hx-ex .ch a { padding: 5px 10px; border: 1px solid var(--hl); border-radius: 30px; color: inherit; text-decoration: none; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.06em; transition: background 0.3s ease, color 0.3s ease; }
.hx-ex .ch a:hover { background: var(--hi); color: var(--hi-t); }
.hx-ex p { margin: 12px 2px 0; font-family: var(--font-body); font-size: 11px; line-height: 1.55; opacity: 0.7; }

/* right strip: where you are in the range */
.hx-rule { position: absolute; right: 1.7vw; top: 40vh; height: 22vh; margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; }
.hx-rule::before { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 1px; background: currentColor; opacity: 0.3; }
.hx-rule li { position: relative; display: flex; align-items: center; gap: 10px; padding-right: 14px; font-family: var(--font-body); font-size: 9px; letter-spacing: 0.12em; cursor: pointer; opacity: 0.45; transition: opacity 0.3s ease; }
.hx-rule li:hover, .hx-rule li.on { opacity: 1; }
.hx-rule li i { position: absolute; right: 0; top: 50%; width: 8px; height: 1px; background: currentColor; }
.hx-rule u { position: absolute; right: -3px; width: 7px; height: 7px; margin-top: -3px; background: #ff6a1a; clip-path: polygon(0 50%, 100% 0, 100% 100%); transition: top 0.2s linear; pointer-events: none; }

/* bottom-right panel: what to do with this one */
.hx-act { position: absolute; right: 2vw; bottom: 4.6vh; display: flex; align-items: flex-end; }
.hx-menu { position: absolute; right: calc(120vw - var(--st, 105vw)); bottom: 0; width: min(220px, 15vw); display: flex; flex-direction: column; }
.hx-menu button, .hx-menu a { display: block; width: 100%; padding: 13px 2px; border: 0; border-bottom: 1px solid var(--hl); background: transparent; color: inherit; text-align: left; text-decoration: none; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: padding 0.5s cubic-bezier(0.2, 0.9, 0.2, 1), opacity 0.3s ease; }
.hx-menu button:last-child, .hx-menu a:last-child { border-bottom: 0; }
.hx-menu button:hover, .hx-menu a:hover { padding-left: 8px; }
.hx-menu .hi { margin-bottom: 8px; padding: 13px 16px; border: 0; border-radius: 40px; background: var(--hi); color: var(--hi-t); }
.hx-menu .hi:hover { padding-left: 22px; background: #ff6a1a; color: #fff; }
.hx-dial { position: relative; width: 104px; height: 104px; border-radius: 50%; display: grid; place-items: center; align-content: center; }
.hx-dial svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
.d-tr { fill: none; stroke: currentColor; stroke-opacity: 0.16; stroke-width: 1; }
.d-arc { fill: none; stroke: currentColor; stroke-width: 1.4; stroke-dasharray: 327; }
.d-tk line { stroke: currentColor; stroke-opacity: 0.35; stroke-width: 0.8; }
.hx-dial b { position: relative; font-weight: 400; font-family: var(--font-display); font-size: 20px; letter-spacing: -0.04em; line-height: 1; }
.hx-dial small { position: relative; display: block; margin-top: 4px; text-align: center; font-family: var(--font-body); font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.55; }

.roll-enter-active, .roll-leave-active { transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.2, 0.9, 0.2, 1), filter 0.5s ease; }
.roll-enter-from { opacity: 0; transform: translateY(14px); filter: blur(4px); }
.roll-leave-to { opacity: 0; transform: translateY(-10px); filter: blur(4px); }

/* ───────── type: a tight grotesque, big and plain, with a narrow column of text on the right ───────── */
.ty, .nm, .en { font-family: var(--font-display); }
.ty-top { display: grid; grid-template-columns: 8.333vw 1fr auto; gap: 2vw; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.04em; position: relative; padding-top: 14px; }
.ty-top::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 1px; background: currentColor; opacity: 0.4; transform: scaleX(var(--p, 0)); transform-origin: 0 0; }
.ty-top span { opacity: 0.6; }
.ty-top button { padding: 0 0 2px; border: 0; border-bottom: 1px solid currentColor; background: none; color: inherit; font: inherit; opacity: 0.7; cursor: pointer; }

.ty { padding: 24vh 2.2vw 14vh; }
.ty-h { margin: 6vh 0 0; max-width: 16em; font-weight: 400; font-size: clamp(28px, 4.8vw, 92px); line-height: 1.04; letter-spacing: -0.055em; }
.ty-row { display: grid; grid-template-columns: repeat(12, 1fr); gap: 0 1vw; margin-top: 34vh; align-items: start; }
.ty-row h3 { grid-column: 1 / span 6; margin: 0; font-weight: 400; font-size: clamp(22px, 2.5vw, 46px); line-height: 1.06; letter-spacing: -0.05em; }
.ty-body { grid-column: 8 / span 4; display: flex; flex-direction: column; gap: 1.5em; }
.ty-body p { margin: 0; font-family: var(--font-body); font-size: clamp(13px, 1.05vw, 17px); line-height: 1.5; letter-spacing: -0.01em; }

.ph { position: relative; height: 100vh; overflow: hidden; background: #0b0f16; }
.ph img { position: absolute; left: 0; top: -9vh; width: 100%; height: 118vh; object-fit: cover; will-change: transform; }
.ph::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba(0, 0, 0, 0.55)); }
.ph p { position: absolute; left: 2.2vw; bottom: 8vh; z-index: 1; margin: 0; color: #fff; font-family: var(--font-display); font-weight: 400; font-size: clamp(28px, 4.6vw, 88px); line-height: 1.02; letter-spacing: -0.055em; }

/* the smoke, scroll-driven; the statement turns light as the dark reaches it */
.cl { position: relative; height: 240vh; }
.cl-stage { position: sticky; top: 0; height: 100vh; overflow: hidden; }
.cl-smoke { position: absolute; inset: 0; width: 100%; height: 100%; }
.cl-h { position: absolute; left: 0; right: 0; top: 50%; translate: 0 -50%; margin: 0; text-align: center; font-family: var(--font-display); font-weight: 400; font-size: clamp(32px, 6vw, 112px); line-height: 1.02; letter-spacing: -0.055em; color: #0d2340; transition: color 0.5s ease; }
.cl-h.lit { color: #eef3fa; }

/* ───────── the dark page ───────── */
.dkp { position: relative; background: #000; color: #eef3fa; }

.st { padding: 26vh 2.2vw 8vh; }
.st ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 3vw; }
.st li { display: flex; flex-direction: column; gap: 22px; }
.st-n { font-family: var(--font-display); font-size: clamp(40px, 5.4vw, 100px); line-height: 0.95; letter-spacing: -0.06em; }
.st li > i { position: relative; display: block; height: 1px; }
.st li > i::before { content: ''; position: absolute; inset: 0; background: rgba(255, 255, 255, 0.3); transform: scaleX(var(--p, 0)); transform-origin: 0 0; }
.st li > i u { position: absolute; left: 0; top: -3px; width: 7px; height: 7px; border-radius: 50%; background: #ff6a1a; }
.st h3 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(17px, 1.7vw, 30px); letter-spacing: -0.05em; line-height: 1.08; }
.st p { margin: 0; max-width: 24em; font-family: var(--font-body); font-size: 13px; line-height: 1.6; opacity: 0.65; }

.nm { padding: 6vh 2.2vw 30vh; }
.nm ul { list-style: none; margin: 6vh 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.4vw; }
.nm li { display: flex; flex-direction: column; gap: 16px; }
.nm li b { font-weight: 400; font-size: clamp(28px, 4.2vw, 80px); line-height: 0.95; letter-spacing: -0.06em; white-space: nowrap; }
.nm li span { font-family: var(--font-body); font-size: 11px; letter-spacing: 0.04em; opacity: 0.55; }
.nm-two { display: grid; grid-template-columns: 1fr 1fr; margin-top: 10vh; border-top: 1px solid rgba(255, 255, 255, 0.25); border-bottom: 1px solid rgba(255, 255, 255, 0.25); }
.nm-two > div { display: grid; grid-template-columns: 9vw 1fr; gap: 0 2vw; padding: 6vh 2vw 8vh 0; }
.nm-two > div + div { padding-left: 2vw; border-left: 1px solid rgba(255, 255, 255, 0.25); }
.nm-two span { font-family: var(--font-body); font-size: 11px; letter-spacing: 0.04em; opacity: 0.55; }
.nm-two p { margin: 0; font-size: clamp(15px, 1.5vw, 26px); line-height: 1.14; letter-spacing: -0.05em; }

/* the bento: dark glass over deep blue light */
.bt { position: relative; padding: 4vh 2.2vw 30vh; overflow: hidden; }
.bt-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
.bt-orb.a { left: -6vw; top: 14%; width: 36vw; height: 36vw; background: rgba(40, 90, 170, 0.4); }
.bt-orb.b { right: -8vw; top: 52%; width: 34vw; height: 34vw; background: rgba(20, 70, 120, 0.4); }
.bt .ty-top { position: relative; margin-bottom: 5vh; }
.bt-frame { position: relative; border-radius: 26px; overflow: hidden; background: #0b0c0e; }
.bt-grid { display: grid; grid-template-columns: repeat(12, 1fr); grid-auto-rows: clamp(200px, 17vw, 320px); grid-auto-flow: dense; gap: 10px; }
.bt-tile { position: relative; padding: 0; border: 0; border-radius: 26px; overflow: hidden; background: linear-gradient(160deg, #1b1c21, #101114); color: inherit; text-align: left; cursor: pointer; transform: skewX(-10deg); transition: background 0.5s ease, color 0.5s ease, transform 0.7s cubic-bezier(0.2, 0.9, 0.2, 1); }
.bt-tile:hover { background: #d7d8db; color: #0d2340; transform: skewX(-10deg) translateY(-3px); }
.bt-tile.s0 { grid-column: span 6; grid-row: span 2; }
.bt-tile.s1, .bt-tile.s2, .bt-tile.s3, .bt-tile.s4 { grid-column: span 3; }
.bt-tile.s5, .bt-tile.s6, .bt-tile.s7 { grid-column: span 4; }
.bt-un { position: absolute; inset: 0; transform: skewX(10deg); }
.bt-in { position: absolute; inset: 0; display: flex; flex-direction: column; padding: 16px clamp(26px, 2.6vw, 44px); }
.bt-img { position: relative; flex: 1; min-height: 0; }
.bt-glow { position: absolute; left: 50%; top: 56%; width: 80%; height: 80%; translate: -50% -50%; background: radial-gradient(closest-side, rgba(190, 215, 245, 0.2), transparent); pointer-events: none; transition: opacity 0.5s ease; }
.bt-tile:hover .bt-glow { opacity: 0; }
.bt-img img { position: absolute; inset: 0; width: 100%; height: 100%; padding: 4% 6% 2%; box-sizing: border-box; object-fit: contain; filter: drop-shadow(0 18px 20px rgba(0, 0, 0, 0.55)); transition: transform 0.9s cubic-bezier(0.2, 0.9, 0.2, 1), filter 0.5s ease; }
.bt-tile:hover .bt-img img { transform: translateY(-4px) scale(1.03); filter: drop-shadow(0 18px 20px rgba(20, 28, 44, 0.3)); }
.bt-img.photo img { padding: 0; object-fit: cover; border-radius: 12px; filter: none; }
.bt-img.photo .bt-glow { display: none; }
.bt-tx { position: relative; display: flex; flex-direction: column; gap: 4px; padding: 8px 0 4px; }
.bt-tx b { font-weight: 400; font-family: var(--font-display); font-size: clamp(12px, 1vw, 17px); letter-spacing: -0.035em; line-height: 1.15; }
.bt-tile.s0 .bt-tx b { font-size: clamp(16px, 1.5vw, 26px); }
.bt-tx small { font-family: var(--font-body); font-size: 8.5px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.5; }
.bt-plus { position: absolute; right: clamp(28px, 2.8vw, 46px); top: 16px; width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; border: 1px solid rgba(128, 128, 140, 0.4); transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1), background 0.3s ease, color 0.3s ease, border-color 0.3s ease; }
.bt-plus svg { width: 9px; height: 9px; }
.bt-tile:hover .bt-plus { transform: rotate(90deg); background: #0d2340; color: #fff; border-color: #0d2340; }

.en { padding: 10vh 2.2vw 30vh; }
.en .ty-h { margin-top: 8vh; max-width: 14em; }
.en-cta { display: flex; align-items: center; gap: 28px; margin-top: 8vh; }
.en-cta a { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: inherit; text-decoration: none; opacity: 0.65; border-bottom: 1px solid currentColor; padding-bottom: 3px; transition: opacity 0.3s ease; }
.en-cta a:hover { opacity: 1; }

@media (max-width: 1000px) {
  .fx-sk { left: 0; width: 100%; transform: none; } .p1 { width: 100%; } .p2, .p3, .p4 { display: none; }
  .hx-img, .hx-hit, .hx-shadow { left: 50%; } .hx-img { max-width: 86vw; }
  .hx-md { display: none; } .hx-menu { right: 0; } .hx-act { right: 4vw; }
  .hx-name, .hx-rule { display: none; }
  .hx-read dl { flex-wrap: wrap; gap: 14px 20px; max-width: 50vw; }
  .ty-row h3, .ty-body { grid-column: 1 / -1; } .ty-body { margin-top: 6vh; }
  .st ol { grid-template-columns: 1fr; } .nm ul { grid-template-columns: 1fr 1fr; }
  .nm-two { grid-template-columns: 1fr; } .nm-two > div + div { border-left: 0; padding-left: 0; border-top: 1px solid rgba(255, 255, 255, 0.25); }
  .bt-tile, .bt-tile:hover { transform: none; } .bt-un { transform: none; } .bt-grid { margin: 0; }
  .bt-tile.s0 { grid-column: span 12; } .bt-tile.s1, .bt-tile.s2, .bt-tile.s3, .bt-tile.s4, .bt-tile.s5, .bt-tile.s6, .bt-tile.s7 { grid-column: span 6; }
}
@media (max-width: 640px) { .hx-act .hx-dial { display: none; } .hx-menu { width: 180px; } }

/* ───────── phones: one stage, a bottom panel, no heavy effects ───────── */
@media (max-width: 800px) {
  .hx-pin { height: 100svh; }
  .fx { inset: 8px; border-radius: 22px; }
  .fx-sk { left: 0; width: 100%; transform: none; }
  .pn { border-radius: 22px; }
  .p1 { left: 0; width: 100%; top: 0; bottom: auto; height: calc(62% - 4px); clip-path: polygon(0 0, 100% 0, 100% 93%, 0 100%); }
  .p2, .p4 { display: none; }
  .p3 { display: block; left: 0; width: 100%; top: calc(62% + 4px); bottom: 0; height: auto; }
  .hx-grain, .hx-spot, .hx-side, .hx-md, .hx-ex, .hx-dial, .hx-shadow { display: none; }
  .hx-stage { transform: none !important; }
  .hx-img, .hx-hit { left: 50%; }
  .hx-img { bottom: calc(38svh + 5svh); height: calc(42svh * var(--s)); max-width: 78vw; }
  .hx-img.on { -webkit-box-reflect: none; filter: drop-shadow(0 18px 22px var(--sh)); }
  .hx-hit { bottom: calc(38svh + 5svh); width: 60vw; height: 34svh; }
  .hx-name { display: block; left: 6vw; top: 13svh; max-width: 62vw; }
  .hx-name h1 { font-size: clamp(18px, 6vw, 26px); }
  .hx-rule { display: flex; flex-direction: row; justify-content: space-between; align-items: center; left: 6vw; right: 6vw; top: calc(62svh + 16px); height: auto; }
  .hx-rule::before, .hx-rule li i, .hx-rule u { display: none; }
  .hx-rule li { padding: 6px 0; font-size: 10px; border-bottom: 1px solid transparent; }
  .hx-rule li.on { border-bottom-color: currentColor; }
  .hx-read { left: 6vw; right: 6vw; top: calc(62svh + 50px); bottom: auto; }
  .hx-read dl { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 14px; }
  .hx-read dd { font-size: 12.5px; white-space: nowrap; }
  .hx-act { left: 6vw; right: 6vw; bottom: 3svh; display: block; }
  .hx-menu { position: static; width: 100%; flex-direction: row; flex-wrap: wrap; gap: 4px 18px; }
  .hx-menu .hi { flex: 1 1 100%; margin: 0 0 4px; }
  .hx-menu button, .hx-menu a { width: auto; padding: 8px 0; border: 0; font-size: 9px; }
  .hx-menu button:hover, .hx-menu a:hover { padding-left: 0; }
  .hx-bg { transition-duration: 0.6s; }

  .ph { height: 80vh; } .ph img { top: 0; height: 100%; }
  .cl { height: 170vh; }
  .ty { padding: 18vh 5vw 10vh; } .ty-row { margin-top: 18vh; }
  .ty-top { grid-template-columns: 14vw 1fr auto; }
  .st { padding: 18vh 5vw 6vh; } .nm { padding: 6vh 5vw 18vh; }
  .bt { padding: 4vh 4vw 18vh; } .bt-grid { grid-auto-rows: 190px; } .bt-in { padding: 12px 14px; } .bt-plus { right: 14px; top: 12px; }
  .en { padding: 8vh 5vw 18vh; }
}
</style>
