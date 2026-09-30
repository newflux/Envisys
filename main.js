import './style.css'
import gsap from 'gsap'
import Lenis from 'lenis'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// ── 1. Lenis on #scroller (the actual scroll container) ──
const scrollerEl = document.querySelector('#scroller')
let lenis = null
if (scrollerEl) {
  lenis = new Lenis({ wrapper: scrollerEl, content: scrollerEl.firstElementChild })
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf) }
  requestAnimationFrame(raf)
}

// ── 2. Preloader with typing text ──
const preloader = document.querySelector('.preloader')
const progressBar = document.querySelector('.preloader__progress')
const preloaderTextSpan = document.querySelector('.preloader__text span:first-child')

if (preloader && preloaderTextSpan) {
  const phrases = ['film', 'television', 'music']
  const baseText = 'Positioned at the axis of talent and content across '
  let charIndex = 0
  let phraseIndex = 0
  const fullText = baseText + phrases[phraseIndex]

  // Type out the text
  const typeInterval = setInterval(() => {
    if (charIndex <= fullText.length) {
      preloaderTextSpan.textContent = fullText.slice(0, charIndex)
      charIndex++
    } else {
      clearInterval(typeInterval)
    }
  }, 30)

  gsap.to(progressBar, {
    scaleX: 1,
    duration: 2.5,
    ease: 'power2.inOut',
    onComplete: () => {
      clearInterval(typeInterval)
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => { preloader.style.display = 'none' }
      })
    }
  })
}

// ── 3. Custom Cursor ──
const cursorEl = document.querySelector('.cursor')
const cursorInner = document.querySelector('.cursor__inner')
const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
const mouseNDC = new THREE.Vector2(0, 0)

if (cursorInner) {
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
    mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1
    mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1
    gsap.to(cursorInner, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' })
  })
}

// ── 4. Night Mode Toggle ──
const modeSwitcher = document.querySelector('.nightmode-label')
const startScreen = document.querySelector('.start-screen')
let isNightMode = false
if (modeSwitcher && startScreen) {
  modeSwitcher.addEventListener('click', () => {
    isNightMode = startScreen.classList.toggle('night-mode')
  })
}

// ── 5. FAQ Popup ──
const faqBtn = document.querySelector('.start-header__navigation-item:last-child button')
const faqPopup = document.querySelector('.popup.faq')
const faqCloseBtn = document.querySelector('.faq__close-button')

if (faqBtn && faqPopup && faqCloseBtn) {
  faqPopup.style.display = 'none'
  faqBtn.addEventListener('click', () => {
    faqPopup.style.display = 'block'
    gsap.fromTo(faqPopup, { opacity: 0 }, { opacity: 1, duration: 0.4 })
  })
  faqCloseBtn.addEventListener('click', () => {
    gsap.to(faqPopup, { opacity: 0, duration: 0.4, onComplete: () => { faqPopup.style.display = 'none' } })
  })
}

// ── 6. FAQ Accordion ──
document.querySelectorAll('.faq__item').forEach(item => {
  const title = item.querySelector('.faq__item-title')
  const wrap = item.querySelector('.faq__item-text-wrapper')
  if (!title || !wrap) return
  title.addEventListener('click', () => {
    const open = item.classList.contains('opened')
    document.querySelectorAll('.faq__item.opened').forEach(o => {
      if (o !== item) { o.classList.remove('opened'); gsap.to(o.querySelector('.faq__item-text-wrapper'), { height: 0, duration: 0.4 }) }
    })
    if (!open) {
      item.classList.add('opened')
      gsap.set(wrap, { height: 'auto' })
      const h = wrap.offsetHeight
      gsap.fromTo(wrap, { height: 0 }, { height: h, duration: 0.4 })
    } else {
      item.classList.remove('opened')
      gsap.to(wrap, { height: 0, duration: 0.4 })
    }
  })
})

// ── 7. Sound Toggle ──
const soundBtn = document.querySelector('.sound-switcher')
const video = document.querySelector('video')
if (soundBtn && video) {
  soundBtn.addEventListener('click', (e) => {
    e.preventDefault()
    soundBtn.classList.toggle('active')
    video.muted = !soundBtn.classList.contains('active')
  })
}

