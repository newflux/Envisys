<template>
  <PageShell title="Products" blue v-slot="{ contact }">
    <!-- on arrival: the landing page's smoke fills the screen, then sinks away to reveal the scene -->
    <Teleport to="body"><Preloader v-if="!plDone" smoke-only @complete="onLoaded" /></Teleport>
    <!-- 1 · the flagships as 3D models, standing in a row; the camera glides along it with the scroll, pulling back between two -->
    <section class="hx" ref="showRef" :style="{ height: (mainProducts.length + 1) * 100 + 'vh' }">
      <div class="hx-pin">
        <img class="hx-poster" :class="{ gone: loaded }" :src="img(active, 'hero')" alt="" aria-hidden="true" />
        <canvas class="hx-gl" ref="glRef" :class="{ hov }" :data-cursor="hov ? (hov === 1 ? 'OPEN' : 'NEXT') : undefined"
          @pointerdown="onDown" @pointermove="onDrag" @pointerup="onUp" @pointercancel="onUp" @pointerleave="onLeave"></canvas>
        <div class="hx-grain" aria-hidden="true"></div>

        <!-- top left: the chamber's credits, set like a catalogue entry -->
        <Transition name="roll" mode="out-in">
          <div class="hx-card" :key="active.slug">
            <h1>{{ active.name }}</h1>
            <dl>
              <div><dt>Series</dt><dd>{{ active.code }}</dd></div>
              <div v-for="h in active.hud" :key="h[0]"><dt>{{ h[0] }}</dt><dd>{{ h[1] }}<small>{{ h[2] }}</small></dd></div>
            </dl>
          </div>
        </Transition>

        <!-- bottom: what clients say, two at a time -->
        <Transition name="roll" mode="out-in">
          <div class="hx-q" :key="active.slug">
            <figure v-for="q in quotesFor(cur)" :key="q.who">
              <figcaption>{{ q.who }} · Google review</figcaption>
              <blockquote>“{{ q.q }}”</blockquote>
            </figure>
          </div>
        </Transition>

        <ul class="hx-ix" aria-label="Chambers">
          <li v-for="(p, i) in mainProducts" :key="p.slug" :class="{ on: i === cur }" data-cursor="" @click="jump(i)"><span>0{{ i + 1 }}</span>{{ p.name }}</li>
        </ul>

        <p class="hx-hint" :class="{ gone: dragged || !models[active.slug] }">Drag to turn</p>
        <div class="hx-act">
          <a class="ps-pill" :href="`/products/${active.slug}`" data-cursor=""><span>View chamber</span><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg></a>
          <button data-cursor="" @click="contact()">Get a quote</button>
          <a v-if="active.brochure" :href="active.brochure" target="_blank" rel="noopener" data-cursor="">Brochure</a>
        </div>
      </div>
    </section>

    <!-- 2 · type, on light -->
    <section class="ty">
      <div class="ty-top rv"><span>(01)</span><span>The range</span><span>{{ products.length }} series</span></div>
      <h2 class="ty-h" data-words>One chamber for every test, designed, proven and serviced under one roof.</h2>
      <div class="ty-row">
        <h3 data-words>Design it.<br />Prove it.<br />Keep it running.</h3>
        <div class="ty-body">
          <p class="rv">Envisys designs and builds environmental test chambers in Peenya, Bengaluru, from a bench chamber for a single component to a walk-in room that takes an entire vehicle.</p>
          <p class="rv" style="--d: 0.06s">Vistara, our NABL-accredited testing lab, runs qualification and reliability tests on the same kind of chambers, by the people who build them.</p>
          <p class="rv" style="--d: 0.12s">When it is time to replace one, we refurbish it, buy it back, or keep it calibrated under an AMC, with engineers across India.</p>
        </div>
      </div>
    </section>

    <!-- a photograph, as it is -->
    <section class="ph" ref="phRef" aria-hidden="true">
      <VideoSlot ref="phImg" class="ph-media" src="/media/film-lab.mp4" poster="/media/step-1.jpg" label="lab film" />
      <p data-words>Built in Peenya,<br />Bengaluru.</p>
    </section>

    <!-- 3 · the smoke rolls in and the page goes black; everything after it is dark -->
    <section class="cl" ref="cloudRef">
      <div class="cl-stage">
        <canvas class="cl-smoke" ref="cloudSmokeRef" aria-hidden="true"></canvas>
        <h2 class="cl-h" :class="{ lit: cloudLit }">One company.<br />Three stages.</h2>
      </div>
    </section>

    <div class="dkp">
      <section class="st">
        <ol>
          <li v-for="(s, i) in stages" :key="s.t" class="rv" :style="{ '--d': i * 0.1 + 's' }">
            <span class="st-n">O{{ i + 1 }}</span>
            <i><u></u></i>
            <h3>{{ s.t }}</h3>
            <p>{{ s.d }}</p>
          </li>
        </ol>
      </section>

      <section class="nm">
        <div class="ty-top rv"><span>(02)</span><span>The range in numbers</span><span></span></div>
        <ul>
          <li v-for="(n, i) in numbers" :key="n.l" class="rv" :style="{ '--d': i * 0.07 + 's' }"><b>{{ n.v }}</b><span>{{ n.l }}</span></li>
        </ul>
        <div class="nm-two">
          <div class="rv"><span>Express factory</span><p>Standard models kept in stock and shipped fast, across India and abroad.</p></div>
          <div class="rv" style="--d: 0.08s"><span>Project factory</span><p>Complex, custom work, built to your specification by the design team.</p></div>
        </div>
      </section>

      <!-- the rest of the range: a card each, the chamber on a soft floor; on hover its name rises behind it -->
      <section class="bx">
        <div class="ty-top rv"><span>(03)</span><span>The rest of the range</span><button data-cursor="" @click="openSearch">Search by model or test</button></div>
        <div class="ix-tabs rv" role="tablist">
          <button v-for="g in ['All', ...groups]" :key="g" role="tab" :aria-selected="grp === g" :class="{ on: grp === g }" data-cursor="" @click="setGroup(g)">{{ g }}<sup>{{ g === 'All' ? catalogue.length : catalogue.filter((p) => p.group === g).length }}</sup></button>
        </div>
        <div class="bx-grid" ref="ixList">
          <a v-for="p in catalogue" v-show="grp === 'All' || p.group === grp" :key="p.slug" class="bx-card" :class="{ photo: p.photo }" :href="`/products/${p.slug}`" data-cursor="OPEN">
            <b class="bx-name" aria-hidden="true">{{ p.name }}</b>
            <div class="bx-img"><img :src="img(p, 'hero')" :alt="p.name" loading="lazy" /></div>
            <span class="bx-cap"><b>{{ p.name }}</b><small>{{ p.group }}</small></span>
            <i class="bx-plus"><svg viewBox="0 0 10 10"><path d="M5 1v8M1 5h8" stroke="currentColor" stroke-width="1.1" /></svg></i>
          </a>
        </div>
      </section>

      <section class="en">
        <div class="ty-top rv"><span>(04)</span><span>Something else</span><span></span></div>
        <h2 class="ty-h" data-words>Don't see your test in the range? We'll build the chamber for it.</h2>
        <div class="en-cta rv" style="--d: 0.1s">
          <button class="ps-pill light" data-cursor="" @click="contact()"><span>Start a project</span><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg></button>
          <a href="/verticals/rentals" data-cursor="">Or rent one for a short test →</a>
        </div>
      </section>

      <NextUp solid label="Next" title="How we work with you" text="Design and build, testing services, rentals, refurbishment, after-sales and express delivery." href="/verticals" />
    </div>

  </PageShell>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import PageShell from '../components/PageShell.vue'
