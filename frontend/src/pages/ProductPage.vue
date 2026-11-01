<template>
  <PageShell :title="p ? p.name : 'Products'" blue v-slot="{ contact }">
    <section v-if="!p" class="pd-miss">
      <h1>That product is not in the range.</h1>
      <a class="ps-pill" href="/products"><span>All products</span></a>
    </section>

    <template v-else>
      <!-- 1 · the product: its photograph standing over its own name in giant type (after intrepidautomation.com),
           credits on the left, two lines from clients on the right (after a24.raviklaassens.com) -->
      <section class="pd-hero" :class="{ in: ready }" ref="heroRef">
        <h2 class="pd-giant" ref="giantRef" aria-hidden="true" :style="{ fontSize: giantSize }">
          <span v-for="(ch, k) in p.name.toUpperCase()" :key="k" :style="{ '--k': k }">{{ ch === ' ' ? '\u00a0' : ch }}</span>
        </h2>
        <div class="pd-shot" ref="shotRef"><img class="pd-photo" :class="{ photo: p.photo }" :src="img(p, 'hero')" :alt="p.name" fetchpriority="high" /></div>

        <div class="pd-card">
          <nav class="pd-crumb"><a href="/products" data-cursor="">Products</a><i>/</i><span>{{ p.group }}</span></nav>
          <h1>{{ p.name }}</h1>
          <dl>
            <div><dt>Series</dt><dd>{{ p.code }}</dd></div>
            <div v-for="c in credits" :key="c[0]"><dt>{{ c[0] }}</dt><dd>{{ c[1] }}<small v-if="c[2]">{{ c[2] }}</small></dd></div>
          </dl>
        </div>

        <div class="pd-q">
          <figure v-for="q in quotesFor(i)" :key="q.who">
            <figcaption>{{ q.who }} · Google review</figcaption>
            <blockquote>“{{ q.q }}”</blockquote>
          </figure>
        </div>

        <div class="pd-act">
          <button class="ps-pill" data-cursor="" @click="contact()"><span>{{ sel ? `Ask about ${sel}` : 'Request a quote' }}</span><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg></button>
          <a v-if="p.brochure" :href="p.brochure" target="_blank" rel="noopener" data-cursor="">Brochure</a>
          <a :href="`/products/${next.slug}`" data-cursor="">Next · {{ next.name }}</a>
        </div>
      </section>

      <!-- 2 · what it is -->
      <section class="pd-sec pd-about">
        <div class="pd-top rv"><span>(01)</span><span>About</span><span>{{ p.group }}</span></div>
        <div class="pd-about-row">
          <h2 class="rv">{{ p.tagline }}</h2>
          <p class="rv" style="--d: 0.08s">{{ p.intro }}</p>
        </div>
      </section>

      <!-- 3 · the photographs: the section pins and slides them sideways as you scroll, each moving a little inside its
           frame; phones swipe a plain strip -->
      <section v-if="shots.length > 1" class="pd-gal" ref="galRef" :style="{ height: galH }">
        <div class="pd-gal-pin">
          <div class="pd-top"><span>(02)</span><span>Photographs</span><span class="pd-count">{{ String(shotAt + 1).padStart(2, '0') }} / {{ String(shots.length).padStart(2, '0') }}</span></div>
          <div class="pd-track" ref="trackRef">
            <figure v-for="(s, k) in shots" :key="s" :class="{ photo: k > 0 || p.photo }"><img :src="s" :alt="`${p.name}, view ${k + 1}`" loading="lazy" draggable="false" /></figure>
          </div>
        </div>
      </section>

      <!-- 4 · the specification -->
      <section class="pd-sec pd-spec">
        <div class="pd-top rv"><span>(03)</span><span>Specification</span><span></span></div>
        <div class="pd-spec-row">
          <dl v-if="p.specs.length" class="rv">
            <div v-for="s in p.specs" :key="s[0]"><dt>{{ s[0] }}</dt><dd>{{ s[1] }}</dd></div>
          </dl>
          <p v-else class="pd-note rv">The full specification for this series is sent on request.</p>
          <ul v-if="p.features.length" class="rv" style="--d: 0.08s">
            <li v-for="f in p.features" :key="f">{{ f }}</li>
          </ul>
        </div>
      </section>

      <!-- 5 · the models in the series: a card each, with its own photograph where we have one; pick one and the quote
           asks about it. Variants (temperature / humidity) stay as chips. -->
      <section class="pd-sec pd-models">
        <div class="pd-top rv"><span>(04)</span><span>Models</span><span>{{ count }} in the series</span></div>
        <div class="pd-range">
          <button v-for="([fam, its], k) in families" :key="fam" class="pd-mc rv" :class="{ on: sel === fam }" :style="{ '--d': (k % 4) * 0.05 + 's' }" data-cursor="" @click="sel = sel === fam ? '' : fam">
            <span class="pd-mc-img"><img v-if="modelShots[fam]" :src="modelShots[fam]" :alt="fam" loading="lazy" /><small v-else>Photograph to follow</small></span>
            <b>{{ fam }}</b>
            <small v-if="its.length > 1">{{ its.map((it) => it.slice(fam.length + 1)).join(' · ') }}</small>
          </button>
        </div>
        <div v-for="m in p.models.filter((m) => m.label === 'Variants')" :key="m.label" class="pd-mrow rv">
          <span>{{ m.label }}</span>
          <div class="pd-chips">
            <button v-for="it in m.items" :key="it" :class="{ on: sel === it }" data-cursor="" @click="sel = sel === it ? '' : it">{{ it }}</button>
          </div>
        </div>
      </section>

      <NextUp label="Next chamber" :title="next.name" :text="next.tagline" :href="`/products/${next.slug}`" />

      <!-- phones: the quote stays in reach -->
      <button class="ps-pill pd-sticky" data-cursor="" @click="contact()"><span>{{ sel ? `Ask about ${sel}` : 'Request a quote' }}</span></button>
    </template>
  </PageShell>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import PageShell from '../components/PageShell.vue'
