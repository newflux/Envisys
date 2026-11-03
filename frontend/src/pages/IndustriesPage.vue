<template>
  <PageShell title="Industries" blue v-slot="{ contact }">
    <!-- 1 · one headline, one paragraph (after icomat.co.uk/industries) -->
    <section class="id-open">
      <h1 class="id-h">
        <span v-for="(l, i) in heroLines" :key="i" class="id-mask"><i :style="{ '--d': 0.15 + i * 0.1 + 's' }">{{ l }}</i></span>
      </h1>
      <p class="id-p rv" style="--d: 0.4s">Across automotive, electric mobility, aerospace, defence and electronics, we build the chambers that prove a product before the field does.</p>
    </section>

    <!-- 2 · the sectors, one picture at a time; each opens over the last from the bottom edge as you scroll -->
    <section class="id-stack" ref="stackRef" :style="{ height: (list.length + 0.5) * 100 + 'vh' }">
      <div class="id-stage">
        <article v-for="(s, i) in list" :key="s.id" class="id-panel" :style="{ zIndex: i + 1 }">
          <div class="id-img"><img :src="s.img" :alt="s.name"  loading="eager" /></div>
          <div class="id-shade"></div>
          <div class="id-card" :class="{ on: i === cur }">
            <b>↗ {{ s.name }}</b>
            <p>{{ s.line }}</p>
          </div>
          <span v-if="i" class="id-next">Next · {{ s.name }}</span>
          <small class="id-credit">Photo: {{ s.credit }} · Wikimedia Commons</small>
        </article>

        <span class="id-count">{{ String(cur + 1).padStart(2, '0') }}—{{ String(list.length).padStart(2, '0') }}</span>
        <nav class="id-tabs">
          <button v-for="(s, i) in list" :key="s.id" :class="{ on: i === cur }" data-cursor="" @click="jump(i)">{{ s.name }}</button>
        </nav>
      </div>
    </section>

    <!-- 3 · a few of the teams that trust the chambers -->
    <section class="id-trust">
      <h2 class="id-h2 rv">Trusted by teams who can’t afford a failure.</h2>
      <ul class="id-grid">
        <li v-for="(l, i) in logos" :key="l" class="rv hl" :style="{ '--d': i * 0.06 + 's' }"><img :src="`/clients/${l}.png`" :alt="l" loading="lazy" /></li>
      </ul>
    </section>

    <section class="id-end">
      <h2 class="id-h2 rv">Don’t see your industry? Tell us the test.</h2>
      <button class="ps-pill rv" data-cursor="" @click="contact()"><span>Start a project</span><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg></button>
    </section>
  </PageShell>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import PageShell from '../components/PageShell.vue'

const heroLines = ['Proving the products', 'that move India forward.']

// Photographs show products being built or tested, from Wikimedia Commons (licences in public/media/industries/SOURCES.txt).
// shortcut: not yet pictures of Envisys's own clients; replace them as better ones come in.
const list = [
  { id: 'automotive', name: 'Automotive', img: '/media/industries/automotive.jpg', credit: 'NHTSA / Calspan, public domain', line: 'Lamps, harnesses and cabin parts, proven through years of weather in weeks.' },
  { id: 'ev', name: 'Electric mobility', img: '/media/industries/ev.jpg', credit: 'Bill Abbott, CC BY-SA 2.0', line: 'Cells, packs and motors held through heat, cold and abuse, on record.' },
  { id: 'aerospace', name: 'Aerospace', img: '/media/industries/aerospace.jpg', credit: 'NASA/JPL, public domain', line: 'From −70 °C to +180 °C, and altitude chambers down to 1 mbar.' },
  { id: 'defence', name: 'Defence', img: '/media/industries/defence.jpg', credit: 'Rahuldevnath, CC BY 3.0', line: 'Qualification to the standard, fully logged from start to finish.' },
  { id: 'electronics', name: 'Electronics', img: '/media/industries/electronics.jpg', credit: 'Retired electrician, CC0', line: 'Boards, networking and silicon through thermal and humidity cycling.' }
]
const logos = ['tatamotors', 'mahindra', 'hal', 'bel', 'ather', 'nvidia']

