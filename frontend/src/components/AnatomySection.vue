<template>
  <!-- Tall spacer; the stage inside is held on screen while the real ET950 drawing is drawn, lit,
       taken apart, put back, and flattened to a single line that opens into the light-blue page. -->
  <section class="an-root" ref="rootRef">
    <div class="an-stage" ref="stageRef">
      <svg class="an-grid" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path v-for="(d, i) in gridPaths" :key="i" :d="d" pathLength="1" class="an-gl" :ref="(el) => (gridEls[i] = el as SVGPathElement)" />
      </svg>

      <canvas ref="canvasRef" class="an-canvas"></canvas>

      <!-- Callouts run along the bottom edge on vertical leaders, clear of both model and headline -->
      <svg class="an-leaders" ref="leadSvg" aria-hidden="true"></svg>
      <div class="an-labels">
        <div v-for="(l, i) in labelDefs" :key="l.key" class="an-label" :ref="(el) => (labelEls[i] = el as HTMLElement)">
          <b>0{{ i + 1 }}</b><span>{{ l.text }}</span>
        </div>
      </div>

      <div class="an-steps">
        <div v-for="(s, i) in steps" :key="s.title" class="an-step" :ref="(el) => (stepEls[i] = el as HTMLElement)">
          <span class="an-eyebrow">{{ s.name }}</span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.body }}</p>
        </div>
      </div>
      <div class="an-count"><span>ET950 · drawing</span><b>{{ stepIdx + 1 }}</b><i></i><b>4</b></div>

      <div class="an-line" ref="lineRef"></div>

      <!-- Once the line has opened into the light blue: the heading that hands over to the range -->
      <div class="an-next" ref="nextRef">
        <span>Our products</span>
        <h2><i v-for="(w, i) in nextWords" :key="i" :ref="(el) => (nextEls[i] = el as HTMLElement)">{{ w }}</i></h2>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import * as THREE from 'three'

// Groups come from the ET950-70H-5K STEP assembly (baked to public/models/et950_parts.json)
const labelDefs = [
  { key: 'control', text: 'Control panel' },
  { key: 'door', text: 'Insulated door' },
  { key: 'hinge', text: 'Door hinges' },
  { key: 'core', text: 'Inner chamber' },
  { key: 'air', text: 'Evaporator · heater · fan' },
  { key: 'machine', text: 'Compressor base' },
  { key: 'shell', text: 'Outer cabinet' }
]
const steps = [
  { name: 'Drawing', title: 'Drawn to the millimetre.', body: 'This is the ET950 as engineered: every panel, hinge and clamp, straight from the CAD.' },
  { name: 'Structure', title: 'It takes shape.', body: 'Panels close into a cabinet that holds −70°C to +180°C, one part at a time.' },
  { name: 'Anatomy', title: 'Every part earns its place.', body: 'Door, chamber, air path and compressor base: each one built, tested and serviced as a block.' },
  { name: 'Resolution', title: 'Then it disappears.', body: 'Put it back together and it is one line between your product and the test.' }
]
const gridPaths = [
  'M0 0 L1600 900', 'M1600 0 L0 900', 'M800 0 L800 900', 'M0 450 L1600 450',
  'M800 90 L1130 450 L800 810 L470 450 Z', 'M800 230 L990 450 L800 670 L610 450 Z',
  'M560 0 L1040 900', 'M1040 0 L560 900', 'M300 0 L300 900', 'M1300 0 L1300 900'
]

const rootRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const nextRef = ref<HTMLElement | null>(null)
const nextWords = 'A chamber for every test.'.split(' ')
const nextEls: HTMLElement[] = []
const leadSvg = ref<SVGSVGElement | null>(null)
const gridEls: SVGPathElement[] = []
const labelEls: HTMLElement[] = []
const stepEls: HTMLElement[] = []
const stepIdx = ref(0)

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number) => a * a * (3 - 2 * a)
const seg = (p: number, a: number, b: number) => smooth(clamp01((p - a) / (b - a)))

// ── scene ──
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene, camera: THREE.PerspectiveCamera, rig: THREE.Group
const uniforms = { uSweep: { value: 0 }, uFill: { value: 0 }, uWhite: { value: 0 }, uY0: { value: 0 }, uY1: { value: 1 } }

type G = { id: string; group: THREE.Group; edges: THREE.LineSegments[]; box: THREE.Box3; centre: THREE.Vector3; dir: THREE.Vector3; dist: number; pgs: { pg: THREE.Group; off: THREE.Vector3 }[]; anchor: THREE.Group }
const groups: G[] = []
let loaded = false
let modelH = 1.8, modelW = 1, modelD = 1
let disposed = false

