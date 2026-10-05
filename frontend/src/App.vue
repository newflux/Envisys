<template>
  <div id="app">

  <!-- Dynamic Environment Background (Moved to external component) -->
  <div class="page-background" style="background: #050505;">
    <div class="vignette"></div>
  </div>

    <!-- Smoky frosted blob (Pure CSS mask + backdrop-filter) -->
    <div class="smoke-blob" ref="frostBgRef"></div>

    <!-- Info Text Block (Left of Chamber) -->
    <div class="info-block" ref="textPanelRef" @pointerenter="isPointerInPanel = true" @pointerleave="isPointerInPanel = false">
      <div class="info-close-btn" @click="closePanel">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M1 13L13 1" stroke="currentColor" stroke-width="1.5"/></svg>
      </div>
      <div class="info-index">01</div>
      <h2 class="info-title">
        <div>ENVISYS</div>
        <div>ET-400</div>
        <div class="outline-text">SERIES</div>
      </h2>
      <div class="info-subtitle">ENVIRONMENTAL TEST CHAMBER</div>
      <div class="info-pill">-70°C to +180°C</div>
      <p class="info-desc">Simulates extreme environmental conditions flawlessly for the next generation of testing. Designed for precision and reliability.</p>
      <div class="info-specs">
        <div>HUMIDITY: 10% to 98% RH</div>
        <div>CONTROLLER: ET-Touch 5.7" HMI</div>
      </div>
    </div>

<!----><div id="__layout"><div id="scroller" class="layout" data-v-314f53c6><div class="preloader" data-v-edead8a0 data-v-314f53c6><div class="preloader__inner" data-v-edead8a0><h4 class="preloader__text" data-v-edead8a0><span data-v-edead8a0></span> <span data-v-edead8a0> |</span></h4></div> <div class="preloader__progress" data-v-edead8a0></div></div> <main class="layout__page" data-v-314f53c6><div class="main-page" data-v-314f53c6><div class="start-screen-wrapper" data-v-34202237><div class="start-screen night-mode" ref="startScreenRef" data-v-34202237><div class="start-screen__canvas-wrapper" data-v-741cd722 data-v-34202237>

  <!-- FIXED CANVAS WRAP -->
  <div class="canvas-fixed-wrap">
    <TresCanvas window-size :clear-color="'#050505'" :clear-alpha="1" :tone-mapping-exposure="1" :pixel-ratio="pixelRatio" :antialias="false" power-preference="high-performance">
      <TresPerspectiveCamera ref="cameraRef" :fov="30" :near="0.01" :far="1500" />
      
      <!-- Fog (Infinite void studio effect) -->
      <TresFog :args="['#050505', 40, 150]" />

      <!-- Environment Lighting -->
      <Environment :background="false" :environment-intensity="0.3" :frames="1" :resolution="256">
        <Lightformer :intensity="2" :position="[0, tunnelH/2 - 0.1, 0]" :scale="[tunnelW/2, tunnelD, 1]" :rotation="[-Math.PI/2, 0, 0]" />
      </Environment>

      <!-- Back / Rim Lights from the demo (Soft but not pitch black) -->
      <TresPointLight :position="[10, -10, -20]" :intensity="30" color="#ffffff" :distance="40" />
      <TresPointLight :position="[-10, -10, -20]" :intensity="30" color="#ffffff" :distance="40" />

      <!-- Phase 3 Fleet Fill Lights (Dynamically fade in to light up the sides) -->
      <TresPointLight ref="fleetL" :position="[-12, 0, 10]" :intensity="0" color="#ffffff" :distance="30" />
      <TresPointLight ref="fleetR" :position="[12, 0, 10]" :intensity="0" color="#ffffff" :distance="30" />

      <!-- Interactive Mouse Spotlight -->
      <TresSpotLight 
        ref="mouseSpotLightRef" 
        :angle="0.4" 
        :penumbra="1" 
        :intensity="spotlightIntensity" 
        color="#ffffff"
      />

      <!-- Tunnel Scene -->
      <TresGroup>
        <!-- Floor -->
        <TresMesh :rotation="[-Math.PI/2, 0, 0]" :position="[0, -2.05, 0]">
          <TresPlaneGeometry :args="[tunnelW, tunnelD]" />
          <MeshReflectionMaterial 
            v-if="!isMobile && floorSeamMap && scrollProxy.transitionScale < 0.1"
            color="#101112"
            :map="floorSeamMap"
            :metalness="0.6"
            :roughness="0.15"
            :resolution="256"
            :blur="[20, 20]"
            :mixBlur="0.3"
            :mixStrength="1.2"
            :mirror="0.7"
            :depthScale="0"
            :fog="true"
          />
          <TresMeshStandardMaterial v-else-if="floorSeamMap" color="#101112" :map="floorSeamMap" :metalness="0.6" :roughness="0.08" :fog="true" />
        </TresMesh>

        <!-- Ceiling -->
        <TresMesh :rotation="[Math.PI/2, 0, 0]" :position="[0, tunnelH - 2.05, 0]">
          <TresPlaneGeometry :args="[tunnelW, tunnelD]" />
          <TresMeshStandardMaterial v-if="ceilingGridMap" color="#8a8a8a" :map="ceilingGridMap" :emissiveMap="ceilingGridMap" emissive="#8a8a8a" :emissiveIntensity="0.65" :fog="true" />
        </TresMesh>

        <!-- Left Wall -->
        <TresMesh :rotation="[0, Math.PI/2, 0]" :position="[-tunnelW/2, (tunnelH/2) - 2.05, 0]" :visible="!isDebug">
          <TresPlaneGeometry :args="[tunnelD, tunnelH]" />
          <TresMeshStandardMaterial v-if="wallNoiseMap && wallEmissiveMap" color="#26282b" :map="wallNoiseMap" :emissiveMap="wallEmissiveMap" emissive="#9a9a9a" :emissiveIntensity="1" :roughness="0.85" :fog="true" />
        </TresMesh>

        <!-- Right Wall -->
        <TresMesh :rotation="[0, -Math.PI/2, 0]" :position="[tunnelW/2, (tunnelH/2) - 2.05, 0]" :visible="!isDebug">
          <TresPlaneGeometry :args="[tunnelD, tunnelH]" />
          <TresMeshStandardMaterial v-if="wallNoiseMap && wallEmissiveMap" color="#26282b" :map="wallNoiseMap" :emissiveMap="wallEmissiveMap" emissive="#9a9a9a" :emissiveIntensity="1" :roughness="0.85" :fog="true" />
        </TresMesh>
      </TresGroup>

      <!-- Main Chamber Shadow (Render Once) -->
      <ContactShadows :position="[0, -2.04, 0]" :opacity="0.5" :blur="2.5" :resolution="256" :scale="10" :frames="1" />
      
      <!-- Clones Shadows (No v-if, bind scale to proxy) -->
      <ContactShadows :position="[-12, -2.04, 0]" :opacity="0.5" :blur="2.5" :resolution="256" :scale="scrollProxy.cloneScale * 10" :frames="1" />
      <ContactShadows :position="[12, -2.04, 0]" :opacity="0.5" :blur="2.5" :resolution="256" :scale="scrollProxy.cloneScale * 10" :frames="1" />

      <!-- Main chamber group -->
      <TresGroup 
        ref="chamberGroupRef"
        @pointerdown="onChamberPointerDown"
        @pointerup="onChamberPointerUp"
        @pointerenter="onChamberEnter"
        @pointerleave="onChamberLeave"
      >
        <primitive v-if="chamberScene" :object="chamberScene" :scale="2.5" :position="[0, -2.05, 0]" />
      </TresGroup>

      <!-- Fleet clones (Phase 3 line-up) -->
      <TresGroup ref="cloneARef">
        <primitive v-if="cloneA" :object="cloneA" :scale="2.5" :position="[0, -2.05, 0]" />
      </TresGroup>
      <TresGroup ref="cloneBRef">
        <primitive v-if="cloneB" :object="cloneB" :scale="2.5" :position="[0, -2.05, 0]" />
      </TresGroup>

      <!-- Next-Scene Transition Chamber -->
      <TresGroup ref="transitionChamberRef">
        <primitive v-if="transitionChamber" :object="transitionChamber" :scale="2.5" :position="[0, -2.05, 0]" />
      </TresGroup>
    </TresCanvas>
  </div><!-- /canvas-fixed-wrap -->