const stackRef = ref<HTMLElement | null>(null)
let navDark = false
const cur = ref(0)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
let small = false

function tick() {
  // the header turns light while the dark pictures are behind it
  const stTop = stackRef.value?.getBoundingClientRect().top ?? 1, trTop = document.querySelector('.id-trust')?.getBoundingClientRect().top ?? 1
  const d = stTop < 60 && trTop > 60
  if (d !== navDark) { navDark = d; document.documentElement.classList.toggle('hx-dark', d) }
  const st = stackRef.value
  if (!st || small) return
  const r = st.getBoundingClientRect(), H = window.innerHeight
  if (r.bottom < 0 || r.top > H) return
  const u = clamp01(-r.top / (r.height - H)) * (list.length - 0.4)
  st.querySelectorAll<HTMLElement>('.id-panel').forEach((el, i) => {
    // the next picture is always a sliver at the bottom edge, and opens earlier than it used to: it starts when the one before is half shown
    const a = i === 0 ? 1 : clamp01((u - i + 1) * 1.6)
    const e = a < 1 ? 1 - Math.pow(1 - a, 3) : 1
    // while it waits, it is a card inset from the edges with round corners; opening, it grows to the full screen
    const peek = i === 0 ? 0 : clamp01(u - i + 2) * 11 // how much of it already shows, % of the height
    const side = (2.2 * (1 - e)).toFixed(2), bottom = (2.2 * (1 - e)).toFixed(2), round = (16 * (1 - e)).toFixed(1)
    el.style.clipPath = i === 0 ? 'none' : `inset(${((100 - peek) * (1 - e)).toFixed(2)}% ${side}vw ${bottom}vh ${side}vw round ${round}px)`
    if (i) (el.querySelector('.id-next') as HTMLElement).style.opacity = String(1 - Math.min(1, e * 3))
    ;(el.firstElementChild!.firstElementChild as HTMLElement).style.transform = `scale(${(1.16 - 0.16 * e).toFixed(4)})`
  })
  const k = Math.min(list.length - 1, Math.floor(u + 0.65)) // the tab follows the picture that is mostly open
  if (k !== cur.value) cur.value = k
}

function jump(i: number) {
  const st = stackRef.value!, sc = document.querySelector('#scroller') as HTMLElement
  const top = st.getBoundingClientRect().top + sc.scrollTop
  const y = small ? top + (st.querySelectorAll('.id-panel')[i] as HTMLElement).offsetTop : top + ((i + 0.15) / (list.length - 0.4)) * (st.offsetHeight - window.innerHeight)
  ;(window as any).lenisInstance?.scrollTo(y, { duration: 1.4 })
}

onMounted(() => {
  small = window.matchMedia('(max-width: 800px)').matches
  gsap.ticker.add(tick)
})
onUnmounted(() => { gsap.ticker.remove(tick); document.documentElement.classList.remove('hx-dark') })
</script>

