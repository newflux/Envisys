<template>
  <div class="telemetry-callouts-layer" :class="{ 'is-active': isActive }">
    <div
      v-for="(item, idx) in callouts"
      :key="item.id"
      class="callout-block"
      :style="{ top: item.top, left: item.left }"
      :ref="el => setItemRef(el, idx)"
    >
      <!-- Heading (White, Semi-bold, large) with Line Mask Entrance -->
      <div class="callout-line-mask">
        <h3 class="callout-heading callout-line">{{ item.heading }}</h3>
      </div>

      <!-- The 'Vanishing Line' Divider -->
      <div
        class="vanishing-line-wrap"
        :style="{ width: item.lineWidth }"
      >
        <div class="vanishing-line"></div>
        <!-- Target Reticle [ + ] exactly at the point on the chamber -->
        <div class="callout-target callout-dot">
          <svg class="target-reticle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Top-Left Corner -->
            <path d="M2 7V2H7" stroke="#EC5748" stroke-width="2" stroke-linecap="square"/>
            <!-- Top-Right Corner -->
            <path d="M17 2H22V7" stroke="#EC5748" stroke-width="2" stroke-linecap="square"/>
            <!-- Bottom-Left Corner -->
            <path d="M2 17V22H7" stroke="#EC5748" stroke-width="2" stroke-linecap="square"/>
            <!-- Bottom-Right Corner -->
            <path d="M17 22H22V17" stroke="#EC5748" stroke-width="2" stroke-linecap="square"/>
            <!-- Center Crosshair + -->
            <path d="M12 9V15M9 12H15" stroke="#EC5748" stroke-width="2" stroke-linecap="square"/>
          </svg>
        </div>
      </div>

      <!-- Text (Muted gray #888888, smaller text) with Line Mask Entrance -->
      <div class="callout-line-mask">
        <p class="callout-text callout-line">{{ item.text }}</p>
      </div>
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

  // Reset lines below masks
  gsap.set('.callout-line', {
    y: '115%',
    opacity: 1
  })

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

  // Kinetic typography reveal from behind mask (matching Phase 1)
  tl.to(
    '.callout-heading.callout-line',
    { y: '0%', duration: duration * 0.85, stagger: 0.15, ease: 'power3.out' },
    0.15
  )

  tl.to(
    '.callout-text.callout-line',
    { y: '0%', duration: duration * 0.8, stagger: 0.15, ease: 'power3.out' },
    0.28
  )

  return tl
}

function hide(duration = 0.45) {
  if (activeTween) activeTween.kill()

  const tl = gsap.timeline({
    onComplete: () => {
      isActive.value = false
    }
  })
  activeTween = tl

  // Slide lines out through their line masks in the same style they entered
  tl.to('.callout-line', {
    y: '-115%',
    opacity: 0,
    duration: duration * 0.6,
    stagger: 0.04,
    ease: 'power2.in'
  }, 0)

  tl.to(
    '.vanishing-line',
    {
      scaleX: 0,
      transformOrigin: 'right center',
      duration: duration * 0.7,
      ease: 'power3.in'
    },
    0.1
  )

  tl.to(
    '.callout-dot',
    {
      scale: 0,
      duration: duration * 0.4,
      ease: 'power2.in'
    },
    0.15
  )

  tl.set('.telemetry-callouts-layer', { pointerEvents: 'none' })

  return tl
}

defineExpose({
  show,
  hide
})
</script>

<style scoped>
.telemetry-callouts-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.callout-block {
  position: absolute;
  width: fit-content;
  display: flex;
  flex-direction: column;
}

/* Phase 1 Typography Line-Mask Reveal System */
.callout-line-mask {
  overflow: hidden;
  display: block;
  padding-bottom: 2px; /* Prevent font descender clipping */
}

.callout-line {
  display: block;
  transform: translateY(0%);
  will-change: transform;
}

/* Heading: White, Semi-bold, large */
.callout-heading {
  font-family: LayGrotesk-Semibold, sans-serif;
  font-size: 21px;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  margin: 0 0 8px 0;
  white-space: nowrap;
  text-rendering: geometricPrecision;
}

/* The 'Vanishing Line' Divider (Clean White Gradient, Solid at machine, Fading out to left) */
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
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.45) 30%, rgba(255, 255, 255, 0.95) 100%);
  transform-origin: right center;
  will-change: transform;
}

/* Orange Target Reticle [ + ] pointing right at the chamber */
.callout-target {
  position: absolute;
  right: -10px;
  top: -9.5px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center center;
  will-change: transform;
}

.target-reticle {
  width: 20px;
  height: 20px;
  display: block;
  filter: drop-shadow(0 0 6px rgba(236, 87, 72, 0.7));
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
