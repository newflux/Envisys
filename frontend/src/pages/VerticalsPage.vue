<template>
  <PageShell title="Verticals" dark v-slot="{ contact }">
    <!-- 1 · the tree: one company, six branches -->
    <section class="vt-open">
      <span class="ps-label rv"><i>+</i> Business verticals</span>
      <h1 class="vt-h rv" style="--d: 0.06s">One stop for<br />environmental testing.</h1>

      <div class="vt-tree rv" style="--d: 0.1s">
        <svg class="vt-svg" :viewBox="`0 0 ${TW} ${TH}`" preserveAspectRatio="none" aria-hidden="true">
          <path v-for="(v, i) in verticals" :key="v.id" :d="curve(i)" :class="{ on: hot === i }" pathLength="1" :style="{ '--i': i }" />
        </svg>
        <div class="vt-root"><b>Envisys</b><small>Technologies</small></div>
        <button v-for="(v, i) in verticals" :key="v.id" class="vt-node" :class="{ on: hot === i }" :style="{ top: ny(i) + '%', '--i': i }" data-cursor="" @pointerenter="hot = i" @pointerleave="hot = -1" @click="goto(v.id)">
          <em>0{{ i + 1 }}</em><span>{{ v.name }}</span><small>{{ v.line }}</small>
        </button>
      </div>
    </section>

    <!-- 2 · the six chapters, joined by a line that fills as you read -->
    <div class="vt-body" ref="bodyRef">
      <div class="vt-spine"><i ref="fillRef"></i></div>

      <section v-for="(v, i) in verticals" :key="v.id" :id="`v-${v.id}`" class="vt-ch">
        <div class="vt-row">
        <div class="vt-l">
          <span class="vt-no rv">0{{ i + 1 }}<u></u></span>
          <h2 class="vt-t rv" style="--d: 0.05s">{{ v.name }}</h2>
          <p class="vt-d rv" style="--d: 0.1s">{{ v.text }}</p>
          <button v-if="v.cta" class="ps-pill light rv" style="--d: 0.14s" data-cursor="" @click="contact()"><span>{{ v.cta }}</span><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg></button>
        </div>

        <ul class="vt-leaves">
          <li v-for="(l, j) in v.leaves" :key="l.t" class="rv" :style="{ '--d': j * 0.06 + 's' }">
            <component :is="l.href ? 'a' : 'div'" :href="l.href" :target="l.href && l.href.startsWith('http') ? '_blank' : undefined" rel="noopener" class="vt-leaf" data-cursor="">
              <b>{{ l.t }}</b>
              <span>{{ l.d }}</span>
              <svg v-if="l.href" viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.2" /></svg>
            </component>
          </li>
        </ul>
        </div>

        <!-- the express factory carries the stock chart -->
        <div v-if="v.id === 'express'" class="vt-stock rv">
          <div class="vt-st-top">
            <div><span class="ps-label"><i>+</i> In stock</span><h3>Standard models, ready to ship.</h3></div>
            <span class="vt-demo">Sample statuses · connect to live stock</span>
          </div>
          <div class="vt-st-tools">
            <div class="vt-chips"><button v-for="s in ['All', ...series]" :key="s" :class="{ on: sf === s }" data-cursor="" @click="sf = s">{{ s }}</button></div>
            <input v-model="mq" type="text" placeholder="Find a model" spellcheck="false" />
          </div>
          <div class="vt-table">
            <div class="vt-tr vt-th"><span>Series</span><span>Model</span><span>Status</span><span></span></div>
            <div v-for="r in rows" :key="r.model" class="vt-tr">
              <span>{{ r.series }}</span><span>{{ r.model }}</span>
              <span class="st" :class="r.k"><i></i>{{ r.status }}</span>
              <button data-cursor="" @click="contact()">Enquire</button>
            </div>
            <p v-if="!rows.length" class="vt-none">No model matches “{{ mq }}”.</p>
          </div>
        </div>
      </section>
    </div>

    <NextUp solid label="Next up" title="Guides and brochures" text="How to choose, rent and run environmental test equipment, from the engineers who build it." href="/resources" />
  </PageShell>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import PageShell from '../components/PageShell.vue'
