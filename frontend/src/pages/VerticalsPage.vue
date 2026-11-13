<template>
  <PageShell title="Verticals" blue v-slot="{ contact }">
    <!-- 1 · the dial: a chamber's temperature dial half risen from the bottom of the screen. The six verticals stand on its rim as
         photo cards; scrolling (or dragging) turns the dial and the cards ride round with it. The card at the top is the one you open,
         and its details are written on the dial's white face. -->
    <section class="vd" ref="secRef">
      <div class="vd-stage" :style="{ '--r': R + 'px', '--cy': cy + 'px', '--cw': cw + 'px' }" @pointerdown="down">
        <header class="vd-head">
          <span class="vd-eye"><i></i>Verticals</span>
          <h1>Six ways to work with Envisys.</h1>
        </header>

        <div class="vd-count"><b>{{ String(active + 1).padStart(2, '0') }}</b><span>/ 06</span></div>
        <p class="vd-hint">Scroll, or drag the dial</p>

        <div class="vd-orbit">
          <a v-for="(v, k) in verticals" :key="v.id" class="vd-card" :class="{ on: k === active }" v-bind="attrs(v)" data-cursor=""
             :style="cardStyle(k)" @click="pick($event, k)">
            <span class="vd-pic"><img :src="v.img" :alt="v.name" draggable="false" /><i v-if="v.external" class="vd-ext">Vistara ↗</i></span>
            <span class="vd-cap"><em>0{{ k + 1 }}</em><b>{{ v.name }}</b><small>{{ v.short }}</small></span>
          </a>
        </div>

        <svg class="vd-dial" :style="{ width: R * 2 + 'px', height: R * 2 + 'px', left: `calc(50% - ${R}px)`, top: cy - R + 'px' }" viewBox="-1000 -1000 2000 2000" aria-hidden="true">
          <defs><radialGradient id="vd-face" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="#ffffff" /><stop offset="1" stop-color="#d3e3f4" /></radialGradient></defs>
          <circle r="1000" fill="#0d2340" />
          <circle r="955" fill="url(#vd-face)" />
          <g :transform="`rotate(${-d * STEP})`">
            <line v-for="k in 180" :key="'k' + k" class="vd-knurl" x1="0" y1="-1000" x2="0" y2="-962" :transform="`rotate(${k * 2})`" />
            <line v-for="k in 120" :key="'t' + k" class="vd-tick" :class="{ big: k % 5 === 0 }" x1="0" :y1="k % 5 === 0 ? -950 : -950" x2="0" :y2="k % 5 === 0 ? -916 : -934" :transform="`rotate(${k * 3})`" />
            <circle v-for="(v, k) in verticals" :key="'n' + v.id" class="vd-mark" :class="{ on: k === active }" cx="0" cy="-886" r="13" :transform="`rotate(${k * STEP})`" />
          </g>
          <path class="vd-pointer" d="M0 -1040 L-26 -1090 L26 -1090 Z" />
        </svg>

        <div class="vd-info">
          <Transition name="vd-swap" mode="out-in">
            <div :key="active" class="vd-info-in">
              <span class="vd-tagline">{{ cur.short }}</span>
              <h2 v-html="hy(cur.name)"></h2>
              <ul class="vd-chips"><li v-for="c in chips(cur)" :key="c">{{ c }}</li></ul>
              <a class="vd-open" v-bind="attrs(cur)" data-cursor="">{{ cur.external ? 'Visit Vistara' : 'Open page' }} <svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.4" /></svg></a>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- 2 · one chamber, six ways we stand behind it. The drawing is traced from this very photograph, so a scan window that
         opens on the drawing shows the real chamber exactly where it lands. -->
    <section class="vx">
      <div class="vx-in" ref="xrayRef">
        <div class="vx-text">
          <span class="vd-eye light rv"><i></i>fig. 02 · et300.xray</span>
          <h2 class="rv" style="--d: 0.05s">One chamber.<br />Six ways we stand behind it.</h2>
          <ul>
            <li v-for="(c, k) in calls" :key="c.id" class="rv" :style="{ '--d': k * 0.05 + 's' }" :class="{ on: k === xi }" @pointerenter="hold(k)" @pointerleave="held = false">
              <a v-bind="attrs(vOf(c.id))" data-cursor=""><em>0{{ k + 1 }}</em><b>{{ c.name }}</b><span>{{ c.part }}</span></a>
            </li>
          </ul>
        </div>
        <div class="vx-stage">
          <div class="vx-chamber">
            <img loading="lazy" decoding="async" class="vx-lines" src="/media/verticals/et-xray.webp" alt="" />
            <img loading="lazy" decoding="async" class="vx-real" src="/p/et/hero.webp" alt="Envisys ET300 environmental test chamber" :style="{ clipPath: scanClip }" />
            <div class="vx-scan" :style="scanBox"><i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i><span>{{ xc.part }} · x: {{ coord(xc.r[0], 816) }} y: {{ coord(xc.r[1], 1600) }}</span></div>
          </div>
          <p class="vx-cap">ET 300 · 816 × 1600 · {{ String(xi + 1).padStart(2, '0') }}/06</p>
        </div>
      </div>
    </section>

    <!-- 3 · or say what you need -->
    <section class="vn">
      <span class="vd-eye rv"><i></i>Not sure where to start?</span>
      <h2 class="rv" style="--d: 0.05s">Tell us what you need.</h2>
      <ul>
        <li v-for="(q, k) in needs" :key="q.id" class="rv" :style="{ '--d': k * 0.05 + 's' }">
          <a v-bind="attrs(vOf(q.id))" data-cursor=""><span>{{ q.q }}</span><b>{{ vOf(q.id).name }}</b><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg></a>
        </li>
      </ul>
      <button class="ps-pill rv" data-cursor="" @click="contact()"><span>Or just talk to us</span><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg></button>
    </section>

    <NextUp label="Next up" title="Guides and brochures" text="How to choose, rent and run environmental test equipment." href="/resources" />
  </PageShell>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import PageShell from '../components/PageShell.vue'
