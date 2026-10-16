<template>
  <div class="Hero_overlayWrapper">
    <div class="Hero_content__nG8Ry">
      <!-- 01 eyebrow: same system as phases 2, 3, 4, 5 -->
      <div class="hero-eyebrow"><i></i><span>01</span><span class="hero-eyebrow-sep"></span><span>Environmental test systems</span></div>

      <!-- Bottom-Left Title -->
      <h1 class="Hero_title__FZMTC Hero_medium__iqLWV">
        <div class="line-mask">
          <div class="line"><span>Reimagining</span></div>
        </div>
        <div class="line-mask">
          <div class="line">
            <span>the environment.</span>
          </div>
        </div>
      </h1>

      <!-- Middle-Right Text Block -->
      <div class="Hero_text__cn7Li">
        <span class="Hero_primaryText">
          <div class="line-mask">
            <div class="line">Pioneering environmental test chambers and simulation </div>
          </div>
          <div class="line-mask">
            <div class="line">systems engineered for extreme reliability.</div>
          </div>
        </span>
        <span class="Hero_strong__AKPn_">
          <div class="line-mask">
            <div class="line">Empowering aerospace, automotive, and defense </div>
          </div>
          <div class="line-mask">
            <div class="line">to test without limits.</div>
          </div>
        </span>
      </div>

      <!-- Bottom-Right Down Scroll Pill -->
      <div class="Hero_iconDownWrapper__FfrlA" ref="downBtnRef" @click="handleScrollDown">
        <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.19446 6.1047L-3.77517e-05 4.4422V6.1047L4.73476 9.6824L9.46956 6.1047V4.4422L7.27506 6.1047C6.61006 6.6101 5.99826 7.0756 5.43966 7.5278V4.19149e-06H4.05646V7.5411C3.60426 7.1687 2.97916 6.6899 2.19446 6.1047Z" fill="white"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { splitChars, CH_FROM, chCascade } from '../utils/splitChars'

const downBtnRef = ref<HTMLElement | null>(null)

onMounted(() => splitChars('.Hero_title__FZMTC .line > span'))

const emit = defineEmits<{
  (e: 'scroll-down'): void
}>()

function handleScrollDown() {
  emit('scroll-down')
}

function playEntrance() {
  const tl = gsap.timeline()

  // Reset lines below line mask
  gsap.set(['.Hero_title__FZMTC .line', '.Hero_text__cn7Li .line'], {
    y: '115%',
    opacity: 1
  })
  gsap.set(downBtnRef.value, {
    opacity: 0,
    scale: 0.8
  })
  gsap.fromTo('.hero-eyebrow', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'power2.out' })

  // Animate title lines upward with crisp timing
  tl.to('.Hero_title__FZMTC .line', {
    y: '0%',
    duration: 0.85,
    stagger: 0.08,
    ease: 'power3.out'
  }, 0.05)
  // Signature character cascade on top of the line reveal
  gsap.set('.Hero_title__FZMTC .ch', CH_FROM)
  tl.to('.Hero_title__FZMTC .ch', chCascade(0.9, 0.02), 0.1)

  // Animate description lines upward
  tl.to('.Hero_text__cn7Li .line', {
    y: '0%',
    duration: 0.8,
    stagger: 0.06,
    ease: 'power3.out'
  }, 0.15)

  // Animate down button pill in
  tl.to(downBtnRef.value, {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: 'power2.out'
  }, 0.3)

  return tl
}

function playExit(duration = 0.45) {
  const tl = gsap.timeline()

  // Slide lines out through their line masks in the same style they entered
  tl.to('.Hero_title__FZMTC .line', {
    y: '-115%',
    opacity: 0,
    duration,
    stagger: 0.04,
    ease: 'power2.in'
  }, 0)

  tl.to('.Hero_text__cn7Li .line', {
    y: '-115%',
    opacity: 0,
    duration: duration * 0.9,
    stagger: 0.03,
    ease: 'power2.in'
  }, 0)

  tl.to(downBtnRef.value, {
    opacity: 0,
    scale: 0.7,
    duration: duration * 0.7,
    ease: 'power2.in'
  }, 0)

  return tl
}

defineExpose({
  playEntrance,
  playExit
})
</script>