// ── 8. Clock ──
const clockEl = document.querySelector('.clock')
if (clockEl) {
  const updateClock = () => {
    const now = new Date()
    let h = now.getHours(); const ampm = h >= 12 ? 'pm' : 'am'
    h = h % 12 || 12
    const m = String(now.getMinutes()).padStart(2, '0')
    clockEl.textContent = `${String(h).padStart(2, '0')} : ${m} ${ampm}`
  }
  updateClock()
  setInterval(updateClock, 10000)
}

// ── 9. Three.js TV Model ──
const canvasWrapper = document.querySelector('.start-screen__canvas-wrapper')
if (canvasWrapper && video) {
  const sizes = { width: window.innerWidth, height: window.innerHeight }

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.CineonToneMapping
  renderer.toneMappingExposure = 3.0
  canvasWrapper.prepend(renderer.domElement)

  const scene = new THREE.Scene()
  const fogColor = 0x7a7a7a, fogColorDark = 0x454546
  scene.fog = new THREE.Fog(fogColor, 27, 29)
  renderer.setClearColor(fogColor, 1)

  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
  camera.position.set(0, -0.5, 20)
  scene.add(camera)

  scene.add(new THREE.AmbientLight(0xffffff, 0.5))
  const pLight = new THREE.PointLight(0xffffff, 0.5)
  pLight.position.set(0, 3, 0.5)
  scene.add(pLight)

  const videoTexture = new THREE.VideoTexture(video)
  videoTexture.colorSpace = THREE.SRGBColorSpace
  videoTexture.wrapS = THREE.RepeatWrapping
  videoTexture.wrapT = THREE.RepeatWrapping
  videoTexture.repeat.set(1.7, 1.7)
  videoTexture.offset.set(-0.64, -0.42)
  videoTexture.flipY = false
  video.play().catch(() => {})

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/')
  const gltfLoader = new GLTFLoader()
  gltfLoader.setDRACOLoader(dracoLoader)

  gltfLoader.load('/models/tv1.glb', (gltf) => {
    scene.add(gltf.scene)
    const screen = gltf.scene.getObjectByName('Glass')
    if (screen) screen.material = new THREE.MeshBasicMaterial({ map: videoTexture })
    const trigger = gltf.scene.getObjectByName('Cube001')
    if (trigger) trigger.material = new THREE.MeshBasicMaterial({ color: 0x000000 })
  }, undefined, (err) => console.error('Model load error:', err))

  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth; sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
  })

  // Night mode for 3D
  if (modeSwitcher) {
    modeSwitcher.addEventListener('click', () => {
      const tgt = isNightMode ? fogColorDark : fogColor
      scene.fog = new THREE.Fog(tgt, 27, 29)
      renderer.setClearColor(tgt, 1)
      gsap.to(renderer, { toneMappingExposure: isNightMode ? 0.6 : 3.0, duration: 0.4, overwrite: true })
    })
  }

  // Scroll-linked camera zoom
  const mouseTarget = new THREE.Vector2(0, 0)
  let progress = 0

  const startScreenWrapper = document.querySelector('.start-screen-wrapper')
  if (scrollerEl && startScreenWrapper) {
    lenis.on('scroll', () => {
      // Calculate progress relative to the start-screen-wrapper (500vh)
      const maxZoomScroll = startScreenWrapper.offsetHeight - window.innerHeight
      progress = maxZoomScroll > 0 ? Math.min(Math.max(scrollerEl.scrollTop / maxZoomScroll, 0), 1) : 0
    })
  }

  function lerp(t, a, b) { return (1 - t) * a + t * b }

  const tick = () => {
    mouseTarget.lerp(mouseNDC, 0.05)
    camera.position.x = 0.5 * 14.7 * mouseTarget.x * (1 - progress)
    camera.position.y = lerp(progress, -0.5 + 0.5 * -2.7 * mouseTarget.y * (1 - progress), 0.5)
    camera.position.z = lerp(progress, 20, 3.6)
    camera.lookAt(0, 0.5, 0)
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
  }
  tick()
}
