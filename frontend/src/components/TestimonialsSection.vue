<template>
  <!-- Held for four beats on the products' light blue. One card opens at a time on the right while the others
       fold into bars. The preloader's smoke wave rises from the bottom edge with the scroll (its crest leaning
       toward the cursor) until the page is black; the type turns from ink to silver as the dark reaches it, and the cards swap to their dark-page look. -->
  <section class="ts-root" ref="rootRef">
    <div class="ts-stage" ref="stageRef">
      <canvas class="ts-wave" ref="canvasRef"></canvas>

      <div class="ts-content">
        <div class="ts-bar" ref="barWrapRef"><i ref="barRef"></i></div>
        <div class="ts-trusted" ref="trustedRef">Trusted by industry leaders <span>↓</span></div>

        <h2 class="ts-title">
          <span v-for="(l, i) in titleLines" :key="i" class="ts-line" :ref="(el) => (lineEls[i] = el as HTMLElement)">{{ l }}</span>
        </h2>

        <div class="ts-cards" :class="{ dark: cardsDark }">
          <article v-for="(c, i) in items" :key="c.sector" class="ts-card" :class="{ on: active === i }" @click="jump(i)" data-cursor="OPEN">
            <header>
              <span class="ts-sector">{{ c.sector }}</span>
              <span class="ts-n">0{{ i + 1 }}</span>
            </header>
            <div class="ts-open">
              <div class="ts-inner">
                <blockquote>{{ c.quote }}</blockquote>
                <cite>{{ c.who }}</cite>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { scrollColumnTo } from '../utils/columnScroll'

// PLACEHOLDER copy. Replace each quote and attribution with a real, approved client testimonial before launch.
const items = [
  { sector: 'Automotive', quote: 'Client quote goes here: two sentences on the test programme, the turnaround and the support they got from Envisys.', who: 'NAME, ROLE @COMPANY' },
  { sector: 'Electronics', quote: 'Client quote goes here: what they needed to validate, and how the chamber held the profile through the whole run.', who: 'NAME, ROLE @COMPANY' },
  { sector: 'Defence', quote: 'Client quote goes here: the qualification they had to meet and why they trusted the result.', who: 'NAME, ROLE @COMPANY' },
  { sector: 'Aerospace', quote: 'Client quote goes here: the environment they had to recreate, and what it saved them in the field.', who: 'NAME, ROLE @COMPANY' }
]
const N = items.length
const titleLines = ['Our customers', 'have no margin', 'for error.']

const rootRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const barRef = ref<HTMLElement | null>(null)
const barWrapRef = ref<HTMLElement | null>(null)
const trustedRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const lineEls: HTMLElement[] = []
const active = ref(0)
const cardsDark = ref(false)

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number) => a * a * (3 - 2 * a)
const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`
const INK = [13, 35, 64], HI = [246, 249, 252], LO = [142, 154, 167]

function tick() {
  const root = rootRef.value, stage = stageRef.value
  if (!root || !stage) return
  const H = window.innerHeight, W = window.innerWidth
  const r = root.getBoundingClientRect()
  if (r.bottom < -80 || r.top > H + 80) { root.dataset.dark = ''; return }
  const travel = r.height - H
  stage.style.transform = `translate3d(0, ${Math.min(Math.max(-r.top, 0), travel).toFixed(1)}px, 0)`
  const p = clamp01(-r.top / travel)
  // the four cards share the first 80% of the scroll
  const pc = clamp01(p / 0.8)
  const idx = Math.min(N - 1, Math.floor(pc * N * 0.999))
  if (idx !== active.value) active.value = idx
  barRef.value!.style.transform = `scaleX(${pc.toFixed(4)})`

  // the preloader's smoke wave, driven by the scroll (eased, so it glides) and leaning toward the cursor
  wTarget = smooth(clamp01((p - 0.15) / 0.8))
  wp += (wTarget - wp) * 0.12
  mx += (mxT - mx) * 0.06
  drawWave(W, H)
  // how dark the page is behind an element, 0 → 1: the same maths as the shader, at the element's centre
  const under = (el: HTMLElement) => {
    const b = el.getBoundingClientRect()
    return waveAlpha((b.left + b.width / 2) / W, 1 - (b.top + b.height / 2) / H)
  }
  const cd = under(lineEls[1] ?? trustedRef.value!) > 0.5
  if (cd !== cardsDark.value) cardsDark.value = cd
  lineEls.forEach((l) => {
    const k = under(l)
    l.style.setProperty('--hi', mix(INK, HI, k))
    l.style.setProperty('--lo', mix(INK, LO, k))
  })
  trustedRef.value!.style.color = mix(INK, HI, under(trustedRef.value!))
  barWrapRef.value!.style.setProperty('--c', mix(INK, HI, under(barWrapRef.value!)))
  root.dataset.dark = under(trustedRef.value!) > 0.6 && r.top < 44 && r.bottom > 44 ? '1' : '' // nav turns light once the top is black

  // title lines rise in as the section arrives
  const arrive = smooth(clamp01((H - r.top) / (H * 0.7)))
  lineEls.forEach((l, i) => {
    const a = clamp01(arrive * 1.6 - i * 0.22)
    l.style.opacity = (0.14 + 0.86 * a).toFixed(3)
    l.style.transform = `translate3d(0, ${((1 - a) * 22).toFixed(1)}px, 0)`
  })
}

// ── Smoke wave (same shader and parameters as the preloader; the offset runs further at both ends: fully light before, fully black after) ──
let gl: WebGLRenderingContext | null = null
let uLoc: Record<string, WebGLUniformLocation | null> = {}
let wp = 0, wTarget = 0, mx = 0, mxT = 0, lastDraw = ''
// offset starts lower than the preloader's (-1.2) so the page is fully light before the wave arrives
const waveParams = () => ({ amp: 1.3 - 1.0 * wp, offset: -2.8 + 5.9 * wp, shift: mx * 0.35 })
function waveAlpha(x: number, y: number) {
  const { amp, offset, shift } = waveParams()
  const sy = 0.5 + (y - 0.5) * 1.3
  const waveY = 0.5 + Math.sin((x + shift) * -0.5 * Math.PI * 2) * amp + offset
  const t = clamp01((waveY - sy + 1) / 2.5)
  return t * t * (3 - 2 * t)
}
function initWave() {
  const c = canvasRef.value
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
  gl.uniform3f(uLoc.uColor, 0, 0, 0)
}
function drawWave(W: number, H: number) {
  const c = canvasRef.value
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
const onMove = (e: PointerEvent) => { mxT = e.clientX / window.innerWidth - 0.5 }

function jump(i: number) {
  const root = rootRef.value
  if (!root) return
  const travel = root.getBoundingClientRect().height - window.innerHeight
  scrollColumnTo(root, -travel * 0.8 * ((i + 0.5) / N))
}

onMounted(() => {
  initWave()
  window.addEventListener('pointermove', onMove, { passive: true })
  gsap.ticker.add(tick)
})
onUnmounted(() => {
  gsap.ticker.remove(tick)
  window.removeEventListener('pointermove', onMove)
})
</script>

<style scoped>
.ts-root { position: relative; height: 240vh; color: #0d2340; }
.ts-stage { position: absolute; left: 0; right: 0; top: 0; height: 100vh; overflow: hidden; will-change: transform; }

/* the preloader's smoke wave, scroll-driven: black rising from below on a soft, slowly flattening curve */
.ts-wave { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.ts-content { position: absolute; inset: 0; }

.ts-bar { --c: #0d2340; position: absolute; left: 5vw; right: 5vw; top: 13vh; height: 2px; }
.ts-bar::before { content: ''; position: absolute; inset: 0; background: var(--c); opacity: 0.16; }
.ts-bar i { position: absolute; inset: 0; background: var(--c); opacity: 0.85; transform-origin: left; transform: scaleX(0); }
.ts-trusted { position: absolute; right: 5vw; top: calc(13vh - 34px); width: min(34vw, 640px); font-family: var(--font-display); font-size: clamp(16px, 1.3vw, 24px); letter-spacing: -0.03em; }

.ts-title { position: absolute; left: 5vw; top: 50%; transform: translateY(-50%); margin: 0; display: flex; flex-direction: column; font-family: var(--font-display); font-weight: 400; font-size: clamp(30px, 4.6vw, 88px); line-height: 1.02; letter-spacing: -0.05em; }
.ts-line { --hi: #0d2340; --lo: #0d2340; display: block; background: linear-gradient(180deg, var(--hi) 10%, var(--lo) 105%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; padding-bottom: 0.06em; }

/* on the light page: black cards. Once the page behind them is dark (.dark): graphite bars and a light open card */
.ts-cards { position: absolute; right: 5vw; top: calc(13vh + 38px); width: min(34vw, 640px); display: flex; flex-direction: column; gap: 10px; }
.ts-card { border-radius: 14px; padding: 0 22px; color: #f4f6f8; background: #0c0f15; border: 1px solid rgba(255, 255, 255, 0.08); cursor: pointer; pointer-events: auto; transition: background 0.6s ease, border-color 0.6s ease, transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1); }
.ts-card header { display: flex; justify-content: space-between; align-items: center; height: 64px; font-family: var(--font-body); font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; }
.ts-n { opacity: 0.4; }
.ts-card:hover:not(.on) { background: #161a22; transform: translateX(-4px); }
.ts-card.on { background: #000; border-color: rgba(255, 255, 255, 0.14); cursor: default; }
.ts-card { transition: background 0.8s ease, color 0.8s ease, border-color 0.8s ease, transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1); }
.ts-cards.dark .ts-card { background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.08); }
.ts-cards.dark .ts-card:hover:not(.on) { background: rgba(255, 255, 255, 0.11); }
.ts-cards.dark .ts-card.on { background: linear-gradient(180deg, #dfe2e5 0%, #fbfbfb 62%); color: #101214; border-color: transparent; }

/* the open card grows from zero height (grid-rows trick, so the text never has to be measured) */
.ts-open { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.7s cubic-bezier(0.2, 0.9, 0.2, 1); }
.ts-card.on .ts-open { grid-template-rows: 1fr; }
.ts-inner { overflow: hidden; min-height: 0; }
.ts-inner blockquote { margin: 0; padding: 14vh 0 22px; font-family: var(--font-display); font-size: clamp(16px, 1.45vw, 26px); line-height: 1.22; letter-spacing: -0.035em; opacity: 0; transform: translateY(12px); transition: opacity 0.5s ease 0.15s, transform 0.7s cubic-bezier(0.2, 0.9, 0.2, 1) 0.15s; }
.ts-inner cite { display: block; margin-bottom: 20px; font-style: normal; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.1em; opacity: 0; transition: opacity 0.5s ease 0.3s; }
.ts-card.on blockquote { opacity: 1; transform: none; }
.ts-card.on cite { opacity: 0.55; }

@media (max-width: 900px) {
  .ts-title { top: 20vh; transform: none; }
  .ts-cards { width: 90vw; right: 5vw; top: auto; bottom: 6vh; }
  .ts-inner blockquote { padding-top: 24px; }
}
</style>