import NextUp from '../components/NextUp.vue'
import { products, bySlug, img, quotesFor, modelShots, family } from '../config/products'

const slug = decodeURIComponent(location.pathname.replace(/\/+$/, '').split('/').pop() ?? '')
const p = bySlug(slug)
const i = p ? products.indexOf(p) : 0
const next = products[(i + 1) % products.length]
// the credits: a main chamber's headline figures, otherwise the first lines of its specification
const credits = computed(() => (p?.hud ?? (p?.specs ?? []).slice(0, 4).map(([k, v]) => [k, v, ''])) as string[][])
const shots = p ? [img(p, 'hero'), ...Array.from({ length: p.gallery }, (_, k) => img(p, `g${k + 1}`))] : []
// every model outside the variants, grouped by family (EM64-30T and EM64-60H are both the EM64)
const families = p ? [...p.models.filter((m) => m.label !== 'Variants').flatMap((m) => m.items)
  .reduce((acc, it) => acc.set(family(it), [...(acc.get(family(it)) ?? []), it]), new Map<string, string[]>())] : []
const count = families.reduce((n, [, its]) => n + its.length, 0)
// a model picked from the list, or named in the link (?m=ET950)
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
const asked = norm(new URLSearchParams(location.search).get('m') ?? '')
const hitItem = p?.models.flatMap((m) => m.items).find((it) => asked && norm(it) === asked)
const sel = ref(hitItem ? (p!.models.some((m) => m.label === 'Variants' && m.items.includes(hitItem)) ? hitItem : family(hitItem)) : '')

const heroRef = ref<HTMLElement | null>(null)
const giantRef = ref<HTMLElement | null>(null)
const shotRef = ref<HTMLElement | null>(null)
const galRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const ready = ref(false)
const shotAt = ref(0)
// the giant name fills the width: shorter names get bigger letters
const giantSize = p ? `min(13vw, ${(92 / Math.max(6, p.name.length)).toFixed(2)}vw)` : '0'
const galH = `${100 + shots.length * 55}vh` // how long the gallery stays pinned
let small = false