import NextUp from '../components/NextUp.vue'
import { products } from '../config/products'

// Copy comes from the CII National Shining MSME Awards 2026 deck and envisystech.com.
interface Leaf { t: string; d: string; href?: string }
const verticals: { id: string; name: string; line: string; text: string; cta?: string; leaves: Leaf[] }[] = [
  { id: 'design', name: 'Design & Build', line: 'Chambers and simulation systems', cta: 'Start a project',
    text: 'Design and supply of environmental test chambers and simulation systems, standard or built to your specification, by a dedicated design and development team.',
    leaves: [
      { t: 'ET chambers', d: 'Temperature and humidity, 150 to 3000 L', href: '/products/et' }, { t: 'Thermal shock', d: 'Hot to cold in under ten seconds', href: '/products/ets' },
      { t: 'Altitude', d: 'Low pressure with temperature', href: '/products/eta' }, { t: 'Mini chambers', d: 'Bench and floor models', href: '/products/mini' },
      { t: 'Walk-in rooms', d: 'Large specimens, built to order', href: '/products/walk-in' }, { t: 'Everything else', d: 'The full catalogue of twenty-four series', href: '/products' }
    ] },
  { id: 'testing', name: 'Testing Services', line: 'Vistara, NABL-accredited lab', cta: 'Book a test',
    text: 'Vistara is the testing lab of Envisys in Peenya, accredited by NABL under the environmental testing discipline. Product qualification, reliability and performance testing, run by the people who build the chambers.',
    leaves: [
      { t: 'Temperature & humidity', d: 'MIL-810, DO-160, IEC 60068-2 series' }, { t: 'Salt spray', d: 'ASTM B-117, ISO 9227, MIL-810' },
      { t: 'Dust', d: 'IP tests to IEC 60529' }, { t: 'Rain', d: 'IP tests, up to a 3500 L chamber' },
      { t: 'ESS: HALT & HASS', d: 'Stress screening, in the scope of the lab' }, { t: 'Prototype development', d: 'Material analysis and proto-type testing' }
    ] },
  { id: 'rentals', name: 'Rentals', line: 'Chambers, by the week', cta: 'Ask about a rental',
    text: 'When the test is short, or the budget is for a project and not a purchase, rent the chamber. Envisys has a dedicated rental division.',
    leaves: [
      { t: 'Climatic chambers', d: 'Short-term testing, without owning one', href: 'https://www.envisystech.com/blog/where-can-i-rent-a-climatic-test-chamber-for-short-term-testing/' },
      { t: 'Thermal shock rental', d: 'A quick buyer’s guide', href: 'https://www.envisystech.com/blog/thermal-shock-chamber-rental/' },
      { t: 'What decides the price', d: 'Factors affecting rental price', href: 'https://www.envisystech.com/blog/factors-affecting-environmental-chamber-rental-price/' },
      { t: 'Rent, buy or send it to a lab', d: 'How to decide', href: 'https://www.envisystech.com/blog/environmental-test-chamber-rental-vs-buying-vs-testing-labs/' }
    ] },
  { id: 'refurb', name: 'Refurbishments & Buyback', line: 'A second life for chambers', cta: 'Discuss your chamber',
    text: 'Refurbishment and modernisation of existing chambers, and buy-back solutions when it is time to replace one.',
    leaves: [{ t: 'Refurbishment', d: 'Restore an ageing chamber to working order' }, { t: 'Modernisation', d: 'Controls and systems brought up to date' }, { t: 'Buyback', d: 'Trade in the chamber you are replacing' }] },
  { id: 'aftersales', name: 'After Sales & AMCs', line: 'Support for the life of the chamber', cta: 'Set up an AMC',
    text: 'Calibration, annual maintenance contracts and lifecycle support, with engineers across India and complaints answered within 24 hours.',
    leaves: [{ t: 'Annual maintenance', d: 'AMCs across the installed base' }, { t: 'Calibration', d: 'Calibration of chambers' }, { t: 'Repair and spares', d: 'Technical and engineering support round the clock' }, { t: 'Regional offices', d: 'Faridabad, Pune, Coimbatore and Hyderabad' }] },
  { id: 'express', name: 'Express Factory', line: 'Standard models, ready stock', cta: 'Order a standard model',
    text: 'Built for speed, ready for the world. A second factory with dedicated production lines and supply chain for standard models, kept in stock and shipped fast across India and abroad, while the project factory continues to take on complex custom work.',
    leaves: [{ t: 'Standard models in stock', d: 'Ready to ship' }, { t: 'Quick-commerce delivery', d: 'Fast delivery on standard models' }, { t: 'Dedicated lines & supply chain', d: 'Production kept apart from custom work' }, { t: 'Pan-India and global network', d: 'Distribution across India and ten-plus countries' }] }
]

