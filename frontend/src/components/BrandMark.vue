<template>
  <!-- The Envisys logo as two stacked vector layers with the same viewBox: the ink layer (ENVI and the white block, in the page's
       ink colour so it reads on light and dark) and the blue layer (SYS and two blocks, always the brand blue). Kept apart so the
       header can invert only the ink on light backgrounds. `full` adds the tagline and the (R) mark (the preloader). `mono` draws everything in the one ink colour (the header: white on dark,
       navy on light) by putting the blue shapes into the ink layer too. -->
  <span ref="root" class="lg" :class="{ full }" role="img" aria-label="Envisys, reimagining the environment">
    <svg class="lg-ink" :viewBox="full ? LOGO.viewFull : LOGO.viewNav" aria-hidden="true" focusable="false">
      <defs>
        <clipPath :id="`${uid}-rise`"><rect x="0" y="200" width="2200" :height="LOGO.baseline - 200" /></clipPath>
        <clipPath v-if="full" :id="`${uid}-wipe`"><rect ref="wipeRef" :x="LOGO.tag.bbox[0] - 14" y="575" :width="TAGW" height="130" /></clipPath>
      </defs>
      <g :clip-path="`url(#${uid}-rise)`">
        <path v-for="l in LOGO.ink.letters" :key="l.id" class="lg-l" :d="l.d" />
        <template v-if="mono"><path v-for="l in LOGO.blue.letters" :key="l.id" class="lg-l" :d="l.d" /></template>
      </g>
      <path class="lg-dot" :d="LOGO.ink.dot.d" />
      <template v-if="mono"><path v-for="(dt, i) in LOGO.blue.dots" :key="'m' + i" class="lg-dot" :d="dt.d" /></template>
      <template v-if="full">
        <path class="lg-tag" :d="LOGO.tag.d" :clip-path="`url(#${uid}-wipe)`" />
        <path class="lg-reg" fill-rule="evenodd" :d="LOGO.reg.d" />
      </template>
    </svg>
    <svg v-if="!mono" class="lg-blue" :viewBox="full ? LOGO.viewFull : LOGO.viewNav" aria-hidden="true" focusable="false">
      <defs><clipPath :id="`${uid}-rise-b`"><rect x="0" y="200" width="2200" :height="LOGO.baseline - 200" /></clipPath></defs>
      <g :clip-path="`url(#${uid}-rise-b)`"><path v-for="l in LOGO.blue.letters" :key="l.id" class="lg-l" :d="l.d" /></g>
      <path v-for="(dt, i) in LOGO.blue.dots" :key="i" class="lg-dot" :d="dt.d" />
    </svg>
  </span>
</template>

<script lang="ts">
let count = 0
</script>

<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'
import { LOGO } from '../config/logo'

defineProps<{ full?: boolean; mono?: boolean }>()
const uid = `lgm${++count}`
const root = ref<HTMLElement | null>(null)
const wipeRef = ref<SVGRectElement | null>(null)
const TAGW = LOGO.tag.bbox[2] - LOGO.tag.bbox[0] + 28

/**
 * The reveal: the letters rise from behind the baseline one after another (the site's masked-line reveal, in logo form), the
 * three blocks above the I drop in with a small overshoot, then the tagline wipes in and the (R) settles. Returns the timeline,
 * so the preloader can place it on its own.
 */
function play(delay = 0) {
  const el = root.value
  const q = (s: string) => Array.from(el?.querySelectorAll(s) ?? []) as Element[]
  const tl = gsap.timeline({ delay })
  if (!el) return tl
  const letters = [...q('.lg-ink .lg-l'), ...q('.lg-blue .lg-l')].sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left)
  const dots = [...q('.lg-blue .lg-dot'), ...q('.lg-ink .lg-dot')]
  gsap.killTweensOf([...letters, ...dots])
  tl.fromTo(letters, { y: 380 }, { y: 0, duration: 0.95, ease: 'power4.out', stagger: 0.07, clearProps: 'transform' }, 0)
  tl.fromTo(dots, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(2.6)', stagger: 0.1, clearProps: 'transform' }, 0.6)
  if (wipeRef.value) {
    tl.fromTo(wipeRef.value, { attr: { width: 0 } }, { attr: { width: TAGW }, duration: 0.95, ease: 'power2.inOut' }, 0.75)
    tl.fromTo(q('.lg-reg'), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', clearProps: 'transform' }, 1.15)
  }
  return tl
}

defineExpose({ play, root })
</script>

<style scoped>
.lg { position: relative; display: block; width: 100%; aspect-ratio: 2110 / 536; }
.lg.full { aspect-ratio: 2110 / 640; }
.lg svg { display: block; width: 100%; height: auto; overflow: visible; }
.lg-blue { position: absolute; left: 0; top: 0; }
.lg-ink { fill: var(--logo-ink, #fff); }
.lg-blue { fill: var(--logo-blue, #0a8cff); }
/* the blocks and the (R) scale about their own centres */
.lg-dot, .lg-reg { transform-box: fill-box; transform-origin: center; }
</style>
