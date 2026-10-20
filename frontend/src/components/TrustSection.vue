<template>
  <div class="tr-root" ref="rootRef">
    <!-- Light tint (a pale shade of the brand sky blue): sits under the whiteout, revealed as the white lifts -->
    <div class="tr-sky" ref="skyRef"></div>
    <!-- The whiteout: the cold blue lifts into white, then clears to the tint -->
    <div class="tr-haze" ref="hazeRef"></div>
    <!-- Dims the light page as the black takes over -->
    <div class="tr-dim" ref="dimRef"></div>

    <!-- Everything after the chamber is ONE column that scrolls with the page:
         trust → autonomy → film → build → advantage → chamber → products → customers → factory → industries → contact -->
    <div class="tr-chap" ref="chapRef" aria-hidden="true"><span>{{ String(chapter + 1).padStart(2, '0') }} / {{ chapters.length }}</span><b>{{ chapters[chapter].name }}</b></div>

    <div class="tr-wrap">
      <div class="tr-scroll" ref="colRef">
        <section class="tr-trust">
          <h2 class="tr-title">Trusted by teams who can’t afford compromise.</h2>

          <div class="tr-clients">
            <div class="tr-label">Clientele</div>
            <div class="tr-grid">
              <div v-for="c in clients" :key="c.n" class="tr-logo"><img :src="`/clients/${c.f}.png`" :alt="c.n" /></div>
            </div>
          </div>

          <div class="tr-info">
            <article v-for="s in sectors" :key="s.name" class="tr-block">
              <h3>{{ s.name }}</h3>
              <i></i>
              <p>{{ s.line }}</p>
            </article>
          </div>
        </section>

        <div class="tr-gap" ref="gapRef"></div>

        <!-- Light: manual testing vs Envisys, the two panels sliding in -->
        <CompareSection />

        <!-- The film rises over the light page, grows to cover the screen, and the black slides over it -->
        <div class="tr-film">
          <FilmSection />
        </div>

        <!-- Black: how we build, then the headline that leads into the drawing -->
        <div class="tr-black">
          <div class="tr-pad"><BuildStatement /><AdvantageSection /></div>
        </div>

        <!-- Still black: the real chamber drawing, taken apart; its line opens to the light blue -->
        <div class="tr-black tr-black2">
          <AnatomySection />
        </div>

        <!-- Light blue: the products, one at a time, then the customers, where a black disc rises until the page is black -->
        <div class="tr-tint">
          <ProductsSection />
          <TestimonialsSection />
        </div>

        <!-- Black from here on, straight out of the disc: the factory, the industries full screen, the close -->
        <div class="tr-black tr-black3 tr-cont">
          <StepsSection />
          <IndustriesSection />
        </div>

        <!-- Light: statement, what a test needs, two doors, and the footer -->
        <FinaleSection @build="$emit('build')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import FinaleSection from './FinaleSection.vue'
import FilmSection from './FilmSection.vue'
import CompareSection from './CompareSection.vue'
import AdvantageSection from './AdvantageSection.vue'
import BuildStatement from './BuildStatement.vue'
import AnatomySection from './AnatomySection.vue'
import StepsSection from './StepsSection.vue'
import ProductsSection from './ProductsSection.vue'
import TestimonialsSection from './TestimonialsSection.vue'
import IndustriesSection from './IndustriesSection.vue'

defineEmits<{ (e: 'build'): void }>()

// Logos are the ones on the current envisystech.com (Clientele), converted to white on transparent.
// Sector copy is placeholder.
const sectors = [
  { name: 'Automotive', line: 'Powertrain, electronics and cabin components, proven long before they reach the road.' },
  { name: 'Electronics', line: 'Boards, networking and silicon held through thermal and humidity cycling.' },
  { name: 'Defence', line: 'Qualification runs that meet the standard, fully logged from start to finish.' },
  { name: 'Aerospace', line: 'From −70°C to +180°C, and altitude chambers down to 1 mbar.' }
]
const clients = [
  { n: 'Bosch', f: 'bosch' }, { n: 'Mahindra', f: 'mahindra' }, { n: 'TATA', f: 'tata' }, { n: 'Hyundai', f: 'hyundai' },
  { n: 'nVidia', f: 'nvidia' }, { n: 'GE', f: 'ge' }, { n: 'Wipro', f: 'wipro' }, { n: 'Danfoss', f: 'danfoss' },
  { n: 'TVS', f: 'tvs' }, { n: 'Delphi', f: 'delphi' }, { n: 'Commscope', f: 'commscope' }, { n: 'Titan', f: 'titan' }
]

const rootRef = ref<HTMLElement | null>(null)
const skyRef = ref<HTMLElement | null>(null)
const hazeRef = ref<HTMLElement | null>(null)
const colRef = ref<HTMLElement | null>(null)
const gapRef = ref<HTMLElement | null>(null)
const dimRef = ref<HTMLElement | null>(null)
const chapRef = ref<HTMLElement | null>(null)
let darks: HTMLElement[] = []
let sheets: HTMLElement[] = []