function tick() {
  const H = window.innerHeight
  // hero: as it scrolls away the name drifts up faster than the photograph, which sinks a little
  const h = heroRef.value?.getBoundingClientRect()
  if (h && h.bottom > 0) {
    const u = Math.min(1, Math.max(0, -h.top / h.height))
    if (giantRef.value) giantRef.value.style.transform = `translate3d(-50%, ${(-u * 22).toFixed(2)}vh, 0)`
    if (shotRef.value) shotRef.value.style.transform = `translate3d(-50%, ${(u * 8).toFixed(2)}vh, 0) scale(${(1 - u * 0.06).toFixed(4)})`
  }
  // gallery: progress through the pinned stretch moves the track sideways; each photograph pans inside its frame
  const g = galRef.value, t = trackRef.value
  if (!small && g && t) {
    const r = g.getBoundingClientRect()
    if (r.top < H && r.bottom > 0) {
      const u = Math.min(1, Math.max(0, -r.top / (r.height - H)))
      const max = t.scrollWidth - t.clientWidth
      t.style.transform = `translate3d(${(-u * max).toFixed(1)}px, 0, 0)`
      const figs = t.children
      for (let k = 0; k < figs.length; k++) {
        const f = figs[k] as HTMLElement, fr = f.getBoundingClientRect()
        const c = (fr.left + fr.width / 2 - window.innerWidth / 2) / window.innerWidth // -0.5 … 0.5 across the screen
        ;(f.firstElementChild as HTMLElement).style.transform = `translate3d(${(-c * 8).toFixed(2)}%, 0, 0) scale(1.12)`
      }
      shotAt.value = Math.min(shots.length - 1, Math.round(u * (shots.length - 1)))
    }
  }
}
onMounted(() => {
  small = window.matchMedia('(max-width: 900px)').matches
  requestAnimationFrame(() => (ready.value = true))
  gsap.ticker.add(tick)
})
onUnmounted(() => gsap.ticker.remove(tick))
</script>

<style scoped>
.pd-miss { min-height: 100vh; display: grid; place-content: center; justify-items: start; gap: 3vh; padding: 0 8vw; }
.pd-miss h1 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(28px, 3.4vw, 60px); letter-spacing: -0.05em; }

