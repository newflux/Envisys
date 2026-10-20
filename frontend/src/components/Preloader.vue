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

    <!-- 3. Exact Icomat Alternating SVG clipPath Canvas Logo Mark (small size) -->
    <div class="preloader-logo-stage">
      <div class="preloader-canvas-box">
        <canvas ref="canvasRef"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const props = withDefaults(
  defineProps<{
    /** Initial logo fill color on the whitish background */
    lightModeLogoColor?: string
    /** Logo fill color once the dark shade sweeps over */
    darkModeLogoColor?: string
    /** Duration in seconds for each arc to draw */
    arcDuration?: number
    /** Stagger delay between arcs in seconds */
    arcStagger?: number
  }>(),
  {
    lightModeLogoColor: '#0e0f12',
    darkModeLogoColor: '#F5F5F7',
    arcDuration: 1.1,
    arcStagger: 0.08
  }
)

const emit = defineEmits<{
  (e: 'complete'): void
}>()

const loaderRootRef = ref<HTMLElement | null>(null)
const smokeCanvasRef = ref<HTMLCanvasElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isFinished = ref(false)

// The exact 7 mathematical curves of the Icomat mark (inner to outer arcs)
const defaultSvgPaths = [
  "M21.8711 89.867C39.461 80.3294 64.0023 80.3218 81.5922 89.867L81.4113 90.4777C78.9986 89.784 76.5633 89.1809 74.1129 88.6757C59.4258 85.5241 44.045 85.5241 29.3579 88.6757C26.9075 89.1884 24.4723 89.7916 22.0596 90.4777L21.8786 89.867H21.8711Z",
  "M11.2578 79.9181C35.3167 65.246 68.1591 65.246 92.218 79.9181L91.9692 80.5062C88.7875 79.1943 85.5379 78.0332 82.2431 77.0455C62.512 71.0214 40.9714 71.0214 21.2327 77.0455C17.9379 78.0332 14.6883 79.1868 11.5066 80.5062L11.2578 79.9181Z",
  "M4.61274 69.2364C31.9965 50.4629 71.4588 50.4629 98.8426 69.2364L98.5486 69.8095C94.9296 67.9924 91.1974 66.394 87.39 65.0218C64.5978 56.6604 38.85 56.6604 16.0503 65.0218C12.2428 66.394 8.51825 67.9924 4.8917 69.8095L4.61274 69.2364H4.61274Z",
  "M0.827852 57.4856C29.9608 36.0204 73.5096 36.0204 102.643 57.4856L102.326 58.0436C98.4732 55.9023 94.4847 54.0174 90.3907 52.3889C65.887 42.4894 37.5758 42.4894 13.0722 52.3889C8.97816 54.0099 4.98971 55.9023 1.13698 58.0436L0.820312 57.4856H0.827852Z",
  "M0 44.1798C29.4949 22.0963 73.971 22.0963 103.466 44.1798L103.149 44.7377C99.2437 42.5286 95.2025 40.5683 91.0481 38.887C66.175 28.6331 37.2908 28.6331 12.4177 38.887C8.2634 40.5683 4.22217 42.5286 0.316663 44.7377L0 44.1798Z",
  "M3.58984 28.4147C31.4562 8.9399 72.0041 8.9399 99.878 28.4147L99.584 28.9801C95.8971 27.0802 92.0971 25.4064 88.2143 23.9663C64.9546 15.2053 38.5208 15.2053 15.2611 23.9663C11.3782 25.4064 7.57829 27.0802 3.89143 28.9801L3.59738 28.4147H3.58984Z",
  "M17.906 8.44246C37.9613 -2.81415 65.5034 -2.81415 85.5663 8.44246L85.3552 9.04563C82.6485 8.14842 79.9041 7.35676 77.1295 6.68574C60.5349 2.57666 42.9299 2.57666 26.3352 6.68574C23.5607 7.35676 20.8163 8.14088 18.1095 9.04563L17.8984 8.44246H17.906Z"
]

