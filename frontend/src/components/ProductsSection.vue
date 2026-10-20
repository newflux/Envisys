<template>
  <!-- The reveal. The stage is held while the range passes by one chamber at a time: each arrives from the
       right on its own oversized name, which slides the other way, so the two never travel together. -->
  <section class="pr-root" ref="rootRef">
    <div class="pr-stage" ref="stageRef">
      <header class="pr-head"><span>Our range</span><span>{{ String(Math.round(t) + 1).padStart(2, '0') }} / 0{{ products.length }}</span></header>

      <div class="pr-words" aria-hidden="true">
        <div v-for="(p, i) in products" :key="p.name" class="pr-word" :ref="(el) => (wordEls[i] = el as HTMLElement)">{{ p.name }}</div>
      </div>

      <a v-for="(p, i) in products" :key="p.name" class="pr-prod" :href="p.href" data-cursor="VIEW" :ref="(el) => (prodEls[i] = el as HTMLElement)" :tabindex="Math.round(t) === i ? 0 : -1">
        <img :src="p.img" :alt="p.name" draggable="false" />
        <span class="pr-shadow"></span>
      </a>

      <div class="pr-meta">
        <div class="pr-spec" v-for="(p, i) in products" :key="p.name" :class="{ on: Math.round(t) === i }">
          <b>{{ p.tag }}</b>
          <a :href="p.href" data-cursor="VIEW">Explore <span>↗</span></a>
        </div>
      </div>

      <nav class="pr-nav">
        <button v-for="(p, i) in products" :key="p.name" v-magnetic="0.18" :class="{ on: Math.round(t) === i }" @click="go(i)">
          <i :style="{ transform: `scaleX(${fill(i)})` }"></i>
          <span>0{{ i + 1 }}</span>{{ p.short }}
        </button>
        <a class="pr-all" href="/products" data-cursor="ALL">All products ↗</a>
      </nav>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { scrollColumnTo } from '../utils/columnScroll'
import { vMagnetic } from '../utils/magnetic'

// Five of the range; the rest live on the products page. Images are cut-outs from envisystech.com (placeholders for now).
const products = [
  { name: 'Environmental', short: 'Environmental', tag: '−70 to +180°C · 10–95% RH', img: '/products/env.png', href: '/environmental-test-chambers' },
  { name: 'Thermal Shock', short: 'Thermal Shock', tag: 'Rapid temperature transitions', img: '/products/thermal.png', href: '/thermal-shock-chambers' },
  { name: 'Altitude', short: 'Altitude', tag: 'Down to 1 mbar', img: '/products/altitude.png', href: '/altitude-test-chambers' },
  { name: 'Salt Spray', short: 'Salt Spray', tag: 'Corrosion testing', img: '/products/salt.png', href: '/salt-spray-chambers' },
  { name: 'Walk-in', short: 'Walk-in', tag: 'Large-format chambers', img: '/products/walkin.png', href: '/environmental-walkin-chambers' }
]
const N = products.length

const rootRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const wordEls: HTMLElement[] = []
const prodEls: HTMLElement[] = []
const t = ref(0) // continuous index, with holds on each product
const frac = ref(0)

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number) => a * a * (3 - 2 * a)
const fill = (i: number) => clamp01(1 - Math.abs(t.value - i))

// Fit every name to 92vw (capped), once fonts are in
function fit() {
  const vw = window.innerWidth
  wordEls.forEach((w) => {
    if (!w) return
    w.style.fontSize = '100px'
    const k = (vw * 0.9) / w.scrollWidth
    w.style.fontSize = `${Math.min(100 * k, vw * 0.17).toFixed(1)}px`
  })
}

// pointer parallax (smoothed): chamber leans with the cursor, the name drifts against it
let px = 0, py = 0, tx = 0, ty = 0
const onMove = (e: PointerEvent) => {
  tx = (e.clientX / window.innerWidth - 0.5) * 2
  ty = (e.clientY / window.innerHeight - 0.5) * 2
}