// The sweep: both hairlines and surfaces are revealed bottom-up by world height, with a soft edge,
// so the drawing appears to be plotted rather than faded in.
function patch(mat: THREE.Material, kind: 'line' | 'mesh') {
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms)
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vH;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvH = (modelMatrix * vec4(transformed, 1.0)).y;')
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vH;\nuniform float uSweep, uFill, uWhite, uY0, uY1;')
      .replace('void main() {', `void main() {\n  float hn = (vH - uY0) / (uY1 - uY0);\n  float lim = ${kind === 'line' ? 'uSweep' : 'uFill'};\n  if (hn > lim * 1.06) discard;`)
    if (kind === 'mesh') {
      sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `
        // the leading edge of the fill glows ice-blue, then settles
        float edge = smoothstep(0.0, 0.06, lim * 1.06 - hn);
        outgoingLight = mix(vec3(0.55, 0.78, 1.0) * 0.9, outgoingLight, edge);
        outgoingLight = mix(outgoingLight, vec3(1.0), uWhite);
        #include <opaque_fragment>`)
    } else {
      sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', 'outgoingLight = mix(outgoingLight, vec3(1.0), uWhite);\n#include <opaque_fragment>')
    }
  }
}

// True matte (Lambert, no reflections): the form reads from soft light and shadow only, like unglazed clay.
const GROUP_STYLE: Record<string, { color: number; emissive?: number; ei?: number }> = {
  shell: { color: 0xe9e8e4 },
  door: { color: 0xf3f2ee },
  hinge: { color: 0xb9bcbf },
  control: { color: 0xa9b3c2, emissive: 0x4a86e0, ei: 0.05 },
  core: { color: 0xdcdcd8 },
  air: { color: 0xe2a073, emissive: 0xff6a1a, ei: 0.06 },
  machine: { color: 0x9aa0a6 }
}

function b64(s: string) {
  const bin = atob(s)
  const u = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i)
  return u.buffer
}

async function loadModel() {
  let data: any
  try {
    const res = await fetch('/models/et950_parts.json')
    if (!res.ok || !(res.headers.get('content-type') || '').includes('json')) return
    data = await res.json()
  } catch {
    return
  }
  if (disposed) return
  modelW = data.size[0]; modelH = data.size[1]; modelD = data.size[2]
  uniforms.uY1.value = modelH * 1.6 // headroom: exploded parts sit above the original height and must not be swept away
  for (const gd of data.groups) {
    const st = GROUP_STYLE[gd.id] ?? GROUP_STYLE.shell
    const group = new THREE.Group()
    const edges: THREE.LineSegments[] = []
    const pgs: { pg: THREE.Group; off: THREE.Vector3 }[] = []
    const mat = new THREE.MeshLambertMaterial({ color: st.color, emissive: st.emissive ?? 0, emissiveIntensity: st.ei ?? 0, side: THREE.DoubleSide })
    patch(mat, 'mesh')
    for (const part of gd.parts) {
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(b64(part.p)), 3))
      geo.setIndex(new THREE.BufferAttribute(part.i.t === 16 ? new Uint16Array(b64(part.i.d)) : new Uint32Array(b64(part.i.d)), 1))
      geo.computeVertexNormals()
      const pg = new THREE.Group()
      pg.add(new THREE.Mesh(geo, mat))
      // minimal hairline: outline only the big panels (small parts and fasteners get no line)
      geo.computeBoundingBox()
      const diag = geo.boundingBox!.getSize(new THREE.Vector3()).length()
      if (diag > modelH * 0.34 && (geo.index?.count ?? 0) / 3 < 2500) {
        const lm = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
        patch(lm, 'line')
        const ln = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 55), lm)
        pg.add(ln)
        edges.push(ln)
      }
      group.add(pg)
      pgs.push({ pg, off: new THREE.Vector3() })
    }
    rig.add(group)
    group.updateMatrixWorld(true)
    // callouts point at the group's largest part, so one stray sensor cannot drag the anchor off the model
    let gb = new THREE.Box3(), best = -1, anchor = pgs[0].pg
    const whole = new THREE.Box3()
    pgs.forEach(({ pg }) => {
      const b = new THREE.Box3().setFromObject(pg)
      whole.union(b)
      const sz = b.getSize(new THREE.Vector3())
      const vol = sz.x * sz.y + sz.y * sz.z + sz.x * sz.z
      if (vol > best) { best = vol; gb = b; anchor = pg }
    })
    // every part flies off radially from the middle of its own group, so panels separate from each other
    const gc = whole.getCenter(new THREE.Vector3())
    pgs.forEach((e) => { e.off.copy(new THREE.Box3().setFromObject(e.pg).getCenter(new THREE.Vector3())).sub(gc).multiplyScalar(0.75) })
    groups.push({ id: gd.id, group, edges, box: gb, centre: gb.getCenter(new THREE.Vector3()), dir: new THREE.Vector3(), dist: 0, pgs, anchor })
  }
  // explode vectors [x, y, z, distance as a fraction of model height]; depth axis is z (front = +z)
  const V: Record<string, [number, number, number, number]> = {
    door: [0, 0.02, 1, 0.7],
    hinge: [-1, 0, 1, 0.5],
    control: [1, 0.12, 0.6, 0.55],
    core: [0, 0.03, 0.15, 0.2],
    air: [0, 0.1, -1, 0.65],
    machine: [0, -1, -0.1, 0.5],
    shell: [0, 0, -0.35, 0.18]
  }
  for (const g of groups) {
    const v = V[g.id] ?? [0, 0, 0, 0]
    g.dir.set(v[0], v[1], v[2]).normalize()
    g.dist = v[3] * modelH
  }
  loaded = true
  resize()
  lastP = -1
}

