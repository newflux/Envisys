<template>
  <!-- How long a temperature drop takes at each rated ramp rate: one straight line per rate (nominal, from the rate itself), the standard
       one in orange. Lines draw in once the section is on screen; `flip` puts the graph on the left. -->
  <section ref="root" class="vz" :class="{ flip, go }">
    <div class="vz-txt">
      <span class="vz-eye"><i></i>Ramp rate</span>
      <h3>{{ r.title }}</h3>
      <p v-for="(t, i) in r.explain" :key="i" :style="{ '--d': 0.15 + i * 0.1 + 's' }" v-html="t"></p>
      <small>{{ r.note }}</small>
    </div>
    <figure class="vz-fig">
      <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="lines.map((l) => `${l.rate} °C per minute: about ${l.min} minutes`).join('; ')">
        <g class="rc-grid">
          <line v-for="t in xt" :key="'x' + t" :x1="X(t)" :x2="X(t)" :y1="T" :y2="H - B" />
          <line v-for="t in yt" :key="'y' + t" :x1="L" :x2="W - R" :y1="Y(t)" :y2="Y(t)" />
        </g>
        <g v-for="(l, i) in lines" :key="l.rate" class="rc-l" :class="{ std: l.rate === r.std }" :style="{ '--i': i }">
          <path :d="`M${X(0)},${Y(r.from)} L${X(l.min)},${Y(r.to)} L${X(tMax)},${Y(r.to)}`" pathLength="1" />
          <circle :cx="X(l.min)" :cy="Y(r.to)" r="7" />
          <text :x="X(l.min)" :y="Y(r.to) + 30 + (i % 2) * 46" text-anchor="middle">{{ l.min }} min</text>
          <text class="rc-rate" :x="X(l.min)" :y="Y(r.to) + 50 + (i % 2) * 46" text-anchor="middle">at {{ l.rate }}°/min</text>
        </g>
        <g class="rc-ax">
          <text v-for="t in xt" :key="'xl' + t" :x="X(t)" :y="H - B + 32" text-anchor="middle">{{ t }}</text>
          <text v-for="t in yt" :key="'yl' + t" :x="L - 14" :y="Y(t) + 6" text-anchor="end">{{ t }}</text>
          <text class="rc-u" :x="W - R" :y="H - 8" text-anchor="end">Time, minutes</text>
          <text class="rc-u" :x="L" :y="T - 16">Temperature, °C</text>
        </g>
      </svg>
      <ul class="rc-key">
        <li class="std"><i></i>Standard, {{ r.std }} °C per minute</li>
        <li><i></i>Optional faster ramps</li>
      </ul>
    </figure>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Ramp } from '../config/details'
import { useInView } from '../utils/inView'

const props = defineProps<{ r: Ramp; flip?: boolean }>()
const { root, go } = useInView()
const W = 1000, H = 600, L = 90, R = 24, T = 50, B = 120
const lines = computed(() => props.r.rates.map((rate) => ({ rate, min: Math.round(Math.abs(props.r.from - props.r.to) / rate) })))
const tMax = computed(() => Math.ceil((Math.max(...lines.value.map((l) => l.min)) + 3) / 5) * 5)
const xt = computed(() => Array.from({ length: tMax.value / 5 + 1 }, (_, i) => i * 5))
const yMin = computed(() => Math.floor((props.r.to - 30) / 20) * 20), yMax = computed(() => Math.ceil((props.r.from + 10) / 20) * 20)
const yt = computed(() => Array.from({ length: (yMax.value - yMin.value) / 20 + 1 }, (_, i) => yMin.value + i * 20))
const X = (v: number) => L + (v / tMax.value) * (W - L - R)
const Y = (v: number) => H - B - ((v - yMin.value) / (yMax.value - yMin.value)) * (H - T - B)
</script>

<style scoped>
@import '../assets/viz.css';
.rc-grid line { stroke: rgba(13, 35, 64, 0.1); }
.rc-ax text { font-family: 'Geist Mono', monospace; font-size: 17px; fill: rgba(13, 35, 64, 0.72); }
.rc-ax .rc-u { font-size: 15px; letter-spacing: 0.08em; text-transform: uppercase; fill: rgba(13, 35, 64, 0.55); }
.rc-l path { fill: none; stroke: #4a96dc; stroke-width: 3; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.6s cubic-bezier(0.3, 0.7, 0.2, 1) calc(0.3s + var(--i) * 0.2s); }
.rc-l circle { fill: #4a96dc; transform-box: fill-box; transform-origin: center; transform: scale(0); transition: transform 0.4s ease calc(1.2s + var(--i) * 0.2s); }
.rc-l text { font-family: 'Geist', sans-serif; font-size: 17px; font-weight: 600; fill: #2f74b5; opacity: 0; transition: opacity 0.5s ease calc(1.3s + var(--i) * 0.2s); }
.rc-l .rc-rate { font-weight: 400; font-size: 14px; opacity: 0; }
.go .rc-l .rc-rate { opacity: 0.8; }
.rc-l.std path { stroke: #ff6a1a; stroke-width: 5; }
.rc-l.std circle { fill: #ff6a1a; }
.rc-l.std text { fill: #e0560c; font-size: 19px; }
.go .rc-l path { stroke-dashoffset: 0; }
.go .rc-l circle { transform: none; }
.go .rc-l text { opacity: 1; }
.rc-key { display: flex; flex-wrap: wrap; gap: 10px 24px; margin: 2.4vh 0 0; padding: 0; list-style: none; font-family: 'Geist', sans-serif; font-size: 15px; }
.rc-key i { display: inline-block; width: 22px; height: 4px; margin-right: 8px; border-radius: 2px; vertical-align: 3px; background: #4a96dc; }
.rc-key .std i { background: #ff6a1a; }
@media (max-width: 800px) { .rc-ax text { font-size: 24px; } .rc-l text { font-size: 22px; } .rc-l .rc-rate { font-size: 18px; } }
</style>
