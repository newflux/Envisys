<template>
  <!-- The operating envelope: what this series can hold, as regions on its own two axes, drawn only from its spec -->
  <figure class="ev rv">
    <figcaption class="ev-h"><b>Operating envelope</b><span>{{ e.y.label }} against {{ e.x.label.toLowerCase() }}</span></figcaption>
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="`Operating envelope: ${e.regions.map((r) => r.label).join(', ')}`">
      <g class="ev-grid">
        <line v-for="t in e.x.ticks" :key="'x' + t" :x1="X(t)" :x2="X(t)" :y1="T" :y2="H - B" />
        <line v-for="t in e.y.ticks" :key="'y' + t" :x1="L" :x2="W - R" :y1="Y(t)" :y2="Y(t)" />
      </g>
      <g v-for="(r, i) in e.regions" :key="r.label" class="ev-r" :class="r.tone" :style="{ '--i': i }">
        <rect :x="X(r.x0)" :y="Y(r.y1)" :width="X(r.x1) - X(r.x0)" :height="Y(r.y0) - Y(r.y1)" rx="4" />
        <text v-if="X(r.x1) - X(r.x0) > 90 && Y(r.y0) - Y(r.y1) > 30" :x="X(r.x0) + 12" :y="Y(r.y1) + 26">{{ r.label }}</text>
      </g>
      <g class="ev-ax">
        <text v-for="t in e.x.ticks" :key="'xl' + t" :x="X(t)" :y="H - B + 30" text-anchor="middle">{{ t }}</text>
        <text v-for="t in e.y.ticks" :key="'yl' + t" :x="L - 14" :y="Y(t) + 5" text-anchor="end">{{ e.y.tickLabels?.[t] ?? t }}</text>
        <text class="ev-u" :x="W - R" :y="H - 12" text-anchor="end">{{ e.x.label }}, {{ e.x.unit }}</text>
        <text class="ev-u" :x="L" :y="T - 12">{{ e.y.label }}, {{ e.y.unit }}</text>
      </g>
    </svg>
    <ul class="ev-key">
      <li v-for="r in e.regions" :key="'k' + r.label" :class="r.tone"><i></i>{{ r.label }}</li>
    </ul>
    <p v-if="e.note" class="ev-note">{{ e.note }}</p>
  </figure>
</template>

<script setup lang="ts">
import type { Envelope } from '../config/details'

const props = defineProps<{ e: Envelope }>()
const W = 1000, H = 520, L = 150, R = 24, T = 40, B = 64
const X = (v: number) => L + ((v - props.e.x.min) / (props.e.x.max - props.e.x.min)) * (W - L - R)
const Y = (v: number) => {
  const { min, max, log } = props.e.y
  const k = log ? (Math.log10(v) - Math.log10(min)) / (Math.log10(max) - Math.log10(min)) : (v - min) / (max - min)
  return H - B - k * (H - T - B)
}
</script>

<style scoped>
.ev { margin: 8vh 0 0; padding: 4vh 3vw 3vh; border-radius: 22px; background: rgba(255, 255, 255, 0.55); color: #0d2340; }
.ev-h { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 18px; margin-bottom: 3vh; }
.ev-h b { font-family: var(--font-display); font-weight: 400; font-size: clamp(22px, 2vw, 32px); letter-spacing: -0.04em; }
.ev-h span { font-family: 'Geist', sans-serif; font-size: 16px; opacity: 0.7; }
.ev svg { display: block; width: 100%; height: auto; overflow: visible; }
.ev-grid line { stroke: rgba(13, 35, 64, 0.1); stroke-width: 1; }
.ev-ax text { font-family: 'Geist Mono', monospace; font-size: 15px; fill: rgba(13, 35, 64, 0.7); }
.ev-ax .ev-u { font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; fill: rgba(13, 35, 64, 0.55); }
.ev-r rect { stroke-width: 1.5; transform-box: fill-box; transform-origin: left bottom; transform: scaleY(0); transition: transform 1s cubic-bezier(0.2, 0.9, 0.2, 1) calc(var(--i) * 0.15s); }
.ev.in .ev-r rect, .ev[data-in] .ev-r rect { transform: none; }
.ev-r text { font-family: 'Geist', sans-serif; font-size: 17px; fill: #0d2340; }
.ev-r.main rect { fill: rgba(255, 106, 26, 0.16); stroke: #ff6a1a; }
.ev-r.ext rect { fill: rgba(13, 35, 64, 0.1); stroke: rgba(13, 35, 64, 0.55); }
.ev-r.cold rect { fill: rgba(80, 160, 230, 0.2); stroke: #4a96dc; }
.ev-key { display: flex; flex-wrap: wrap; gap: 10px 26px; margin: 3vh 0 0; padding: 0; list-style: none; font-family: 'Geist', sans-serif; font-size: 15px; }
.ev-key i { display: inline-block; width: 12px; height: 12px; margin-right: 8px; border-radius: 3px; vertical-align: -1px; }
.ev-key .main i { background: rgba(255, 106, 26, 0.35); border: 1.5px solid #ff6a1a; }
.ev-key .ext i { background: rgba(13, 35, 64, 0.15); border: 1.5px solid rgba(13, 35, 64, 0.55); }
.ev-key .cold i { background: rgba(80, 160, 230, 0.3); border: 1.5px solid #4a96dc; }
.ev-note { margin: 1.6vh 0 0; font-family: 'Geist', sans-serif; font-size: 14px; opacity: 0.6; }
@media (max-width: 640px) { .ev { padding: 3vh 4vw; } .ev-ax text { font-size: 22px; } .ev-r text { font-size: 24px; } }
</style>
