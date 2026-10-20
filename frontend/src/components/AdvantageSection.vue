<template>
  <!-- One typographic beat with a lot of empty space around it, and three numbers underneath. -->
  <section class="ad-root" ref="rootRef">
    <span class="ad-label">Our advantage</span>
    <h2 class="ad-title">
      <span v-for="(l, i) in titleLines" :key="i" class="ad-line">{{ l }}</span>
    </h2>

    <dl class="ad-facts">
      <div v-for="f in facts" :key="f.k" class="ad-fact">
        <dt>{{ f.v }}</dt>
        <dd>{{ f.k }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const titleLines = ['Engineered', 'for the worst day.']
// Listed on envisystech.com (ET series)
const facts = [
  { v: '−70 to +180°C', k: 'Temperature range' },
  { v: '10 – 95% RH', k: 'Humidity range' },
  { v: '±1°C', k: 'Held to' }
]

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number) => a * a * (3 - 2 * a)

const rootRef = ref<HTMLElement | null>(null)
function tick() {
  const H = window.innerHeight
  const rr = rootRef.value?.getBoundingClientRect()
  if (!rr || rr.bottom < -100 || rr.top > H + 100) return
  rootRef.value!.querySelectorAll<HTMLElement>('.ad-line').forEach((el) => {
    const lit = smooth(clamp01((H * 0.9 - el.getBoundingClientRect().top) / (H * 0.35)))
    el.style.opacity = (0.2 + 0.8 * lit).toFixed(3)
  })
  rootRef.value!.querySelectorAll<HTMLElement>('.ad-fact').forEach((el, i) => {
    const lit = smooth(clamp01((H * (0.95 - i * 0.04) - el.getBoundingClientRect().top) / (H * 0.25)))
    el.style.opacity = lit.toFixed(3)
    el.style.transform = `translate3d(0, ${((1 - lit) * 24).toFixed(1)}px, 0)`
  })
}
onMounted(() => gsap.ticker.add(tick))
onUnmounted(() => gsap.ticker.remove(tick))
</script>

<style scoped>
.ad-root { padding: 22vh 0 22vh; color: #fff; }
.ad-label { display: block; font-family: var(--font-body); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255, 255, 255, 0.55); margin-bottom: 28px; }
.ad-title { margin: 0; display: flex; flex-direction: column; font-family: var(--font-display); font-weight: 400; font-size: clamp(34px, 7vw, 136px); line-height: 1.0; letter-spacing: -0.055em; }
.ad-line { width: max-content; max-width: 100%; background: linear-gradient(180deg, #f6f9fc 10%, #8e9aa7 105%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; padding-bottom: 0.06em; }

.ad-facts { margin: 12vh 0 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 4vw; }
.ad-fact { border-top: 1px solid rgba(255, 255, 255, 0.18); padding-top: 22px; opacity: 0; }
.ad-fact dt { font-family: var(--font-display); font-size: clamp(20px, 2.2vw, 40px); letter-spacing: -0.04em; }
.ad-fact dd { margin: 14px 0 0; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); }

@media (max-width: 800px) { .ad-facts { grid-template-columns: 1fr; gap: 28px; } }
</style>