import Preloader from '../components/Preloader.vue'
import NextUp from '../components/NextUp.vue'
import VideoSlot from '../components/VideoSlot.vue'
import { createChamberScene } from '../utils/chamberScene'
import { createSmoke } from '../utils/smokeWave'
import { products, mainProducts, catalogue, img, models, quotesFor } from '../config/products'

// how tall each chamber stands, relative to the others, so a bench model reads smaller than a walk-in room
const scale: Record<string, number> = { et: 0.9, ets: 0.9, eta: 0.84, mini: 0.74, 'walk-in': 0.7 } // eta: the EA600 is deep (2.6 m), so it stands a little smaller to clear the quotes

const stages = [
  { t: 'Design and build', d: 'Standard chambers, or built to your specification by a dedicated design and development team.' },
  { t: 'Test', d: 'Vistara, our NABL-accredited lab in Peenya, runs qualification and reliability tests, by the people who build the chambers.' },
  { t: 'Keep it running', d: 'Rentals, refurbishment and buy-back, calibration and AMCs, with engineers across India.' }
]
const numbers = [
  { v: String(products.length), l: 'series in the range' },
  { v: '−70°', l: 'coldest chamber, °C' },
  { v: '+200°', l: 'hottest chamber, °C' },
  { v: '22,000', l: 'litres, the largest walk-in' }
]

