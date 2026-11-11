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
    // a model waits facing straight at you (0.54 cancels the resting angle) until intro() turns it into its resting angle (touched far in the future = no settling yet)
    return { ...it, group, spin, blob, model: null as any, h: H * it.scale, rot: it.url ? 0.54 : 0, goal: 0, vel: 0, held: false, touched: it.url ? 1e9 : 0,
      door: null as any, doorQ: new THREE.Quaternion(), doorSign: -1, doorOpen: 0, edge: null as { x: number; z: number; y0: number; y1: number } | null }
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
    // the door (exported as its own node, pivoting on its hinge edge): it eases open on hover
    const door = m.getObjectByName('Door')
    if (door) {
      // the door node keeps a turn from the CAD import, so it swings about its parent's vertical (the chamber's own up), not its local axis
      s.door = door; s.doorQ = door.quaternion.clone()
      const right = door.userData?.hinge === 'right'
      s.doorSign = right ? 1 : -1 // the free edge swings out toward the camera (the front is +Z)
      m.updateWorldMatrix(true, true)
      const inv = door.parent.matrixWorld.clone().invert(), bb = new THREE.Box3()
      door.traverse((o: any) => { if (o.isMesh) { o.geometry.computeBoundingBox(); bb.union(o.geometry.boundingBox.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld))) } })
      s.edge = { x: right ? bb.min.x : bb.max.x, z: bb.max.z, y0: bb.min.y, y1: bb.max.y }
    }
    s.group.visible = true
  }))

  // cold mist: on hover it spills from the gap of the opened door, falls (it is colder than the room) and spreads over the floor
  const soft = (n: number, blobs: number, seed: number) => {
    const c = document.createElement('canvas'); c.width = c.height = n
    const g = c.getContext('2d')!
    let r = seed; const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280)
    for (let k = 0; k < blobs; k++) {
      const x = n * (0.3 + rnd() * 0.4), y = n * (0.3 + rnd() * 0.4), rad = n * (0.18 + rnd() * 0.22)
      const gr = g.createRadialGradient(x, y, 0, x, y, rad)
      gr.addColorStop(0, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = gr; g.fillRect(0, 0, n, n)
    }
    return new THREE.CanvasTexture(c)
  }
  const puffTex = soft(128, 6, 7)
  const puffs = small ? [] : Array.from({ length: 34 }, () => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex, color: 0xffffff, transparent: true, depthWrite: false, opacity: 0, fog: false }))
    sp.visible = false; scene.add(sp)
    return { sp, age: 0, life: 1, v: new THREE.Vector3(), s0: 0, s1: 0 }
  })
  let hoverIdx = -1, emit = 0
  const hover = (i: number) => { hoverIdx = i }
  const tmp = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0), swing = new THREE.Quaternion()

  // a faint mist lying over the floor all along the row, drifting: the pale blue reads as a cold room, not a flat colour
  const hazeTex = (() => {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 256
    const g = c.getContext('2d')!
    let r = 3; const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280)
    for (let k = 0; k < 90; k++) {
      const x = rnd() * 1024, y = 150 + rnd() * 110, rad = 60 + rnd() * 120
      const gr = g.createRadialGradient(x, y, 0, x, y, rad)
      gr.addColorStop(0, 'rgba(255,255,255,0.22)'); gr.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = gr; g.fillRect(0, 0, 1024, 256)
    }
    // copy the left edge over the right so the strip tiles without a seam
    g.globalCompositeOperation = 'destination-in'
    const fade = g.createLinearGradient(0, 0, 0, 256); fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(0.55, 'rgba(0,0,0,0.6)'); fade.addColorStop(1, 'rgba(0,0,0,1)')
    g.fillStyle = fade; g.fillRect(0, 0, 1024, 256)
    const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping
    return t
  })()
  const hazes = small ? [] : [[-2.4, 0.5], [1.6, 0.38], [3.4, 0.26]].map(([z, o], k) => {
    const t = hazeTex.clone(); t.needsUpdate = true; t.wrapS = THREE.RepeatWrapping; t.repeat.x = items.length + 3; t.offset.x = k * 0.37
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(GAP * (items.length + 3), H * 0.62), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, opacity: o, fog: false }))
    pl.position.set(GAP * (items.length - 1) / 2, H * 0.24, z); pl.renderOrder = 3; scene.add(pl)
    return { pl, t, k }
  })


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
  let cx = 0, cy = 0, now = 0, dt = 1 / 60
  const hmi = screenUI()
  // f: scroll position in chambers; px, py: pointer, -1..1; t: seconds
  function update(f: number, px: number, py: number, t: number) {
    resize()
    dt = Math.min(0.05, Math.max(0.001, t - now || 1 / 60))
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
      // All of it runs on elapsed time (rad, rad/s), so it feels the same at 60 and 120 Hz.
      const near = 1 - smooth(Math.min(1, Math.abs(d)))
      if (s.held) {
        // the drag sets a goal; the chamber follows it closely, so uneven pointer events never show as jitter
        const r = s.rot
        s.rot += (s.goal - s.rot) * (1 - Math.exp(-dt * 22))
        s.vel += ((s.rot - r) / dt - s.vel) * (1 - Math.exp(-dt * 12)) // the throw is the recent average, not the last event
      } else if (t - s.touched < 1 && Math.abs(d) < 0.6) {
        s.vel *= Math.exp(-dt * 2.6) // coasting on the throw
        s.rot += s.vel * dt
      } else {
        // home, the short way, on a spring that overshoots a touch and settles
        const home = Math.round(s.rot / (Math.PI * 2)) * Math.PI * 2
        s.vel += (-38 * (s.rot - home) - 2 * 0.78 * Math.sqrt(38) * s.vel) * dt
        s.rot += s.vel * dt
      }
      s.spin.rotation.y = s.url ? -0.42 - 0.12 * near + s.rot + Math.sin(t * 0.3 + i) * 0.01 * near : 0 // a photograph only faces front
    })
    // the door eases open while the pointer is on its chamber, and closes after
    slots.forEach((s, i) => {
      if (!s.door) return
      // only while it stands still: a drag or a spin closes it again
      const still = !s.held && Math.abs(s.vel) < 0.3
      const want = i === hoverIdx && Math.abs(i - f) < 0.35 && still ? 1 : 0
      s.doorOpen += (want - s.doorOpen) * (1 - Math.exp(-dt * (want ? 2.4 : 3.6)))
      s.door.quaternion.copy(swing.setFromAxisAngle(UP, s.doorSign * 0.15 * smooth(Math.min(1, s.doorOpen)))).multiply(s.doorQ) // about 9 degrees: ajar, not open
    })
    // mist from the opened gap
    const hs = slots[hoverIdx]
    const calm = !!hs && !hs.held && Math.abs(hs.vel) < 0.3
    if (puffs.length && hs?.door && hs.edge && hs.doorOpen > 0.35 && calm) {
      emit += dt * 9 * Math.min(1, hs.doorOpen) // a medium breath, not a flood
      while (emit >= 1) {
        emit -= 1
        const pf = puffs.find((q) => !q.sp.visible); if (!pf) break
        const e = hs.edge, y = e.y0 + (0.12 + Math.random() * 0.8) * (e.y1 - e.y0)
        hs.door.parent.localToWorld(tmp.set(e.x, y, e.z + 0.02))
        pf.sp.position.copy(tmp); pf.sp.visible = true
        pf.age = 0; pf.life = 1.8 + Math.random() * 1.0
        pf.v.set((Math.random() - 0.5) * 0.12, -0.12 - Math.random() * 0.12, 0.12 + Math.random() * 0.14) // it slips out of the gap and falls close to the door
        pf.s0 = hs.h * 0.04; pf.s1 = hs.h * (0.16 + Math.random() * 0.14)
      }
    }
    for (const pf of puffs) {
      if (!pf.sp.visible) continue
      pf.age += dt * (calm ? 1 : 4) // when the chamber is turned, what is out fades away quickly
      if (pf.age >= pf.life) { pf.sp.visible = false; continue }
      pf.v.y -= 0.55 * dt // cold air sinks
      pf.v.multiplyScalar(Math.exp(-dt * 0.7))
      pf.sp.position.addScaledVector(pf.v, dt)
      if (pf.sp.position.y < H * 0.06) { pf.sp.position.y = H * 0.06; pf.v.y = 0; pf.v.x *= 1.01; pf.v.z *= 1.01 } // and rolls over the floor
      const u = pf.age / pf.life
      const sz = pf.s0 + (pf.s1 - pf.s0) * smooth(Math.min(1, u * 1.4))
      pf.sp.scale.set(sz * 1.5, sz, 1)
      ;(pf.sp.material as any).opacity = 0.34 * Math.sin(Math.PI * Math.min(1, u * 1.15)) * (1 - u * 0.4)
    }
    for (const hz of hazes) hz.t.offset.x += dt * (0.003 + hz.k * 0.002)

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
  const spin = (i: number, dx: number) => { const s = slots[i]; if (!s?.url) return; if (!s.held) { s.held = true; s.goal = s.rot } s.goal += dx * 0.009; s.touched = now }
  const release = (i: number) => { const s = slots[i]; if (s && s.held) { s.held = false; s.touched = now; s.vel = Math.max(-9, Math.min(9, s.vel)) } }
  // the first look: straight on, then it turns into its three-quarter pose, so it reads as 3D straight away
  const intro = (i: number) => { const s = slots[i]; if (s?.url) { s.vel = 0; s.touched = now - 1 } } // from facing you, one easy turn to its usual three-quarter pose

  function dispose() {
    renderer.dispose(); pmrem.dispose(); blobTex.dispose(); draco.dispose(); hmi.tex.dispose(); puffTex.dispose(); hazeTex.dispose(); hazes.forEach((h) => h.t.dispose())
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
export function screenUI() {
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
