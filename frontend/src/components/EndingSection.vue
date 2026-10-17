<template>
  <section class="end-root" ref="rootRef">
    <!-- Call to action -->
    <div class="cta-block">
      <h2 class="cta-title"><span class="cta-line">Test</span> <span class="cta-line">without</span> <span class="cta-line">limits.</span></h2>
      <p class="cta-copy end-cta-fade">Tell us the profile. We build the chamber.</p>
      <button class="cta-btn end-cta-fade" ref="btnRef" @click="$emit('build')"
        @pointermove="onBtnMove" @pointerleave="onBtnLeave">
        <span class="cta-btn-label">Build w/ Envisys</span>
        <svg viewBox="0 0 10 10" class="cta-arrow"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.4" /></svg>
      </button>
    </div>

    <footer class="end-foot end-cta-fade">
      <span>© 2026 Envisys</span>
      <nav class="end-links">
        <a href="/products">Products</a>
        <a href="/verticles">Verticles</a>
        <a href="/industries">Industries</a>
        <a href="/about">The Company</a>
        <button class="end-top" @click="toTop">Back to top ↑</button>
      </nav>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { splitChars, CH_FROM, CH_TO } from '../utils/splitChars'

defineEmits<{ (e: 'build'): void }>()

const rootRef = ref<HTMLElement | null>(null)
const btnRef = ref<HTMLElement | null>(null)

// Micro-interaction: the CTA leans toward the pointer
function onBtnMove(e: PointerEvent) {
  const el = btnRef.value!
  const r = el.getBoundingClientRect()
  gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * 0.22, y: (e.clientY - (r.top + r.height / 2)) * 0.3, duration: 0.35, ease: 'power3.out', overwrite: 'auto' })
}
function onBtnLeave() {
  gsap.to(btnRef.value, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' })
}
function toTop() {
  ;(window as any).lenisInstance?.scrollTo(0, { duration: 2.4 })
}

// This section scrolls with the page, so it reveals when it comes into view (and resets when it leaves)
let shown = false
function tick() {
  const el = rootRef.value
  if (!el) return
  const top = el.getBoundingClientRect().top
  const H = window.innerHeight
  if (!shown && top < H * 0.55) {
    shown = true
    gsap.to('.cta-line .ch', { ...CH_TO, duration: 1.1, stagger: 0.03, overwrite: true })
    gsap.to('.end-cta-fade', { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, delay: 0.35, ease: 'power2.out', overwrite: true })
  } else if (shown && top > H * 0.9) {
    shown = false
    gsap.set('.cta-line .ch', CH_FROM)
    gsap.set('.end-cta-fade', { opacity: 0, y: 14 })
  }
}

onMounted(() => {
  splitChars('.cta-line')
  gsap.set('.cta-line .ch', CH_FROM)
  gsap.set('.end-cta-fade', { opacity: 0, y: 14 })
  gsap.ticker.add(tick)
})
onUnmounted(() => gsap.ticker.remove(tick))
</script>

<style scoped>
.end-root {
  position: relative;
  height: 100vh;
  color: var(--ink, #0d2340);
}

/* ── Call to action ── */
.cta-block {
  position: absolute;
  left: 0;
  top: 46%;
  transform: translateY(-50%);
  max-width: 82vw;
}
.cta-title {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.3em;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(34px, 6.4vw, 118px);
  line-height: 1.05;
  letter-spacing: -0.04em;
}
.cta-line { display: inline-block; overflow: clip; padding-bottom: 0.08em; }
.cta-copy {
  margin: 26px 0 34px;
  font-family: var(--font-body);
  font-size: clamp(12px, 0.95vw, 15px);
  letter-spacing: -0.01em;
  opacity: 0.7;
}
.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 16px 26px;
  border: 0;
  border-radius: 7px;
  background: #0d2340;
  color: #fff;
  font-family: var(--font-body);
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  will-change: transform;
  pointer-events: auto;
  transition: color 0.3s ease;
}
.cta-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #1a6cb8;
  transform: translateY(101%);
  transition: transform 0.45s cubic-bezier(0.2, 0.9, 0.2, 1);
  z-index: -1;
}
.cta-btn:hover::before { transform: translateY(0); }
.cta-arrow { width: 11px; height: 11px; transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.2, 1); }
.cta-btn:hover .cta-arrow { transform: translate(3px, -3px); }

.end-foot {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-body);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-top: 1px solid rgba(13, 35, 64, 0.16);
  padding-top: 18px;
}
.end-foot > span { opacity: 0.6; }
.end-links { display: flex; gap: 28px; align-items: center; }
.end-links a,
.end-top {
  position: relative;
  color: inherit;
  opacity: 0.6;
  text-decoration: none;
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  pointer-events: auto;
  transition: opacity 0.25s ease;
}
.end-links a::after,
.end-top::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1);
}
.end-links a:hover,
.end-top:hover { opacity: 1; }
.end-links a:hover::after,
.end-top:hover::after { transform: scaleX(1); transform-origin: left; }

@media (max-width: 800px) {
  .end-foot { flex-direction: column; align-items: flex-start; gap: 14px; }
  .end-links { flex-wrap: wrap; gap: 14px 22px; }
}
</style>