const hot = ref(-1)
// tree geometry, in a 1000 x 560 box: the root sits left, the six nodes right
const TW = 1000, TH = 560, RX = 130, RY = 280, NX = 560
const ny = (i: number) => ((60 + i * 88) / TH) * 100
const curve = (i: number) => { const y = 60 + i * 88; return `M${RX} ${RY} C ${RX + 220} ${RY}, ${NX - 220} ${y}, ${NX} ${y}` }
const bodyRef = ref<HTMLElement | null>(null)
const fillRef = ref<HTMLElement | null>(null)
function goto(id: string) {
  const el = document.getElementById(`v-${id}`), sc = document.querySelector('#scroller') as HTMLElement
  if (el) (window as any).lenisInstance?.scrollTo(el.getBoundingClientRect().top + sc.scrollTop - 40)
}

// the express factory's stock chart: standard models from the product list. Statuses are a SAMPLE until live stock is connected.
const std = ['et', 'mini', 'ets', 'battery', 'ovens-dryers'].map((s) => products.find((p) => p.slug === s)!)
const series = std.map((p) => p.code === 'EO' ? 'EO / ETD' : p.code)
const allRows = std.flatMap((p, k) => p.models[0].items.concat(p.slug === 'ovens-dryers' ? p.models[1].items : []).map((m) => {
  let h = 0; for (const c of m) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const k2 = h % 5
  return { series: series[k], model: m, ...(k2 < 2 ? { status: 'In stock', k: 'ok' } : k2 < 4 ? { status: 'Ships in 7 days', k: 'soon' } : { status: 'Made to order', k: 'mto' }) }
}))
const sf = ref('All'), mq = ref('')
const rows = computed(() => allRows.filter((r) => (sf.value === 'All' || r.series === sf.value) && r.model.toLowerCase().includes(mq.value.trim().toLowerCase())).slice(0, 14))

function tick() {
  const b = bodyRef.value!.getBoundingClientRect(), H = window.innerHeight
  fillRef.value!.style.transform = `scaleY(${Math.min(1, Math.max(0, (H * 0.55 - b.top) / b.height)).toFixed(4)})`
}
onMounted(() => gsap.ticker.add(tick))
onUnmounted(() => gsap.ticker.remove(tick))
</script>

<style scoped>
.vt-open { padding: 22vh 5vw 8vh; display: flex; flex-direction: column; gap: 3vh; }
.vt-h { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(32px, 5.2vw, 98px); line-height: 1; letter-spacing: -0.055em; }

