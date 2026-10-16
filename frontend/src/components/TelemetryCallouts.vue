<template>
  <div class="telemetry-callouts-layer" :class="{ 'is-active': isActive }">
    <div class="callouts-eyebrow callout-fade"><i></i><span>02</span><span class="callout-sep"></span><span>Anatomy</span></div>
    <div
      v-for="(item, idx) in callouts"
      :key="item.id"
      class="callout-block"
      :style="{ top: item.top, left: item.left }"
      :ref="el => setItemRef(el, idx)"
    >
      <div class="callout-meta callout-fade">
        <span class="callout-idx">{{ item.index }}</span><span class="callout-sep"></span><span>{{ item.part }}</span>
      </div>

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
          <span class="callout-pulse"></span>
          <svg class="target-reticle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Top-Left Corner -->
            <path d="M2 7V2H7" stroke="#FF6A1A" stroke-width="2" stroke-linecap="square"/>
            <!-- Top-Right Corner -->
            <path d="M17 2H22V7" stroke="#FF6A1A" stroke-width="2" stroke-linecap="square"/>
            <!-- Bottom-Left Corner -->
            <path d="M2 17V22H7" stroke="#FF6A1A" stroke-width="2" stroke-linecap="square"/>
            <!-- Bottom-Right Corner -->
            <path d="M17 22H22V17" stroke="#FF6A1A" stroke-width="2" stroke-linecap="square"/>
            <!-- Center Crosshair + -->
            <path d="M12 9V15M9 12H15" stroke="#FF6A1A" stroke-width="2" stroke-linecap="square"/>
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
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { splitChars, CH_FROM, chCascade } from '../utils/splitChars'

interface CalloutData {
  id: string
  index: string
  part: string
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
    index: '01',
    part: 'Thermal core',
    heading: 'Environmental Simulation Matrix',
    text: 'Scalable thermodynamic architecture engineered for custom extreme-stress profiles.',
    top: '20%',
    left: '12%', // Tucked slightly closer to the right (towards the chamber)
    lineWidth: 'max(460px, calc(84vw - 12%))'
  },
  {
    id: 'enclosures',
    index: '02',
    part: 'Payload volume',
    heading: 'Modular Payload Enclosures',
    text: 'Configurable testing volumes built for rapid payload integration across defense and aerospace sectors.',
    top: '46%',
    left: '5%', // Pushed furthest to the left to form the organic curve
    lineWidth: 'max(520px, calc(81vw - 5%))' // Points directly to heavy door frame & glass viewing window
  },
  {
    id: 'telemetry',
    index: '03',
    part: 'Control interface',
    heading: 'Agnostic Telemetry & Control',
    text: 'Universal PID processing with isolated digital and CAN bus passthroughs for real-time hardware diagnostics.',
    top: '78%',
    left: '11%', // Tucked slightly closer to the right (towards the chamber)
    lineWidth: 'max(470px, calc(84vw - 11%))' // Points directly to the digital touchscreen panel
  }
]

onMounted(() => {
  splitChars('.callout-heading')
  gsap.set('.callout-heading .ch', CH_FROM)
})

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
  gsap.set('.callout-heading .ch', CH_FROM)

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

  tl.to('.callout-heading .ch', chCascade(duration * 0.9, 0.018), 0.2)
  tl.fromTo('.callout-fade', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: duration * 0.7, stagger: 0.12, ease: 'power2.out' }, 0.1)

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

/* Section eyebrow + per-callout index/part label (shared system with the fleet phase) */
.callouts-eyebrow,
.callout-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-body);
  font-size: 10.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}
.callouts-eyebrow { position: absolute; top: clamp(88px, 11vh, 116px); left: 5%; font-size: 11px; }
.callouts-eyebrow i { width: 6px; height: 6px; background: var(--ember); display: block; }
.callout-meta { margin-bottom: 12px; }
.callout-idx { color: var(--ember); }
.callout-sep { width: 20px; height: 1px; background: rgba(255, 255, 255, 0.3); display: block; }

/* Target-lock pulse on each reticle */
.callout-pulse {
  position: absolute;
  inset: -8px;
  border: 1px solid var(--ember);
  border-radius: 50%;
  opacity: 0;
  animation: callout-lock 2.4s cubic-bezier(0.2, 0.6, 0.2, 1) infinite;
}
@keyframes callout-lock {
  0% { transform: scale(0.5); opacity: 0.9; }
  70%, 100% { transform: scale(1.6); opacity: 0; }
}

/* Heading: White, Semi-bold, large */
.callout-heading {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: -0.01em;
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
  filter: drop-shadow(0 0 6px rgba(255, 106, 26, 0.7));
}

/* Text: Muted gray #888888, smaller text */
.callout-text {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -0.01em;
  color: #888888;
  margin: 0;
  max-width: 320px;
  text-rendering: geometricPrecision;
}

@media (max-width: 1200px) {
  .callout-heading {
    font-size: 13px;
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
