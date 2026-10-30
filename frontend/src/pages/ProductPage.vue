<template>
  <PageShell :title="p ? p.name : 'Products'" blue v-slot="{ contact }">
    <section v-if="!p" class="pd-miss">
      <h1>That product is not in the range.</h1>
      <a class="ps-pill" href="/products"><span>All products</span></a>
    </section>

    <template v-else>
      <!-- header strip: where you are, and the neighbours -->
      <div class="pd-top rv">
        <nav class="pd-crumb"><a href="/products" data-cursor="">Products</a><i>/</i><span>{{ p.name }}</span></nav>
        <div class="pd-pn">
          <a :href="`/products/${prev.slug}`" data-cursor="">← {{ prev.name }}</a>
          <a :href="`/products/${next.slug}`" data-cursor="">{{ next.name }} →</a>
        </div>
      </div>

      <section class="pd-main">
        <div class="pd-stagecol">
          <div class="pd-stage rv">
            <Transition name="swap" mode="out-in">
              <div :key="pic" class="pd-fig">
                <img class="pd-img" :src="pic === 0 ? img(p, 'hero') : img(p, `g${pic}`)" :alt="`${p.name}, view ${pic + 1}`" />
              </div>
            </Transition>
          </div>
          <div v-if="p.gallery" class="pd-thumbs rv" style="--d: 0.08s">
            <button v-for="n in p.gallery + 1" :key="n" :class="{ on: pic === n - 1 }" data-cursor="" @click="pic = n - 1" :aria-label="`Show view ${n}`">
              <img :src="n === 1 ? img(p, 'hero') : img(p, `g${n - 1}`)" alt="" loading="lazy" />
            </button>
          </div>
        </div>

        <div class="pd-info">
          <span class="ps-label rv"><i>+</i> {{ p.group }} · {{ p.tier === 'main' ? 'Main range' : 'Catalogue' }}</span>
          <h1 class="pd-h rv" style="--d: 0.05s">{{ p.name }}</h1>
          <p class="pd-tag rv" style="--d: 0.1s">{{ p.tagline }}</p>
          <p class="pd-intro rv" style="--d: 0.14s">{{ p.intro }}</p>

          <dl v-if="p.specs.length" class="pd-specs rv">
            <div v-for="s in p.specs" :key="s[0]"><dt>{{ s[0] }}</dt><dd>{{ s[1] }}</dd></div>
          </dl>

          <ul v-if="p.features.length" class="pd-feat rv">
            <li v-for="f in p.features" :key="f"><i>+</i>{{ f }}</li>
          </ul>

          <div class="pd-models rv">
            <div v-for="m in p.models" :key="m.label">
              <span>{{ m.label }}</span>
              <div class="pd-chips"><i v-for="it in m.items" :key="it" :class="{ hit: hit(it) }">{{ it }}</i></div>
            </div>
          </div>

          <div class="pd-cta rv">
            <button class="ps-pill" data-cursor="" @click="contact()"><span>Request a quote</span><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg></button>
            <a v-if="p.brochure" class="pd-link" :href="p.brochure" target="_blank" rel="noopener" data-cursor="">Brochure (PDF) ↗</a>
          </div>
          <p v-if="!p.specs.length || !p.features.length" class="pd-note rv">Full specification for this series is sent on request.</p>
        </div>
      </section>

      <!-- one product, one page: the way on is the next product in the range -->
      <NextUp label="Next product" :title="next.name" :text="next.tagline" :href="`/products/${next.slug}`" />
    </template>
  </PageShell>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageShell from '../components/PageShell.vue'
import NextUp from '../components/NextUp.vue'
import { products, bySlug, img } from '../config/products'

const slug = decodeURIComponent(location.pathname.replace(/\/+$/, '').split('/').pop() ?? '')
const p = bySlug(slug)
const model = (new URLSearchParams(location.search).get('m') ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
const hit = (it: string) => !!model && it.toLowerCase().replace(/[^a-z0-9]/g, '') === model
const pic = ref(0)
const i = p ? products.indexOf(p) : 0
const prev = products[(i - 1 + products.length) % products.length]
const next = products[(i + 1) % products.length]
</script>

<style scoped>
.pd-miss { min-height: 100vh; display: grid; place-content: center; justify-items: start; gap: 3vh; padding: 0 8vw; }
.pd-miss h1 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(28px, 3.4vw, 60px); letter-spacing: -0.05em; }
.pd-top { display: flex; justify-content: space-between; align-items: center; padding: 15vh 4vw 3vh; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; }
.pd-top a { color: inherit; text-decoration: none; opacity: 0.6; transition: opacity 0.3s ease; }
.pd-top a:hover { opacity: 1; }
.pd-crumb { display: flex; gap: 12px; }
.pd-crumb i { font-style: normal; opacity: 0.35; }
.pd-pn { display: flex; gap: 28px; }

