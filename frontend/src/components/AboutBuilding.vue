<template>
  <!-- The two units on an aerial, full screen: a greyscale picture, two tinted buildings, one quiet route line.
       site-aerial.jpg is a Google Maps satellite screenshot taken by the team, with the labels, pins and controls painted out.
       Polygons are in the picture's own pixels (1806 x 720). Hover a building and its true colours come back. -->
  <section class="ab2" ref="secRef">
    <div class="ab2-in">
      <div class="ab2-stage" ref="stageRef">
        <img class="ab2-img" src="/media/site-aerial.jpg" alt="Aerial view of the Envisys and Vistara units in Peenya Industrial Estate, Bengaluru" />

        <!-- the same picture, in colour, shown only inside the building you point at -->
        <img v-for="(s, i) in sites" :key="'c' + s.name" class="ab2-color" :class="{ on: hot === i }" src="/media/site-aerial.jpg" alt="" aria-hidden="true" :style="{ clipPath: clip(s.poly) }" />

        <svg class="ab2-svg" :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" aria-hidden="true">
          <path :d="route" class="r-line" />
          <polygon v-for="(s, i) in sites" :key="s.name" :points="pts(s.poly)" class="b-fill" :class="{ on: hot === i }" />
          <polygon v-for="(s, i) in sites" :key="'o' + s.name" :points="pts(s.poly)" class="b-line" :class="{ on: hot === i }" />
        </svg>

        <button v-for="(s, i) in sites" :key="'b' + s.name" class="ab2-hit" :style="hitStyle(s.poly)" :aria-label="`${s.name}, ${s.role}`" data-cursor="" @pointerenter="hot = i" @pointerleave="hot = -1" @focus="hot = i" @blur="hot = -1">
          <span class="ab2-chip" :class="{ on: hot === i }"><b>{{ s.name }}</b><em>{{ s.role }}</em><small>{{ s.addr }}</small></span>
        </button>
      </div>

      <div class="ab2-shade"></div>
      <div class="ab2-head rv">
        <span>The sites</span>
        <p>Built here. Tested one street away.</p>
      </div>
      <p class="ab2-credit">Satellite imagery · Google</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const W = 1806, H = 720
type P = [number, number]
// Envisys is the building the map pin sat on; Vistara is the one the red pin marked
const sites: { name: string; role: string; addr: string; poly: P[] }[] = [
  { name: 'Envisys', role: 'Manufacturing unit · SB-58', addr: 'SB-58, 2nd Cross Road, 1st Stage, Peenya Industrial Estate, Bengaluru 560058', poly: [[944, 262], [978, 268], [940, 346], [922, 376], [910, 368], [903, 322]] },
  { name: 'Vistara', role: 'Testing service unit · SB-118', addr: 'SB-118, 3rd Cross Road, 1st Stage, Peenya Industrial Estate, Bengaluru 560058', poly: [[770, 586], [800, 582], [806, 625], [790, 648], [748, 640], [752, 598]] }
]
const hot = ref(-1)
const pts = (p: P[]) => p.map((q) => q.join(',')).join(' ')
const clip = (p: P[]) => `polygon(${p.map(([x, y]) => `${((x / W) * 100).toFixed(2)}% ${((y / H) * 100).toFixed(2)}%`).join(',')})`
const hitStyle = (p: P[]) => {
  const xs = p.map((q) => q[0]), ys = p.map((q) => q[1])
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys)
  return { left: `${(x0 / W) * 100}%`, top: `${(y0 / H) * 100}%`, width: `${((x1 - x0) / W) * 100}%`, height: `${((y1 - y0) / H) * 100}%` }
}
const centre = (p: P[]): P => [p.reduce((a, q) => a + q[0], 0) / p.length, p.reduce((a, q) => a + q[1], 0) / p.length]
const route = computed(() => {
  const a = centre(sites[0].poly), b = centre(sites[1].poly)
  return `M${a[0]} ${a[1]} Q${(a[0] + b[0]) / 2 + 60} ${(a[1] + b[1]) / 2 - 20} ${b[0]} ${b[1]}`
})

const secRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
let pc = 0
// the picture settles from a slight zoom while the section is pinned
function tick() {
  const r = secRef.value!.getBoundingClientRect(), vh = window.innerHeight
  if (r.bottom < 0 || r.top > vh) return
  const p = clamp01(-r.top / (r.height - vh))
  pc += (p - pc) * 0.1
  const e = 1 - Math.pow(1 - clamp01(pc * 1.4), 3)
  stageRef.value!.style.transform = `translate(-50%, -50%) scale(${(1.14 - 0.14 * e).toFixed(4)})`
}
onMounted(() => gsap.ticker.add(tick))
onUnmounted(() => gsap.ticker.remove(tick))
</script>

<style scoped>
.ab2 { position: relative; height: 200vh; background: #000; color: #fff; }
.ab2-in { position: sticky; top: 0; height: 100vh; overflow: hidden; background: #0a0a0c; }
.rv { opacity: 0; transform: translateY(24px); transition: opacity 1s ease var(--d, 0s), transform 1.2s var(--ease, cubic-bezier(0.2, 0.9, 0.2, 1)) var(--d, 0s); }
.rv.in { opacity: 1; transform: none; }

/* the picture covers the whole screen, whatever its shape */
.ab2-stage { position: absolute; left: 50%; top: 50%; width: max(100vw, 250.84vh); aspect-ratio: 1806 / 720; transform: translate(-50%, -50%) scale(1.14); will-change: transform; }
.ab2-img { position: absolute; inset: 0; width: 100%; height: 100%; display: block; filter: grayscale(1) contrast(1.1) brightness(0.74); }
.ab2-color { position: absolute; inset: 0; width: 100%; height: 100%; display: block; opacity: 0; transition: opacity 0.5s ease; pointer-events: none; }
.ab2-color.on { opacity: 1; }
.ab2-shade { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, #000 0, rgba(0, 0, 0, 0.55) 18%, transparent 38%), linear-gradient(0deg, #000 0, transparent 22%), radial-gradient(130% 120% at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.75) 100%); }

.ab2-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.ab2-svg path { fill: none; vector-effect: non-scaling-stroke; stroke-linecap: round; }
.r-line { stroke: rgba(255, 130, 90, 0.85); stroke-width: 1.2; stroke-dasharray: 3 8; animation: ab2-flow 2.4s linear infinite; }
@keyframes ab2-flow { to { stroke-dashoffset: -22; } }
.b-fill { fill: rgba(255, 80, 45, 0.26); transition: fill 0.4s ease; }
.b-fill.on { fill: rgba(255, 80, 45, 0.1); }
.b-line { fill: none; stroke: rgba(255, 130, 90, 0.9); stroke-width: 1.3; vector-effect: non-scaling-stroke; stroke-linejoin: round; transition: stroke 0.4s ease; }
.b-line.on { stroke: #fff; }

.ab2-hit { position: absolute; padding: 0; border: 0; background: transparent; cursor: pointer; }
.ab2-hit:focus-visible { outline: 1px dashed #fff; outline-offset: 6px; }
.ab2-chip { position: absolute; left: 50%; bottom: calc(100% + 18px); translate: -50% 8px; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; width: max-content; max-width: 280px; padding: 12px 16px; border-radius: 10px; background: rgba(12, 12, 14, 0.82); border: 1px solid rgba(255, 255, 255, 0.16); backdrop-filter: blur(10px); color: #fff; text-align: left; opacity: 0; pointer-events: none; transition: opacity 0.35s ease, translate 0.5s var(--ease, ease); }
.ab2-chip.on { opacity: 1; translate: -50% 0; }
.ab2-chip b { font-weight: 400; font-family: var(--font-display); font-size: 18px; letter-spacing: -0.04em; }
.ab2-chip em { font-style: normal; font-family: var(--font-body); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: #ff8a5a; }
.ab2-chip small { font-family: var(--font-body); font-size: 9px; line-height: 1.6; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.65; }

/* small and centred, like a caption on a plate */
.ab2-head { position: absolute; left: 50%; top: 13vh; translate: -50% 0; display: flex; flex-direction: column; align-items: center; gap: 1.4vh; text-align: center; pointer-events: none; }
.ab2-head span { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.6; }
.ab2-head p { margin: 0; font-family: var(--font-display); font-size: clamp(18px, 1.7vw, 30px); line-height: 1.2; letter-spacing: -0.045em; }
.ab2-credit { position: absolute; right: 2vw; bottom: 3vh; margin: 0; font-family: var(--font-body); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.35; pointer-events: none; }

@media (max-width: 800px) {
  .ab2-chip small { display: none; }
}
</style>