const showRef = ref<HTMLElement | null>(null)
const glRef = ref<HTMLCanvasElement | null>(null)
const cloudRef = ref<HTMLElement | null>(null)
const cloudSmokeRef = ref<HTMLCanvasElement | null>(null)
const plDone = ref(false)
// the landing page's preloader smoke, without the logo, plays on arrival
const onLoaded = () => { plDone.value = true; (window as any).lenisInstance?.start(); greet() }
// once the smoke has gone and the model is in, the chamber swings round to face you
const greet = () => { if (plDone.value && loaded.value) chambers?.intro(cur.value) }
const phRef = ref<HTMLElement | null>(null)
const phImg = ref<{ $el: HTMLElement } | null>(null)
const cur = ref(0)
const prog = ref(0)
const cloudLit = ref(false)
const hov = ref(0) // 1 = over the current chamber, 2 = over another
const dragged = ref(false)
const loaded = ref(false)
const active = computed(() => mainProducts[cur.value])
const openSearch = () => window.dispatchEvent(new Event('envisys:search'))

// the rest of the range: filter by group, and the cards re-flow with Flip
gsap.registerPlugin(Flip)
const groups = [...new Set(catalogue.map((p) => p.group))]
const grp = ref('All')
const ixList = ref<HTMLElement | null>(null)
async function setGroup(g: string) {
  if (g === grp.value) return
  const rows = ixList.value!.querySelectorAll('.bx-card')
  const state = Flip.getState(rows)
  grp.value = g
  await nextTick()
  Flip.from(state, { duration: 0.7, ease: 'power3.inOut', absolute: true, onEnter: (els: Element[]) => gsap.fromTo(els, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.03, ease: 'power3.out' }) })
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number) => a * a * (3 - 2 * a)
const scroller = () => document.querySelector('#scroller') as HTMLElement
const topOf = (el: HTMLElement) => el.getBoundingClientRect().top + scroller().scrollTop
function jump(i: number) {
  const r = showRef.value!
  ;(window as any).lenisInstance?.scrollTo(topOf(r) + ((i + 0.2) / mainProducts.length) * (r.offsetHeight - window.innerHeight), { duration: 1.4 })
}

let cloud: ReturnType<typeof createSmoke> | null = null
let chambers: ReturnType<typeof createChamberScene> | null = null
let lean = 0, leanT = 0, px = 0, py = 0
const onMove = (e: PointerEvent) => { leanT = e.clientX / window.innerWidth - 0.5; py = (e.clientY / window.innerHeight - 0.5) * 2 }
// on the chambers: a drag turns the current one like a turntable, a click opens its page or brings another forward
let down: { x: number; moved: boolean } | null = null, lastPick = 0
function onDown(e: PointerEvent) {
  down = { x: e.clientX, moved: false }
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId) // keep turning even when the pointer leaves the canvas
}
function onDrag(e: PointerEvent) {
  if (down) {
    const dx = e.clientX - down.x
    if (down.moved || Math.abs(dx) > 4) { down.moved = true; dragged.value = true; chambers?.spin(cur.value, dx); down.x = e.clientX }
    return
  }
  const now = performance.now()
  if (now - lastPick < 90 || !chambers) return // raycasting the full mesh is not free
  lastPick = now
  const i = chambers.pick(e.clientX, e.clientY)
  hov.value = i < 0 ? 0 : i === cur.value ? 1 : 2
  chambers.hover(hov.value === 1 ? i : -1) // the chamber in front opens its door a little and breathes out cold mist
}
const onLeave = () => { if (!down) { hov.value = 0; chambers?.hover(-1) } }
function onUp(e: PointerEvent) {
  const d = down
  down = null
  chambers?.release(cur.value)
  if (!d || d.moved || e.type !== 'pointerup' || !chambers) return
  const i = chambers.pick(e.clientX, e.clientY)
  if (i === cur.value) location.href = `/products/${active.value.slug}`
  else if (i >= 0) jump(i)
}

