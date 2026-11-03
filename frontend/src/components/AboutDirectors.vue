<template>
  <!-- The founders, after pragmatica.ru's team page: one person fills the screen, a row of round thumbnails along the bottom, and a
       hairline bar with name, role and since. Scrolling moves from one to the next. PLACEHOLDER: the portraits are blank until the
       professional photographs arrive (drop them in `founders[].img`); only Ramesh is named.
       Then the team: one word, centred, and the photograph edge to edge. -->
  <section class="ad lt">
    <div class="af" ref="pinRef" :style="{ height: 100 + (founders.length - 1) * 80 + 'vh' }">
      <div class="af-stage">
        <div v-for="(f, i) in founders" :key="i" class="af-shot" :class="{ on: i === at }">
          <img v-if="f.img" :src="f.img" :alt="f.name" />
          <span v-else>Portrait to come</span>
        </div>
        <p class="af-lead">The people<br />behind Envisys.</p>
        <div class="af-thumbs">
          <button v-for="(f, i) in founders" :key="i" :class="{ on: i === at }" :aria-label="`Show ${f.name}`" data-cursor="" @click="go(i)">
            <img v-if="f.img" :src="f.img" alt="" /><i v-else>0{{ i + 1 }}</i>
          </button>
        </div>
        <Transition name="af" mode="out-in">
          <div :key="at" class="af-bar"><span>{{ founders[at].name }}</span><span>{{ founders[at].role }}</span><span>Founder</span></div>
        </Transition>
      </div>
    </div>

    <h2 class="at-h rv">Team</h2>
    <figure class="at-band" ref="bandRef">
      <img ref="bandImg" src="/media/about/team-group.jpg" alt="The Envisys team" />
    </figure>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const founders: { name: string; role: string; img?: string }[] = [
  { name: 'Ramesh', role: 'Director' },
  { name: 'Name to be added', role: 'Director' },
  { name: 'Name to be added', role: 'Director' }
]
const pinRef = ref<HTMLElement | null>(null)
const bandRef = ref<HTMLElement | null>(null)
const bandImg = ref<HTMLImageElement | null>(null)
const at = ref(0)
const go = (i: number) => {
  if (small) { at.value = i; return } // phones: no pin, the thumbnails just switch
  const el = pinRef.value!, sc = document.querySelector('#scroller') as HTMLElement
  ;(window as any).lenisInstance?.scrollTo(el.getBoundingClientRect().top + sc.scrollTop + (i / (founders.length - 1)) * (el.offsetHeight - window.innerHeight), { duration: 1.2 })
}
let small = false
function tick() {
  const H = window.innerHeight
  const pin = pinRef.value
  if (pin && !small) {
    const q = pin.getBoundingClientRect()
    if (q.bottom > 0 && q.top < H) at.value = Math.round(Math.min(1, Math.max(0, -q.top / (q.height - H))) * (founders.length - 1))
  }
  // the team photograph settles from a slight zoom as it crosses the screen
  const bd = bandRef.value, bi = bandImg.value
  if (bd && bi) {
    const r = bd.getBoundingClientRect()
    if (r.bottom > 0 && r.top < H) bi.style.transform = `scale(${(1.12 - 0.12 * Math.min(1, Math.max(0, (H - r.top) / (H + r.height)) * 1.4)).toFixed(4)})`
  }
}
onMounted(() => { small = window.matchMedia('(max-width: 800px)').matches; gsap.ticker.add(tick) })
onUnmounted(() => gsap.ticker.remove(tick))
</script>

<style scoped>
.ad { background: var(--lt, #f4f4f2); color: var(--ink, #0a0a0c); overflow: clip; } /* clip, not hidden: hidden would stop the stage pinning */
.rv { opacity: 0; transform: translateY(24px); transition: opacity 1s ease var(--d, 0s), transform 1.2s var(--ease, cubic-bezier(0.2, 0.9, 0.2, 1)) var(--d, 0s); }
.rv.in { opacity: 1; transform: none; }

/* the founders: a grey studio backdrop, the portrait filling it */
.af-stage { position: sticky; top: 0; height: 100vh; overflow: hidden; background: linear-gradient(180deg, #c9ccd1, #b9bdc3); color: #fff; }
.af-shot { position: absolute; inset: 0; display: grid; place-items: center; opacity: 0; transition: opacity 0.8s ease; }
.af-shot.on { opacity: 1; }
.af-shot img { position: absolute; left: 50%; bottom: 0; height: 100%; width: auto; translate: -50% 0; object-fit: contain; object-position: bottom; }
.af-shot span { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.6; }
.af-lead { position: absolute; left: 2.2vw; top: 12vh; margin: 0; font-family: var(--font-display); font-size: clamp(20px, 2.1vw, 38px); line-height: 1.1; letter-spacing: -0.045em; }
.af-thumbs { position: absolute; left: 2.2vw; bottom: 12vh; display: flex; gap: 10px; }
.af-thumbs button { width: 56px; height: 56px; padding: 0; border: 0; border-radius: 50%; overflow: hidden; background: rgba(255, 255, 255, 0.35); color: #fff; cursor: pointer; opacity: 0.6; outline: 1px solid transparent; outline-offset: 3px; transition: opacity 0.3s ease, outline-color 0.3s ease; }
.af-thumbs button.on, .af-thumbs button:hover { opacity: 1; }
.af-thumbs button.on { outline-color: #fff; }
.af-thumbs img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 15%; }
.af-thumbs i { font-style: normal; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.1em; }
.af-bar { position: absolute; left: 2.2vw; right: 2.2vw; bottom: 4vh; display: grid; grid-template-columns: 1fr 1fr 1fr; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.6); font-family: var(--font-body); font-size: 12px; letter-spacing: 0.06em; }
.af-bar span:nth-child(2) { text-align: center; }
.af-bar span:last-child { text-align: right; }
.af-enter-active, .af-leave-active { transition: opacity 0.35s ease, transform 0.5s var(--ease, ease); }
.af-enter-from { opacity: 0; transform: translateY(8px); }
.af-leave-to { opacity: 0; transform: translateY(-6px); }

/* the team: one word, centred */
.at-h { margin: 0; padding: 22vh 5vw 8vh; text-align: center; font-weight: 400; font-family: var(--font-display); font-size: clamp(44px, 8vw, 150px); line-height: 1; letter-spacing: -0.06em; }
.at-band { margin: 0 0 22vh; overflow: hidden; }
.at-band img { display: block; width: 100%; height: auto; transform-origin: 50% 60%; will-change: transform; }

@media (max-width: 800px) {
  .af { height: auto !important; }
  .af-stage { position: relative; height: 100svh; }
  .af-lead { left: 5vw; right: 5vw; font-size: 20px; }
  .af-thumbs { left: 5vw; }
  .af-bar { left: 5vw; right: 5vw; font-size: 10px; }
  .at-h { padding: 14vh 5vw 5vh; }
  .at-band { margin-bottom: 14vh; }
}
</style>
