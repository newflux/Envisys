<template>
  <!-- A tall spacer; the stage inside it is held on screen while the door is drawn, built,
       exploded, collapsed to a single line, and that line opens to white. -->
  <section class="an-root" ref="rootRef">
    <div class="an-stage" ref="stageRef">
      <canvas ref="canvasRef" class="an-canvas"></canvas>

      <svg class="an-grid" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path v-for="(d, i) in gridPaths" :key="i" :d="d" pathLength="1" class="an-gl" :ref="(el) => (gridEls[i] = el as SVGPathElement)" />
      </svg>

      <!-- Layer labels, placed each frame by projecting the layer's anchor -->
      <div class="an-labels">
        <div v-for="(l, i) in labelDefs" :key="l.text" class="an-label" :ref="(el) => (labelEls[i] = el as HTMLElement)">
          <i></i><span>{{ l.text }}</span>
        </div>
      </div>

      <div class="an-steps">
        <div v-for="(s, i) in steps" :key="s.title" class="an-step" :class="`an-step-${i}`" :ref="(el) => (stepEls[i] = el as HTMLElement)">
          <h3>{{ s.title }}</h3>
          <p>{{ s.body }}</p>
        </div>
      </div>
      <div class="an-count"><span>{{ stepName }}</span><b>0{{ stepIdx + 1 }}</b><i></i><b>04</b></div>

      <!-- The closing line and its spread to white -->
      <div class="an-line" ref="lineRef"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// Every label is a feature listed on envisystech.com (ET-series construction).
const labelDefs = [
  { key: 'skin', text: 'Powder-coated CRCS exterior' },
  { key: 'hinge', text: 'Die-cast aluminium hinges' },
  { key: 'heater', text: 'De-fog heaters + LED light' },
  { key: 'glass', text: 'Multi-pane vacuumised glass' },
  { key: 'liner', text: 'High-grade stainless interior' },
  { key: 'seal', text: 'Double-layer silicone seal' }
]
const steps = [
  { name: 'Drawing', title: 'Drawn for the test.', body: 'Every chamber starts as a drawing, sized to the volume, the ports and the range it has to hold.' },
  { name: 'Build', title: 'Built to hold.', body: '−70°C to +180°C and 10–95% RH, held to ±1°C behind a single door.' },
  { name: 'Anatomy', title: 'Every layer has a job.', body: 'Nothing on the door is decoration. Each part keeps the test in and the room out.' },
  { name: 'Resolution', title: 'Then it disappears.', body: 'Close it, and all of it becomes one line between your product and the test.' }
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
const gridEls: SVGPathElement[] = []
const labelEls: HTMLElement[] = []
const stepEls: HTMLElement[] = []
const stepIdx = ref(0)
const stepName = ref(steps[0].name)

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number) => a * a * (3 - 2 * a)
const seg = (p: number, a: number, b: number) => smooth(clamp01((p - a) / (b - a)))

// ── scene ──
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene, camera: THREE.PerspectiveCamera, door: THREE.Group
type Layer = { key: string; group: THREE.Group; mats: THREE.MeshStandardMaterial[]; lines: THREE.LineSegments[]; z: number; spread: THREE.Vector3; anchor: THREE.Vector3; baseOpacity: number[] }
const layers: Layer[] = []
let keyLight: THREE.DirectionalLight

const W = 1.0, HT = 1.45, WIN_W = 0.5, WIN_H = 0.52, WIN_Y = 0.2

function rectShape(w: number, h: number, r = 0.02, cx = 0, cy = 0) {
  const s = new THREE.Shape()
  const x = cx - w / 2, y = cy - h / 2
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y)
  return s
}
function panelWithWindow(w: number, h: number, depth: number, holeW = WIN_W, holeH = WIN_H) {
  const s = rectShape(w, h, 0.03)
  s.holes.push(rectShape(holeW, holeH, 0.02, 0, WIN_Y) as unknown as THREE.Path)
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 6 })
  g.translate(0, 0, -depth / 2)
  return g
}
function frameGeo(outW: number, outH: number, inW: number, inH: number, depth: number) {
  const s = rectShape(outW, outH, 0.02, 0, WIN_Y)
  s.holes.push(rectShape(inW, inH, 0.015, 0, WIN_Y) as unknown as THREE.Path)
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 4 })
  g.translate(0, 0, -depth / 2)
  return g
}
function sealGeo(w: number, h: number, r: number) {
  const pts: THREE.Vector3[] = []
  const shape = rectShape(w, h, 0.05)
  shape.getSpacedPoints(160).forEach((p) => pts.push(new THREE.Vector3(p.x, p.y, 0)))
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 220, r, 8, true)
}

