<template>
  <!-- One line drawing per vertical, looping quietly: navy line on the light blue, one orange accent. Pure SVG + CSS. -->
  <svg class="vm" :class="kind" viewBox="0 0 400 300" role="img" :aria-label="label">
    <!-- design & build: a chamber's front elevation drawing itself, with its dimension lines -->
    <g v-if="kind === 'blueprint'">
      <defs><pattern id="vm-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" class="vm-faint" /></pattern></defs>
      <rect width="400" height="300" fill="url(#vm-grid)" />
      <path class="vm-d" style="--k: 0" pathLength="1" d="M130 40h140v210H130z" />
      <path class="vm-d" style="--k: 1" pathLength="1" d="M178 40h44v210h-44z" />
      <path class="vm-d" style="--k: 2" pathLength="1" d="M130 160h140" />
      <path class="vm-d" style="--k: 3" pathLength="1" d="M185 66h30v38h-30z M187 118h26v18h-26z" />
      <path class="vm-d" style="--k: 4" pathLength="1" d="M136 256a6 6 0 1 0 12 0a6 6 0 1 0-12 0 M252 256a6 6 0 1 0 12 0a6 6 0 1 0-12 0" />
      <path class="vm-d vm-acc" style="--k: 5" pathLength="1" d="M108 40v210 M102 40h12 M102 250h12 M130 280h140 M130 274v12 M270 274v12" />
      <text class="vm-t vm-fade" x="96" y="150" text-anchor="end">2150</text>
      <text class="vm-t vm-fade" x="200" y="298" text-anchor="middle">1290</text>
    </g>

    <!-- express: a route from the factory to you, a truck on it -->
    <g v-else-if="kind === 'route'">
      <path id="vm-road" class="vm-road" d="M40 230 C 140 230, 150 90, 240 110 S 330 70, 360 70" />
      <path class="vm-d vm-acc" style="--k: 0" pathLength="1" d="M40 230 C 140 230, 150 90, 240 110 S 330 70, 360 70" />
      <circle cx="40" cy="230" r="7" class="vm-pin" /><circle cx="360" cy="70" r="7" class="vm-pin end" />
      <text class="vm-t" x="40" y="262" text-anchor="middle">Factory</text><text class="vm-t" x="360" y="50" text-anchor="middle">Your lab</text>
      <g class="vm-truck"><path d="M-14 -8h16v12h-16z M2 -4h7l5 5v3h-12z" /><circle cx="-9" cy="6" r="2.6" /><circle cx="8" cy="6" r="2.6" />
        <animateMotion dur="4s" repeatCount="indefinite" rotate="auto" keyPoints="0;1;1" keyTimes="0;0.8;1" calcMode="linear"><mpath href="#vm-road" /></animateMotion></g>
    </g>

    <!-- testing: a temperature profile, drawn as the test runs -->
    <g v-else-if="kind === 'instrument'">
      <path class="vm-faint" d="M40 40v220h340 M40 95h340 M40 150h340 M40 205h340" />
      <text class="vm-t" x="34" y="60" text-anchor="end">+85</text><text class="vm-t" x="34" y="240" text-anchor="end">−40</text>
      <path class="vm-d vm-acc vm-run" pathLength="1" d="M40 170 L90 170 L130 240 L190 240 L230 60 L300 60 L340 170 L380 170" />
      <text class="vm-t vm-small" x="380" y="285" text-anchor="end">°C · example profile</text>
    </g>

    <!-- rentals: a calendar, the test booked across the days it needs -->
    <g v-else-if="kind === 'calendar'">
      <text v-for="(d, k) in 'MTWTFSS'" :key="'h' + k" class="vm-t" :x="58 + k * 47" y="52" text-anchor="middle">{{ d }}</text>
      <rect v-for="k in 21" :key="k" class="vm-cell" :x="38 + ((k - 1) % 7) * 47" :y="68 + Math.floor((k - 1) / 7) * 66" width="40" height="56" rx="6" />
      <g class="vm-book"><rect x="85" y="140" width="228" height="44" rx="8" /><text x="100" y="168" class="vm-t vm-on">Your test</text></g>
    </g>

    <!-- after sales: a 24-hour dial -->
    <g v-else-if="kind === 'dial'">
      <circle cx="200" cy="150" r="112" class="vm-faint" />
      <line v-for="k in 24" :key="k" class="vm-tick" :class="{ big: (k - 1) % 6 === 0 }" x1="200" :y1="(k - 1) % 6 === 0 ? 46 : 52" x2="200" y2="62" :transform="`rotate(${(k - 1) * 15} 200 150)`" />
      <circle cx="200" cy="150" r="96" class="vm-sweep" pathLength="1" transform="rotate(-90 200 150)" />
      <g class="vm-hand"><line x1="200" y1="150" x2="200" y2="66" /><circle cx="200" cy="150" r="5" /></g>
      <text class="vm-big" x="200" y="214" text-anchor="middle">24 h</text>
    </g>

    <!-- refurbishment & buy-back: the loop that gives a chamber its second life -->
    <g v-else>
      <path id="vm-ring" class="vm-ring" d="M200 50 a100 100 0 1 1 -0.1 0" />
      <g v-for="n in loopNodes" :key="n[0]" :transform="`translate(${n[1]} ${n[2]})`"><circle r="8" class="vm-node" /><text class="vm-t" :x="n[3]" :y="n[4]" :text-anchor="n[5]">{{ n[0] }}</text></g>
      <circle r="7" class="vm-pin end"><animateMotion dur="6s" repeatCount="indefinite"><mpath href="#vm-ring" /></animateMotion></circle>
      <text class="vm-big vm-mid" x="200" y="158" text-anchor="middle">2nd life</text>
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { Motif } from '../config/verticals'
const props = defineProps<{ kind: Motif }>()
const label = ({ blueprint: 'A chamber drawing with its dimensions', route: 'A route from the factory to your lab', instrument: 'A temperature test profile', calendar: 'A rental booked across days', dial: 'A 24-hour dial', loop: 'Buy, use, refurbish, buy back' } as const)[props.kind]
const loopNodes: [string, number, number, number, number, string][] = [['Buy', 200, 50, 0, -18, 'middle'], ['Use', 300, 150, 18, 5, 'start'], ['Refurbish', 200, 250, 0, 32, 'middle'], ['Buy back', 100, 150, -18, 5, 'end']]
</script>

