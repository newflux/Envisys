<template>
  <section class="bs-root" ref="rootRef">
    <p class="bs-text">
      <span v-for="(w, i) in words" :key="i" class="bs-w" :class="{ 'bs-lead': i < 3 }">{{ w }}</span>
    </p>

    <div class="bs-images">
      <figure v-for="(im, i) in images" :key="im.src" class="bs-fig" :ref="(el) => (figEls[i] = el as HTMLElement)">
        <img :src="im.src" :style="{ objectPosition: im.pos }" alt="" />
        <figcaption>{{ im.caption }}</figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const copy = 'How we build. Every Envisys chamber is engineered, built and tested in Bengaluru, then put to work in automotive, electronics, defence and aerospace labs, with partners in the USA and the UK.'
const words = copy.split(' ')
// Photos from the Envisys shoot (public/images/imgs), resized to public/media
const images = [
  { src: '/media/floor.jpg', pos: '50% 50%', caption: 'The test floor' },
  { src: '/media/eye.jpg', pos: '60% 45%', caption: 'Every detail watched' }
]

const figEls: HTMLElement[] = []

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number) => a * a * (3 - 2 * a)

const rootRef = ref<HTMLElement | null>(null)
function tick() {
  const H = window.innerHeight
  const rr = rootRef.value?.getBoundingClientRect()
  if (!rr || rr.bottom < -100 || rr.top > H + 100) return
  // Silver words light up as they rise past the reading line
  const ws = document.querySelectorAll<HTMLElement>('.bs-w')
  ws.forEach((el, i) => {
    const top = el.getBoundingClientRect().top
    const lit = smooth(clamp01((H * 0.86 - top) / (H * 0.26)))
    el.style.opacity = ((i < 3 ? 0.14 : 0.1) + (i < 3 ? 0.4 : 0.9) * lit).toFixed(3)
  })
  // Images open from a cropped card to full height as they come up; the lower part is
  // cut by the viewport on the way out
  figEls.forEach((fig, i) => {
    if (!fig) return
    const r = fig.getBoundingClientRect()
    if (r.bottom < 0 || r.top > H) return
    const p = 1 - Math.pow(1 - clamp01((H - r.top) / (H * 0.95)), 3)
    const sx = (1 - p) * 11, sb = (1 - p) * 40
    fig.style.clipPath = `inset(0% ${sx.toFixed(2)}% ${sb.toFixed(2)}% ${sx.toFixed(2)}% round ${(6 + (1 - p) * 10).toFixed(1)}px)`
    const img = fig.firstElementChild as HTMLElement
    const k = (r.top + r.height / 2 - H / 2) / H
    img.style.transform = `translate3d(0, ${(k * (i ? -6 : -9)).toFixed(2)}%, 0) scale(${(1.22 - 0.1 * p).toFixed(3)})`
  })
}
onMounted(() => gsap.ticker.add(tick))
onUnmounted(() => gsap.ticker.remove(tick))
</script>

<style scoped>
.bs-root { padding: 24vh 0 4vh; color: #fff; }
.bs-text {
  margin: 0;
  max-width: 86vw;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(22px, 2.7vw, 50px);
  line-height: 1.12;
  letter-spacing: -0.04em;
}
/* Silvered type: each word carries its own light-to-grey gradient */
.bs-w {
  display: inline-block;
  margin-right: 0.26em;
  background: linear-gradient(180deg, #f6f9fc 10%, #8e9aa7 105%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.bs-lead { filter: saturate(0.2) brightness(0.8); }

.bs-images { margin-top: 14vh; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.bs-fig { position: relative; margin: 0; height: 90vh; overflow: hidden; background: #0c0c0e; will-change: clip-path; }
.bs-fig img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.bs-fig figcaption { position: absolute; left: 24px; bottom: 28vh; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #fff; text-shadow: 0 1px 12px rgba(0, 0, 0, 0.6); }

@media (max-width: 800px) { .bs-images { grid-template-columns: 1fr; } .bs-fig { height: 90vh; } }
</style>