</div> <header class="start-header" data-v-36cf41b8 data-v-34202237><nav class="start-header__navigation" data-v-36cf41b8><ul class="start-header__navigation-list" data-v-4a566750 data-v-36cf41b8><li class="start-header__navigation-item" data-v-4a566750><a href="/about" class="link-switcher p2" data-v-760660a8 data-v-4a566750><span class="link-switcher__icon" data-v-760660a8><span class="switcher-icon" data-v-5376e1c5 data-v-760660a8><span class="switcher-icon__shadow" data-v-5376e1c5></span> <span class="switcher-icon__body" data-v-5376e1c5><span class="switcher-icon__marker" data-v-5376e1c5></span></span></span></span> <span class="link-switcher__text" data-v-760660a8>About us</span></a></li> <li class="start-header__navigation-item" data-v-4a566750><a href="/contacts" class="link-switcher p2" data-v-760660a8 data-v-4a566750><span class="link-switcher__icon" data-v-760660a8><span class="switcher-icon" data-v-5376e1c5 data-v-760660a8><span class="switcher-icon__shadow" data-v-5376e1c5></span> <span class="switcher-icon__body" data-v-5376e1c5><span class="switcher-icon__marker" data-v-5376e1c5></span></span></span></span> <span class="link-switcher__text" data-v-760660a8>Contacts</span></a></li> <li class="start-header__navigation-item" data-v-4a566750><button class="link-switcher p2" data-v-760660a8 data-v-4a566750><span class="link-switcher__icon" data-v-760660a8><span class="switcher-icon" data-v-5376e1c5 data-v-760660a8><span class="switcher-icon__shadow" data-v-5376e1c5></span> <span class="switcher-icon__body" data-v-5376e1c5><span class="switcher-icon__marker" data-v-5376e1c5></span></span></span></span> <span class="link-switcher__text" data-v-760660a8>FAQ</span></button></li></ul></nav> <div class="start-header__logo" data-v-36cf41b8 style="display:none;"><div class="logo" data-v-cb243c6e data-v-36cf41b8></div></div> <div class="start-header__logo start-header__logo--nightmode" style="display:block;" data-v-36cf41b8><div class="logo" data-v-cb243c6e data-v-36cf41b8></div></div> <div class="start-header__sound" style="display:flex;gap:20px;align-items:center;" data-v-36cf41b8><button class="sound-switcher" @click="toggleNightMode" data-v-69263892 data-v-36cf41b8><span class="sound-switcher__text p2" data-v-69263892>Mode</span> <span class="switcher-2" data-v-87500f60 data-v-69263892><span class="switcher-2__body" data-v-87500f60><span class="switcher-2__marker" data-v-87500f60></span></span></span></button><button class="sound-switcher" data-v-69263892 data-v-36cf41b8><span class="sound-switcher__text p2" data-v-69263892>Sound</span> <span class="switcher-2" data-v-87500f60 data-v-69263892><span class="switcher-2__body" data-v-87500f60><span class="switcher-2__marker" data-v-87500f60></span></span></span></button></div> <div class="dots start-header__dots" data-v-7d6eeb50 data-v-36cf41b8><div class="dot" data-v-7d6eeb50></div> <div class="dot" data-v-7d6eeb50></div></div></header> <footer class="start-screen__footer" data-v-7934099c data-v-34202237><div class="start-screen__footer-left p2" data-v-7934099c>
    // Positioned at the axis of talent and content across film
  </div> <div class="start-screen__footer-center" data-v-7934099c><p class="scroll-down p2" data-v-751b1c41 data-v-7934099c><span data-v-751b1c41>Scroll Down</span> <span class="scroll-down__icon" data-v-751b1c41></span></p></div> <div class="start-screen__footer-right" data-v-7934099c><p class="clock p2" data-v-43f4bbf8 data-v-7934099c>06 : 57 pm</p></div></footer></div></div> <!----></div></main> <div class="popup faq" style="display:none;" data-v-55603bb3 data-v-314f53c6><button aria-label="close modal" class="faq__close-button" data-v-372f1411 data-v-55603bb3><span data-v-372f1411></span> <span data-v-372f1411></span></button> <div class="faq__inner" data-v-55603bb3><div class="faq__content" data-v-55603bb3></div></div></div> <div class="loader" data-v-0dfb4719 data-v-314f53c6><div class="loader__inner" data-v-0dfb4719></div> <!----></div> <div class="cursor" data-v-37e7b582 data-v-314f53c6><div class="cursor__inner" data-v-37e7b582><span data-v-37e7b582></span> <span data-v-37e7b582></span> <span data-v-37e7b582></span> <span data-v-37e7b582></span></div></div></div></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import gsap from 'gsap'
