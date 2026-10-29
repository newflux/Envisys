<template>
  <!-- About Envisys, paced like a manifesto: short statements lit as they pass, black to white through a cold glow.
       Every fact is from envisystech.com (about-us, contact-us, products); team names are placeholders. -->
  <div class="ab-root" :class="{ ready }">
    <div id="scroller" class="layout" ref="scrollerRef">
      <main class="layout__page" ref="pageRef">
        <div class="ab-cover">

          <!-- 1 · the hero holds still while the black slides up over it -->
          <div class="ab-intro">
            <section class="ab-hero">
              <img class="ab-hero-img" src="/media/step-8.jpg" alt="" />
              <div class="ab-hero-shade"></div>
              <h1 class="ab-h1">
                <span v-for="(l, i) in heroLines" :key="i" class="ab-mask"><i :style="{ '--d': 0.5 + i * 0.12 + 's' }">{{ l }}</i></span>
              </h1>
              <button class="ab-down" aria-label="Scroll down" data-cursor="" @click="scrollDown"><svg viewBox="0 0 10 12"><path d="M5 1v10M1 7l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.2" /></svg></button>
            </section>

            <div class="ab-dark">
              <div class="ab-ruler" aria-hidden="true">
                <div class="ab-tape" ref="tapeRef"></div>
                <span class="ab-readout" ref="readRef">0%</span>
              </div>
              <template v-for="(b, i) in beats" :key="i">
                <section class="ab-beat" :class="{ 'ab-beat-img': b.img }" :data-bgsec="b.img ? '' : undefined">
                  <img v-if="b.img" class="ab-beat-bg" :src="b.img" alt="" />
                  <p class="ab-say" data-say><template v-for="(w, j) in b.t.split(' ')" :key="j"><span class="ab-w">{{ w }}</span>{{ ' ' }}</template></p>
                </section>
                <AboutBuilding v-if="i === 0" />
              </template>
            </div>
          </div>

          <!-- 2 · what we make -->
          <section class="ab-who lt">
            <h2 class="ab-h2 rv">Built for every kind of stress.</h2>
            <div class="ab-frame" ref="frameRef" aria-hidden="true">
              <i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i>
              <div class="ab-frame-img" ref="frameImgRef"><img src="/media/step-4.jpg" alt="" /></div>
              <span class="ab-frame-cap">Envisys · test chamber</span>
            </div>
            <div class="ab-two">
              <span class="ab-label rv">What we make</span>
              <div class="ab-paras">
                <p class="rv">Environmental, thermal shock, altitude, salt spray and walk-in chambers, holding 10 to 95% RH to &plusmn;1&deg;C.</p>
                <p class="rv" style="--d: 0.08s">Standard sizes from 150 to 3000 litres, or built to your specification, and serviced by the people who built them.</p>
              </div>
            </div>
          </section>

          <!-- 3 · three lines, lit one after another -->
          <section class="ab-beat dk">
            <p class="ab-say" data-say><template v-for="(l, i) in slogan" :key="i"><template v-for="(w, j) in l.split(' ')" :key="j"><span class="ab-w">{{ w }}</span>{{ ' ' }}</template><br /></template></p>
          </section>

          <!-- 4 · black to white through a cold glow -->
          <section class="ab-glow" ref="glowRef">
            <div class="ab-glow-in">
              <canvas class="ab-wave" ref="waveRef"></canvas>
              <div class="ab-glow-txt" ref="glowTxtRef">
              <p class="ab-glow-t">We are Envisys.<br />Test without limits.</p>
              <button class="ab-pill" :class="{ light: glowLight }" v-magnetic="0.2" data-cursor="BUILD" @click="contactOpen = true">
                <span>Build w/ Envisys</span>
                <svg viewBox="0 0 10 10"><path d="M1 9L9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.3" /></svg>
              </button>
              </div>
            </div>
          </section>

          <!-- 5 · the work, as a bento -->
          <section class="ab-mosaic lt">
            <div class="ab-bento">
              <figure v-for="t in tiles" :key="t.img" class="ab-clip ab-bt" :style="{ gridColumn: `${t.c} / span ${t.w}`, gridRow: `${t.r} / span ${t.h}` }" data-cursor="">
                <img :src="t.img" alt="" loading="lazy" />
                <figcaption><i>+</i>{{ t.cap }}</figcaption>
              </figure>
            </div>
          </section>

          <!-- 6 · the floor -->
          <figure class="ab-fig" ref="figRef">
            <div class="ab-fig-in" ref="figInRef">
              <img src="/media/step-7.jpg" alt="Assembly on the Envisys factory floor" ref="figImgRef" />
              <div class="ab-cap"><span>Manufacturing unit</span><span>Peenya Industrial Estate, Bengaluru</span></div>
            </div>
          </figure>

          <!-- 7 · vision, lit grey to black -->
          <section class="ab-quote lt">
            <p class="ab-say" data-say><template v-for="(w, i) in visionWords" :key="i"><span class="ab-w">{{ w }}</span>{{ ' ' }}</template></p>
            <span class="rv">Our vision</span>
          </section>

          <!-- 8 · numbers, people, reach -->
          <section class="ab-sheet lt">
            <div class="ab-split">
              <span class="ab-label rv">The numbers</span>
              <div class="ab-statgrid">
                <div v-for="(s, i) in stats" :key="s.label" class="ab-stat rv" :style="{ '--d': (i % 2) * 0.08 + 's' }" :data-count="i">
                  <span>{{ s.label }}</span>
                  <b>{{ s.text ?? nums[i] }}<em>{{ s.suffix }}</em></b>
                </div>
              </div>
            </div>

            <div class="ab-split">
              <span class="ab-label rv">Certified</span>
              <ul class="ab-certs">
                <li v-for="(c, i) in certs" :key="c.n" class="rv" :style="{ '--d': i * 0.07 + 's' }"><b>{{ c.n }}</b><span>{{ c.d }}</span></li>
              </ul>
            </div>
          </section>

          <!-- 9 · directors, with the team photo to come -->
          <AboutDirectors />

          <!-- 10 · the map: Peenya, Bengaluru, India, the world -->
          <AboutMap />

          <!-- 11 · the two units, as doors -->
          <section class="ab-units dk">
            <a v-for="u in units" :key="u.t" class="ab-utile ab-clip" data-cursor="" href="/contact">
              <img :src="u.img" :alt="u.t" loading="lazy" />
              <span class="ab-glass">{{ u.t }} <i>→</i></span>
              <address>{{ u.addr }}</address>
            </a>
          </section>
        </div>

        <SiteFooter @build="contactOpen = true" />
      </main>
    </div>

    <Navbar ref="navbarRef" @build-click="contactOpen = true" />
    <ScrollBar />
    <ContactPanel :open="contactOpen" @close="contactOpen = false" />
    <ReticleCursor />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import Lenis from 'lenis'