function addLayer(key: string, parts: { geo: THREE.BufferGeometry; mat: THREE.MeshStandardMaterial; pos?: [number, number, number] }[], z: number, spread: [number, number, number], anchor: [number, number, number]) {
  const group = new THREE.Group()
  const mats: THREE.MeshStandardMaterial[] = []
  const lines: THREE.LineSegments[] = []
  const baseOpacity: number[] = []
  parts.forEach(({ geo, mat, pos }) => {
    const m = new THREE.Mesh(geo, mat)
    if (pos) m.position.set(...pos)
    mat.transparent = true
    baseOpacity.push(mat.opacity)
    mats.push(mat)
    group.add(m)
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 24), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }))
    if (pos) e.position.set(...pos)
    lines.push(e)
    group.add(e)
  })
  group.position.z = z
  door.add(group)
  layers.push({ key, group, mats, lines, z, spread: new THREE.Vector3(...spread), anchor: new THREE.Vector3(...anchor), baseOpacity })
}

function buildScene(canvas: HTMLCanvasElement) {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.setClearColor(0x000000, 1)
  renderer.toneMapping = THREE.NeutralToneMapping
  scene = new THREE.Scene()
  const pm = new THREE.PMREMGenerator(renderer)
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture
  camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50)
  keyLight = new THREE.DirectionalLight(0xffffff, 0)
  keyLight.position.set(2, 3, 4)
  scene.add(keyLight)
  door = new THREE.Group()
  scene.add(door)

  const metal = (c: number, rough: number, metalness = 0.6) => new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness })
  // front → back
  addLayer('skin', [
    { geo: panelWithWindow(W, HT, 0.03), mat: metal(0xcfd2d6, 0.55, 0.2) },
    { geo: new THREE.CylinderGeometry(0.016, 0.016, 0.62, 16), mat: metal(0x1b1c1f, 0.35, 0.6), pos: [0.4, -0.02, 0.06] }
  ], 0.075, [0, 0, 0.62], [W / 2, HT / 2, 0])
  addLayer('hinge', [
    { geo: new THREE.BoxGeometry(0.05, 0.16, 0.07), mat: metal(0x9da1a6, 0.3, 0.9), pos: [-0.525, 0.42, 0] },
    { geo: new THREE.BoxGeometry(0.05, 0.16, 0.07), mat: metal(0x9da1a6, 0.3, 0.9), pos: [-0.525, -0.42, 0] }
  ], 0.06, [-0.62, 0, 0.62], [-0.55, 0.5, 0])
  const led = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xff6a1a, emissiveIntensity: 1.6, roughness: 0.4 })
  addLayer('heater', [
    { geo: frameGeo(WIN_W + 0.1, WIN_H + 0.1, WIN_W, WIN_H, 0.008), mat: metal(0x3a3c40, 0.5, 0.4) },
    { geo: new THREE.BoxGeometry(WIN_W - 0.04, 0.012, 0.01), mat: led, pos: [0, WIN_Y + WIN_H / 2 + 0.025, 0.006] }
  ], 0.035, [0, 0, 0.38], [WIN_W / 2 + 0.05, WIN_Y + WIN_H / 2 + 0.05, 0])
  const glassMat = () => new THREE.MeshStandardMaterial({ color: 0xbcd8ee, roughness: 0.05, metalness: 0.1, opacity: 0.22 })
  addLayer('glass', [
    { geo: new THREE.BoxGeometry(WIN_W + 0.02, WIN_H + 0.02, 0.006), mat: glassMat(), pos: [0, WIN_Y, 0.03] },
    { geo: new THREE.BoxGeometry(WIN_W + 0.02, WIN_H + 0.02, 0.006), mat: glassMat(), pos: [0, WIN_Y, 0] },
    { geo: new THREE.BoxGeometry(WIN_W + 0.02, WIN_H + 0.02, 0.006), mat: glassMat(), pos: [0, WIN_Y, -0.03] }
  ], 0.0, [0, 0, 0.14], [WIN_W / 2, WIN_Y - WIN_H / 2, 0])
  addLayer('liner', [{ geo: panelWithWindow(W - 0.08, HT - 0.08, 0.012), mat: metal(0xc8ccd1, 0.24, 1.0) }], -0.05, [0, 0, -0.34], [(W - 0.08) / 2, -(HT - 0.08) / 2, 0])
  addLayer('seal', [
    { geo: sealGeo(W - 0.12, HT - 0.12, 0.009), mat: metal(0x141416, 0.7, 0.0) },
    { geo: sealGeo(W - 0.2, HT - 0.2, 0.009), mat: metal(0x141416, 0.7, 0.0) }
  ], -0.068, [0, 0, -0.62], [-(W - 0.12) / 2, -(HT - 0.12) / 2, 0])
}

