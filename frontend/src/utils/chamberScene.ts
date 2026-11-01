import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'

/**
 * The products page's chambers, standing in a row on the floor like the range photograph.
 * The camera glides along the row as you scroll (after pmndrs' camera-scroll): it holds on each chamber,
 * then pulls back and swings across to the next, which comes forward out of the haze.
 * A series without its own 3D model stands in the row as its photograph (`image`), never as another product's model.
 * `update(f)` takes the scroll position in chambers (1.5 = halfway from the 2nd to the 3rd).
 */
export function createChamberScene(canvas: HTMLCanvasElement, items: { url?: string; image?: string; scale: number }[], small = false, haze = 0xd6e4f3) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !small, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.75))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  // neutral tone mapping keeps the white panels white
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 1
  renderer.shadowMap.enabled = !small
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  // the far chambers fade into the page's own light blue (the canvas is transparent over the page)
  scene.fog = new THREE.Fog(haze, 10, 19)
  const pmrem = new THREE.PMREMGenerator(renderer)
  // the light: a real photo studio, captured (Poly Haven's studio_kontrast_02, CC0, cut to 512 px; picked from 13 studios rendered side by side). The generated
  // studio stands in for the moment it takes to load.
  scene.environment = pmrem.fromScene(studio(), 0.02).texture
  scene.environmentIntensity = 1
  scene.environmentRotation.y = Math.PI // three.js reads a panorama half a turn from Blender; this matches the test renders
  new HDRLoader().load('/hdr/studio_512.hdr', (t: any) => {
    t.mapping = THREE.EquirectangularReflectionMapping
    const env = pmrem.fromEquirectangular(t).texture
    scene.environment?.dispose(); scene.environment = env; t.dispose()
  })

  // a soft key from the front left that travels with the camera, so every chamber is lit the same way
  const key = new THREE.DirectionalLight(0xffffff, 1.1) // mostly for the floor shadow; the studio does the modelling
  key.castShadow = !small
  key.shadow.mapSize.set(2048, 2048)
  key.shadow.radius = 8
  key.shadow.bias = -0.0003
  key.shadow.normalBias = 0.02
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -2, near: 1, far: 30 })
  const rim = new THREE.DirectionalLight(0xdce8ff, 0.5)
  scene.add(key, key.target, rim, rim.target, new THREE.HemisphereLight(0xffffff, 0xb8c6d8, 0.15))

  // the floor shows only the shadows; each chamber also gets a soft contact shadow, drawn once
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ color: 0x0d2340, opacity: 0.16 }))
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)
  const sc = document.createElement('canvas')
  sc.width = sc.height = 128
  const sg = sc.getContext('2d')!
  const grd = sg.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, 'rgba(13,35,64,0.5)'); grd.addColorStop(0.45, 'rgba(13,35,64,0.18)'); grd.addColorStop(1, 'rgba(13,35,64,0)')
  sg.fillStyle = grd; sg.fillRect(0, 0, 128, 128)
  const blobTex = new THREE.CanvasTexture(sc)

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60)
  const look = new THREE.Vector3()

  const H = 2.9 // a full-size chamber's height in world units
  const GAP = 7.5 // between chambers along the row: wide enough that only the next one shows, as a sliver in the haze
  const slots = items.map((it, i) => {
    const group = new THREE.Group(), spin = new THREE.Group()
    const blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false }))
    blob.rotation.x = -Math.PI / 2
    blob.position.y = 0.005
    group.add(spin, blob)
    group.position.x = i * GAP
    group.visible = false
    scene.add(group)
    // a model starts turned away and held there until intro() swings it round (touched far in the future = no settling yet)
    return { ...it, group, spin, blob, model: null as any, h: H * it.scale, rot: it.url ? 1.05 : 0, vel: 0, held: false, touched: it.url ? 1e9 : 0 }
  })

  const draco = new DRACOLoader()
  draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(draco)
  // each file loads once; chambers sharing a file share its geometry and materials
  const files = new Map<string, Promise<any>>()
  const load = (url: string) => {
    if (!files.has(url)) files.set(url, new Promise((res, rej) => loader.load(url, (g: any) => {
      g.scene.traverse((o: any) => {
        if (!o.isMesh) return
        o.castShadow = o.receiveShadow = !small
        const m = o.material
        // the touchscreen shows a live controller page, lit like a real screen: readable, not glaring
        if (m.name === 'HMI_Screen') { m.color.set(0x000000); m.emissive.set(0xffffff); m.emissiveMap = hmi.tex; m.emissiveIntensity = 0.85; m.roughness = 0.12; m.needsUpdate = true }
        // the cavity's LED light, seen through the window
        if (m.name === 'Cavity_Steel') m.emissiveIntensity = 2.2
        // the studio is bright; at full strength the black gloss reflects it as grey
        if (m.name === 'Gloss_Black') m.envMapIntensity = 0.35
      })
      res(g.scene)
    }, undefined, rej)))
    return files.get(url)!
  }
  const photo = new THREE.TextureLoader()
  const ready = Promise.all(slots.map(async (s) => {
    if (!s.url) {
      // the photograph, standing on the floor and facing the row, its own colours untouched by the lights
      const tex: any = await photo.loadAsync(s.image!)
      tex.colorSpace = THREE.SRGBColorSpace
      const a = tex.image.width / tex.image.height
      const m = new THREE.Mesh(new THREE.PlaneGeometry(s.h * a, s.h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.02, toneMapped: false }))
      m.position.y = s.h / 2
      s.spin.add(m)
      s.model = m
      s.blob.scale.set(s.h * a * 1.25, s.h * 0.55, 1)
      s.group.visible = true
      return
    }
    const m = (await load(s.url)).clone(true)
    // stand it on the floor, centred on its spot, sized to its slot
    const box = new THREE.Box3().setFromObject(m), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3())
    const k = s.h / size.y
    m.scale.setScalar(k)
    m.position.set(-c.x * k, -box.min.y * k, -c.z * k)
    s.spin.add(m)
    s.model = m
    s.blob.scale.set(size.x * k * 1.7, size.z * k * 1.35, 1)
    s.group.visible = true
  }))

  // on hover: two hand-drawn loops orbiting the chamber, passing behind it (after the A24 discs)
  const ink = new THREE.MeshBasicMaterial({ color: 0x0d2340, fog: false })
  const ring = new THREE.Group()
  const loops = [0, 1].map((k) => {
    const pts: any[] = []
    for (let j = 0; j <= 160; j++) {
      const u = j / 160, a = -0.6 + k * 2.2 + u * Math.PI * 2 * (1.12 + k * 0.05)
      // a pen line: the radius drifts, it rises and dips a little, and it overshoots its start
      const r = 1 + 0.05 * Math.sin(2 * a + k * 1.3) + 0.025 * Math.sin(5 * a + 0.7) + 0.07 * u - k * 0.05
      pts.push(new THREE.Vector3(Math.cos(a) * r, 0.07 * Math.sin(a + k * 2.1) + 0.025 * Math.sin(4 * a) + (u - 0.5) * 0.1, Math.sin(a) * r * 0.92))
    }
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 360, k ? 0.0016 : 0.0026, 5, false), ink)
    mesh.rotation.set(k ? 0.5 : 0.62, k * 1.1, k ? -0.22 : 0.14) // tipped toward the camera, so each loop reads as an ellipse
    mesh.renderOrder = 2
    ring.add(mesh)
    return mesh
  })
  ring.visible = false
  let ringOn = -1, ringP = 0
  const hover = (i: number) => { ringOn = i }

  let w = 0, h = 0
  function resize() {
    const W = canvas.clientWidth, Hh = canvas.clientHeight
    if (W === w && Hh === h) return
    w = W; h = Hh
    renderer.setSize(W, Hh, false)
    camera.aspect = W / Hh
    camera.updateProjectionMatrix()
  }

  const smooth = (a: number) => a * a * (3 - 2 * a)
  let cx = 0, cy = 0, now = 0, cur = 0
  const hmi = screenUI()
  // f: scroll position in chambers; px, py: pointer, -1..1; t: seconds
  function update(f: number, px: number, py: number, t: number) {
    resize()
    const tall = w / Math.max(1, h) < 1
    // between two chambers the camera pulls back and rises a little, then settles in front of the next
    const mid = Math.sin(Math.PI * (f - Math.floor(f)))
    const x = f * GAP
    cx += (px * 0.5 - cx) * 0.05; cy += (py * 0.25 - cy) * 0.05
    const dist = (tall ? 13.5 : 8.6) + mid * 2.2
    camera.position.set(x - 1.3 + cx, 1.75 + mid * 0.7 - cy, dist)
    look.set(x + (tall ? 0 : -0.35) + cx * 0.3, H * 0.44, 0)
    camera.lookAt(look)
    key.position.set(x - 4, 7, 6); key.target.position.set(x, 0, 0)
    rim.position.set(x + 6, 4, -5); rim.target.position.set(x, 1, 0)

    slots.forEach((s, i) => {
      const d = i - f
      s.group.visible = !!s.model && Math.abs(d) < 2.2
      if (!s.group.visible) return
      // the one in front turns a little toward the camera. A drag turns it like a turntable: it carries on with the
      // throw and slows down; a second after it was last touched (or once it is no longer in front) it comes back
      // round, the short way, to its resting pose.
      const near = 1 - smooth(Math.min(1, Math.abs(d)))
      if (!s.held) { s.rot += s.vel; s.vel *= 0.93 }
      if (!s.held && (t - s.touched > 1 || Math.abs(d) > 0.6)) {
        const home = Math.round(s.rot / (Math.PI * 2)) * Math.PI * 2
        s.rot += (home - s.rot) * 0.06; s.vel *= 0.8
      }
      s.spin.rotation.y = s.url ? -0.42 - 0.12 * near + s.rot + Math.sin(t * 0.3 + i) * 0.01 * near : 0 // a photograph only faces front
    })
    // the ring draws itself in around the hovered chamber, keeps turning, and undraws when the pointer leaves
    ringP += ((ringOn >= 0 ? 1 : 0) - ringP) * 0.06
    const rs = slots[ringOn >= 0 ? ringOn : cur]
    if (ringP > 0.01 && rs?.model) {
      if (ring.parent !== rs.group) rs.group.add(ring)
      const box = new THREE.Box3().setFromObject(rs.spin), sz = box.getSize(new THREE.Vector3())
      ring.scale.setScalar(Math.hypot(sz.x, sz.z) * 0.46)
      ring.position.y = sz.y * 0.46
      ring.rotation.y = t * 0.22
      loops.forEach((m, k) => { const n = m.geometry.index.count; m.geometry.setDrawRange(0, Math.floor(n * smooth(Math.min(1, Math.max(0, ringP * 1.15 - k * 0.15))) / 6) * 6) })
      ring.visible = true
    } else ring.visible = false
    cur = Math.round(f)
    if (t - hmi.at > 0.2) hmi.draw(t)
    renderer.render(scene, camera)
    now = t
  }

  // the chamber under a screen point, or -1
  const ray = new THREE.Raycaster()
  function pick(px: number, py: number) {
    const r = canvas.getBoundingClientRect()
    ray.setFromCamera(new THREE.Vector2(((px - r.left) / r.width) * 2 - 1, -((py - r.top) / r.height) * 2 + 1), camera)
    let best = -1, dist = Infinity
    slots.forEach((s, i) => {
      if (!s.group.visible || !s.model) return
      const hit = ray.intersectObject(s.model, true)[0]
      if (hit && hit.distance < dist) { dist = hit.distance; best = i }
    })
    return best
  }
  // a horizontal drag of dx pixels turns the chamber at index i; release lets it run on with the last movement
  const spin = (i: number, dx: number) => { const s = slots[i]; if (!s?.url) return; const a = dx * 0.008; s.held = true; s.rot += a; s.vel = a; s.touched = now }
  const release = (i: number) => { const s = slots[i]; if (s && s.held) { s.held = false; s.touched = now } }
  // the first look: the chamber starts turned away and swings round to face you, so it reads as 3D straight away
  const intro = (i: number) => { const s = slots[i]; if (s?.url) { s.vel = 0; s.touched = now - 0.75 } }

  function dispose() {
    renderer.dispose(); pmrem.dispose(); blobTex.dispose(); draco.dispose(); hmi.tex.dispose()
  }
  return { ready, update, pick, spin, release, hover, intro, dispose }
}