import Lenis from 'lenis'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { AnimationMixer, MathUtils, Box3, Vector3, MeshLambertMaterial, Color, CanvasTexture, RepeatWrapping } from 'three'
import * as THREE from 'three'
import { Environment, Lightformer, ContactShadows, MeshReflectionMaterial } from '@tresjs/cientos'

// --- 1. Transition Chamber Configuration ---
// Adjust these to control the duplicate chamber that arrives at the end
const transitionChamberArrivalDuration = 7; // Shortened speed (was implicit)
const transitionChamberStartZ = -30; // Starts far behind
// -------------------------------------------

// ── Info Panel State & GSAP Timeline ──────────────────────────────────────────
const isPanelOpen = ref(false)
const isPointerInPanel = ref(false)
const frostBgRef = ref<HTMLElement | null>(null)
const textPanelRef = ref<HTMLElement | null>(null)
const panelTl = gsap.timeline({ paused: true })

const isMobile = ref(false)
const pixelRatio = ref(1)
const isDebug = new URLSearchParams(window.location.search).get('debug') === 'lineup'

// Tunnel refs
const tunnelW = ref(20)
const tunnelH = ref(10)
const tunnelD = ref(100)
const wallNoiseMap = ref<any>(null)
const wallEmissiveMap = ref<any>(null)
const floorSeamMap = ref<any>(null)
const ceilingGridMap = ref<any>(null)

function generateTextures() {
  // 1. Wall Noise & Top Gradient (1:1 vertically)
  const wallCanvas = document.createElement('canvas')
  wallCanvas.width = 512; wallCanvas.height = 512
  const wCtx = wallCanvas.getContext('2d')!
  const wImg = wCtx.getImageData(0,0,512,512)
  for (let i=0; i<wImg.data.length; i+=4) {
    const v = 15 + Math.random() * 8
    wImg.data[i] = wImg.data[i+1] = wImg.data[i+2] = v
    wImg.data[i+3] = 255
  }
  wCtx.putImageData(wImg, 0, 0)
  
  // Add faint vertical panel seams every few units at ~4% brightness
  wCtx.strokeStyle = 'rgba(255,255,255,0.04)'
  wCtx.lineWidth = 2
  for(let x=0; x<=512; x+=128) {
    wCtx.beginPath(); wCtx.moveTo(x, 0); wCtx.lineTo(x, 512); wCtx.stroke()
  }

  const wallTex = new CanvasTexture(wallCanvas)
  wallTex.wrapS = wallTex.wrapT = RepeatWrapping
  wallTex.repeat.set(tunnelD.value/5, 1) // repeat horizontally, clamp vertically
  wallNoiseMap.value = wallTex

  // 1b. Wall Emissive Map (Gradient)
  const emissiveCanvas = document.createElement('canvas')
  emissiveCanvas.width = 512; emissiveCanvas.height = 512
  const eCtx = emissiveCanvas.getContext('2d')!
  eCtx.fillStyle = '#000000'
  eCtx.fillRect(0,0,512,512)
  
  const grad = eCtx.createLinearGradient(0, 0, 0, 512 * 0.35)
  grad.addColorStop(0, 'rgba(255,255,255,0.15)') // 15% brightness at top
  grad.addColorStop(1, 'rgba(0,0,0,0)')          // fade to zero
  eCtx.fillStyle = grad
  eCtx.fillRect(0, 0, 512, 512)

  const wallEmissiveTex = new CanvasTexture(emissiveCanvas)
  wallEmissiveTex.wrapS = wallEmissiveTex.wrapT = RepeatWrapping
  wallEmissiveTex.repeat.set(tunnelD.value/5, 1) // Match wall noise repeat
  wallEmissiveMap.value = wallEmissiveTex

  // 2. Floor Seams
  const floorCanvas = document.createElement('canvas')
  floorCanvas.width = 512; floorCanvas.height = 512
  const fCtx = floorCanvas.getContext('2d')!
  fCtx.fillStyle = '#101112'
  fCtx.fillRect(0,0,512,512)
  fCtx.strokeStyle = 'rgba(255,255,255,0.035)' // ~3.5% brighter seams
  fCtx.lineWidth = 2
  fCtx.strokeRect(0,0,512,512)
  const floorTex = new CanvasTexture(floorCanvas)
  floorTex.wrapS = floorTex.wrapT = RepeatWrapping
  floorTex.repeat.set(tunnelW.value/4, tunnelD.value/4)
  floorSeamMap.value = floorTex

  // 3. Ceiling Panels
  const ceilCanvas = document.createElement('canvas')
  ceilCanvas.width = 512; ceilCanvas.height = 512
  const cCtx = ceilCanvas.getContext('2d')!
  cCtx.fillStyle = '#050506' // gaps
  cCtx.fillRect(0,0,512,512)
  cCtx.fillStyle = '#8a8a8a' // neutral grey
  cCtx.fillRect(8, 8, 512-16, 512-16)
  const ceilTex = new CanvasTexture(ceilCanvas)
  ceilTex.wrapS = ceilTex.wrapT = RepeatWrapping
  ceilTex.repeat.set(tunnelW.value/4, tunnelD.value/4) // 4x4m panels roughly
  ceilingGridMap.value = ceilTex
}

