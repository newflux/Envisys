<template>
  <!-- Where the chamber works: its operating envelope on its own two axes (drawn only from its spec), beside a plain explanation.
       One screen tall; `flip` puts the graph on the left. Animates in once it is on screen. -->
  <section ref="root" class="vz" :class="{ flip, go }">
    <div class="vz-txt">
      <span class="vz-eye"><i></i>Operating envelope</span>
      <h3>{{ e.title ?? 'Where it works' }}</h3>
      <p v-for="(t, i) in e.explain" :key="i" :style="{ '--d': 0.15 + i * 0.1 + 's' }" v-html="t"></p>
      <small v-if="e.note">{{ e.note }}</small>
    </div>
    <figure class="vz-fig">
      <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="`Operating envelope: ${e.regions.map((r) => r.label).join(', ')}`">
        <g class="ev-grid">
          <line v-for="t in e.x.ticks" :key="'x' + t" :x1="X(t)" :x2="X(t)" :y1="T" :y2="H - B" />
          <line v-for="t in e.y.ticks" :key="'y' + t" :x1="L" :x2="W - R" :y1="Y(t)" :y2="Y(t)" />
        </g>
        <g v-for="(r, i) in e.regions" :key="r.label" class="ev-r" :class="r.tone" :style="{ '--i': i }">
          <rect :x="X(r.x0)" :y="Y(r.y1)" :width="X(r.x1) - X(r.x0)" :height="Y(r.y0) - Y(r.y1)" rx="5" />
        </g>
        <g class="ev-ax">
          <text v-for="t in e.x.ticks" :key="'xl' + t" :x="X(t)" :y="H - B + 32" text-anchor="middle">{{ t }}</text>
          <text v-for="t in e.y.ticks" :key="'yl' + t" :x="L - 14" :y="Y(t) + 6" text-anchor="end">{{ e.y.tickLabels?.[t] ?? t }}</text>
          <text class="ev-u" :x="W - R" :y="H - 8" text-anchor="end">{{ e.x.label }}, {{ e.x.unit }}</text>
          <text class="ev-u" :x="L" :y="T - 16">{{ e.y.label }}, {{ e.y.unit }}</text>
        </g>
      </svg>
      <ul class="ev-key">
        <li v-for="r in e.regions" :key="'k' + r.label" :class="r.tone"><i></i>{{ r.label }}</li>
      </ul>
    </figure>
  </section>
</template>

<script setup lang="ts">
import type { Envelope } from '../config/details'
import { useInView } from '../utils/inView'

const props = defineProps<{ e: Envelope; flip?: boolean }>()
const { root, go } = useInView()
const W = 1000, H = 600, L = 150, R = 24, T = 50, B = 70
const X = (v: number) => L + ((v - props.e.x.min) / (props.e.x.max - props.e.x.min)) * (W - L - R)
const Y = (v: number) => {
  const { min, max, log } = props.e.y
  const k = log ? (Math.log10(v) - Math.log10(min)) / (Math.log10(max) - Math.log10(min)) : (v - min) / (max - min)
  return H - B - k * (H - T - B)
}
</script>

<style scoped>
@import '../assets/viz.css';
.ev-grid line { stroke: rgba(13, 35, 64, 0.1); stroke-width: 1; }
.ev-ax text { font-family: 'Geist Mono', monospace; font-size: 17px; fill: rgba(13, 35, 64, 0.72); }
.ev-ax .ev-u { font-size: 15px; letter-spacing: 0.08em; text-transform: uppercase; fill: rgba(13, 35, 64, 0.55); }
.ev-r rect { stroke-width: 2; transform-box: fill-box; transform-origin: left bottom; transform: scale(0.001, 0.001); transition: transform 1.1s cubic-bezier(0.2, 0.9, 0.2, 1) calc(0.2s + var(--i) * 0.25s); }
.go .ev-r rect { transform: none; }
.ev-r.main rect { fill: rgba(255, 106, 26, 0.18); stroke: #ff6a1a; }
.ev-r.ext rect { fill: rgba(13, 35, 64, 0.12); stroke: rgba(13, 35, 64, 0.55); }
.ev-r.cold rect { fill: rgba(80, 160, 230, 0.24); stroke: #4a96dc; }
.ev-key { display: flex; flex-wrap: wrap; gap: 10px 24px; margin: 2.4vh 0 0; padding: 0; list-style: none; font-family: 'Geist', sans-serif; font-size: 16px; }
.ev-key i { display: inline-block; width: 12px; height: 12px; margin-right: 8px; border-radius: 3px; vertical-align: -1px; }
.ev-key .main i { background: rgba(255, 106, 26, 0.35); border: 1.5px solid #ff6a1a; }
.ev-key .ext i { background: rgba(13, 35, 64, 0.15); border: 1.5px solid rgba(13, 35, 64, 0.55); }
.ev-key .cold i { background: rgba(80, 160, 230, 0.3); border: 1.5px solid #4a96dc; }
@media (max-width: 800px) { .ev-ax text { font-size: 24px; } .ev-ax .ev-u { font-size: 20px; } }
</style>
