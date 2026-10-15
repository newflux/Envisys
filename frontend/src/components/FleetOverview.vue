<template>
  <div class="fleet-overview-container" :class="{ 'is-active': isActive }" ref="containerRef">
    <!-- SVG Vector Overlay: Dashed link connecting the 3 product tags -->
    <svg class="fleet-svg-overlay" xmlns="http://www.w3.org/2000/svg">
      <!-- Dashed Line: Tag 1 -> Tag 2 -->
      <line
        ref="line1Ref"
        class="fleet-vector-line"
        :x1="anchor1.x"
        :y1="anchor1.y"
        :x2="anchor2.x"
        :y2="anchor2.y"
      />
      <!-- Dashed Line: Tag 2 -> Tag 3 -->
      <line
        ref="line2Ref"
        class="fleet-vector-line"
        :x1="anchor2.x"
        :y1="anchor2.y"
        :x2="anchor3.x"
        :y2="anchor3.y"
      />
    </svg>

    <!-- Zone: Top-Left Title Block (Strictly above 34% viewport height) -->
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

    <!-- Zone: Top-Right Lead Paragraph (Strictly above 34% viewport height, max-width 360px, max 3 lines) -->
    <div class="fleet-lead-block">
      <p class="fleet-lead-text">
        {{ config.leadParagraph }}
      </p>
    </div>

    <!-- Product Tags with 24px vertical hairlines (Directly above each product) -->
    <div
      v-for="(chamber, idx) in config.chambers"
      :key="chamber.order"
      :ref="(el) => setTagRef(el, idx)"
      class="chamber-tag-wrapper"
      :class="{
        'is-dimmed': hoveredUnit !== null && hoveredUnit !== idx,
        'is-highlighted': hoveredUnit === idx
      }"
      :style="{ left: `${getChamberAnchor(idx).x}px`, top: `${getChamberAnchor(idx).y}px` }"
      tabindex="0"
      :aria-label="`Chamber ${chamber.order}: ${chamber.model}`"
      @click="onUnitClick(idx)"
      @keydown.enter.prevent="onUnitClick(idx)"
      @keydown.space.prevent="onUnitClick(idx)"
      @pointerenter="onHoverStart(idx)"
      @pointerleave="onHoverEnd"
      @focus="onHoverStart(idx)"
      @blur="onHoverEnd"
    >
      <div class="chamber-tag-box">
        <span class="tag-model">{{ chamber.model }}</span>
      </div>
      <!-- 24px vertical hairline extending down to product -->
      <div class="tag-vertical-hairline"></div>
    </div>

    <!-- Zone: Spec Strips (82% to 94% of viewport height, centered under each product) -->
    <div class="fleet-spec-zone">
      <div
        v-for="(chamber, idx) in config.chambers"
        :key="`spec-${chamber.order}`"
        :ref="(el) => setSpecRef(el, idx)"
        class="product-spec-strip"
        :class="{
          'is-dimmed': hoveredUnit !== null && hoveredUnit !== idx,
          'is-highlighted': hoveredUnit === idx
        }"
        :style="{ left: `${getChamberAnchor(idx).x}px` }"
        tabindex="0"
        :aria-label="`Specs for ${chamber.model}`"
        @click="onUnitClick(idx)"
        @keydown.enter.prevent="onUnitClick(idx)"
        @keydown.space.prevent="onUnitClick(idx)"
        @pointerenter="onHoverStart(idx)"
        @pointerleave="onHoverEnd"
        @focus="onHoverStart(idx)"
        @blur="onHoverEnd"
      >
        <!-- 1px hairline separator (vapour at 14%) -->
        <div class="spec-strip-hairline"></div>
        <div class="spec-strip-content">
          <span class="spec-item spec-order">{{ chamber.order }}</span>
          <span class="spec-sep">/</span>
          <span class="spec-item spec-model">{{ chamber.model }}</span>
          <span class="spec-sep">·</span>
          <span class="spec-item spec-vol">{{ chamber.volume }}</span>
          <span class="spec-sep">·</span>
          <span class="spec-item spec-temp">{{ chamber.tempRange }}</span>
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
  (e: 'unit-hover', index: number | null): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const line1Ref = ref<SVGLineElement | null>(null)
const line2Ref = ref<SVGLineElement | null>(null)
const isActive = ref(false)
const hoveredUnit = ref<number | null>(null)

const tagElements = ref<(HTMLElement | null)[]>([])
const specElements = ref<(HTMLElement | null)[]>([])