let small = false // phones get plain veils instead of WebGL smoke, and fewer effects
let navDark = false
let fs = 0 // the chambers' position, eased
function tick() {
  const H = window.innerHeight
  lean += (leanT - lean) * 0.06
  px += (leanT * 2 - px) * 0.06

  const r = showRef.value!.getBoundingClientRect()
  if (r.bottom > 0 && r.top < H) {
    const p = clamp01(-r.top / (r.height - H))
    prog.value = p
    // each chamber holds for a while, then the next one glides in
    const n = mainProducts.length, u = p * n, k = Math.min(n - 1, Math.floor(u))
    const f = k < n - 1 ? k + smooth(clamp01((u - k - 0.5) / 0.5)) : k
    fs += (f - fs) * 0.12
    const i = Math.round(fs)
    if (i !== cur.value) cur.value = i
    chambers?.update(fs, px, py, performance.now() / 1000)
  }

  // the page-wide smoke: scroll-driven, and it ends black
  const c = cloudRef.value!.getBoundingClientRect()
  const cp = clamp01(-c.top / (c.height - H))
  const wp = smooth(clamp01((cp - 0.12) / 0.7))
  if (c.top < H && c.bottom > -H) cloud?.draw(wp, lean)
  cloudLit.value = wp > 0.55

  // lines of type rise word by word with the scroll; hairlines draw themselves
  for (const { el, words } of reveal) {
    const q = el.getBoundingClientRect()
    if (q.bottom < -50 || q.top > H) continue
    const t = clamp01((H * 0.92 - q.top) / (H * 0.5)) * (1 + 0.14 * words.length)
    words.forEach((w, k) => { const a = smooth(clamp01(t - 0.14 * k)); w.style.transform = `translate3d(0, ${((1 - a) * 108).toFixed(1)}%, 0)` })
  }
  for (const el of lines) {
    const q = el.getBoundingClientRect()
    if (q.top < H && q.bottom > -50) el.style.setProperty('--p', clamp01((H * 0.95 - q.top) / (H * 0.3)).toFixed(3))
  }

  // photograph parallax
  const pr = phRef.value!.getBoundingClientRect()
  if (pr.bottom > 0 && pr.top < H && phImg.value) phImg.value.$el.style.transform = `translate3d(0, ${(((H - pr.top) / (H + pr.height) - 0.5) * -12).toFixed(2)}vh, 0)`

  // the header turns light wherever the page behind it is dark
  const d = wp > 0.55
  if (d !== navDark) { navDark = d; document.documentElement.classList.toggle('hx-dark', d) }
}
const reveal: { el: HTMLElement; words: HTMLElement[] }[] = []
let lines: HTMLElement[] = []
// wraps every word of a heading in its own mask, so it can rise on its own as the page scrolls
function splitWords(el: HTMLElement) {
  const words: HTMLElement[] = []
  const nodes = [...el.childNodes]
  el.setAttribute('aria-label', el.textContent ?? '')
  el.textContent = ''
  for (const n of nodes) {
    if (n.nodeName === 'BR') { el.appendChild(n); continue }
    for (const w of (n.textContent ?? '').split(/\s+/).filter(Boolean)) {
      const m = document.createElement('span'), i = document.createElement('i')
      m.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.12em;margin-bottom:-.12em'
      i.style.cssText = 'display:inline-block;font-style:normal;will-change:transform;transform:translate3d(0,108%,0)'
      i.textContent = w; i.setAttribute('aria-hidden', 'true')
      m.appendChild(i); el.appendChild(m); el.appendChild(document.createTextNode(' '))
      words.push(i)
    }
  }
  reveal.push({ el, words })
}
onMounted(() => {
  small = window.matchMedia('(max-width: 800px)').matches
  setTimeout(() => (window as any).lenisInstance?.stop(), 0) // held while the smoke plays; the page shell creates its scroller just after this runs
  document.querySelectorAll<HTMLElement>('[data-words]').forEach(splitWords)
  lines = [...document.querySelectorAll<HTMLElement>('.ty-top, .st li > i')]
  if (glRef.value) {
    // phones load a lighter cut of each model (tools/dress_step.py with CH_TRIS=80000)
    chambers = createChamberScene(glRef.value, mainProducts.map((p) => {
      const m = models[p.slug]
      return m ? { url: small ? m.replace('.glb', '_m.glb') : m, scale: scale[p.slug] ?? 0.8 } : { image: img(p, 'hero'), scale: scale[p.slug] ?? 0.8 }
    }), small)
    chambers.ready.then(() => { loaded.value = true; greet() })
  }
  if (cloudSmokeRef.value) cloud = createSmoke(cloudSmokeRef.value, false, small)
  window.addEventListener('pointermove', onMove, { passive: true })
  gsap.ticker.add(tick)
})
onUnmounted(() => { document.documentElement.classList.remove('hx-dark'); gsap.ticker.remove(tick); window.removeEventListener('pointermove', onMove); chambers?.dispose() })
</script>

