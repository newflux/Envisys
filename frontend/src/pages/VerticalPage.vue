<template>
  <PageShell :title="v ? v.name : 'Verticals'" blue v-slot="{ contact }">
    <section v-if="!v" class="vp-miss">
      <h1>That page is not here.</h1>
      <a class="vp-btn" href="/verticals"><span>All verticals</span></a>
    </section>

    <template v-else>
      <!-- 1 · the photograph, read like an inspection image: frame marks, tagged points with their pixel coordinates, a scan line -->
      <section class="vp-hero" ref="heroRef">
        <figure class="vp-photo" ref="photoRef"><img :src="v.img" :alt="v.name" fetchpriority="high" :style="{ '--fx': focus + '%' }" /></figure>
        <div class="vp-hud" aria-hidden="true">
          <i class="vp-c tl"></i><i class="vp-c tr"></i><i class="vp-c bl"></i><i class="vp-c br"></i>
          <i class="vp-scanline"></i>
          <span class="vp-meta">fig. 0{{ i + 1 }} · {{ v.img.split('/').pop() }} · 2000 × 1125</span>
          <div v-for="(t, k) in v.tags" :key="t[2]" class="vp-tagpt" :class="{ flip: t[0] > 62 }" :style="{ left: t[0] + '%', top: t[1] + '%', '--k': k }">
            <i class="vp-dot"></i>
            <svg class="vp-ld" viewBox="0 0 150 46"><path d="M0 46 L40 6 H150" pathLength="1" /></svg>
            <span class="vp-lb">{{ t[2] }}<small>x: {{ px(t[0], 2000) }} y: {{ px(t[1], 1125) }}</small></span>
          </div>
        </div>
        <nav class="vp-crumb"><a href="/verticals" data-cursor="">Verticals</a><i>/</i><span>0{{ i + 1 }}</span></nav>
        <div class="vp-hl">
          <h1 class="vp-h" :class="{ long: lines.some((l) => l.length > 11) }"><span v-for="(w, k) in lines" :key="k" class="vp-ln"><span :style="{ '--k': k }" v-html="hy(w)"></span></span></h1>
          <div class="vp-row">
            <p class="vp-short">{{ v.short }}</p>
            <button class="ps-pill light" data-cursor="" @click="contact()"><span>{{ v.cta }}</span><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg></button>
          </div>
        </div>
      </section>

      <!-- 2 · one sentence, lit word by word, beside the vertical's own drawing in a figure frame -->
      <section class="vp-intro" ref="leadRef">
        <p class="vp-big"><span v-for="(w, k) in words" :key="k" :style="{ opacity: lit(k) }" v-html="hy(w)"></span></p>
        <figure class="vp-fig rv"><i class="vp-c tl"></i><i class="vp-c tr"></i><i class="vp-c bl"></i><i class="vp-c br"></i><VMotif :kind="v.motif" /><figcaption>fig. 0{{ i + 1 }}b · {{ v.motif }}</figcaption></figure>
      </section>

      <!-- the second photograph, where there is one -->
      <section v-if="v.img2" class="vp-band rv"><img :src="v.img2" alt="" loading="lazy" /><span>fig. 0{{ i + 1 }}c · {{ v.img2.split('/').pop() }}</span></section>

      <!-- 3 · each vertical's own section -->
      <section class="vp-own">
        <!-- design: standard or yours -->
        <div v-if="v.id === 'design'" class="vp-two">
          <article class="vp-card rv">
            <span class="vp-tag">Standard</span>
            <h3>From the range.</h3>
            <div class="vp-chips"><a v-for="o in v.offer" :key="o.t" :href="o.href" data-cursor=""><b>{{ o.t }}</b><small>{{ o.d }}</small></a></div>
          </article>
          <article class="vp-card navy rv" style="--d: 0.1s">
            <span class="vp-tag">Yours</span>
            <h3>Built to your standard.</h3>
            <VMotif kind="blueprint" class="vp-card-m" />
          </article>
        </div>

        <!-- testing: the tests, and the accreditation -->
        <div v-else-if="v.id === 'testing'" class="vp-tests">
          <div class="vp-seal rv" aria-label="NABL accredited">
            <svg viewBox="0 0 200 200"><defs><path id="vp-c" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" /></defs><text><textPath href="#vp-c">NABL ACCREDITED · VISTARA LAB · PEENYA · </textPath></text></svg>
            <b>NABL</b>
          </div>
          <div class="vp-grid">
            <div v-for="(o, k) in v.offer" :key="o.t" class="vp-test rv" :style="{ '--d': k * 0.06 + 's' }"><em>0{{ k + 1 }}</em><b>{{ o.t }}</b><small>{{ o.d }}</small></div>
          </div>
        </div>

        <!-- rentals: rent, buy, or use a lab, then the guides -->
        <div v-else-if="v.id === 'rentals'" class="vp-rbl">
          <div class="vp-cols">
            <div v-for="(c, k) in rentCols" :key="c[0]" class="vp-col rv" :class="{ on: k === 0 }" :style="{ '--d': k * 0.08 + 's' }"><span>{{ c[0] }}</span><b>{{ c[1] }}</b></div>
          </div>
          <div class="vp-guides">
            <a v-for="(o, k) in v.offer" :key="o.t" :href="o.href" target="_blank" rel="noopener" class="vp-guide rv" :style="{ '--d': k * 0.07 + 's' }" data-cursor="">
              <span class="vp-gtag"><i></i>Guide · envisystech.com</span>
              <b>{{ o.t }}</b>
              <small>{{ o.d }}</small>
              <svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg>
            </a>
          </div>
        </div>

        <!-- after sales: 24 hours, and where the engineers are -->
        <div v-else-if="v.id === 'aftersales'" class="vp-care">
          <div class="vp-24 rv"><b>24</b><span>hours to answer<br />every complaint</span></div>
          <div class="vp-offices">
            <span class="vp-tag rv">Regional offices</span>
            <ul><li v-for="(c, k) in offices" :key="c" class="rv" :style="{ '--d': k * 0.07 + 's' }">{{ c }}</li></ul>
            <div class="vp-svc rv"><span v-for="o in v.offer" :key="o.t">{{ o.t }}</span></div>
          </div>
        </div>

        <!-- refurbishment: three ways to a second life -->
        <div v-else class="vp-three">
          <article v-for="(o, k) in v.offer" :key="o.t" class="vp-panel rv" :style="{ '--d': k * 0.1 + 's' }">
            <img v-if="o.img" :src="o.img" alt="" loading="lazy" />
            <span v-else class="vp-panel-m"><VMotif kind="loop" /></span>
            <em>0{{ k + 1 }}</em><b>{{ o.t }}</b><small>{{ o.d }}</small>
          </article>
        </div>
      </section>

      <!-- 4 · how it works -->
      <section class="vp-how" ref="howRef">
        <span class="vp-tag rv">How it works</span>
        <ol>
          <li v-for="(s, k) in v.steps" :key="s" :class="{ on: stepOn > k }"><em>{{ k + 1 }}</em><b>{{ s }}</b></li>
        </ol>
        <i class="vp-rail"><u :style="{ transform: `scaleX(${stepP})` }"></u></i>
        <dl v-if="v.facts.length" class="vp-facts">
          <div v-for="(f, k) in v.facts" :key="f.l" class="rv" :style="{ '--d': k * 0.08 + 's' }"><dt>{{ f.v }}</dt><dd>{{ f.l }}</dd></div>
        </dl>
      </section>

      <!-- 5 · ask: the same quiet close as the rest of the site, a line and a button -->
      <section class="vp-ask">
        <span class="vp-tag rv">{{ v.name }}</span>
        <h2 class="rv" style="--d: 0.05s">{{ v.cta }}.</h2>
        <button class="ps-pill rv" style="--d: 0.1s" data-cursor="" @click="contact()"><span>Talk to an engineer</span><svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg></button>
      </section>

      <NextUp label="Next vertical" :title="next.name" :text="next.short" :href="to(next)" />
    </template>
  </PageShell>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import PageShell from '../components/PageShell.vue'