/* ───────── the hero: one chamber, credits, quotes ───────── */
.pd-hero { position: relative; height: 100vh; min-height: 640px; overflow: hidden; color: #0d2340; }
/* the giant name sits behind the photograph; both arrive on load, the letters rising one after another */
.pd-giant { position: absolute; left: 50%; top: 12vh; z-index: 0; margin: 0; padding-top: 0.06em; overflow: hidden; transform: translate3d(-50%, 0, 0); white-space: nowrap; font-weight: 400; font-family: var(--font-display); line-height: 0.85; letter-spacing: -0.06em; color: #0d2340; opacity: 0.92; pointer-events: none; }
.pd-giant span { display: inline-block; transform: translateY(105%); clip-path: inset(0 0 0 0); transition: transform 1.1s cubic-bezier(0.2, 0.9, 0.2, 1) calc(var(--k) * 0.03s + 0.15s); }
.pd-hero.in .pd-giant span { transform: none; }
.pd-shot { position: absolute; left: 50%; bottom: 7vh; z-index: 1; height: 66vh; transform: translate3d(-50%, 0, 0); will-change: transform; }
.pd-photo { display: block; height: 100%; width: auto; max-width: 46vw; object-fit: contain; filter: drop-shadow(0 34px 34px rgba(13, 35, 64, 0.3)); clip-path: inset(100% 0 0 0); transform: translateY(6vh) scale(0.96); transition: clip-path 1.4s cubic-bezier(0.7, 0, 0.2, 1) 0.35s, transform 1.6s cubic-bezier(0.2, 0.9, 0.2, 1) 0.35s; }
.pd-hero.in .pd-photo { clip-path: inset(-60% -60% -60% -60%); transform: none; } /* wide open, or it crops the soft shadow */
.pd-photo.photo { height: 80%; border-radius: 16px; object-fit: cover; filter: none; }
.pd-card, .pd-q, .pd-act { position: absolute; z-index: 2; }

.pd-card { left: 2.2vw; bottom: 6vh; width: min(340px, 24vw); } /* bottom left: the top belongs to the giant name */
.pd-crumb { display: flex; gap: 10px; margin-bottom: 2vh; font-family: var(--font-body); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; }
.pd-crumb a { color: inherit; opacity: 0.6; text-decoration: none; transition: opacity 0.3s ease; }
.pd-crumb a:hover { opacity: 1; }
.pd-crumb i { font-style: normal; opacity: 0.35; }
.pd-crumb span { opacity: 0.6; }
.pd-card h1 { margin: 0 0 1.4vh; font-weight: 400; font-family: var(--font-display); font-size: clamp(22px, 2.3vw, 40px); line-height: 0.98; letter-spacing: -0.05em; text-transform: uppercase; }
/* desktop shows the name giant above; this one stays for screen readers (phones show it, see below) */
.pd-card h1 { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.pd-card dl { margin: 0; }
.pd-card dl div { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 7px 0 8px; border-top: 1px solid currentColor; }
.pd-card dt { font-family: var(--font-body); font-size: 8.5px; letter-spacing: 0.16em; text-transform: uppercase; }
.pd-card dd { margin: 0; font-family: var(--font-display); font-size: clamp(13px, 1vw, 16px); letter-spacing: -0.03em; text-align: right; }
.pd-card dd small { margin-left: 4px; font-family: var(--font-body); font-size: 9px; opacity: 0.6; }

.pd-q { right: 2.2vw; bottom: calc(6vh + 150px); display: flex; flex-direction: column; align-items: flex-end; gap: 4vh; pointer-events: none; } /* in the right column, clear of the chamber and its floor */
.pd-q figure { margin: 0; width: min(250px, 18vw); text-align: right; }
.pd-q figcaption { font-family: var(--font-body); font-size: 8.5px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.7; }
.pd-q blockquote { margin: 8px 0 0; font-family: var(--font-display); font-size: clamp(14px, 1.15vw, 20px); line-height: 1.02; letter-spacing: -0.04em; text-transform: uppercase; }

.pd-act { right: 2.2vw; bottom: 6vh; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
.pd-act a { padding: 0 0 2px; border-bottom: 1px solid currentColor; color: inherit; text-decoration: none; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.7; transition: opacity 0.3s ease; }
.pd-act a:hover { opacity: 1; }
.pd-act .ps-pill:hover { background: #ff6a1a; }

/* ───────── the sections below: hairline headers, big type, a strip of photographs ───────── */
.pd-sec { padding: 14vh 2.2vw 0; }
.pd-top { position: relative; display: grid; grid-template-columns: 8.333vw 1fr auto; gap: 2vw; padding-top: 14px; border-top: 1px solid rgba(13, 35, 64, 0.35); font-family: var(--font-body); font-size: 11px; letter-spacing: 0.04em; }
.pd-top > span { opacity: 0.6; }
.pd-about-row { display: grid; grid-template-columns: repeat(12, 1fr); gap: 0 1vw; margin-top: 6vh; align-items: start; }
.pd-about h2 { grid-column: 1 / span 7; margin: 0; font-weight: 400; font-family: var(--font-display); font-size: clamp(26px, 3.6vw, 66px); line-height: 1.02; letter-spacing: -0.055em; }
.pd-about p { grid-column: 9 / span 4; margin: 0.6em 0 0; font-family: var(--font-body); font-size: clamp(13px, 1vw, 16px); line-height: 1.6; }

/* the pinned gallery */
.pd-gal { position: relative; margin-top: 14vh; }
.pd-gal-pin { position: sticky; top: 0; height: 100vh; overflow: hidden; display: flex; flex-direction: column; gap: 4vh; padding: 12vh 2.2vw 0; } /* clear of the header */
.pd-count { opacity: 1 !important; font-variant-numeric: tabular-nums; }
.pd-track { display: flex; gap: 2vw; will-change: transform; }
.pd-track figure { flex: none; height: min(64vh, 46vw); aspect-ratio: 4 / 4.2; margin: 0; border-radius: 22px; overflow: hidden; background: linear-gradient(180deg, #e9f0f8, #dde8f4); display: grid; place-items: center; }
.pd-track img { width: 74%; height: 78%; object-fit: contain; filter: drop-shadow(0 22px 22px rgba(13, 35, 64, 0.22)); user-select: none; transform: scale(1.12); will-change: transform; }
.pd-track figure.photo img { width: 100%; height: 100%; object-fit: cover; filter: none; }

.pd-spec-row { display: grid; grid-template-columns: repeat(12, 1fr); gap: 0 1vw; margin-top: 4vh; }
.pd-spec dl { grid-column: 1 / span 7; margin: 0; }
.pd-spec dl div { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr); gap: 2vw; padding: 1.7vh 0; border-bottom: 1px solid rgba(13, 35, 64, 0.18); transition: padding 0.5s var(--ease); }
.pd-spec dl div:hover { padding-left: 0.6vw; }
.pd-spec dt { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.55; align-self: center; }
.pd-spec dd { margin: 0; font-family: var(--font-display); font-size: clamp(14px, 1.2vw, 20px); letter-spacing: -0.035em; overflow-wrap: anywhere; }
.pd-spec ul { grid-column: 9 / span 4; list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1.6vh; }
.pd-spec li { position: relative; padding-left: 18px; font-family: var(--font-body); font-size: 12.5px; line-height: 1.6; }
.pd-spec li::before { content: ''; position: absolute; left: 0; top: 0.6em; width: 7px; height: 7px; border-radius: 50%; background: #ff6a1a; }
.pd-note { grid-column: 1 / span 7; margin: 0; font-family: var(--font-body); font-size: 13px; opacity: 0.6; }

.pd-models { padding-bottom: 10vh; }
.pd-range { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(220px, 44vw), 1fr)); gap: 12px; margin: 4vh 0 2vh; }
.pd-mc { position: relative; display: flex; flex-direction: column; gap: 6px; padding: 14px 14px 16px; border: 1px solid transparent; border-radius: 18px; background: linear-gradient(180deg, #e9f0f8, #dde8f4); color: inherit; text-align: left; cursor: pointer; transition: border-color 0.3s ease, transform 0.6s cubic-bezier(0.2, 0.9, 0.2, 1); }
.pd-mc:hover { transform: translateY(-3px); }
.pd-mc.on { border-color: #ff6a1a; }
.pd-mc-img { position: relative; display: grid; place-items: center; height: 220px; margin-bottom: 6px; }
.pd-mc-img img { position: absolute; inset: 4% 10%; width: 80%; height: 92%; object-fit: contain; filter: drop-shadow(0 16px 16px rgba(13, 35, 64, 0.22)); }
.pd-mc-img small { font-family: var(--font-body); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.45; }
.pd-mc b { font-weight: 400; font-family: var(--font-display); font-size: 20px; letter-spacing: -0.04em; }
.pd-mc > small { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.06em; opacity: 0.6; }
.pd-mrow { display: grid; grid-template-columns: 8.333vw 1fr; gap: 2vw; padding: 3vh 0; border-bottom: 1px solid rgba(13, 35, 64, 0.18); }
.pd-mrow > span { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.55; padding-top: 9px; }
.pd-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.pd-chips button { padding: 9px 14px; border: 1px solid rgba(13, 35, 64, 0.25); border-radius: 40px; background: transparent; color: inherit; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.04em; cursor: pointer; transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease; }
.pd-chips button:hover { border-color: #0d2340; }
.pd-chips button.on { background: #ff6a1a; border-color: #ff6a1a; color: #fff; }

.pd-sticky { display: none; }

@media (max-width: 900px) {
  .pd-hero { height: 100svh; min-height: 0; }
  .pd-card { left: 5vw; right: 5vw; top: 11svh; bottom: auto; width: auto; }
  .pd-card h1 { position: static; width: auto; height: auto; overflow: visible; clip-path: none; font-size: 26px; }
  .pd-card dl { display: grid; grid-template-columns: 1fr 1fr; column-gap: 16px; }
  .pd-card dd { font-size: 12.5px; }
  .pd-giant { display: none; } /* the credits carry the name on phones */
  .pd-shot { bottom: 24svh; height: 36svh; }
  .pd-photo { max-width: 80vw; }
  .pd-photo.photo { height: 30svh; }
  .pd-q { left: 5vw; right: 5vw; bottom: calc(14svh + 20px); translate: none; } /* above the sticky quote button */
  .pd-q figure { width: 100%; text-align: center; }
  .pd-q figure + figure { display: none; }
  .pd-q blockquote { font-size: 16px; }
  .pd-act { display: none; }
  .pd-sec { padding: 10vh 5vw 0; }
  .pd-top { grid-template-columns: 14vw 1fr auto; }
  .pd-about h2, .pd-about p, .pd-spec dl, .pd-spec ul, .pd-note { grid-column: 1 / -1; }
  .pd-about p, .pd-spec ul { margin-top: 4vh; }
  /* phones: no pin, a strip to swipe */
  .pd-gal { height: auto !important; margin-top: 10vh; }
  .pd-gal-pin { position: static; height: auto; padding: 0 5vw; }
  .pd-track { overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; transform: none !important; }
  .pd-track figure { height: auto; width: 78vw; scroll-snap-align: start; }
  .pd-mrow { grid-template-columns: 1fr; gap: 12px; }
  .pd-mc-img { height: 150px; }
  .pd-models { padding-bottom: 16vh; }
  /* the quote button rides along at the foot of the screen */
  .pd-sticky { display: inline-flex; position: fixed; left: 5vw; right: 5vw; bottom: 14px; z-index: 40; justify-content: center; padding: 15px 18px; box-shadow: 0 10px 30px rgba(13, 35, 64, 0.25); }
}
</style>