function resize() {
  if (!renderer || !stageRef.value) return
  const w = stageRef.value.clientWidth, h = stageRef.value.clientHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}

const v = new THREE.Vector3()
let lastP = -1
function render(p: number) {
  if (!renderer) return
  const draw = seg(p, 0.02, 0.22)          // hairlines draw in
  const build = seg(p, 0.2, 0.4)           // surfaces fill in and light up
  const explode = seg(p, 0.42, 0.62) * (1 - seg(p, 0.72, 0.84))
  const edge = seg(p, 0.72, 0.86)          // turn edge-on and flatten into a line
  const whiten = seg(p, 0.78, 0.86)

  // camera: 3/4 front → more side while exploded → exactly side-on at the end
  const yaw = THREE.MathUtils.degToRad(22 + 30 * seg(p, 0.42, 0.62) + 38 * edge)
  const dist = 4.6 - 0.5 * build + 0.4 * explode
  camera.position.set(Math.sin(yaw) * dist, 0.16 * (1 - edge), Math.cos(yaw) * dist)
  camera.lookAt(0, 0.02 * (1 - edge), 0)
  const w = renderer.domElement.width, h = renderer.domElement.height
  camera.setViewOffset(w, h, -w * 0.13 * explode, 0, w, h)
  door.scale.z = 1 - 0.94 * edge
  door.rotation.y = 0
  keyLight.intensity = 2.4 * build

  layers.forEach((L) => {
    L.group.position.set(L.spread.x * explode, L.spread.y * explode, L.z + L.spread.z * explode)
    L.mats.forEach((m, i) => {
      const base = L.baseOpacity[i]
      m.opacity = base * build * (1 - whiten) + whiten
      m.emissive.setRGB(whiten, whiten, whiten)
      m.depthWrite = m.opacity > 0.95
    })
    L.lines.forEach((ln) => {
      const g = ln.geometry as THREE.BufferGeometry
      g.setDrawRange(0, Math.floor((g.attributes.position.count * draw) / 2) * 2)
      ;(ln.material as THREE.LineBasicMaterial).opacity = 0.9 - 0.75 * build
    })
  })

  // labels
  const lab = seg(p, 0.5, 0.58) * (1 - seg(p, 0.68, 0.74))
  const rect = stageRef.value!.getBoundingClientRect()
  labelDefs.forEach((d, i) => {
    const el = labelEls[i]
    const L = layers.find((x) => x.key === d.key)
    if (!el || !L) return
    v.copy(L.anchor).applyMatrix4(L.group.matrixWorld).project(camera)
    el.style.transform = `translate3d(${((v.x * 0.5 + 0.5) * rect.width).toFixed(1)}px, ${((-v.y * 0.5 + 0.5) * rect.height).toFixed(1)}px, 0)`
    el.style.opacity = lab.toFixed(3)
  })

  renderer.render(scene, camera)
}

