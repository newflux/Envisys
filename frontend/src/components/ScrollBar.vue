<template>
  <!-- A hairline scrollbar on the right edge: shows while scrolling or hovered, fades when idle, and can be dragged. -->
  <div class="sb" :class="{ on: active || dragging }" @pointerenter="hover = true" @pointerleave="hover = false">
    <div class="sb-thumb" ref="thumbRef" @pointerdown="startDrag"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const thumbRef = ref<HTMLElement | null>(null)
const hover = ref(false)
const moving = ref(false)
const dragging = ref(false)
const active = computed(() => hover.value || moving.value)

const MIN = 36 // px, smallest thumb
let lastY = -1
let idle: ReturnType<typeof setTimeout> | undefined

function metrics() {
  const sc = document.getElementById('scroller')
  const lenis = (window as any).lenisInstance
  const max = sc ? sc.scrollHeight - sc.clientHeight : 0
  const H = window.innerHeight
  const th = Math.max(MIN, (H * H) / Math.max(H, max + H))
  return { y: lenis?.scroll ?? sc?.scrollTop ?? 0, max, th, track: H - th }
}

function tick() {
  const { y, max, th, track } = metrics()
  if (y === lastY || !thumbRef.value) return
  if (lastY >= 0) {
    moving.value = true
    clearTimeout(idle)
    idle = setTimeout(() => (moving.value = false), 1200)
  }
  lastY = y
  thumbRef.value.style.height = `${th.toFixed(1)}px`
  thumbRef.value.style.transform = `translate3d(0, ${(max ? (y / max) * track : 0).toFixed(1)}px, 0)`
}

function startDrag(e: PointerEvent) {
  const { y, max, track } = metrics()
  if (!max) return
  dragging.value = true
  const y0 = e.clientY, s0 = y
  const move = (ev: PointerEvent) => {
    const target = Math.min(max, Math.max(0, s0 + ((ev.clientY - y0) / track) * max))
    ;(window as any).lenisInstance?.scrollTo(target, { immediate: true })
  }
  const up = () => {
    dragging.value = false
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  e.preventDefault()
}

onMounted(() => gsap.ticker.add(tick))
onUnmounted(() => { gsap.ticker.remove(tick); clearTimeout(idle) })
</script>

<style scoped>
.sb { position: fixed; top: 0; right: 0; bottom: 0; width: 14px; z-index: 2000; mix-blend-mode: difference; opacity: 0; transition: opacity 0.6s ease; }
.sb.on { opacity: 1; }
.sb-thumb { position: absolute; top: 0; right: 4px; width: 2px; border-radius: 2px; background: #fff; opacity: 0.55; cursor: grab; transition: width 0.3s cubic-bezier(0.2, 0.9, 0.2, 1), opacity 0.3s ease; will-change: transform; }
.sb:hover .sb-thumb, .sb.on .sb-thumb:active { width: 4px; opacity: 0.9; }
.sb-thumb:active { cursor: grabbing; }
</style>
