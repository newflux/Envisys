<template>
  <!-- One graph, drawn from its data: gridlines, labelled axes, the line drawing itself in and every point read out (or, for an
       operating envelope, a shaded area). Used by the ETFS performance graph and by every series' curves. -->
  <figure class="lc">
    <figcaption>{{ c.title }}</figcaption>
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="aria">
      <g class="lc-grid">
        <line v-for="v in ticks(c.y)" :key="'y' + v" :x1="L" :x2="W - R" :y1="ys(v)" :y2="ys(v)" :class="{ zero: v === 0 }" />
        <line v-for="v in ticks(c.x)" :key="'x' + v" :y1="T" :y2="H - B" :x1="xs(v)" :x2="xs(v)" />
      </g>
      <g class="lc-ax">
        <text v-for="v in ticks(c.y)" :key="'ty' + v" :x="L - 12" :y="ys(v) + 5" text-anchor="end">{{ v }}</text>
        <text v-for="v in ticks(c.x)" :key="'tx' + v" :x="xs(v)" :y="H - B + 26" text-anchor="middle">{{ v }}</text>
        <text class="lc-ax-l" :x="(L + W - R) / 2" :y="H - 8" text-anchor="middle">{{ c.x.label }} ({{ c.x.unit }})</text>
        <text class="lc-ax-l" :transform="`translate(18 ${(T + H - B) / 2}) rotate(-90)`" text-anchor="middle">{{ c.y.label }} ({{ c.y.unit }})</text>
      </g>
      <polygon v-if="c.area" class="lc-area" :points="pts" />
      <polyline v-else class="lc-line" pathLength="1" :points="pts" />
      <g v-if="!c.area" class="lc-points">
        <g v-for="(p, i) in c.points" :key="p[0]" class="lc-pt" :style="{ '--i': i }">
          <circle :cx="xs(p[0])" :cy="ys(p[1])" r="6" />
          <text :x="xs(p[0])" :y="ys(p[1]) - 16" text-anchor="middle">{{ p[1] }}</text>
        </g>
      </g>
    </svg>
    <p v-if="c.note" class="lc-note">{{ c.note }}</p>
  </figure>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Chart } from '../config/details'

const props = defineProps<{ c: Chart }>()
// the drawing area, in viewBox units
const W = 860, H = 460, L = 74, R = 24, T = 30, B = 66
type Axis = { min: number; max: number; step: number }
const ticks = (a: Axis) => Array.from({ length: Math.round((a.max - a.min) / a.step) + 1 }, (_, k) => a.min + k * a.step)
const xs = (v: number) => L + ((v - props.c.x.min) / (props.c.x.max - props.c.x.min)) * (W - L - R)
const ys = (v: number) => T + ((props.c.y.max - v) / (props.c.y.max - props.c.y.min)) * (H - T - B)
const pts = computed(() => props.c.points.map((p) => `${xs(p[0])},${ys(p[1])}`).join(' '))
// the graph read out for screen readers: every point
const aria = computed(() => `${props.c.title}: ${props.c.points.map((p) => `${p[0]} ${props.c.x.unit}, ${p[1]} ${props.c.y.unit}`).join('; ')}`)
</script>

<style scoped>
.lc { margin: 0; padding: 3vw; border-radius: 22px; background: rgba(255, 255, 255, 0.55); box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset, 0 30px 60px -40px rgba(13, 35, 64, 0.35); }
.lc figcaption { margin-bottom: 2vh; font-family: var(--font-display); font-size: clamp(20px, 1.8vw, 30px); letter-spacing: -0.04em; }
.lc svg { display: block; width: 100%; height: auto; overflow: visible; }
.lc-grid line { stroke: rgba(13, 35, 64, 0.12); stroke-width: 1; }
.lc-grid line.zero { stroke: rgba(13, 35, 64, 0.5); }
.lc-ax text { font-family: var(--font-body); font-size: 15px; fill: #0d2340; opacity: 0.75; }
.lc-ax .lc-ax-l { font-size: 15px; opacity: 0.9; letter-spacing: 0.04em; }
.lc-line { fill: none; stroke: #0d2340; stroke-width: 3; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.8s cubic-bezier(0.6, 0, 0.2, 1) 0.2s; }
.lc[data-in] .lc-line { stroke-dashoffset: 0; }
.lc-area { fill: rgba(13, 35, 64, 0.14); stroke: #0d2340; stroke-width: 2.5; stroke-linejoin: round; opacity: 0; transition: opacity 1s ease 0.2s; }
.lc[data-in] .lc-area { opacity: 1; }
.lc-pt circle { fill: #ff6a1a; stroke: #fff; stroke-width: 2.5; }
.lc-pt text { font-family: var(--font-display); font-size: 17px; fill: #0d2340; letter-spacing: -0.03em; }
.lc-pt { opacity: 0; transition: opacity 0.5s ease calc(0.5s + var(--i) * 0.14s); }
.lc[data-in] .lc-pt { opacity: 1; }
.lc-note { margin: 2vh 0 0; font-family: var(--font-body); font-size: 15px; opacity: 0.7; }
</style>
