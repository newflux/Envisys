<template>
  <!-- Technical data, model against model: pick up to three, each with its own data sheet. Only rows that carry a real value for at
       least one model are listed; a missing value reads "On request", never a guess. -->
  <section id="technical" class="sc">
    <div class="sc-top rv"><span>({{ num }})</span><span>Technical data</span><span>Compare models</span></div>
    <div class="sc-wrap rv">
      <table>
        <thead>
          <tr>
            <th class="sc-lab" scope="col"><span class="sr">Specification</span></th>
            <th v-for="(c, i) in cols" :key="i" scope="col">
              <label class="sc-pick">
                <span class="sr">Model {{ i + 1 }}</span>
                <select v-model="cols[i]" data-cursor="">
                  <option v-for="m in s.models" :key="m.name" :value="m.name">{{ m.name }}</option>
                </select>
              </label>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.label">
            <th scope="row">{{ r.label }}</th>
            <td v-for="(c, i) in cols" :key="i" :class="{ na: r.get(model(c)) === NA }">{{ r.get(model(c)) }}</td>
          </tr>
          <tr class="sc-act">
            <th scope="row"></th>
            <td v-for="(c, i) in cols" :key="i"><button class="sc-dl" data-cursor="" @click="sheet(c)">Data sheet <svg viewBox="0 0 10 10"><path d="M5 1v7M2 5.5L5 8.5 8 5.5" fill="none" stroke="currentColor" stroke-width="1.2" /></svg></button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Studio, StudioModel } from '../config/details'
import { openDataSheet } from '../utils/dataSheet'

const props = defineProps<{ s: Studio; series: string; brochure?: string; num: string }>()
const NA = 'On request'
const cols = ref(props.s.models.slice(0, Math.min(3, props.s.models.length)).map((m) => m.name))
const model = (name: string) => props.s.models.find((m) => m.name === name)!
const per = (m: StudioModel, label: string) => props.s.perModel?.[m.name]?.find((r) => r[0] === label)?.[1]

const rows = computed(() => {
  const base: { label: string; get: (m: StudioModel) => string }[] = [
    { label: 'Volume', get: (m) => m.volume },
    { label: `${props.s.space ?? 'Interior'}, W × D × H`, get: (m) => `${m.w} × ${m.d} × ${m.h} mm` },
    { label: 'Outside size', get: (m) => m.ext ?? NA },
    { label: 'Weight', get: (m) => m.weight ?? NA },
    { label: 'Connected load', get: (m) => m.load ?? NA },
    { label: 'Cooling', get: (m) => m.cooling ?? NA },
    { label: 'Noise', get: (m) => m.noise ?? NA }
  ]
  const perLabels = [...new Set(Object.values(props.s.perModel ?? {}).flat().map((r) => r[0]))]
  const common = props.s.common.filter(([l]) => !perLabels.includes(l))
  const all = [
    ...base,
    ...perLabels.map((l) => ({ label: l, get: (m: StudioModel) => per(m, l) ?? props.s.common.find((c) => c[0] === l)?.[1] ?? NA })),
    ...common.map(([l, v]) => ({ label: l, get: () => v }))
  ]
  return all.filter((r) => props.s.models.some((m) => r.get(m) !== NA))
})
const sheet = (name: string) => openDataSheet({ series: props.series, s: props.s, m: model(name), brochure: props.brochure })
</script>

<style scoped>
.sc { padding: 14vh 2.2vw 6vh; color: #0d2340; }
.sc-top { position: relative; display: grid; grid-template-columns: 8.333vw 1fr auto; gap: 2vw; padding-top: 14px; font-family: var(--font-body); font-size: 13px; letter-spacing: 0.08em; opacity: 0.7; }
.sc-top::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 1px; background: currentColor; opacity: 0.35; }
.sc-wrap { margin-top: 6vh; overflow-x: auto; border-radius: 22px; background: rgba(255, 255, 255, 0.6); }
table { width: 100%; min-width: 720px; border-collapse: collapse; font-family: 'Geist', sans-serif; }
thead th { position: sticky; top: 0; padding: 22px 20px; background: rgba(13, 35, 64, 0.06); text-align: left; }
.sc-lab { width: 30%; }
.sc-pick select { width: 100%; padding: 10px 34px 10px 0; border: 0; border-bottom: 1.5px solid #0d2340; background: transparent url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' fill='none' stroke='%230d2340' stroke-width='1.3'/></svg>") no-repeat right 4px center / 11px; color: #0d2340; font: 600 17px 'Geist', sans-serif; appearance: none; cursor: pointer; }
tbody th { padding: 15px 20px; font-weight: 400; font-size: 15px; text-align: left; opacity: 0.72; vertical-align: top; }
tbody td { padding: 15px 20px; font-size: 16px; line-height: 1.45; vertical-align: top; }
tbody tr + tr th, tbody tr + tr td { border-top: 1px solid rgba(13, 35, 64, 0.12); }
td.na { opacity: 0.45; }
.sc-act td { padding-top: 22px; padding-bottom: 26px; }
.sc-dl { display: inline-flex; align-items: center; gap: 10px; padding: 12px 20px; border: 0; border-radius: 40px; background: #0d2340; color: #fff; font: 13px 'Geist Mono', monospace; letter-spacing: 0.06em; cursor: pointer; }
.sc-dl:hover { background: #ff6a1a; }
.sc-dl svg { width: 10px; height: 10px; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
@media (max-width: 640px) { .sc { padding: 9vh 4vw 4vh; } .sc-top { grid-template-columns: 14vw 1fr auto; } }
</style>
