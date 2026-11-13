<template>
  <div 
    ref="loaderRootRef" 
    class="envisys-preloader-root"
    :class="{ 'is-complete': isFinished }"
  >
    <!-- 1. Base Whitish Stage (Exact Icomat: clean whitish background) -->
    <div class="preloader-pale-bg"></div>

    <!-- 2. Exact Icomat WebGL Animated Smoke Wave Shader Canvas -->
    <canvas ref="smokeCanvasRef" class="preloader-smoke-canvas"></canvas>

    <!-- 3. The Envisys logo: letters rise from behind the baseline, the blocks drop in, the tagline wipes on -->
    <div v-if="!smokeOnly" ref="logoStageRef" class="preloader-logo-stage">
      <BrandMark ref="brandRef" full class="preloader-logo" />
      <i v-if="holding" class="pl-bar" aria-hidden="true"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import BrandMark from './BrandMark.vue'

const props = withDefaults(
  defineProps<{
    /** Initial logo fill color on the whitish background */
    lightModeLogoColor?: string
    /** Logo fill color once the dark shade sweeps over */
    darkModeLogoColor?: string
    /** Inner pages: the smoke alone, no logo, so it starts straight away */
    smokeOnly?: boolean
  }>(),
  {
    lightModeLogoColor: '#0e0f12',
    darkModeLogoColor: '#F5F5F7'
  }
)

const emit = defineEmits<{
  (e: 'complete'): void
}>()

const loaderRootRef = ref<HTMLElement | null>(null)
const smokeCanvasRef = ref<HTMLCanvasElement | null>(null)
const brandRef = ref<InstanceType<typeof BrandMark> | null>(null)
const logoStageRef = ref<HTMLElement | null>(null)
const isFinished = ref(false)
const holding = ref(false)

let tweens: gsap.core.Tween[] = []
let masterTl: gsap.core.Timeline | null = null
let animationFrameId: number | null = null

// the colour of the logo's white layer: dark on the whitish stage, white once the black wave covers it (the blue SYS never changes)
const logoColorState = { r: 14, g: 15, b: 18 }
function applyInk() {
  const el = brandRef.value?.root
  if (el) el.style.setProperty('--logo-ink', `rgb(${Math.round(logoColorState.r)}, ${Math.round(logoColorState.g)}, ${Math.round(logoColorState.b)})`)
}

// WebGL Smoke Wave variables
let gl: WebGLRenderingContext | null = null
let waveProgram: WebGLProgram | null = null
let uScaleXLoc: WebGLUniformLocation | null = null
let uScaleYLoc: WebGLUniformLocation | null = null
let uFreqLoc: WebGLUniformLocation | null = null
let uAmpLoc: WebGLUniformLocation | null = null
let uOffsetLoc: WebGLUniformLocation | null = null
let uOpacityLoc: WebGLUniformLocation | null = null
let uColorTopLoc: WebGLUniformLocation | null = null
let uColorBottomLoc: WebGLUniformLocation | null = null

const waveState = {
  progress: 0,
  opacity: 1
}

function parseHex(hex: string) {
  let clean = hex.replace('#', '')
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('')
  }
  const num = parseInt(clean, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  }
}