<style scoped>
/* ───────── the scene: the chambers in a row on the page's light blue, the camera gliding along them ───────── */
.hx-pin { position: sticky; top: 0; height: 100vh; overflow: hidden; color: #0d2340; }
.hx-pin::before { content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none; background: radial-gradient(ellipse 34% 30% at 50% 76%, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0) 70%); } /* a soft pool of light where the chamber stands */
.hx-gl { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; touch-action: pan-y; cursor: grab; }
.hx-gl:active { cursor: grabbing; }
.hx-poster { position: absolute; left: 50%; bottom: 17vh; z-index: 0; height: 60vh; translate: -50% 0; object-fit: contain; pointer-events: none; transition: opacity 0.8s ease; }
.hx-poster.gone { opacity: 0; }
.hx-grain { position: absolute; inset: 0; z-index: 2; pointer-events: none; opacity: 0.35; mix-blend-mode: multiply; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5  0 0 0 0 .52  0 0 0 0 .56  0 0 0 .22 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
.hx-card, .hx-q, .hx-ix, .hx-act, .hx-hint { position: absolute; z-index: 3; }

/* top left: the name, then hairline rows like film credits */
.hx-card { left: 2.2vw; top: 12vh; width: min(380px, 27vw); pointer-events: none; }
.hx-card h1 { margin: 0 0 1.4vh; font-weight: 400; font-family: var(--font-display); font-size: clamp(22px, 2.3vw, 40px); line-height: 0.98; letter-spacing: -0.05em; text-transform: uppercase; }
.hx-card dl { margin: 0; }
.hx-card dl div { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 7px 0 8px; border-top: 1px solid currentColor; }
.hx-card dt { font-family: var(--font-body); font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; }
.hx-card dd { margin: 0; font-family: var(--font-display); font-size: clamp(16px, 1.3vw, 21px); letter-spacing: -0.03em; white-space: nowrap; }
.hx-card dd small { margin-left: 4px; font-family: var(--font-body); font-size: 12px; opacity: 0.6; }

.hx-q { right: 2.2vw; bottom: calc(6vh + 150px); display: flex; flex-direction: column; align-items: flex-end; gap: 4vh; pointer-events: none; } /* in the right column, clear of the chamber and its floor */
.hx-q figure { margin: 0; width: min(290px, 21vw); text-align: right; }
.hx-q figcaption { font-family: var(--font-body); font-size: 11.5px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.7; }
.hx-q blockquote { margin: 8px 0 0; font-family: var(--font-display); font-size: clamp(16px, 1.3vw, 22px); line-height: 1.02; letter-spacing: -0.04em; text-transform: uppercase; }

/* bottom left: the five, by name */
.hx-ix { left: 2.2vw; bottom: 6vh; margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 2px; }
.hx-ix li { display: flex; gap: 12px; padding: 3px 0; font-family: var(--font-body); font-size: 12.5px; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; opacity: 0.4; transition: opacity 0.3s ease, transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1); }
.hx-ix li span { opacity: 0.6; }
.hx-ix li:hover { opacity: 0.8; }
.hx-ix li.on { opacity: 1; transform: translateX(6px); }

