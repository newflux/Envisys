<template>
  <!-- The specification, as a buyer reads it: the four numbers first, the ranges as bars, then every model, either as a drawing
       with its data (Visual) or as the plain table (Table), with Ask and Download side by side. Whatever data is not in yet is
       listed at the foot as "still to come"; it is worked out from what is missing (config/details.ts → pendingCards), so filling a
       value in puts it in its place and takes it off the list. -->
  <section id="specification" class="ss">
    <div class="ss-top rv hl"><span>(02)</span><span>Specification</span><span>{{ group }}</span></div>

    <dl class="ss-fig">
      <div v-for="(h, i) in s.headline" :key="h[0]" class="rv" :style="{ '--d': i * 0.06 + 's' }"><dt>{{ h[0] }}</dt><dd>{{ h[1] }}<small>{{ h[2] }}</small></dd></div>
    </dl>

    <div v-if="s.bars.length" class="ss-bars">
      <div v-for="(b, i) in s.bars" :key="b.label" class="ss-bar rv" :style="{ '--d': i * 0.08 + 's' }">
        <div class="ss-bar-h"><b>{{ b.label }}</b><span>{{ fmt(b.from) }} to {{ fmt(b.to) }} {{ b.unit }}</span></div>
        <div class="ss-track">
          <i v-if="b.ext" class="ss-ext" :style="span(b, b.ext[0], b.ext[1])"></i>
          <i class="ss-fill" :style="span(b, b.from, b.to)"></i>
          <u v-for="t in b.ticks" :key="t" :style="{ left: pct(b, t) + '%' }"><em>{{ fmt(t) }}</em></u>
        </div>
        <p v-if="b.note">{{ b.note }}</p>
      </div>
    </div>

    <div class="ss-bar2 rv">
      <h3>Models</h3>
      <div class="ss-views" role="tablist" aria-label="How to see the models">
        <button role="tab" :aria-selected="view === 'visual'" :class="{ on: view === 'visual' }" data-cursor="" @click="view = 'visual'">Visual</button>
        <button role="tab" :aria-selected="view === 'table'" :class="{ on: view === 'table' }" data-cursor="" @click="view = 'table'">Table</button>
      </div>
    </div>

    <!-- visual: choose a model, see its working space drawn to scale, read its data -->
    <div v-if="view === 'visual'" class="ss-pick">
      <div class="ss-list" role="tablist" aria-label="Models">
        <span class="ss-eye">Choose a model</span>
        <button v-for="(m, i) in s.models" :key="m.name" role="tab" :aria-selected="i === cur" :class="{ on: i === cur }" data-cursor="" @click="choose(i)">
          <b>{{ m.name }}</b><span>{{ m.volume }}</span>
        </button>
      </div>

      <div class="ss-draw">
        <svg class="ss-box" viewBox="0 0 560 372" role="img" :aria-label="`${model.name}: ${spaceName} ${model.w} by ${model.d} by ${model.h} millimetres`">
          <!-- front and side views of the working space, as on an engineering drawing -->
          <g class="ss-dim">
            <line :x1="fx" :x2="fx + fw" :y1="BASE + 16" :y2="BASE + 16" /><line :x1="fx" :x2="fx" :y1="BASE + 10" :y2="BASE + 22" /><line :x1="fx + fw" :x2="fx + fw" :y1="BASE + 10" :y2="BASE + 22" />
            <line :x1="sx" :x2="sx + sw" :y1="BASE + 16" :y2="BASE + 16" /><line :x1="sx" :x2="sx" :y1="BASE + 10" :y2="BASE + 22" /><line :x1="sx + sw" :x2="sx + sw" :y1="BASE + 10" :y2="BASE + 22" />
            <line :x1="fx - 16" :x2="fx - 16" :y1="ft" :y2="BASE" /><line :x1="fx - 22" :x2="fx - 10" :y1="ft" :y2="ft" /><line :x1="fx - 22" :x2="fx - 10" :y1="BASE" :y2="BASE" />
          </g>
          <rect class="ss-ft" :x="fx" :y="ft" :width="fw" :height="fh" />
          <line v-for="n in 2" :key="'f' + n" class="ss-shelf" :x1="fx + 7" :x2="fx + fw - 7" :y1="ft + (fh * n) / 3" :y2="ft + (fh * n) / 3" />
          <rect class="ss-ft" :x="sx" :y="ft" :width="sw" :height="fh" />
          <line v-for="n in 2" :key="'s' + n" class="ss-shelf" :x1="sx + 7" :x2="sx + sw - 7" :y1="ft + (fh * n) / 3" :y2="ft + (fh * n) / 3" />
          <g v-if="person" :transform="`translate(${px} ${BASE}) scale(${K})`" class="ss-person">
            <circle cx="0" cy="-1640" r="112" /><rect x="-205" y="-1510" width="410" height="640" rx="130" /><rect x="-315" y="-1480" width="95" height="540" rx="47" /><rect x="220" y="-1480" width="95" height="540" rx="47" />
            <rect x="-175" y="-890" width="150" height="890" rx="40" /><rect x="25" y="-890" width="150" height="890" rx="40" />
          </g>
          <g class="ss-lab">
            <text :x="fx + fw / 2" :y="BASE + 40" text-anchor="middle">{{ model.w }} mm</text>
            <text :x="sx + sw / 2" :y="BASE + 40" text-anchor="middle">{{ model.d }} mm</text>
            <text :transform="`translate(${fx - 28} ${(ft + BASE) / 2}) rotate(-90)`" text-anchor="middle">{{ model.h }} mm</text>
            <text class="sm" :x="fx + fw / 2" :y="BASE + 62" text-anchor="middle">Front view</text>
            <text class="sm" :x="sx + sw / 2" :y="BASE + 62" text-anchor="middle">Side view</text>
            <text v-if="person" class="sm" :x="px" :y="BASE + 40" text-anchor="middle">1.75 m</text>
            <text v-if="person" class="sm" :x="px" :y="BASE + 62" text-anchor="middle">for scale</text>
          </g>
        </svg>
      </div>

      <div class="ss-data">
        <span class="ss-eye">{{ model.name }}</span>
        <dl class="ss-rows">
          <div><dt>{{ spaceName }}, W × D × H</dt><dd>{{ model.w }} × {{ model.d }} × {{ model.h }} mm</dd></div>
          <div><dt>Nominal volume</dt><dd>{{ model.volume }}</dd></div>
          <div v-for="r in s.common" :key="r[0]"><dt>{{ r[0] }}</dt><dd>{{ r[1] }}</dd></div>
          <div v-for="r in PER_MODEL.filter((x) => x.must || model[x.key])" :key="r.key" :class="{ tbc: !model[r.key] }"><dt>{{ r.label }}</dt><dd>{{ model[r.key] || 'To come' }}</dd></div>
        </dl>
      </div>
    </div>

    <!-- table: the plain brochure table, for anyone who would rather read than explore -->
    <div v-else class="ss-tab">
      <div v-for="l in tables" :key="l.title" class="ss-tabl">
        <h4>{{ l.title }}</h4>
        <div class="ss-scroll" tabindex="0">
          <table>
            <thead><tr><th v-for="c in l.cols" :key="c" scope="col">{{ c }}</th></tr></thead>
            <tbody>
              <tr v-for="(r, k) in l.rows" :key="k" :class="{ grp: !Array.isArray(r) }">
                <th v-if="!Array.isArray(r)" :colspan="l.cols.length" scope="colgroup">{{ r.group }}</th>
                <template v-else><td v-for="(v, j) in r" :key="j">{{ v }}</td></template>
              </tr>
            </tbody>
          </table>
        </div>
        <ul v-if="l.notes" class="ss-notes"><li v-for="n in l.notes" :key="n">{{ n }}</li></ul>
      </div>
    </div>

    <div class="ss-act rv">
      <button class="ss-ask" data-cursor="" @click="ask">Ask about {{ model.name }}<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg></button>
      <button class="ss-dl" data-cursor="" @click="sheet">Download data sheet<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M5 1v6.5M2 5l3 3 3-3M1 9.5h8" fill="none" stroke="currentColor" stroke-width="1.3" /></svg></button>
      <a v-if="brochure" class="ss-br" :href="brochure" target="_blank" rel="noopener" data-cursor="">Full brochure (PDF) ↗</a>
    </div>

    <!-- real data, the moment it exists -->
    <div v-if="s.curves?.length" class="ss-curves">
      <LineChart v-for="c in s.curves" :key="c.id" :c="c" class="rv" />
    </div>
    <dl v-if="extraRows.length" class="ss-extra rv">
      <div v-for="r in extraRows" :key="r[0]"><dt>{{ r[0] }}</dt><dd>{{ r[1] }}</dd></div>
    </dl>
    <div v-if="s.options?.length || s.standards?.length || s.downloads?.length" class="ss-lists">
      <div v-if="s.options?.length" class="rv"><h3>Options and accessories</h3><ul><li v-for="o in s.options" :key="o">{{ o }}</li></ul></div>
      <div v-if="s.standards?.length" class="rv"><h3>Standards</h3><ul><li v-for="o in s.standards" :key="o">{{ o }}</li></ul></div>
      <div v-if="s.downloads?.length" class="rv"><h3>Downloads</h3><p v-for="d in s.downloads" :key="d.href"><a :href="d.href" target="_blank" rel="noopener" data-cursor="">{{ d.label }} ↗</a></p></div>
    </div>

    <div v-if="features.length" class="ss-inc rv">
      <h3>What is included</h3>
      <ul><li v-for="f in features" :key="f">{{ f }}</li></ul>
    </div>

    <div v-if="cards.length" class="ss-pend">
      <div class="ss-pend-h rv"><b>Still to come</b><span>Not in the brochure yet. Each card lists the exact data to add for this series.</span></div>
      <div class="ss-cards">
        <article v-for="(p, i) in cards" :key="p.title" class="ss-tbc rv" :style="{ '--d': (i % 3) * 0.06 + 's' }">
          <span class="ss-tag">Awaiting data</span>
          <h3>{{ p.title }}</h3>
          <ul><li v-for="it in p.items" :key="it.id">{{ it.label }}</li></ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import LineChart from './LineChart.vue'
