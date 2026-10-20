<template>
  <div ref="rootRef" class="rc" :class="[`is-${state}`, { 'is-down': isDown, 'is-hidden': hidden }]" aria-hidden="true">
    <div ref="boxRef" class="rc-box">
      <i></i><i></i><i></i><i></i>
      <span class="rc-label">{{ label }}</span>
    </div>
    <div ref="dotRef" class="rc-dot-pos"><div class="rc-dot"></div></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

// Cursor identity: the targeting reticle from the phase-2 callouts follows the pointer.
//  · dot    — zero latency, always exactly where the pointer is
//  · reticle — trails the dot (snappy), snaps magnetically onto links/buttons,
//              expands in ember over a chamber with a label
const INTERACTIVE = 'a, button, [role="button"], .chamber-tag-wrapper, .Hero_iconDownWrapper__FfrlA'
const STICKY = 10 // px of slack around a locked element, so gaps between neighbours never drop the lock

const rootRef = ref<HTMLElement | null>(null)
const boxRef = ref<HTMLElement | null>(null)
const dotRef = ref<HTMLElement | null>(null)
const state = ref<'idle' | 'link' | 'chamber'>('idle')
const isDown = ref(false)
const hidden = ref(true)
const tagText = ref('')
const label = computed(() => (state.value === 'chamber' ? 'INSPECT' : tagText.value))

const SIZE = { idle: 30, chamber: 76 }

let locked: HTMLElement | null = null
let observer: MutationObserver | null = null

// Only lock onto things the user can actually see (opacity/visibility checked up the tree).
function isShown(el: HTMLElement | null) {
  for (let n = el; n && n !== document.body; n = n.parentElement) {
    const cs = getComputedStyle(n)
    if (cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.1) return false
  }
  return true
}

function inside(r: DOMRect, x: number, y: number, pad: number) {
  return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad
}

let last: { x: number; y: number; target: EventTarget | null } | null = null

function onMove(e: PointerEvent) {
  last = { x: e.clientX, y: e.clientY, target: e.target }
  update(e.clientX, e.clientY, e.target)
}

function update(x: number, y: number, target: EventTarget | null) {
  const box = boxRef.value!
  hidden.value = false
  dotRef.value!.style.transform = `translate3d(${x}px, ${y}px, 0)`

  // Sticky lock: a new interactive element under the pointer wins; otherwise keep the old one
  // until the pointer is clearly outside it.
  let under = (target as HTMLElement | null)?.closest?.(INTERACTIVE) as HTMLElement | null
  if (under && !isShown(under)) under = null
  const prev = locked
  if (under) locked = under
  else if (locked && !inside(locked.getBoundingClientRect(), x, y, STICKY)) locked = null

  const overChamber = !locked && document.body.classList.contains('is-hovering-chamber')
  state.value = locked ? 'link' : overChamber ? 'chamber' : 'idle'
  tagText.value = locked?.dataset.cursor ?? ''

  if (locked) {
    // Magnetic: wrap the element, pulled slightly toward the pointer
    const r = locked.getBoundingClientRect()
    const cx = r.left + r.width / 2 + (x - (r.left + r.width / 2)) * 0.1
    const cy = r.top + r.height / 2 + (y - (r.top + r.height / 2)) * 0.1
    if (locked !== prev) {
      gsap.to(box, { x: cx, y: cy, width: Math.min(r.width + 14, 360), height: Math.min(r.height + 10, 120), duration: 0.4, ease: 'expo.out', overwrite: true })
    } else {
      gsap.to(box, { x: cx, y: cy, duration: 0.25, ease: 'power3.out', overwrite: 'auto' })
    }
  } else {
    const size = overChamber ? SIZE.chamber : SIZE.idle
    gsap.to(box, { x: x, y: y, width: size, height: size, duration: overChamber ? 0.4 : 0.16, ease: overChamber ? 'expo.out' : 'power3.out', overwrite: true })
  }
}
const onDown = () => (isDown.value = true)
const onUp = () => (isDown.value = false)
const onLeave = () => (hidden.value = true)

onMounted(() => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || !boxRef.value) return
  document.documentElement.classList.add('has-reticle')
  gsap.set(boxRef.value, { xPercent: -50, yPercent: -50, width: SIZE.idle, height: SIZE.idle })
  window.addEventListener('pointermove', onMove, { passive: true })
  // The 3D hover event fires after our own pointermove: re-evaluate when it flips the body class.
  observer = new MutationObserver(() => { if (last) update(last.x, last.y, last.target) })
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
  window.addEventListener('pointerdown', onDown)
  window.addEventListener('pointerup', onUp)
  document.documentElement.addEventListener('pointerleave', onLeave)
})

onUnmounted(() => {
  observer?.disconnect()
  document.documentElement.classList.remove('has-reticle')
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerdown', onDown)
  window.removeEventListener('pointerup', onUp)
  document.documentElement.removeEventListener('pointerleave', onLeave)
})
</script>

<style scoped>
.rc {
  --c: #fff;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9998;
  pointer-events: none;
  mix-blend-mode: difference;
  opacity: 1;
  transition: opacity 0.2s ease;
}
.rc.is-hidden { opacity: 0; }
.rc.is-chamber { --c: var(--ember); mix-blend-mode: normal; }

.rc-box {
  position: absolute;
  left: 0;
  top: 0;
  will-change: transform, width, height;
}
.is-down .rc-box i { transform: scale(0.7); }

.rc-box i {
  position: absolute;
  width: 8px;
  height: 8px;
  border: 0 solid var(--c);
  transition: border-color 0.2s ease, transform 0.15s ease;
}
.rc-box i:nth-child(1) { left: 0; top: 0; border-width: 1.5px 0 0 1.5px; transform-origin: 0 0; }
.rc-box i:nth-child(2) { right: 0; top: 0; border-width: 1.5px 1.5px 0 0; transform-origin: 100% 0; }
.rc-box i:nth-child(3) { left: 0; bottom: 0; border-width: 0 0 1.5px 1.5px; transform-origin: 0 100%; }
.rc-box i:nth-child(4) { right: 0; bottom: 0; border-width: 0 1.5px 1.5px 0; transform-origin: 100% 100%; }

.rc-dot-pos {
  position: absolute;
  left: 0;
  top: 0;
  will-change: transform;
}
/* The dot is nested: the outer element carries the position, the inner one carries scale,
   so pressing never displaces it from the pointer. */
.rc-dot {
  width: 5px;
  height: 5px;
  margin: -2.5px 0 0 -2.5px;
  border-radius: 50%;
  background: var(--c);
  transition: background 0.2s ease, transform 0.2s ease;
}
.is-link .rc-dot { transform: scale(0.6); }
.is-down .rc-dot { transform: scale(1.8); }

.rc-label {
  position: absolute;
  left: 50%;
  top: calc(100% + 12px);
  transform: translateX(-50%);
  font-family: var(--font-body);
  font-size: 10px;
  letter-spacing: 0.16em;
  color: var(--c);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.is-chamber .rc-label,
.is-link .rc-label { opacity: 1; }
</style>

<style>
@media (hover: hover) and (pointer: fine) {
  html.has-reticle, html.has-reticle * { cursor: none !important; }
}
</style>
