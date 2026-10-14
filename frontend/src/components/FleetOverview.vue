<template>
  <div class="fleet-overview-container" :class="{ 'is-active': isActive }" ref="containerRef">
    <!-- SVG Tactical Vector Overlay (Dotted line connecting the 3 units, matching reference) -->
    <svg class="fleet-svg-overlay" xmlns="http://www.w3.org/2000/svg">
      <!-- Dotted Line: Unit 1 -> Unit 2 -->
      <line
        class="fleet-vector-line"
        :x1="anchor1.x"
        :y1="anchor1.y"
        :x2="anchor2.x"
        :y2="anchor2.y"
      />
      <!-- Dotted Line: Unit 2 -> Unit 3 -->
      <line
        class="fleet-vector-line"
        :x1="anchor2.x"
        :y1="anchor2.y"
        :x2="anchor3.x"
        :y2="anchor3.y"
      />
    </svg>

    <!-- Top-Left Title (Matching Image 3 Reference) -->
    <div class="fleet-header-block">
      <h2 class="fleet-headline">
        <div class="fleet-line-mask">
          <div class="fleet-line fleet-title-line">{{ config.titleLine1 }}</div>
        </div>
        <div class="fleet-line-mask">
          <div class="fleet-line fleet-title-line">{{ config.titleLine2 }}</div>
        </div>
      </h2>
    </div>

    <!-- Chamber Identification Badges: DSA012 / DSA011 / DSA013 (Solid White Box matching Image 3) -->
    <div
      v-for="(chamber, idx) in config.chambers"
      :key="chamber.badgeId"
      class="chamber-badge-box"
      :style="{ left: `${getChamberAnchor(idx).x}px`, top: `${getChamberAnchor(idx).y}px` }"
      @click="onBadgeClick(idx)"
    >
      <span class="badge-text">{{ chamber.badgeId }}</span>
    </div>

    <!-- Right-Side Specifications (Exact match to Image 3 Reference) -->
    <div class="fleet-info-side">
      <p class="fleet-lead-text">
        {{ config.leadParagraph }}
      </p>
      <div class="fleet-specs-table">
        <div 
          v-for="spec in config.specs" 
          :key="spec.label"
          class="fleet-spec-row"
        >
          <span class="spec-label">{{ spec.label }}</span>
          <span class="spec-val">{{ spec.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { defaultFleetConfig, type FleetOverviewConfig } from '../config/fleetConfig'

const props = withDefaults(
  defineProps<{
    config?: FleetOverviewConfig
  }>(),
  {
    config: () => defaultFleetConfig
  }
)

const emit = defineEmits<{
  (e: 'select-unit', index: number): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const isActive = ref(false)

// Dynamic 2D anchor positions in pixels projected from 3D chamber centers
const dynamicAnchors = ref<{ x: number; y: number }[]>([
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 }
])

const hasDynamicAnchors = ref(false)

const winW = ref(typeof window !== 'undefined' ? window.innerWidth : 1920)
const winH = ref(typeof window !== 'undefined' ? window.innerHeight : 1080)

function handleResize() {
  if (typeof window !== 'undefined') {
    winW.value = window.innerWidth
    winH.value = window.innerHeight
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

function getChamberAnchor(idx: number): { x: number; y: number } {
  if (hasDynamicAnchors.value && dynamicAnchors.value[idx]) {
    return dynamicAnchors.value[idx]
  }
  const fallback = props.config.chambers[idx]?.defaultAnchor || { x: 50, y: 50 }
  return {
    x: (fallback.x / 100) * winW.value,
    y: (fallback.y / 100) * winH.value
  }
}

const anchor1 = computed(() => getChamberAnchor(0))
const anchor2 = computed(() => getChamberAnchor(1))
const anchor3 = computed(() => getChamberAnchor(2))

function setProjectedAnchors(anchors: { x: number; y: number }[]) {
  if (anchors && anchors.length >= 3) {
    dynamicAnchors.value = anchors
    hasDynamicAnchors.value = true
  }
}

function onBadgeClick(idx: number) {
  emit('select-unit', idx)
}

let activeTl: gsap.core.Timeline | null = null

function animIn(duration = 0.9) {
  if (activeTl) activeTl.kill()
  isActive.value = true

  const tl = gsap.timeline()
  activeTl = tl

  tl.set(containerRef.value, { opacity: 1 })

  // Headline lines slide up from mask
  tl.fromTo(
    '.fleet-title-line',
    { y: '115%', opacity: 1 },
    { y: '0%', opacity: 1, duration: duration * 0.9, stagger: 0.1, ease: 'power3.out' },
    0
  )

  // Vector line reveals
  tl.fromTo(
    '.fleet-vector-line',
    { opacity: 0 },
    { opacity: 1, duration: duration * 0.8, ease: 'power2.out' },
    0.15
  )

  // Badges pop in
  tl.fromTo(
    '.chamber-badge-box',
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: duration * 0.6, stagger: 0.1, ease: 'back.out(1.5)' },
    0.2
  )

  // Right side text & specs reveal
  tl.fromTo(
    '.fleet-lead-text',
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: duration * 0.8, ease: 'power2.out' },
    0.2
  )

  tl.fromTo(
    '.fleet-spec-row',
    { opacity: 0, x: 15 },
    { opacity: 1, x: 0, duration: duration * 0.6, stagger: 0.08, ease: 'power2.out' },
    0.25
  )

  return tl
}

function animOut(duration = 0.5) {
  if (activeTl) activeTl.kill()

  const tl = gsap.timeline({
    onComplete: () => {
      isActive.value = false
    }
  })
  activeTl = tl

  tl.to(
    '.fleet-title-line',
    { y: '-115%', opacity: 0, duration: duration * 0.7, stagger: 0.05, ease: 'power2.in' },
    0
  )

  tl.to(
    ['.fleet-vector-line', '.chamber-badge-box', '.fleet-lead-text', '.fleet-spec-row'],
    { opacity: 0, duration: duration * 0.6, ease: 'power2.in' },
    0.05
  )

  return tl
}

defineExpose({
  animIn,
  animOut,
  setProjectedAnchors
})
</script>

<style scoped>
.fleet-overview-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none !important;
  z-index: 105;
  opacity: 0;
  overflow: hidden;
  user-select: none;
}

/* ── Fullscreen SVG Vector Overlay ── */
.fleet-svg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.fleet-vector-line {
  stroke: rgba(255, 255, 255, 0.45);
  stroke-width: 1.2;
  stroke-dasharray: 4 5;
  will-change: opacity;
}

/* ── Top-Left Title (Matching Image 3) ── */
.fleet-header-block {
  position: absolute;
  top: clamp(65px, 8.5vh, 90px);
  left: 4.5%;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}

.fleet-headline {
  font-family: var(--font-primary, 'LayGrotesk-Semibold', sans-serif);
  font-size: clamp(34px, 4vw, 56px);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.025em;
  color: #FFFFFF;
  margin: 0;
  text-rendering: geometricPrecision;
}

.fleet-line-mask {
  overflow: hidden;
  display: block;
  padding-top: 2px;
  padding-bottom: 6px;
}

.fleet-line {
  display: block;
  transform: translateY(0%);
  will-change: transform;
}

/* ── Chamber Identification Badges: DSA012 / DSA011 / DSA013 (Exact match to Image 3) ── */
.chamber-badge-box {
  position: absolute;
  transform: translate(-50%, -50%);
  background: #FFFFFF;
  color: #000000;
  padding: 3px 8px;
  border-radius: 1px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.7);
  cursor: pointer;
  pointer-events: auto !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  user-select: none;
  z-index: 10;
}