function buildScene(canvas: HTMLCanvasElement) {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 1.0
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(16, 1, 0.1, 80)
  const hemi = new THREE.HemisphereLight(0xffffff, 0x2a3446, 2.7)
  const key = new THREE.DirectionalLight(0xfff6ea, 2.4); key.position.set(2.4, 3.6, 3.2)
  const rim = new THREE.DirectionalLight(0x9cc4ff, 0.9); rim.position.set(-3.5, 1.2, -2.5)
  scene.add(hemi, key, rim)
  rig = new THREE.Group()
  scene.add(rig)
  loadModel()
}

function resize() {
  if (!renderer || !stageRef.value) return
  const w = stageRef.value.clientWidth, h = stageRef.value.clientHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}

const tmp = new THREE.Vector3()
let lastP = -1
function render(p: number) {
  if (!renderer || !loaded) return
  const sweep = seg(p, 0.03, 0.2)                                 // hairlines plotted bottom-up
  const fill = seg(p, 0.22, 0.4)                                  // surfaces fill in the same way
  const explode = seg(p, 0.42, 0.6) * (1 - seg(p, 0.8, 0.88))
  const orbit = seg(p, 0.2, 0.4) * 0.45 + seg(p, 0.5, 0.7) * 0.55 // 0 → front elevation, 1 → full side profile
  const flat = seg(p, 0.84, 0.92)                                 // squash the depth axis: side profile → a single line
  const white = seg(p, 0.86, 0.93)

  uniforms.uSweep.value = sweep
  uniforms.uFill.value = fill
  uniforms.uWhite.value = white

  // straight-on elevation first, easing round to a true side view (a near-orthographic lens keeps it technical)
  const yaw = THREE.MathUtils.degToRad(orbit * 90)
  const pitch = THREE.MathUtils.degToRad(6 * Math.sin(Math.min(1, orbit * 1.6) * Math.PI) * (1 - flat))
  const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
  const aspect = camera.aspect
  const zSpread = modelH * 1.3 * explode
  const projW = Math.abs(Math.sin(yaw)) * (modelD + zSpread) + Math.abs(Math.cos(yaw)) * modelW
  const visH = Math.max((modelH * (1 + 0.95 * explode)) / 0.66, projW / 0.52 / aspect)
  const dist = visH / (2 * tanH)
  tmp.set(0, modelH * (0.5 - 0.06 * explode), 0)
  camera.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, tmp.y + Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist)
  camera.lookAt(tmp)
  // model sits slightly right of centre: the copy lives bottom-left, callouts in the right-hand column
  const cw = renderer.domElement.width, ch = renderer.domElement.height
  camera.setViewOffset(cw, ch, 0, 0, cw, ch)
  rig.scale.set(1, 1, 1 - 0.996 * flat)

  groups.forEach((g) => {
    g.group.position.copy(g.dir).multiplyScalar(g.dist * explode)
    g.pgs.forEach((e) => e.pg.position.copy(e.off).multiplyScalar(explode))
    g.edges.forEach((e) => ((e.material as THREE.LineBasicMaterial).opacity = 0.9 - 0.8 * fill))
  })

  // callouts: two columns (left/right of the model) ordered by height. Each leader starts on the near edge of its
  // part, runs level, then bends to its label, so lines never cut across the other blocks.
  const rect = stageRef.value!.getBoundingClientRect()
  const W = rect.width, Hh = rect.height
  const lab = seg(p, 0.6, 0.64) * (1 - seg(p, 0.78, 0.82))
  type It = { i: number; cx: number; y: number; x0: number; x1: number; ly: number; left: boolean }
  const items: It[] = []
  labelDefs.forEach((d, i) => {
    const g = groups.find((x) => x.id === d.key)
    if (!g) return
    tmp.copy(g.centre).addScaledVector(g.dir, g.dist * explode).add(g.anchor.position)
    rig.localToWorld(tmp)
    tmp.project(camera)
    const sx = (tmp.x * 0.5 + 0.5) * W, sy = (-tmp.y * 0.5 + 0.5) * Hh
    items.push({ i, cx: sx, y: sy, x0: sx, x1: sx, ly: 0, left: false })
  })
  items.sort((a, b) => a.cx - b.cx)
  items.forEach((it, k) => (it.left = k < Math.floor(items.length / 2)))
  const GAP = 46
  const place = (list: It[], top: number, bot: number) => {
    list.sort((a, b) => a.y - b.y)
    let prevY = top - GAP
    list.forEach((it) => { it.ly = Math.max(prevY + GAP, Math.min(it.y, bot)); prevY = it.ly })
    for (let k = list.length - 1, lim = bot; k >= 0; k--) { list[k].ly = Math.min(list[k].ly, lim); lim = list[k].ly - GAP }
  }
  place(items.filter((i) => i.left), Hh * 0.2, Hh * 0.52)
  place(items.filter((i) => !i.left), Hh * 0.2, Hh * 0.86)
  let svg = ''
  items.forEach((it) => {
    const el = labelEls[it.i]
    const labelW = W * 0.14
    const lx = it.left ? W * 0.05 : W * 0.84
    el.style.width = `${labelW}px`
    el.style.transform = `translate3d(${lx.toFixed(1)}px, ${(it.ly - 7).toFixed(1)}px, 0)`
    el.style.opacity = lab.toFixed(3)
    const ax = it.left ? it.x0 : it.x1
    const kx = it.left ? W * 0.245 : W * 0.805
    const end = it.left ? lx + labelW + 8 : lx - 10
    const mid = it.left ? Math.min(ax - 12, kx + 26) : Math.max(ax + 12, kx - 26)
    svg += `<path d="M${ax.toFixed(1)} ${it.y.toFixed(1)} L${mid.toFixed(1)} ${it.y.toFixed(1)} L${kx.toFixed(1)} ${it.ly.toFixed(1)} L${end.toFixed(1)} ${it.ly.toFixed(1)}" /><circle cx="${ax.toFixed(1)}" cy="${it.y.toFixed(1)}" r="2.5" />`
  })
  if (leadSvg.value) {
    leadSvg.value.innerHTML = svg
    leadSvg.value.style.opacity = lab.toFixed(3)
  }

  renderer.render(scene, camera)
}