function tick() {
  const root = rootRef.value, stage = stageRef.value
  if (!root || !stage) return
  const H = window.innerHeight
  const r = root.getBoundingClientRect()
  const travel = r.height - H
  // hold the stage on screen while the spacer passes
  const hold = Math.min(Math.max(-r.top, 0), travel)
  stage.style.transform = `translate3d(0, ${hold.toFixed(2)}px, 0)`
  if (r.bottom < 0 || r.top > H) return
  const p = clamp01(-r.top / travel)
  if (Math.abs(p - lastP) < 0.0004) return
  lastP = p

  // construction lines
  const gl = seg(p, 0.0, 0.18) * (1 - seg(p, 0.4, 0.55))
  gridEls.forEach((el, i) => { if (el) { el.style.strokeDashoffset = String(1 - clamp01(gl * 1.4 - i * 0.04)); el.style.opacity = String(Math.min(1, gl * 1.5)) } })

  // copy
  const bounds = [[0.0, 0.2], [0.22, 0.4], [0.44, 0.68], [0.72, 0.86]]
  let idx = 0
  bounds.forEach(([a, b], i) => {
    const o = seg(p, a - 0.04, a + 0.02) * (1 - seg(p, b, b + 0.04))
    const el = stepEls[i]
    if (el) { el.style.opacity = o.toFixed(3); el.style.transform = `translate3d(0, ${((1 - o) * 16).toFixed(1)}px, 0)` }
    if (p >= a - 0.02) idx = i
  })
  if (idx !== stepIdx.value) { stepIdx.value = idx; stepName.value = steps[idx].name }

  // closing line: appears as the door goes edge-on, then opens to fill the screen with white
  const lineIn = seg(p, 0.84, 0.88)
  const open = seg(p, 0.88, 0.99)
  const line = lineRef.value!
  line.style.opacity = lineIn.toFixed(3)
  line.style.width = `calc(2px + ${(open * 100).toFixed(3)}vw)`
  line.style.height = `${(62 + 42 * open).toFixed(2)}vh`
  canvasRef.value!.style.opacity = String(1 - seg(p, 0.86, 0.9))
  stage.dataset.white = open > 0.5 ? '1' : ''

  render(p)
}

onMounted(() => {
  buildScene(canvasRef.value!)
  resize()
  window.addEventListener('resize', resize)
  gsap.ticker.add(tick)
})
onUnmounted(() => {
  window.removeEventListener('resize', resize)
  gsap.ticker.remove(tick)
  renderer?.dispose()
})
</script>

<style scoped>
.an-root { position: relative; height: 420vh; }
.an-stage { position: absolute; left: 0; right: 0; top: 0; height: 100vh; overflow: hidden; background: #000; color: #fff; will-change: transform; }
.an-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }

.an-grid { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.an-gl { fill: none; stroke: rgba(255, 255, 255, 0.16); stroke-width: 1; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; }

.an-labels { position: absolute; inset: 0; pointer-events: none; }
.an-label { position: absolute; left: 0; top: 0; display: flex; align-items: center; gap: 10px; opacity: 0; white-space: nowrap; will-change: transform; }
.an-label i { display: block; width: 5px; height: 5px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.15); margin: -2.5px 0 0 -2.5px; }
.an-label span { font-family: var(--font-body); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255, 255, 255, 0.85); padding-left: 16px; border-left: 1px solid rgba(255, 255, 255, 0.35); }

.an-steps { position: absolute; inset: 0; pointer-events: none; }
.an-step { position: absolute; max-width: 30vw; opacity: 0; }
.an-step h3 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(26px, 3.2vw, 60px); line-height: 1.04; letter-spacing: -0.04em; }
.an-step p { margin: 22px 0 0; max-width: 34ch; font-family: var(--font-body); font-size: clamp(12px, 1vw, 15px); line-height: 1.55; color: rgba(255, 255, 255, 0.65); }
.an-step-0 { left: 5vw; top: 42vh; }
.an-step-1 { right: 5vw; top: 22vh; }
.an-step-2 { left: 5vw; top: 16vh; }
.an-step-3 { right: 5vw; top: 22vh; }

.an-count { position: absolute; right: 5vw; bottom: 5vh; display: flex; align-items: center; gap: 12px; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; }
.an-count span { margin-right: 24px; color: rgba(255, 255, 255, 0.6); }
.an-count i { width: 1px; height: 12px; background: rgba(255, 255, 255, 0.4); }

.an-line { position: absolute; left: 50%; top: 50%; width: 2px; height: 62vh; transform: translate(-50%, -50%); background: #fff; opacity: 0; }

@media (max-width: 800px) {
  .an-step { max-width: 80vw; }
  .an-step-1, .an-step-3 { right: auto; left: 5vw; top: 12vh; }
}
</style>
