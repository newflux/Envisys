<template>
  <PageShell title="Resources" v-slot="{ contact }">
    <section class="rs-open">
      <span class="ps-label rv"><i>+</i> Resources</span>
      <h1 class="rs-h rv" style="--d: 0.06s">Read before you test.</h1>
      <p class="rs-sub rv" style="--d: 0.12s">Guides from the Envisys engineers on choosing, renting and running environmental test equipment, and the brochures for every range.</p>
    </section>

    <!-- the newest post, large -->
    <section v-if="lead" class="rs-lead rv">
      <a class="rs-lead-a" :href="lead.url" target="_blank" rel="noopener" data-cursor="READ">
        <div class="rs-lead-img"><img loading="lazy" decoding="async" :src="lead.img" :alt="lead.title" /></div>
        <div class="rs-lead-tx">
          <span class="rs-meta">{{ lead.cat }} · {{ lead.date }}</span>
          <h2>{{ lead.title }}</h2>
          <p>{{ lead.excerpt }}</p>
          <span class="rs-more">Read the article <svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.2" /></svg></span>
        </div>
      </a>
    </section>

    <!-- the rest, filterable -->
    <section class="rs-blog">
      <div class="rs-bar rv">
        <span class="ps-label"><i>+</i> Articles</span>
        <div class="rs-chips">
          <button v-for="c in cats" :key="c" :class="{ on: cat === c }" data-cursor="" @click="cat = c">{{ c }}</button>
        </div>
      </div>
      <TransitionGroup name="card" tag="div" class="rs-grid">
        <a v-for="b in rest" :key="b.url" class="rs-card" :href="b.url" target="_blank" rel="noopener" data-cursor="READ">
          <div class="rs-ph"><img :src="b.img" :alt="b.title" loading="lazy" /></div>
          <span class="rs-meta">{{ b.cat }} · {{ b.date }}</span>
          <b>{{ b.title }}</b>
          <p>{{ b.excerpt }}</p>
        </a>
      </TransitionGroup>
    </section>

    <!-- brochures -->
    <section class="rs-bro">
      <div class="rs-bro-l">
        <span class="ps-label rv"><i>+</i> Brochures</span>
        <h2 class="rs-h2 rv" style="--d: 0.06s">The data sheets.</h2>
        <p class="rv" style="--d: 0.1s">Every range, as a PDF, hosted by Envisys.</p>
      </div>
      <ul class="rs-list">
        <li v-for="(b, i) in brochures" :key="b.url" class="rv" :style="{ '--d': (i % 5) * 0.04 + 's' }">
          <a :href="b.url" target="_blank" rel="noopener" data-cursor="">
            <em>{{ String(i + 1).padStart(2, '0') }}</em><span>{{ b.name }}</span><i>PDF ↗</i>
          </a>
        </li>
      </ul>
    </section>

    <section class="rs-end">
      <NextUp label="Next up" title="Talk to us." text="Tell us what you need to test and we will tell you the chamber, the lab slot or the rental that fits." href="#" @go="contact()" />
    </section>
  </PageShell>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageShell from '../components/PageShell.vue'
import NextUp from '../components/NextUp.vue'
import { products } from '../config/products'
import blogData from '../data/blogs.json' // bundled (4 KB): no late fetch, so no layout shift

interface Blog { title: string; url: string; date: string; cat: string; excerpt: string; img: string }
const blogs = ref<Blog[]>(blogData as Blog[])
const cat = ref('All')

const lead = computed(() => blogs.value[0])
const cats = computed(() => ['All', ...new Set(blogs.value.slice(1).map((b) => b.cat))])
const rest = computed(() => blogs.value.slice(1).filter((b) => cat.value === 'All' || b.cat === cat.value))
const brochures = [...new Map(products.filter((p) => p.brochure).map((p) => [p.brochure!, { url: p.brochure!, name: p.name }])).values()]
</script>

<style scoped>
.rs-open { padding: 24vh 5vw 9vh; display: flex; flex-direction: column; gap: 3vh; }
.rs-h { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(34px, 6vw, 112px); line-height: 0.98; letter-spacing: -0.06em; }
.rs-sub { margin: 2vh 0 0; max-width: 34em; font-family: var(--font-body); font-size: clamp(12px, 0.95vw, 15px); line-height: 1.7; opacity: 0.72; }