function initWaveShader() {
  if (!smokeCanvasRef.value) return
  gl = smokeCanvasRef.value.getContext('webgl', { alpha: true, premultipliedAlpha: false })
  if (!gl) return

  const vsSource = `
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `

  // The exact mathematical Icomat smoke wave fragment shader
  const fsSource = `
    precision mediump float;
    varying vec2 vUv;
    uniform float uScaleX;
    uniform float uScaleY;
    uniform float uFrequency;
    uniform float uAmplitude;
    uniform float uOffsetY;
    uniform float uOpacity;
    uniform vec3 uColorTop;
    uniform vec3 uColorBottom;

    void main() {
      float scaledX = 0.5 + (vUv.x - 0.5) * uScaleX;
      float scaledY = 0.5 + (vUv.y - 0.5) * uScaleY;
      float wave = sin(vUv.x * uFrequency * 3.14159265 * 2.0) * uAmplitude;
      float waveY = 0.5 + wave + uOffsetY;
      float dist = waveY - scaledY;
      float edge = 1.0 - smoothstep(-1.0, 1.5, dist);
      vec3 color = mix(uColorBottom, uColorTop, edge);
      float alpha = (1.0 - edge) * uOpacity;
      gl_FragColor = vec4(color, alpha);
    }
  `

  const createShader = (glCtx: WebGLRenderingContext, type: number, src: string) => {
    const s = glCtx.createShader(type)!
    glCtx.shaderSource(s, src)
    glCtx.compileShader(s)
    return s
  }

  waveProgram = gl.createProgram()!
  gl.attachShader(waveProgram, createShader(gl, gl.VERTEX_SHADER, vsSource))
  gl.attachShader(waveProgram, createShader(gl, gl.FRAGMENT_SHADER, fsSource))
  gl.linkProgram(waveProgram)
  gl.useProgram(waveProgram)

  const posBuf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  1, -1, -1,  1,
    -1,  1,  1, -1,  1,  1
  ]), gl.STATIC_DRAW)

  const aPos = gl.getAttribLocation(waveProgram, 'position')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  uScaleXLoc = gl.getUniformLocation(waveProgram, 'uScaleX')
  uScaleYLoc = gl.getUniformLocation(waveProgram, 'uScaleY')
  uFreqLoc = gl.getUniformLocation(waveProgram, 'uFrequency')
  uAmpLoc = gl.getUniformLocation(waveProgram, 'uAmplitude')
  uOffsetLoc = gl.getUniformLocation(waveProgram, 'uOffsetY')
  uOpacityLoc = gl.getUniformLocation(waveProgram, 'uOpacity')
  uColorTopLoc = gl.getUniformLocation(waveProgram, 'uColorTop')
  uColorBottomLoc = gl.getUniformLocation(waveProgram, 'uColorBottom')

  resizeSmokeCanvas()
}

function resizeSmokeCanvas() {
  if (!smokeCanvasRef.value || !gl) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  smokeCanvasRef.value.width = window.innerWidth * dpr
  smokeCanvasRef.value.height = window.innerHeight * dpr
  gl.viewport(0, 0, smokeCanvasRef.value.width, smokeCanvasRef.value.height)
}

function resizeAll() {
  resizeSmokeCanvas()
}

