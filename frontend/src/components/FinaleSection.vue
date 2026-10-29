<template>
  <div class="fn-root tr-black tr-cont">
    <!-- The cover: everything above the footer. It slides up like a shutter over the footer, which holds still behind it. -->
    <div class="fn-cover">
    <!-- the closing statement, in type, with plenty of room -->
    <section class="fn-state">
      <h2 class="fn-h">
        <span v-for="(w, i) in headWords" :key="i" class="fn-w">{{ w }}</span>
      </h2>
      <div class="fn-col">
        <p class="fn-lead rv">Envisys designs and builds environmental test chambers, end to end, in Bengaluru.</p>
        <p class="fn-grey rv" style="--d: 0.1s">−70°C to +180°C and 10–95% RH, held to ±1°C. Standard sizes from 150 to 3000 litres, or built to your spec.</p>
        <button class="fn-big rv" style="--d: 0.2s" v-magnetic="0.15" data-cursor="BUILD" @click="$emit('build')">
          <span>Build w/ Envisys</span>
          <svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.2" /></svg>
        </button>
      </div>
    </section>

    <!-- what a test needs -->
    <section class="fn-needs">
      <h2 class="fn-h2 rv">Everything a test needs.</h2>
      <div class="fn-bento">
        <article class="fn-card dark rv">
          <div class="fn-top"><h3>A new way to test</h3><p>What sets Envisys apart</p></div>
          <a href="/about" data-cursor="VIEW">Learn more <span>→</span></a>
        </article>
        <article v-for="(c, i) in cards" :key="c.t" class="fn-card rv" :class="{ dark: c.dark }" :style="{ '--d': (i + 1) * 0.07 + 's' }">
          <svg class="fn-ico" viewBox="0 0 48 48" v-html="c.icon"></svg>
          <div class="fn-top"><h3>{{ c.t }}</h3><p>{{ c.d }}</p></div>
        </article>
      </div>
    </section>

    <!-- two doors -->
    <section class="fn-tiles">
      <a v-for="(t, i) in tiles" :key="t.name" class="fn-tile rv" :style="{ '--d': i * 0.1 + 's' }" :href="t.href" data-cursor="OPEN">
        <img :src="t.img" alt="" loading="lazy" />
        <span class="fn-glass">{{ t.name }} <i>→</i></span>
      </a>
    </section>
    </div>

    <SiteFooter @build="$emit('build')" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { vMagnetic } from '../utils/magnetic'
import SiteFooter from './SiteFooter.vue'

defineEmits<{ (e: 'build'): void }>()

// Every figure is listed on envisystech.com (ET series).
const cards = [
  { t: 'Wide envelope', d: '−70 to +180°C and 10–95% RH.', dark: false, icon: '<path d="M20 8a4 4 0 0 1 8 0v20a8 8 0 1 1-8 0z"/><path d="M24 16v16"/>' },
  { t: 'Precise control', d: '±1°C temperature and ±3% RH.', dark: true, icon: '<circle cx="24" cy="24" r="16"/><circle cx="24" cy="24" r="9"/><circle cx="24" cy="24" r="2"/>' },
  { t: 'Fast ramps', d: 'Up to 3°C/min standard, 20°C/min optional.', dark: false, icon: '<path d="M10 38L38 10"/><path d="M20 10h18v18"/>' },
  { t: 'Control from anywhere', d: 'A touch programmer with a built-in web server and 99 stored programs.', dark: false, icon: '<rect x="15" y="6" width="18" height="36" rx="3"/><path d="M21 36h6"/>' },
  { t: 'Built to your spec', d: '150 to 3000 litres, walk-in, drive-in or fully custom.', dark: false, icon: '<path d="M24 6l16 9v18l-16 9-16-9V15z"/><path d="M8 15l16 9 16-9"/><path d="M24 24v18"/>' }
]
const headWords = 'Built around the test you have to pass.'.split(' ')
const tiles = [
  { name: 'Products', href: '/products', img: '/media/tile-products.jpg' },
  { name: 'Industries', href: '/industries', img: '/media/tile-industries.jpg' }
]

// Reveals: things rise in as they enter and reset when they leave, so scrolling back replays them.
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number) => a * a * (3 - 2 * a)
let rv: HTMLElement[] = []
let words: HTMLElement[] = []
function tick() {
  if (!rv.length) {
    rv = Array.from(document.querySelectorAll<HTMLElement>('.fn-root .rv'))
    words = Array.from(document.querySelectorAll<HTMLElement>('.fn-w'))
  }
  const H = window.innerHeight
  for (const el of rv) {
    const r = el.getBoundingClientRect()
    if (r.top < H * 0.9 && r.bottom > 0) el.classList.add('in')
    else if (r.top > H * 1.1) el.classList.remove('in')
  }
  for (const w of words) {
    const top = w.getBoundingClientRect().top
    if (top > H * 1.3 || top < -H * 0.3) continue
    w.style.opacity = (0.16 + 0.84 * smooth(clamp01((H * 0.86 - top) / (H * 0.3)))).toFixed(3)
  }
}
onMounted(() => gsap.ticker.add(tick))
onUnmounted(() => gsap.ticker.remove(tick))
</script>

<style scoped>
.fn-root {
  --ink: #f3f6fa;
  position: relative;
  margin: 0 -5vw;
  color: var(--ink);
  background: #000;
}

.rv { opacity: 0; transform: translateY(30px); transition: opacity 0.9s ease var(--d, 0s), transform 1.1s cubic-bezier(0.2, 0.9, 0.2, 1) var(--d, 0s); }
.rv.in { opacity: 1; transform: none; }

