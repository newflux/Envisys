<template>
  <!-- Black, straight on from the customers: a tall spacer holds the stage while the track of numbered photos
       slides sideways. Photos arrive spread wide and close up to their place as they come on screen. -->
  <section class="st-root" ref="rootRef" :style="{ height: spacer + 'px' }">
    <div class="st-stage" ref="stageRef">
      <div class="st-head"><span>Bengaluru</span><h2><i v-for="(w, i) in headWords" :key="i" class="st-w" :ref="(el) => (wordEls[i] = el as HTMLElement)">{{ w }}</i></h2></div>
      <div class="st-track" ref="trackRef">
        <article v-for="(s, i) in steps" :key="s.n" class="st-card" :ref="(el) => (cardEls[i] = el as HTMLElement)">
          <div class="st-n">{{ s.n }}</div>
          <div class="st-dots"><i></i></div>
          <div class="st-img"><img :src="s.src" alt="" decoding="async" /></div>
          <p>{{ s.cap }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

// Captions describe what each photo shows (public/images/imgs → public/media)
const steps = [
  { n: '01', src: '/media/step-1.jpg', cap: 'Fabrication · brazing and joining' },
  { n: '02', src: '/media/step-2.jpg', cap: 'Refrigeration circuits' },
  { n: '03', src: '/media/step-6.jpg', cap: 'Pneumatics and air lines' },
  { n: '04', src: '/media/step-3.jpg', cap: 'Control panel wiring' },
  { n: '05', src: '/media/step-7.jpg', cap: 'Assembly on the floor' },
  { n: '06', src: '/media/step-4.jpg', cap: 'Pressure and calibration' },
  { n: '07', src: '/media/step-5.jpg', cap: 'Operator controls' },
  { n: '08', src: '/media/step-8.jpg', cap: 'Final checks' }
]

const headWords = 'End-to-end production'.split(' ')
const wordEls: HTMLElement[] = []
const cardEls: HTMLElement[] = []
const rootRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const spacer = ref(2400)
let travelX = 0

function measure() {
  const t = trackRef.value, st = stageRef.value
  if (!t || !st) return
  const lastCard = t.lastElementChild as HTMLElement | null // not scrollWidth: the arrival push would inflate it
  travelX = Math.max(0, (lastCard ? lastCard.offsetLeft + lastCard.offsetWidth : 0) - st.clientWidth + st.clientWidth * 0.1)
  spacer.value = window.innerHeight + travelX * 0.55
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number) => a * a * (3 - 2 * a)
let last = -1
function tick() {
  const root = rootRef.value, stage = stageRef.value, track = trackRef.value
  if (!root || !stage || !track) return
  const H = window.innerHeight, W = window.innerWidth
  const r = root.getBoundingClientRect()
  const travel = r.height - H
  if (r.bottom < -50 || r.top > H + 50) return
  const hold = Math.min(Math.max(-r.top, 0), travel)
  const p = clamp01(-r.top / travel)
  const key = r.top + p
  if (key === last) return
  last = key
  stage.style.transform = `translate3d(0, ${hold.toFixed(1)}px, 0)`
  // heading words light up, one after the other, as the section arrives
  const arrive = clamp01((H - r.top) / H)
  wordEls.forEach((w, i) => { if (w) w.style.opacity = (0.16 + 0.84 * clamp01((arrive * 3 - 1.2 - i * 0.5) / 0.8)).toFixed(3) })
  track.style.transform = `translate3d(${(-p * travelX).toFixed(1)}px, 0, 0)`
  track.style.setProperty('--p', p.toFixed(4)) // photos drift against the track inside their frames
  // cards still to the right of the screen are pushed further out, so they come in with a wide gap and
  // close up to their place (measured from the slot, i.e. without the push, so it never feeds back)
  const x0 = -p * travelX
  cardEls.forEach((c, i) => {
    if (!c) return
    const slot = c.offsetLeft + x0 + W * 0.05
    const k = smooth(clamp01((slot - W * 0.7) / (W * 0.5)))
    c.style.transform = `translate3d(${(k * W * 0.22 * (1 + i * 0.04)).toFixed(1)}px, 0, 0)`
  })
}

onMounted(() => {
  measure()
  window.addEventListener('resize', measure)
  document.fonts?.ready.then(measure)
  gsap.ticker.add(tick)
})
onUnmounted(() => {
  window.removeEventListener('resize', measure)
  gsap.ticker.remove(tick)
})
</script>

<style scoped>
.st-root {
  position: relative;
  overflow: clip;
  color: #fff;
}
.st-stage { position: absolute; left: 0; right: 0; top: 0; height: 100vh; will-change: transform; }
.st-head { position: absolute; left: 5vw; right: 5vw; top: 13vh; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
.st-head span { font-family: var(--font-body); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.55; }
.st-w { font-style: normal; display: inline-block; margin: 0 0.13em; }
.st-head h2 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(28px, 3.8vw, 72px); line-height: 1.04; letter-spacing: -0.04em; }

.st-track { position: absolute; left: 5vw; bottom: 12vh; display: flex; gap: 2vw; will-change: transform; }
.st-card { flex: none; width: clamp(220px, 21vw, 400px); }
.st-n { font-family: 'Doto', var(--font-body); font-weight: 600; font-size: clamp(26px, 2.4vw, 40px); line-height: 1; letter-spacing: 0.04em; opacity: 0.85; }
.st-dots { position: relative; margin: 12px 0 18px; border-top: 1px dotted rgba(255, 255, 255, 0.35); }
.st-dots i { position: absolute; left: 0; top: -4px; width: 7px; height: 7px; border-radius: 50%; background: #fff; opacity: 0.7; }
.st-img { aspect-ratio: 4 / 3; overflow: hidden; border-radius: 10px; background: #0c0d10; }
.st-img img { width: 100%; height: 100%; object-fit: cover; display: block; transform: translateX(calc((var(--p, 0) - 0.5) * -7%)) scale(1.2); filter: brightness(0.92); transition: filter 0.5s ease; }
.st-card:hover .st-img img { filter: brightness(1.04) saturate(1.1); }
.st-card p { margin: 16px 0 0; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.7; }
</style>
