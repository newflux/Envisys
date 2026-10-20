<template>
  <!-- The industries fill the screen, held while the photos rotate on a timer; the tags sit along the bottom. -->
  <section class="in-root" ref="rootRef">
    <div class="in-stage" ref="stageRef">
      <div class="in-frame">
        <div v-for="(s, i) in slides" :key="s.id" class="in-slide" :class="{ on: i === cur, prev: i === prevIdx }" :style="{ '--g': s.bg }">
          <img v-if="!s.missing" :src="s.src" alt="" @error="s.missing = true" />
          <div class="in-grain"></div>
        </div>
        <div class="in-shade"></div>

        <div class="in-head">
          <h2 class="in-title">
            <span class="in-t1">Supporting the industries</span>
            <span class="in-t2" :key="cur">{{ slides[cur].title }}</span>
          </h2>
          <p class="in-line" :key="cur">{{ slides[cur].line }}</p>
          <a class="in-more" :href="slides[cur].href" data-cursor="VIEW">Learn more <span>→</span></a>
        </div>
        <div class="in-count"><span>{{ String(cur + 1).padStart(2, '0') }}</span>—<span>{{ String(slides.length).padStart(2, '0') }}</span></div>
      </div>

      <nav class="in-tabs">
        <button v-for="(s, i) in slides" :key="s.id" v-magnetic="0.2" :class="{ on: i === cur }" @click="go(i)">
          <i :style="{ transform: `scaleX(${i === cur ? progress : 0})` }"></i>{{ s.tab }}
        </button>
      </nav>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { vMagnetic } from '../utils/magnetic'

const INTERVAL = 3400 // ms per slide
// Photos from the shoot stand in until industry-specific photography exists (public/media/industry-<id>.jpg).
const slides = reactive([
  { id: 'automotive', tab: 'Automotive', title: 'Automotive.', line: 'Powertrain, electronics and cabin components, proven long before they reach the road.', href: '/industries', src: '/media/industry-automotive.jpg', missing: false, bg: 'radial-gradient(ellipse 70% 60% at 70% 70%, #1d5a6e 0%, #0d2733 45%, #05090c 100%)' },
  { id: 'electronics', tab: 'Electronics', title: 'Electronics.', line: 'Boards, networking and silicon held through thermal and humidity cycling.', href: '/industries', src: '/media/industry-electronics.jpg', missing: false, bg: 'radial-gradient(ellipse 70% 60% at 30% 60%, #24468f 0%, #0e1a3d 48%, #04060d 100%)' },
  { id: 'defence', tab: 'Defence', title: 'Defence.', line: 'Qualification runs that meet the standard, fully logged from start to finish.', href: '/industries', src: '/media/industry-defence.jpg', missing: false, bg: 'radial-gradient(ellipse 80% 60% at 60% 100%, #8a5a3c 0%, #2a2a33 45%, #06070a 100%)' },
  { id: 'aerospace', tab: 'Aerospace', title: 'Aerospace.', line: 'From −70°C to +180°C, and altitude chambers down to 1 mbar.', href: '/industries', src: '/media/industry-aerospace.jpg', missing: false, bg: 'radial-gradient(ellipse 75% 65% at 50% 105%, #d4733a 0%, #5a2c24 38%, #0a0b13 80%)' }
])

const rootRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const cur = ref(0)
const prevIdx = ref(-1)
const progress = ref(0)
let elapsed = 0
let last = 0
let wipe: gsap.core.Tween | null = null

function go(i: number) {
  if (i === cur.value) return
  prevIdx.value = cur.value
  cur.value = i
  elapsed = 0
  progress.value = 0
  const el = rootRef.value!.querySelectorAll<HTMLElement>('.in-slide')[i]
  wipe?.kill()
  // the new picture opens from the bottom edge while it settles from a slight zoom
  gsap.set(el, { clipPath: 'inset(100% 0% 0% 0%)', zIndex: 3 })
  wipe = gsap.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut', onComplete: () => { gsap.set(el, { clearProps: 'zIndex' }); prevIdx.value = -1 } })
  gsap.fromTo(el.querySelector('img') ?? el, { scale: 1.18 }, { scale: 1, duration: 1.8, ease: 'power3.out' })
}