function tick() {
  const root = rootRef.value, stage = stageRef.value
  if (!root || !stage) return
  const H = window.innerHeight, W = window.innerWidth
  const r = root.getBoundingClientRect()
  if (r.bottom < -80 || r.top > H + 80) return
  const travel = r.height - H
  stage.style.transform = `translate3d(0, ${Math.min(Math.max(-r.top, 0), travel).toFixed(1)}px, 0)`
  const p = clamp01(-r.top / travel)

  // each product holds for most of its slice, then hands over
  const raw = p * (N - 1)
  const base = Math.min(N - 2, Math.floor(raw))
  const f = raw - base
  const tt = base + smooth(clamp01((f - 0.28) / 0.44))
  t.value = tt
  frac.value = f

  px += (tx - px) * 0.07
  py += (ty - py) * 0.07
  for (let i = 0; i < N; i++) {
    const d = i - tt
    const ad = Math.abs(d)
    const w = wordEls[i], pr = prodEls[i]
    if (!w || !pr) continue
    if (ad > 1.4) { w.style.visibility = pr.style.visibility = 'hidden'; continue }
    w.style.visibility = pr.style.visibility = 'visible'
    const a = clamp01(1 - ad * 1.15)
    // name travels against the chamber, slower, so the two slide through each other
    w.style.transform = `translate3d(${(-d * W * 0.55 - px * 14).toFixed(1)}px, ${(-py * 8).toFixed(1)}px, 0)`
    w.style.opacity = a.toFixed(3)
    pr.style.transform = `translate3d(${(d * W * 0.62 + px * 20).toFixed(1)}px, ${(py * 10).toFixed(1)}px, 0) scale(${(1 - 0.14 * ad).toFixed(3)}) rotateY(${(px * -4).toFixed(2)}deg)`
    pr.style.opacity = a.toFixed(3)
    pr.style.pointerEvents = ad < 0.4 ? 'auto' : 'none'
  }
}

function go(i: number) {
  const root = rootRef.value
  if (!root) return
  const travel = root.getBoundingClientRect().height - window.innerHeight
  scrollColumnTo(root, -travel * (i / (N - 1)))
}

onMounted(() => {
  fit()
  document.fonts?.ready.then(fit)
  window.addEventListener('resize', fit)
  window.addEventListener('pointermove', onMove, { passive: true })
  gsap.ticker.add(tick)
})
onUnmounted(() => {
  window.removeEventListener('resize', fit)
  window.removeEventListener('pointermove', onMove)
  gsap.ticker.remove(tick)
})
</script>

<style scoped>
.pr-root { position: relative; height: 300vh; color: #0d2340; }
.pr-stage { position: absolute; left: 0; right: 0; top: 0; height: 100vh; overflow: hidden; will-change: transform; perspective: 1400px; }

.pr-head { position: absolute; left: 5vw; right: 5vw; top: 13vh; display: flex; justify-content: space-between; font-family: var(--font-body); font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.55; }

.pr-words { position: absolute; inset: 0; }
.pr-word {
  position: absolute;
  left: 0;
  width: 100%;
  top: 17vh;
  text-align: center;
  white-space: nowrap;
  font-family: var(--font-display);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.055em;
  color: #0d2340;
  will-change: transform, opacity;
}

/* The chamber stands in front of its name, low enough that the name stays readable above it */
.pr-prod { position: absolute; left: 50%; bottom: 15vh; width: min(40vw, 760px); height: 60vh; margin-left: calc(min(40vw, 760px) / -2); display: block; will-change: transform, opacity; }
.pr-prod img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; object-position: 50% 100%; filter: drop-shadow(0 30px 40px rgba(13, 35, 64, 0.22)); user-select: none; }
.pr-shadow { position: absolute; left: 12%; right: 12%; bottom: -1.2vh; height: 2.4vh; border-radius: 50%; background: radial-gradient(ellipse at center, rgba(13, 35, 64, 0.28), transparent 70%); filter: blur(6px); }

.pr-meta { position: absolute; left: 5vw; right: 5vw; bottom: 13.5vh; height: 24px; }
.pr-spec { position: absolute; inset: 0; display: flex; justify-content: space-between; align-items: center; opacity: 0; transform: translateY(8px); transition: opacity 0.45s ease, transform 0.6s cubic-bezier(0.2, 0.9, 0.2, 1); pointer-events: none; }
.pr-spec.on { opacity: 1; transform: none; pointer-events: auto; }
.pr-spec b { font-weight: 400; font-family: var(--font-body); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; }
.pr-spec a { color: inherit; text-decoration: none; font-family: var(--font-body); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; }

.pr-nav { position: absolute; left: 5vw; right: 5vw; bottom: 5vh; display: flex; align-items: flex-end; gap: 2.2vw; border-top: 1px solid rgba(13, 35, 64, 0.16); }
.pr-nav button { position: relative; flex: none; background: none; border: 0; padding: 18px 0 0; margin: 0; color: inherit; font-family: var(--font-body); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.4; transition: opacity 0.3s ease; text-align: left; }
.pr-nav button:hover { opacity: 0.75; }
.pr-nav button.on { opacity: 1; }
.pr-nav button span { margin-right: 10px; opacity: 0.55; }
.pr-nav button i { position: absolute; left: 0; right: 0; top: -1px; height: 2px; background: #0d2340; transform-origin: left; transform: scaleX(0); }
.pr-all { margin-left: auto; padding-top: 18px; color: inherit; text-decoration: none; font-family: var(--font-body); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.6; transition: opacity 0.3s ease; }
.pr-all:hover { opacity: 1; }

@media (max-width: 900px) {
  .pr-prod { width: 70vw; margin-left: -35vw; height: 40vh; bottom: 24vh; }
  .pr-nav { gap: 14px; overflow-x: auto; }
}
</style>