/* bottom right: what to do with this one */
.hx-act { right: 2.2vw; bottom: 6vh; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
.hx-act > button:not(.ps-pill), .hx-act > a:not(.ps-pill) { padding: 0 0 2px; border: 0; border-bottom: 1px solid currentColor; background: none; color: inherit; text-decoration: none; font-family: var(--font-body); font-size: 12.5px; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; opacity: 0.7; transition: opacity 0.3s ease; }
.hx-act > button:not(.ps-pill):hover, .hx-act > a:not(.ps-pill):hover { opacity: 1; }
.hx-act .ps-pill:hover { background: #ff6a1a; }
.hx-hint { left: 50%; top: 13vh; translate: -50% 0; margin: 0; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.45; pointer-events: none; transition: opacity 0.6s ease; }
.hx-hint.gone { opacity: 0; }

.roll-enter-active, .roll-leave-active { transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.2, 0.9, 0.2, 1), filter 0.5s ease; }
.roll-enter-from { opacity: 0; transform: translateY(14px); filter: blur(4px); }
.roll-leave-to { opacity: 0; transform: translateY(-10px); filter: blur(4px); }

/* ───────── type: a tight grotesque, big and plain, with a narrow column of text on the right ───────── */
.ty, .nm, .en { font-family: var(--font-display); }
.ty-top { display: grid; grid-template-columns: 8.333vw 1fr auto; gap: 2vw; font-family: var(--font-body); font-size: 13px; letter-spacing: 0.04em; position: relative; padding-top: 14px; }
.ty-top::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 1px; background: currentColor; opacity: 0.4; transform: scaleX(var(--p, 0)); transform-origin: 0 0; }
.ty-top span { opacity: 0.6; }
.ty-top button { padding: 0 0 2px; border: 0; border-bottom: 1px solid currentColor; background: none; color: inherit; font: inherit; opacity: 0.7; cursor: pointer; }

.ty { padding: 26vh 2.2vw 32vh; } /* room to breathe before the photograph */
.ty-h { margin: 11vh 0 0; max-width: 15em; font-weight: 400; font-size: clamp(28px, 4.6vw, 88px); line-height: 1.08; letter-spacing: -0.045em; }
.ty-row { display: grid; grid-template-columns: repeat(12, 1fr); gap: 0 1vw; margin-top: 34vh; align-items: start; }
.ty-row h3 { grid-column: 1 / span 6; margin: 0; font-weight: 400; font-size: clamp(22px, 2.5vw, 46px); line-height: 1.14; letter-spacing: -0.04em; }
.ty-body { grid-column: 8 / span 4; display: flex; flex-direction: column; gap: 2em; }
.ty-body p { margin: 0; font-family: var(--font-body); font-size: clamp(16px, 1.2vw, 20px); line-height: 1.7; letter-spacing: -0.01em; }