function setTagRef(el: any, idx: number) {
  tagElements.value[idx] = el as HTMLElement | null
}

function setSpecRef(el: any, idx: number) {
  specElements.value[idx] = el as HTMLElement | null
}

// Fallback anchor positions
const winW = ref(typeof window !== 'undefined' ? window.innerWidth : 1440)
const winH = ref(typeof window !== 'undefined' ? window.innerHeight : 900)

const cachedAnchors = [
  { x: 0.20 * winW.value, y: 0.36 * winH.value },
  { x: 0.50 * winW.value, y: 0.36 * winH.value },
  { x: 0.80 * winW.value, y: 0.36 * winH.value }
]

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
  const fallback = props.config.chambers[idx]?.defaultAnchor || { x: 50, y: 36 }
  return cachedAnchors[idx] || {
    x: (fallback.x / 100) * winW.value,
    y: (fallback.y / 100) * winH.value
  }
}

const anchor1 = computed(() => getChamberAnchor(0))
const anchor2 = computed(() => getChamberAnchor(1))
const anchor3 = computed(() => getChamberAnchor(2))

/**
 * High-performance direct DOM anchor updater
 * Bypasses Vue virtual DOM reconciliation completely during the 120 FPS render loop!
 */
function setProjectedAnchors(anchors: { x: number; y: number }[]) {
  if (!anchors || anchors.length < 3) return

  for (let i = 0; i < 3; i++) {
    cachedAnchors[i] = anchors[i]
    const tagEl = tagElements.value[i]
    if (tagEl) {
      tagEl.style.left = `${anchors[i].x}px`
      tagEl.style.top = `${anchors[i].y}px`
    }
    const specEl = specElements.value[i]
    if (specEl) {
      specEl.style.left = `${anchors[i].x}px`
    }
  }

  if (line1Ref.value) {
    line1Ref.value.setAttribute('x1', anchors[0].x.toString())
    line1Ref.value.setAttribute('y1', anchors[0].y.toString())
    line1Ref.value.setAttribute('x2', anchors[1].x.toString())
    line1Ref.value.setAttribute('y2', anchors[1].y.toString())
  }
  if (line2Ref.value) {
    line2Ref.value.setAttribute('x1', anchors[1].x.toString())
    line2Ref.value.setAttribute('y1', anchors[1].y.toString())
    line2Ref.value.setAttribute('x2', anchors[2].x.toString())
    line2Ref.value.setAttribute('y2', anchors[2].y.toString())
  }
}

function onUnitClick(idx: number) {
  emit('select-unit', idx)
}

function onHoverStart(idx: number) {
  hoveredUnit.value = idx
  emit('unit-hover', idx)
}

function onHoverEnd() {
  hoveredUnit.value = null
  emit('unit-hover', null)
}

let activeTl: gsap.core.Timeline | null = null