let pathObjects: Path2D[] = []
const arcItems = Array(7).fill(null).map(() => ({ progress: 0 }))
let tweens: gsap.core.Tween[] = []
let masterTl: gsap.core.Timeline | null = null
let animationFrameId: number | null = null
let logoCtx: CanvasRenderingContext2D | null = null

// Color and opacity state for the logo canvas
const logoColorState = {
  r: 14,
  g: 15,
  b: 18,
  alpha: 1
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

function resizeLogoCanvas() {
  if (!canvasRef.value) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvasRef.value.width = 104 * dpr
  canvasRef.value.height = 91 * dpr
  if (logoCtx) {
    logoCtx.scale(dpr, dpr)
  }
}

function resizeAll() {
  resizeSmokeCanvas()
  resizeLogoCanvas()
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

  // 2. Render 2D alternating SVG clipPath logo
  if (logoCtx) {
    logoCtx.clearRect(0, 0, 104, 91)
    const fillColor = `rgba(${Math.round(logoColorState.r)}, ${Math.round(logoColorState.g)}, ${Math.round(logoColorState.b)}, ${logoColorState.alpha})`

    arcItems.forEach((item, index) => {
      if (item.progress > 0) {
        logoCtx!.save()
        logoCtx!.beginPath()

        // Exact Icomat alternating sweep:
        if (index % 2 === 0) {
          logoCtx!.rect(0, 0, 104 * item.progress, 91)
        } else {
          const startX = 104 * (1 - item.progress)
          logoCtx!.rect(startX, 0, 104 * item.progress, 91)
        }

        logoCtx!.clip()
        logoCtx!.fillStyle = fillColor
        logoCtx!.fill(pathObjects[index])
        logoCtx!.restore()
      }
    })
  }

  animationFrameId = requestAnimationFrame(render)
}

function startAnimation() {
  arcItems.forEach(item => (item.progress = 0))
  waveState.progress = 0
  waveState.opacity = 1
  tweens.forEach(t => t.kill())
  tweens = []

  const startRGB = parseHex(props.lightModeLogoColor)
  const targetRGB = parseHex(props.darkModeLogoColor)
  logoColorState.r = startRGB.r
  logoColorState.g = startRGB.g
  logoColorState.b = startRGB.b
  logoColorState.alpha = 1

  masterTl = gsap.timeline()
  if (typeof window !== 'undefined') {
    (window as any).__preloaderTl = masterTl
  }

  // 1. Staggered reveal of the 7 alternating curves on the whitish screen
  arcItems.forEach((item, i) => {
    masterTl!.to(
      item,
      {
        progress: 1,
        duration: props.arcDuration,
        ease: 'power2.out'
      },
      i * props.arcStagger
    )
  })

  // 2. Exact Icomat Smoke Wave: rises organically from left & right towards center
  const smokeStartTime = 1.05

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

  // 3. Logo smoothly shifts to pure white as the black wave covers it
  masterTl.to(
    logoColorState,
    {
      r: targetRGB.r,
      g: targetRGB.g,
      b: targetRGB.b,
      duration: 0.5,
      ease: 'power2.out'
    },
    smokeStartTime + 0.35
  )

  // 4. Logo dissolves as black completely envelops the stage
  masterTl.to(
    logoColorState,
    {
      alpha: 0,
      duration: 0.35,
      ease: 'power2.in'
    },
    smokeStartTime + 1.15
  )

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
  if (canvasRef.value) {
    logoCtx = canvasRef.value.getContext('2d')
    pathObjects = defaultSvgPaths.map(p => new Path2D(p))
    canvasRef.value.style.width = '100%'
    canvasRef.value.style.height = '100%'
    canvasRef.value.style.display = 'block'
  }

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

/* 3. Small, crisp logo mark in the center */
.preloader-logo-stage {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.preloader-canvas-box {
  position: relative;
  width: 40px;
  height: auto;
  aspect-ratio: 104 / 91;
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.08));
}

@media (max-width: 768px) {
  .preloader-canvas-box {
    width: 34px;
  }
}
</style>