import { PER_MODEL, pendingCards } from '../config/details'
import type { Studio, Lineup } from '../config/details'
import { openDataSheet } from '../utils/dataSheet'

const props = defineProps<{ s: Studio; lineup?: Lineup[]; features: string[]; group: string; series: string; brochure?: string; sel: string }>()
const emit = defineEmits<{ (e: 'pick', name: string): void; (e: 'ask'): void }>()

const view = ref<'visual' | 'table'>('visual')
const cur = ref(Math.max(0, props.s.models.findIndex((m) => m.name === props.sel)))
const model = computed(() => props.s.models[cur.value])
const spaceName = computed(() => props.s.space ?? 'Interior')
const choose = (i: number) => { cur.value = i; emit('pick', props.s.models[i].name) }
const ask = () => { emit('pick', model.value.name); emit('ask') }
const sheet = () => openDataSheet({ series: props.series, s: props.s, m: model.value, brochure: props.brochure })

// the table view: the brochure's own tables, or, for a series without one, the models themselves
const tables = computed<Lineup[]>(() => props.lineup ?? [{
  title: `${props.series}, models`, cols: ['Model', 'Volume', `${spaceName.value}, W × D × H (mm)`],
  rows: props.s.models.map((m) => [m.name, m.volume, `${m.w} × ${m.d} × ${m.h}`])
}])