import NextUp from '../components/NextUp.vue'
import VMotif from '../components/VMotif.vue'
import { verticals, vertical, offices, to, hy } from '../config/verticals'

const id = location.pathname.replace(/\/+$/, '').split('/').pop() ?? ''
const v = vertical(id)
const i = verticals.findIndex((x) => x.id === id)
const next = verticals[(i + 1) % verticals.length]
// the name breaks at the ampersand, so 'Refurbishment & Buy-back' sits on two lines
const lines = v ? v.name.split(/ (?=&)/) : []
const rentCols: [string, string][] = [['Rent', 'Short tests, project budgets'], ['Buy', 'Testing every day'], ['Use a lab', 'When you need the report, not the chamber']]

const heroRef = ref<HTMLElement | null>(null), photoRef = ref<HTMLElement | null>(null), leadRef = ref<HTMLElement | null>(null), howRef = ref<HTMLElement | null>(null)
const stepP = ref(0), stepOn = ref(0), leadP = ref(0)
const words = v ? v.text.split(' ') : []
const lit = (k: number) => Math.min(1, Math.max(0.14, (leadP.value * (words.length + 3) - k) / 3)).toFixed(3)
// where the subject sits across the photograph: a narrow screen crops to it
const focus = ({ testing: 24, rentals: 44, aftersales: 64, refurb: 40 } as Record<string, number>)[id] ?? 50
const px = (pc: number, n: number) => String(Math.round((pc / 100) * n)).padStart(4, '0')
const clamp = (x: number) => Math.min(1, Math.max(0, x))
// the header logo turns white while the hero photograph is under it (PageShell reads html.hx-dark)
const under = (el: Element | null | undefined) => { if (!el) return false; const r = el.getBoundingClientRect(); return r.top < 44 && r.bottom > 44 }
function tick() {
  const H = window.innerHeight
  const h = heroRef.value!.getBoundingClientRect(), p = clamp(-h.top / h.height)
  photoRef.value!.style.transform = `translateY(${(p * 18).toFixed(2)}vh) scale(${(1.04 + p * 0.08).toFixed(4)})`
  const l = leadRef.value!.getBoundingClientRect()
  leadP.value = clamp((H * 0.85 - l.top) / (H * 0.6))
  const w = howRef.value!.getBoundingClientRect()
  stepP.value = clamp((H * 0.75 - w.top) / (w.height * 0.8))
  stepOn.value = Math.floor(stepP.value * 4 + 0.3)
  document.documentElement.classList.toggle('hx-dark', under(heroRef.value))
}
onMounted(() => { if (v) gsap.ticker.add(tick) })
onUnmounted(() => { gsap.ticker.remove(tick); document.documentElement.classList.remove('hx-dark') })
</script>