import NextUp from '../components/NextUp.vue'
import { verticals, attrs, hy, type Vertical } from '../config/verticals'

const needs = [
  { q: 'A chamber built to my standard', id: 'design' },
  { q: 'A standard chamber, fast', id: 'express' },
  { q: 'A test report', id: 'testing' },
  { q: 'A chamber for a few weeks', id: 'rentals' },
  { q: 'Service or calibration', id: 'aftersales' },
  { q: 'Something for my old chamber', id: 'refurb' }
]
const vOf = (id: string) => verticals.find((v) => v.id === id)!
// three short lines of what each vertical covers, taken from the vertical's own copy
const chipOverride: Record<string, string[]> = { express: ['Standard models', 'In stock', 'Quick delivery'], rentals: ['Climatic chambers', 'Thermal shock', 'Project budgets'] }
const chips = (v: Vertical) => chipOverride[v.id] ?? v.offer.slice(0, 3).map((o) => o.t)

// ── the dial ──
const secRef = ref<HTMLElement | null>(null)
const R = ref(520), cy = ref(1000), cw = ref(250), STEP = ref(24), d = ref(0)
const active = computed(() => Math.min(5, Math.max(0, Math.round(d.value))))
const cur = computed(() => verticals[active.value])
let target = 0
function cardStyle(k: number) {
  const off = k - d.value, a = Math.abs(off)
  return {
    transform: `rotate(${off * STEP.value}deg) translateY(${-(R.value + 34)}px) scale(${(1 - Math.min(a, 3) * 0.12).toFixed(3)}) translate(-50%, -100%)`,
    opacity: Math.max(0, 1 - a * 0.45).toFixed(3),
    zIndex: 10 - Math.round(a)
  }
}
function layout() {
  const W = window.innerWidth, H = window.innerHeight, wide = W > 900
  R.value = wide ? Math.min(W * 0.4, H * 0.62) : Math.min(W * 0.95, H * 0.46)
  cy.value = H + R.value * (wide ? 0.26 : 0.3) // the dial's centre sits below the screen: only its upper rim shows
  cw.value = wide ? Math.min(310, Math.max(225, W * 0.16)) : Math.min(180, W * 0.46)
  STEP.value = ((cw.value * 1.08) / (R.value + 34)) * (180 / Math.PI) // neighbouring cards just overlap
}
const stepPx = () => window.innerHeight * 0.6
function sectionTop() { const sc = document.querySelector('#scroller') as HTMLElement; return secRef.value!.getBoundingClientRect().top + sc.scrollTop }
function goStep(k: number, immediate = false) { (window as any).lenisInstance?.scrollTo(sectionTop() + k * stepPx(), immediate ? { immediate: true } : { duration: 1.1 }) }
// a card that is not at the top turns the dial to it; the card at the top opens
function pick(e: MouseEvent, k: number) { if (moved || k !== active.value) { e.preventDefault(); if (!moved) goStep(k) } }
// drag the dial: sideways movement turns it, and on release it settles on the nearest card
let sx = 0, s0 = 0, dragging = false, moved = false
function down(e: PointerEvent) {
  dragging = true; moved = false; sx = e.clientX
  s0 = (document.querySelector('#scroller') as HTMLElement).scrollTop
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up, { once: true })
}
function move(e: PointerEvent) {
  if (!dragging) return
  const dx = e.clientX - sx
  if (Math.abs(dx) > 6) moved = true
  if (moved) (window as any).lenisInstance?.scrollTo(s0 - dx * (stepPx() / 200), { immediate: true })
}
function up() { dragging = false; window.removeEventListener('pointermove', move); if (moved) goStep(Math.round(target)); setTimeout(() => (moved = false), 0) }