// the ranges, as bars on a labelled scale
type Bar = Studio['bars'][number]
const fmt = (v: number) => (v < 0 ? '−' + Math.abs(v) : String(v))
const pct = (b: Bar, v: number) => ((v - b.min) / (b.max - b.min)) * 100
const span = (b: Bar, a: number, z: number) => ({ left: pct(b, a) + '%', width: pct(b, z) - pct(b, a) + '%' })

// the working space, drawn to one fixed scale for the whole series so a bigger model visibly grows; a 1.75 m person stands
// beside the drawing when the chambers are person-sized, which tells a non-engineer more than any number
const maxW = Math.max(...props.s.models.map((m) => m.w)), maxD = Math.max(...props.s.models.map((m) => m.d)), maxH = Math.max(...props.s.models.map((m) => m.h))
const LEFT = 66, GAP = 64, BASE = 288
const k1 = Math.min((560 - LEFT - GAP - 24) / (maxW + maxD), 230 / maxH)
const person = 1750 * k1 <= 250
const K = person ? Math.min((560 - LEFT - GAP - 96) / (maxW + maxD), 230 / maxH, 250 / 1750) : k1
const dim = reactive({ w: model.value.w, d: model.value.d, h: model.value.h })
const fw = computed(() => dim.w * K), sw = computed(() => dim.d * K), fh = computed(() => dim.h * K), ft = computed(() => BASE - dim.h * K)
const fx = computed(() => LEFT + (maxW * K - fw.value) / 2)
const sx = computed(() => LEFT + maxW * K + GAP + (maxD * K - sw.value) / 2)
const px = LEFT + maxW * K + GAP + maxD * K + 48
let tw: gsap.core.Tween | null = null
watch(cur, () => { tw?.kill(); tw = gsap.to(dim, { w: model.value.w, d: model.value.d, h: model.value.h, duration: 0.7, ease: 'power3.out' }) })
// a quote started from the chips elsewhere on the page selects the same model here
watch(() => props.sel, (n) => { const i = props.s.models.findIndex((m) => m.name === n); if (i >= 0) cur.value = i })
onBeforeUnmount(() => tw?.kill())