import Navbar from '../components/Navbar.vue'
import ScrollBar from '../components/ScrollBar.vue'
import ContactPanel from '../components/ContactPanel.vue'
import ReticleCursor from '../components/ReticleCursor.vue'
import SiteFooter from '../components/SiteFooter.vue'
import AboutBuilding from '../components/AboutBuilding.vue'
import AboutDirectors from '../components/AboutDirectors.vue'
import AboutMap from '../components/AboutMap.vue'
import { vMagnetic } from '../utils/magnetic'

const heroLines = ['Test chambers, built', 'end to end in Bengaluru.']
const beats = [
  { t: 'Envisys is run by engineers and managers with over forty years of combined experience in environmental test chambers.' },
  { t: 'Our mission: to design, manufacture and supply reliable test chambers, together with our clients.' },
  { t: 'So we build every one end to end, in Bengaluru. Our own R&D centre. Our own test lab.', img: '/media/step-2.jpg' }
]
const slogan = ['Integrity, first.', 'Clients, always.', 'Results, together.']
const visionWords = '“Our vision is to be the most preferred brand, and the supplier of choice, in every industry we serve.”'.split(' ')

// A bento on a 12-column grid: c/r are the start column and row, w/h the spans. Captions say only what the photo shows.
const tiles = [
  { img: '/media/step-1.jpg', cap: 'Brazing', c: 1, w: 5, r: 1, h: 4 }, { img: '/media/step-3.jpg', cap: 'Control panel', c: 6, w: 3, r: 1, h: 2 },
  { img: '/media/industry-aerospace.jpg', cap: 'Aerospace', c: 9, w: 4, r: 1, h: 3 }, { img: '/media/step-6.jpg', cap: 'Air line', c: 6, w: 3, r: 3, h: 2 },
  { img: '/media/eye.jpg', cap: 'Detail', c: 9, w: 4, r: 4, h: 2 }, { img: '/media/step-2.jpg', cap: 'Refrigeration', c: 1, w: 3, r: 5, h: 4 },
  { img: '/media/floor.jpg', cap: 'Test floor', c: 4, w: 5, r: 5, h: 2 }, { img: '/media/step-5.jpg', cap: 'Controls', c: 9, w: 4, r: 6, h: 3 },
  { img: '/media/step-4.jpg', cap: 'Gauge', c: 4, w: 3, r: 7, h: 2 }, { img: '/media/industry-automotive.jpg', cap: 'Automotive', c: 7, w: 2, r: 7, h: 2 }
]