// ── the X-ray chamber: regions of the 816 × 1600 ET300 photograph, measured on it, as fractions [x0, y0, x1, y1] ──
const calls = [
  { id: 'design', name: 'Design & Build', part: 'the whole build', r: [0.03, 0.02, 0.97, 0.93] },
  { id: 'express', name: 'Express Factory', part: 'ready to roll', r: [0.02, 0.92, 0.98, 1] },
  { id: 'testing', name: 'Testing Services', part: 'the test space', r: [0.33, 0.215, 0.675, 0.437] },
  { id: 'rentals', name: 'Rentals', part: 'ready to run', r: [0.22, 0.005, 0.63, 0.1] },
  { id: 'aftersales', name: 'After Sales & AMCs', part: 'the controller', r: [0.405, 0.472, 0.595, 0.537] },
  { id: 'refurb', name: 'Refurbishment', part: 'the refrigeration', r: [0.27, 0.58, 0.74, 0.915] }
]
const xi = ref(0), held = ref(false)
const xc = computed(() => calls[xi.value])
const pct = (x: number) => (x * 100).toFixed(2) + '%'
const scanClip = computed(() => { const [a, b, c, e] = xc.value.r; return `inset(${pct(b)} ${pct(1 - c)} ${pct(1 - e)} ${pct(a)})` })
const scanBox = computed(() => { const [a, b, c, e] = xc.value.r; return { left: pct(a), top: pct(b), width: pct(c - a), height: pct(e - b) } })
const coord = (f: number, n: number) => String(Math.round(f * n)).padStart(4, '0')
function hold(k: number) { xi.value = k; held.value = true }
let cycle = 0

const clamp = (x: number) => Math.min(1, Math.max(0, x))
// the header logo turns white while the navy X-ray panel is under it (PageShell reads html.hx-dark)
const under = (el: Element | null | undefined) => { if (!el) return false; const r = el.getBoundingClientRect(); return r.top < 44 && r.bottom > 44 }
const xrayRef = ref<HTMLElement | null>(null)
function tick() {
  const r = secRef.value!.getBoundingClientRect(), H = window.innerHeight
  target = clamp(-r.top / (r.height - H)) * 5
  d.value += (target - d.value) * 0.14
  if (Math.abs(target - d.value) < 0.0005) d.value = target
  document.documentElement.classList.toggle('hx-dark', under(xrayRef.value))
}
onMounted(() => {
  layout(); window.addEventListener('resize', layout); gsap.ticker.add(tick)
  cycle = window.setInterval(() => { if (!held.value) xi.value = (xi.value + 1) % calls.length }, 2600)
})
onUnmounted(() => { window.removeEventListener('resize', layout); gsap.ticker.remove(tick); clearInterval(cycle); document.documentElement.classList.remove('hx-dark') })
</script>