// a photo studio, as an environment: a dim grey room with a big softbox overhead, tall strips either side and a
// low bounce in front. It is what white paint and black gloss reflect, so it gives them their soft studio gradients.
function studio() {
  const room = new THREE.Scene()
  const box = new THREE.Mesh(new THREE.BoxGeometry(20, 12, 20), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.32, 0.34, 0.37), side: THREE.BackSide }))
  box.position.y = 4
  room.add(box)
  const panel = (w: number, h: number, k: number, x: number, y: number, z: number, rx: number, ry: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 1, 1).multiplyScalar(k), side: THREE.DoubleSide }))
    m.position.set(x, y, z); m.rotation.set(rx, ry, 0); room.add(m)
  }
  panel(8, 6, 6, 0, 9.5, 0, Math.PI / 2, 0)           // overhead softbox
  panel(1.6, 8, 5, -7, 4, 2, 0, Math.PI / 2)          // left strip
  panel(1.6, 8, 3.5, 7, 4, -1, 0, -Math.PI / 2)       // right strip, a little weaker
  panel(10, 2.5, 1.6, 0, 1.5, 9, 0, Math.PI)          // low bounce card in front
  panel(6, 1.2, 4, 0, 6, -9, 0, 0)                    // rim strip behind
  return room
}

// the controller page on the door's touchscreen: process value, set point, humidity and a running trace
function screenUI() {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 352
  const g = c.getContext('2d')!
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.flipY = false // glTF texture convention
  const trace: number[] = []
  const ui = {
    tex, at: -1,
    draw(t: number) {
      ui.at = t
      const pv = 55 * Math.sin(t * 0.12) - 5 + Math.sin(t * 1.3) * 0.4
      trace.push(pv); if (trace.length > 120) trace.shift()
      g.fillStyle = '#0a1726'; g.fillRect(0, 0 , 512, 352)
      g.fillStyle = '#12263d'; g.fillRect(0, 0, 512, 40)
      g.fillStyle = '#9fb6cf'; g.font = '600 15px Arial'; g.fillText('ENVISYS', 16, 26)
      g.fillStyle = '#6f879f'; g.font = '13px Arial'; g.fillText('PROGRAM 03 · STEP 2/6', 150, 26)
      g.fillStyle = '#3ddc84'; g.beginPath(); g.arc(470, 20, 6, 0, 7); g.fill()
      g.fillStyle = '#9fb6cf'; g.font = '12px Arial'; g.fillText('RUN', 432, 25)
      g.fillStyle = '#6f879f'; g.font = '13px Arial'; g.fillText('TEMPERATURE °C', 18, 72); g.fillText('HUMIDITY %RH', 300, 72)
      g.fillStyle = '#e8f1fb'; g.font = '600 56px Arial'; g.fillText(pv.toFixed(1), 16, 130)
      g.fillStyle = '#e8f1fb'; g.font = '600 40px Arial'; g.fillText((60 + 8 * Math.sin(t * 0.07)).toFixed(0), 300, 126)
      g.fillStyle = '#6f879f'; g.font = '14px Arial'; g.fillText('SV  50.0', 18, 156); g.fillText('SV  60', 300, 156)
      g.strokeStyle = '#1d3550'; g.lineWidth = 1
      for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(16, 186 + k * 32); g.lineTo(496, 186 + k * 32); g.stroke() }
      g.strokeStyle = '#4fb3ff'; g.lineWidth = 2.5; g.beginPath()
      trace.forEach((v, k) => { const x = 16 + (k / 119) * 480, y = 266 - v * 1.1; k ? g.lineTo(x, y) : g.moveTo(x, y) })
      g.stroke()
      ;['START', 'HOLD', 'PROGRAM', 'MENU'].forEach((b, k) => {
        g.fillStyle = k === 0 ? '#1f6fb2' : '#16304b'; g.fillRect(16 + k * 122, 304, 112, 36)
        g.fillStyle = '#dce8f5'; g.font = '13px Arial'; g.fillText(b, 30 + k * 122, 327)
      })
      tex.needsUpdate = true
    }
  }
  ui.draw(0)
  return ui
}
