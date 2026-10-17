<template>
  <div class="tr-root" ref="rootRef">
    <!-- Light tint (a pale shade of the brand sky blue): sits under the whiteout, revealed as the white lifts -->
    <div class="tr-sky" ref="skyRef"></div>
    <!-- The whiteout: the cold blue lifts into white, then clears to the tint -->
    <div class="tr-haze" ref="hazeRef"></div>
    <!-- Dims the light page as the black takes over -->
    <div class="tr-dim" ref="dimRef"></div>

    <!-- Everything after the chamber is ONE column that scrolls with the page:
         trust → (light comes up) → autonomy → call to action → footer -->
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

        <CompareSection />

        <!-- Black: the film takes over, then how we build, then the door anatomy, which ends in white -->
        <div class="tr-black" ref="blackRef">
          <FilmSection />
          <div class="tr-pad"><BuildStatement /></div>
          <AnatomySection />
        </div>

        <div class="tr-white">
          <EndingSection @build="$emit('build')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import CompareSection from './CompareSection.vue'
import EndingSection from './EndingSection.vue'
import FilmSection from './FilmSection.vue'
import BuildStatement from './BuildStatement.vue'
import AnatomySection from './AnatomySection.vue'

defineEmits<{ (e: 'build'): void }>()

// Logos are the ones on the current envisystech.com (Clientele), converted to white on transparent.
// Sector copy is placeholder.
const clients = [
  { n: 'Bosch', f: 'bosch' }, { n: 'Mahindra', f: 'mahindra' }, { n: 'TATA', f: 'tata' }, { n: 'Hyundai', f: 'hyundai' },
  { n: 'nVidia', f: 'nvidia' }, { n: 'GE', f: 'ge' }, { n: 'Wipro', f: 'wipro' }, { n: 'Danfoss', f: 'danfoss' },
  { n: 'TVS', f: 'tvs' }, { n: 'Delphi', f: 'delphi' }, { n: 'Commscope', f: 'commscope' }, { n: 'Titan', f: 'titan' }
]
const sectors = [
  { name: 'Automotive', line: 'Powertrain, electronics and cabin components, proven long before they reach the road.' },
  { name: 'Electronics', line: 'Boards, networking and silicon held through thermal and humidity cycling.' },
  { name: 'Defence', line: 'Qualification runs that meet the standard, unattended and fully logged.' },
  { name: 'Aerospace', line: 'From −70°C to +180°C, and altitude chambers down to 1 mbar.' }
]

const rootRef = ref<HTMLElement | null>(null)
const skyRef = ref<HTMLElement | null>(null)
const hazeRef = ref<HTMLElement | null>(null)
const colRef = ref<HTMLElement | null>(null)
const gapRef = ref<HTMLElement | null>(null)
const blackRef = ref<HTMLElement | null>(null)
const dimRef = ref<HTMLElement | null>(null)
let cpEl: HTMLElement | null = null

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
  if (!root || root.style.visibility !== 'visible' || !gapRef.value) return
  const H = window.innerHeight
  const gTop = gapRef.value.getBoundingClientRect().top
  const rise = smooth(clamp01((H * 1.05 - gTop) / (H * 0.95)))   // 0 → 1 as the white comes up
  const clear = smooth(clamp01((H * 0.1 - gTop) / (H * 0.55)))   // 0 → 1 as the white clears to tint
  // the black section rising: dim what it is covering
  const b = blackRef.value!.getBoundingClientRect()
  const dim = smooth(clamp01((H - b.top) / H))
  const navOnBlack = b.top < 44 && b.bottom > 44 && !(document.querySelector('.an-stage') as HTMLElement | null)?.dataset.white
  const key = `${rise.toFixed(3)}|${clear.toFixed(3)}|${dim.toFixed(3)}|${navOnBlack}`
  if (key === lastKey) return
  lastKey = key
  dimRef.value!.style.opacity = (dim * 0.75).toFixed(3)
  cpEl ??= colRef.value!.querySelector('.cp-root')
  if (cpEl) cpEl.style.filter = dim > 0.001 ? `brightness(${(1 - 0.75 * dim).toFixed(3)})` : ''

  hazeRef.value!.style.transform = `translateY(${((1 - rise) * 100).toFixed(2)}%)`
  hazeRef.value!.style.opacity = String(1 - clear)
  skyRef.value!.style.opacity = rise > 0.98 ? '1' : '0'
  // ink: white over the cold chamber → deep navy on the light
  const k = smooth(clamp01((rise - 0.35) / 0.5))
  colRef.value!.style.setProperty('--ink', `rgb(${lerp(255, 13, k)},${lerp(255, 35, k)},${lerp(255, 64, k)})`)
  colRef.value!.style.setProperty('--logo', String(1 - 0.9 * k))
  navLogo ??= document.querySelector('.Header_brandLogo__AXo7t')
  const inv = navOnBlack ? 0 : k
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

.tr-info { display: grid; grid-template-columns: 1fr 1fr; gap: 44px 4vw; }
.tr-block h3 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(18px, 1.6vw, 28px); letter-spacing: -0.04em; line-height: 1.05; }
.tr-block i { display: block; width: 28px; height: 1px; background: currentColor; opacity: 0.7; margin: 18px 0 16px; }
.tr-block p { margin: 0; font-family: var(--font-body); font-size: clamp(11px, 0.9vw, 14px); line-height: 1.55; max-width: 34ch; opacity: 0.85; }

.tr-dim { position: absolute; inset: 0; background: #000; opacity: 0; }

/* Full-bleed sections inside the padded column */
.tr-black { margin: 0 -5vw; background: #000; }
.tr-pad { padding: 0 5vw; }
.tr-white { margin: -2px -5vw 0; padding: 2px 5vw 0; background: #fff; }

/* Breathing room while the light comes up */
.tr-gap { height: 85vh; }

@media (max-width: 900px) {
  .tr-trust { width: auto; margin-left: 0; }
  .tr-grid { grid-template-columns: repeat(3, 1fr); }
  .tr-info { grid-template-columns: 1fr; gap: 28px; }
}
</style>