<style scoped>
.id-open { display: grid; grid-template-columns: repeat(12, 1fr); gap: 0 1vw; align-items: end; padding: 26vh 2.2vw 10vh; color: #0d2340; min-height: 78vh; } /* short of a full screen, so the first picture is already in view */
.id-h { grid-column: 1 / span 8; margin: 0; font-weight: 400; font-family: var(--font-display); font-size: clamp(34px, 5.2vw, 100px); line-height: 1.04; letter-spacing: -0.05em; }
.id-mask { display: block; overflow: hidden; padding-bottom: 0.1em; margin-bottom: -0.1em; }
.id-mask i { display: block; font-style: normal; transform: translateY(105%); animation: id-rise 1.2s cubic-bezier(0.2, 0.9, 0.2, 1) var(--d) forwards; }
@keyframes id-rise { to { transform: none; } }
.id-p { grid-column: 9 / span 4; margin: 0; font-family: var(--font-body); font-size: clamp(13px, 1.05vw, 17px); line-height: 1.5; }

/* ───────── the stack ───────── */
.id-stack { position: relative; }
.id-stage { position: sticky; top: 0; height: 100vh; overflow: hidden; background: #05080d; color: #fff; }
.id-panel { position: absolute; inset: 0; overflow: hidden; clip-path: inset(100% 0 0 0); will-change: clip-path; }
.id-panel:first-child { clip-path: none; }
.id-img { position: absolute; inset: 0; }
.id-img img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.id-shade { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(4, 8, 14, 0.7), transparent 45%); }
.id-card { position: absolute; right: 6vw; bottom: 17vh; width: min(380px, 30vw); opacity: 0; transform: translateY(16px); transition: opacity 0.7s ease, transform 0.9s var(--ease); }
.id-card.on { opacity: 1; transform: none; }
.id-card b { display: block; font-weight: 400; font-family: var(--font-display); font-size: clamp(16px, 1.3vw, 22px); letter-spacing: -0.03em; }
.id-card p { margin: 10px 0 0; font-family: var(--font-body); font-size: clamp(12px, 0.95vw, 15px); line-height: 1.5; opacity: 0.8; }
.id-next { position: absolute; left: calc(2.2vw + 18px); top: calc(89% + 14px); z-index: 6; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #fff; text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6); pointer-events: none; }
.id-credit { position: absolute; left: 22px; bottom: 13vh; z-index: 5; font-family: var(--font-body); font-size: 8.5px; letter-spacing: 0.1em; opacity: 0.4; }
.id-count { position: absolute; right: 22px; top: 14vh; z-index: 20; writing-mode: vertical-rl; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.16em; font-variant-numeric: tabular-nums; }
.id-tabs { position: absolute; left: 22px; bottom: 17vh; z-index: 20; display: flex; gap: 22px; }
.id-tabs button { padding: 0; border: 0; background: none; color: #fff; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; opacity: 0.5; transition: opacity 0.3s ease; }
.id-tabs button.on, .id-tabs button:hover { opacity: 1; }

/* ───────── clients, close ───────── */
.id-trust, .id-end { padding: 22vh 2.2vw 0; color: #0d2340; }
.id-h2 { margin: 0; max-width: 14em; font-weight: 400; font-family: var(--font-display); font-size: clamp(28px, 4.2vw, 80px); line-height: 1.06; letter-spacing: -0.05em; }
.id-grid { list-style: none; margin: 12vh 0 0; padding: 0; display: grid; grid-template-columns: repeat(6, 1fr); }
.id-grid li { display: grid; place-items: center; height: 18vh; min-height: 100px; }
.id-grid img { max-width: 58%; max-height: 38%; object-fit: contain; filter: brightness(0) saturate(100%) invert(12%) sepia(30%) saturate(1800%) hue-rotate(190deg); opacity: 0.75; }
.id-end { padding-bottom: 22vh; }
.id-end .ps-pill { margin-top: 6vh; }
.id-end .ps-pill:hover { background: #ff6a1a; }

@media (max-width: 1000px) {
  .id-h, .id-p { grid-column: 1 / -1; } .id-p { margin-top: 6vh; }
  .id-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 800px) {
  .id-open { padding: 20vh 5vw 10vh; min-height: 0; }
  .id-stack { height: auto !important; }
  .id-stage { position: static; height: auto; }
  .id-panel { position: relative; height: 80svh; clip-path: none !important; }
  .id-next { display: none; }
  .id-card { opacity: 1; transform: none; left: 5vw; right: 5vw; width: auto; }
  .id-tabs, .id-count { display: none; }
  .id-trust, .id-end { padding: 14vh 5vw 0; } .id-end { padding-bottom: 14vh; }
}
</style>