function animIn(_duration = 0.9) {
  if (activeTl) activeTl.kill()
  isActive.value = true

  const tl = gsap.timeline()
  activeTl = tl

  tl.set(containerRef.value, { opacity: 1 })

  // Headline lines slide up from mask (0.7s, 80ms apart)
  tl.fromTo(
    '.fleet-title-line',
    { y: '115%', opacity: 1 },
    { y: '0%', opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' },
    0
  )

  // Top-right lead text fades in
  tl.fromTo(
    '.fleet-lead-text',
    { opacity: 0, y: -10 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    0.1
  )

  // Tags and 24px vertical hairlines draw in
  tl.fromTo(
    '.chamber-tag-wrapper',
    { opacity: 0, y: -12 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
    0.2
  )

  tl.fromTo(
    '.tag-vertical-hairline',
    { scaleY: 0, transformOrigin: 'top center' },
    { scaleY: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
    0.25
  )

  // Dashed link draws in last
  tl.fromTo(
    '.fleet-vector-line',
    { opacity: 0 },
    { opacity: 1, duration: 0.6, ease: 'power2.out' },
    0.35
  )

  // Spec strips fade up into the 82%-94% band
  tl.fromTo(
    '.product-spec-strip',
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
    0.3
  )

  return tl
}

function animOut(duration = 0.5) {
  if (activeTl) activeTl.kill()

  const tl = gsap.timeline({
    onComplete: () => {
      isActive.value = false
      hoveredUnit.value = null
    }
  })
  activeTl = tl

  tl.to(
    '.fleet-title-line',
    { y: '-115%', opacity: 0, duration: duration * 0.7, stagger: 0.05, ease: 'power2.in' },
    0
  )

  tl.to(
    ['.fleet-vector-line', '.chamber-tag-wrapper', '.fleet-lead-text', '.product-spec-strip'],
    { opacity: 0, duration: duration * 0.5, ease: 'power2.in' },
    0.05
  )

  return tl
}

defineExpose({
  animIn,
  animOut,
  setProjectedAnchors,
  onHoverStart,
  onHoverEnd
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

/* ── Zone: Top-Left Title Block (Strictly above 34% viewport height) ── */
.fleet-header-block {
  position: absolute;
  top: clamp(65px, 8vh, 90px);
  left: 5%;
  display: flex;
  flex-direction: column;
  pointer-events: none;
  z-index: 10;
}

.fleet-headline {
  font-family: var(--font-primary, 'LayGrotesk-Semibold', sans-serif);
  font-size: clamp(32px, 3.8vw, 54px);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.02em;
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

/* ── Zone: Top-Right Lead Paragraph (Strictly above 34% viewport height, max 3 lines, max-width 360px) ── */
.fleet-lead-block {
  position: absolute;
  top: clamp(65px, 8.5vh, 92px);
  right: 5%;
  max-width: 360px;
  pointer-events: none;
  z-index: 10;
}

.fleet-lead-text {
  font-family: var(--font-primary, 'LayGrotesk-Semibold', sans-serif);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.45;
  letter-spacing: 0.02em; /* Relaxed tracking for 14px */
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-rendering: geometricPrecision;
}

/* ── Product Tags with 24px vertical hairlines ── */
.chamber-tag-wrapper {
  position: absolute;
  transform: translate(-50%, -100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  pointer-events: auto !important;
  user-select: none;
  z-index: 20;
  transition: opacity 0.25s ease, transform 0.2s ease;
  outline: none;
}

.chamber-tag-wrapper:focus-visible {
  outline: 1px solid rgba(255, 255, 255, 0.8);
  outline-offset: 3px;
}

.chamber-tag-wrapper.is-dimmed {
  opacity: 0.4;
}

.chamber-tag-box {
  background: #FFFFFF;
  color: #000000;
  padding: 4px 10px;
  border-radius: 1px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.7);
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.chamber-tag-wrapper:hover .chamber-tag-box,
.chamber-tag-wrapper.is-highlighted .chamber-tag-box {
  transform: scale(1.08);
  background: #FFFFFF;
  color: #000000;
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.6);
}

.tag-model {
  font-family: var(--font-mono, 'AkkuratMono', monospace);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em; /* Clean, open tracking */
  color: inherit;
  display: block;
  line-height: 1.2;
}

.tag-vertical-hairline {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.45);
  margin-top: 2px;
}

/* ── Zone: Spec Strips (82% to 94% of viewport height) ── */
.fleet-spec-zone {
  position: absolute;
  top: clamp(82vh, 85vh, 88vh);
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 15;
}

.product-spec-strip {
  position: absolute;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  pointer-events: auto !important;
  user-select: none;
  outline: none;
  transition: opacity 0.25s ease, transform 0.2s ease;
}

.product-spec-strip:focus-visible {
  outline: 1px solid rgba(255, 255, 255, 0.8);
  outline-offset: 4px;
}

.product-spec-strip.is-dimmed {
  opacity: 0.4;
}

.product-spec-strip:hover,
.product-spec-strip.is-highlighted {
  opacity: 1;
  transform: translateX(-50%) translateY(-2px);
}

/* 1px hairline separator (vapour at 14%) */
.spec-strip-hairline {
  width: 160px;
  height: 1px;
  background: rgba(255, 255, 255, 0.14);
  margin-bottom: 8px;
  transition: background 0.2s ease, width 0.2s ease;
}

.product-spec-strip:hover .spec-strip-hairline,
.product-spec-strip.is-highlighted .spec-strip-hairline {
  background: rgba(255, 255, 255, 0.4);
  width: 190px;
}

.spec-strip-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono, 'AkkuratMono', monospace);
  font-size: 13px;
  line-height: 1.3;
  letter-spacing: 0.04em; /* Relaxed open tracking for 13px */
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
}

.spec-order {
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.spec-model {
  color: #FFFFFF;
  font-weight: 700;
}

.spec-vol {
  color: #C8D5D8;
}

.spec-temp {
  color: #C8D5D8;
}

.spec-sep {
  color: rgba(255, 255, 255, 0.25);
  font-size: 11px;
}
</style>
