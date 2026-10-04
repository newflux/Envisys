<template>
  <div id="app">
<!----><div id="__layout"><div id="scroller" class="layout" data-v-314f53c6><div class="preloader" data-v-edead8a0 data-v-314f53c6><div class="preloader__inner" data-v-edead8a0><h4 class="preloader__text" data-v-edead8a0><span data-v-edead8a0></span> <span data-v-edead8a0> |</span></h4></div> <div class="preloader__progress" data-v-edead8a0></div></div> <main class="layout__page" data-v-314f53c6><div class="main-page" data-v-314f53c6><div class="start-screen-wrapper" data-v-34202237><div class="start-screen night-mode" ref="startScreenRef" data-v-34202237><div class="start-screen__canvas-wrapper" data-v-741cd722 data-v-34202237>

  <!-- Background radial exactly matching "The Three Graces" demo -->
  <div style="position:absolute;top:0;left:0;width:100vw;height:100vh;z-index:-2;background:radial-gradient(circle at bottom center, rgba(60, 60, 60, 1) 0%, rgba(0, 0, 0, 1) 58%);"></div>

  <!-- FIXED CANVAS WRAP -->
  <div class="canvas-fixed-wrap">
    <TresCanvas window-size shadows alpha clear-color="transparent" :tone-mapping-exposure="1">
      <!-- Fog matching the demo -->
      <TresFog args="['black', 0, 35]" ref="fogRef" />
      <TresPerspectiveCamera ref="cameraRef" :fov="30" :near="0.01" :far="1500" />
      
      <!-- Back / Rim Lights from the demo (Soft but not pitch black) -->
      <TresPointLight :position="[10, -10, -20]" :intensity="30" color="#ffffff" />
      <TresPointLight :position="[-10, -10, -20]" :intensity="30" color="#ffffff" />

      <!-- Phase 3 Fleet Fill Lights (Dynamically fade in to light up the sides) -->
      <TresPointLight ref="fleetL" :position="[-12, 0, 10]" :intensity="0" color="#ffffff" :distance="40" />
      <TresPointLight ref="fleetR" :position="[12, 0, 10]" :intensity="0" color="#ffffff" :distance="40" />

      <!-- Interactive Mouse Spotlight -->
      <TresSpotLight 
        ref="mouseSpotLightRef" 
        :angle="0.4" 
        :penumbra="1" 
        :intensity="spotlightIntensity" 
        color="#ffffff"
        cast-shadow 
        :shadow-mapSize="[1024, 1024]" 
        :shadow-bias="-0.001" 
      />

      <!-- Floor for contact shadows (invisible, only receives shadow) -->
      <TresMesh :position="[0, -2.05, 0]" :rotation="[-Math.PI / 2, 0, 0]" receive-shadow>
        <TresPlaneGeometry :args="[100, 100]" />
        <TresShadowMaterial :opacity="0.5" />
      </TresMesh>

      <!-- Main chamber group -->
      <TresGroup ref="chamberGroupRef">
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

<video playsinline="" loop="loop" muted="muted" crossOrigin="anonymous" style="visibility:hidden;position:absolute;pointer-events:none;" data-v-741cd722><source src="/models/tv_square.mp4" data-v-741cd722 /></video></div> <header class="start-header" data-v-36cf41b8 data-v-34202237><nav class="start-header__navigation" data-v-36cf41b8><ul class="start-header__navigation-list" data-v-4a566750 data-v-36cf41b8><li class="start-header__navigation-item" data-v-4a566750><a href="/about" class="link-switcher p2" data-v-760660a8 data-v-4a566750><span class="link-switcher__icon" data-v-760660a8><span class="switcher-icon" data-v-5376e1c5 data-v-760660a8><span class="switcher-icon__shadow" data-v-5376e1c5></span> <span class="switcher-icon__body" data-v-5376e1c5><span class="switcher-icon__marker" data-v-5376e1c5></span></span></span></span> <span class="link-switcher__text" data-v-760660a8>About us</span></a></li> <li class="start-header__navigation-item" data-v-4a566750><a href="/contacts" class="link-switcher p2" data-v-760660a8 data-v-4a566750><span class="link-switcher__icon" data-v-760660a8><span class="switcher-icon" data-v-5376e1c5 data-v-760660a8><span class="switcher-icon__shadow" data-v-5376e1c5></span> <span class="switcher-icon__body" data-v-5376e1c5><span class="switcher-icon__marker" data-v-5376e1c5></span></span></span></span> <span class="link-switcher__text" data-v-760660a8>Contacts</span></a></li> <li class="start-header__navigation-item" data-v-4a566750><button class="link-switcher p2" data-v-760660a8 data-v-4a566750><span class="link-switcher__icon" data-v-760660a8><span class="switcher-icon" data-v-5376e1c5 data-v-760660a8><span class="switcher-icon__shadow" data-v-5376e1c5></span> <span class="switcher-icon__body" data-v-5376e1c5><span class="switcher-icon__marker" data-v-5376e1c5></span></span></span></span> <span class="link-switcher__text" data-v-760660a8>FAQ</span></button></li></ul></nav> <div class="start-header__logo" data-v-36cf41b8 style="display:none;"><div class="logo" data-v-cb243c6e data-v-36cf41b8></div></div> <div class="start-header__logo start-header__logo--nightmode" style="display:block;" data-v-36cf41b8><div class="logo" data-v-cb243c6e data-v-36cf41b8></div></div> <div class="start-header__sound" style="display:flex;gap:20px;align-items:center;" data-v-36cf41b8><button class="sound-switcher" @click="toggleNightMode" data-v-69263892 data-v-36cf41b8><span class="sound-switcher__text p2" data-v-69263892>Mode</span> <span class="switcher-2" data-v-87500f60 data-v-69263892><span class="switcher-2__body" data-v-87500f60><span class="switcher-2__marker" data-v-87500f60></span></span></span></button><button class="sound-switcher" data-v-69263892 data-v-36cf41b8><span class="sound-switcher__text p2" data-v-69263892>Sound</span> <span class="switcher-2" data-v-87500f60 data-v-69263892><span class="switcher-2__body" data-v-87500f60><span class="switcher-2__marker" data-v-87500f60></span></span></span></button></div> <div class="dots start-header__dots" data-v-7d6eeb50 data-v-36cf41b8><div class="dot" data-v-7d6eeb50></div> <div class="dot" data-v-7d6eeb50></div></div></header> <footer class="start-screen__footer" data-v-7934099c data-v-34202237><div class="start-screen__footer-left p2" data-v-7934099c>
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
import { AnimationMixer, MathUtils, Box3, Vector3, MeshLambertMaterial, Color } from 'three'
import * as THREE from 'three'

