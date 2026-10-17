<template>
  <section class="cp-root" ref="rootRef">
    <div class="cp-head">
      <h2 class="cp-title">The autonomy difference</h2>
      <p class="cp-lede">Manual testing needs someone beside the chamber. Envisys runs the whole profile on its own, so the test never waits for a shift.</p>
    </div>

    <!-- RTS-style morph, driven by scroll position: the left panel opens up from a sliver while the
         right panel slides across inside its frame, until both sit side by side at equal width -->
    <div class="cp-panels" ref="panelsRef">
      <div class="cp-cell cp-cell-l">
        <button class="cp-dark" @click="open('manual')">
          <PanelArt :card="cards[0]" />
        </button>
      </div>
      <div class="cp-cell cp-cell-r">
        <i class="cp-corner cp-corner-l"></i><i class="cp-corner cp-corner-r"></i>
        <span class="cp-frame-label">Envisys /<br />autonomous</span>
        <button class="cp-dark cp-dark-r" ref="rightRef" @click="open('envisys')">
          <PanelArt :card="cards[1]" />
        </button>
      </div>
    </div>

    <!-- Detail sheet: teleported so it is fixed to the viewport, not to the scrolling column -->
    <Teleport to="body">
      <transition name="cp-m">
        <div v-if="active" class="cp-modal" @click.self="close">
          <div class="cp-sheet" role="dialog" aria-modal="true">
            <header>
              <h3>{{ active.title }}</h3>
              <button class="cp-x" @click="close" aria-label="Close"><svg viewBox="0 0 12 12"><path d="M1 1l10 10M11 1L1 11" /></svg></button>
            </header>
            <p class="cp-lead">{{ active.lead }}</p>
            <p class="cp-follow">{{ active.follow }}</p>
            <div class="cp-sheet-art">
              <svg viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
                <line x1="0" y1="80" x2="400" y2="80" class="cp-set" />
                <path :d="active.path" class="cp-line" :class="`is-${active.id}`" />
                <path v-if="active.gap" :d="active.gap" class="cp-gap" />
              </svg>
              <span>Illustrative profile · dashed line is the setpoint</span>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, h, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

// The curves are drawn, not measured — swap in a real run log when one is available.
function wobble(amp: number, until = 400, seed = 7) {
  let y = 80, s = seed, d = ''
  for (let x = 20; x <= until; x += 8) {
    s = (s * 9301 + 49297) % 233280
    y = 80 + (y - 80) * 0.55 + ((s / 233280) - 0.5) * amp + Math.sin(x / 38) * amp * 0.35
    d += `${x === 20 ? 'M' : 'L'}${x} ${y.toFixed(1)} `
  }
  return d
}

type Card = { id: string; tag: string; title: string; lead: string; follow: string; path: string; gap: string }
const cards: Card[] = [
  {
    id: 'manual',
    tag: 'Manual testing',
    title: 'Manual testing',
    lead: 'Someone has to be there. An operator stays beside the chamber, logs readings by hand and pauses the run when the shift ends.',
    follow: 'Between checks nobody sees what the chamber is doing, nights and weekends sit idle, and the report is assembled afterwards.',
    path: wobble(56, 270),
    gap: 'M270 80 L380 80'
  },
  {
    id: 'envisys',
    tag: 'Envisys autonomous',
    title: 'Envisys autonomous',
    lead: 'Set the profile and walk away. The chamber runs the full test unattended, day and night.',
    follow: 'Every sensor is logged live, the run carries on through nights and weekends, and the report is ready the moment the test ends.',
    path: 'M20 80 C 90 79.4, 150 80.6, 220 80 S 330 79.6, 380 80',
    gap: ''
  }
]

// Panel contents (curve + pill), shared by both panels
const PanelArt = (props: { card: Card }) => [
  h('svg', { class: 'cp-art', viewBox: '0 0 400 160', preserveAspectRatio: 'xMidYMid meet', 'aria-hidden': 'true' }, [
    h('line', { x1: 20, y1: 80, x2: 380, y2: 80, class: 'cp-set' }),
    h('path', { d: props.card.path, class: ['cp-line', `is-${props.card.id}`] }),
    props.card.gap ? h('path', { d: props.card.gap, class: 'cp-gap' }) : null
  ]),
  h('span', { class: 'cp-pill' }, [
    props.card.tag,
    h('i', [h('svg', { viewBox: '0 0 16 16' }, [h('path', { d: 'M8 3v10M3 8h10' })])])
  ])
]
PanelArt.props = ['card']

const activeId = ref<string | null>(null)
const active = computed(() => cards.find((c) => c.id === activeId.value) ?? null)
function open(id: string) {
  activeId.value = id
  ;(window as any).lenisInstance?.stop()
}
function close() {
  activeId.value = null
  ;(window as any).lenisInstance?.start()
}
const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && activeId.value) close() }

const rootRef = ref<HTMLElement | null>(null)
const panelsRef = ref<HTMLElement | null>(null)
const rightRef = ref<HTMLElement | null>(null)
let last = -1
function tick() {
  const panels = panelsRef.value
  if (!panels) return
  const H = window.innerHeight
  const top = panels.getBoundingClientRect().top
  const raw = Math.min(1, Math.max(0, (H * 0.95 - top) / (H * 0.7)))
  const p = raw * raw * (3 - 2 * raw)
  if (Math.abs(p - last) < 0.001) return
  last = p
  panels.style.gridTemplateColumns = `${(0.46 + 0.54 * p).toFixed(4)}fr 1fr`
  if (rightRef.value) rightRef.value.style.left = `${((1 - p) * 13).toFixed(3)}%`
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  gsap.ticker.add(tick)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  gsap.ticker.remove(tick)
})
</script>