/* statement */
.fn-state { display: grid; grid-template-columns: 1.15fr 1fr; gap: 6vw; padding: 24vh 5vw 20vh; align-items: start; }
.fn-h { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(34px, 5.4vw, 104px); line-height: 1.02; letter-spacing: -0.05em; }
.fn-w { display: inline-block; margin-right: 0.24em; }
.fn-col { padding-top: 2.4vw; max-width: 30em; }
.fn-lead { margin: 0; font-family: var(--font-display); font-size: clamp(17px, 1.5vw, 27px); line-height: 1.22; letter-spacing: -0.035em; }
.fn-grey { margin: 24px 0 0; font-family: var(--font-body); font-size: clamp(13px, 1vw, 16px); line-height: 1.55; opacity: 0.55; }
.fn-big { margin-top: 16vh; position: relative; overflow: hidden; isolation: isolate; display: flex; align-items: center; justify-content: space-between; gap: 24px; width: min(26vw, 380px); min-width: 260px; height: clamp(96px, 12vh, 140px); padding: 0 34px; border: 0; border-radius: 60px; background: #fff; color: #090d14; font-family: var(--font-body); font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; pointer-events: auto; will-change: transform; }
.fn-big::before { content: ''; position: absolute; inset: 0; z-index: -1; background: #cfe3f6; transform: translateY(101%); transition: transform 0.55s cubic-bezier(0.2, 0.9, 0.2, 1); }
.fn-big:hover::before { transform: none; }
.fn-big svg { width: 14px; height: 14px; transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1); }
.fn-big:hover svg { transform: translate(4px, -4px); }


/* 2 · bento */
.fn-needs { padding: 6vh 5vw 14vh; }
.fn-h2 { margin: 0 auto 12vh; text-align: center; font-family: var(--font-display); font-weight: 400; font-size: clamp(30px, 4.4vw, 84px); line-height: 1.04; letter-spacing: -0.05em; }
.fn-bento { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.fn-card { position: relative; height: clamp(230px, 31vh, 320px); border-radius: 14px; padding: 26px; display: flex; flex-direction: column; justify-content: space-between; background: #0c0f15; border: 1px solid rgba(255, 255, 255, 0.08); color: #f3f6fa; transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1), background 0.4s ease, color 0.4s ease, opacity 0.9s ease var(--d, 0s); }
.fn-card.rv.in { transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1), background 0.4s ease, color 0.4s ease, opacity 0.9s ease var(--d, 0s); }
.fn-card:hover { transform: translateY(-6px); }
.fn-card.dark { background: #e9eef4; color: #0d2340; border-color: transparent; }
/* the column has pointer-events: none, so cards opt back in for hover */
.fn-card { pointer-events: auto; }
.fn-card:hover { background: #fff; color: #0d2340; border-color: transparent; }
.fn-top h3 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(16px, 1.3vw, 22px); letter-spacing: -0.035em; }
.fn-top p { margin: 6px 0 0; font-family: var(--font-body); font-size: 13px; line-height: 1.45; opacity: 0.55; max-width: 28ch; }
.fn-card > a { color: inherit; text-decoration: none; font-family: var(--font-display); font-size: clamp(14px, 1.1vw, 18px); letter-spacing: -0.03em; pointer-events: auto; }
.fn-card > a span { display: inline-block; transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.2, 1); }
.fn-card > a:hover span { transform: translateX(5px); }
.fn-ico { width: 48px; height: 48px; fill: none; stroke: currentColor; stroke-width: 1.3; stroke-dasharray: 1.5 3.2; stroke-linecap: round; opacity: 0.75; }

/* 3 · tiles */
/* the cover sits above the footer, opaque, with a rounded lower edge and a soft shadow on the footer as it lifts */
.fn-cover { position: relative; z-index: 2; background: #000; border-radius: 0 0 40px 40px; box-shadow: 0 40px 80px rgba(0, 0, 0, 0.55); }
.fn-tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 0 5vw 16vh; }
.fn-tile { position: relative; overflow: hidden; border-radius: 14px; aspect-ratio: 1.62; display: block; background: #0b1b33; pointer-events: auto; }
.fn-tile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s cubic-bezier(0.2, 0.9, 0.2, 1); }
.fn-tile:hover img { transform: scale(1.06); }
.fn-glass { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: inline-flex; align-items: center; gap: 0; padding: 30px 56px; border-radius: 34px; background: rgba(40, 46, 56, 0.34); border: 1px solid rgba(255, 255, 255, 0.22); backdrop-filter: blur(18px) saturate(1.3); -webkit-backdrop-filter: blur(18px) saturate(1.3); color: #fff; font-family: var(--font-body); font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; transition: padding 0.5s cubic-bezier(0.2, 0.9, 0.2, 1), background 0.4s ease; }
.fn-glass i { font-style: normal; max-width: 0; opacity: 0; overflow: hidden; transition: max-width 0.5s cubic-bezier(0.2, 0.9, 0.2, 1), opacity 0.4s ease, margin 0.5s ease; }
.fn-tile:hover .fn-glass { padding: 30px 48px 30px 56px; background: rgba(40, 46, 56, 0.5); }
.fn-tile:hover .fn-glass i { max-width: 24px; opacity: 1; margin-left: 16px; }

@media (max-width: 900px) {
  .fn-state { grid-template-columns: 1fr; padding: 18vh 5vw 14vh; }
  .fn-big { width: 100%; }
  .fn-bento { grid-template-columns: 1fr; }
  .fn-tiles { grid-template-columns: 1fr; }
}
</style>