.vt-tree { position: relative; margin-top: 6vh; width: 100%; aspect-ratio: 1000 / 560; max-height: 74vh; }
.vt-svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.vt-svg path { fill: none; stroke: rgba(255, 255, 255, 0.28); stroke-width: 1.1; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke 0.4s ease; }
.vt-tree.in .vt-svg path { animation: vt-draw 1.6s var(--ease) both; animation-delay: calc(0.3s + var(--i) * 0.1s); }
@keyframes vt-draw { to { stroke-dashoffset: 0; } }
.vt-svg path.on { stroke: #ff7a2a; stroke-width: 1.8; }
.vt-root { position: absolute; left: 13%; top: 50%; translate: -50% -50%; width: clamp(80px, 9vw, 150px); aspect-ratio: 1; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f4f4f2; color: #0a0a0c; box-shadow: 0 0 0 10px rgba(244, 244, 242, 0.08), 0 0 60px rgba(255, 106, 26, 0.18); }
.vt-root b { font-weight: 400; font-family: var(--font-display); font-size: clamp(14px, 1.4vw, 24px); letter-spacing: -0.05em; }
.vt-root small { font-family: var(--font-body); font-size: 8px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.55; }
.vt-node { position: absolute; left: 56%; translate: 0 -50%; display: grid; grid-template-columns: auto 1fr; column-gap: 14px; align-items: baseline; text-align: left; padding: 0 0 0 22px; border: 0; background: none; color: inherit; cursor: pointer; opacity: 0; transition: transform 0.5s var(--ease), opacity 0.8s ease; }
.vt-tree.in .vt-node { opacity: 0.55; transition-delay: calc(0.9s + var(--i) * 0.08s), 0s; }
.vt-tree.in .vt-node.on { opacity: 1; transition-delay: 0s; transform: translateX(10px); }
.vt-node::before { content: ''; position: absolute; left: 0; top: 50%; translate: -50% -50%; width: 9px; height: 9px; border-radius: 50%; background: #f4f4f2; transition: background 0.3s ease, box-shadow 0.4s ease; }
.vt-node.on::before { background: #ff7a2a; box-shadow: 0 0 0 6px rgba(255, 122, 42, 0.2); }
.vt-node em { font-style: normal; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.12em; opacity: 0.6; }
.vt-node span { font-family: var(--font-display); font-size: clamp(15px, 1.9vw, 34px); letter-spacing: -0.045em; }
.vt-node small { grid-column: 2; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.55; }

.vt-body { position: relative; padding: 4vh 5vw 8vh 9vw; }
.vt-spine { position: absolute; left: 3.6vw; top: 0; bottom: 0; width: 1px; background: rgba(255, 255, 255, 0.14); }
.vt-spine i { position: absolute; inset: 0; background: #ff7a2a; transform-origin: 0 0; transform: scaleY(0); }
.vt-ch { position: relative; padding: 14vh 0 12vh; border-top: 1px solid rgba(255, 255, 255, 0.1); }
.vt-ch:first-child { border-top: 0; }
.vt-row { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 4vw; }
.vt-l { align-items: flex-start; position: sticky; top: 16vh; align-self: start; display: flex; flex-direction: column; gap: 2.4vh; }
.vt-no { position: relative; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.16em; opacity: 0.7; display: flex; align-items: center; gap: 14px; }
.vt-no u { width: 46px; height: 1px; background: rgba(255, 255, 255, 0.35); }
.vt-ch::before { content: ''; position: absolute; left: -5.4vw; top: calc(14vh + 5px); width: 9px; height: 9px; margin-left: -4px; border-radius: 50%; background: #000; border: 1px solid rgba(255, 255, 255, 0.5); }
.vt-t { margin: 0; font-weight: 400; font-family: var(--font-display); font-size: clamp(26px, 3.6vw, 68px); line-height: 1; letter-spacing: -0.055em; }
.vt-d { margin: 0; max-width: 30em; font-family: var(--font-body); font-size: clamp(12px, 0.95vw, 14px); line-height: 1.75; opacity: 0.72; }

/* the branch: a line down the left, a tick into every leaf */
.vt-leaves { list-style: none; margin: 0; padding: 0 0 0 28px; border-left: 1px solid rgba(255, 255, 255, 0.22); display: flex; flex-direction: column; gap: 10px; align-self: start; }
.vt-leaves li { position: relative; }
.vt-leaves li::before { content: ''; position: absolute; left: -28px; top: 50%; width: 22px; height: 1px; background: rgba(255, 255, 255, 0.22); }
.vt-leaf { position: relative; display: grid; grid-template-columns: 1fr auto; gap: 4px 20px; padding: 18px 22px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.03); color: inherit; text-decoration: none; transition: background 0.4s ease, border-color 0.4s ease, transform 0.5s var(--ease); }
a.vt-leaf:hover { background: rgba(255, 255, 255, 0.09); border-color: rgba(255, 138, 74, 0.55); transform: translateX(6px); }
.vt-leaf b { font-weight: 400; font-family: var(--font-display); font-size: clamp(15px, 1.4vw, 24px); letter-spacing: -0.04em; }
.vt-leaf span { grid-column: 1; font-family: var(--font-body); font-size: 11.5px; opacity: 0.6; line-height: 1.5; }
.vt-leaf svg { grid-row: 1 / span 2; grid-column: 2; align-self: center; width: 11px; height: 11px; opacity: 0.4; transition: transform 0.4s ease, opacity 0.3s ease; }
a.vt-leaf:hover svg { opacity: 1; transform: translate(3px, -3px); }

.vt-stock { margin-top: 10vh; padding: 3vh 2.4vw 3.4vh; border-radius: 20px; background: #0f1013; border: 1px solid rgba(255, 255, 255, 0.1); }
.vt-st-top { display: flex; justify-content: space-between; align-items: flex-end; gap: 2vw; flex-wrap: wrap; }
.vt-st-top h3 { margin: 1.4vh 0 0; font-weight: 400; font-family: var(--font-display); font-size: clamp(20px, 2.2vw, 40px); letter-spacing: -0.05em; }
.vt-demo { padding: 7px 12px; border-radius: 30px; border: 1px dashed rgba(255, 190, 120, 0.6); color: #ffc58a; font-family: var(--font-body); font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; }
.vt-st-tools { display: flex; justify-content: space-between; align-items: center; gap: 2vw; margin: 3vh 0 2vh; flex-wrap: wrap; }
.vt-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.vt-chips button { padding: 9px 14px; border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.2); background: transparent; color: inherit; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.1em; cursor: pointer; transition: background 0.3s ease, color 0.3s ease; }
.vt-chips button:hover { background: rgba(255, 255, 255, 0.1); }
.vt-chips button.on { background: #f4f4f2; color: #0a0a0c; border-color: #f4f4f2; }
.vt-st-tools input { width: 220px; height: 40px; padding: 0 14px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.18); background: transparent; color: inherit; font-family: var(--font-body); font-size: 12px; outline: none; transition: border-color 0.3s ease; }
.vt-st-tools input:focus { border-color: #ff8a4a; }
.vt-tr { display: grid; grid-template-columns: 1fr 1.4fr 1.4fr 90px; align-items: center; gap: 12px; padding: 14px 6px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-family: var(--font-body); font-size: 12px; letter-spacing: 0.04em; transition: background 0.3s ease; }
.vt-tr:not(.vt-th):hover { background: rgba(255, 255, 255, 0.04); }
.vt-th { font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.5; border-top: 0; }
.vt-tr .st { display: flex; align-items: center; gap: 10px; }
.vt-tr .st i { width: 8px; height: 8px; border-radius: 50%; background: #666; }
.st.ok i { background: #4ade80; box-shadow: 0 0 10px rgba(74, 222, 128, 0.6); } .st.soon i { background: #fbbf24; } .st.mto i { background: #8a8f98; }
.vt-tr button { justify-self: end; padding: 8px 12px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.2); background: transparent; color: inherit; font-family: var(--font-body); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: background 0.3s ease, color 0.3s ease; }
.vt-tr button:hover { background: #f4f4f2; color: #0a0a0c; }
.vt-none { margin: 3vh 0 0; text-align: center; font-family: var(--font-body); font-size: 12px; opacity: 0.55; }

@media (max-width: 900px) {
  .vt-row { grid-template-columns: 1fr; }
  .vt-l { position: static; }
  .vt-tree { aspect-ratio: auto; max-height: none; display: flex; flex-direction: column; gap: 14px; }
  .vt-svg, .vt-root { display: none; }
  .vt-node { position: static; translate: none; opacity: 1 !important; padding-left: 0; }
  .vt-node::before { display: none; }
  .vt-body { padding-left: 8vw; }
  .vt-tr { grid-template-columns: 1fr 1.2fr 1.2fr; } .vt-tr button, .vt-th span:last-child { display: none; }
}
</style>