onMounted(() => {
  pixelRatio.value = Math.min(window.devicePixelRatio || 1, 1.5)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    panelTl.to(frostBgRef.value, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
  } else {
    // Animates CSS variable for the mask radius to open the blob
    panelTl.to(frostBgRef.value, { '--radius': '800px', duration: 0.7, ease: 'power3.out' }, 0)
  }
  
  // Stagger all child elements in the info block (starts at 0.2s)
  panelTl.fromTo('.info-block > *', 
    { opacity: 0, x: -10 },
    { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
    0.2
  )

  panelTl.eventCallback('onStart', () => {
    if (textPanelRef.value) {
      textPanelRef.value.style.visibility = 'visible'
      textPanelRef.value.style.pointerEvents = 'auto'
    }
    if (frostBgRef.value) frostBgRef.value.style.pointerEvents = 'auto'
  })
  
  panelTl.eventCallback('onReverseComplete', () => {
    if (textPanelRef.value) {
      textPanelRef.value.style.visibility = 'hidden'
      textPanelRef.value.style.pointerEvents = 'none'
    }
    if (frostBgRef.value) frostBgRef.value.style.pointerEvents = 'none'
  })



})

function openPanel(cx: number, cy: number) {
  if (isPanelOpen.value) return
  isPanelOpen.value = true
  
  if (frostBgRef.value) {
    frostBgRef.value.style.setProperty('--cx', `${cx}px`)
    frostBgRef.value.style.setProperty('--cy', `${cy}px`)
  }
  
  panelTl.play()
}

function closePanel() {
  if (!isPanelOpen.value) return
  isPanelOpen.value = false
  panelTl.reverse()
}

function closePanelImmediate() {
  if (!isPanelOpen.value) return
  isPanelOpen.value = false
  panelTl.pause(0)
  if (textPanelRef.value) {
    textPanelRef.value.style.visibility = 'hidden'
    textPanelRef.value.style.pointerEvents = 'none'
  }
  if (frostBgRef.value) {
    frostBgRef.value.style.pointerEvents = 'none'
  }
}

// Global safety closes
window.addEventListener('resize', closePanelImmediate)
window.addEventListener('blur', closePanelImmediate)
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePanel()
})

// Raycaster handlers for Chamber
let globalPointerX = window.innerWidth / 2
let globalPointerY = window.innerHeight / 2
let globalPointerDownX = 0
let globalPointerDownY = 0
let lastChamberClickTime = 0

window.addEventListener('pointerdown', (e) => {
  globalPointerDownX = e.clientX
  globalPointerDownY = e.clientY
})
window.addEventListener('pointermove', (e) => {
  globalPointerX = e.clientX
  globalPointerY = e.clientY
})

function onChamberPointerDown(e: any) {
  // Tracked globally
}

function onChamberPointerUp(e: any) {
  const dx = globalPointerX - globalPointerDownX
  const dy = globalPointerY - globalPointerDownY
  const dist = Math.sqrt(dx * dx + dy * dy)
  
  if (dist < 10) { // Slightly more forgiving for touch
    lastChamberClickTime = performance.now()
    if (!isPanelOpen.value) {
      openPanel(globalPointerX, globalPointerY)
    }
  }
}

function onChamberEnter() {
  document.body.classList.add('is-hovering-chamber')
}

function onChamberLeave() {
  document.body.classList.remove('is-hovering-chamber')
}

// Global click to close empty space
window.addEventListener('pointerup', (e) => {
  // Ignore if handled by chamber raycast just a moment ago
  if (performance.now() - lastChamberClickTime < 50) return 
  
  const target = e.target as HTMLElement
  if (target.closest('.info-block')) return

  if (isPanelOpen.value) {
    closePanel()
  }
})

// ── Refs ────────────────────────────────────────────────────────────────────
const cameraRef       = ref<any>(null)
const fogRef          = ref<any>(null)
const mouseSpotLightRef = ref<any>(null)
const fleetL          = ref<any>(null)
const fleetR          = ref<any>(null)
const chamberGroupRef = ref<any>(null)
const blob1Ref        = ref<HTMLElement | null>(null)
const blob2Ref        = ref<HTMLElement | null>(null)
const blob3Ref        = ref<HTMLElement | null>(null)
const cloneARef       = ref<any>(null)
const cloneBRef       = ref<any>(null)
const transitionChamberRef = ref<any>(null)
const startScreenRef  = ref<any>(null)

