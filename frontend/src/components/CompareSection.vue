<template>
  <div class="cp-root">
    <div class="cp-head cp-fade">
      <h2 class="cp-title">The autonomy difference</h2>
      <p class="cp-lede">Manual testing needs someone beside the chamber. Envisys runs the whole profile on its own, so the test never waits for a shift.</p>
    </div>

    <div class="cp-panels">
      <!-- Each frame sits empty with its label; the dark visual slides in from the left as you scroll -->
      <div v-for="c in cards" :key="c.id" class="cp-frame">
        <span class="cp-frame-label">{{ c.label }}</span>
        <button class="cp-dark" @click="open(c.id)">
          <svg class="cp-art" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <line x1="20" y1="80" x2="380" y2="80" class="cp-set" />
            <path :d="c.path" class="cp-line" :class="`is-${c.id}`" />
            <path v-if="c.gap" :d="c.gap" class="cp-gap" />
          </svg>
          <span class="cp-pill">{{ c.tag }}<i><svg viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" /></svg></i></span>
        </button>
      </div>
    </div>

    <!-- Detail sheet: title, bold lead, grey follow-up, visual -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

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

const cards = [
  {
    id: 'manual',
    label: 'Manual / operator-run',
    tag: 'Manual testing',
    title: 'Manual testing',
    lead: 'Someone has to be there. An operator stays beside the chamber, logs readings by hand and pauses the run when the shift ends.',
    follow: 'Between checks nobody sees what the chamber is doing, nights and weekends sit idle, and the report is assembled afterwards.',
    path: wobble(56, 270),
    gap: 'M270 80 L380 80'
  },
  {
    id: 'envisys',
    label: 'Envisys / autonomous',
    tag: 'Envisys autonomous',
    title: 'Envisys autonomous',
    lead: 'Set the profile and walk away. The chamber runs the full test unattended, day and night.',
    follow: 'Every sensor is logged live, the run carries on through nights and weekends, and the report is ready the moment the test ends.',
    path: 'M20 80 C 90 79.4, 150 80.6, 220 80 S 330 79.6, 380 80',
    gap: ''
  }
]

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
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.cp-root {
  position: fixed;
  inset: 0;
  z-index: 106;
  pointer-events: none;
  visibility: hidden;
  color: #fff;
}
.cp-fade { opacity: 0; }

.cp-head { position: absolute; left: 5vw; right: 5vw; top: 13vh; display: flex; justify-content: space-between; gap: 6vw; }
.cp-title { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(22px, 2.4vw, 44px); letter-spacing: -0.04em; line-height: 1.05; }
.cp-lede { margin: 0; max-width: 44ch; font-family: var(--font-body); font-size: clamp(12px, 1vw, 15px); line-height: 1.55; text-shadow: 0 1px 14px rgba(6, 40, 90, 0.4); }

.cp-panels { position: absolute; left: 5vw; right: 5vw; top: 28vh; bottom: 7vh; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.cp-frame { position: relative; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 4px; }
.cp-frame-label { position: absolute; left: 28px; top: 26px; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.8; }

.cp-dark {
  position: absolute;
  inset: 0;
  border: 0;
  padding: 0;
  background: #04070d;
  color: #fff;
  pointer-events: none;
  will-change: transform;
}
.cp-art { position: absolute; left: 8%; top: 14%; width: 84%; height: 40%; overflow: visible; }
.cp-set { stroke: rgba(255, 255, 255, 0.3); stroke-dasharray: 4 6; vector-effect: non-scaling-stroke; }
.cp-line { fill: none; stroke: #fff; stroke-width: 2; vector-effect: non-scaling-stroke; }
.cp-line.is-manual { stroke: rgba(255, 255, 255, 0.55); }
.cp-gap { fill: none; stroke: #ff6a1a; stroke-width: 2; stroke-dasharray: 2 6; vector-effect: non-scaling-stroke; }

.cp-pill {
  position: absolute;
  left: 50%;
  top: 74%;
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

/* ── detail sheet ── */
.cp-modal { position: fixed; inset: 0; z-index: 120; pointer-events: auto; display: grid; place-items: center; background: rgba(8, 20, 40, 0.55); backdrop-filter: blur(6px); }
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
  .cp-panels { grid-template-columns: 1fr; top: 34vh; }
}
</style>
