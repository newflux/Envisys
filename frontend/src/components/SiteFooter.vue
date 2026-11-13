<template>
  <!-- Footer (70% of the screen), held in place while the cover lifts off it (see tick).
       The idea is the test itself: the cursor is a probe. Isotherm lines warm and lift around it, the hairline
       wordmark heats where it passes, and the readout maps its position onto the real range, −70 to +180°C.
       Contact details are from envisystech.com/contact-us; page links are placeholders. -->
  <footer class="fn-foot" data-footer ref="footRef" @pointermove="onProbe" @pointerleave="probeOff">
    <canvas class="fn-lines" ref="linesRef" aria-hidden="true"></canvas>

    <div class="fn-ftop">
      <div class="fn-flead">
        <span class="fn-eyebrow">Envisys Technologies · Bengaluru</span>
        <h2 class="fn-say"><span><i>Test without limits.</i></span></h2>
        <button class="fn-pill" v-magnetic="0.2" data-cursor="BUILD" @click="$emit('build')">
          <span>Build w/ Envisys</span>
          <svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg>
        </button>
      </div>
      <nav class="fn-cols">
        <div v-for="(c, i) in cols" :key="c.h" class="fn-fcol" :style="{ '--i': i }">
          <b>{{ c.h }}</b>
          <template v-for="l in c.links" :key="l.t">
            <button v-if="l.build" class="fn-a" @click="$emit('build')">{{ l.t }}</button>
            <a v-else-if="l.href" class="fn-a" :href="l.href" :target="l.href.startsWith('http') ? '_blank' : undefined" rel="noopener">{{ l.t }}</a>
            <span v-else>{{ l.t }}</span>
          </template>
        </div>
      </nav>
    </div>

    <div class="fn-mark" ref="markRef" aria-label="Envisys">
      <span class="fn-mark-line" aria-hidden="true">ENVISYS</span>
      <span class="fn-mark-heat" aria-hidden="true">ENVISYS</span>
    </div>

    <div class="fn-base">
      <span>&copy; 2026 Envisys Technologies &middot; ISO 9001 &middot; 14001 &middot; 45001 &middot; CE</span>
      <span class="fn-probe" :class="{ on: probe !== null }">Probe <b :style="{ color: probeColor }">{{ probeText }}</b></span>
      <div class="fn-base-r">
        <a class="fn-a" href="/terms">Terms</a>
        <a class="fn-a" href="/privacy">Privacy</a>
        <span class="fn-social">
          <a v-for="sc in socials" :key="sc.n" :href="sc.href" target="_blank" rel="noopener" :aria-label="sc.n">
            <svg viewBox="0 0 24 24" v-html="sc.icon"></svg>
          </a>
        </span>
        <button class="fn-a" @click="toTop">Top &uarr;</button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { vMagnetic } from '../utils/magnetic'
import { VISTARA_URL } from '../config/verticals'
import { scrollToTop } from '../utils/scrollTop'