function tick() {
  const root = rootRef.value, stage = stageRef.value
  if (!root || !stage) return
  const H = window.innerHeight
  const r = root.getBoundingClientRect()
  const travel = r.height - H
  const hold = Math.min(Math.max(-r.top, 0), travel)
  stage.style.transform = `translate3d(0, ${hold.toFixed(2)}px, 0)`
  if (r.bottom < 0 || r.top > H) return
  const p = clamp01(-r.top / (travel * 0.88)) // the last 12% holds the products heading on the light blue
  if (Math.abs(p - lastP) < 0.0004) return
  lastP = p

  const gl = seg(p, 0.0, 0.14) * (1 - seg(p, 0.4, 0.55))
  gridEls.forEach((el, i) => { if (el) { el.style.strokeDashoffset = String(1 - clamp01(gl * 1.4 - i * 0.04)); el.style.opacity = String(Math.min(1, gl * 1.5)) } })

  // headline copy, bottom-left, one block at a time (fade windows never overlap)
  const win = [[0, 0, 0.17, 0.2], [0.22, 0.25, 0.38, 0.41], [0.44, 0.47, 0.76, 0.79], [0.82, 0.85, 0.9, 0.92]]
  let idx = 0
  win.forEach(([i0, i1, o0, o1], i) => {
    const o = (i0 === i1 ? 1 : seg(p, i0, i1)) * (1 - seg(p, o0, o1))
    const el = stepEls[i]
    if (el) { el.style.opacity = o.toFixed(3); el.style.transform = `translate3d(0, ${((1 - o) * 14).toFixed(1)}px, 0)` }
    if (p >= i1 - 0.01) idx = i
  })
  if (idx !== stepIdx.value) stepIdx.value = idx

  // closing line: the flattened chamber becomes a white line, and the line opens into the light-blue page
  const lineIn = seg(p, 0.9, 0.94)
  const open = seg(p, 0.93, 0.995)
  const line = lineRef.value!
  line.style.opacity = lineIn.toFixed(3)
  line.style.width = `calc(2px + ${(open * 100).toFixed(3)}vw)`
  line.style.height = `${(70 + 34 * open).toFixed(2)}vh`
  const c = (a: number, b: number) => Math.round(a + (b - a) * open)
  line.style.background = `rgb(${c(255, 213)},${c(255, 230)},${c(255, 246)})`
  canvasRef.value!.style.opacity = String(1 - seg(p, 0.92, 0.95))
  stage.dataset.white = open > 0.5 ? '1' : ''
  nextRef.value!.style.visibility = open > 0.4 ? 'visible' : 'hidden'
  nextEls.forEach((w, i) => {
    const a = seg(p, 0.945 + i * 0.006, 0.975 + i * 0.006)
    w.style.opacity = a.toFixed(3)
    w.style.transform = `translate3d(0, ${((1 - a) * 0.4).toFixed(3)}em, 0)`
  })

  render(p)
}

