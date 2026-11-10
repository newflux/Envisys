<template>
  <!-- The full technical file for a series (config/details.ts), set large for easy reading: the headline figures, the
       performance graph drawn from its data, every table, how it is built, and the documents. -->
  <section v-if="d.headline || c" id="performance" class="sd">
    <div class="sd-top rv hl"><span>{{ num('performance') }}</span><span>Performance</span><span>{{ d.model }}</span></div>
    <dl v-if="d.headline" class="sd-head">
      <div v-for="(h, i) in d.headline" :key="h[0]" class="rv" :style="{ '--d': i * 0.05 + 's' }"><dt>{{ h[0] }}</dt><dd>{{ h[1] }}<small>{{ h[2] }}</small></dd></div>
    </dl>

    <LineChart v-if="c" :c="c" class="rv" style="margin-top: 8vh" />
  </section>

  <section v-if="d.lineup && !d.studio" id="models" class="sd">
    <div class="sd-top rv hl"><span>{{ num('models') }}</span><span>The range</span><span>Every model</span></div>
    <div v-for="l in d.lineup" :key="l.title" class="sd-lineup rv">
      <h3>{{ l.title }}</h3>
      <div class="sd-scroll" tabindex="0">
        <table>
          <thead><tr><th v-for="col in l.cols" :key="col" scope="col">{{ col }}</th></tr></thead>
          <tbody>
            <tr v-for="(r, k) in l.rows" :key="k" :class="{ grp: !Array.isArray(r) }">
              <th v-if="!Array.isArray(r)" :colspan="l.cols.length" scope="colgroup">{{ r.group }}</th>
              <template v-else><td v-for="(v, j) in r" :key="j">{{ v }}</td></template>
            </tr>
          </tbody>
        </table>
      </div>
      <ul v-if="l.notes" class="sd-notes"><li v-for="n in l.notes" :key="n">{{ n }}</li></ul>
    </div>
  </section>

  <section v-if="d.tables" id="technical" class="sd">
    <div class="sd-top rv hl"><span>{{ num('technical') }}</span><span>Technical data</span><span>Everything on one page</span></div>
    <div class="sd-tables">
      <div v-for="t in d.tables" :key="t.title" class="sd-table rv">
        <h3>{{ t.title }}</h3>
        <dl><div v-for="r in t.rows" :key="r[0]"><dt>{{ r[0] }}</dt><dd>{{ r[1] }}</dd></div></dl>
        <template v-for="g in t.groups ?? []" :key="g.title">
          <h4>{{ g.title }}</h4>
          <dl><div v-for="r in g.rows" :key="r[0]"><dt>{{ r[0] }}</dt><dd>{{ r[1] }}</dd></div></dl>
        </template>
      </div>
    </div>
  </section>

  <section id="build" class="sd">
    <div v-if="d.build" class="sd-top rv hl"><span>{{ num('build') }}</span><span>How it is built</span><span></span></div>
    <div v-if="d.build" class="sd-build">
      <article v-for="(b, i) in d.build" :key="b.title" class="rv" :style="{ '--d': (i % 3) * 0.06 + 's' }">
        <h3>{{ b.title }}</h3>
        <ul><li v-for="pt in b.points" :key="pt">{{ pt }}</li></ul>
      </article>
    </div>
    <ul v-if="d.notes" class="sd-notes rv"><li v-for="n in d.notes" :key="n">{{ n }}</li></ul>
    <div class="sd-docs rv">
      <a v-if="brochure" :href="brochure" target="_blank" rel="noopener" data-cursor="">Download the brochure (PDF) ↗</a>
      <button data-cursor="" @click="emit('ask')">Ask for the operating manual or a drawing</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Detail } from '../config/details'
import LineChart from './LineChart.vue'

const props = defineProps<{ d: Detail; brochure?: string }>()
const emit = defineEmits<{ (e: 'ask'): void }>()
const c = computed(() => props.d.chart)
// the sections this series has, numbered on from the page's own three
const parts = computed(() => [(props.d.headline || props.d.chart) && 'performance', props.d.lineup && !props.d.studio && 'models', props.d.tables && 'technical', props.d.build && 'build'].filter(Boolean) as string[])
const num = (id: string) => `(${String(3 + parts.value.indexOf(id)).padStart(2, '0')})`
</script>

<style scoped>
.sd { padding: 14vh 2.2vw 0; }
.sd-top { position: relative; display: grid; grid-template-columns: 8.333vw 1fr auto; gap: 2vw; padding-top: 14px; font-family: var(--font-body); font-size: 13px; letter-spacing: 0.04em; }
.sd-top > span { opacity: 0.6; }

