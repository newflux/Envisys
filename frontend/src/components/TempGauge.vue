<template>
  <div class="tg-root" aria-hidden="true">
    <div class="tg-text">
      <div class="tg-state">{{ state }}</div>
      <div class="tg-num" :style="{ color: tone }">
        <span class="tg-cell tg-sign">{{ sign }}</span><span v-for="(d, i) in digits" :key="i" class="tg-cell">{{ d }}</span><span class="tg-unit">°C</span>
      </div>
    </div>
    <div class="tg-rail">
      <div class="tg-ticks"><i v-for="n in 26" :key="n" :class="{ major: (n - 1) % 5 === 0 }"></i></div>
      <div class="tg-marker" ref="markerRef" :style="{ background: tone }"></div>
      <span class="tg-lab tg-top">+180</span>
      <span class="tg-lab tg-mid">0</span>
      <span class="tg-lab tg-bot">−70</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// One persistent, minimal component: it enters with us and stays put while the page scrolls
// past it. The marker falls down a hairline rail as the chamber cools from +180 to −70.
const T_MIN = -70
const T_MAX = 180
const markerRef = ref<HTMLElement | null>(null)
const temp = ref(180)

const rounded = computed(() => Math.round(temp.value))
const sign = computed(() => (rounded.value < 0 ? '−' : rounded.value > 40 ? '+' : ' '))
const digits = computed(() => String(Math.abs(rounded.value)).split(''))
const state = computed(() => (temp.value < -5 ? 'Cold soak' : temp.value > 100 ? 'Heat soak' : 'Cooling'))
const tone = computed(() => {
  const t = temp.value
  const lerp = (a: number[], b: number[], k: number) => a.map((v, i) => Math.round(v + (b[i] - v) * k))
  const white = [244, 243, 240]
  const rgb = t < 40 ? lerp(white, [168, 216, 234], Math.min(1, (40 - t) / 90)) : lerp(white, [255, 222, 186], Math.min(1, (t - 40) / 140))
  return `rgb(${rgb.join(',')})`
})

function setTemp(t: number) {
  if (Math.abs(t - temp.value) > 0.05) temp.value = t
  if (markerRef.value) markerRef.value.style.top = `${(((T_MAX - t) / (T_MAX - T_MIN)) * 100).toFixed(2)}%`
}

defineExpose({ setTemp })
</script>

<style scoped>
.tg-root {
  position: fixed;
  right: 5vw;
  top: 50%;
  transform: translateY(-50%);
  z-index: 104;
  pointer-events: none;
  visibility: hidden;
  opacity: 0;
  display: flex;
  align-items: stretch;
  gap: clamp(18px, 2vw, 32px);
  color: #f4f3f0;
}
.tg-text { display: flex; flex-direction: column; justify-content: center; align-items: flex-end; gap: 14px; }
.tg-state {
  font-family: var(--font-body);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
}
.tg-num {
  display: flex;
  align-items: flex-start;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(44px, 5.4vw, 104px);
  line-height: 0.95;
  letter-spacing: -0.04em;
  transition: color 0.2s linear;
  text-shadow: 0 2px 30px rgba(0, 0, 0, 0.25);
}
.tg-cell { display: inline-block; width: 0.84em; text-align: center; }
.tg-sign { width: 0.92em; text-align: left; }
.tg-unit { font-size: 0.26em; margin: 0.28em 0 0 0.35em; letter-spacing: 0; color: rgba(255, 255, 255, 0.65); }

.tg-rail { position: relative; width: 46px; height: min(46vh, 420px); border-left: 1px solid rgba(255, 255, 255, 0.3); }
.tg-ticks { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; }
.tg-ticks i { display: block; height: 1px; width: 6px; background: rgba(255, 255, 255, 0.4); }
.tg-ticks i.major { width: 11px; background: rgba(255, 255, 255, 0.7); }
.tg-marker { position: absolute; left: -1px; top: 0; width: 26px; height: 2px; transform: translateY(-1px); transition: background 0.2s linear; }
.tg-lab {
  position: absolute;
  left: 18px;
  font-family: var(--font-body);
  font-size: 10px;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.55);
  transform: translateY(-50%);
}
.tg-top { top: 0; }
.tg-mid { top: 72%; }
.tg-bot { top: 100%; }

@media (max-width: 800px) {
  .tg-rail { display: none; }
  .tg-num { font-size: 44px; }
}
</style>