// Every figure is from envisystech.com. "40+" is the founders' combined experience, not the company's age.
const stats: { to?: number; suffix?: string; text?: string; label: string }[] = [
  { to: 40, suffix: '+', label: 'Years of combined experience' },
  { to: 16, label: 'Product categories' },
  { to: 24, suffix: ' h', label: 'To respond to a client complaint' },
  { text: '150–3000', suffix: ' L', label: 'Standard chamber volumes' }
]
const nums = reactive(stats.map(() => 0))

const units = [
  { t: 'Manufacturing unit', img: '/media/step-1.jpg', addr: 'SB-58, 2nd Cross Road, 1st Stage, Peenya Industrial Estate, Bengaluru 560058' },
  { t: 'Testing service unit', img: '/media/step-8.jpg', addr: 'SB-118, 3rd Cross Road, 1st Stage, Peenya Industrial Estate, Bengaluru 560058' }
]

const certs = [
  { n: 'ISO 9001:2015', d: 'Quality management' },
  { n: 'ISO 14001:2015', d: 'Environmental management' },
  { n: 'ISO 45001:2018', d: 'Health and safety at work' },
  { n: 'CE', d: 'European conformity' }
]

const ready = ref(false)
const contactOpen = ref(false)
const glowLight = ref(false)
const scrollerRef = ref<HTMLElement | null>(null)
const pageRef = ref<HTMLElement | null>(null)
const navbarRef = ref<any>(null)
const tapeRef = ref<HTMLElement | null>(null)
const readRef = ref<HTMLElement | null>(null)
const waveRef = ref<HTMLCanvasElement | null>(null)
const glowTxtRef = ref<HTMLElement | null>(null)
let beatImgSec: HTMLElement | null = null
let beatImg: HTMLElement | null = null
const frameRef = ref<HTMLElement | null>(null)
const frameImgRef = ref<HTMLElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)
const figRef = ref<HTMLElement | null>(null)
const figInRef = ref<HTMLElement | null>(null)
const figImgRef = ref<HTMLElement | null>(null)

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number) => a * a * (3 - 2 * a)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

let says: { el: HTMLElement; words: HTMLElement[]; last: number }[] = []
let darkEl: HTMLElement | null = null
let clips: { el: HTMLElement; last: number }[] = []