function render() {
  // 1. Render WebGL smoke wave
  if (gl && waveProgram) {
    const p = waveState.progress
    // Exact Icomat interpolation parameters:
    const scaleX = 1.1 + (2.0 - 1.1) * p
    const offsetY = -1.2 + (2.1 - (-1.2)) * p
    const amplitude = 1.3 + (0.3 - 1.3) * p

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.uniform1f(uScaleXLoc, scaleX)
    gl.uniform1f(uScaleYLoc, 1.3)
    gl.uniform1f(uFreqLoc, -0.5)
    gl.uniform1f(uAmpLoc, amplitude)
    gl.uniform1f(uOffsetLoc, offsetY)
    gl.uniform1f(uOpacityLoc, waveState.opacity)
    // Deep rich #050505 Envisys void tones
    gl.uniform3f(uColorTopLoc, 0.02, 0.02, 0.02)
    gl.uniform3f(uColorBottomLoc, 0.02, 0.02, 0.02)

    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  animationFrameId = requestAnimationFrame(render)
}

function startAnimation() {
  waveState.progress = 0
  waveState.opacity = 1
  tweens.forEach(t => t.kill())
  tweens = []

  const startRGB = parseHex(props.lightModeLogoColor)
  const targetRGB = parseHex(props.darkModeLogoColor)
  logoColorState.r = startRGB.r
  logoColorState.g = startRGB.g
  logoColorState.b = startRGB.b
  applyInk()
  if (logoStageRef.value) gsap.set(logoStageRef.value, { opacity: 1 })

  masterTl = gsap.timeline()
  if (typeof window !== 'undefined') {
    (window as any).__preloaderTl = masterTl
  }

  // 1. The logo draws itself on the whitish screen: letters rise, blocks drop in, the tagline wipes on
  const logoTl = brandRef.value?.play()
  if (logoTl) masterTl.add(logoTl, 0.15)

  // 2. Exact Icomat Smoke Wave: rises organically from left & right towards center
  const smokeStartTime = props.smokeOnly ? 0.25 : 1.85 // after the logo has landed and held for a beat

  masterTl.fromTo(
    waveState,
    { progress: 0 },
    {
      progress: 1,
      duration: 1.35,
      ease: 'power2.inOut'
    },
    smokeStartTime
  )

  // Landing: the logo holds until the 3D scene has compiled its shaders, so the reveal is always the live scene (no freeze, no half-loaded frame)
  if (!props.smokeOnly) {
    masterTl.call(() => {
      if ((window as any).__sceneReady !== false) return
      masterTl!.pause()
      const t = setTimeout(() => { holding.value = true }, 700) // CSS-driven bar: keeps moving even while the page is busy compiling
      const go = () => { clearTimeout(t); holding.value = false; window.removeEventListener('scene:ready', go); masterTl?.play() }
      window.addEventListener('scene:ready', go)
    }, [], smokeStartTime)
  }

  // Inner pages with a 3D scene (window.__pagePending): the smoke keeps covering the page until the scene has compiled behind it
  if (props.smokeOnly) {
    masterTl.call(() => {
      if (!(window as any).__pagePending) return
      masterTl!.pause()
      const go = () => { clearTimeout(t); window.removeEventListener('page:ready', go); masterTl?.play() }
      const t = setTimeout(go, 15000) // never hold forever
      window.addEventListener('page:ready', go)
    }, [], smokeStartTime + 1.34)
  }

  // 3. The white layer of the logo shifts to white as the black wave covers it
  masterTl.to(
    logoColorState,
    { r: targetRGB.r, g: targetRGB.g, b: targetRGB.b, duration: 0.5, ease: 'power2.out', onUpdate: applyInk },
    smokeStartTime + 0.35
  )

  // 4. The logo dissolves as black completely envelops the stage
  if (logoStageRef.value) {
    masterTl.to(logoStageRef.value, { opacity: 0, duration: 0.35, ease: 'power2.in' }, smokeStartTime + 1.15)
  }

  // 5. Entire preloader dissolves into the #050505 3D chamber scene
  masterTl.to(
    loaderRootRef.value,
    {
      opacity: 0,
      duration: 0.55,
      ease: 'power2.inOut',
      onComplete: () => {
        isFinished.value = true
        if (loaderRootRef.value) {
          loaderRootRef.value.style.display = 'none'
        }
        // it stays mounted, so stop its draw loop and hand its GPU context back
        if (animationFrameId) cancelAnimationFrame(animationFrameId)
        animationFrameId = null
        gl?.getExtension('WEBGL_lose_context')?.loseContext()
        gl = null
        emit('complete')
      }
    },
    smokeStartTime + 1.35
  )
}

onMounted(() => {
  initWaveShader()
  resizeAll()
  window.addEventListener('resize', resizeAll)

  render()
  startAnimation()
})

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (masterTl) masterTl.kill()
  tweens.forEach(t => t.kill())
  window.removeEventListener('resize', resizeAll)
})
</script>

<style scoped>
.pl-bar { position: absolute; left: 50%; bottom: -34px; width: 120px; height: 2px; margin-left: -60px; overflow: hidden; background: rgba(14, 15, 18, 0.12); }
.pl-bar::after { content: ''; position: absolute; inset: 0; width: 40%; background: #ff6a13; animation: pl-slide 1.1s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
@keyframes pl-slide { from { transform: translateX(-100%); } to { transform: translateX(260%); } }
.envisys-preloader-root {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  pointer-events: auto;
  user-select: none;
  background-color: #050505;
}

.envisys-preloader-root.is-complete {
  pointer-events: none;
  display: none !important;
}

/* 1. Base Whitish Stage (Exact Icomat: crisp whitish glow in center, subtle atmospheric edge depth) */
.preloader-pale-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse 110% 85% at 50% 40%, 
    #ffffff 0%, 
    #f5f6f8 35%, 
    #d7dae0 60%, 
    #7a7e87 82%, 
    #25272c 94%, 
    #050505 100%
  );
  z-index: 1;
}

/* 2. WebGL Smoke Wave Canvas - spans the entire screen above the whitish background */
.preloader-smoke-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;
  display: block;
}

/* 3. The logo, centred: wide, so the wordmark reads from across a room */
.preloader-logo-stage {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  width: min(360px, 52vw);
}
.preloader-logo { width: 100%; --logo-ink: #0e0f12; }

@media (max-width: 768px) {
  .preloader-logo-stage { width: 62vw; }
}
</style>