<style scoped>
.vp-miss { min-height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 4vh; padding: 0 5vw; }
.vp-miss h1 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(32px, 4vw, 72px); letter-spacing: -0.05em; color: #0d2340; }
.vp-tag { display: inline-flex; align-items: center; gap: 10px; font-family: 'Geist Mono', monospace; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(13, 35, 64, 0.65); }
.vp-tag::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #ff6a1a; }
.vp-btn { align-self: flex-start; display: inline-flex; align-items: center; gap: 12px; padding: 17px 26px; border: 0; border-radius: 40px; background: #0d2340; color: #fff; font-family: 'Geist Mono', monospace; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; cursor: pointer; transition: background 0.4s ease, gap 0.4s ease; }
.vp-btn:hover { background: #ff6a1a; color: #0a0a0c; gap: 18px; }
.vp-btn.orange { background: #ff6a1a; color: #0a0a0c; font-weight: 600; }
.vp-btn.orange:hover { background: #ff8a4a; }
.vp-btn svg { width: 10px; height: 10px; }

/* 1 · hero: the inspection photograph */
.vp-hero { position: relative; height: 100vh; min-height: 620px; overflow: hidden; color: #f4f8fd; background: #0b1d36; }
.vp-photo { position: absolute; inset: 0; margin: 0; transform-origin: 50% 30%; }
.vp-photo img { width: 100%; height: 100%; object-fit: cover; animation: vp-in 2.4s cubic-bezier(0.2, 0.9, 0.2, 1) both; }
.vp-photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(6, 16, 31, 0.45), transparent 30%, transparent 50%, rgba(6, 16, 31, 0.85)), linear-gradient(90deg, rgba(6, 16, 31, 0.55), transparent 55%); }
@keyframes vp-in { from { opacity: 0; transform: scale(1.12); filter: blur(8px); } }
.vp-hud { position: absolute; inset: 0; pointer-events: none; }
.vp-c { position: absolute; width: 22px; height: 22px; border: 1.5px solid currentColor; opacity: 0.8; }
.vp-hud .vp-c.tl { left: 3vw; top: 13vh; } .vp-hud .vp-c.tr { right: 3vw; top: 13vh; } .vp-hud .vp-c.bl { left: 3vw; bottom: 4vh; } .vp-hud .vp-c.br { right: 3vw; bottom: 4vh; }
.vp-c.tl { border-right: 0; border-bottom: 0; } .vp-c.tr { border-left: 0; border-bottom: 0; } .vp-c.bl { border-right: 0; border-top: 0; } .vp-c.br { border-left: 0; border-top: 0; }
.vp-scanline { position: absolute; left: 3vw; right: 3vw; top: 13vh; height: 1px; background: linear-gradient(90deg, transparent, #ff8a4a, transparent); box-shadow: 0 0 18px rgba(255, 106, 26, 0.7); animation: vp-scan 2.6s cubic-bezier(0.6, 0, 0.3, 1) 0.6s both; }
@keyframes vp-scan { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(80vh); opacity: 0; } }
.vp-meta { position: absolute; right: calc(3vw + 34px); top: calc(13vh + 4px); font-family: 'Geist Mono', monospace; font-size: 12px; letter-spacing: 0.06em; opacity: 0.75; animation: vp-fade 1s ease 1s both; }
.vp-tagpt { position: absolute; width: 0; height: 0; }
.vp-dot { position: absolute; width: 12px; height: 12px; margin: -6px 0 0 -6px; border: 1.5px solid #fff; animation: vp-pop 0.5s cubic-bezier(0.2, 0.9, 0.2, 1) both; animation-delay: calc(1.2s + var(--k) * 0.35s); }
.vp-dot::after { content: ''; position: absolute; inset: 3px; background: #ff6a1a; }
@keyframes vp-pop { from { transform: scale(0); } }
.vp-ld { position: absolute; left: 0; top: -46px; width: 150px; height: 46px; overflow: visible; }
.vp-ld path { fill: none; stroke: rgba(255, 255, 255, 0.85); stroke-width: 1; stroke-dasharray: 1; stroke-dashoffset: 1; animation: vp-draw 0.8s ease both; animation-delay: calc(1.4s + var(--k) * 0.35s); vector-effect: non-scaling-stroke; }
@keyframes vp-draw { to { stroke-dashoffset: 0; } }
.vp-lb { position: absolute; left: 44px; top: -74px; display: flex; flex-direction: column; gap: 3px; padding: 6px 10px; background: rgba(6, 16, 31, 0.55); border: 1px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); font-family: 'Geist Mono', monospace; font-size: 13px; white-space: nowrap; animation: vp-fade 0.6s ease both; animation-delay: calc(1.9s + var(--k) * 0.35s); }
.vp-lb small { font-size: 11px; opacity: 0.65; }
.vp-tagpt.flip .vp-ld { left: -150px; transform: scaleX(-1); }
.vp-tagpt.flip .vp-lb { left: auto; right: 44px; }
.vp-crumb { position: absolute; left: calc(3vw + 34px); top: calc(13vh + 4px); z-index: 2; display: flex; gap: 12px; font-family: 'Geist Mono', monospace; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; animation: vp-fade 1s ease 0.4s both; }
.vp-crumb a { color: inherit; text-decoration: none; border-bottom: 1px solid rgba(244, 248, 253, 0.5); }
.vp-crumb a:hover { color: #ff8a4a; border-color: #ff8a4a; }
.vp-crumb i { font-style: normal; opacity: 0.6; }
.vp-hl { position: absolute; left: 5vw; right: 5vw; bottom: 9vh; z-index: 2; display: flex; flex-direction: column; gap: 3vh; }
.vp-h { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(44px, 7.4vw, 144px); line-height: 0.92; letter-spacing: -0.06em; }
.vp-h.long { font-size: clamp(38px, 5.6vw, 108px); }
.vp-ln { display: block; overflow: hidden; padding-bottom: 0.07em; }
.vp-ln > span { display: block; animation: vp-up 1.3s cubic-bezier(0.2, 0.9, 0.2, 1) both; animation-delay: calc(0.5s + var(--k) * 0.12s); }
@keyframes vp-up { from { transform: translateY(110%); } }
@keyframes vp-fade { from { opacity: 0; } }
.vp-row { display: flex; align-items: center; gap: 28px; flex-wrap: wrap; animation: vp-fade 1s ease 1s both; }
.vp-short { margin: 0; font-family: 'Geist', sans-serif; font-size: clamp(19px, 1.6vw, 28px); color: rgba(244, 248, 253, 0.88); }
.vp-row .ps-pill { padding: 16px 24px; font-size: 12px; }

/* 2 · intro */
.vp-intro { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr); gap: 5vw; align-items: center; padding: 20vh 5vw 12vh; color: #0d2340; }
.vp-big { margin: 0; font-family: var(--font-display); font-size: clamp(28px, 3.6vw, 68px); line-height: 1.08; letter-spacing: -0.05em; }
.vp-big span { display: inline-block; margin-right: 0.24em; transition: opacity 0.25s linear; }
.vp-fig { position: relative; margin: 0; padding: 4vh 2.4vw 3vh; color: #0d2340; }
.vp-fig .vp-c { opacity: 0.5; }
.vp-fig .vp-c.tl { left: 0; top: 0; } .vp-fig .vp-c.tr { right: 0; top: 0; } .vp-fig .vp-c.bl { left: 0; bottom: 0; } .vp-fig .vp-c.br { right: 0; bottom: 0; }
.vp-fig figcaption { margin-top: 2vh; font-family: 'Geist Mono', monospace; font-size: 12px; letter-spacing: 0.06em; opacity: 0.6; }
.vp-band { position: relative; margin: 0 5vw; height: 70vh; border-radius: 24px; overflow: hidden; }
.vp-band img { width: 100%; height: 100%; object-fit: cover; }
.vp-band span { position: absolute; left: 20px; bottom: 18px; padding: 6px 10px; background: rgba(6, 16, 31, 0.6); color: #f4f8fd; font-family: 'Geist Mono', monospace; font-size: 12px; }
.vp-card-m { margin-top: auto; --mi: #dbe8f6; }

/* 3 · own sections */
.vp-own { padding: 18vh 5vw 8vh; color: #0d2340; }
.vp-card { display: flex; flex-direction: column; gap: 3vh; padding: 5vh 2.6vw; border-radius: 30px; background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(13, 35, 64, 0.08); }
.vp-card.navy { background: #0d2340; color: #eef3fa; }
.vp-card.navy .vp-tag { color: rgba(238, 243, 250, 0.65); }
.vp-card h3 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(28px, 3vw, 56px); letter-spacing: -0.05em; line-height: 1; }
.vp-card img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; border-radius: 18px; margin-top: auto; }
.vp-two { display: grid; grid-template-columns: 1fr 1fr; gap: 1.6vw; }
.vp-chips { display: flex; flex-direction: column; margin-top: auto; border-top: 1px solid rgba(13, 35, 64, 0.12); }
.vp-chips a { display: flex; justify-content: space-between; align-items: baseline; gap: 2vw; padding: 2.4vh 0; border-bottom: 1px solid rgba(13, 35, 64, 0.12); color: inherit; text-decoration: none; transition: padding 0.5s cubic-bezier(0.2, 0.9, 0.2, 1), color 0.3s ease; }
.vp-chips a:hover { padding-left: 1vw; color: #ff6a1a; }
.vp-chips b { font-family: 'Geist', sans-serif; font-weight: 500; font-size: clamp(18px, 1.35vw, 24px); }
.vp-chips small { font-family: 'Geist Mono', monospace; font-size: 14px; opacity: 0.6; }

.vp-tests { display: grid; grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr); gap: 4vw; align-items: center; }
.vp-seal { position: relative; width: min(30vw, 360px); aspect-ratio: 1; display: grid; place-items: center; justify-self: center; }
.vp-seal svg { position: absolute; inset: 0; width: 100%; height: 100%; animation: vp-spin 24s linear infinite; }
.vp-seal text { font-family: 'Geist Mono', monospace; font-size: 15.5px; letter-spacing: 0.28em; fill: #0d2340; }
.vp-seal b { width: 58%; aspect-ratio: 1; display: grid; place-items: center; border-radius: 50%; background: #0d2340; color: #fff; font-family: var(--font-display); font-weight: 400; font-size: clamp(26px, 3vw, 52px); letter-spacing: -0.04em; box-shadow: 0 0 0 12px rgba(255, 106, 26, 0.16); }
@keyframes vp-spin { to { transform: rotate(360deg); } }
.vp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2vw; }
.vp-test { display: flex; flex-direction: column; gap: 1.4vh; padding: 3.4vh 1.6vw; border-radius: 22px; background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(13, 35, 64, 0.08); transition: background 0.4s ease, transform 0.6s cubic-bezier(0.2, 0.9, 0.2, 1); }
.vp-test:hover { background: #fff; transform: translateY(-6px); }
.vp-test em { font-style: normal; font-family: 'Geist Mono', monospace; font-size: 14px; color: #ff6a1a; }
.vp-test b { font-family: var(--font-display); font-weight: 400; font-size: clamp(19px, 1.5vw, 27px); letter-spacing: -0.04em; line-height: 1.12; }
.vp-test small { font-family: 'Geist', sans-serif; font-size: 16px; opacity: 0.7; }

.vp-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.4vw; }
.vp-col { display: flex; flex-direction: column; justify-content: space-between; gap: 6vh; min-height: 34vh; padding: 4vh 2vw; border-radius: 28px; background: rgba(255, 255, 255, 0.55); border: 1px solid rgba(13, 35, 64, 0.08); }
.vp-col.on { background: #0d2340; color: #eef3fa; }
.vp-col span { font-family: var(--font-display); font-size: clamp(30px, 3.2vw, 60px); letter-spacing: -0.05em; }
.vp-col.on span { color: #ff8a4a; }
.vp-col b { font-family: 'Geist', sans-serif; font-weight: 400; font-size: clamp(18px, 1.35vw, 24px); line-height: 1.4; }
.vp-guides { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4vw; margin-top: 8vh; }
.vp-guide { position: relative; display: flex; flex-direction: column; gap: 1.4vh; min-height: 24vh; padding: 3.4vh 2vw 4vh; border-radius: 28px; background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(13, 35, 64, 0.08); color: inherit; text-decoration: none; overflow: hidden; transition: background 0.4s ease, transform 0.6s cubic-bezier(0.2, 0.9, 0.2, 1), box-shadow 0.5s ease; }
.vp-guide::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #ff6a1a; transform: scaleY(0); transform-origin: top; transition: transform 0.6s cubic-bezier(0.2, 0.9, 0.2, 1); }
.vp-guide:hover { background: #fff; transform: translateY(-6px); box-shadow: 0 30px 60px -36px rgba(13, 35, 64, 0.5); }
.vp-guide:hover::before { transform: scaleY(1); }
.vp-gtag { display: inline-flex; align-items: center; gap: 10px; font-family: 'Geist Mono', monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.6; }
.vp-gtag i { width: 7px; height: 7px; border-radius: 50%; background: #ff6a1a; }
.vp-guide b { margin-top: auto; padding-right: 40px; font-family: var(--font-display); font-weight: 400; font-size: clamp(22px, 2vw, 36px); letter-spacing: -0.05em; line-height: 1.08; }
.vp-guide small { font-family: 'Geist', sans-serif; font-size: 17px; opacity: 0.7; }
.vp-guide svg { position: absolute; right: 2vw; bottom: 4vh; width: 16px; height: 16px; transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1); }
.vp-guide:hover svg { transform: translate(4px, -4px); color: #ff6a1a; }
:deep(.hy) { font-family: 'Geist', sans-serif; font-style: normal; font-weight: 600; letter-spacing: 0; padding: 0 0.04em; } /* the display face draws its hyphen as a long dash */
.vp-links { list-style: none; margin: 10vh 0 0; padding: 0; border-top: 1px solid rgba(13, 35, 64, 0.14); }
.vp-links li { border-bottom: 1px solid rgba(13, 35, 64, 0.14); }
.vp-links a { display: grid; grid-template-columns: 1fr auto 16px; align-items: center; gap: 3vw; padding: 3vh 0; color: inherit; text-decoration: none; transition: padding 0.5s cubic-bezier(0.2, 0.9, 0.2, 1), color 0.3s ease; }
.vp-links a:hover { padding-left: 1vw; color: #ff6a1a; }
.vp-links b { font-family: 'Geist', sans-serif; font-weight: 500; font-size: clamp(19px, 1.5vw, 26px); }
.vp-links span { font-family: 'Geist Mono', monospace; font-size: 14px; opacity: 0.6; }
.vp-links svg { width: 12px; height: 12px; }

.vp-care { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 5vw; align-items: center; }
.vp-24 { display: flex; align-items: flex-end; gap: 2vw; }
.vp-24 b { font-family: var(--font-display); font-weight: 400; font-size: clamp(140px, 22vw, 400px); line-height: 0.8; letter-spacing: -0.08em; background: linear-gradient(180deg, #0d2340, #3a6aa8); -webkit-background-clip: text; background-clip: text; color: transparent; }
.vp-24 span { padding-bottom: 2vh; font-family: 'Geist', sans-serif; font-size: clamp(18px, 1.5vw, 26px); line-height: 1.35; }
.vp-offices { display: flex; flex-direction: column; gap: 3vh; }
.vp-offices ul { list-style: none; margin: 0; padding: 0; border-top: 1px solid rgba(13, 35, 64, 0.14); }
.vp-offices li { padding: 2.2vh 0; border-bottom: 1px solid rgba(13, 35, 64, 0.14); font-family: var(--font-display); font-size: clamp(24px, 2.6vw, 48px); letter-spacing: -0.05em; }
.vp-svc { display: flex; flex-wrap: wrap; gap: 10px; }
.vp-svc span { padding: 12px 18px; border-radius: 30px; background: rgba(255, 255, 255, 0.65); font-family: 'Geist', sans-serif; font-size: 17px; }

.vp-three { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.4vw; }
.vp-panel { display: flex; flex-direction: column; gap: 1.4vh; padding: 14px 14px 30px; border-radius: 28px; background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(13, 35, 64, 0.08); }
.vp-panel img, .vp-panel-m { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 18px; margin-bottom: 2vh; }
.vp-panel-m { display: grid; place-items: center; background: #dce9f6; }
.vp-panel-m svg { width: 80%; }
.vp-panel em, .vp-panel b, .vp-panel small { margin: 0 12px; }
.vp-panel em { font-style: normal; font-family: 'Geist Mono', monospace; font-size: 14px; color: #ff6a1a; }
.vp-panel b { font-family: var(--font-display); font-weight: 400; font-size: clamp(22px, 2vw, 36px); letter-spacing: -0.045em; }
.vp-panel small { font-family: 'Geist', sans-serif; font-size: 17px; opacity: 0.72; }

/* 4 · steps */
.vp-how { position: relative; padding: 12vh 5vw 8vh; color: #0d2340; }
.vp-how ol { list-style: none; margin: 6vh 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2vw; }
.vp-how li { display: flex; flex-direction: column; gap: 2.4vh; opacity: 0.35; transition: opacity 0.6s ease; }
.vp-how li.on { opacity: 1; }
.vp-how li em { width: 64px; height: 64px; display: grid; place-items: center; border-radius: 50%; border: 1.5px solid #0d2340; font-style: normal; font-family: var(--font-display); font-size: 22px; background: transparent; transition: background 0.5s ease, color 0.5s ease, border-color 0.5s ease; }
.vp-how li.on em { background: #0d2340; color: #fff; }
.vp-how li b { text-wrap: balance; font-family: var(--font-display); font-weight: 400; font-size: clamp(20px, 1.8vw, 32px); letter-spacing: -0.045em; line-height: 1.1; }
.vp-rail { display: block; height: 2px; margin-top: 5vh; background: rgba(13, 35, 64, 0.12); }
.vp-rail u { display: block; height: 100%; background: linear-gradient(90deg, #0d2340, #ff6a1a); transform-origin: 0 0; }
.vp-facts { display: flex; gap: 6vw; margin: 9vh 0 0; }
.vp-facts dt { font-family: var(--font-display); font-size: clamp(34px, 3.6vw, 68px); letter-spacing: -0.05em; line-height: 1; }
.vp-facts dd { margin: 1.2vh 0 0; font-family: 'Geist', sans-serif; font-size: 18px; opacity: 0.7; }

/* 5 · ask */
.vp-ask { display: flex; flex-direction: column; align-items: flex-start; gap: 3vh; padding: 14vh 5vw 6vh; color: #0d2340; }
.vp-ask h2 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(38px, 6vw, 116px); line-height: 1; letter-spacing: -0.055em; }
.vp-ask .ps-pill { padding: 16px 24px; font-size: 12px; }

@media (max-width: 900px) {
  .vp-intro { grid-template-columns: 1fr; gap: 6vh; padding-top: 12vh; }
  .vp-tagpt { display: none; } /* the crop no longer matches the tagged points */
  .vp-photo img { object-position: var(--fx) 50%; }
  .vp-meta { display: none; }
  .vp-band { height: 44vh; margin: 0 4vw; }
  .vp-two, .vp-tests, .vp-cols, .vp-care, .vp-three { grid-template-columns: 1fr; gap: 16px; }
  .vp-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
  .vp-test, .vp-col, .vp-card { padding: 22px; }
  .vp-seal { width: 60vw; }
  .vp-how ol { grid-template-columns: 1fr 1fr; gap: 5vh 6vw; }
  .vp-guides { grid-template-columns: 1fr; gap: 12px; }
  .vp-links a { grid-template-columns: 1fr 14px; gap: 6px 12px; }
  .vp-links span { grid-row: 2; }
  .vp-links svg { grid-row: 1 / span 2; grid-column: 2; }
}
</style>