<style scoped>
.cp-root {
  position: relative;
  color: var(--ink, #0d2340);
}

.cp-head { display: flex; justify-content: space-between; gap: 6vw; margin-bottom: 7vh; }
.cp-title { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(22px, 2.4vw, 44px); letter-spacing: -0.04em; line-height: 1.05; }
.cp-lede { margin: 0; max-width: 44ch; font-family: var(--font-body); font-size: clamp(12px, 1vw, 15px); line-height: 1.55; }

.cp-panels { height: min(72vh, 640px); display: grid; grid-template-columns: 0.46fr 1fr; gap: 14px; }
.cp-cell { position: relative; overflow: hidden; }
.cp-cell-r { border: 1px solid rgba(13, 35, 64, 0.28); }
.cp-corner { position: absolute; top: 8px; width: 4px; height: 4px; background: rgba(13, 35, 64, 0.4); }
.cp-corner-l { left: 8px; }
.cp-corner-r { right: 8px; }
.cp-frame-label { position: absolute; left: 30px; top: 34px; font-family: var(--font-body); font-size: 12px; line-height: 1.2; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.6; }

.cp-dark {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  border: 0;
  padding: 0;
  background: #030406;
  color: #fff;
  pointer-events: auto;
}
/* Fixed at the final half width, so it slides across the wider frame and lands flush */
.cp-dark-r { width: calc((90vw - 14px) / 2); left: 13%; }

.cp-modal { position: fixed; inset: 0; z-index: 9000; display: grid; place-items: center; background: rgba(8, 20, 40, 0.55); backdrop-filter: blur(6px); }
.cp-sheet { width: min(540px, 92vw); max-height: 92vh; overflow: auto; background: #f8f8f8; color: #1d1f22; border-radius: 10px; padding: 18px 20px 20px; }
.cp-sheet header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.cp-sheet h3 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(26px, 2.6vw, 42px); letter-spacing: -0.04em; line-height: 1.05; }
.cp-x { flex: none; width: 38px; height: 38px; border-radius: 50%; border: 1px solid #1d1f22; background: transparent; display: grid; place-items: center; }
.cp-x svg { width: 11px; height: 11px; stroke: #1d1f22; stroke-width: 1.2; fill: none; }
.cp-x:hover { background: #1d1f22; }
.cp-x:hover svg { stroke: #fff; }
.cp-lead { margin: 40px 0 0; font-family: var(--font-body); font-weight: 600; font-size: 15px; line-height: 1.5; }
.cp-follow { margin: 18px 0 0; font-family: var(--font-body); font-size: 15px; line-height: 1.5; color: #8a8d92; }
.cp-sheet-art { margin-top: 28px; padding: 18px; border-radius: 6px; background: #04070d; color: #fff; }
.cp-sheet-art svg { width: 100%; height: 150px; display: block; overflow: visible; }
.cp-sheet-art span { display: block; margin-top: 10px; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.5; }

.cp-m-enter-active, .cp-m-leave-active { transition: opacity 0.35s ease; }
.cp-m-enter-active .cp-sheet, .cp-m-leave-active .cp-sheet { transition: transform 0.45s cubic-bezier(0.2, 0.9, 0.2, 1); }
.cp-m-enter-from, .cp-m-leave-to { opacity: 0; }
.cp-m-enter-from .cp-sheet, .cp-m-leave-to .cp-sheet { transform: translateY(24px); }

@media (max-width: 900px) {
  .cp-head { flex-direction: column; gap: 14px; }
  .cp-panels { grid-template-columns: 1fr !important; height: auto; grid-auto-rows: 52vh; }
  .cp-dark-r { width: 100%; left: 0 !important; }
}
</style>

<style>
/* Shared by both panels (rendered through the functional PanelArt component) and the sheet */
.cp-art { position: absolute; left: 50%; top: 18%; width: min(84%, 520px); height: 38%; transform: translateX(-50%); overflow: visible; }
.cp-set { stroke: rgba(255, 255, 255, 0.3); stroke-dasharray: 4 6; vector-effect: non-scaling-stroke; }
.cp-line { fill: none; stroke: #fff; stroke-width: 2; vector-effect: non-scaling-stroke; }
.cp-line.is-manual { stroke: rgba(255, 255, 255, 0.55); }
.cp-gap { fill: none; stroke: #ff6a1a; stroke-width: 2; stroke-dasharray: 2 6; vector-effect: non-scaling-stroke; }
.cp-pill {
  position: absolute;
  left: 50%;
  top: 72%;
  transform: translate(-50%, -50%);
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px 18px 24px;
  border-radius: 12px;
  background: rgba(70, 70, 74, 0.82);
  font-family: var(--font-body);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: background 0.3s ease, transform 0.35s cubic-bezier(0.2, 0.9, 0.2, 1);
}
.cp-pill i { width: 26px; height: 26px; border: 1px solid #fff; border-radius: 50%; display: grid; place-items: center; }
.cp-pill svg { width: 12px; height: 12px; stroke: #fff; stroke-width: 1; fill: none; }
.cp-dark:hover .cp-pill { background: rgba(110, 110, 116, 0.9); transform: translate(-50%, -50%) scale(1.04); }
</style>
