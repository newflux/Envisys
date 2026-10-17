<template>
  <section class="bs-root">
    <p class="bs-text">
      <span class="bs-lead">How we build.</span>
      Every Envisys chamber is engineered and manufactured in Bengaluru, then put to work in automotive,
      electronics, defence and aerospace labs, with partners in the USA and the UK.
    </p>

    <div class="bs-images">
      <figure v-for="(im, i) in images" :key="i" class="bs-fig">
        <div class="bs-img" :ref="(el) => (imgRefs[i] = el as HTMLElement)">
          <img v-if="!im.missing" :src="im.src" alt="" @error="im.missing = true" />
          <div v-else class="bs-ph"><span>{{ im.hint }}</span><small>public{{ im.src }}</small></div>
        </div>
        <figcaption>{{ im.caption }}</figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

// Two images: swap in stock or shot photography at these paths.
const images = reactive([
  { src: '/media/build-01.jpg', hint: 'Fabrication', caption: 'Fabrication / Bengaluru', missing: false },
  { src: '/media/build-02.jpg', hint: 'Validation', caption: 'Validation / before dispatch', missing: false }
])
const imgRefs: HTMLElement[] = []

// Subtle parallax: the picture drifts inside its frame as the frame crosses the screen
function tick() {
  const H = window.innerHeight
  imgRefs.forEach((el, i) => {
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.bottom < 0 || r.top > H) return
    const k = (r.top + r.height / 2 - H / 2) / H
    const inner = el.firstElementChild as HTMLElement | null
    if (inner) inner.style.transform = `translate3d(0, ${(k * (i ? -7 : -11)).toFixed(2)}%, 0) scale(1.18)`
  })
}
onMounted(() => gsap.ticker.add(tick))
onUnmounted(() => gsap.ticker.remove(tick))
</script>

<style scoped>
.bs-root { padding: 22vh 0 18vh; color: #fff; }
.bs-text {
  margin: 0;
  max-width: 82vw;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(22px, 2.7vw, 50px);
  line-height: 1.12;
  letter-spacing: -0.04em;
}
.bs-lead { color: rgba(255, 255, 255, 0.42); }

.bs-images { margin-top: 12vh; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.bs-fig { margin: 0; }
.bs-img { position: relative; aspect-ratio: 4 / 4.6; overflow: hidden; border-radius: 6px; background: #0c0c0e; }
.bs-img img, .bs-ph { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.bs-ph {
  display: grid;
  place-content: center;
  text-align: center;
  gap: 10px;
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.06), transparent 40%),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.025) 0 1px, transparent 1px 80px),
    #0d0d10;
}
.bs-ph span { font-family: var(--font-display); font-size: clamp(18px, 1.8vw, 30px); letter-spacing: -0.04em; color: rgba(255, 255, 255, 0.7); }
.bs-ph small { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255, 255, 255, 0.4); }
.bs-fig figcaption { margin-top: 14px; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255, 255, 255, 0.55); }

@media (max-width: 800px) { .bs-images { grid-template-columns: 1fr; } }
</style>
