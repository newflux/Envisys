<template>
  <!-- The film rises with the page at about two thirds of the screen, grows to cover all of it as you scroll
       (the picture settles from a slight zoom while it grows), then stays put while the next section slides over it. -->
  <section class="fm-root" ref="rootRef">
    <div class="fm-stage" ref="stageRef">
      <div class="fm-frame" ref="frameRef">
        <div class="fm-vid" ref="vidRef">
          <video v-if="!missing" :key="cur" class="fm-video" :src="cur" muted loop playsinline autoplay preload="metadata" @error="onError"></video>
          <div v-else class="fm-placeholder">
            <span>Film</span>
            <small>Drop the file at public{{ src }}</small>
          </div>
        </div>
        <div class="fm-cap" ref="capRef"><span>Envisys</span><span>{{ caption }}</span></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

// shortcut: the fallback is a stand-in clip from the hero composites, until the real film is at public/media/film.mp4
const props = withDefaults(defineProps<{ src?: string; fallback?: string; caption?: string }>(), { src: '/media/film.mp4', fallback: '/videos/composites/A02.mp4', caption: 'In the lab' })
const cur = ref(props.src)
const missing = ref(false)
function onError() {
  if (props.fallback && cur.value !== props.fallback) cur.value = props.fallback
  else missing.value = true
}
const rootRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const vidRef = ref<HTMLElement | null>(null)
const capRef = ref<HTMLElement | null>(null)

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const inOut = (a: number) => (a < 0.5 ? 4 * a * a * a : 1 - Math.pow(-2 * a + 2, 3) / 2)

let last = ''
function tick() {
  const root = rootRef.value, stage = stageRef.value
  if (!root || !stage) return
  const H = window.innerHeight
  const r = root.getBoundingClientRect()
  if (r.bottom < -80 || r.top > H + 80) { root.dataset.dark = ''; last = ''; return }
  const travel = r.height - H
  stage.style.transform = `translate3d(0, ${Math.min(Math.max(-r.top, 0), travel).toFixed(1)}px, 0)`
  // 0 → 1 over the pinned stretch: the growth, then the full frame held while the next section covers it
  const p = clamp01(-r.top / travel)
  const e = inOut(clamp01(p / 0.3))
  const inset = 17 * (1 - e), rad = 18 * (1 - e)
  const key = `${e.toFixed(4)}|${r.top < 44 && r.bottom > 44}`
  if (key === last) return
  last = key
  frameRef.value!.style.clipPath = `inset(${inset.toFixed(2)}% round ${rad.toFixed(1)}px)`
  vidRef.value!.style.transform = `scale(${(1 + (1 - e) * 0.18).toFixed(4)})`
  capRef.value!.style.opacity = clamp01((e - 0.85) / 0.15).toFixed(3)
  root.dataset.dark = e > 0.7 && r.top < 44 && r.bottom > 44 ? '1' : '' // tells the nav to turn light
}

onMounted(() => gsap.ticker.add(tick))
onUnmounted(() => gsap.ticker.remove(tick))
</script>

<style scoped>
.fm-root { position: relative; height: 280vh; }
.fm-stage { position: absolute; left: 0; right: 0; top: 0; height: 100vh; will-change: transform; }
.fm-frame { position: absolute; inset: 0; overflow: hidden; background: #050506; will-change: clip-path; clip-path: inset(17% round 18px); }
.fm-vid { position: absolute; inset: 0; will-change: transform; }
.fm-video { width: 100%; height: 100%; object-fit: cover; display: block; }
.fm-placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.5);
  background:
    radial-gradient(ellipse 60% 50% at 30% 60%, rgba(255, 106, 26, 0.12), transparent 70%),
    radial-gradient(ellipse 50% 60% at 75% 35%, rgba(90, 150, 220, 0.14), transparent 70%),
    #060607;
}
.fm-placeholder span { font-family: var(--font-display); font-size: clamp(28px, 4vw, 72px); letter-spacing: -0.04em; color: rgba(255, 255, 255, 0.85); }
.fm-placeholder small { font-family: var(--font-body); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; }
.fm-cap { position: absolute; left: 5vw; right: 5vw; bottom: 5vh; display: flex; justify-content: space-between; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255, 255, 255, 0.7); opacity: 0; }
</style>