function tick(time: number) {
  const root = rootRef.value, stage = stageRef.value
  if (!root || !stage) return
  const dt = Math.min(100, (time - last) * 1000) || 0
  last = time
  const H = window.innerHeight
  const r = root.getBoundingClientRect()
  if (r.bottom < -80 || r.top > H + 80) { elapsed = 0; progress.value = 0; return }
  const travel = r.height - H
  stage.style.transform = `translate3d(0, ${Math.min(Math.max(-r.top, 0), travel).toFixed(1)}px, 0)`
  // the timer only runs while the section holds most of the screen
  if (r.top > H * 0.3 || r.bottom < H * 0.7) return
  elapsed += dt
  progress.value = Math.min(1, elapsed / INTERVAL)
  if (elapsed >= INTERVAL) go((cur.value + 1) % slides.length)
}

onMounted(() => gsap.ticker.add(tick))
onUnmounted(() => { gsap.ticker.remove(tick); wipe?.kill() })
</script>

<style scoped>
.in-root { position: relative; height: 160vh; color: #fff; }
.in-stage { position: absolute; left: 0; right: 0; top: 0; height: 100vh; will-change: transform; }
.in-frame { position: absolute; inset: 0; overflow: hidden; background: #05060a; pointer-events: auto; }
.in-slide { position: absolute; inset: 0; background: var(--g); clip-path: inset(0 0 0 0); }
.in-slide:not(.on):not(.prev) { visibility: hidden; }
.in-slide img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.in-grain { position: absolute; inset: 0; opacity: 0.5; mix-blend-mode: overlay; background-image: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 90px), repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0 1px, transparent 1px 90px); }
.in-shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0, 0, 0, 0.62), transparent 58%), linear-gradient(0deg, rgba(0, 0, 0, 0.5), transparent 40%); pointer-events: none; z-index: 4; }

.in-head { position: absolute; left: 5vw; top: 13vh; z-index: 5; max-width: 46vw; }
.in-title { margin: 0; display: flex; flex-direction: column; font-family: var(--font-display); font-weight: 400; font-size: clamp(26px, 3.6vw, 68px); line-height: 1.04; letter-spacing: -0.045em; }
.in-t1 { color: rgba(255, 255, 255, 0.6); }
.in-t2 { animation: in-rise 0.9s cubic-bezier(0.2, 0.9, 0.2, 1) both; }
@keyframes in-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
.in-line { margin: 22px 0 0; max-width: 34ch; font-family: var(--font-body); font-size: clamp(13px, 1vw, 16px); line-height: 1.55; color: rgba(255, 255, 255, 0.78); animation: in-rise 0.9s cubic-bezier(0.2, 0.9, 0.2, 1) 0.12s both; }
.in-more { display: inline-block; margin-top: 26px; color: #fff; font-family: var(--font-display); font-size: clamp(14px, 1.2vw, 20px); letter-spacing: -0.03em; text-decoration: underline; text-underline-offset: 4px; pointer-events: auto; }
.in-more span { display: inline-block; transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.2, 1); }
.in-more:hover span { transform: translateX(5px); }

.in-count { position: absolute; right: 5vw; top: 13vh; z-index: 5; display: flex; gap: 8px; font-family: var(--font-body); font-size: 12px; letter-spacing: 0.14em; }

.in-tabs { position: absolute; left: 5vw; right: 5vw; bottom: 4.2vh; z-index: 6; display: flex; gap: 2.6vw; }
.in-tabs button { position: relative; background: none; border: 0; padding: 0 0 14px; color: #fff; opacity: 0.45; font-family: var(--font-body); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; pointer-events: auto; transition: opacity 0.3s ease; }
.in-tabs button:hover { opacity: 0.8; }
.in-tabs button.on { opacity: 1; }
.in-tabs button::before { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: rgba(255, 255, 255, 0.25); }
.in-tabs button i { position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: #fff; transform-origin: left; transform: scaleX(0); }

@media (max-width: 800px) { .in-head { max-width: 80vw; } }
</style>
