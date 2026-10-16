<template>
  <div class="cs-root" ref="rootRef" aria-hidden="true">
    <div class="cs-text" ref="textRef">
      <p class="cs-statement">
        <template v-for="(w, i) in words" :key="i">
          <span class="cs-word" :class="w.accent">{{ w.text }}</span>{{ ' ' }}
        </template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

// Placeholder copy — grounded in fleetConfig facts (range, RH, autonomy, sectors).
const statement =
  'Every product meets its worst day here first. From −70°C to +180°C, unattended.'
const accents: Record<string, string> = { '−70°C': 'cs-cold', '+180°C': 'cs-hot' }
const words = statement.split(' ').map((text) => ({ text, accent: accents[text] ?? '' }))

const rootRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)

// Highlight follows POSITION, not time: a word is dim while it is low on the screen and lights up
// as it rises past the reading line — so the text visibly travels up the page as it is read.
let measured: { el: HTMLElement; top: number; last: number }[] = []
function measure() {
  measured = Array.from(rootRef.value!.querySelectorAll<HTMLElement>('.cs-word')).map((el) => ({
    el,
    top: el.offsetTop + el.offsetHeight / 2,
    last: -1
  }))
}

const smooth = (a: number) => a * a * (3 - 2 * a)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

function tick() {
  const root = rootRef.value
  if (!root || root.style.visibility !== 'visible') return
  const y = Number(gsap.getProperty(textRef.value!, 'y')) || 0
  const H = window.innerHeight
  for (const w of measured) {
    const wy = y + w.top
    const lit = smooth(clamp01((H * 0.8 - wy) / (H * 0.2)))
    let o = 0.2 + 0.8 * lit
    o *= clamp01((wy - H * 0.02) / (H * 0.12)) // fade out as it leaves through the top
    if (Math.abs(o - w.last) > 0.01) {
      w.el.style.opacity = o.toFixed(3)
      w.last = o
    }
  }
}

onMounted(() => {
  measure()
  document.fonts?.ready.then(measure)
  window.addEventListener('resize', measure)
  gsap.ticker.add(tick)
})
onUnmounted(() => {
  window.removeEventListener('resize', measure)
  gsap.ticker.remove(tick)
})
</script>

<style scoped>
.cs-root {
  --cs-ink: #f3f6f6;
  --cs-cold: #cfe4ea;
  --cs-hot: #ff7a2e;

  position: fixed;
  inset: 0;
  z-index: 103;
  pointer-events: none;
  visibility: hidden;
  overflow: hidden;
}
.cs-text {
  position: absolute;
  left: 7vw;
  right: 46vw; /* right column belongs to the temperature gauge */
  top: 0;
  will-change: transform;
  transform: translateY(110vh);
}
.cs-statement {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(24px, 3.4vw, 64px);
  line-height: 1.12;
  letter-spacing: -0.04em;
  color: var(--cs-ink);
  text-shadow: 0 2px 30px rgba(0, 0, 0, 0.35);
}
.cs-word {
  display: inline-block;
  opacity: 0.2;
  will-change: opacity;
}
.cs-cold { color: var(--cs-cold); }
.cs-hot { color: var(--cs-hot); }
</style>
