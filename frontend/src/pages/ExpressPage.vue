<template>
  <PageShell title="Express Factory" blue v-slot="{ contact }">
    <!-- 1 · quick commerce, for test chambers: the headline, and an order moving through its stages like a delivery app -->
    <section class="ex-hero">
      <nav class="ex-crumb"><a href="/verticals" data-cursor="">Verticals</a><i>/</i><span>02</span></nav>
      <div class="ex-copy">
        <span class="ex-badge"><i></i>Express Factory</span>
        <h1 class="ex-h"><span v-for="(l, k) in ['Quick commerce,', 'for test chambers.']" :key="k" class="ex-ln"><span :style="{ '--k': k }">{{ l }}</span></span></h1>
        <p class="ex-sub">Standard models. Built ahead, kept in stock, shipped fast.</p>
        <div class="ex-act">
          <button class="ex-cta" data-cursor="" @click="contact()"><span>Order a standard model</span><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.4" /></svg></button>
          <a href="#ex-board" data-cursor="" @click.prevent="go('ex-board')">See what’s in stock ↓</a>
        </div>
      </div>

      <aside class="ex-order" aria-label="How an express order moves">
        <header>
          <span>How an express order moves</span>
          <b>{{ demo.model }}</b>
          <small>{{ demo.city }}</small>
        </header>
        <div class="ex-track"><i :style="{ width: ((stage + 1) / stages.length) * 100 + '%' }"></i><span class="ex-truck" :style="{ left: ((stage + 1) / stages.length) * 100 + '%' }"><svg viewBox="0 0 24 14"><path d="M1 2h13v9H1zM14 5h5l3 3v3h-8z" fill="currentColor" /><circle cx="5" cy="12" r="2" fill="#0a0a0c" stroke="currentColor" stroke-width="1.2" /><circle cx="18" cy="12" r="2" fill="#0a0a0c" stroke="currentColor" stroke-width="1.2" /></svg></span></div>
        <ol>
          <li v-for="(s, k) in stages" :key="s.t" :class="{ done: k < stage, now: k === stage }">
            <i><svg v-if="k < stage" viewBox="0 0 10 10"><path d="M2 5.2l2 2L8 3" fill="none" stroke="currentColor" stroke-width="1.6" /></svg></i>
            <span><b>{{ s.t }}</b><small>{{ s.d }}</small></span>
          </li>
        </ol>
      </aside>
    </section>

    <!-- the floor: standard units on the move -->
    <section class="ex-film" ref="filmRef"><figure ref="filmPicRef"><img src="/media/verticals/express.jpg" alt="Standard chambers moved across the express factory floor" loading="lazy" /></figure><p>Built for speed.<br />Ready for the world.</p></section>

    <!-- 2 · two factories: the project factory keeps the complex custom work; the express factory only does standard models, fast -->
    <section class="ex-two">
      <span class="ex-eye rv"><i></i>Why it is fast</span>
      <h2 class="rv" style="--d: 0.05s">Two factories.<br />Two jobs.</h2>
      <div class="ex-split">
        <article class="rv" style="--d: 0.05s">
          <span class="ex-tag">The project factory</span>
          <VMotif kind="blueprint" class="ex-mot" />
          <b>Custom work</b>
          <p>Engineered to your standard, one at a time.</p>
        </article>
        <article class="rv on" style="--d: 0.15s">
          <span class="ex-tag">The express factory</span>
          <VMotif kind="route" class="ex-mot" />
          <b>Standard models</b>
          <p>Its own lines and supply chain. Nothing waits behind custom work.</p>
        </article>
      </div>
      <ul class="ex-pts">
        <li v-for="(t, k) in points" :key="t[0]" class="rv hl" :style="{ '--d': k * 0.06 + 's' }"><em>0{{ k + 1 }}</em><b>{{ t[0] }}</b><span>{{ t[1] }}</span></li>
      </ul>
    </section>

    <!-- 3 · the stock board: a departures board for chambers -->
    <section id="ex-board" class="ex-board">
      <div class="ex-board-top">
        <div><span class="ex-eye rv"><i></i>In stock</span><h2 class="rv" style="--d: 0.05s">Ready when you are.</h2></div>
        <span class="ex-demo rv">Sample board · live stock coming soon</span>
      </div>
      <div class="ex-tools rv">
        <div class="ex-chips"><button v-for="s in ['All', ...series]" :key="s" :class="{ on: sf === s }" data-cursor="" @click="sf = s">{{ s }}</button></div>
        <input v-model="mq" type="text" placeholder="Find a model" spellcheck="false" aria-label="Find a model" />
      </div>
      <div class="ex-tab rv">
        <div class="ex-tr ex-th"><span>Series</span><span>Model</span><span>Status</span><span></span></div>
        <div v-for="(r, k) in rows" :key="r.model" class="ex-tr" :style="{ '--k': k }">
          <span>{{ r.series }}</span><span class="ex-flap">{{ r.model }}</span>
          <span class="st" :class="r.k"><i></i>{{ r.status }}</span>
          <button data-cursor="" @click="contact()">Order</button>
        </div>
        <p v-if="!rows.length" class="ex-none">No model matches “{{ mq }}”.</p>
      </div>
    </section>

    <!-- 4 · out of Bengaluru: the routes draw themselves as you scroll -->
    <section class="ex-map" ref="mapRef">
      <div class="ex-map-tx">
        <span class="ex-eye rv"><i></i>Delivery</span>
        <h2 class="rv" style="--d: 0.05s">From Peenya<br />to your lab.</h2>
        <p class="rv" style="--d: 0.1s">Dispatched from Bengaluru. Supported across India, distributed in more than ten countries.</p>
        <dl class="rv" style="--d: 0.15s"><div><dt>4</dt><dd>Regional offices</dd></div><div><dt>10+</dt><dd>Countries</dd></div></dl>
      </div>
      <svg class="ex-svg" :viewBox="`0 0 ${MW} ${MH}`" aria-label="Map of India with routes from Bengaluru">
        <g class="ex-dots"><circle v-for="(d, k) in dots" :key="k" :cx="d[0]" :cy="d[1]" r="2.3" /></g>
        <path v-for="(c, k) in routes" :key="c.name" class="ex-route" :d="c.d" pathLength="1" :style="{ strokeDashoffset: 1 - Math.min(1, Math.max(0, mapP * 1.6 - k * 0.12)) }" />
        <g v-for="(c, k) in routes" :key="c.name + 'p'" class="ex-city" :class="{ on: mapP * 1.6 - k * 0.12 > 0.95 }" :transform="`translate(${c.x} ${c.y})`"><circle r="6" /><text :x="c.lx" y="5" :text-anchor="c.lx < 0 ? 'end' : 'start'">{{ c.name }}</text></g>
        <g class="ex-hub" :transform="`translate(${hub[0]} ${hub[1]})`"><circle class="ex-ping" r="10" /><circle r="8" /><text x="16" y="24">Bengaluru</text></g>
      </svg>
    </section>

    <!-- 5 · three steps -->
    <section class="ex-steps">
      <span class="ex-eye rv"><i></i>Ordering</span>
      <h2 class="rv" style="--d: 0.05s">Three steps. No waiting list.</h2>
      <ol>
        <li v-for="(s, k) in howTo" :key="s[0]" class="rv" :style="{ '--d': k * 0.1 + 's' }"><em>{{ k + 1 }}</em><b>{{ s[0] }}</b><p>{{ s[1] }}</p></li>
      </ol>
      <button class="ex-cta rv" data-cursor="" @click="contact()"><span>Order a standard model</span><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.4" /></svg></button>
    </section>

    <NextUp label="Next vertical" title="Testing Services" text="An accredited lab, next door." :href="to(vertical('testing')!)" />
  </PageShell>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { geoMercator, geoContains } from 'd3-geo'