.chamber-badge-box:hover {
  transform: translate(-50%, -50%) scale(1.12);
  box-shadow: 0 6px 18px rgba(255, 255, 255, 0.5);
}

.badge-text {
  font-family: var(--font-mono, 'AkkuratMono', monospace);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #000000;
  display: block;
  line-height: 1.2;
}

/* ── Right-Side Specifications (Exact match to Image 3 Reference) ── */
.fleet-info-side {
  position: absolute;
  bottom: clamp(24px, 4.5vh, 48px);
  right: 4.5%;
  max-width: 470px;
  pointer-events: none;
  display: flex;
  flex-direction: column;
}

.fleet-lead-text {
  font-family: var(--font-primary, 'LayGrotesk-Semibold', sans-serif);
  font-size: clamp(13px, 1.05vw, 15px);
  font-weight: 400;
  line-height: 1.45;
  letter-spacing: -0.01em;
  color: #FFFFFF;
  margin: 0 0 20px 0;
  text-rendering: geometricPrecision;
}

.fleet-specs-table {
  display: flex;
  flex-direction: column;
}

.fleet-spec-row {
  display: grid;
  grid-template-columns: 125px 1fr;
  align-items: baseline;
  gap: 16px;
  padding: 9px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.spec-label {
  font-family: var(--font-primary, 'LayGrotesk-Semibold', sans-serif);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #FFFFFF;
}

.spec-val {
  font-family: var(--font-primary, 'LayGrotesk-Semibold', sans-serif);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: #C8D5D8;
}

/* Responsive adjustments */
@media (max-width: 900px) {
  .fleet-info-side {
    position: static;
    margin: 20px 4.5%;
    max-width: 100%;
  }
}
</style>