// --- 1. Transition Chamber Configuration ---
// Adjust these to control the duplicate chamber that arrives at the end
const transitionChamberArrivalDuration = 7; // Shortened speed (was implicit)
const transitionChamberStartZ = -30; // Starts far behind
// -------------------------------------------

// ── Refs ────────────────────────────────────────────────────────────────────
const cameraRef       = ref<any>(null)
const fogRef          = ref<any>(null)
const mouseSpotLightRef = ref<any>(null)
const fleetL          = ref<any>(null)
const fleetR          = ref<any>(null)
const chamberGroupRef = ref<any>(null)
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
  cloneAx: 0, cloneAz: 0, 
  cloneBx: 0, cloneBz: 0,
  cloneScale: 0, // Used to keep clones completely invisible until Phase 3
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
  lenis.on('scroll', ScrollTrigger.update)

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
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)

    // Dynamic Fog
    if (fogRef.value) fogRef.value.far = scrollProxy.fogFar

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

    // Door animation
    if (doorAnim.mixer && doorAnim.action && doorAnim.duration) {
      doorAnim.action.time = scrollProxy.door * doorAnim.duration
      doorAnim.mixer.update(0)
    }

    // Dynamic Fleet Spread
    if (cloneARef.value) {
      cloneARef.value.position.set(scrollProxy.cloneAx, 0, scrollProxy.cloneAz)
      cloneARef.value.scale.setScalar(scrollProxy.cloneScale)
    }
    if (cloneBRef.value) {
      cloneBRef.value.position.set(scrollProxy.cloneBx, 0, scrollProxy.cloneBz)
      cloneBRef.value.scale.setScalar(scrollProxy.cloneScale)
    }
    if (transitionChamberRef.value) {
      transitionChamberRef.value.position.set(0, 0, scrollProxy.transitionZ)
      transitionChamberRef.value.scale.setScalar(scrollProxy.transitionScale)
    }

    // Camera motion
    if (cameraRef.value && baseDistance > 0) {
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
  })
  gsap.ticker.lagSmoothing(0)

  // ── Load GLBs ──────────────────────────────────────────────────────────
  const draco = new DRACOLoader()
  draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(draco)

  // Exact Three Graces Material: Deep Matte Black
  const gracesMaterial = new MeshLambertMaterial({ color: new Color('#050505') })

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
      }
    })
    
    chamberScene.value = gltf.scene

    // Compute exact bounding box post-scale
    const box  = new Box3().setFromObject(gltf.scene)
    const size = new Vector3(); box.getSize(size); size.multiplyScalar(2.5)
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
      camX: -15, 
      camY: baseCameraPos.y + 10,  
      camZ: baseCameraPos.z + 8,  
      lookX: 0, 
      lookY: baseCameraTarget.y,
      lookZ: 0,
      fogFar: 70, // Extend fog to see the fleet
      duration: 25, 
      ease: 'power2.inOut' 
    }, 40)
    
    tl.to(scrollProxy, {
      cloneAx: -12, cloneAz: 0, // Perfectly aligned on the same invisible line
      cloneBx: 12,  cloneBz: 0, 
      cloneScale: 1, 
      fleetLightIntensity: 80, // Light up the side clones!
      duration: 25,
      ease: 'power3.out' 
    }, 40)

    // ── Phase 4: Cinematic J-Curve Breach (65% to 100%) ──
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
* { pointer-events: auto !important; }
.preloader, .loader, .popup.faq { display: none !important; }
.start-screen-wrapper,.start-screen,.main-page,.layout,.layout__page { visibility:visible !important; opacity:1 !important; }
.start-header,.start-screen__footer,.nightmode-label { opacity:1 !important; visibility:visible !important; }
.start-screen__mode-switcher { visibility:visible !important; opacity:1 !important; z-index:50; cursor:pointer; }
.cursor { position:fixed !important; left:0; top:0; pointer-events:none !important; z-index:9999; }
.cursor * { pointer-events:none !important; }

/* ── Fixed canvas — stays in background while page scrolls ── */
.canvas-fixed-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

/* Film grain */
.film-grain {
  position: absolute; top:0; left:0; width:100%; height:100%;
  pointer-events: none; z-index: 10; mix-blend-mode: overlay; opacity: 0.07;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
}
</style>