/* the headline figures: big, in a row */
.sd-head { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 2vw; margin: 6vh 0 0; }
.sd-head div { display: flex; flex-direction: column; gap: 10px; padding: 3.2vh 0; border-top: 1px solid rgba(13, 35, 64, 0.2); }
.sd-head dt { font-family: var(--font-body); font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.7; }
.sd-head dd { margin: 0; font-family: var(--font-display); font-size: clamp(30px, 3.4vw, 60px); line-height: 1; letter-spacing: -0.05em; }
.sd-head dd small { margin-left: 8px; font-family: var(--font-body); font-size: 15px; letter-spacing: 0; opacity: 0.7; }

/* the model range: a real table, large type, scrolls sideways on a phone */
.sd-lineup { margin-top: 6vh; }
.sd-lineup h3 { margin: 0 0 2vh; font-family: var(--font-display); font-weight: 400; font-size: clamp(22px, 2vw, 34px); letter-spacing: -0.045em; }
.sd-scroll { overflow-x: auto; border-radius: 16px; background: rgba(255, 255, 255, 0.5); }
.sd-lineup table { width: 100%; min-width: 640px; border-collapse: collapse; font-family: var(--font-body); font-size: 16px; line-height: 1.4; }
.sd-lineup thead th { position: sticky; top: 0; padding: 16px 18px; background: #0d2340; color: #fff; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; text-align: left; font-weight: 500; }
.sd-lineup td { padding: 15px 18px; border-top: 1px solid rgba(13, 35, 64, 0.12); }
.sd-lineup td:first-child { font-weight: 600; white-space: nowrap; }
.sd-lineup tbody tr:not(.grp):hover td { background: rgba(255, 106, 26, 0.08); }
.sd-lineup tr.grp th { padding: 14px 18px 10px; text-align: left; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.75; font-weight: 600; border-top: 1px solid rgba(13, 35, 64, 0.2); }
.sd-lineup .sd-notes { margin-top: 3vh; }

/* the tables: label left, value right, generous rows */
.sd-tables { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6vh 4vw; margin-top: 6vh; align-items: start; }
.sd-table h3 { margin: 0 0 1.5vh; font-family: var(--font-display); font-weight: 400; font-size: clamp(22px, 2vw, 34px); letter-spacing: -0.045em; }
.sd-table h4 { margin: 4vh 0 1vh; font-family: var(--font-body); font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.75; }
.sd-table dl { margin: 0; }
.sd-table dl div { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr); gap: 2vw; padding: 1.6vh 0; border-top: 1px solid rgba(13, 35, 64, 0.16); }
.sd-table dl div:last-child { border-bottom: 1px solid rgba(13, 35, 64, 0.16); }
.sd-table dt { font-family: var(--font-body); font-size: 15px; line-height: 1.45; opacity: 0.75; }
.sd-table dd { margin: 0; font-family: var(--font-body); font-size: 17px; line-height: 1.45; }
.sd-table:first-child { grid-row: span 2; }

/* how it is built: a card per subsystem */
.sd-build { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-top: 6vh; }
.sd-build article { padding: 3.2vh 2vw 3.6vh; border-radius: 20px; background: rgba(255, 255, 255, 0.5); }
.sd-build h3 { margin: 0 0 2vh; font-family: var(--font-display); font-weight: 400; font-size: clamp(20px, 1.6vw, 28px); letter-spacing: -0.045em; }
.sd-build ul, .sd-notes { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 1.2vh; }
.sd-build li, .sd-notes li { position: relative; padding-left: 20px; font-family: var(--font-body); font-size: 16px; line-height: 1.5; }
.sd-build li::before, .sd-notes li::before { content: ''; position: absolute; left: 0; top: 0.62em; width: 7px; height: 7px; border-radius: 50%; background: #ff6a1a; }
.sd-notes { margin-top: 5vh; max-width: 60em; }
.sd-docs { display: flex; flex-wrap: wrap; align-items: center; gap: 18px 28px; margin: 6vh 0 4vh; }
.sd-docs a, .sd-docs button { padding: 14px 22px; border-radius: 40px; font-family: var(--font-body); font-size: 14px; letter-spacing: 0.06em; text-decoration: none; cursor: pointer; }
.sd-docs a { background: #0d2340; color: #fff; }
.sd-docs button { border: 1px solid rgba(13, 35, 64, 0.4); background: transparent; color: inherit; }
.sd-docs a:hover, .sd-docs button:hover { background: #ff6a1a; border-color: #ff6a1a; color: #fff; }

@media (max-width: 900px) {
  .sd { padding: 10vh 5vw 0; }
  .sd-top { grid-template-columns: 14vw 1fr auto; }
  .sd-head { grid-template-columns: 1fr 1fr; }
  .sd-chart { padding: 5vw; }
  .sd-tables, .sd-build { grid-template-columns: 1fr; }
  .sd-table:first-child { grid-row: auto; }
  .sd-table dl div { grid-template-columns: 1fr; gap: 4px; }
}
</style>