.rs-lead { padding: 0 2.2vw 12vh; }
.rs-lead-a { display: grid; grid-template-columns: 1.25fr 1fr; gap: 3vw; align-items: center; padding: 14px; border-radius: 24px; background: #f6f6f4; color: inherit; text-decoration: none; transition: background 0.4s ease; }
.rs-lead-a:hover { background: #fff; }
.rs-lead-img { aspect-ratio: 16 / 10; border-radius: 14px; overflow: hidden; background: #0a0a0c; }
.rs-lead-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--ease); }
.rs-lead-a:hover img { transform: scale(1.04); }
.rs-lead-tx { display: flex; flex-direction: column; gap: 2vh; padding: 2vh 2vw 2vh 0; }
.rs-meta { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.55; }
.rs-lead-tx h2 { margin: 0; font-weight: 400; font-family: var(--font-display); font-size: clamp(22px, 2.6vw, 48px); line-height: 1.04; letter-spacing: -0.05em; }
.rs-lead-tx p { margin: 0; font-family: var(--font-body); font-size: 12px; line-height: 1.7; opacity: 0.75; }
.rs-more { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; transition: gap 0.4s ease; }
.rs-more svg { width: 10px; height: 10px; }
.rs-lead-a:hover .rs-more { gap: 18px; }

.rs-blog { padding: 0 2.2vw 14vh; }
.rs-bar { display: flex; justify-content: space-between; align-items: center; gap: 3vw; padding: 0 1.2vw 5vh; flex-wrap: wrap; }
.rs-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.rs-chips button { padding: 10px 16px; border-radius: 40px; border: 1px solid rgba(10, 10, 12, 0.2); background: transparent; color: var(--ink); font-family: var(--font-body); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: background 0.3s ease, color 0.3s ease; }
.rs-chips button:hover { background: rgba(10, 10, 12, 0.08); }
.rs-chips button.on { background: var(--ink); color: #fff; border-color: var(--ink); }
.rs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.rs-card { display: flex; flex-direction: column; gap: 10px; padding: 10px 10px 22px; border-radius: 18px; background: #f6f6f4; color: inherit; text-decoration: none; transition: background 0.4s ease, transform 0.6s var(--ease), box-shadow 0.5s ease; }
.rs-card:hover { background: #fff; transform: translateY(-4px); box-shadow: 0 24px 40px rgba(10, 10, 12, 0.1); }
.rs-ph { aspect-ratio: 16 / 10; border-radius: 12px; overflow: hidden; background: #0a0a0c; margin-bottom: 6px; }
.rs-ph img { width: 100%; height: 100%; object-fit: cover; transition: transform 1s var(--ease); }
.rs-card:hover img { transform: scale(1.05); }
.rs-card .rs-meta, .rs-card b, .rs-card p { padding: 0 10px; }
.rs-card b { font-weight: 400; font-family: var(--font-display); font-size: clamp(15px, 1.3vw, 22px); line-height: 1.15; letter-spacing: -0.04em; }
.rs-card p { margin: 0; font-family: var(--font-body); font-size: 11.5px; line-height: 1.65; opacity: 0.68; display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.card-enter-active, .card-leave-active { transition: opacity 0.4s ease, transform 0.5s var(--ease); }
.card-enter-from, .card-leave-to { opacity: 0; transform: translateY(14px); }
.card-leave-active { position: absolute; }
.card-move { transition: transform 0.5s var(--ease); }

.rs-bro { display: grid; grid-template-columns: 1fr 1.6fr; gap: 4vw; padding: 12vh 5vw 14vh; border-top: 1px solid rgba(10, 10, 12, 0.14); margin: 0 2.2vw; }
.rs-bro-l { display: flex; flex-direction: column; gap: 2.4vh; position: sticky; top: 14vh; align-self: start; }
.rs-h2 { margin: 0; font-weight: 400; font-family: var(--font-display); font-size: clamp(26px, 3.2vw, 58px); line-height: 1.02; letter-spacing: -0.05em; }
.rs-bro-l p { margin: 0; font-family: var(--font-body); font-size: 12px; opacity: 0.65; }
.rs-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--ink); }
.rs-list a { display: grid; grid-template-columns: 56px 1fr auto; align-items: baseline; gap: 12px; padding: 2.2vh 0; border-bottom: 1px solid rgba(10, 10, 12, 0.14); color: inherit; text-decoration: none; transition: padding 0.5s var(--ease), background 0.4s ease; }
.rs-list a:hover { padding-left: 1.2vw; background: linear-gradient(90deg, rgba(10, 10, 12, 0.05), transparent 70%); }
.rs-list em { font-style: normal; font-family: var(--font-body); font-size: 10px; opacity: 0.4; }
.rs-list span { font-family: var(--font-display); font-size: clamp(15px, 1.5vw, 26px); letter-spacing: -0.04em; }
.rs-list i { font-style: normal; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.12em; opacity: 0.5; }

.rs-end { padding-bottom: 4vh; }
@media (max-width: 1000px) { .rs-grid { grid-template-columns: repeat(2, 1fr); } .rs-lead-a, .rs-bro { grid-template-columns: 1fr; } .rs-bro-l { position: static; } }
@media (max-width: 640px) { .rs-grid { grid-template-columns: 1fr; } }
</style>
