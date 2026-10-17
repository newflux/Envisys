<template>
  <!-- Full-bleed film. The frame opens from an inset card to edge-to-edge as it scrolls in. -->
  <section class="fm-root" ref="rootRef">
    <div class="fm-frame" ref="frameRef">
      <video v-if="!missing" class="fm-video" :src="src" muted loop playsinline autoplay preload="metadata" @error="missing = true"></video>
      <div v-else class="fm-placeholder">
        <span>Film</span>
        <small>Drop the file at public{{ src }}</small>
      </div>
      <div class="fm-cap"><span>Envisys</span><span>In the lab</span></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const src = '/media/film.mp4'
const missing = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)

let last = -1
function tick() {
  const el = rootRef.value
  if (!el) return
  const H = window.innerHeight
  const top = el.getBoundingClientRect().top
  const raw = Math.min(1, Math.max(0, (H - top) / H))
  const p = 1 - Math.pow(1 - raw, 3)
  if (Math.abs(p - last) < 0.001) return
  last = p
  const ix = (1 - p) * 9, iy = (1 - p) * 12, r = (1 - p) * 14
  frameRef.value!.style.clipPath = `inset(${iy.toFixed(2)}% ${ix.toFixed(2)}% ${iy.toFixed(2)}% ${ix.toFixed(2)}% round ${r.toFixed(1)}px)`
}

onMounted(() => gsap.ticker.add(tick))
onUnmounted(() => gsap.ticker.remove(tick))
</script>

<style scoped>
.fm-root { position: relative; height: 100vh; }
.fm-frame { position: absolute; inset: 0; overflow: hidden; background: #050506; will-change: clip-path; }
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
    radial-gradient(ellipse 60% 50% at 30% 60%, rgba(255, 106, 26, 0.10), transparent 70%),
    radial-gradient(ellipse 50% 60% at 75% 35%, rgba(90, 150, 220, 0.10), transparent 70%),
    #060607;
}
.fm-placeholder span { font-family: var(--font-display); font-size: clamp(28px, 4vw, 72px); letter-spacing: -0.04em; color: rgba(255, 255, 255, 0.85); }
.fm-placeholder small { font-family: var(--font-body); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; }
.fm-cap { position: absolute; left: 5vw; right: 5vw; bottom: 5vh; display: flex; justify-content: space-between; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255, 255, 255, 0.7); }
</style>