.pd-main { display: grid; grid-template-columns: 1.08fr 1fr; gap: 3vw; padding: 0 2.2vw 14vh; align-items: start; }
.pd-stagecol { position: sticky; top: 9vh; display: flex; flex-direction: column; gap: 12px; }
.pd-stage { position: relative; height: 72vh; border-radius: 24px; background: linear-gradient(145deg, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.3)); border: 1px solid rgba(255, 255, 255, 0.9); backdrop-filter: blur(24px) saturate(1.5); -webkit-backdrop-filter: blur(24px) saturate(1.5); box-shadow: 0 1px 0 #fff inset, 0 30px 60px rgba(13, 35, 64, 0.12); display: grid; place-items: center; padding: 5vh 2vw; overflow: hidden; }
.pd-fig { height: 100%; width: 100%; display: grid; place-items: center; }
.pd-img { max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0 30px 30px rgba(13, 35, 64, 0.28)); }
.pd-hint { position: absolute; left: 50%; bottom: 2.4vh; translate: -50% 0; font-family: var(--font-body); font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.4; pointer-events: none; white-space: nowrap; }
.pd-thumbs { display: flex; gap: 8px; }
.pd-thumbs button { width: 84px; height: 84px; padding: 8px; border: 1px solid transparent; border-radius: 12px; background: rgba(255, 255, 255, 0.5); cursor: pointer; transition: border-color 0.3s ease, background 0.3s ease; }
.pd-thumbs button.on { border-color: var(--ink); background: #fff; }
.pd-thumbs img { width: 100%; height: 100%; object-fit: contain; display: block; }

.pd-info { display: flex; flex-direction: column; gap: 2.4vh; padding-top: 1vh; }
.pd-h { margin: 0; font-weight: 400; font-family: var(--font-display); font-size: clamp(30px, 3.8vw, 72px); line-height: 1; letter-spacing: -0.055em; }
.pd-tag { margin: 0; font-family: var(--font-display); font-size: clamp(15px, 1.35vw, 24px); letter-spacing: -0.04em; opacity: 0.55; }
.pd-intro { margin: 0; max-width: 36em; font-family: var(--font-body); font-size: clamp(12px, 0.92vw, 14px); line-height: 1.75; opacity: 0.8; }
.pd-specs { margin: 1vh 0 0; border-top: 1px solid var(--ink); }
.pd-specs div { display: grid; grid-template-columns: 1fr 1.6fr; gap: 2vw; padding: 1.6vh 0; border-bottom: 1px solid rgba(13, 35, 64, 0.18); transition: padding 0.5s var(--ease), background 0.4s ease; }
.pd-specs div:hover { padding-left: 0.8vw; background: linear-gradient(90deg, rgba(13, 35, 64, 0.06), transparent 70%); }
.pd-specs dt { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.55; align-self: center; }
.pd-specs dd { margin: 0; font-family: var(--font-display); font-size: clamp(14px, 1.2vw, 20px); letter-spacing: -0.035em; }
.pd-feat { list-style: none; margin: 1vh 0 0; padding: 0; display: flex; flex-direction: column; gap: 1.1vh; }
.pd-feat li { display: flex; gap: 12px; font-family: var(--font-body); font-size: 12px; line-height: 1.6; opacity: 0.85; }
.pd-feat i { font-style: normal; color: #c24a08; flex: none; }
.pd-models { display: flex; flex-direction: column; gap: 2vh; margin-top: 1vh; }
.pd-models > div > span { display: block; margin-bottom: 8px; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.5; }
.pd-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.pd-chips i { font-style: normal; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.04em; padding: 7px 11px; border-radius: 6px; border: 1px solid rgba(10, 10, 12, 0.2); transition: background 0.3s ease, color 0.3s ease; }
.pd-chips i:hover { background: var(--ink); color: #fff; }
.pd-chips i.hit { background: #ff6a1a; border-color: #ff6a1a; color: #fff; }
.pd-cta { display: flex; align-items: center; gap: 28px; margin-top: 2vh; }
.pd-link { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: inherit; text-decoration: none; border-bottom: 1px solid rgba(10, 10, 12, 0.35); padding-bottom: 3px; }
.pd-note { margin: 0; font-family: var(--font-body); font-size: 11px; opacity: 0.5; }


.swap-enter-active, .swap-leave-active { transition: opacity 0.3s ease, transform 0.45s var(--ease); }
.swap-enter-from { opacity: 0; transform: scale(0.98); }
.swap-leave-to { opacity: 0; transform: scale(1.01); }

@media (max-width: 900px) {
  .pd-main { grid-template-columns: minmax(0, 1fr); gap: 4vh; padding: 0 4vw 10vh; }
  .pd-stagecol { position: static; min-width: 0; }
  .pd-info { min-width: 0; }
  .pd-stage { height: 46vh; border-radius: 18px; padding: 4vh 4vw; backdrop-filter: none; -webkit-backdrop-filter: none; }
  .pd-thumbs { overflow-x: auto; scrollbar-width: none; } .pd-thumbs button { flex: none; width: 68px; height: 68px; }
  .pd-top { padding: 13vh 4vw 2vh; } .pd-pn a:first-child { display: none; }
  .pd-specs div { grid-template-columns: 1fr 1.5fr; gap: 4vw; }
  .pd-feat li, .pd-intro, .pd-specs dd { overflow-wrap: anywhere; }
  .pd-cta { flex-wrap: wrap; gap: 16px 24px; }
}
</style>