import { feature } from 'topojson-client'
import PageShell from '../components/PageShell.vue'
import NextUp from '../components/NextUp.vue'
import VMotif from '../components/VMotif.vue'
import { vertical, to } from '../config/verticals'
import { products } from '../config/products'

const points: [string, string][] = [
  ['In stock', 'Built ahead, not after the order.'],
  ['Own lines', 'Apart from custom work.'],
  ['Quick delivery', 'On standard models.'],
  ['Global', 'India and 10+ countries.']
]
const howTo: [string, string][] = [
  ['Pick a model', 'From the board, or tell us the range.'],
  ['Confirm', 'An engineer confirms model and date.'],
  ['Track it', 'Until it is installed and running.']
]

// the order card: an illustration of the stages, not a live order (it loops)
const stages = [
  { t: 'Order placed', d: 'Confirmed by an engineer' },
  { t: 'Picked from stock', d: 'A standard model, already built' },
  { t: 'Tested before dispatch', d: 'Run and checked at the factory' },
  { t: 'Packed and on the way', d: 'Dispatched from Bengaluru' },
  { t: 'Installed at your lab', d: 'Set up, and your team trained' }
]
const demos = [{ model: 'ET300', city: 'To Pune' }, { model: 'EM64-30T-D', city: 'To Hyderabad' }, { model: 'ETS-100', city: 'To Faridabad' }]
const stage = ref(0), di = ref(0)
const demo = computed(() => demos[di.value])
let timer = 0