// Reactive scene state
const exposure       = ref(1)
const spotlightIntensity = ref(100) // Default for touch devices
let mouseHasMoved = false

// GLB scenes
const chamberScene = shallowRef<any>(null)
const cloneA       = shallowRef<any>(null)
const cloneB       = shallowRef<any>(null)
const transitionChamber = shallowRef<any>(null)

// Animation
let doorAnim = { mixer: null as AnimationMixer | null, action: null as any, duration: 0 }

// ── GSAP Scroll Proxy ────────────────────────────────────────────────────────
const scrollProxy = { 
  door: 0, 
  chamberYaw: 0, // Straight start
  camX: 0, camY: 0, camZ: 0,
  lookX: 0, lookY: 0, lookZ: 0,
  camRoll: 0,
  fogFar: 35, // Dynamic fog distance
  cloneAx: 0, cloneAy: 0, cloneAz: -80, 
  cloneBx: 0, cloneBy: 0, cloneBz: -80,
  cloneScale: 0, // Used to keep clones completely invisible until Phase 3
  cloneFade: 1,  // Multiplies color and envMapIntensity
  fleetLightIntensity: 0, // Dynamically lights up the sides in Phase 3
  transitionZ: transitionChamberStartZ,
  transitionScale: 0
}

// Camera state
let baseDistance = 0
let baseSizeY    = 0
const baseCameraPos    = new Vector3()
const baseCameraTarget = new Vector3()
let targetMouseOffsetX = 0
let targetMouseOffsetY = 0
let mouseOffsetX = 0
let mouseOffsetY = 0
let currentYaw   = 0
let targetMouseX = 0
let targetMouseY = 0
let parallaxX = 0
let parallaxY = 0

// ── Night mode toggle ───────────────────────────────────
let isNight = true // Start in night mode
const toggleNightMode = () => {
  isNight = !isNight
  if (startScreenRef.value) {
    if (isNight) startScreenRef.value.classList.add('night-mode')
    else startScreenRef.value.classList.remove('night-mode')
  }
  const tl = gsap.timeline()
  const proxy = { exp: exposure.value }
  if (isNight) {
    document.querySelector('.start-header__logo:not(.start-header__logo--nightmode)')!.setAttribute('style','display:none;')
    document.querySelector('.start-header__logo--nightmode')!.setAttribute('style','display:block;')
    tl.to(proxy, { exp:1, duration:1, ease:'power2.inOut', onUpdate:()=>{ exposure.value=proxy.exp }}, 0)
    tl.to('.link-switcher,.clock,.scroll-down,.sound-switcher__text,.start-screen__footer-left',{ color:'#fff', fill:'#fff', duration:0.5 }, 0)
  } else {
    document.querySelector('.start-header__logo:not(.start-header__logo--nightmode)')!.setAttribute('style','display:block;')
    document.querySelector('.start-header__logo--nightmode')!.setAttribute('style','display:none;')
    tl.to(proxy, { exp:1.5, duration:1, ease:'power2.inOut', onUpdate:()=>{ exposure.value=proxy.exp }}, 0)
    tl.to('.link-switcher,.clock,.scroll-down,.sound-switcher__text,.start-screen__footer-left',{ color:'#101011', fill:'#101011', duration:0.5 }, 0)
  }
}

