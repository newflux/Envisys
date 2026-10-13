<template>
  <div class="telemetry-callouts-layer" ref="rootRef" :class="{ 'is-active': isActive }">
    <div
      v-for="(item, idx) in callouts"
      :key="item.id"
      class="callout-block"
      :style="{ top: item.top, left: item.left }"
      :ref="el => setItemRef(el, idx)"
    >
      <!-- Heading (White, Semi-bold, large) -->
      <h3 class="callout-heading">{{ item.heading }}</h3>

      <!-- The 'Vanishing Line' Divider -->
      <div
        class="vanishing-line-wrap"
        :style="{ width: item.lineWidth }"
      >
        <div class="vanishing-line"></div>
        <div class="callout-dot"></div>
      </div>

      <!-- Text (Muted gray #888888, smaller text) -->
      <p class="callout-text">{{ item.text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'

interface CalloutData {
  id: string
  heading: string
  text: string
  top: string
  left: string
  lineWidth: string
}

// 3 Callout blocks positioned in an organic engineered curve framing the machine
const callouts: CalloutData[] = [
  {
    id: 'matrix',
    heading: 'Environmental Simulation Matrix',
    text: 'Scalable thermodynamic architecture engineered for custom extreme-stress profiles.',
    top: '20%',
    left: '12%', // Tucked slightly closer to the right (towards the chamber)
    lineWidth: 'max(460px, calc(84vw - 12%))'
  },
  {
    id: 'enclosures',
    heading: 'Modular Payload Enclosures',
    text: 'Configurable testing volumes built for rapid payload integration across defense and aerospace sectors.',
    top: '46%',
    left: '5%', // Pushed furthest to the left to form the organic curve
    lineWidth: 'max(520px, calc(81vw - 5%))' // Points directly to heavy door frame & glass viewing window
  },
  {
    id: 'telemetry',
    heading: 'Agnostic Telemetry & Control',
    text: 'Universal PID processing with isolated digital and CAN bus passthroughs for real-time hardware diagnostics.',
    top: '78%',
    left: '11%', // Tucked slightly closer to the right (towards the chamber)
    lineWidth: 'max(470px, calc(84vw - 11%))' // Points directly to the digital touchscreen panel
  }
]

const rootRef = ref<HTMLElement | null>(null)
const isActive = ref(false)
const itemElements = ref<HTMLElement[]>([])

function setItemRef(el: any, idx: number) {
  if (el) itemElements.value[idx] = el
}

let activeTween: gsap.core.Timeline | null = null

function show(duration = 0.85) {
  if (activeTween) activeTween.kill()
  isActive.value = true

  const tl = gsap.timeline()
  activeTween = tl

  tl.set('.telemetry-callouts-layer', { opacity: 1, pointerEvents: 'auto' })

  // Lines shoot out from right (the machine) to left slicing under the headings
  tl.fromTo(
    '.vanishing-line',
    { scaleX: 0, transformOrigin: 'right center' },
    { scaleX: 1, duration: duration, stagger: 0.2, ease: 'expo.out' },
    0
  )

  tl.fromTo(
    '.callout-dot',
    { scale: 0 },
    { scale: 1, duration: duration * 0.45, stagger: 0.2, ease: 'back.out(2)' },
    0.1
  )

  // Fade in headers and paragraph text slightly after lines execute
  tl.fromTo(
    ['.callout-heading', '.callout-text'],
    { opacity: 0, x: -14 },
    { opacity: 1, x: 0, duration: duration * 0.75, stagger: 0.1, ease: 'power2.out' },
    0.25
  )

  return tl
}

function hide(duration = 0.4) {
  if (activeTween) activeTween.kill()

  const tl = gsap.timeline({
    onComplete: () => {
      isActive.value = false
    }
  })
  activeTween = tl

  // Retract lines back to right and fade out text
  tl.to(
    '.vanishing-line',
    { scaleX: 0, transformOrigin: 'right center', duration: duration * 0.7, stagger: 0.05, ease: 'power2.in' },
    0
  )
  tl.to(
    ['.callout-heading', '.callout-text'],
    { opacity: 0, x: -8, duration: duration * 0.6, stagger: 0.05, ease: 'power2.in' },
    0
  )
  tl.to('.telemetry-callouts-layer', { opacity: 0, duration: duration * 0.4 }, duration * 0.4)

  return tl
}

defineExpose({
  show,
  hide
})
</script>

<style scoped>
.telemetry-callouts-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 25;
  opacity: 0;
}

/* Organic curved callout block */
.callout-block {
  position: absolute;
  transform: translateY(-50%);
  pointer-events: auto;
  display: flex;
  flex-direction: column;
}

/* Heading: White, Semi-bold, large */
.callout-heading {
  font-family: LayGrotesk-Semibold, sans-serif;
  font-size: 22px;
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin: 0 0 10px 0;
  text-rendering: geometricPrecision;
  white-space: nowrap;
}

/* The 'Vanishing Line' Divider (CSS) */
.vanishing-line-wrap {
  position: relative;
  height: 1px;
  margin-bottom: 12px;
  pointer-events: none;
}

.vanishing-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  /* Solid white on the right edge, completely fading to transparent on the far left edge */
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.35) 30%, rgba(255, 255, 255, 1) 100%);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.35);
  transform-origin: right center;
  will-change: transform;
}

/* Machine targeting dot */
.callout-dot {
  position: absolute;
  right: -2px;
  top: -1.5px;
  width: 4px;
  height: 4px;
  background: #ffffff;
  border-radius: 0; /* 4px by 4px white square (border-radius: 0) */
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.9);
  transform-origin: center center;
  will-change: transform;
}

/* Text: Muted gray #888888, smaller text */
.callout-text {
  font-family: LayGrotesk-Semibold, sans-serif;
  font-size: 13.5px;
  font-weight: 400;
  line-height: 1.45;
  letter-spacing: -0.01em;
  color: #888888;
  margin: 0;
  max-width: 320px;
  text-rendering: geometricPrecision;
}

@media (max-width: 1200px) {
  .callout-heading {
    font-size: 18px;
  }
  .callout-text {
    font-size: 12px;
    max-width: 250px;
  }
}

@media (max-width: 768px) {
  .telemetry-callouts-layer {
    display: none;
  }
}
</style>