<style scoped>
.vm { --mi: #0d2340; --ma: #ff6a1a; width: 100%; height: auto; overflow: visible; }
.vm-faint { fill: none; stroke: var(--mi); stroke-opacity: 0.12; stroke-width: 1; }
.vm-d { fill: none; stroke: var(--mi); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: vm-draw 6s cubic-bezier(0.6, 0, 0.2, 1) infinite; animation-delay: calc(var(--k, 0) * 0.25s); }
.vm-acc { stroke: var(--ma); }
@keyframes vm-draw { 0% { stroke-dashoffset: 1; opacity: 1; } 45%, 85% { stroke-dashoffset: 0; opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0; } }
.vm-run { animation-duration: 5s; animation-timing-function: linear; animation-name: vm-run; }
@keyframes vm-run { 0% { stroke-dashoffset: 1; opacity: 1; } 75%, 92% { stroke-dashoffset: 0; opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0; } }
.vm-t { font-family: 'Geist Mono', monospace; font-size: 14px; fill: var(--mi); fill-opacity: 0.75; letter-spacing: 0.04em; }
.vm-small { font-size: 12px; fill-opacity: 0.5; }
.vm-fade { animation: vm-fade 6s ease infinite; }
@keyframes vm-fade { 0%, 40% { opacity: 0; } 55%, 85% { opacity: 1; } 100% { opacity: 0; } }
.vm-big { font-family: var(--font-display); font-size: 34px; letter-spacing: -0.04em; fill: var(--mi); }
.vm-mid { font-size: 22px; }
.vm-pin { fill: #fff; stroke: var(--mi); stroke-width: 2; }
.vm-pin.end { fill: var(--ma); stroke: var(--ma); }
.vm-road { fill: none; stroke: var(--mi); stroke-opacity: 0.18; stroke-width: 10; stroke-linecap: round; }
.vm-truck path, .vm-truck circle { fill: var(--mi); }
.vm-cell { fill: rgba(255, 255, 255, 0.45); stroke: var(--mi); stroke-opacity: 0.12; }
.vm-book rect { fill: var(--ma); transform-box: fill-box; transform-origin: left center; animation: vm-book 5s cubic-bezier(0.6, 0, 0.2, 1) infinite; }
.vm-book text { animation: vm-fade 5s ease infinite; }
.vm-on { fill: #0a0a0c; fill-opacity: 1; font-weight: 600; }
@keyframes vm-book { 0% { transform: scaleX(0); } 45%, 88% { transform: scaleX(1); } 100% { transform: scaleX(1); opacity: 0; } }
.vm-tick { stroke: var(--mi); stroke-opacity: 0.35; stroke-width: 2; }
.vm-tick.big { stroke-opacity: 0.9; stroke-width: 3; }
.vm-sweep { fill: none; stroke: var(--ma); stroke-width: 6; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: vm-sweep 6s linear infinite; }
@keyframes vm-sweep { to { stroke-dashoffset: 0; } }
.vm-hand { transform-origin: 200px 150px; animation: vm-turn 6s linear infinite; }
.vm-hand line { stroke: var(--mi); stroke-width: 3; stroke-linecap: round; }
.vm-hand circle { fill: var(--mi); }
@keyframes vm-turn { to { transform: rotate(360deg); } }
.vm-ring { fill: none; stroke: var(--mi); stroke-opacity: 0.25; stroke-width: 2; stroke-dasharray: 6 8; animation: vm-dash 2s linear infinite; }
@keyframes vm-dash { to { stroke-dashoffset: -28; } }
.vm-node { fill: #fff; stroke: var(--mi); stroke-width: 2; }
@media (prefers-reduced-motion: reduce) { .vm * { animation: none !important; stroke-dashoffset: 0 !important; } }
</style>