// ── onMounted ───────────────────────────────────────────────────────────────
onMounted(() => {
  // Prevent browser from restoring previous scroll position and causing GSAP to snap
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)
  
  gsap.registerPlugin(ScrollTrigger)
  gsap.set('.link-switcher,.clock,.scroll-down,.sound-switcher__text,.start-screen__footer-left',{ color:'#ffffff', fill:'#ffffff' })

  const scrollerEl = document.querySelector('#scroller') as HTMLElement
  if (scrollerEl) scrollerEl.scrollTop = 0 // Reset custom scroller
  
  const lenis = new Lenis({ wrapper: scrollerEl, content: document.querySelector('.layout__page') as HTMLElement, lerp: 0.08, smoothWheel: true })
  
  lenis.on('scroll', (e: any) => {
    // Close panel on scroll start if pointer isn't inside it
    if (Math.abs(e.velocity) > 0 && isPanelOpen.value && !isPointerInPanel.value) {
      closePanelImmediate()
    }
    ScrollTrigger.update(e)
  })

  window.addEventListener('mousemove', (e) => {
    if (!mouseHasMoved) {
      mouseHasMoved = true
      gsap.to(spotlightIntensity, { value: 150, duration: 0.5, overwrite: true })
    }
    const nx = (e.clientX/window.innerWidth)*2-1
    const ny = -(e.clientY/window.innerHeight)*2+1
    targetMouseOffsetX = nx*0.15
    targetMouseOffsetY = ny*0.08
    targetMouseX       = nx
    targetMouseY       = ny
    const cursor = document.querySelector('.cursor') as HTMLElement
    if (cursor) gsap.to(cursor,{ x:e.clientX, y:e.clientY, xPercent:-50, yPercent:-50, duration:0.1, ease:'power2.out' })
  })

  // ── Main ticker (render loop logic) ────────────────────────────────────
  let frameCount = 0
  let lastFpsTime = performance.now()
  let hasLoweredPixelRatio = false

  gsap.ticker.add((time) => {
    // Adaptive Pixel Ratio Rule
    if (!hasLoweredPixelRatio) {
      frameCount++
      const now = performance.now()
      if (now - lastFpsTime >= 2000) {
        const fps = (frameCount * 1000) / (now - lastFpsTime)
        if (fps < 45) {
          pixelRatio.value = Math.max(1, pixelRatio.value - 0.25)
          hasLoweredPixelRatio = true
        }
        frameCount = 0
        lastFpsTime = now
      }
    }

    lenis.raf(time * 1000)

    // Interactive Three Graces Spotlight
    if (mouseSpotLightRef.value) {
      if (!mouseHasMoved) {
        targetMouseX = Math.sin(time * 0.5) * 0.2
        targetMouseY = Math.cos(time * 0.3) * 0.2
      }
      const targetLightX = targetMouseX * 12
      const targetLightY = targetMouseY * 10
      const targetLightZ = 12
      
      mouseSpotLightRef.value.position.x += (targetLightX - mouseSpotLightRef.value.position.x) * 0.1
      mouseSpotLightRef.value.position.y += (targetLightY - mouseSpotLightRef.value.position.y) * 0.1
      mouseSpotLightRef.value.position.z += (targetLightZ - mouseSpotLightRef.value.position.z) * 0.1
    }

    // Phase 3 Fleet side lighting
    if (fleetL.value) fleetL.value.intensity = scrollProxy.fleetLightIntensity
    if (fleetR.value) fleetR.value.intensity = scrollProxy.fleetLightIntensity

    // Background Parallax Drift
    parallaxX += (targetMouseX * -30 - parallaxX) * 0.05
    parallaxY += (targetMouseY * -30 - parallaxY) * 0.05
    if (blob1Ref.value) blob1Ref.value.style.transform = `translate(${parallaxX}px, ${parallaxY}px)`
    if (blob2Ref.value) blob2Ref.value.style.transform = `translate(${parallaxX * 0.7}px, ${parallaxY * 0.7}px)`
    if (blob3Ref.value) blob3Ref.value.style.transform = `translate(${parallaxX * 1.3}px, ${parallaxY * 1.3}px)`

    // Door animation (ONLY update if time actually changed to prevent constant heavy skeletal matrix calculations)
    if (doorAnim.mixer && doorAnim.action && doorAnim.duration) {
      const newTime = scrollProxy.door * doorAnim.duration
      if (Math.abs(doorAnim.action.time - newTime) > 0.0001) {
        doorAnim.action.time = newTime
        doorAnim.mixer.update(0)
      }
    }

    // Dynamic Fleet Spread
    if (cloneARef.value && cloneBRef.value) {
      const fade = scrollProxy.cloneFade
      
      const updateClone = (cloneRef: any, x: number, y: number, z: number, cacheKey: string) => {
        cloneRef.position.set(isDebug ? 0 : x, isDebug ? y : y, isDebug ? 0 : z)
        cloneRef.scale.setScalar(isDebug ? 1 : scrollProxy.cloneScale)
        
        // Only toggle visibility. Do not traverse materials on every frame!
        const isVisible = fade > 0 && scrollProxy.cloneScale > 0
        if (cloneRef.visible !== isVisible) {
          cloneRef.visible = isVisible
        }
      }
      
      updateClone(cloneARef.value, scrollProxy.cloneAx, scrollProxy.cloneAy, scrollProxy.cloneAz, 'A')
      updateClone(cloneBRef.value, scrollProxy.cloneBx, scrollProxy.cloneBy, scrollProxy.cloneBz, 'B')
    }
    // Hide transition chamber completely when scale is 0 to save massive draw calls
    if (transitionChamberRef.value) {
      transitionChamberRef.value.position.set(0, 0, scrollProxy.transitionZ)
      transitionChamberRef.value.scale.setScalar(scrollProxy.transitionScale)
      transitionChamberRef.value.visible = scrollProxy.transitionScale > 0
    }

    // Camera motion
    if (cameraRef.value && baseDistance > 0) {
      if (isDebug) {
        cameraRef.value.position.set(0, 40, 0)
        cameraRef.value.lookAt(0, 0, 0)
        cameraRef.value.rotation.z = 0
      } else {
        mouseOffsetX += (targetMouseOffsetX - mouseOffsetX) * 0.05
        mouseOffsetY += (targetMouseOffsetY - mouseOffsetY) * 0.05
        const driftX = Math.sin(time*0.5)*0.03
        const driftY = Math.cos(time*0.4)*0.03
        
        const targetYaw = targetMouseX * MathUtils.degToRad(4)
        currentYaw += (targetYaw - currentYaw) * 0.05
        
        if (chamberGroupRef.value) chamberGroupRef.value.rotation.y = currentYaw + scrollProxy.chamberYaw

        cameraRef.value.position.set(
          scrollProxy.camX + mouseOffsetX + driftX,
          scrollProxy.camY + mouseOffsetY + driftY,
          scrollProxy.camZ
        )
        
        cameraRef.value.lookAt(scrollProxy.lookX, scrollProxy.lookY, scrollProxy.lookZ)
        cameraRef.value.rotation.z = scrollProxy.camRoll
      }
    }
  })
  gsap.ticker.lagSmoothing(0)

  // ── Load GLBs ──────────────────────────────────────────────────────────
  const draco = new DRACOLoader()
  draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(draco)

  // Exact Three Graces Material: Deep Matte Black
  const gracesMaterial = new MeshLambertMaterial({ color: new Color('#050505'), fog: false })

  loader.load('/models/chamber_main.glb', (gltf) => {
    
    // Retain original materials, just enable shadows
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        // Target specific mesh based on GLB dump
        if (child.name === 'Body5.003') {
          child.material = gracesMaterial
        }
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          child.material.fog = false
          child.material.needsUpdate = true
        }
      }
    })
    
    chamberScene.value = gltf.scene

    // Compute exact bounding box post-scale
    const box  = new Box3().setFromObject(gltf.scene)
    const size = new Vector3(); box.getSize(size); size.multiplyScalar(2.5)
    
    // Set Tunnel Dimensions dynamically based on chamber's bounding box
    // Widened to 8.5x to comfortably fit the fleet lineup!
    tunnelW.value = size.x * 8.5
    tunnelH.value = size.y * 2.6
    tunnelD.value = size.z * 50 // Lengthened to hide the end wall
    generateTextures()
    
    // DIAGNOSIS LOGGING
    console.log("--- DIAGNOSE LINE-UP ---")
    console.log(`[TUNNEL INTERIOR BOUNDS] X: ${-tunnelW.value/2} to ${tunnelW.value/2}, Y: -2.05 to ${tunnelH.value - 2.05}, Z: ${-tunnelD.value/2} to ${tunnelD.value/2}`)
    
    const worldBox = new Box3().setFromObject(gltf.scene)
    const chamberWorldPos = new Vector3(0, -2.05, 0)
    console.log(`[MAIN CHAMBER] WorldPos: ${chamberWorldPos.toArray()}, BBox Min: ${worldBox.min.toArray()}, BBox Max: ${worldBox.max.toArray()}`)
    
    const cloneAPos = new Vector3(-12, -2.05, 0)
    const cloneBPos = new Vector3(12, -2.05, 0)
    console.log(`[CLONE A] WorldPos: ${cloneAPos.toArray()}, outside tunnel X bounds (-6.445)`)
    console.log(`[CLONE B] WorldPos: ${cloneBPos.toArray()}, outside tunnel X bounds (+6.445)`)
    
    console.log(`[BASE Y CHECK] Chamber Base Y: -2.05. Floor Plane Y: -2.05. Sits exactly on floor.`)
    console.log("------------------------")

    baseSizeY = size.y
    const center = new Vector3(); box.getCenter(center)
    center.multiplyScalar(2.5); center.add(new Vector3(0,-2.05,0))
    baseCameraTarget.copy(center)
    
    const fov = 30
    baseDistance = (size.y/0.45)/(2*Math.tan(MathUtils.degToRad(fov/2)))
    const chamberFloorY = -2.05
    baseCameraPos.set(center.x, chamberFloorY+(0.3*baseSizeY), center.z+baseDistance)

    // Seed the GSAP proxy with true starting positions
    scrollProxy.camX = baseCameraPos.x
    scrollProxy.camY = baseCameraPos.y
    scrollProxy.camZ = baseCameraPos.z
    scrollProxy.lookX = baseCameraTarget.x
    scrollProxy.lookY = baseCameraTarget.y
    scrollProxy.lookZ = baseCameraTarget.z

    if (cameraRef.value) {
      cameraRef.value.position.copy(baseCameraPos)
      cameraRef.value.lookAt(baseCameraTarget)
    }

    // Animations
    if (gltf.animations?.length > 0) {
      doorAnim.mixer  = new AnimationMixer(gltf.scene)
      const action    = doorAnim.mixer.clipAction(gltf.animations[0])
      action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true
      action.paused = true; action.timeScale = 0; action.play()
      doorAnim.action   = action
      doorAnim.duration = gltf.animations[0].duration
    }

    cloneA.value = gltf.scene.clone(true)
    cloneB.value = gltf.scene.clone(true)
    transitionChamber.value = gltf.scene.clone(true)

    buildScrollTimeline()
  })
})