defineEmits<{ (e: 'build'): void }>()

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number) => a * a * (3 - 2 * a)
const footRef = ref<HTMLElement | null>(null)
let lastShift = NaN
// Shutter: whatever sits above the footer slides up over it while it holds still at its final place on screen.
// Its laid-out top (without the shift) runs from the bottom of the screen up to H - height.
function tick() {
  // shutter: while the cover is passing, pull the footer up so it sits still at its final place on screen.
  // Its laid-out top (without the shift) runs from the bottom of the screen up to H - height.
  const foot = footRef.value
  if (foot) {
    const H = window.innerHeight
    const top = foot.getBoundingClientRect().top - (Number.isNaN(lastShift) ? 0 : lastShift)
    const shift = Math.min(0, Math.max(-foot.offsetHeight, H - foot.offsetHeight - top))
    if (shift !== lastShift) {
      lastShift = shift
      foot.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`
      // as the cover lifts: the wordmark rises out of its baseline, the columns follow one by one
      foot.style.setProperty('--rp', smooth(clamp01(1 + shift / foot.offsetHeight)).toFixed(4))
    }
    const fr = foot.getBoundingClientRect()
    if (fr.top < H && fr.bottom > 0) drawLines(performance.now() / 1000, foot)
  }
}

// Footer content. Phone, email and address are from envisystech.com/contact-us; page links are placeholders.
const cols: { h: string; links: { t: string; href?: string; build?: boolean }[] }[] = [
  { h: 'Products', links: [{ t: 'Environmental', href: '/environmental-test-chambers' }, { t: 'Thermal shock', href: '/thermal-shock-chambers' }, { t: 'Altitude', href: '/altitude-test-chambers' }, { t: 'Salt spray', href: '/salt-spray-chambers' }, { t: 'Walk-in', href: '/environmental-walkin-chambers' }] },
  { h: 'Services', links: [{ t: 'Testing lab', href: VISTARA_URL || '/verticals/testing' }, { t: 'Rentals', href: '/verticals/rentals' }, { t: 'After-sales', href: '/verticals/aftersales' }, { t: 'Express factory', href: '/verticals/express' }] },
  { h: 'Company', links: [{ t: 'About', href: '/about' }, { t: 'Industries', href: '/industries' }, { t: 'Careers', href: 'mailto:hrd@envisystech.com' }, { t: 'Contact', build: true }] },
  { h: 'Reach us', links: [{ t: '+91 99000 14150', href: 'tel:+919900014150' }, { t: '+91 80283 77888 (office)', href: 'tel:+918028377888' }, { t: 'WhatsApp us', href: 'https://wa.me/919900014150' }, { t: 'enquiry@envisystech.com', href: 'mailto:enquiry@envisystech.com' }, { t: 'Peenya, Bengaluru 560058' }] }
]
const socials = [
  { n: 'LinkedIn', href: 'https://www.linkedin.com/company/envisystech/', icon: '<path d="M4 9h4v11H4zM6 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h3.8v1.6c.6-1 1.9-1.9 3.8-1.9 4 0 4.4 2.6 4.4 6V20h-4v-4.8c0-1.4 0-3.1-1.9-3.1s-2.1 1.5-2.1 3V20h-4z"/>' },
  { n: 'YouTube', href: 'https://www.youtube.com/@EnvisysTechnologies', icon: '<path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8zM10 15.1V8.9l5.2 3.1z"/>' },
  { n: 'Instagram', href: 'https://www.instagram.com/envisys_tech/', icon: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.3" cy="6.7" r="1.2"/>' },
  { n: 'X', href: 'https://twitter.com/Envisys_Tech', icon: '<path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L1.9 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.3 4.7H5.5z"/>' }
]
// The probe: cursor position in the footer → temperature across the real range, and the heat spot for lines + wordmark
const markRef = ref<HTMLElement | null>(null)
const probe = ref<number | null>(null)
let hx = -9999, hy = -9999, hxT = -9999, hyT = -9999, heat = 0, heatT = 0
function onProbe(e: PointerEvent) {
  const b = footRef.value!.getBoundingClientRect()
  hxT = e.clientX - b.left
  hyT = e.clientY - b.top
  if (hx < -9000) { hx = hxT; hy = hyT }
  heatT = 1
  probe.value = -70 + 250 * clamp01(hxT / b.width)
}
function probeOff() { heatT = 0; probe.value = null }
const probeText = computed(() => (probe.value === null ? '—' : `${probe.value >= 0 ? '+' : '−'}${Math.abs(probe.value).toFixed(1)}°C`))
// the same cold → hot ramp as the wordmark's fill
const probeColor = computed(() => {
  if (probe.value === null) return ''
  const k = (probe.value + 70) / 250
  const c = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t))
  const rgb = k < 0.5 ? c([127, 178, 232], [214, 226, 238], k / 0.5) : c([214, 226, 238], [255, 106, 26], (k - 0.5) / 0.5)
  return `rgb(${rgb.join(',')})`
})

// Isotherms: horizontal contour lines that breathe slowly; around the probe they lift (heat rises) and warm in colour
const linesRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
function drawLines(time: number, foot: HTMLElement) {
  const c = linesRef.value
  if (!c) return
  const W = foot.clientWidth, Hh = foot.clientHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  if (!ctx || c.width !== Math.round(W * dpr) || c.height !== Math.round(Hh * dpr)) {
    c.width = Math.round(W * dpr)
    c.height = Math.round(Hh * dpr)
    ctx = c.getContext('2d')
  }
  if (!ctx) return
  hx += (hxT - hx) * 0.08
  hy += (hyT - hy) * 0.08
  heat += (heatT - heat) * 0.05
  const t = time * 0.18, R = Math.min(320, W * 0.22)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, W, Hh)
  // one gradient for every line: ember at the probe, cooling to ice blue at its edge
  const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, R * 1.6)
  g.addColorStop(0, `rgba(255, 128, 60, ${(0.12 + 0.5 * heat).toFixed(3)})`)
  g.addColorStop(0.45, `rgba(214, 170, 150, ${(0.1 + 0.18 * heat).toFixed(3)})`)
  g.addColorStop(1, 'rgba(140, 180, 228, 0.12)')
  ctx.strokeStyle = g
  ctx.lineWidth = 1
  const N = 30, STEPS = 90
  for (let i = 0; i < N; i++) {
    const k = i / (N - 1)
    const base = Hh * (0.06 + k * 0.98)
    ctx.beginPath()
    for (let j = 0; j <= STEPS; j++) {
      const x = (j / STEPS) * W
      let y = base + Math.sin(x * 0.004 + k * 5.1 + t) * 7 + Math.sin(x * 0.0017 - k * 3.3 - t * 0.6) * 11
      const dx = x - hx, dy = base - hy
      y -= Math.exp(-(dx * dx + dy * dy) / (2 * R * R * 0.35)) * 38 * heat
      if (j) ctx.lineTo(x, y)
      else ctx.moveTo(x, y)
    }
    ctx.stroke()
  }
  // the wordmark's heat spot follows the same eased point
  const m = markRef.value
  if (m) {
    m.style.setProperty('--hx', `${(hx - m.offsetLeft).toFixed(1)}px`)
    m.style.setProperty('--hy', `${(hy - m.offsetTop).toFixed(1)}px`)
    m.style.setProperty('--hr', `${(R * 1.1 * heat).toFixed(1)}px`)
  }
}

function toTop() {
  scrollToTop()
}


onMounted(() => gsap.ticker.add(tick))
onUnmounted(() => gsap.ticker.remove(tick))
</script>

<style scoped>
.fn-pill { margin-top: 6vh; position: relative; overflow: hidden; isolation: isolate; display: inline-flex; align-items: center; gap: 18px; padding: 24px 40px; border: 0; border-radius: 40px; background: #fff; color: #0b1b33; font-family: var(--font-body); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; pointer-events: auto; will-change: transform; }
.fn-pill::before { content: ''; position: absolute; inset: 0; z-index: -1; background: #cfe3f6; transform: translateY(101%); transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1); }
.fn-pill:hover::before { transform: none; }
.fn-pill svg { width: 12px; height: 12px; transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1); }
.fn-pill:hover svg { transform: translate(3px, -3px); }

/* 4 · footer */
.fn-foot { --rp: 0; position: relative; z-index: 1; overflow: hidden; box-sizing: border-box; height: 70vh; min-height: 520px; will-change: transform; padding: 7vh 4vw 2.4vh 2vw; display: flex; flex-direction: column; color: #e9eef5; background: radial-gradient(ellipse 70% 80% at 50% 120%, #0c1a33 0%, #060a12 55%, #030406 100%); }
.fn-foot a, .fn-foot button { pointer-events: auto; }
.fn-foot { pointer-events: auto; }
.fn-lines { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }

.fn-ftop { position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: flex-start; gap: 4vw; }
.fn-eyebrow { display: block; margin-bottom: 2.4vh; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(233, 238, 245, 0.45); opacity: var(--rp); }
/* each line of the statement slides up out of its own mask as the cover lifts */
.fn-say { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(24px, 2.5vw, 44px); line-height: 1; letter-spacing: -0.05em; color: #fff; }
.fn-say span { display: block; overflow: hidden; padding-bottom: 0.06em; }
.fn-say i { display: block; font-style: normal; transform: translateY(calc((1 - var(--rp)) * 105%)); }
.fn-flead { display: flex; flex-wrap: wrap; align-items: flex-end; column-gap: 2.4vw; row-gap: 2vh; }
.fn-flead .fn-eyebrow { flex-basis: 100%; }
.fn-flead .fn-pill { margin: 0; padding: 14px 26px; opacity: var(--rp); }

.fn-cols { display: grid; grid-template-columns: repeat(4, auto); gap: 2.4vw; white-space: nowrap; padding-top: 4px; }
.fn-fcol { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; opacity: clamp(0, calc(var(--rp) * 3 - 1.4 - var(--i, 0) * 0.3), 1); transform: translateY(calc((1 - var(--rp)) * 14px)); }
.fn-fcol b { font-weight: 400; color: rgba(233, 238, 245, 0.42); margin-bottom: 6px; }
.fn-fcol span { color: rgba(233, 238, 245, 0.75); }
.fn-a { position: relative; padding: 0; border: 0; background: none; color: rgba(233, 238, 245, 0.85); font: inherit; letter-spacing: inherit; text-transform: inherit; text-decoration: none; cursor: pointer; transition: color 0.3s ease; }
.fn-a::after { content: ''; position: absolute; left: 0; right: 0; bottom: -2px; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform 0.45s cubic-bezier(0.2, 0.9, 0.2, 1); }
.fn-a:hover { color: #fff; }
.fn-a:hover::after { transform: scaleX(1); transform-origin: left; }

/* wordmark: a hairline outline across the full width, filled with the cold → hot ramp only where the probe is */
.fn-mark { position: relative; z-index: 1; margin: auto -0.5vw 0; padding-top: 4vh; font-family: var(--font-display); font-size: min(17.2vw, 38vh); line-height: 0.74; letter-spacing: -0.03em; white-space: nowrap; user-select: none; transform: translateY(calc((1 - var(--rp)) * 50%)); }
.fn-mark span { display: block; }
.fn-mark-line { color: transparent; -webkit-text-stroke: 1px rgba(214, 226, 238, 0.32); }
.fn-mark-heat { position: absolute; inset: 0; color: transparent; background: linear-gradient(90deg, #7fb2e8 0%, #d6e2ee 50%, #ff6a1a 100%); -webkit-background-clip: text; background-clip: text;
  -webkit-mask-image: radial-gradient(circle var(--hr, 0px) at var(--hx, -999px) var(--hy, -999px), #000 0%, rgba(0, 0, 0, 0.6) 45%, transparent 100%);
  mask-image: radial-gradient(circle var(--hr, 0px) at var(--hx, -999px) var(--hy, -999px), #000 0%, rgba(0, 0, 0, 0.6) 45%, transparent 100%); }

.fn-base { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 2vw; margin-top: 2.2vh; padding-top: 1.6vh; border-top: 1px solid rgba(255, 255, 255, 0.1); font-family: var(--font-body); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(233, 238, 245, 0.45); }
.fn-probe { min-width: 15ch; text-align: center; transition: color 0.4s ease; }
.fn-probe b { display: inline-block; min-width: 9ch; font-weight: 400; color: rgba(233, 238, 245, 0.5); transition: color 0.2s linear; }
.fn-probe.on { color: rgba(233, 238, 245, 0.7); }
.fn-base-r { display: flex; justify-content: flex-end; align-items: center; gap: 22px; }
.fn-base-r .fn-a { color: rgba(233, 238, 245, 0.6); }
.fn-social { display: inline-flex; gap: 14px; }
.fn-social a { display: block; width: 14px; height: 14px; color: rgba(233, 238, 245, 0.6); transition: color 0.3s ease, transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1); }
.fn-social a:hover { color: #fff; transform: translateY(-2px); }
.fn-social svg { width: 100%; height: 100%; fill: currentColor; }


@media (max-width: 900px) {
  .fn-ftop { flex-direction: column; }
  .fn-cols { grid-template-columns: repeat(2, auto); }
  .fn-base { grid-template-columns: 1fr; }
}
</style>