// A small vertical index at the right edge: where we are in the story.
const chapters = [
  { sel: '.tr-trust', name: 'Trust' }, { sel: '.cp-root', name: 'Autonomy' }, { sel: '.fm-root', name: 'Film' },
  { sel: '.bs-root', name: 'Build' }, { sel: '.an-root', name: 'Anatomy' }, { sel: '.pr-root', name: 'Range' },
  { sel: '.ts-root', name: 'Customers' }, { sel: '.st-root', name: 'Factory' }, { sel: '.in-root', name: 'Industries' },
  { sel: '.fn-root', name: 'Contact' }
]
const chapter = ref(0)
let chapEls: (HTMLElement | null)[] = []

// The light is keyed to where the gap between trust and autonomy sits on screen, so the
// background change is part of the scroll, not a separate scene:
//   gap enters from the bottom → white rises from the horizon, the type turns from white to ink
//   gap reaches the top        → the white clears to the pale tint
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number) => a * a * (3 - 2 * a)
const lerp = (a: number, b: number, k: number) => Math.round(a + (b - a) * k)
let lastKey = ''
let navLogo: HTMLElement | null = null
function tick() {
  const root = rootRef.value
  if (!root || root.style.visibility !== 'visible' || !gapRef.value) {
    document.documentElement.dataset.covered = ''
    return
  }
  const H = window.innerHeight
  const gTop = gapRef.value.getBoundingClientRect().top
  const rise = smooth(clamp01((H * 1.05 - gTop) / (H * 0.95)))   // 0 → 1 as the white comes up
  const clear = smooth(clamp01((H * 0.1 - gTop) / (H * 0.55)))   // 0 → 1 as the white clears to tint
  // the light backdrop is opaque from here on, so the 3D scene behind it can stop rendering
  document.documentElement.dataset.covered = rise > 0.98 ? '1' : ''

  // chapter index (shown once the light page is up)
  if (!chapEls.length) chapEls = chapters.map((c) => colRef.value!.querySelector<HTMLElement>(c.sel))
  let ci = 0
  chapEls.forEach((el, i) => { if (el && el.getBoundingClientRect().top < H * 0.5) ci = i })
  if (ci !== chapter.value) chapter.value = ci
  chapRef.value!.style.opacity = rise > 0.98 ? '1' : '0'

  // every black section (and the light finale) that rises over the page settles what it covers
  // back and darkens it evenly, so each scene change feels like a sheet being laid on top
  if (!darks.length) {
    darks = Array.from(colRef.value!.querySelectorAll<HTMLElement>('.tr-black'))
    sheets = Array.from(colRef.value!.querySelectorAll<HTMLElement>('.tr-black, .tr-sheet'))
  }
  let navOnDark = false
  let dim = 0
  let key = `${rise.toFixed(3)}|${clear.toFixed(3)}|${chapter.value}`
  const first = darks[0].getBoundingClientRect()
  sheets.forEach((d) => {
    if (d.classList.contains('tr-cont')) return // carries straight on from a black screen: nothing to lay over
    const r = d.getBoundingClientRect()
    const dm = smooth(clamp01((H - r.top) / H))
    if (d === darks[0]) dim = r.top > 0 ? dm : 0 // only while it is rising: the transparent scenes below show the light backdrop
    key += `|${dm.toFixed(3)}`
    let prev = d.previousElementSibling as HTMLElement | null
    if (prev?.classList.contains('tr-gap')) prev = prev.previousElementSibling as HTMLElement | null
    if (prev && !prev.classList.contains('tr-black')) {
      const light = d.classList.contains('tr-sheet')
      prev.style.transformOrigin = '50% 100%'
      // the film stays full-bleed under the sheet (no settle-back, which would show the backdrop around it)
      const pinned = prev.classList.contains('tr-film')
      prev.style.transform = dm > 0.001 && r.top > 0 && !pinned ? `translate3d(0, ${(-7 * dm).toFixed(2)}vh, 0) scale(${(1 - 0.08 * dm).toFixed(4)})` : ''
      prev.style.filter = dm > 0.001 && r.top > 0 && !light ? `brightness(${(1 - 0.92 * dm).toFixed(3)})` : ''
    }
  })
  // nav goes light over anything dark: a black section, or a film / industries frame that has grown to full
  darks.forEach((d) => {
    const r = d.getBoundingClientRect()
    if (r.top < 44 && r.bottom > 44 && !d.querySelector('[data-white="1"]') && !d.querySelector('.an-stage[data-white="1"]')) navOnDark = true
  })
  if (colRef.value!.querySelector('[data-dark="1"]')) navOnDark = true
  // the light contact sheet laid over the last black wins
  sheets.forEach((s) => {
    if (!s.classList.contains('tr-sheet')) return
    const r = s.getBoundingClientRect()
    if (r.top < 44 && r.bottom > 44) navOnDark = false
  })
  key += `|${navOnDark}`
  if (key === lastKey) return
  lastKey = key
  dimRef.value!.style.opacity = dim.toFixed(3)

  hazeRef.value!.style.transform = `translateY(${((1 - rise) * 100).toFixed(2)}%)`
  hazeRef.value!.style.opacity = String(1 - clear)
  skyRef.value!.style.opacity = rise > 0.98 ? '1' : '0'
  // ink: white over the cold chamber → deep navy on the light
  const k = smooth(clamp01((rise - 0.35) / 0.5))
  colRef.value!.style.setProperty('--ink', `rgb(${lerp(255, 13, k)},${lerp(255, 35, k)},${lerp(255, 64, k)})`)
  colRef.value!.style.setProperty('--logo', String(1 - 0.9 * k))
  navLogo ??= document.querySelector('.Header_brandLogo__AXo7t')
  const inv = navOnDark ? 0 : k * (1 - (first.top > 0 ? dim : 0))
  if (navLogo) navLogo.style.filter = inv > 0.01 ? `invert(${(inv * 0.92).toFixed(3)})` : ''
}