// ── The 4-Phase Cinematic Scroll Architecture ───────────────────────────────────────────
function buildScrollTimeline() {
  setTimeout(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".layout__page", 
        scroller: "#scroller",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2, 
      }
    })

    // ── Phase 1: Hold Straight (0% to 15%) ──
    // The chamber sits perfectly straight while the user reads the initial intro text.

    // ── Phase 2: The Spec Pan + 360 Spin (20% to 35%) ──
    tl.to(scrollProxy, { 
      camX: -1.8, 
      camY: baseCameraPos.y + 0.5, 
      camZ: baseCameraPos.z - (baseDistance * 0.6), 
      lookX: -3.0, 
      lookY: baseCameraTarget.y + 1.2,                                  
      duration: 15, 
      ease: 'power3.inOut' 
    }, 20)
    tl.fromTo(scrollProxy, 
      { chamberYaw: 0 }, 
      { chamberYaw: Math.PI * 2, duration: 15, ease: 'power2.inOut' }, 
    20)

    // ── Phase 3: The South-West Spread Reveal (40% to 65%) ──
    tl.to(scrollProxy, { 
      camX: -9, // Stay safely inside the new wider left wall
      camY: baseCameraPos.y + 6,  
      camZ: baseCameraPos.z + 4,  
      lookX: 0, 
      lookY: baseCameraTarget.y,
      lookZ: 0,
      duration: 25, 
      ease: 'power2.inOut' 
    }, 40)
    
    tl.to(scrollProxy, {
      cloneAx: -10, // Spread horizontally cleanly inside the wider tunnel
      cloneBx: 10,  
      cloneAy: 0, 
      cloneBy: 0,
      cloneAz: 0, 
      cloneBz: 0, 
      cloneScale: 1, 
      fleetLightIntensity: 80, // Light up the side clones!
      duration: 25,
      ease: 'power3.out' 
    }, 40)

    // ── Phase 4: Cinematic J-Curve Breach (65% to 100%) ──
    // Fade out clones over a short span as the section ends
    tl.to(scrollProxy, { cloneFade: 0, duration: 3, ease: 'none' }, 65)
    
    // 1. Center the camera's X/Y quickly (65% to 75%)
    tl.to(scrollProxy, { 
      camX: 0, 
      camY: baseCameraTarget.y + 0.8, 
      lookX: 0,
      lookY: baseCameraTarget.y + 0.8,
      lookZ: 0,
      fogFar: 35, // Return fog to normal
      fleetLightIntensity: 0, // Fade out side lights as we center
      duration: 10, 
      ease: "power2.inOut" 
    }, 65)

    // 2. Start opening the door seamlessly on approach (70% to 85%)
    tl.to(scrollProxy, { door: 1, duration: 15, ease: "power2.inOut" }, 70)

    // 3. One fluid, non-stop Z-dive all the way in (65% to 100%)
    tl.to(scrollProxy, { camZ: 1.2, duration: 35, ease: "power2.inOut" }, 65)

    // ── Phase 5: Next-Scene Transition Chamber (93% to 100%) ──
    tl.to(scrollProxy, {
      transitionZ: -5,
      transitionScale: 1,
      duration: transitionChamberArrivalDuration,
      ease: "power3.out"
    }, 100 - transitionChamberArrivalDuration)

  }, 600)
}
</script>