// Everything here is tied to the scroll position, so it moves with the wheel instead of firing once.
function tick() {
  const H = window.innerHeight
  const visible = (r: DOMRect) => r.bottom > -H * 0.2 && r.top < H * 1.2

  // the ruler's tape runs with the page and its readout counts the dark section's progress
  if (darkEl) {
    const dr = darkEl.getBoundingClientRect()
    if (dr.bottom > 0 && dr.top < H) {
      const p = clamp01(-dr.top / (dr.height - H))
      tapeRef.value!.style.transform = `translate3d(0, ${(-(p * 1800) % 18).toFixed(1)}px, 0)`
      readRef.value!.textContent = `${Math.round(p * 100)}%`
    }
  }

  // statements light word by word, left to right, as they rise from the lower third to the middle
  for (const s of says) {
    const r = s.el.getBoundingClientRect()
    if (!visible(r)) continue
    const p = clamp01((H * 0.88 - (r.top + r.height / 2)) / (H * 0.4))
    if (Math.abs(p - s.last) < 0.002) continue
    s.last = p
    const n = s.words.length
    for (let i = 0; i < n; i++) s.words[i].style.opacity = (0.18 + 0.82 * smooth(clamp01((p * (n + 4) - i) / 4))).toFixed(3)
  }

  // the background picture behind the third statement fades up and drifts
  if (beatImgSec) {
    const r = beatImgSec.getBoundingClientRect()
    if (visible(r)) {
      const p = clamp01((H - r.top) / (r.height + H))
      const img = beatImg!
      img.style.opacity = (0.55 * smooth(clamp01(p * 2.4 - 0.3)) * (1 - smooth(clamp01(p * 3 - 2)))).toFixed(3)
      img.style.transform = `translate3d(0, ${((0.5 - p) * 16).toFixed(2)}%, 0) scale(1.15)`
    }
  }

  // the picture in the frame grows from a sliver to fill it
  const fr = frameRef.value!.getBoundingClientRect()
  if (visible(fr)) {
    const e = smooth(clamp01((H * 0.95 - fr.top) / (H * 0.65)))
    frameImgRef.value!.style.clipPath = `inset(${lerp(48, 0, e).toFixed(2)}% ${lerp(30, 0, e).toFixed(2)}% round 2px)`
    frameImgRef.value!.style.transform = `scale(${lerp(1.18, 1, e).toFixed(4)})`
  }

  // the preloader's smoke wave rises from the bottom (leaning toward the cursor) until the page is light;
  // the type turns from white to ink as the wave reaches it
  const gr = glowRef.value!.getBoundingClientRect()
  if (visible(gr)) {
    const p = clamp01(-gr.top / (gr.height - H))
    wp += (smooth(clamp01((p - 0.12) / 0.7)) - wp) * 0.12
    mx += (mxT - mx) * 0.06
    drawWave(window.innerWidth, H)
    const k = smooth(clamp01((waveAlpha(0.5, 0.5) - 0.3) / 0.4))
    const c = Math.round(lerp(243, 10, k))
    glowTxtRef.value!.style.color = `rgb(${c}, ${c}, ${Math.round(lerp(250, 12, k))})`
    glowTxtRef.value!.style.opacity = (smooth(clamp01(p * 5)) * (1 - smooth(clamp01((p - 0.9) / 0.1)))).toFixed(3)
    glowLight.value = k > 0.5
  }

  // photos uncover from the bottom up as they rise into view, with the picture settling inside
  for (const c of clips) {
    const r = c.el.getBoundingClientRect()
    if (!visible(r)) continue
    const e = smooth(clamp01((H * 1.02 - r.top) / (H * 0.45)))
    if (Math.abs(e - c.last) < 0.002) continue
    c.last = e
    c.el.style.clipPath = `inset(${((1 - e) * 100).toFixed(2)}% 0 0 0 round 12px)`
    c.el.style.setProperty('--s', lerp(1.22, 1, e).toFixed(4))
  }

  // the factory picture opens from a small framed card to the full width while it scrolls in
  const fg = figRef.value!.getBoundingClientRect()
  if (visible(fg)) {
    const e = smooth(clamp01((H - fg.top) / (H * 0.9)))
    const iy = (14 * (1 - e)).toFixed(2), ix = (18 * (1 - e)).toFixed(2)
    figInRef.value!.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${(22 * (1 - e)).toFixed(1)}px)`
    figImgRef.value!.style.transform = `scale(${(1.25 - 0.25 * e).toFixed(4)})`
  }
}

// ── Smoke wave: same shader and parameters as the preloader and the testimonials hand-over, in the light colour ──
let gl: WebGLRenderingContext | null = null
let uLoc: Record<string, WebGLUniformLocation | null> = {}
let wp = 0, mx = 0, mxT = 0, lastDraw = ''
const waveParams = () => ({ amp: 1.3 - 1.0 * wp, offset: -2.8 + 5.9 * wp, shift: mx * 0.35 })
function waveAlpha(x: number, y: number) {
  const { amp, offset, shift } = waveParams()
  const sy = 0.5 + (y - 0.5) * 1.3
  const waveY = 0.5 + Math.sin((x + shift) * -0.5 * Math.PI * 2) * amp + offset
  const t = clamp01((waveY - sy + 1) / 2.5)
  return t * t * (3 - 2 * t)
}
function initWave() {
  const c = waveRef.value
  gl = c?.getContext('webgl', { alpha: true, premultipliedAlpha: false }) ?? null
  if (!gl || !c) return
  const vs = 'attribute vec2 position; varying vec2 vUv; void main(){ vUv = position * 0.5 + 0.5; gl_Position = vec4(position, 0.0, 1.0); }'
  const fs = `precision mediump float;
    varying vec2 vUv;
    uniform float uAmplitude, uOffsetY, uShift;
    uniform vec3 uColor;
    void main() {
      float scaledY = 0.5 + (vUv.y - 0.5) * 1.3;
      float wave = sin((vUv.x + uShift) * -0.5 * 3.14159265 * 2.0) * uAmplitude;
      float dist = 0.5 + wave + uOffsetY - scaledY;
      float alpha = smoothstep(-1.0, 1.5, dist);
      gl_FragColor = vec4(uColor, alpha);
    }`
  const sh = (type: number, src: string) => { const o = gl!.createShader(type)!; gl!.shaderSource(o, src); gl!.compileShader(o); return o }
  const prog = gl.createProgram()!
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs))
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs))
  gl.linkProgram(prog)
  gl.useProgram(prog)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
  const a = gl.getAttribLocation(prog, 'position')
  gl.enableVertexAttribArray(a)
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0)
  for (const n of ['uAmplitude', 'uOffsetY', 'uShift', 'uColor']) uLoc[n] = gl.getUniformLocation(prog, n)
  gl.uniform3f(uLoc.uColor, 0.957, 0.957, 0.949)
}
function drawWave(W: number, H: number) {
  const c = waveRef.value
  if (!gl || !c) return
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  const cw = Math.round(W * dpr), ch = Math.round(H * dpr)
  const key = `${wp.toFixed(4)}|${mx.toFixed(3)}|${cw}x${ch}`
  if (key === lastDraw) return
  lastDraw = key
  if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch; gl.viewport(0, 0, cw, ch) }
  const { amp, offset, shift } = waveParams()
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.uniform1f(uLoc.uAmplitude, amp)
  gl.uniform1f(uLoc.uOffsetY, offset)
  gl.uniform1f(uLoc.uShift, shift)
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}
const scrollDown = () => lenis?.scrollTo(window.innerHeight)
const onMove = (e: PointerEvent) => { mxT = e.clientX / window.innerWidth - 0.5 }

let lenis: Lenis | null = null
let io: IntersectionObserver | null = null
const lenisTick = (time: number) => lenis?.raf(time * 1000)

onMounted(() => {
  document.title = 'About · Envisys Technologies'
  lenis = new Lenis({ wrapper: scrollerRef.value!, content: pageRef.value!, eventsTarget: window, lerp: 0.075, smoothWheel: true })
  ;(window as any).lenisInstance = lenis
  gsap.ticker.add(lenisTick)

  const page = pageRef.value!
  says = Array.from(page.querySelectorAll<HTMLElement>('[data-say]')).map((el) => ({ el, words: Array.from(el.querySelectorAll<HTMLElement>('.ab-w')), last: -1 }))
  darkEl = page.querySelector<HTMLElement>('.ab-dark')
  initWave()
  window.addEventListener('pointermove', onMove, { passive: true })
  beatImgSec = page.querySelector<HTMLElement>('[data-bgsec]')
  beatImg = beatImgSec?.querySelector<HTMLElement>('.ab-beat-bg') ?? null
  clips = Array.from(page.querySelectorAll<HTMLElement>('.ab-clip')).map((el) => ({ el, last: -1 }))
  gsap.ticker.add(tick)

  // small type rises in once, as it first comes into view; the numbers count up with it
  io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue
      const el = en.target as HTMLElement
      el.classList.add('in')
      io!.unobserve(el)
      const i = el.dataset.count
      if (i !== undefined && stats[+i].to !== undefined) {
        const o = { v: 0 }
        gsap.to(o, { v: stats[+i].to!, duration: 1.8, delay: 0.15, ease: 'power3.out', onUpdate: () => (nums[+i] = Math.round(o.v)) })
      }
    }
  }, { threshold: 0.15 })
  page.querySelectorAll('.rv').forEach((el) => io!.observe(el))

  ready.value = true
  gsap.delayedCall(0.2, () => navbarRef.value?.animIn?.())
})

onUnmounted(() => {
  gsap.ticker.remove(lenisTick)
  gsap.ticker.remove(tick)
  window.removeEventListener('pointermove', onMove)
  io?.disconnect()
  lenis?.destroy()
})
</script>

<style scoped>
.ab-root { --lt: #f4f4f2; --ink: #0a0a0c; --ease: cubic-bezier(0.2, 0.9, 0.2, 1); position: fixed; inset: 0; background: #000; color: #f3f6fa; }
#scroller { background: #000 !important; }
/* the logo stays legible over the white sections */
.ab-root :deep(.Header_brandLogo__AXo7t) { mix-blend-mode: difference; }
.layout__page { position: relative; }

/* the cover lifts off the footer (see SiteFooter); clip, not hidden, so sticky children still stick */
.ab-cover { position: relative; z-index: 2; background: var(--lt); border-radius: 0 0 40px 40px; box-shadow: 0 40px 80px rgba(0, 0, 0, 0.55); overflow: clip; }
.ab-cover > section { position: relative; }
.lt { background: var(--lt); color: var(--ink); }
.dk { background: #000; color: #f3f6fa; }

.rv { opacity: 0; transform: translateY(24px); transition: opacity 1s ease var(--d, 0s), transform 1.2s var(--ease) var(--d, 0s); }
.rv.in { opacity: 1; transform: none; }
.ab-label { display: block; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.6; }
/* a small label on the left, the content on the right, like a spec sheet */
.ab-split { display: grid; grid-template-columns: 1fr 2fr; gap: 2vw; padding: 3vh 5vw 0; border-top: 1px solid rgba(10, 10, 12, 0.12); margin: 0 0 22vh; }
.ab-split:first-child { border-top: 0; }

/* 1 · hero, pinned under the black */
.ab-intro { position: relative; background: #000; }
.ab-hero { position: sticky; top: 0; z-index: 0; height: 100vh; overflow: hidden; background: #08090c; }
.ab-hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; animation: ab-settle 2.6s var(--ease) both; }
/* a slight zoom that eases back to the true frame as the page loads */
@keyframes ab-settle { from { scale: 1.07; } }
.ab-hero-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0, 0, 0, 0.22) 0, transparent 22%, transparent 70%, rgba(0, 0, 0, 0.55) 100%); }
.ab-h1 { position: absolute; left: 2.2vw; right: 5vw; bottom: 5vh; margin: 0; display: flex; flex-direction: column; font-family: var(--font-display); font-weight: 400; font-size: clamp(18px, 2vw, 38px); line-height: 1.08; letter-spacing: -0.05em; color: #fff; }
.ab-mask { display: block; overflow: hidden; padding-bottom: 0.1em; margin-bottom: -0.1em; }
.ab-mask i { display: block; font-style: normal; transform: translateY(108%); }
.ready .ab-mask i { animation: ab-up 1.3s var(--ease) var(--d) forwards; }
@keyframes ab-up { to { transform: none; } }
.ab-down { position: absolute; right: 2.2vw; bottom: 5vh; width: 78px; height: 48px; display: grid; place-items: center; border: 0; border-radius: 8px; background: rgba(228, 228, 226, 0.88); color: #0a0a0c; cursor: pointer; transition: background 0.4s ease; }
.ab-down:hover { background: #fff; }
.ab-down svg { width: 10px; height: 12px; transition: transform 0.5s var(--ease); }
.ab-down:hover svg { transform: translateY(3px); }

/* statements: small, centred, one per screen, lit as they pass */
.ab-dark { position: relative; z-index: 1; overflow: clip; background: #000; padding-top: 8vh; }
/* a thermometer's scale down the left edge: the tape runs with the page, the readout climbs from -70 to +180 */
.ab-ruler { position: sticky; top: 0; height: 100vh; margin: -30vh 0 -70vh; pointer-events: none; z-index: 2; mask-image: linear-gradient(180deg, transparent, #000 18%, #000 82%, transparent); -webkit-mask-image: linear-gradient(180deg, transparent, #000 18%, #000 82%, transparent); }
.ab-tape { position: absolute; left: 2.2vw; top: -20px; bottom: -20px; width: 16px; background: repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0 1px, transparent 1px 18px) left / 8px 100% no-repeat, repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0 1px, transparent 1px 90px) left / 16px 100% no-repeat; will-change: transform; }
.ab-readout { position: absolute; left: calc(2.2vw + 40px); top: 50%; translate: 0 -50%; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.14em; color: rgba(255, 255, 255, 0.85); font-variant-numeric: tabular-nums; }
.ab-readout::before { content: ''; position: absolute; left: -30px; top: 50%; width: 24px; height: 1px; background: #ff6a1a; }
.ab-beat { position: relative; z-index: 1; min-height: 80vh; display: grid; place-items: center; padding: 0 5vw; overflow: hidden; }
.ab-beat.dk { min-height: 105vh; }
.ab-beat-img { min-height: 140vh; }
.ab-beat-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; filter: grayscale(1) contrast(1.15); will-change: transform, opacity; mask-image: linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent); -webkit-mask-image: linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent); }
.ab-say { position: relative; margin: 0; max-width: 23em; text-align: center; font-family: var(--font-display); font-weight: 400; font-size: clamp(18px, 1.9vw, 34px); line-height: 1.22; letter-spacing: -0.045em; }
.ab-w { opacity: 0.18; }

/* 2 · what we make */
.ab-who { padding: 20vh 5vw 18vh; text-align: center; }
.ab-h2 { margin: 0; text-align: center; font-family: var(--font-display); font-weight: 400; font-size: clamp(18px, 1.8vw, 32px); line-height: 1.1; letter-spacing: -0.045em; }
.ab-frame { position: relative; width: min(34vw, 520px); aspect-ratio: 1.6; margin: 7vh auto 12vh; border: 1px solid rgba(10, 10, 12, 0.12); background: repeating-linear-gradient(90deg, rgba(10, 10, 12, 0.06) 0 1px, transparent 1px 25%); }
.ab-frame-img { position: absolute; inset: 10% 12%; overflow: hidden; will-change: clip-path, transform; }
.ab-frame-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ab-frame i { position: absolute; width: 9px; height: 9px; background: var(--lt); border: 1px solid rgba(10, 10, 12, 0.35); }
.ab-frame .tl { left: -5px; top: -5px; } .ab-frame .tr { right: -5px; top: -5px; } .ab-frame .bl { left: -5px; bottom: -5px; } .ab-frame .br { right: -5px; bottom: -5px; }
.ab-frame-cap { position: absolute; left: 0; right: 0; text-align: center; top: calc(100% + 12px); font-family: var(--font-body); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.45; }
.ab-two { display: flex; flex-direction: column; align-items: center; gap: 3vh; }
.ab-paras { max-width: 30em; margin: 0 auto; }
.ab-paras p { margin: 0 0 2.4vh; font-family: var(--font-body); font-size: clamp(12px, 0.9vw, 14px); line-height: 1.7; }

/* 3 · slogan */
.ab-beat.dk .ab-say { font-size: clamp(22px, 2.6vw, 48px); line-height: 1.15; }

/* 4 · black to light on the preloader's smoke wave; below the pinned stage the page is already light */
.ab-glow { height: 280vh; background: linear-gradient(180deg, #000 0, #000 calc(100% - 100vh), var(--lt) calc(100% - 100vh)); }
.ab-glow-in { position: sticky; top: 0; height: 100vh; }
.ab-wave { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.ab-glow-txt { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5vh; text-align: center; opacity: 0; will-change: opacity; }
.ab-glow-t { margin: 0; font-family: var(--font-display); font-size: clamp(22px, 2.5vw, 46px); line-height: 1.15; letter-spacing: -0.045em; }
.ab-pill { position: relative; overflow: hidden; isolation: isolate; display: inline-flex; align-items: center; gap: 16px; padding: 18px 30px; border: 0; border-radius: 40px; background: rgba(255, 255, 255, 0.92); color: #0b1b33; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: background 0.6s ease, color 0.6s ease; }
.ab-pill.light { background: var(--ink); color: #fff; }
.ab-pill::before { content: ''; position: absolute; inset: 0; z-index: -1; background: #cfe3f6; transform: translateY(101%); transition: transform 0.5s var(--ease); }
.ab-pill.light::before { background: #2a2c31; }
.ab-pill:hover::before { transform: none; }
.ab-pill svg { width: 11px; height: 11px; transition: transform 0.4s var(--ease); }
.ab-pill:hover svg { transform: translate(3px, -3px); }

/* uncovering photos: the frame is clipped by the scroll, the picture settles from --s */
.ab-clip { clip-path: inset(100% 0 0 0); will-change: clip-path; }
.ab-clip img { transform: scale(var(--s, 1.2)); transition: filter 0.6s ease; }

/* 5 · the work, as a bento: tiles of different sizes, tight gaps, a caption that rises on hover */
.ab-mosaic { padding: 6vh 2.2vw 24vh; }
.ab-bento { display: grid; grid-template-columns: repeat(12, 1fr); grid-auto-rows: 5.6vw; gap: 0.7vw; }
.ab-bt { position: relative; margin: 0; overflow: hidden; background: #dcdcd8; }
.ab-bt img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 1.3s var(--ease), filter 0.6s ease; }
.ab-bt:hover img { transform: scale(1.06); filter: brightness(1.06); }
.ab-bt figcaption { position: absolute; left: 14px; bottom: 12px; display: flex; align-items: center; gap: 8px; padding: 7px 12px 7px 9px; border-radius: 20px; background: rgba(244, 244, 242, 0.88); color: var(--ink); font-family: var(--font-body); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; translate: 0 150%; transition: translate 0.6s var(--ease); }
.ab-bt figcaption i { font-style: normal; display: inline-block; transition: rotate 0.6s var(--ease); }
.ab-bt:hover figcaption { translate: 0 0; }
.ab-bt:hover figcaption i { rotate: 90deg; }

/* 6 · the floor */
.ab-fig { margin: 0; height: 118vh; background: var(--lt); }
.ab-fig-in { position: sticky; top: 0; height: 100vh; overflow: hidden; background: #0c0d10; clip-path: inset(14% 18% 14% 18% round 22px); }
.ab-fig img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform: scale(1.25); }
.ab-cap { position: absolute; left: 5vw; right: 5vw; bottom: 3vh; display: flex; justify-content: space-between; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(243, 246, 250, 0.8); z-index: 2; }

/* 7 · vision */
.ab-quote { padding: 30vh 5vw 30vh; display: flex; flex-direction: column; align-items: center; gap: 5vh; }
.ab-quote .ab-say { max-width: 19em; font-size: clamp(22px, 2.5vw, 46px); line-height: 1.12; }
.ab-quote > span { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.5; }

/* 8 · numbers, people, reach */
.ab-sheet { padding: 0 0 2vh; }
.ab-statgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 8vh 2vw; }
.ab-stat { border-top: 1px solid rgba(10, 10, 12, 0.16); padding-top: 1.4vh; }
.ab-stat span { display: block; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.55; }
.ab-stat b { display: block; margin-top: 2vh; font-family: 'Doto', var(--font-display); font-weight: 600; font-size: clamp(26px, 2.6vw, 50px); line-height: 1; white-space: nowrap; font-variant-numeric: tabular-nums; color: #c4c4bf; transition: color 1.4s ease 0.8s; }
.ab-stat.in b { color: #7d7d78; }
.ab-stat:hover b { color: var(--ink); transition-delay: 0s; transition-duration: 0.4s; }
.ab-stat em { font-style: normal; font-size: 0.42em; }
.ab-certs { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1vw; }
.ab-certs li { padding: 3vh 1.2vw 2.6vh; border: 1px solid rgba(10, 10, 12, 0.12); transition: background 0.5s ease, border-color 0.5s ease, color 0.5s ease, opacity 1s ease var(--d, 0s), transform 1.2s var(--ease) var(--d, 0s); }
.ab-certs li:hover { background: var(--ink); color: #fff; border-color: var(--ink); }
.ab-certs b { display: block; font-family: var(--font-display); font-weight: 400; font-size: clamp(14px, 1.3vw, 22px); letter-spacing: -0.04em; }
.ab-certs span { display: block; margin-top: 1.4vh; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.55; }

/* 9 · the two units, as doors */
.ab-units { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 5vw 8vh; }
.ab-utile { position: relative; display: block; overflow: hidden; border-radius: 10px; aspect-ratio: 1.62; background: #0b1b33; color: #fff; text-decoration: none; }
.ab-utile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ab-utile:hover img { filter: brightness(1.1); }
.ab-glass { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: inline-flex; align-items: center; padding: 26px 48px; border-radius: 34px; background: rgba(40, 46, 56, 0.34); border: 1px solid rgba(255, 255, 255, 0.22); backdrop-filter: blur(18px) saturate(1.3); -webkit-backdrop-filter: blur(18px) saturate(1.3); font-family: var(--font-body); font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap; transition: padding 0.5s var(--ease); }
.ab-glass i { font-style: normal; max-width: 0; opacity: 0; overflow: hidden; transition: max-width 0.5s var(--ease), opacity 0.4s ease, margin 0.5s ease; }
.ab-utile:hover .ab-glass { padding: 26px 40px 26px 48px; }
.ab-utile:hover .ab-glass i { max-width: 24px; opacity: 1; margin-left: 16px; }
.ab-utile address { position: absolute; left: 20px; right: 20px; bottom: 16px; font-style: normal; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; line-height: 1.6; color: rgba(255, 255, 255, 0.75); }

@media (max-width: 900px) {
  .ab-split, .ab-two { grid-template-columns: 1fr; gap: 3vh; }
  .ab-bento { grid-auto-rows: 30vw; grid-template-columns: repeat(2, 1fr); gap: 2vw; }
  .ab-bt { grid-column: auto !important; grid-row: auto !important; }
  .ab-ruler { display: none; }
  .ab-statgrid, .ab-units { grid-template-columns: 1fr; }
  .ab-certs { grid-template-columns: 1fr 1fr; }
  .ab-frame { width: 80vw; }
}
</style>