// what is still missing, and the extra facts that have arrived
const cards = computed(() => pendingCards(props.s))
const EXTRA: Record<string, string> = { door: 'Door opening and swing', shelves: 'Shelves', ports: 'Cable ports', utilities: 'Drain, water and air', floor: 'Floor loading', clearance: 'Clearance', ambient: 'Ambient limits', heat: 'Heat to the room' }
const extraRows = computed(() => Object.entries(props.s.extra ?? {}).map(([k, v]) => [EXTRA[k] ?? k, v as string]))
</script>

<style scoped>
.ss { padding: 14vh 2.2vw 0; }
.ss-top { position: relative; display: grid; grid-template-columns: 8.333vw 1fr auto; gap: 2vw; padding-top: 14px; font-family: var(--font-body); font-size: 13px; letter-spacing: 0.04em; }
.ss-top > span { opacity: 0.6; }
.ss-eye { display: block; margin-bottom: 14px; font-family: var(--font-body); font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.7; }

/* 1 · the four numbers */
.ss-fig { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0 2vw; margin: 6vh 0 0; }
.ss-fig div { display: flex; flex-direction: column; gap: 12px; padding: 3.2vh 0; border-top: 1px solid rgba(13, 35, 64, 0.22); }
.ss-fig dt { font-family: var(--font-body); font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.7; }
.ss-fig dd { margin: 0; font-family: var(--font-display); font-size: clamp(26px, 2.9vw, 52px); line-height: 1; letter-spacing: -0.05em; }
.ss-fig dd small { display: block; margin-top: 10px; font-family: var(--font-body); font-size: 15px; letter-spacing: 0; opacity: 0.7; }