onMounted(() => {
  buildScene(canvasRef.value!)
  resize()
  window.addEventListener('resize', resize)
  gsap.ticker.add(tick)
})
onUnmounted(() => {
  disposed = true
  window.removeEventListener('resize', resize)
  gsap.ticker.remove(tick)
  renderer?.dispose()
})
</script>

<style scoped>
.an-root { position: relative; height: 350vh; }
.an-stage { position: absolute; left: 0; right: 0; top: 0; height: 100vh; overflow: hidden; background: radial-gradient(ellipse 50% 58% at 50% 54%, #0f1a2c 0%, #070b13 50%, #000 80%); color: #fff; will-change: transform; }
.an-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }

.an-grid { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.an-gl { fill: none; stroke: rgba(255, 255, 255, 0.12); stroke-width: 1; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; }

.an-leaders { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0; }
.an-leaders :deep(path) { stroke: rgba(255, 255, 255, 0.4); stroke-width: 1; fill: none; }
.an-leaders :deep(circle) { fill: #fff; }
.an-labels { position: absolute; inset: 0; pointer-events: none; }
.an-label { position: absolute; left: 0; top: 0; display: flex; align-items: baseline; gap: 10px; max-width: 15vw; white-space: normal; opacity: 0; }
.an-label b { font-family: var(--font-body); font-weight: 400; font-size: 10px; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.45); }
.an-label span { font-family: var(--font-body); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255, 255, 255, 0.9); }

.an-steps { position: absolute; left: 5vw; bottom: 9vh; width: min(22vw, 340px); height: 0; pointer-events: none; }
.an-step { position: absolute; left: 0; bottom: 0; opacity: 0; }
.an-eyebrow { display: block; margin-bottom: 18px; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); }
.an-step h3 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(22px, 2.3vw, 44px); line-height: 1.04; letter-spacing: -0.045em; }
.an-step p { margin: 20px 0 0; max-width: 32ch; font-family: var(--font-body); font-size: clamp(12px, 0.95vw, 14px); line-height: 1.55; color: rgba(255, 255, 255, 0.62); }

.an-count { position: absolute; right: 5vw; top: 14vh; display: flex; align-items: center; gap: 12px; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; }
.an-count span { margin-right: 20px; color: rgba(255, 255, 255, 0.5); }
.an-count i { width: 1px; height: 12px; background: rgba(255, 255, 255, 0.4); }

.an-line { position: absolute; left: 50%; top: 50%; width: 2px; height: 70vh; transform: translate(-50%, -50%); background: #fff; opacity: 0; }

.an-next { position: absolute; left: 5vw; right: 5vw; top: 50%; transform: translateY(-50%); text-align: center; color: #0d2340; visibility: hidden; }
.an-next span { display: block; margin-bottom: 26px; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.55; }
.an-next h2 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(32px, 5.4vw, 104px); line-height: 1.02; letter-spacing: -0.05em; text-wrap: balance; }
.an-next i { font-style: normal; display: inline-block; margin: 0 0.13em; opacity: 0; }

@media (max-width: 800px) {
  .an-steps { width: 80vw; }
  .an-count { display: none; }
}
</style>