onMounted(() => gsap.ticker.add(tick))
onUnmounted(() => gsap.ticker.remove(tick))
</script>

<style scoped>
.tr-root {
  position: fixed;
  inset: 0;
  z-index: 105;
  pointer-events: none;
  visibility: hidden;
  overflow: hidden;
}

.tr-sky {
  position: absolute;
  inset: 0;
  opacity: 0;
  background:
    radial-gradient(ellipse 80% 50% at 20% 0%, rgba(178, 208, 238, 0.55), rgba(178, 208, 238, 0)),
    linear-gradient(180deg, #d5e6f6 0%, #e6f0fa 40%, #f3f7fc 100%);
}

/* Anchored to the bottom and 2.6 screens tall: translated up it brings a soft white horizon,
   then a fully white screen. */
.tr-haze {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 260%;
  transform: translateY(100%);
  will-change: transform, opacity;
  background: linear-gradient(to top, #fff 0%, #fff 44%, #eaf3fc 52%, #bcd8f2 62%, rgba(130, 185, 232, 0.45) 78%, rgba(100, 160, 220, 0) 100%);
}

.tr-wrap { position: absolute; inset: 0; }
.tr-scroll {
  --ink: #fff;
  --logo: 1;
  position: absolute;
  left: 5vw;
  right: 5vw;
  top: 0;
  transform: translateY(110vh);
  will-change: transform;
  color: var(--ink);
}

.tr-trust { width: 62vw; margin-left: 2vw; display: flex; flex-direction: column; gap: clamp(48px, 9vh, 96px); }
.tr-title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(30px, 3.9vw, 74px);
  line-height: 1.06;
  letter-spacing: -0.04em;
}

.tr-label { font-family: var(--font-body); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.7; margin-bottom: 26px; }
.tr-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 30px 18px; align-items: center; }
.tr-logo { height: 52px; display: flex; align-items: center; justify-content: flex-start; }
.tr-logo img { max-width: 118px; max-height: 46px; object-fit: contain; display: block; opacity: 0.92; filter: brightness(var(--logo)); }


.tr-dim { position: absolute; inset: 0; background: #000; opacity: 0; }

/* Full-bleed sections inside the padded column */
.tr-black { margin: 0 -5vw; background: #000; border-radius: 36px 36px 0 0; }
.tr-black2 { margin-top: -6vh; border-radius: 40px 40px 0 0; overflow: hidden; position: relative; }
.tr-black3 { position: relative; border-radius: 0; overflow: hidden; }
.tr-cont { border-radius: 0; } /* follows black directly: rounded corners would show the backdrop */
.tr-pad { padding: 0 5vw; }
/* the black rises over the last screen of the pinned film */
.tr-film + .tr-black { position: relative; margin-top: -100vh; }
.tr-tint { margin: -2px -5vw 0; background: linear-gradient(180deg, #d5e6f6 0%, #e6f0fa 45%, #f1f6fb 100%); }

/* Breathing room while the light comes up */
.tr-gap { height: 62vh; }

/* transparent wrappers: the light backdrop shows around a small card while it rises */
.tr-film { position: relative; margin: 0 -5vw; } /* full bleed, edge to edge */

.tr-info { display: grid; grid-template-columns: 1fr 1fr; gap: 44px 4vw; margin-top: 4vh; }
.tr-block h3 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(18px, 1.6vw, 28px); letter-spacing: -0.04em; line-height: 1.05; }
.tr-block i { display: block; width: 28px; height: 1px; background: currentColor; opacity: 0.7; margin: 18px 0 16px; }
.tr-block p { margin: 0; font-family: var(--font-body); font-size: clamp(11px, 0.9vw, 14px); line-height: 1.55; max-width: 34ch; opacity: 0.85; }

/* index at the right edge */
.tr-chap { position: absolute; right: 1.1vw; top: 50%; z-index: 20; display: flex; align-items: center; gap: 14px; transform: translateY(-50%) rotate(180deg); writing-mode: vertical-rl; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #fff; mix-blend-mode: difference; opacity: 0; transition: opacity 0.5s ease; pointer-events: none; }
.tr-chap b { font-weight: 400; opacity: 0.65; }

@media (max-width: 900px) {
  .tr-trust { width: auto; margin-left: 0; }
  .tr-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
