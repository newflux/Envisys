<template>
  <!-- /standards: every test standard the range runs; /standards/<slug>: one standard, in plain words, and the chambers that run it.
       Reached from the standard tags on each product page, the footer and search; not in the main nav. -->
  <PageShell :title="s ? `${s.family} · Test standards` : 'Test standards'" blue v-slot="{ contact }">
    <section v-if="!s" class="st-sec">
      <div class="st-top rv"><span>(01)</span><span>Test standards</span><span>{{ standards.length }} standards</span></div>
      <h1 class="st-h rv">Find a chamber by the standard you test to.</h1>
      <ul class="st-ix">
        <li v-for="(x, i) in standards" :key="x.slug" class="rv" :style="{ '--d': (i % 6) * 0.03 + 's' }">
          <a :href="`/standards/${x.slug}`" data-cursor="">
            <b>{{ x.family }}</b><span>{{ x.title }}</span><small>{{ chambersFor(x.family).length }} {{ chambersFor(x.family).length === 1 ? 'chamber' : 'chambers' }}</small>
          </a>
        </li>
      </ul>
    </section>

    <template v-else>
      <section class="st-sec">
        <div class="st-top rv"><span><a href="/standards" data-cursor="">Test standards</a></span><span>{{ s.title }}</span><span>{{ list.length }} {{ list.length === 1 ? 'chamber' : 'chambers' }}</span></div>
        <div class="st-row">
          <div>
            <h1 class="st-h rv">{{ s.family }}</h1>
            <p class="st-what rv">{{ s.what }}</p>
          </div>
          <div class="rv" style="--d: 0.08s">
            <p class="st-body">{{ s.body }}</p>
            <button class="ps-pill" data-cursor="" @click="contact(`We need to test to ${s.family}. `)"><span>Ask about a {{ s.family }} test</span><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg></button>
          </div>
        </div>
      </section>

      <section class="st-sec">
        <div class="st-top rv"><span>(02)</span><span>Chambers that run it</span><span></span></div>
        <div class="st-grid">
          <a v-for="c in list" :key="c.p.slug" class="st-card rv" :href="`/products/${c.p.slug}`" data-cursor="OPEN">
            <div class="st-img"><img :src="img(c.p, 'hero')" :alt="c.p.name" /></div>
            <b>{{ c.p.name }}</b>
            <ul><li v-for="t in c.parts" :key="t">{{ t }}</li></ul>
          </a>
        </div>
        <p class="st-note rv">Tell us the clause and test profile; we confirm the chamber set-up before you order. Or have Vistara, our NABL-accredited lab, run the test for you.</p>
      </section>
    </template>
  </PageShell>
</template>

<script setup lang="ts">
import PageShell from '../components/PageShell.vue'
import { standards, standardBySlug, chambersFor } from '../config/standards'
import { img } from '../config/products'

const slug = location.pathname.replace(/\/+$/, '').split('/')[2] ?? ''
const s = slug ? standardBySlug(slug) : undefined
const list = s ? chambersFor(s.family) : []
document.title = s ? `${s.family} test chambers · ${s.title} | Envisys` : 'Test standards and the chambers that run them | Envisys'
</script>

<style scoped>
.st-sec { padding: 16vh 2.2vw 6vh; color: #0d2340; }
.st-sec + .st-sec { padding-top: 6vh; }
.st-top { position: relative; display: grid; grid-template-columns: 16vw 1fr auto; gap: 2vw; padding-top: 14px; font-family: var(--font-body); font-size: 13px; letter-spacing: 0.08em; opacity: 0.7; }
.st-top::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 1px; background: currentColor; opacity: 0.35; }
.st-top a { color: inherit; }
.st-h { margin: 6vh 0 3vh; font-family: var(--font-display); font-weight: 400; font-size: clamp(34px, 4.6vw, 84px); line-height: 1; letter-spacing: -0.04em; }
.st-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 5vw; align-items: end; margin-top: 4vh; }
.st-what { margin: 0; font-family: 'Geist', sans-serif; font-size: clamp(18px, 1.5vw, 24px); line-height: 1.45; }
.st-body { margin: 0 0 4vh; font-family: 'Geist', sans-serif; font-size: 17px; line-height: 1.65; }
.st-ix { margin: 4vh 0 0; padding: 0; list-style: none; border-top: 1px solid rgba(13, 35, 64, 0.15); }
.st-ix a { display: grid; grid-template-columns: minmax(160px, 0.7fr) 1.3fr auto; gap: 2vw; align-items: baseline; padding: 2.2vh 0; border-bottom: 1px solid rgba(13, 35, 64, 0.15); color: inherit; text-decoration: none; transition: padding 0.35s ease, color 0.3s ease; }
.st-ix a:hover { padding-left: 12px; color: #e0560c; }
.st-ix b { font-family: var(--font-display); font-weight: 400; font-size: clamp(18px, 1.5vw, 26px); letter-spacing: -0.03em; }
.st-ix span { font-family: 'Geist', sans-serif; font-size: 16px; }
.st-ix small { font-family: 'Geist Mono', monospace; font-size: 12px; opacity: 0.6; }
.st-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; margin-top: 5vh; }
.st-card { display: flex; flex-direction: column; gap: 10px; padding: 18px 18px 22px; border-radius: 22px; background: rgba(255, 255, 255, 0.6); color: inherit; text-decoration: none; transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1), background 0.3s ease; }
.st-card:hover { transform: translateY(-4px); background: rgba(255, 255, 255, 0.85); }
.st-img { height: 220px; display: grid; place-items: center; }
.st-img img { max-height: 220px; max-width: 90%; object-fit: contain; }
.st-card b { font-family: var(--font-display); font-weight: 400; font-size: 22px; letter-spacing: -0.03em; }
.st-card ul { margin: 0; padding-left: 18px; font-family: 'Geist', sans-serif; font-size: 15px; line-height: 1.5; }
.st-note { margin: 5vh 0 0; max-width: 46em; font-family: 'Geist', sans-serif; font-size: 16px; line-height: 1.6; opacity: 0.75; }
@media (max-width: 800px) {
  .st-sec { padding: 13vh 5vw 4vh; }
  .st-top { grid-template-columns: 1fr auto; } .st-top span:nth-child(2) { display: none; }
  .st-row { grid-template-columns: 1fr; gap: 3vh; }
  .st-ix a { grid-template-columns: 1fr auto; } .st-ix span { grid-column: 1 / -1; order: 3; }
}
</style>