<style scoped>
.vd-eye { display: inline-flex; align-items: center; gap: 12px; font-family: 'Geist Mono', monospace; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(13, 35, 64, 0.7); }
.vd-eye i { width: 8px; height: 8px; border-radius: 50%; background: #ff6a1a; box-shadow: 0 0 0 5px rgba(255, 106, 26, 0.18); }
.vd-eye.light { color: rgba(214, 228, 243, 0.75); text-transform: none; letter-spacing: 0.06em; }
:deep(.hy) { font-family: 'Geist', sans-serif; font-style: normal; font-weight: 600; letter-spacing: 0; padding: 0 0.04em; } /* the display face draws its hyphen as a long dash */

/* 1 · the dial */
.vd { position: relative; height: 400vh; }
.vd-stage { position: sticky; top: 0; height: 100vh; overflow: hidden; color: #0d2340; touch-action: pan-y; user-select: none; cursor: grab; }
.vd-stage:active { cursor: grabbing; }
.vd-head { position: absolute; left: 5vw; top: 16vh; z-index: 20; width: 21vw; min-width: 200px; display: flex; flex-direction: column; gap: 2vh; animation: vd-fade 1s ease 0.2s both; }
.vd-head h1 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(20px, 1.7vw, 32px); line-height: 1.1; letter-spacing: -0.05em; }
.vd-count { position: absolute; right: 5vw; top: 16vh; z-index: 20; display: flex; align-items: baseline; gap: 10px; font-family: 'Geist Mono', monospace; }
.vd-count b { font-family: var(--font-display); font-weight: 400; font-size: clamp(44px, 4.4vw, 84px); letter-spacing: -0.06em; line-height: 1; }
.vd-count span { font-size: 16px; opacity: 0.55; }
.vd-hint { position: absolute; right: 5vw; top: calc(16vh + clamp(56px, 5.4vw, 100px)); z-index: 20; margin: 0; text-align: right; font-family: 'Geist Mono', monospace; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.55; }

.vd-orbit { position: absolute; left: 50%; top: var(--cy); width: 0; height: 0; z-index: 10; }
.vd-card { position: absolute; left: 0; top: 0; width: var(--cw); transform-origin: 0 0; display: flex; flex-direction: column; border-radius: 18px; background: #fff; color: #0d2340; text-decoration: none; box-shadow: 0 30px 60px -30px rgba(13, 35, 64, 0.5); will-change: transform; }
.vd-pic { position: relative; display: block; aspect-ratio: 4 / 3.15; overflow: hidden; border-radius: 18px 18px 0 0; }
.vd-pic img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.55); transition: filter 0.6s ease, transform 1s cubic-bezier(0.2, 0.9, 0.2, 1); pointer-events: none; }
.vd-card.on .vd-pic img { filter: none; }
.vd-card.on:hover .vd-pic img { transform: scale(1.05); }
.vd-ext { position: absolute; right: 10px; top: 10px; padding: 5px 10px; border-radius: 20px; background: #ff6a1a; color: #0a0a0c; font-family: 'Geist Mono', monospace; font-size: 11px; font-style: normal; font-weight: 600; }
.vd-cap { display: flex; flex-direction: column; gap: 3px; padding: 12px 16px 16px; }
.vd-cap em { font-style: normal; font-family: 'Geist Mono', monospace; font-size: 12px; color: #ff6a1a; }
.vd-cap b { font-family: 'Geist', sans-serif; font-weight: 600; font-size: 18px; line-height: 1.15; }
.vd-cap small { font-family: 'Geist', sans-serif; font-size: 14.5px; opacity: 0.68; }

.vd-dial { position: absolute; z-index: 5; filter: drop-shadow(0 -30px 60px rgba(13, 35, 64, 0.22)); }
.vd-knurl { stroke: rgba(214, 228, 243, 0.45); stroke-width: 4; }
.vd-tick { stroke: #0d2340; stroke-opacity: 0.35; stroke-width: 3; }
.vd-tick.big { stroke-opacity: 0.85; stroke-width: 5; }
.vd-mark { fill: #fff; stroke: #0d2340; stroke-width: 4; transition: fill 0.4s ease, stroke 0.4s ease; }
.vd-mark.on { fill: #ff6a1a; stroke: #ff6a1a; }
.vd-pointer { fill: #ff6a1a; }
@keyframes vd-fade { from { opacity: 0; } }

/* the label plate, written on the dial's white face */
.vd-info { position: absolute; left: 50%; top: calc(var(--cy) - var(--r) + var(--r) * 0.2); z-index: 20; width: min(calc(var(--r) * 1.05), 600px); translate: -50% 0; text-align: center; }
.vd-info-in { display: flex; flex-direction: column; align-items: center; gap: 1vh; }
.vd-tagline { font-family: 'Geist', sans-serif; font-size: clamp(15px, 1.05vw, 19px); opacity: 0.75; }
.vd-info h2 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(22px, min(2.4vw, 4.8vh), 42px); line-height: 1; letter-spacing: -0.055em; text-wrap: balance; }
.vd-chips { list-style: none; margin: 0.4vh 0 0; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.vd-chips li { padding: 8px 14px; border-radius: 30px; background: rgba(13, 35, 64, 0.07); font-family: 'Geist', sans-serif; font-size: 15px; }
.vd-open { display: inline-flex; align-items: center; gap: 10px; margin-top: 0.8vh; padding: 14px 22px; border-radius: 40px; background: #0d2340; color: #fff; font-family: 'Geist Mono', monospace; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; transition: background 0.4s ease, gap 0.4s ease, color 0.4s ease; }
.vd-open:hover { background: #ff6a1a; color: #0a0a0c; gap: 16px; }
.vd-open svg { width: 10px; height: 10px; }
.vd-swap-enter-active, .vd-swap-leave-active { transition: opacity 0.35s ease, transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1); }
.vd-swap-enter-from { opacity: 0; transform: translateY(20px); }
.vd-swap-leave-to { opacity: 0; transform: translateY(-14px); }

/* 2 · the X-ray chamber */
.vx { padding: 6vh 2vw; }
.vx-in { display: grid; grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr); gap: 3vw; align-items: center; padding: 12vh 4vw; border-radius: clamp(28px, 4vw, 64px); color: #eef3fa; background-color: #0b1d36; background-image: linear-gradient(rgba(214, 228, 243, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(214, 228, 243, 0.05) 1px, transparent 1px); background-size: 40px 40px; }
.vx-text { display: flex; flex-direction: column; gap: 3vh; }
.vx h2 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(30px, 3.4vw, 64px); line-height: 1.02; letter-spacing: -0.055em; }
.vx ul { list-style: none; margin: 2vh 0 0; padding: 0; border-top: 1px solid rgba(214, 228, 243, 0.14); }
.vx li { border-bottom: 1px solid rgba(214, 228, 243, 0.14); }
.vx li a { display: grid; grid-template-columns: 44px 1fr auto; align-items: baseline; gap: 12px; padding: 2.2vh 0; color: inherit; text-decoration: none; opacity: 0.55; transition: opacity 0.3s ease, padding 0.5s cubic-bezier(0.2, 0.9, 0.2, 1); }
.vx li.on a { opacity: 1; padding-left: 10px; }
.vx li em { font-style: normal; font-family: 'Geist Mono', monospace; font-size: 13px; color: #ff8a4a; }
.vx li b { font-family: 'Geist', sans-serif; font-weight: 500; font-size: clamp(18px, 1.4vw, 24px); }
.vx li span { font-family: 'Geist Mono', monospace; font-size: 13px; opacity: 0.7; }
.vx-stage { display: flex; flex-direction: column; align-items: center; gap: 2vh; }
.vx-chamber { position: relative; height: min(72vh, 720px); aspect-ratio: 816 / 1600; }
.vx-chamber img { position: absolute; inset: 0; width: 100%; height: 100%; }
.vx-lines { filter: drop-shadow(0 0 6px rgba(150, 205, 255, 0.45)); }
.vx-real { transition: clip-path 0.9s cubic-bezier(0.7, 0, 0.2, 1); }
.vx-scan { position: absolute; border: 1px solid rgba(255, 138, 74, 0.95); transition: all 0.9s cubic-bezier(0.7, 0, 0.2, 1); pointer-events: none; }
.vx-scan i { position: absolute; width: 12px; height: 12px; border: 2px solid #ff6a1a; }
.vx-scan .tl { left: -3px; top: -3px; border-right: 0; border-bottom: 0; } .vx-scan .tr { right: -3px; top: -3px; border-left: 0; border-bottom: 0; }
.vx-scan .bl { left: -3px; bottom: -3px; border-right: 0; border-top: 0; } .vx-scan .br { right: -3px; bottom: -3px; border-left: 0; border-top: 0; }
.vx-scan span { position: absolute; left: -1px; bottom: calc(100% + 6px); padding: 4px 8px; background: #ff6a1a; color: #0a0a0c; font-family: 'Geist Mono', monospace; font-size: 12px; white-space: nowrap; }
.vx-cap { margin: 0; font-family: 'Geist Mono', monospace; font-size: 12px; letter-spacing: 0.06em; opacity: 0.6; }

/* 3 · tell us what you need */
.vn { display: flex; flex-direction: column; gap: 3vh; padding: 16vh 5vw 8vh; color: #0d2340; }
.vn h2 { margin: 0 0 3vh; font-family: var(--font-display); font-weight: 400; font-size: clamp(34px, 4.6vw, 88px); line-height: 1; letter-spacing: -0.055em; }
.vn ul { list-style: none; margin: 0 0 4vh; padding: 0; border-top: 1px solid rgba(13, 35, 64, 0.16); }
.vn li { border-bottom: 1px solid rgba(13, 35, 64, 0.16); }
.vn a { display: grid; grid-template-columns: 1fr auto 18px; align-items: center; gap: 3vw; padding: 3vh 0; color: inherit; text-decoration: none; transition: padding 0.6s cubic-bezier(0.2, 0.9, 0.2, 1), color 0.4s ease; }
.vn a span { font-family: 'Geist', sans-serif; font-size: clamp(19px, 1.7vw, 30px); }
.vn a b { font-family: 'Geist Mono', monospace; font-weight: 400; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.6; }
.vn a svg { width: 13px; height: 13px; opacity: 0.5; transition: transform 0.5s ease, opacity 0.3s ease; }
.vn a:hover { padding-left: 1.4vw; color: #ff6a1a; }
.vn a:hover b, .vn a:hover svg { opacity: 1; }
.vn a:hover svg { transform: translate(3px, -3px); }
.vn .ps-pill { align-self: flex-start; padding: 16px 24px; font-size: 12px; }

@media (max-height: 760px) { .vd-chips { display: none; } }
@media (max-width: 900px) {
  .vd-head { top: 12vh; width: 56vw; } .vd-head h1 { font-size: 20px; }
  .vd-count { top: 12vh; } .vd-count b { font-size: 40px; }
  .vd-hint { display: none; }
  .vd-info { top: calc(var(--cy) - var(--r) + var(--r) * 0.22); width: 78vw; }
  .vd-chips { display: none; }
  .vd-cap b { font-size: 15px; } .vd-cap small { display: none; }
  .vx-in { grid-template-columns: 1fr; padding: 8vh 6vw; }
  .vx-chamber { height: 60vh; }
  .vn a { grid-template-columns: 1fr 16px; gap: 6px 14px; }
  .vn a b { grid-row: 2; }
  .vn a svg { grid-row: 1 / span 2; grid-column: 2; }
}
</style>