/* 2 · the ranges */
.ss-bars { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 5vh 4vw; margin-top: 7vh; }
.ss-bar-h { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; margin-bottom: 26px; }
.ss-bar-h b { font-weight: 400; font-family: var(--font-display); font-size: clamp(20px, 1.8vw, 30px); letter-spacing: -0.04em; }
.ss-bar-h span { font-family: var(--font-body); font-size: 16px; }
.ss-track { position: relative; height: 16px; border-radius: 8px; background: rgba(13, 35, 64, 0.1); margin-bottom: 38px; }
.ss-fill, .ss-ext { position: absolute; top: 0; bottom: 0; border-radius: 8px; transform: scaleX(0); transform-origin: 0 50%; transition: transform 1.3s cubic-bezier(0.6, 0, 0.2, 1) 0.2s; }
.ss-fill { background: #0d2340; }
.ss-ext { background: repeating-linear-gradient(135deg, #0d2340 0 4px, rgba(13, 35, 64, 0.35) 4px 8px); }
.ss-bar[data-in] .ss-fill, .ss-bar[data-in] .ss-ext { transform: none; }
.ss-track u { position: absolute; top: 100%; width: 0; height: 8px; border-left: 1px solid rgba(13, 35, 64, 0.35); text-decoration: none; }
.ss-track u em { position: absolute; top: 12px; left: 0; transform: translateX(-50%); font-style: normal; font-family: var(--font-body); font-size: 14px; opacity: 0.75; white-space: nowrap; }
.ss-bar p { margin: 0; font-family: var(--font-body); font-size: 15px; opacity: 0.75; }

/* 3 · the models: Visual / Table */
.ss-bar2 { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-top: 9vh; }
.ss-bar2 h3 { margin: 0; font-weight: 400; font-family: var(--font-display); font-size: clamp(24px, 2.4vw, 40px); letter-spacing: -0.05em; }
.ss-views { display: inline-flex; padding: 4px; border-radius: 999px; background: rgba(13, 35, 64, 0.08); }
.ss-views button { padding: 10px 22px; border: 0; border-radius: 999px; background: transparent; color: inherit; font-family: var(--font-body); font-size: 14px; letter-spacing: 0.04em; cursor: pointer; transition: background 0.25s ease, color 0.25s ease; }
.ss-views button.on { background: #0d2340; color: #fff; }

.ss-pick { display: grid; grid-template-columns: 240px minmax(0, 1.15fr) minmax(0, 1fr); height: min(76vh, 680px); min-height: 540px; margin-top: 3vh; border-radius: 22px; overflow: hidden; background: rgba(255, 255, 255, 0.55); box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset, 0 30px 60px -40px rgba(13, 35, 64, 0.35); }
.ss-list { display: flex; flex-direction: column; padding: 24px 14px 18px; overflow-y: auto; border-right: 1px solid rgba(13, 35, 64, 0.12); }
.ss-list .ss-eye { padding: 0 12px; }
.ss-list button { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; padding: 14px 14px; border: 0; border-radius: 12px; background: transparent; color: inherit; text-align: left; cursor: pointer; transition: background 0.25s ease, color 0.25s ease; }
.ss-list button b { font-weight: 400; font-family: var(--font-display); font-size: clamp(17px, 1.4vw, 22px); letter-spacing: -0.04em; }
.ss-list button span { font-family: var(--font-body); font-size: 15px; opacity: 0.65; white-space: nowrap; }
.ss-list button:hover { background: rgba(13, 35, 64, 0.06); }
.ss-list button.on { background: #0d2340; color: #fff; }
.ss-list button.on span { opacity: 0.85; }
.ss-draw { display: grid; place-items: center; min-width: 0; padding: 14px; background: radial-gradient(ellipse 70% 60% at 50% 55%, rgba(255, 255, 255, 0.7), transparent 75%); }
.ss-box { display: block; width: 100%; height: auto; max-height: 100%; }
.ss-ft { fill: rgba(255, 255, 255, 0.75); stroke: #0d2340; stroke-width: 1.7; }
.ss-shelf { stroke: #0d2340; stroke-width: 1; stroke-dasharray: 4 4; opacity: 0.4; }
.ss-person { fill: #9fb1c7; opacity: 0.85; }
.ss-dim line { stroke: #0d2340; stroke-width: 1.2; opacity: 0.6; }
.ss-lab text { font-family: var(--font-body); font-size: 16px; fill: #0d2340; }
.ss-lab text.sm { font-size: 13px; opacity: 0.6; letter-spacing: 0.06em; text-transform: uppercase; }
.ss-data { display: flex; flex-direction: column; min-width: 0; padding: 24px 28px 24px 26px; border-left: 1px solid rgba(13, 35, 64, 0.12); overflow-y: auto; }
.ss-data .ss-eye { margin-bottom: 8px; font-family: var(--font-display); font-size: clamp(22px, 2vw, 32px); letter-spacing: -0.045em; text-transform: none; opacity: 1; }
.ss-rows { margin: 0; }
.ss-rows div { display: grid; grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.25fr); gap: 1.4vw; padding: 9px 0; border-top: 1px solid rgba(13, 35, 64, 0.14); }
.ss-rows dt { font-family: var(--font-body); font-size: 14px; line-height: 1.4; opacity: 0.72; }
.ss-rows dd { margin: 0; font-family: var(--font-body); font-size: 16px; line-height: 1.4; }
.ss-rows .tbc dd { font-style: italic; opacity: 0.55; }
.ss-rows .tbc dd::before { content: ''; display: inline-block; width: 7px; height: 7px; margin-right: 10px; border-radius: 50%; border: 1.5px dashed #ff6a1a; }

/* the plain table */
.ss-tab { margin-top: 3vh; padding: 3vh 2.4vw 4vh; border-radius: 22px; background: rgba(255, 255, 255, 0.55); box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset, 0 30px 60px -40px rgba(13, 35, 64, 0.35); }
.ss-tabl + .ss-tabl { margin-top: 5vh; }
.ss-tabl h4 { margin: 0 0 2vh; font-weight: 400; font-family: var(--font-display); font-size: clamp(20px, 1.7vw, 28px); letter-spacing: -0.045em; }
.ss-scroll { overflow-x: auto; border-radius: 14px; background: rgba(255, 255, 255, 0.6); }
.ss-tabl table { width: 100%; min-width: 640px; border-collapse: collapse; font-family: var(--font-body); font-size: 16px; line-height: 1.4; }
.ss-tabl thead th { padding: 15px 18px; background: #0d2340; color: #fff; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; text-align: left; font-weight: 500; }
.ss-tabl td { padding: 14px 18px; border-top: 1px solid rgba(13, 35, 64, 0.12); }
.ss-tabl td:first-child { font-weight: 600; white-space: nowrap; }
.ss-tabl tbody tr:not(.grp):hover td { background: rgba(255, 106, 26, 0.08); }
.ss-tabl tr.grp th { padding: 14px 18px 10px; text-align: left; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.75; font-weight: 600; border-top: 1px solid rgba(13, 35, 64, 0.2); }
.ss-notes { margin: 2.4vh 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 1vh; }
.ss-notes li, .ss-inc li, .ss-tbc li, .ss-lists li { position: relative; padding-left: 20px; font-family: var(--font-body); font-size: 15.5px; line-height: 1.5; }
.ss-notes li::before, .ss-inc li::before, .ss-tbc li::before, .ss-lists li::before { content: ''; position: absolute; left: 0; top: 0.62em; width: 7px; height: 7px; border-radius: 50%; background: #ff6a1a; }

/* Ask · Download · Brochure, side by side */
.ss-act { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 22px; margin-top: 3.4vh; }
.ss-ask, .ss-dl { display: inline-flex; align-items: center; gap: 10px; padding: 15px 26px; border-radius: 40px; font-family: var(--font-body); font-size: 14px; letter-spacing: 0.06em; cursor: pointer; transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease; }
.ss-ask { border: 0; background: #0d2340; color: #fff; }
.ss-dl { border: 1.5px solid #0d2340; background: transparent; color: #0d2340; }
.ss-ask svg, .ss-dl svg { width: 12px; height: 12px; }
.ss-ask:hover { background: #ff6a1a; }
.ss-dl:hover { background: #0d2340; color: #fff; }
.ss-br { color: inherit; font-family: var(--font-body); font-size: 14px; letter-spacing: 0.04em; text-decoration: none; border-bottom: 1px solid currentColor; padding-bottom: 2px; }

/* real data as it arrives */
.ss-curves { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 9vh; }
.ss-extra { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 4vw; margin: 8vh 0 0; }
.ss-extra div { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.3fr); gap: 2vw; padding: 1.6vh 0; border-top: 1px solid rgba(13, 35, 64, 0.16); }
.ss-extra dt { font-family: var(--font-body); font-size: 15px; opacity: 0.72; }
.ss-extra dd { margin: 0; font-family: var(--font-body); font-size: 17px; }
.ss-lists { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4vw; margin-top: 8vh; }
.ss-lists h3, .ss-inc h3, .ss-pend-h b { margin: 0 0 2.2vh; font-weight: 400; font-family: var(--font-display); font-size: clamp(22px, 2vw, 34px); letter-spacing: -0.045em; display: block; }
.ss-lists ul, .ss-inc ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 1vh; }
.ss-lists p { margin: 0 0 1vh; font-family: var(--font-body); font-size: 16px; }
.ss-lists a { color: inherit; }

.ss-inc { margin-top: 9vh; }
.ss-inc ul { columns: 2; column-gap: 4vw; display: block; }
.ss-inc li { break-inside: avoid; padding-bottom: 1.4vh; }

/* what is still to come: dashed, so it reads as a placeholder, not as a finished card */
.ss-pend { margin-top: 10vh; }
.ss-pend-h { margin-bottom: 3vh; }
.ss-pend-h span { font-family: var(--font-body); font-size: 15px; opacity: 0.7; }
.ss-cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.ss-tbc { position: relative; padding: 3vh 1.8vw 3.4vh; border: 1.5px dashed rgba(13, 35, 64, 0.4); border-radius: 20px; background: rgba(255, 255, 255, 0.3); }
.ss-tag { display: inline-block; margin-bottom: 14px; padding: 5px 12px; border-radius: 999px; background: rgba(255, 106, 26, 0.14); color: #b8460c; font-family: var(--font-body); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }
.ss-tbc h3 { margin: 0 0 1.6vh; font-weight: 400; font-family: var(--font-display); font-size: clamp(19px, 1.6vw, 27px); letter-spacing: -0.045em; }
.ss-tbc ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 1vh; }
.ss-tbc li { opacity: 0.85; font-size: 15px; }

@media (max-width: 1000px) {
  .ss { padding: 10vh 5vw 0; }
  .ss-top { grid-template-columns: 14vw 1fr auto; }
  .ss-fig { grid-template-columns: 1fr 1fr; }
  .ss-fig dd { white-space: normal; font-size: clamp(26px, 7vw, 44px); }
  .ss-bars, .ss-cards, .ss-curves, .ss-extra, .ss-lists { grid-template-columns: 1fr; }
  .ss-pick { grid-template-columns: 1fr; height: auto; min-height: 0; }
  .ss-list { flex-direction: row; flex-wrap: nowrap; gap: 6px; overflow-x: auto; overflow-y: hidden; padding: 16px 14px; border-right: 0; border-bottom: 1px solid rgba(13, 35, 64, 0.12); }
  .ss-list .ss-eye { display: none; }
  .ss-list button { flex: none; flex-direction: column; gap: 2px; }
  .ss-draw { padding: 14px; }
  .ss-data { border-left: 0; border-top: 1px solid rgba(13, 35, 64, 0.12); padding: 20px; overflow: visible; }
  .ss-inc ul { columns: 1; }
  .ss-rows div, .ss-extra div { grid-template-columns: 1fr; gap: 3px; }
  .ss-tab { padding: 3vh 4vw; }
}
</style>
