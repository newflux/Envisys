<template>
  <!-- PLACEHOLDER: names, roles and portraits are not on the company site. Replace the `directors` array and the portrait <img>s. -->
  <section class="ad lt">
    <div class="ad-head">
      <div>
        <span class="ad-label rv"><i>+</i> Leadership</span>
        <h2 class="ad-h rv" style="--d: 0.06s">Directors</h2>
      </div>
      <div class="ad-arrows rv" style="--d: 0.12s">
        <button aria-label="Previous" data-cursor="" @click="go(-1)"><svg viewBox="0 0 8 12"><path d="M7 1L2 6l5 5" fill="none" stroke="currentColor" stroke-width="1.2" /></svg></button>
        <button aria-label="Next" data-cursor="" @click="go(1)"><svg viewBox="0 0 8 12"><path d="M1 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.2" /></svg></button>
      </div>
    </div>

    <div class="ad-track" ref="trackRef" @pointerdown="down" @pointermove="move" @pointerup="up" @pointerleave="up">
      <article v-for="(d, i) in directors" :key="i" class="ad-card rv" :style="{ '--d': i * 0.1 + 's' }">
        <div class="ad-name"><span>{{ d.name }}</span><em>{{ d.role }}</em></div>
        <div class="ad-photo" data-cursor="">
          <svg viewBox="0 0 100 125" aria-hidden="true"><circle cx="50" cy="44" r="17" /><path d="M10 125c0-30 18-46 40-46s40 16 40 46z" /></svg>
          <span>Portrait to come</span>
        </div>
      </article>
    </div>

    <!-- the team photo is the one on envisystech.com (about-us) -->
    <div class="ad-head ad-team">
      <span class="ad-label rv"><i>+</i> The team</span>
    </div>
    <figure class="ad-group rv">
      <img src="/media/team.jpg" alt="The Envisys team" loading="lazy" />
      <figcaption>The Envisys team · Bengaluru</figcaption>
    </figure>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const directors = [
  { name: 'Director name', role: 'Role to be added' },
  { name: 'Director name', role: 'Role to be added' },
  { name: 'Director name', role: 'Role to be added' }
]

const trackRef = ref<HTMLElement | null>(null)
const go = (d: number) => {
  const t = trackRef.value!
  t.scrollBy({ left: d * (t.querySelector('.ad-card') as HTMLElement).offsetWidth, behavior: 'smooth' })
}

// drag the row with the mouse; touch already scrolls it natively
let drag = false, sx = 0, sl = 0
const down = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; drag = true; sx = e.clientX; sl = trackRef.value!.scrollLeft }
const move = (e: PointerEvent) => { if (drag) trackRef.value!.scrollLeft = sl - (e.clientX - sx) }
const up = () => { drag = false }
</script>

<style scoped>
.ad { padding: 22vh 0 24vh; background: var(--lt, #f4f4f2); color: var(--ink, #0a0a0c); overflow: hidden; }
.rv { opacity: 0; transform: translateY(24px); transition: opacity 1s ease var(--d, 0s), transform 1.2s var(--ease, cubic-bezier(0.2, 0.9, 0.2, 1)) var(--d, 0s); }
.rv.in { opacity: 1; transform: none; }
.ad-head { display: flex; justify-content: space-between; align-items: flex-end; padding: 0 5vw; }
.ad-label { display: flex; gap: 10px; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.7; }
.ad-label i { font-style: normal; }
.ad-h { margin: 2.4vh 0 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(30px, 3.6vw, 66px); line-height: 1; letter-spacing: -0.05em; }
.ad-arrows { display: flex; gap: 6px; }
.ad-arrows button { width: 44px; height: 44px; display: grid; place-items: center; border: 0; border-radius: 6px; background: rgba(10, 10, 12, 0.07); color: inherit; cursor: pointer; transition: background 0.4s ease, color 0.4s ease; }
.ad-arrows button:hover { background: var(--ink, #0a0a0c); color: #fff; }
.ad-arrows svg { width: 8px; height: 12px; }

.ad-track { display: flex; gap: 1.2vw; margin-top: 8vh; padding: 0 5vw; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; cursor: grab; }
.ad-track::-webkit-scrollbar { display: none; }
.ad-card { flex: 0 0 31vw; scroll-snap-align: start; user-select: none; }
.ad-name { display: flex; flex-direction: column; gap: 4px; padding: 3px 0 3px 12px; margin-bottom: 3vh; border-left: 1px solid rgba(10, 10, 12, 0.3); font-family: var(--font-body); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; transition: border-color 0.4s ease, padding 0.5s var(--ease, ease); }
.ad-name em { font-style: normal; opacity: 0.45; font-size: 10px; }
.ad-card:hover .ad-name { border-color: #ff6a1a; padding-left: 18px; }
.ad-photo { position: relative; aspect-ratio: 4 / 5; border-radius: 4px; overflow: hidden; background: linear-gradient(180deg, #f1f1ef 0%, #cfcfcd 100%); display: grid; place-items: end start; padding: 14px; }
.ad-photo svg { position: absolute; inset: 14% 12% 0; width: 76%; height: auto; fill: rgba(10, 10, 12, 0.09); transition: fill 0.6s ease, transform 1s var(--ease, ease); }
.ad-card:hover .ad-photo svg { fill: rgba(10, 10, 12, 0.16); transform: translateY(-2%) scale(1.02); }
.ad-photo span { position: relative; font-family: var(--font-body); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.45; }

.ad-team { margin-top: 24vh; }
.ad-group { position: relative; margin: 6vh 5vw 0; border-radius: 12px; overflow: hidden; }
.ad-group img { display: block; width: 100%; height: auto; transition: transform 1.6s var(--ease, ease), filter 0.8s ease; filter: saturate(0.9); }
.ad-group:hover img { transform: scale(1.025); filter: none; }
.ad-group figcaption { position: absolute; left: 20px; bottom: 16px; padding: 8px 14px; border-radius: 30px; background: rgba(10, 10, 14, 0.55); backdrop-filter: blur(8px); color: #fff; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; }

@media (max-width: 800px) {
  .ad-card { flex-basis: 74vw; }
}
</style>