<style>
@import "./assets/style.css";

/* ── 5×100vh scroll space for deeper cinematic timing ── */
.layout__page { min-height: 500vh; }

body, #app { background: transparent !important; overflow-x: hidden; }
.preloader, .loader, .popup.faq { display: none !important; }
.start-screen-wrapper,.start-screen,.main-page,.layout,.layout__page { visibility:visible !important; opacity:1 !important; }
.start-header,.start-screen__footer,.nightmode-label { opacity:1 !important; visibility:visible !important; }
.start-screen__mode-switcher { visibility:visible !important; opacity:1 !important; z-index:50; cursor:pointer; }
.cursor { position:fixed !important; left:0; top:0; pointer-events:none !important; z-index:9999; }
.cursor * { pointer-events:none !important; }

/* Force ALL wrappers transparent — override scoped styles */
[data-v-34202237].start-screen,
[data-v-34202237].start-screen.night-mode,
[data-v-34202237].start-screen-wrapper,
[data-v-314f53c6].layout,
[data-v-314f53c6] .layout__page {
  background: transparent !important;
  background-color: transparent !important;
}

/* ── Fixed canvas — stays in background while page scrolls ── */
.canvas-fixed-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 0;
  pointer-events: auto; /* MUST be auto for raycaster chamber clicks! */
}

/* Film grain */
.film-grain {
  position: absolute; top:0; left:0; width:100%; height:100%;
  pointer-events: none; z-index: 10; mix-blend-mode: overlay; opacity: 0.07;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
}

/* ── Smoky Frosted Blob & Info Block ── */
.smoke-blob {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 990;
  pointer-events: none;
  
  background: rgba(40, 40, 40, 0.85); /* graphite 85% */
  
  --cx: 50vw;
  --cy: 50vh;
  --radius: 0px;
  
  /* The soft radial mask for the smoky edge */
  mask-image: radial-gradient(circle at var(--cx) var(--cy), black calc(var(--radius) * 0.2), transparent var(--radius));
  -webkit-mask-image: radial-gradient(circle at var(--cx) var(--cy), black calc(var(--radius) * 0.2), transparent var(--radius));
}

.smoke-blob::before {
  content: "";
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  mix-blend-mode: overlay;
  opacity: 0.12; /* Grainy dither */
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .smoke-blob {
    --radius: 2000px !important;
    opacity: 0;
  }
}

@supports not (backdrop-filter: blur(12px)) {
  .smoke-blob {
    background: rgba(30, 30, 30, 0.85);
  }
}

/* ── Ensure wrappers are transparent so background shows through ── */
.layout, .layout__page, .main-page, .start-screen, .start-screen-wrapper, .start-screen__canvas-wrapper, #scroller {
  background: transparent !important;
  background-color: transparent !important;
}

/* ── Dynamic Page Background ── */
.page-background {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: -1;
  background-color: #050505;
  overflow: hidden;
  pointer-events: none;
}


.vignette {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  background: radial-gradient(circle at 50% 50%, transparent 55%, rgba(5,5,6,0.45) 100%);
}

.bg-grain {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  opacity: 0.045;
  mix-blend-mode: overlay;
  animation: grain-step 0.125s steps(1) infinite;
}
@media (max-width: 768px) {
  .bg-grain { opacity: 0.03; }
}

.info-block {
  position: absolute;
  top: 50%;
  left: 50%; /* Center placement */
  transform: translate(-50%, -50%);
  width: 340px;
  color: #e8ece6;
  font-family: 'Inter', sans-serif;
  z-index: 1001;
  pointer-events: none;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.info-close-btn {
  position: absolute;
  top: -40px;
  right: -20px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}
.info-close-btn:hover { opacity: 1; }
.info-index { font-weight: 300; letter-spacing: 4px; font-size: 12px; margin-bottom: 20px; }
.info-title { font-weight: 800; font-size: 42px; line-height: 1.1; margin: 0 0 15px 0; letter-spacing: -1px; }
.info-title .outline-text {
  -webkit-text-stroke: 1px #e8ece6;
  color: transparent;
}
.info-subtitle { font-weight: 600; font-size: 10px; letter-spacing: 2px; margin-bottom: 20px; }
.info-pill { display: inline-block; font-family: monospace; background: #e8ece6; color: black; padding: 4px 10px; border-radius: 20px; font-size: 12px; margin-bottom: 20px; font-weight: 600; }
.info-desc { font-weight: 300; font-size: 14px; line-height: 1.5; margin-bottom: 20px; opacity: 0.8; }
.info-specs { font-weight: 400; font-size: 11px; letter-spacing: 1px; opacity: 0.6; display: flex; flex-direction: column; gap: 4px; align-items: center; }

body.is-hovering-chamber .cursor__inner {
  transform: scale(1.5);
  transition: transform 0.2s ease;
}
</style>