<style scoped>
.Hero_overlayWrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
}

.Hero_content__nG8Ry {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Ember eyebrow — shared label system across phases */
.hero-eyebrow {
  position: absolute;
  top: clamp(88px, 11vh, 116px);
  left: 5%;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-body);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  opacity: 0;
}
.hero-eyebrow i { width: 6px; height: 6px; background: var(--ember); display: block; }
.hero-eyebrow-sep { width: 22px; height: 1px; background: rgba(255, 255, 255, 0.35); display: block; }

/* Bottom-Left Title (The Tagline) */
.Hero_title__FZMTC {
  position: absolute;
  bottom: calc(28 * var(--vr, 1px));
  left: calc(24 * var(--vr, 1px));
  font-family: var(--font-display);
  font-weight: 400;
  font-style: normal;
  font-size: 25px;
  line-height: 1.18;
  letter-spacing: -0.02em;
  text-rendering: geometricPrecision;
  color: #fff;
  margin: 0;
  pointer-events: none;
}

.line-mask {
  position: relative;
  display: block;
  text-align: start;
  overflow: clip;
}

.Hero_title__FZMTC .line {
  display: block;
  will-change: transform;
  transform: translateY(115%);
}

.Hero_noWrap__jJtUA {
  white-space: nowrap;
}

.Hero_trademark__LT07p {
  font-family: var(--font-display);
  font-size: calc(30 * var(--vr, 1px) * 0.8);
  line-height: calc(88 / 100 * 30 * var(--vr, 1px) * 0.8);
  letter-spacing: calc(-0.45 * var(--vr, 1px));
  display: inline-block;
  vertical-align: super;
  transform: translateX(-25%);
}

/* Middle-Right Text Block */
.Hero_text__cn7Li {
  position: absolute;
  top: 57%;
  right: calc(24 * var(--vr, 1px));
  transform: translateY(-50%);
  width: calc(453 * var(--vr, 1px));
  font-family: var(--font-body);
  font-weight: 400;
  font-style: normal;
  font-size: calc(13 * var(--vr, 1px));
  line-height: calc(140 / 100 * 13 * var(--vr, 1px));
  letter-spacing: -0.01em;
  text-rendering: geometricPrecision;
  color: #fff;
  pointer-events: none;
}

.Hero_primaryText {
  display: block;
  margin-bottom: calc(8 * var(--vr, 1px));
}

.Hero_text__cn7Li span.Hero_strong__AKPn_ {
  color: rgba(248, 248, 248, 0.5);
  display: block;
}

.Hero_text__cn7Li .line {
  display: block;
  will-change: transform;
  transform: translateY(115%);
}

/* Bottom-Right Down Arrow Pill */
.Hero_iconDownWrapper__FfrlA {
  position: absolute;
  bottom: calc(24 * var(--vr, 1px));
  right: calc(20 * var(--vr, 1px));
  width: calc(44 * var(--vr, 1px));
  height: calc(28 * var(--vr, 1px));
  border-radius: calc(8 * var(--vr, 1px));
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(43px);
  -webkit-backdrop-filter: blur(43px);
  cursor: pointer;
  pointer-events: auto;
  opacity: 0;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.Hero_iconDownWrapper__FfrlA:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(2px);
}

.Hero_iconDownWrapper__FfrlA svg {
  width: calc(10 * var(--vr, 1px));
  height: auto;
}

@media (max-width: 768px) {
  .Hero_title__FZMTC {
    font-size: calc(36 * var(--vr, 1px));
    line-height: calc(98 / 100 * 36 * var(--vr, 1px));
    bottom: calc(180 * var(--vr, 1px));
    left: calc(16 * var(--vr, 1px));
  }

  .Hero_text__cn7Li {
    top: auto;
    bottom: calc(60 * var(--vr, 1px));
    right: auto;
    left: calc(16 * var(--vr, 1px));
    transform: none;
    width: calc(100% - 32px);
    font-size: calc(14 * var(--vr, 1px));
  }

  .Hero_iconDownWrapper__FfrlA {
    right: calc(16 * var(--vr, 1px));
    bottom: calc(16 * var(--vr, 1px));
  }
}
</style>