// the stock board: standard models from the product list. Statuses are a SAMPLE until live stock is connected.
const std = ['et', 'mini', 'ets', 'battery', 'ovens-dryers'].map((s) => products.find((p) => p.slug === s)!)
const series = std.map((p) => p.code === 'EO' ? 'EO / ETD' : p.code)
const allRows = std.flatMap((p, k) => p.models[0].items.concat(p.slug === 'ovens-dryers' ? p.models[1].items : []).map((m) => {
  let h = 0; for (const c of m) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const k2 = h % 5
  return { series: series[k], model: m, ...(k2 < 2 ? { status: 'In stock', k: 'ok' } : k2 < 4 ? { status: 'Ships in 7 days', k: 'soon' } : { status: 'Made to order', k: 'mto' }) }
}))
const sf = ref('All'), mq = ref('')
const rows = computed(() => allRows.filter((r) => (sf.value === 'All' || r.series === sf.value) && r.model.toLowerCase().includes(mq.value.trim().toLowerCase())).slice(0, 12))

// the map: India as a field of dots, routes out of Bengaluru to the four regional offices
const MW = 760, MH = 820
const dots = ref<[number, number][]>([])
const hub = ref<[number, number]>([0, 0])
const routes = ref<{ name: string; d: string; x: number; y: number; lx: number }[]>([])
const offices: [string, number, number, number][] = [['Faridabad', 77.31, 28.41, 14], ['Pune', 73.86, 18.52, -14], ['Hyderabad', 78.49, 17.39, 14], ['Coimbatore', 76.96, 11.02, -14]]
async function buildMap() {
  const topo = await (await fetch('/data/countries-110m.json')).json()
  const india = (feature(topo, topo.objects.countries) as any).features.find((f: any) => f.id === '356')
  const proj = geoMercator().fitExtent([[40, 30], [MW - 40, MH - 30]], india)
  const out: [number, number][] = []
  for (let y = 30; y < MH - 30; y += 11) for (let x = 40; x < MW - 40; x += 11) {
    const ll = proj.invert!([x, y]); if (ll && geoContains(india, ll)) out.push([x, y])
  }
  dots.value = out
  const h = proj([77.59, 12.97])!; hub.value = [h[0], h[1]]
  routes.value = offices.map(([name, lon, lat, lx]) => {
    const [x, y] = proj([lon, lat])!
    const mx = (h[0] + x) / 2 + (y - h[1]) * 0.18, my = (h[1] + y) / 2 - (x - h[0]) * 0.18
    return { name, x, y, lx, d: `M${h[0]} ${h[1]} Q ${mx} ${my} ${x} ${y}` }
  })
}

const mapRef = ref<HTMLElement | null>(null), mapP = ref(0), filmRef = ref<HTMLElement | null>(null), filmPicRef = ref<HTMLElement | null>(null)
// the header logo turns white while a dark photo or navy panel is under it (PageShell reads html.hx-dark)
const under = (el: Element | null | undefined) => { if (!el) return false; const r = el.getBoundingClientRect(); return r.top < 44 && r.bottom > 44 }
function tick() {
  const r = mapRef.value!.getBoundingClientRect(), H = window.innerHeight
  mapP.value = Math.min(1, Math.max(0, (H * 0.9 - r.top) / (r.height * 0.9)))
  // the floor photo opens from a slit to the full band as it comes up the screen
  const f = filmRef.value!.getBoundingClientRect(), e = Math.min(1, Math.max(0, (H - f.top) / (H * 0.9)))
  filmPicRef.value!.style.clipPath = `inset(${((1 - e) * 30).toFixed(2)}% ${((1 - e) * 12).toFixed(2)}% round ${(28 - e * 8).toFixed(1)}px)`
  document.documentElement.classList.toggle('hx-dark', (e > 0.7 && under(filmPicRef.value)) || under(document.querySelector('.ex-board')))
}
function go(target: string) {
  const el = document.getElementById(target), sc = document.querySelector('#scroller') as HTMLElement
  if (el) (window as any).lenisInstance?.scrollTo(el.getBoundingClientRect().top + sc.scrollTop - 40)
}
onMounted(() => {
  buildMap()
  gsap.ticker.add(tick)
  timer = window.setInterval(() => { if (stage.value < stages.length - 1) stage.value++; else { stage.value = 0; di.value = (di.value + 1) % demos.length } }, 1700)
})
onUnmounted(() => { gsap.ticker.remove(tick); clearInterval(timer); document.documentElement.classList.remove('hx-dark') })
</script>