.ph { position: relative; height: 100vh; overflow: hidden; background: #0b0f16; }
.ph-media { position: absolute; left: 0; top: -9vh; width: 100%; height: 118vh; will-change: transform; }
.ph::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba(0, 0, 0, 0.55)); }
.ph p { position: absolute; left: 2.2vw; bottom: 8vh; z-index: 1; margin: 0; color: #fff; font-family: var(--font-display); font-weight: 400; font-size: clamp(28px, 4.6vw, 88px); line-height: 1.02; letter-spacing: -0.055em; }

/* the smoke, scroll-driven; the statement turns light as the dark reaches it */
.cl { position: relative; height: 240vh; }
.cl-stage { position: sticky; top: 0; height: 100vh; overflow: hidden; }
.cl-smoke { position: absolute; inset: 0; width: 100%; height: 100%; }
.cl-h { position: absolute; left: 0; right: 0; top: 50%; translate: 0 -50%; margin: 0; text-align: center; font-family: var(--font-display); font-weight: 400; font-size: clamp(32px, 6vw, 112px); line-height: 1.02; letter-spacing: -0.055em; color: #0d2340; transition: color 0.5s ease; }
.cl-h.lit { color: #eef3fa; }

/* ───────── the dark page ───────── */
.dkp { position: relative; background: #000; color: #eef3fa; }

.st { padding: 26vh 2.2vw 8vh; }
.st ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 3vw; }
.st li { display: flex; flex-direction: column; gap: 22px; }
.st-n { font-family: var(--font-display); font-size: clamp(40px, 5.4vw, 100px); line-height: 0.95; letter-spacing: -0.06em; }
.st li > i { position: relative; display: block; height: 1px; }
.st li > i::before { content: ''; position: absolute; inset: 0; background: rgba(255, 255, 255, 0.3); transform: scaleX(var(--p, 0)); transform-origin: 0 0; }
.st li > i u { position: absolute; left: 0; top: -3px; width: 7px; height: 7px; border-radius: 50%; background: #ff6a1a; }
.st h3 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(17px, 1.7vw, 30px); letter-spacing: -0.05em; line-height: 1.08; }
.st p { margin: 0; max-width: 24em; font-family: var(--font-body); font-size: 16px; line-height: 1.75; opacity: 0.65; }

.nm { padding: 6vh 2.2vw 30vh; }
.nm ul { list-style: none; margin: 6vh 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.4vw; }
.nm li { display: flex; flex-direction: column; gap: 16px; }
.nm li b { font-weight: 400; font-size: clamp(28px, 4.2vw, 80px); line-height: 0.95; letter-spacing: -0.05em; white-space: nowrap; }
.nm li span { font-family: var(--font-body); font-size: 14px; letter-spacing: 0.04em; opacity: 0.55; }
.nm-two { display: grid; grid-template-columns: 1fr 1fr; margin-top: 10vh; border-top: 1px solid rgba(255, 255, 255, 0.25); border-bottom: 1px solid rgba(255, 255, 255, 0.25); }
.nm-two > div { display: grid; grid-template-columns: 9vw 1fr; gap: 0 2vw; padding: 7vh 3vw 10vh 0; }
.nm-two > div + div { padding-left: 2vw; border-left: 1px solid rgba(255, 255, 255, 0.25); }
.nm-two span { font-family: var(--font-body); font-size: 13px; letter-spacing: 0.04em; opacity: 0.55; }
.nm-two p { margin: 0; max-width: 20em; font-size: clamp(17px, 1.5vw, 26px); line-height: 1.3; letter-spacing: -0.035em; }

/* the rest of the range: light cards on the black, after intrepidautomation.com */
.bx { position: relative; padding: 4vh 2.2vw 26vh; }
.ix-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin: 6vh 0 4vh; }
.ix-tabs button { padding: 8px 14px; border: 1px solid rgba(255, 255, 255, 0.22); border-radius: 40px; background: transparent; color: inherit; font-family: var(--font-body); font-size: 12.5px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease; }
.ix-tabs button sup { margin-left: 6px; font-size: 10px; opacity: 0.55; }
.ix-tabs button:hover { border-color: rgba(255, 255, 255, 0.6); }
.ix-tabs button.on { background: #eef3fa; color: #000; border-color: #eef3fa; }
.bx-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.bx-card { position: relative; display: block; aspect-ratio: 4 / 4.3; border-radius: 22px; overflow: hidden; background: linear-gradient(180deg, #e9f0f8, #dde8f4); color: #0d2340; text-decoration: none; isolation: isolate; }
/* the name: big, behind the chamber, up from below on hover */
.bx-name { position: absolute; left: 7%; right: 7%; top: 11%; z-index: 0; font-weight: 400; font-family: var(--font-display); font-size: clamp(26px, 3vw, 54px); line-height: 0.96; letter-spacing: -0.055em; text-align: center; opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.8s cubic-bezier(0.2, 0.9, 0.2, 1); }
.bx-img { position: absolute; left: 22%; right: 22%; top: 38%; bottom: 17%; z-index: 1; }
.bx-img::after { content: ''; position: absolute; left: 0; right: 0; bottom: -4%; height: 10%; z-index: -1; border-radius: 50%; background: radial-gradient(closest-side, rgba(13, 35, 64, 0.32), transparent); filter: blur(4px); transition: transform 0.8s cubic-bezier(0.2, 0.9, 0.2, 1), opacity 0.5s ease; }
.bx-img img { width: 100%; height: 100%; object-fit: contain; object-position: bottom center; transition: transform 0.8s cubic-bezier(0.2, 0.9, 0.2, 1); }
.bx-card.photo .bx-img { left: 8%; right: 8%; top: 30%; } /* a photograph is shown whole, never cropped */
.bx-card.photo .bx-img img { object-fit: contain; object-position: center; border-radius: 12px; }
.bx-card.photo .bx-img::after { display: none; }
.bx-cap { position: absolute; left: 22px; right: 70px; bottom: 20px; z-index: 2; display: flex; flex-direction: column; gap: 4px; transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.2, 0.9, 0.2, 1); }
.bx-cap b { font-weight: 400; font-family: var(--font-display); font-size: 18px; letter-spacing: -0.035em; line-height: 1.1; }
.bx-cap small { font-family: var(--font-body); font-size: 11.5px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.55; }
.bx-plus { position: absolute; right: 18px; top: 18px; z-index: 2; width: 40px; height: 40px; display: grid; place-items: center; border-radius: 50%; background: #0d2340; color: #fff; transition: transform 0.6s cubic-bezier(0.2, 0.9, 0.2, 1), background 0.3s ease; }
.bx-plus svg { width: 11px; height: 11px; }
.bx-card:hover .bx-name { opacity: 1; transform: none; }
.bx-card:hover .bx-img img { transform: translateY(-2%) scale(1.03); }
.bx-card:hover .bx-img::after { transform: scaleX(0.9); opacity: 0.7; }
.bx-card:hover .bx-cap { opacity: 0; transform: translateY(8px); }
.bx-card:hover .bx-plus { background: #ff6a1a; transform: rotate(90deg); }

.en { padding: 10vh 2.2vw 30vh; }
.en .ty-h { margin-top: 11vh; max-width: 14em; }
.en-cta { display: flex; align-items: center; gap: 28px; margin-top: 8vh; }
.en-cta a { font-family: var(--font-body); font-size: 12.5px; letter-spacing: 0.12em; text-transform: uppercase; color: inherit; text-decoration: none; opacity: 0.65; border-bottom: 1px solid currentColor; padding-bottom: 3px; transition: opacity 0.3s ease; }
.en-cta a:hover { opacity: 1; }

@media (max-width: 1000px) {
  .hx-q figure + figure { display: none; } .hx-card { width: min(320px, 40vw); }
  .ty-row h3, .ty-body { grid-column: 1 / -1; } .ty-body { margin-top: 6vh; }
  .st ol { grid-template-columns: 1fr; } .nm ul { grid-template-columns: 1fr 1fr; }
  .nm-two { grid-template-columns: 1fr; } .nm-two > div + div { border-left: 0; padding-left: 0; border-top: 1px solid rgba(255, 255, 255, 0.25); }
  .bx-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* ───────── phones: one stage, a bottom panel, no heavy effects ───────── */
@media (max-width: 800px) {
  .hx-pin { height: 100svh; }
  .hx-card { left: 5vw; right: 5vw; top: 11svh; width: auto; }
  .hx-card h1 { font-size: 26px; }
  .hx-card dl { display: grid; grid-template-columns: 1fr 1fr; column-gap: 16px; }
  .hx-card dd { font-size: 15px; }
  .hx-ix, .hx-hint, .hx-grain { display: none; }
  .hx-poster { bottom: 30svh; height: 36svh; }
  .hx-q { left: 5vw; right: 5vw; bottom: 13svh; translate: none; }
  .hx-q figure { width: 100%; text-align: center; }
  .hx-q blockquote { font-size: 17px; }
  .hx-act { left: 5vw; right: 5vw; bottom: 4svh; flex-direction: row; align-items: center; justify-content: space-between; }

  .ph { height: 80vh; } .ph-media { top: 0; height: 100%; }
  .cl { height: 170vh; }
  .ty { padding: 18vh 5vw 18vh; } .ty-row { margin-top: 18vh; } .ty-h { margin-top: 7vh; }
  .ty-top { grid-template-columns: 14vw 1fr auto; }
  .st { padding: 18vh 5vw 6vh; } .nm { padding: 6vh 5vw 18vh; }
  .bx { padding: 4vh 4vw 18vh; }
  .bx-grid { gap: 10px; }
  .bx-card { border-radius: 16px; }
  .bx-cap { left: 12px; right: 12px; bottom: 12px; }
  .bx-cap b { font-size: 15px; }
  .bx-plus { width: 30px; height: 30px; right: 10px; top: 10px; }
  .en { padding: 8vh 5vw 18vh; }
}
</style>