<style scoped>
.ex-eye { display: inline-flex; align-items: center; gap: 12px; font-family: 'Geist Mono', monospace; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(13, 35, 64, 0.7); }
.ex-eye i { width: 8px; height: 8px; border-radius: 50%; background: #ff6a1a; box-shadow: 0 0 0 5px rgba(255, 106, 26, 0.18); }
h2 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(34px, 5vw, 96px); line-height: 1; letter-spacing: -0.055em; color: #0d2340; }
.ex-cta { display: inline-flex; align-items: center; gap: 14px; padding: 18px 28px; border: 0; border-radius: 40px; background: #ff6a1a; color: #0a0a0c; font-family: 'Geist Mono', monospace; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: background 0.4s ease, gap 0.4s ease; }
.ex-cta:hover { background: #ff8a4a; gap: 20px; }
.ex-cta svg { width: 10px; height: 10px; }

/* 1 · hero */
.ex-hero { position: relative; min-height: 100vh; display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr); align-items: center; gap: 4vw; padding: 20vh 5vw 8vh; color: #0d2340; }
.ex-crumb { position: absolute; left: 5vw; top: 15vh; display: flex; gap: 12px; font-family: 'Geist Mono', monospace; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(13, 35, 64, 0.65); }
.ex-crumb a { color: inherit; text-decoration: none; border-bottom: 1px solid rgba(13, 35, 64, 0.35); }
.ex-crumb a:hover { color: #ff6a1a; border-color: #ff6a1a; }
.ex-crumb i { font-style: normal; opacity: 0.5; }
.ex-copy { display: flex; flex-direction: column; align-items: flex-start; gap: 3.2vh; }
.ex-badge { display: inline-flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 40px; background: #ff6a1a; color: #0a0a0c; font-family: 'Geist Mono', monospace; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; animation: ex-fade 1s ease 0.3s both; }
.ex-badge i { width: 8px; height: 8px; border-radius: 50%; background: #0a0a0c; animation: ex-pulse 1.4s ease-in-out infinite; }
@keyframes ex-pulse { 50% { opacity: 0.25; } }
@keyframes ex-fade { from { opacity: 0; } }
.ex-h { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(40px, 6vw, 118px); line-height: 0.96; letter-spacing: -0.06em; }
.ex-ln { display: block; overflow: hidden; padding-bottom: 0.07em; }
.ex-ln > span { display: block; animation: ex-up 1.3s cubic-bezier(0.2, 0.9, 0.2, 1) both; animation-delay: calc(0.45s + var(--k) * 0.12s); }
.ex-ln:last-child > span { color: #ff6a1a; }
@keyframes ex-up { from { transform: translateY(110%); } }
.ex-sub { margin: 0; font-family: 'Geist', sans-serif; font-size: clamp(20px, 1.6vw, 28px); line-height: 1.4; color: rgba(13, 35, 64, 0.82); animation: ex-fade 1.2s ease 1s both; }
.ex-act { display: flex; align-items: center; gap: 28px; flex-wrap: wrap; animation: ex-fade 1.2s ease 1.2s both; }
.ex-act a { font-family: 'Geist', sans-serif; font-size: 18px; color: #0d2340; text-decoration: none; }
.ex-act a:hover { color: #ff6a1a; }

/* the order card: navy, like a phone screen */
.ex-order { position: relative; padding: 26px 26px 18px; border-radius: 28px; background: #0d2340; color: #eef3fa; box-shadow: 0 50px 90px -40px rgba(13, 35, 64, 0.7); animation: ex-card 1.4s cubic-bezier(0.2, 0.9, 0.2, 1) 0.8s both; }
@keyframes ex-card { from { opacity: 0; transform: translateY(40px) rotate(2deg) scale(0.96); } }
.ex-order header { display: grid; grid-template-columns: 1fr auto; gap: 6px 12px; padding-bottom: 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.12); }
.ex-order header span { grid-column: 1 / -1; font-family: 'Geist Mono', monospace; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(238, 243, 250, 0.6); }
.ex-order header b { font-family: var(--font-display); font-weight: 400; font-size: 26px; letter-spacing: -0.04em; }
.ex-order header small { align-self: center; padding: 6px 12px; border-radius: 20px; background: rgba(156, 205, 255, 0.16); color: #b9dcff; font-family: 'Geist', sans-serif; font-size: 15px; }
.ex-track { position: relative; height: 4px; margin: 26px 12px 22px 0; border-radius: 4px; background: rgba(255, 255, 255, 0.12); }
.ex-track > i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 4px; background: linear-gradient(90deg, #8ec5ff, #ff6a1a); transition: width 0.9s cubic-bezier(0.2, 0.9, 0.2, 1); }
.ex-truck { position: absolute; top: 50%; width: 30px; translate: -50% -60%; color: #ff8a4a; transition: left 0.9s cubic-bezier(0.2, 0.9, 0.2, 1); }
.ex-truck svg { display: block; width: 30px; }
.ex-truck circle { fill: #0d2340; }
.ex-order ol { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.ex-order li { display: grid; grid-template-columns: 26px 1fr; gap: 14px; align-items: start; padding: 11px 0; opacity: 0.4; transition: opacity 0.5s ease; }
.ex-order li.done, .ex-order li.now { opacity: 1; }
.ex-order li i { width: 22px; height: 22px; margin-top: 2px; display: grid; place-items: center; border-radius: 50%; border: 1.5px solid rgba(255, 255, 255, 0.35); color: #0d2340; transition: background 0.4s ease, border-color 0.4s ease; }
.ex-order li.done i { background: #8ec5ff; border-color: #8ec5ff; }
.ex-order li.now i { border-color: #ff6a1a; box-shadow: 0 0 0 5px rgba(255, 106, 26, 0.2); animation: ex-pulse 1.2s ease-in-out infinite; }
.ex-order li i svg { width: 12px; height: 12px; }
.ex-order li b { display: block; font-family: 'Geist', sans-serif; font-weight: 500; font-size: 18px; }
.ex-order li small { display: block; margin-top: 2px; font-family: 'Geist', sans-serif; font-size: 15px; color: rgba(238, 243, 250, 0.62); }

/* the floor photo */
.ex-film { position: relative; padding: 4vh 0 0; }
.ex-film figure { margin: 0; height: 88vh; overflow: hidden; clip-path: inset(30% 12% round 28px); }
.ex-film img { width: 100%; height: 100%; object-fit: cover; }
.ex-film p { position: absolute; left: 5vw; bottom: 8vh; margin: 0; font-family: var(--font-display); font-size: clamp(30px, 4vw, 76px); line-height: 1; letter-spacing: -0.05em; color: #fff; text-shadow: 0 10px 40px rgba(0, 0, 0, 0.45); }

/* 2 · two factories */
.ex-two { padding: 18vh 5vw 8vh; display: flex; flex-direction: column; gap: 3vh; }
.ex-split { display: grid; grid-template-columns: 1fr 1fr; gap: 1.6vw; margin-top: 5vh; }
.ex-split article { position: relative; display: flex; flex-direction: column; gap: 1.6vh; padding: 28px 28px 34px; border-radius: 28px; background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(13, 35, 64, 0.08); color: #0d2340; }
.ex-split article.on { background: #0d2340; color: #eef3fa; }
.ex-split article.on .ex-mot { --mi: #dbe8f6; }
.ex-mot { width: 100%; max-height: 38vh; margin: 2vh 0 1vh; }
.ex-tag { align-self: flex-start; padding: 8px 14px; border-radius: 30px; background: rgba(13, 35, 64, 0.08); font-family: 'Geist Mono', monospace; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; }
.on .ex-tag { background: #ff6a1a; color: #0a0a0c; font-weight: 600; }
.ex-split b { font-family: var(--font-display); font-weight: 400; font-size: clamp(24px, 2.4vw, 44px); letter-spacing: -0.05em; }
.ex-split p { margin: 0; font-family: 'Geist', sans-serif; font-size: clamp(18px, 1.3vw, 22px); line-height: 1.5; opacity: 0.8; }
.ex-pts { list-style: none; margin: 10vh 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2vw; color: #0d2340; }
.ex-pts li { display: flex; flex-direction: column; gap: 1.4vh; padding-top: 3vh; }
.ex-pts em { font-style: normal; font-family: 'Geist Mono', monospace; font-size: 14px; color: #ff6a1a; }
.ex-pts b { font-family: var(--font-display); font-weight: 400; font-size: clamp(22px, 2vw, 36px); letter-spacing: -0.045em; line-height: 1.1; }
.ex-pts span { font-family: 'Geist', sans-serif; font-size: 18px; line-height: 1.5; opacity: 0.72; }

/* 3 · stock board: the navy moment */
.ex-board { margin: 10vh 2vw; padding: 8vh 4vw 6vh; border-radius: clamp(28px, 4vw, 64px); background: #0d2340; color: #eef3fa; }
.ex-board .ex-eye { color: rgba(238, 243, 250, 0.7); }
.ex-board h2 { margin-top: 2vh; color: #eef3fa; font-size: clamp(30px, 3.6vw, 68px); }
.ex-board-top { display: flex; justify-content: space-between; align-items: flex-end; gap: 2vw; flex-wrap: wrap; }
.ex-demo { padding: 9px 14px; border-radius: 30px; border: 1px dashed rgba(255, 190, 120, 0.6); color: #ffc58a; font-family: 'Geist Mono', monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }
.ex-tools { display: flex; justify-content: space-between; align-items: center; gap: 2vw; margin: 4vh 0 2vh; flex-wrap: wrap; }
.ex-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.ex-chips button { padding: 11px 18px; border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.24); background: transparent; color: inherit; font-family: 'Geist Mono', monospace; font-size: 14px; letter-spacing: 0.06em; cursor: pointer; transition: background 0.3s ease, color 0.3s ease; }
.ex-chips button:hover { background: rgba(255, 255, 255, 0.1); }
.ex-chips button.on { background: #eef3fa; color: #0d2340; border-color: #eef3fa; }
.ex-tools input { width: 260px; height: 48px; padding: 0 16px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.24); background: transparent; color: inherit; font-family: 'Geist', sans-serif; font-size: 17px; outline: none; transition: border-color 0.3s ease; }
.ex-tools input::placeholder { color: rgba(238, 243, 250, 0.55); }
.ex-tools input:focus { border-color: #ff8a4a; }
.ex-tr { display: grid; grid-template-columns: 1fr 1.4fr 1.4fr 110px; align-items: center; gap: 12px; padding: 16px 8px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-family: 'Geist', sans-serif; font-size: 18px; transition: background 0.3s ease; }
.ex-tr:not(.ex-th) { animation: ex-row 0.7s cubic-bezier(0.2, 0.9, 0.2, 1) both; animation-delay: calc(var(--k) * 0.04s); }
@keyframes ex-row { from { opacity: 0; transform: translateY(8px); } }
.ex-tr:not(.ex-th):hover { background: rgba(255, 255, 255, 0.05); }
.ex-th { font-family: 'Geist Mono', monospace; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.55; border-top: 0; }
.ex-flap { font-family: 'Geist Mono', monospace; font-weight: 600; font-size: 19px; letter-spacing: 0.04em; }
.ex-tr .st { display: flex; align-items: center; gap: 10px; }
.ex-tr .st i { width: 9px; height: 9px; border-radius: 50%; background: #8a8f98; }
.st.ok i { background: #4ade80; box-shadow: 0 0 10px rgba(74, 222, 128, 0.6); } .st.soon i { background: #fbbf24; } .st.mto i { background: #8a8f98; }
.ex-tr button { justify-self: end; padding: 10px 16px; border-radius: 22px; border: 1px solid rgba(255, 255, 255, 0.28); background: transparent; color: inherit; font-family: 'Geist Mono', monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease; }
.ex-tr button:hover { background: #ff6a1a; border-color: #ff6a1a; color: #0a0a0c; }
.ex-none { margin: 3vh 0 0; text-align: center; font-family: 'Geist', sans-serif; font-size: 17px; opacity: 0.6; }

/* 4 · map */
.ex-map { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); align-items: center; gap: 4vw; padding: 12vh 5vw 8vh; color: #0d2340; }
.ex-map-tx { display: flex; flex-direction: column; gap: 3vh; }
.ex-map-tx p { margin: 0; max-width: 24em; font-family: 'Geist', sans-serif; font-size: clamp(18px, 1.4vw, 24px); line-height: 1.5; opacity: 0.8; }
.ex-map-tx dl { display: flex; gap: 4vw; margin: 2vh 0 0; }
.ex-map-tx dt { margin-bottom: 1.2vh; line-height: 1; font-family: var(--font-display); font-size: clamp(36px, 4vw, 76px); letter-spacing: -0.05em; color: #ff6a1a; }
.ex-map-tx dd { margin: 0; font-family: 'Geist', sans-serif; font-size: 18px; opacity: 0.7; }
.ex-svg { width: 100%; height: auto; max-height: 86vh; overflow: visible; }
.ex-dots circle { fill: rgba(13, 35, 64, 0.22); }
.ex-route { fill: none; stroke: #ff6a1a; stroke-width: 2.6; stroke-linecap: round; stroke-dasharray: 1; }
.ex-city circle { fill: #eef4fb; stroke: #0d2340; stroke-width: 1.5; transition: fill 0.4s ease, stroke 0.4s ease; }
.ex-city.on circle { fill: #ff6a1a; stroke: #ff6a1a; }
.ex-city text, .ex-hub text { font-family: 'Geist', sans-serif; font-size: 22px; fill: rgba(13, 35, 64, 0.5); transition: fill 0.4s ease; }
.ex-city.on text { fill: #0d2340; }
.ex-hub circle { fill: #0d2340; }
.ex-hub text { fill: #0d2340; font-weight: 600; }
.ex-ping { fill: none !important; stroke: #0d2340; stroke-width: 1.5; animation: ex-ping 2s ease-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes ex-ping { from { transform: scale(1); opacity: 0.9; } to { transform: scale(4); opacity: 0; } }

/* 5 · steps */
.ex-steps { padding: 14vh 5vw 4vh; display: flex; flex-direction: column; align-items: flex-start; gap: 3vh; }
.ex-steps ol { list-style: none; margin: 6vh 0 4vh; padding: 0; width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.6vw; }
.ex-steps li { display: flex; flex-direction: column; gap: 2vh; padding: 4vh 2vw 5vh; border-radius: 28px; background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(13, 35, 64, 0.08); color: #0d2340; transition: background 0.4s ease, transform 0.6s cubic-bezier(0.2, 0.9, 0.2, 1); }
.ex-steps li:hover { background: #fff; transform: translateY(-6px); }
.ex-steps em { font-style: normal; font-family: var(--font-display); font-size: clamp(48px, 5vw, 96px); line-height: 1; letter-spacing: -0.05em; color: #ff6a1a; }
.ex-steps b { line-height: 1.12; font-family: var(--font-display); font-weight: 400; font-size: clamp(22px, 2vw, 36px); letter-spacing: -0.045em; }
.ex-steps p { margin: 0; font-family: 'Geist', sans-serif; font-size: clamp(18px, 1.3vw, 22px); line-height: 1.5; opacity: 0.75; }

@media (max-width: 900px) {
  .ex-hero { grid-template-columns: 1fr; padding-top: 22vh; gap: 6vh; }
  .ex-crumb { top: 13vh; }
  .ex-film figure { height: 60vh; }
  .ex-split, .ex-steps ol { grid-template-columns: 1fr; gap: 16px; }
  .ex-pts { grid-template-columns: 1fr 1fr; gap: 6vw; }
  .ex-board { margin: 6vh 2vw; padding: 6vh 6vw; }
  .ex-tools input { width: 100%; }
  .ex-tr { grid-template-columns: 1fr; gap: 4px; font-size: 16px; }
  .ex-tr > span:first-child, .ex-th span:first-child, .ex-tr button, .ex-th span:last-child { display: none; }
  .ex-map { grid-template-columns: 1fr; }
  .ex-steps li { padding: 4vh 6vw; }
}
</style>
