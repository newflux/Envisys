<template>
  <div id="app">

  <!-- Dynamic Environment Background (Deep blue-graphite void) -->
  <div class="page-background">
    <div class="vignette"></div>
  </div>

  <!-- Volumetric Atmospheric Haze (Kills pure digital black) -->
  <div class="volumetric-haze"></div>

  <!-- Film Grain Overlay (Awwwards cinematic 35mm texture) -->
  <div class="film-grain"></div>

    <!-- Smoky frosted blob (Pure CSS mask + backdrop-filter) -->
    <div class="smoke-blob" ref="frostBgRef"></div>

    <!-- Info Text Block (Center of Chamber, Image 1 Exact Layout) -->
    <div class="info-block" ref="textPanelRef" @pointerenter="isPointerInPanel = true" @pointerleave="isPointerInPanel = false">
      <div class="info-close-btn" @click="closePanel">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M1 13L13 1" stroke="currentColor" stroke-width="1.5"/></svg>
      </div>
      <div class="info-index">{{ activeChamberData.index }}</div>
      <h2 class="info-title">
        <div>ENVISYS</div>
        <div>{{ activeChamberData.model }}</div>
        <div class="outline-text">SERIES</div>
      </h2>
      <div class="info-subtitle">{{ activeChamberData.subtitle }}</div>
      <div class="info-pill">{{ activeChamberData.tempRange }}</div>
      <p class="info-desc">{{ activeChamberData.desc }}</p>
      <div class="info-specs">
        <div>{{ activeChamberData.spec1 }}</div>
        <div>{{ activeChamberData.spec2 }}</div>
      </div>
    </div>

    <!-- EXACT ICOMAT PRELOADER -->
    <Preloader @complete="onPreloaderComplete" />

    <!-- EXACT ICOMAT NAVBAR & BRAND LOGO -->
    <Navbar ref="navbarRef" @build-click="handleBuildClick" />

    <!-- EXACT ICOMAT HERO OVERLAY (TITLE, PARAGRAPH, SCROLL PILL) -->
    <HeroOverlay ref="heroOverlayRef" @scroll-down="onScrollDown" />

    <!-- PHASE 2 TELEMETRY CALLOUTS (Shooting Lines & Targeted Components) -->
    <TelemetryCallouts ref="telemetryCalloutsRef" />

    <!-- PHASE 3 FLEET OVERVIEW (Dotted Lines, Tactical Badges & Specification Matrix) -->
    <FleetOverview ref="fleetOverviewRef" @select-unit="openChamberModal" />

    <div id="__layout"><div id="scroller" class="layout" data-v-314f53c6><main class="layout__page" data-v-314f53c6><div class="main-page" data-v-314f53c6><div class="start-screen-wrapper" data-v-34202237><div class="start-screen night-mode" ref="startScreenRef" data-v-34202237><div class="start-screen__canvas-wrapper" data-v-741cd722 data-v-34202237>

  <!-- FIXED CANVAS WRAP -->
  <div class="canvas-fixed-wrap">    <TresCanvas window-size :clear-color="'#0a1113'" :clear-alpha="1" :tone-mapping-exposure="1" :pixel-ratio="pixelRatio" :antialias="true" power-preference="high-performance">
      <TresPerspectiveCamera ref="cameraRef" :fov="30" :near="0.5" :far="250" />
      
      <!-- Fog (Tinty cold bluish-ash atmospheric gallery void) -->
      <TresFog :args="['#0a1113', 30, 140]" />

      <!-- Environment Lighting (Tinty cold bluish-ash studio illumination from reference image) -->
      <Environment :background="false" :environment-intensity="0.32" :frames="1" :resolution="256">
        <!-- Overhead luminous ceiling flood centered directly over chamber (cold bluish-ash tint +0.2) -->
        <Lightformer :intensity="3.0" :position="[0, tunnelH - 2.5, 0]" :scale="[8, 12, 1]" :rotation="[-Math.PI/2, 0, 0]" color="#d4e4e2" />
        <!-- Rear Top Rim Lightformer: cuts metallic outlines along top bevels -->
        <Lightformer :intensity="5.0" :position="[0, 3.8, -3.5]" :scale="[6, 0.5, 1]" color="#c2d6d3" />
        <!-- Left & Right Kickers -->
        <Lightformer :intensity="3.5" :position="[-3.8, 1, -1.5]" :scale="[0.4, 7, 1]" :rotation="[0, Math.PI/3, 0]" color="#b0c8c5" />
        <Lightformer :intensity="3.5" :position="[3.8, 1, -1.5]" :scale="[0.4, 7, 1]" :rotation="[0, -Math.PI/3, 0]" color="#b0c8c5" />
      </Environment>

      <!-- Background 3D Text Effect (ENVISYS in Monument Extended with Seamless Looping Video Inside) -->
      <TresGroup ref="bgTextGroupRef" :position="[0, 5.1, -15]" :scale="scrollProxy.textScale">
        <!-- Solid white base text for guaranteed legibility -->
        <TresText
          ref="bgTextRef"
          text="ENVISYS"
          font="/fonts/MonumentExtended-Ultrabold.woff"
          :fontSize="9.5"
          :letterSpacing="0.02"
          color="white"
          :fillOpacity="0.75"
          :clipRect="textClipRect"
          anchorX="center"
          anchorY="middle"
          cast-shadow
        />
        <!-- Seamless dual-buffer video overlays (A and B smoothly crossfade at the seam) -->
        <TresText
          v-if="textVideoMatA"
          ref="bgTextVideoRefA"
          text="ENVISYS"
          font="/fonts/MonumentExtended-Ultrabold.woff"
          :fontSize="9.5"
          :letterSpacing="0.02"
          :material="textVideoMatA"
          :clipRect="textClipRect"
          anchorX="center"
          anchorY="middle"
          :position="[0, 0, 0.04]"
        />
        <TresText
          v-if="textVideoMatB"
          ref="bgTextVideoRefB"
          text="ENVISYS"
          font="/fonts/MonumentExtended-Ultrabold.woff"
          :fontSize="9.5"
          :letterSpacing="0.02"
          :material="textVideoMatB"
          :clipRect="textClipRect"
          anchorX="center"
          anchorY="middle"
          :position="[0, 0, 0.041]"
        />
      </TresGroup>

      <!-- Clean Studio Rim & Key Lights (Tinty cold bluish ash, +0.2 boost) -->
      <!-- High rear grazing directional light for clean metallic silhouette -->
      <TresDirectionalLight :position="[0, 5.5, -4]" :intensity="4.2" color="#d2e4e1" />
      <!-- Left & Right grazing rim directional kickers -->
      <TresDirectionalLight :position="[-4.5, 3.5, -3]" :intensity="2.8" color="#b8cecb" />
      <TresDirectionalLight :position="[4.5, 3.5, -3]" :intensity="2.8" color="#b8cecb" />
      <!-- High-angle side fill lights (soft cold architectural bounce) -->
      <TresPointLight :position="[-4.5, 2.5, -2]" :intensity="3.0" color="#9ab8b5" :distance="15" />
      <TresPointLight :position="[4.5, 2.5, -2]" :intensity="3.0" color="#9ab8b5" :distance="15" />

      <!-- Side Wall Subtle Cold Bluish-Ash Ambient Fill -->
      <TresPointLight :position="[-tunnelW/2 + 2, 3, -4]" :intensity="2.5" color="#182a2c" :distance="30" />
      <TresPointLight :position="[tunnelW/2 - 2, 3, -4]" :intensity="2.5" color="#182a2c" :distance="30" />
      <TresPointLight :position="[-tunnelW/2 + 2, 3, 12]" :intensity="2" color="#152426" :distance="25" />
      <TresPointLight :position="[tunnelW/2 - 2, 3, 12]" :intensity="2" color="#152426" :distance="25" />

      <!-- Phase 3 Fleet Fill Lights (Cold bluish ash tint) -->
      <TresPointLight ref="fleetL" :position="[-12, 0, 10]" :intensity="0" color="#bdd4d1" :distance="30" />
      <TresPointLight ref="fleetR" :position="[12, 0, 10]" :intensity="0" color="#bdd4d1" :distance="30" />

      <!-- Interactive Mouse Spotlight -->
      <TresSpotLight 
        ref="mouseSpotLightRef" 
        :angle="0.4" 
        :penumbra="1" 
        :intensity="spotlightIntensity" 
        color="#d8e8e6"
      />

      <!-- Tunnel Scene -->
      <TresGroup>
        <!-- Floor (Dark polished industrial obsidian floor with clamped subtle highlights) -->
        <TresMesh :rotation="[-Math.PI/2, 0, 0]" :position="[0, -2.05, 0]">
          <TresPlaneGeometry :args="[tunnelW, tunnelD]" />
          <MeshReflectionMaterial 
            v-if="!isMobile && floorSeamMap && scrollProxy.transitionScale < 0.1"
            color="#080e10"
            :map="floorSeamMap"
            :metalness="0.12"
            :roughness="0.32"
            :resolution="256"
            :blur="[0, 0]"
            :mixBlur="0.95"
            :mixStrength="0.28"
            :mirror="0.14"
            :depthScale="0"
            :fog="true"
          />
          <TresMeshStandardMaterial v-else-if="floorSeamMap" color="#080e10" :map="floorSeamMap" :metalness="0.15" :roughness="0.3" :fog="true" />
        </TresMesh>

        <!-- Ceiling (Industrial Aperture: heavy radial vignette light pool directly over the chamber) -->
        <TresMesh :rotation="[Math.PI/2, 0, 0]" :position="[0, tunnelH - 2.05, 0]">
          <TresPlaneGeometry :args="[tunnelW, tunnelD]" />
          <TresMeshStandardMaterial 
            v-if="ceilingGridMap && ceilingVignetteMap" 
            color="#07080a" 
            :map="ceilingGridMap" 
            :emissiveMap="ceilingVignetteMap" 
            emissive="#ffffff" 
            :emissiveIntensity="1.0" 
            :fog="true" 
          />
        </TresMesh>

        <!-- Left Wall (Architectural Concrete / Tadao Ando Monolithic Slabs) -->
        <TresMesh :rotation="[0, Math.PI/2, 0]" :position="[-tunnelW/2, (tunnelH/2) - 2.05, 0]" :visible="!isDebug">
          <TresPlaneGeometry :args="[tunnelD, tunnelH]" />
          <TresMeshStandardMaterial 
            v-if="wallNoiseMap && wallEmissiveMap" 
            color="#222327" 
            :map="wallNoiseMap" 
            :emissiveMap="wallEmissiveMap" 
            emissive="#ffffff" 
            :emissiveIntensity="0.2" 
            :roughness="0.88" 
            :metalness="0.08" 
            :fog="true" 
          />
        </TresMesh>

        <!-- Right Wall (Architectural Concrete / Tadao Ando Monolithic Slabs) -->
        <TresMesh :rotation="[0, -Math.PI/2, 0]" :position="[tunnelW/2, (tunnelH/2) - 2.05, 0]" :visible="!isDebug">
          <TresPlaneGeometry :args="[tunnelD, tunnelH]" />
          <TresMeshStandardMaterial 
            v-if="wallNoiseMap && wallEmissiveMap" 
            color="#222327" 
            :map="wallNoiseMap" 
            :emissiveMap="wallEmissiveMap" 
            emissive="#ffffff" 
            :emissiveIntensity="0.2" 
            :roughness="0.88" 
            :metalness="0.08" 
            :fog="true" 
          />
        </TresMesh>
      </TresGroup>

      <!-- Main Chamber Shadow (Render Once) -->
      <ContactShadows :position="[0, -2.04, 0]" :opacity="0.5" :blur="2.5" :resolution="256" :scale="10" :frames="1" />

      <!-- Main chamber group (Unit 02 in Phase 3) -->
      <TresGroup 
        ref="chamberGroupRef"
        @pointerdown="onChamberPointerDown"
        @pointerup="onChamberPointerUp"
        @pointerenter="() => onChamberHover(1)"
        @pointerleave="onChamberLeave"
      >
        <primitive v-if="chamberScene" :object="chamberScene" :scale="2.5" :position="[0, -2.05, 0]" />
      </TresGroup>

      <!-- Fleet clones (Unit 01 Left, Unit 03 Right) -->
      <TresGroup 
        ref="cloneARef"
        @pointerdown="() => onCloneClick(0)"
        @pointerenter="() => onChamberHover(0)"
        @pointerleave="onChamberLeave"
      >
        <primitive v-if="cloneA" :object="cloneA" :scale="2.5" :position="[0, -2.05, 0]" />
      </TresGroup>
      <TresGroup 
        ref="cloneBRef"
        @pointerdown="() => onCloneClick(2)"
        @pointerenter="() => onChamberHover(2)"
        @pointerleave="onChamberLeave"
      >
        <primitive v-if="cloneB" :object="cloneB" :scale="2.5" :position="[0, -2.05, 0]" />
      </TresGroup>

      <!-- Next-Scene Transition Chamber -->
      <TresGroup ref="transitionChamberRef">
        <primitive v-if="transitionChamber" :object="transitionChamber" :scale="2.5" :position="[0, -2.05, 0]" />
      </TresGroup>

      <!-- 3D Floating Dust Particles System -->
      <primitive v-if="dustPoints" :object="dustPoints" />
    </TresCanvas>

  </div><!-- /canvas-fixed-wrap -->

</div></div></div></div></main>
<div class="cursor" data-v-37e7b582 data-v-314f53c6>
  <div class="cursor__inner" data-v-37e7b582>
    <span data-v-37e7b582></span>
    <span data-v-37e7b582></span>
    <span data-v-37e7b582></span>
    <span data-v-37e7b582></span>
  </div>
</div>
</div></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import gsap from 'gsap'
import Lenis from 'lenis'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { MathUtils, Box3, Vector3, CanvasTexture, RepeatWrapping } from 'three'
import * as THREE from 'three'
import { Environment, Lightformer, ContactShadows, MeshReflectionMaterial } from '@tresjs/cientos'
import { extend } from '@tresjs/core'
import { Text } from 'troika-three-text'
import Preloader from './components/Preloader.vue'
import Navbar from './components/Navbar.vue'
import HeroOverlay from './components/HeroOverlay.vue'
import TelemetryCallouts from './components/TelemetryCallouts.vue'
import FleetOverview from './components/FleetOverview.vue'

extend({ Text })

const heroOverlayRef = ref<any>(null)
const telemetryCalloutsRef = ref<any>(null)
const fleetOverviewRef = ref<any>(null)
const navbarRef = ref<any>(null)

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

interface ChamberModalData {
  index: string
  model: string
  subtitle: string
  tempRange: string
  desc: string
  spec1: string
  spec2: string
}

const chamberModalList: Record<number, ChamberModalData> = {
  0: {
    index: '01',
    model: 'ET-350',
    subtitle: 'ENVIRONMENTAL TEST CHAMBER',
    tempRange: '-70°C to +180°C',
    desc: 'Compact precision simulation chamber engineered for high-frequency thermal cycling and sensor qualification in tight laboratory footprints.',
    spec1: 'HUMIDITY: 10% to 98% RH',
    spec2: 'CONTROLLER: ET-Touch 5.7" HMI'
  },
  1: {
    index: '02',
    model: 'ET-950',
    subtitle: 'ENVIRONMENTAL TEST CHAMBER',
    tempRange: '-70°C to +180°C',
    desc: 'Simulates extreme environmental conditions flawlessly for the next generation of testing. Designed for precision and reliability.',
    spec1: 'HUMIDITY: 10% to 98% RH',
    spec2: 'CONTROLLER: ET-Touch 5.7" HMI'
  },
  2: {
    index: '03',
    model: 'EO-1000',
    subtitle: 'HIGH-CAPACITY WALK-IN CHAMBER',
    tempRange: '-60°C to +150°C',
    desc: 'Heavy-capacity walk-in environmental suite designed for large automotive battery assemblies, aerospace structures, and long-duration endurance validation.',
    spec1: 'HUMIDITY: 10% to 98% RH',
    spec2: 'CONTROLLER: ET-Touch 10.4" Multi-Zone HMI'
  }
}

const activeChamberData = ref<ChamberModalData>(chamberModalList[1])

function openChamberModal(idx: number) {
  if (chamberModalList[idx]) {
    activeChamberData.value = chamberModalList[idx]
  }
  openPanel(window.innerWidth / 2, window.innerHeight / 2)
}

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
const ceilingVignetteMap = ref<any>(null)

function generateTextures() {
  // 1. Tadao Ando Architectural Cast Concrete Wall Texture (1024 x 1024)
  const wallCanvas = document.createElement('canvas')
  wallCanvas.width = 1024; wallCanvas.height = 1024
  const wCtx = wallCanvas.getContext('2d')!
  
  // Base architectural concrete tone (tinty cold bluish ash slate)
  wCtx.fillStyle = '#1c2426'
  wCtx.fillRect(0, 0, 1024, 1024)
  
  // Natural fine aggregate concrete stippling with cold bluish-ash tone
  const wImg = wCtx.getImageData(0, 0, 1024, 1024)
  for (let i = 0; i < wImg.data.length; i += 4) {
    const v = 28 + Math.floor(Math.random() * 8)
    wImg.data[i] = v
    wImg.data[i+1] = v + 3
    wImg.data[i+2] = v + 4 // cold bluish-ash tint
    wImg.data[i+3] = 255
  }
  wCtx.putImageData(wImg, 0, 0)
  
  // Horizontal formwork joints (3 major monolithic slab seams)
  const horizontalSeams = [256, 512, 768]
  horizontalSeams.forEach(y => {
    // Reveal groove shadow
    wCtx.strokeStyle = 'rgba(10, 16, 17, 0.65)'
    wCtx.lineWidth = 3
    wCtx.beginPath(); wCtx.moveTo(0, y); wCtx.lineTo(1024, y); wCtx.stroke()
    // Concrete edge chamfer catchlight (cold ash highlight)
    wCtx.strokeStyle = 'rgba(210, 230, 228, 0.09)'
    wCtx.lineWidth = 1.5
    wCtx.beginPath(); wCtx.moveTo(0, y + 2); wCtx.lineTo(1024, y + 2); wCtx.stroke()
  })

  // Major vertical slab expansion joints (wide spacing = 12m wide bays)
  const verticalSeams = [512]
  verticalSeams.forEach(x => {
    wCtx.strokeStyle = 'rgba(10, 16, 17, 0.65)'
    wCtx.lineWidth = 3
    wCtx.beginPath(); wCtx.moveTo(x, 0); wCtx.lineTo(x, 1024); wCtx.stroke()
    wCtx.strokeStyle = 'rgba(210, 230, 228, 0.09)'
    wCtx.lineWidth = 1.5
    wCtx.beginPath(); wCtx.moveTo(x + 2, 0); wCtx.lineTo(x + 2, 1024); wCtx.stroke()
  })

  // Tadao Ando Signature Formwork Tie-Holes (P-con indentations)
  const tieX = [128, 384, 640, 896]
  const tieY = [64, 192, 320, 448, 576, 704, 832, 960]
  tieX.forEach(x => {
    tieY.forEach(y => {
      // Outer subtle shadow bevel
      wCtx.fillStyle = 'rgba(8, 14, 15, 0.45)'
      wCtx.beginPath(); wCtx.arc(x, y + 0.5, 4, 0, Math.PI * 2); wCtx.fill()
      // Recessed hole interior
      wCtx.fillStyle = '#0f1718'
      wCtx.beginPath(); wCtx.arc(x, y, 3, 0, Math.PI * 2); wCtx.fill()
      // Tiny bottom rim catchlight
      wCtx.strokeStyle = 'rgba(210, 230, 228, 0.1)'
      wCtx.lineWidth = 1
      wCtx.beginPath(); wCtx.arc(x, y, 3, 0.2 * Math.PI, 0.8 * Math.PI); wCtx.stroke()
    })
  })

  // Smooth ambient occlusion at bottom (seamless junction with floor)
  const floorShadow = wCtx.createLinearGradient(0, 860, 0, 1024)
  floorShadow.addColorStop(0, 'rgba(0, 0, 0, 0)')
  floorShadow.addColorStop(1, 'rgba(8, 14, 15, 0.75)')
  wCtx.fillStyle = floorShadow
  wCtx.fillRect(0, 860, 1024, 164)

  const wallTex = new CanvasTexture(wallCanvas)
  wallTex.wrapS = wallTex.wrapT = RepeatWrapping
  wallTex.repeat.set(tunnelD.value / 12, 1) // 12-meter monolithic concrete slabs
  wallNoiseMap.value = wallTex

  // 1b. Wall Emissive Map (Ceiling Lightbox Grazing Wash with cold ash tone)
  const emissiveCanvas = document.createElement('canvas')
  emissiveCanvas.width = 1024; emissiveCanvas.height = 1024
  const eCtx = emissiveCanvas.getContext('2d')!
  eCtx.fillStyle = '#000000'
  eCtx.fillRect(0, 0, 1024, 1024)

  // Overhead lightbox grazing glow running down the top of the wall
  const eWash = eCtx.createLinearGradient(0, 0, 0, 320)
  eWash.addColorStop(0, 'rgba(210, 232, 230, 0.22)')
  eWash.addColorStop(0.5, 'rgba(180, 208, 205, 0.07)')
  eWash.addColorStop(1, 'rgba(0, 0, 0, 0)')
  eCtx.fillStyle = eWash
  eCtx.fillRect(0, 0, 1024, 320)

  const wallEmissiveTex = new CanvasTexture(emissiveCanvas)
  wallEmissiveTex.wrapS = wallEmissiveTex.wrapT = RepeatWrapping
  wallEmissiveTex.repeat.set(tunnelD.value / 12, 1)
  wallEmissiveMap.value = wallEmissiveTex

  // 2. Polished Architectural Concrete Floor Texture (512 x 512)
  const floorCanvas = document.createElement('canvas')
  floorCanvas.width = 512; floorCanvas.height = 512
  const fCtx = floorCanvas.getContext('2d')!
  fCtx.fillStyle = '#091012'
  fCtx.fillRect(0, 0, 512, 512)

  // Silky aggregate micro-texture
  const fImg = fCtx.getImageData(0, 0, 512, 512)
  for (let i = 0; i < fImg.data.length; i += 4) {
    const v = 14 + Math.floor(Math.random() * 5)
    fImg.data[i] = v
    fImg.data[i+1] = v + 1
    fImg.data[i+2] = v + 2
    fImg.data[i+3] = 255
  }
  fCtx.putImageData(fImg, 0, 0)

  // Architectural expansion joint border
  fCtx.strokeStyle = 'rgba(200, 225, 222, 0.035)'
  fCtx.lineWidth = 1
  fCtx.strokeRect(0, 0, 512, 512)

  const floorTex = new CanvasTexture(floorCanvas)
  floorTex.wrapS = floorTex.wrapT = RepeatWrapping
  floorTex.repeat.set(tunnelW.value / 8, tunnelD.value / 8) // 8-meter architectural bays
  floorSeamMap.value = floorTex

  // 3. Suspended Industrial Ceiling Grid (512 x 512)
  const ceilCanvas = document.createElement('canvas')
  ceilCanvas.width = 512; ceilCanvas.height = 512
  const cCtx = ceilCanvas.getContext('2d')!
  
  // Dark industrial structural steel T-bar frame
  cCtx.fillStyle = '#050a0b'
  cCtx.fillRect(0, 0, 512, 512)
  
  // Industrial diffuser panel with cold bluish ash gradient
  const cPanelGrad = cCtx.createRadialGradient(256, 256, 30, 256, 256, 240)
  cPanelGrad.addColorStop(0, '#d8e7e4')
  cPanelGrad.addColorStop(0.75, '#a8bcb8')
  cPanelGrad.addColorStop(1, '#566b68')
  cCtx.fillStyle = cPanelGrad
  // 12px dark structural flange border
  cCtx.fillRect(12, 12, 512 - 24, 512 - 24)

  const ceilTex = new CanvasTexture(ceilCanvas)
  ceilTex.wrapS = ceilTex.wrapT = RepeatWrapping
  ceilTex.repeat.set(tunnelW.value / 4, tunnelD.value / 4) // Clean 4m lightbox modules
  ceilingGridMap.value = ceilTex

  // 3b. Ceiling Heavy Radial Light Pool / Vignette Map (1024 x 1024, covers entire ceiling plane)
  // Pools intense focused light directly over the chamber, edges fade into total pitch-black void
  const ceilVignetteCanvas = document.createElement('canvas')
  ceilVignetteCanvas.width = 1024; ceilVignetteCanvas.height = 1024
  const cvCtx = ceilVignetteCanvas.getContext('2d')!
  cvCtx.fillStyle = '#000000'
  cvCtx.fillRect(0, 0, 1024, 1024)

  // Elliptical radial spotlight centered at 512, 512 (directly above X=0, Z=0)
  const ceilRadial = cvCtx.createRadialGradient(512, 512, 20, 512, 512, 420)
  ceilRadial.addColorStop(0, 'rgba(215, 235, 232, 1.0)')
  ceilRadial.addColorStop(0.18, 'rgba(190, 215, 212, 0.85)')
  ceilRadial.addColorStop(0.42, 'rgba(110, 135, 132, 0.35)')
  ceilRadial.addColorStop(0.65, 'rgba(30, 42, 44, 0.08)')
  ceilRadial.addColorStop(0.85, 'rgba(0, 0, 0, 0.0)')
  ceilRadial.addColorStop(1, 'rgba(0, 0, 0, 0.0)')
  cvCtx.fillStyle = ceilRadial
  cvCtx.fillRect(0, 0, 1024, 1024)

  const ceilVignetteTex = new CanvasTexture(ceilVignetteCanvas)
  ceilVignetteTex.wrapS = ceilVignetteTex.wrapT = THREE.ClampToEdgeWrapping
  ceilingVignetteMap.value = ceilVignetteTex
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

function onChamberPointerDown() {
  // Tracked globally
}

function onChamberPointerUp() {
  const dx = globalPointerX - globalPointerDownX
  const dy = globalPointerY - globalPointerDownY
  const dist = Math.sqrt(dx * dx + dy * dy)
  
  if (dist < 10) { // Slightly more forgiving for touch
    lastChamberClickTime = performance.now()
    if (scrollProxy.cloneScale > 0.5) {
      // In Phase 3: clicking center chamber (Unit 02) opens Image 1 modal!
      openChamberModal(1)
    } else if (!isPanelOpen.value) {
      // In Phase 1/2: open the hero telemetry panel
      openPanel(globalPointerX, globalPointerY)
    }
  }
}

function onCloneClick(unitIdx: number) {
  const dx = globalPointerX - globalPointerDownX
  const dy = globalPointerY - globalPointerDownY
  const dist = Math.sqrt(dx * dx + dy * dy)
  
  if (dist < 10) {
    lastChamberClickTime = performance.now()
    openChamberModal(unitIdx)
  }
}

const hoveredFleetUnit = ref<number | null>(null)

function onChamberHover(unitIdx: number) {
  document.body.classList.add('is-hovering-chamber')
  if (scrollProxy.cloneScale > 0.3) {
    hoveredFleetUnit.value = unitIdx
    fleetOverviewRef.value?.onUnitMouseEnter?.(unitIdx)
  }
}

function onChamberLeave() {
  document.body.classList.remove('is-hovering-chamber')
  hoveredFleetUnit.value = null
  fleetOverviewRef.value?.onUnitMouseLeave?.()
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
const mouseSpotLightRef = ref<any>(null)
const fleetL          = ref<any>(null)
const fleetR          = ref<any>(null)
const chamberGroupRef = ref<any>(null)
const blob1Ref        = ref<HTMLElement | null>(null)
const blob2Ref        = ref<HTMLElement | null>(null)
const blob3Ref        = ref<HTMLElement | null>(null)
const cloneARef       = ref<any>(null)
const cloneBRef       = ref<any>(null)

const bgTextGroupRef   = ref<any>(null)
const bgTextRef        = ref<any>(null)
const bgTextVideoRefA  = ref<any>(null)
const bgTextVideoRefB  = ref<any>(null)
const textVideoMatA    = shallowRef<any>(null)
const textVideoMatB    = shallowRef<any>(null)
const textClipRect     = ref<any>([-70, -30, -70, 30])
const navbarLogoRef    = ref<HTMLElement | null>(null)

import { watchEffect } from 'vue'
watchEffect(() => {
  if (cameraRef.value) {
    cameraRef.value.layers.enable(1)
  }
  if (bgTextRef.value) {
    bgTextRef.value.layers.set(1)
  }
  if (bgTextVideoRefA.value) {
    bgTextVideoRefA.value.layers.set(1)
  }
  if (bgTextVideoRefB.value) {
    bgTextVideoRefB.value.layers.set(1)
  }
})
const transitionChamberRef = ref<any>(null)
const startScreenRef  = ref<any>(null)

let activeVideo = 'A'
let videoElA: HTMLVideoElement | null = null
let videoElB: HTMLVideoElement | null = null

// Reactive scene state
const exposure       = ref(1)
const spotlightIntensity = ref(120) // Default for touch devices (+0.2 boost)
let mouseHasMoved = false

// GLB scenes
const chamberScene = shallowRef<any>(null)
const cloneA       = shallowRef<any>(null)
const cloneB       = shallowRef<any>(null)
const transitionChamber = shallowRef<any>(null)

// 3D Floating Dust Particles System (Killing pure black void with physical atmospheric motes)
const dustPoints = shallowRef<any>(null)
const DUST_COUNT = 320
let dustGeo: any = null
const dustSpeeds = new Float32Array(DUST_COUNT * 3)

function createDustTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64; canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
  grad.addColorStop(0.25, 'rgba(245, 243, 240, 0.75)')
  grad.addColorStop(0.55, 'rgba(220, 218, 215, 0.22)')
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 64, 64)
  return new CanvasTexture(canvas)
}

function initDustParticles() {
  const positions = new Float32Array(DUST_COUNT * 3)
  for (let i = 0; i < DUST_COUNT; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 22     // X: -11 to +11
    positions[i3 + 1] = -1.8 + Math.random() * 8.5 // Y: -1.8 to +6.7
    positions[i3 + 2] = -18 + Math.random() * 26   // Z: -18 to +8 (depth parallax!)
    
    dustSpeeds[i3] = (Math.random() - 0.5) * 0.0025
    dustSpeeds[i3 + 1] = 0.0008 + Math.random() * 0.002
    dustSpeeds[i3 + 2] = (Math.random() - 0.5) * 0.0025
  }

  dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const dustMat = new THREE.PointsMaterial({
    size: 0.12,
    map: createDustTexture(),
    transparent: true,
    opacity: 0.38,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: new THREE.Color('#f0eee8')
  })

  dustPoints.value = new THREE.Points(dustGeo, dustMat)
}

// Animation
let doorAnim = { mixer: null as any, action: null as any, duration: 0 }

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
  transitionScale: 0,
  textY: 5.1,
  textScale: 0.44,
  textOpacity: 1,
  logoOpacity: 0
}
if (typeof window !== 'undefined') (window as any).scrollProxy = scrollProxy

// Camera state
let baseDistance = 0
let baseSizeY    = 0
const baseCameraPos    = new Vector3()
const baseCameraTarget = new Vector3()
const projVecA         = new Vector3()
const projVecC         = new Vector3()
const projVecB         = new Vector3()
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
if (typeof window !== 'undefined') (window as any).toggleNightMode = toggleNightMode

// ── onMounted ───────────────────────────────────────────────────────────────
onMounted(() => {
  // Prevent browser from restoring previous scroll position and causing GSAP to snap
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)
  initDustParticles()
  
  // ── 3D Text Video Textures (Dual Buffers for Seamless Continuous Crossfade Loop) ──
  const setupVideoEl = () => {
    const v = document.createElement('video')
    v.src = '/videos/smoke.mp4'
    v.crossOrigin = 'anonymous'
    v.muted = true
    v.playsInline = true
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    v.style.display = 'none'
    document.body.appendChild(v)
    return v
  }

  videoElA = setupVideoEl()
  videoElB = setupVideoEl()
  videoElA.play().catch(e => console.warn('Video A play:', e))

  const videoTexA = new THREE.VideoTexture(videoElA)
  videoTexA.minFilter = THREE.LinearFilter
  videoTexA.magFilter = THREE.LinearFilter
  videoTexA.generateMipmaps = false
  videoTexA.wrapS = THREE.MirroredRepeatWrapping
  videoTexA.wrapT = THREE.ClampToEdgeWrapping

  const videoTexB = new THREE.VideoTexture(videoElB)
  videoTexB.minFilter = THREE.LinearFilter
  videoTexB.magFilter = THREE.LinearFilter
  videoTexB.generateMipmaps = false
  videoTexB.wrapS = THREE.MirroredRepeatWrapping
  videoTexB.wrapT = THREE.ClampToEdgeWrapping

  const updateVideoAspect = () => {
    const vW = videoElA?.videoWidth || 1024
    const vH = videoElA?.videoHeight || 576
    const videoAspect = vW / vH // 1.7778 (16:9)

    let textW = 72
    let textH = 9.5
    const tri = bgTextVideoRefA.value?.textRenderInfo || bgTextRef.value?.textRenderInfo
    if (tri && tri.blockBounds) {
      textW = tri.blockBounds[2] - tri.blockBounds[0]
      textH = tri.blockBounds[3] - tri.blockBounds[1]
    }
    const textAspect = textW / textH
    const repeatX = textAspect / videoAspect

    videoTexA.repeat.set(repeatX, 1)
    videoTexA.offset.set(0, 0)
    videoTexA.needsUpdate = true

    videoTexB.repeat.set(repeatX, 1)
    videoTexB.offset.set(0, 0)
    videoTexB.needsUpdate = true
  }

  videoElA.addEventListener('loadedmetadata', updateVideoAspect)
  setTimeout(updateVideoAspect, 600)
  setTimeout(updateVideoAspect, 2000)

  textVideoMatA.value = new THREE.MeshBasicMaterial({
    map: videoTexA,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.NormalBlending
  })

  textVideoMatB.value = new THREE.MeshBasicMaterial({
    map: videoTexB,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    blending: THREE.NormalBlending
  })
  
  gsap.registerPlugin(ScrollTrigger)
  gsap.set('.link-switcher,.clock,.scroll-down,.sound-switcher__text,.start-screen__footer-left',{ color:'#ffffff', fill:'#ffffff' })

  const scrollerEl = document.querySelector('#scroller') as HTMLElement
  if (scrollerEl) scrollerEl.scrollTop = 0 // Reset custom scroller
  
  const lenis = new Lenis({ wrapper: scrollerEl, content: document.querySelector('.layout__page') as HTMLElement, lerp: 0.08, smoothWheel: true })
  ;(window as any).lenisInstance = lenis
  
  lenis.on('scroll', (e: any) => {
    // Close panel on scroll start if pointer isn't inside it
    if (Math.abs(e.velocity) > 0 && isPanelOpen.value && !isPointerInPanel.value) {
      closePanelImmediate()
    }
    ScrollTrigger.update()
  })

  window.addEventListener('mousemove', (e) => {
    if (!mouseHasMoved) {
      mouseHasMoved = true
      gsap.to(spotlightIntensity, { value: 180, duration: 0.5, overwrite: true }) // +0.2 boost
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

    // 3D Floating Dust Drift (Screen feels alive before scrolling)
    if (dustPoints.value && dustGeo) {
      const pos = dustGeo.attributes.position.array as Float32Array
      for (let i = 0; i < DUST_COUNT; i++) {
        const i3 = i * 3
        pos[i3] += dustSpeeds[i3] + Math.sin(time * 0.35 + i) * 0.001
        pos[i3 + 1] += dustSpeeds[i3 + 1] + Math.cos(time * 0.25 + i * 0.7) * 0.0006
        pos[i3 + 2] += dustSpeeds[i3 + 2] + Math.sin(time * 0.3 + i * 1.3) * 0.001
        
        // Dynamic volume wrapping
        if (pos[i3 + 1] > 7.0) pos[i3 + 1] = -1.8
        if (pos[i3] > 11) pos[i3] = -11
        if (pos[i3] < -11) pos[i3] = 11
        if (pos[i3 + 2] > 8) pos[i3 + 2] = -18
        if (pos[i3 + 2] < -18) pos[i3 + 2] = 8
      }
      dustGeo.attributes.position.needsUpdate = true
    }

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
      
      const updateClone = (cloneRef: any, x: number, y: number, z: number) => {
        cloneRef.position.set(isDebug ? 0 : x, isDebug ? y : y, isDebug ? 0 : z)
        cloneRef.scale.setScalar(isDebug ? 1 : scrollProxy.cloneScale)
        
        // Only toggle visibility. Do not traverse materials on every frame!
        const isVisible = fade > 0 && scrollProxy.cloneScale > 0
        if (cloneRef.visible !== isVisible) {
          cloneRef.visible = isVisible
        }
      }
      
      // Uniform chamber sizing matching reference
      updateClone(cloneARef.value, scrollProxy.cloneAx, scrollProxy.cloneAy, scrollProxy.cloneAz)
      updateClone(cloneBRef.value, scrollProxy.cloneBx, scrollProxy.cloneBy, scrollProxy.cloneBz)
    }
    // Hide transition chamber completely when scale is 0 to save massive draw calls
    if (transitionChamberRef.value) {
      transitionChamberRef.value.position.set(0, 0, scrollProxy.transitionZ)
      transitionChamberRef.value.scale.setScalar(scrollProxy.transitionScale)
      transitionChamberRef.value.visible = scrollProxy.transitionScale > 0
    }

    // Update Phase 0 Text/Logo Handoff
    if (bgTextGroupRef.value) {
      // Rotational Parallax (Swinging):
      // Extremely soft and subtle interaction per your request (barely moves).
      const targetTextRotY = targetMouseX * -0.02
      const targetTextX = targetMouseX * -0.15
      const targetTextY = scrollProxy.textY + (targetMouseY * -0.05)
      
      bgTextGroupRef.value.rotation.y += (targetTextRotY - bgTextGroupRef.value.rotation.y) * 0.05
      bgTextGroupRef.value.position.x += (targetTextX - bgTextGroupRef.value.position.x) * 0.1
      bgTextGroupRef.value.position.y += (targetTextY - bgTextGroupRef.value.position.y) * 0.1
      bgTextGroupRef.value.position.z = -15 // Hard anchored in center

      bgTextGroupRef.value.scale.setScalar(scrollProxy.textScale)
      // Hide completely when faded out to save rendering/raycasting
      bgTextGroupRef.value.visible = scrollProxy.textOpacity > 0
    }
    if (bgTextRef.value) {
      bgTextRef.value.fillOpacity = scrollProxy.textOpacity * 0.75
    }

    // Seamless continuous crossfade loop (zero frame drops, zero sync calls)
    if (textVideoMatA.value && textVideoMatB.value && videoElA && videoElB) {
      const dur = videoElA.duration || 5.466
      const fadeSec = 0.95

      if (activeVideo === 'A') {
        const cur = videoElA.currentTime
        if (cur >= dur - fadeSec) {
          if (videoElB.paused) {
            videoElB.currentTime = 0
            videoElB.play().catch(() => {})
          }
          const t = Math.min(1, Math.max(0, (cur - (dur - fadeSec)) / fadeSec))
          const blend = Math.sin(t * Math.PI * 0.5)
          textVideoMatA.value.opacity = scrollProxy.textOpacity * 0.85 * (1 - blend)
          textVideoMatB.value.opacity = scrollProxy.textOpacity * 0.85 * blend
          if (cur >= dur - 0.06 || videoElA.ended) {
            activeVideo = 'B'
            videoElA.pause()
          }
        } else {
          textVideoMatA.value.opacity = scrollProxy.textOpacity * 0.85
          textVideoMatB.value.opacity = 0
        }
      } else {
        const cur = videoElB.currentTime
        if (cur >= dur - fadeSec) {
          if (videoElA.paused) {
            videoElA.currentTime = 0
            videoElA.play().catch(() => {})
          }
          const t = Math.min(1, Math.max(0, (cur - (dur - fadeSec)) / fadeSec))
          const blend = Math.sin(t * Math.PI * 0.5)
          textVideoMatB.value.opacity = scrollProxy.textOpacity * 0.85 * (1 - blend)
          textVideoMatA.value.opacity = scrollProxy.textOpacity * 0.85 * blend
          if (cur >= dur - 0.06 || videoElB.ended) {
            activeVideo = 'A'
            videoElB.pause()
          }
        } else {
          textVideoMatB.value.opacity = scrollProxy.textOpacity * 0.85
          textVideoMatA.value.opacity = 0
        }
      }
    }
    if (navbarLogoRef.value) {
      navbarLogoRef.value.style.opacity = scrollProxy.logoOpacity.toString()
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

        // Real-time 3D camera projection for FleetOverview badges and dotted lines
        if (fleetOverviewRef.value && scrollProxy.cloneScale > 0) {
          const cam = cameraRef.value
          const w = window.innerWidth
          const h = window.innerHeight
          
          // Project at center of each chamber matching Image 3 DSA badges:
          projVecA.set(scrollProxy.cloneAx, -0.4, scrollProxy.cloneAz).project(cam)
          projVecC.set(0, -0.4, 0).project(cam)
          projVecB.set(scrollProxy.cloneBx, -0.4, scrollProxy.cloneBz).project(cam)

          fleetOverviewRef.value.setProjectedAnchors([
            { x: (projVecA.x * 0.5 + 0.5) * w, y: (-projVecA.y * 0.5 + 0.5) * h },
            { x: (projVecC.x * 0.5 + 0.5) * w, y: (-projVecC.y * 0.5 + 0.5) * h },
            { x: (projVecB.x * 0.5 + 0.5) * w, y: (-projVecB.y * 0.5 + 0.5) * h }
          ])
        }
      }
    }
  })
  gsap.ticker.lagSmoothing(0)

  // ── Load GLBs ──────────────────────────────────────────────────────────
  const draco = new DRACOLoader()
  draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(draco)
  loader.load('/models/chamber_main.glb', (gltf: any) => {
    // Retain original Blender materials, textures, and finishes untouched
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = false // Prevents CAD self-shadow fighting
        if (child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material]
          mats.forEach((mat: any) => {
            if (!mat) return
            mat.fog = false
            mat.depthWrite = true
          })
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
      doorAnim.mixer  = new THREE.AnimationMixer(gltf.scene)
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
        scrub: 1.5, // 1.5s physical smoothing delay (Awwwards heavy physics)
      }
    })

    // ── Phase 0 & 2: Intro Dissolve & Seamless Spec Pan (0 to 30) ──
    // 1. Immediately dissolve 3D background text on scroll start
    tl.to(scrollProxy, {
      textOpacity: 0,
      logoOpacity: 1,
      duration: 10,
      ease: 'power2.out'
    }, 0)

    // Slide tagline, mid-right text, and scroll pill cleanly out through their line masks (same mask effect they entered with)
    tl.to('.Hero_title__FZMTC .line', {
      y: '-115%',
      opacity: 0,
      duration: 10,
      stagger: 0.02,
      ease: 'power2.in'
    }, 0)
    tl.to('.Hero_text__cn7Li .line', {
      y: '-115%',
      opacity: 0,
      duration: 10,
      stagger: 0.02,
      ease: 'power2.in'
    }, 0)
    tl.to('.Hero_iconDownWrapper__FfrlA', {
      opacity: 0,
      scale: 0.7,
      duration: 8,
      ease: 'power2.in'
    }, 0)
    tl.to('.Hero_overlayWrapper', {
      opacity: 0,
      pointerEvents: 'none',
      duration: 10,
      ease: 'power2.in'
    }, 0)

    // 2. Direct, fluid transition to the spec inspection angle (no push-pull)
    tl.to(scrollProxy, { 
      camX: -1.8, 
      camY: baseCameraPos.y + 0.5, 
      camZ: baseCameraPos.z - (baseDistance * 0.6), 
      lookX: -3.0, 
      lookY: baseCameraTarget.y + 1.2, 
      duration: 30, 
      ease: 'power2.inOut' 
    }, 0)
    tl.fromTo(scrollProxy, 
      { chamberYaw: 0 }, 
      { chamberYaw: Math.PI * 2, duration: 30, ease: 'power2.inOut' }, 
      0
    )

    // ── Phase 2: Telemetry Callouts Shooting Lines & Targeting Dots (22 to 50) ──
    tl.to('.telemetry-callouts-layer', { opacity: 1, duration: 6, ease: 'power2.out' }, 22)
    tl.fromTo('.vanishing-line', 
      { scaleX: 0, transformOrigin: 'right center' }, 
      { scaleX: 1, duration: 8, stagger: 0.2, ease: 'expo.out' }, 
      22
    )
    tl.fromTo('.callout-dot', 
      { scale: 0 }, 
      { scale: 1, duration: 5, stagger: 0.2, ease: 'back.out(2)' }, 
      22.5
    )
    // Kinetic typography reveal from behind masks (matching Phase 1)
    tl.fromTo('.callout-heading.callout-line', 
      { y: '115%', opacity: 1 }, 
      { y: '0%', opacity: 1, duration: 6, stagger: 0.15, ease: 'power3.out' }, 
      23.5
    )
    tl.fromTo('.callout-text.callout-line', 
      { y: '115%', opacity: 1 }, 
      { y: '0%', opacity: 1, duration: 6, stagger: 0.15, ease: 'power3.out' }, 
      25
    )

    // Retract lines and slide typography out through line masks before Phase 3
    tl.to('.vanishing-line', { scaleX: 0, transformOrigin: 'right center', duration: 5, stagger: 0.1, ease: 'power2.in' }, 47.5)
    tl.to('.callout-line', { y: '-115%', opacity: 0, duration: 4.5, stagger: 0.05, ease: 'power2.in' }, 48)
    tl.to('.callout-dot', { scale: 0, duration: 3, ease: 'power2.in' }, 48.5)
    tl.to('.telemetry-callouts-layer', { opacity: 0, duration: 3, ease: 'power2.in' }, 50)

    // ── Phase 3: The South-West Spread Motion & Angled Lineup (55 to 80) ──
    tl.to(scrollProxy, { 
      camX: -9, // Stay safely inside the new wider left wall
      camY: baseCameraPos.y + 6,  
      camZ: baseCameraPos.z + 4,  
      lookX: 0, 
      lookY: baseCameraTarget.y,
      lookZ: 0,
      duration: 25, 
      ease: 'power2.inOut' 
    }, 55)
    
    tl.to(scrollProxy, {
      cloneAx: -10, // Spread horizontally cleanly inside the wider tunnel
      cloneBx: 10,  
      cloneAy: -0.06,
      cloneBy: -0.06,
      cloneAz: 0, 
      cloneBz: 0, 
      cloneScale: 1, 
      fleetLightIntensity: 80, // Light up the side clones!
      duration: 25,
      ease: 'power3.out' 
    }, 55)

    // ── Fleet Overview UI (58 to 78) - Matches Image 3 Reference Aesthetic ──
    tl.to('.fleet-overview-container', { opacity: 1, duration: 2.5, ease: 'power2.out' }, 58)
    tl.fromTo('.fleet-title-line', 
      { y: '115%', opacity: 1 }, 
      { y: '0%', opacity: 1, duration: 4.5, stagger: 0.1, ease: 'power3.out' }, 
      58.5
    )
    tl.fromTo('.fleet-vector-line', 
      { opacity: 0 }, 
      { opacity: 1, duration: 3.5, ease: 'power2.out' }, 
      59
    )
    tl.fromTo('.chamber-badge-box', 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 1, scale: 1, duration: 3.5, stagger: 0.1, ease: 'back.out(1.5)' }, 
      59.5
    )
    tl.fromTo('.fleet-lead-text', 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 4, ease: 'power2.out' }, 
      59
    )
    tl.fromTo('.fleet-spec-row', 
      { opacity: 0, x: 15 }, 
      { opacity: 1, x: 0, duration: 3.5, stagger: 0.08, ease: 'power2.out' }, 
      59.5
    )

    // Fleet Overview UI Exit (smoothly slide out through line masks before Phase 4 door dive)
    tl.to('.fleet-title-line', { y: '-115%', opacity: 0, duration: 3, stagger: 0.04, ease: 'power2.in' }, 75)
    tl.to(['.fleet-vector-line', '.chamber-badge-box', '.fleet-lead-text', '.fleet-spec-row'], { opacity: 0, duration: 2.5, ease: 'power2.in' }, 75.5)
    tl.to('.fleet-overview-container', { opacity: 0, duration: 2, ease: 'power2.in' }, 78)

    // ── Phase 4: Cinematic J-Curve Breach (80 to 115) ──
    // Fade out clones over a short span as the section ends
    tl.to(scrollProxy, { cloneFade: 0, duration: 3, ease: 'none' }, 80)
    
    // 1. Center the camera's X/Y quickly (80 to 90)
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
    }, 80)

    // 2. Start opening the door seamlessly on approach (85 to 100)
    tl.to(scrollProxy, { door: 1, duration: 15, ease: "power2.inOut" }, 85)

    // 3. One fluid, non-stop Z-dive all the way in (80 to 115)
    tl.to(scrollProxy, { camZ: 1.2, duration: 35, ease: "power2.inOut" }, 80)

    // ── Phase 5: Next-Scene Transition Chamber (108 to 115) ──
    tl.to(scrollProxy, {
      transitionZ: -5,
      transitionScale: 1,
      duration: transitionChamberArrivalDuration,
      ease: "power3.out"
    }, 100 - transitionChamberArrivalDuration)

  }, 600)
}


// --- ICOMAT INTEGRATION HANDLERS ---
function onPreloaderComplete() {
  document.body.style.overflow = ''
  if ((window as any).lenisInstance) (window as any).lenisInstance.start()
  window.dispatchEvent(new Event('preloader:done'))

  // 1. Animate Navbar & Topbar in
  navbarRef.value?.animIn?.()

  // 2. Laser-Cutting Reveal for ENVISYS Text (First the background ENVISYS arrives)
  scrollProxy.textOpacity = 1
  scrollProxy.textScale = 0.44

  const laserProgress = { x: -80 }
  if (bgTextRef.value) {
    bgTextRef.value.fillOpacity = 0.75
    bgTextRef.value.clipRect = [-80, -30, -80, 30]
    if (bgTextRef.value.sync) bgTextRef.value.sync()
  }
  if (bgTextVideoRefA.value) {
    bgTextVideoRefA.value.clipRect = [-80, -30, -80, 30]
    if (bgTextVideoRefA.value.sync) bgTextVideoRefA.value.sync()
  }
  if (bgTextVideoRefB.value) {
    bgTextVideoRefB.value.clipRect = [-80, -30, -80, 30]
    if (bgTextVideoRefB.value.sync) bgTextVideoRefB.value.sync()
  }

  gsap.to(laserProgress, {
    x: 80,
    duration: 1.15,
    ease: 'power3.inOut',
    delay: 0.15,
    onUpdate: () => {
      textClipRect.value = [-80, -30, laserProgress.x, 30]
      if (bgTextRef.value) {
        bgTextRef.value.clipRect = [-80, -30, laserProgress.x, 30]
        if (bgTextRef.value.sync) bgTextRef.value.sync()
      }
      if (bgTextVideoRefA.value) {
        bgTextVideoRefA.value.clipRect = [-80, -30, laserProgress.x, 30]
        if (bgTextVideoRefA.value.sync) bgTextVideoRefA.value.sync()
      }
      if (bgTextVideoRefB.value) {
        bgTextVideoRefB.value.clipRect = [-80, -30, laserProgress.x, 30]
        if (bgTextVideoRefB.value.sync) bgTextVideoRefB.value.sync()
      }
    },
    onComplete: () => {
      textClipRect.value = null
      if (bgTextRef.value) {
        bgTextRef.value.clipRect = null
        if (bgTextRef.value.sync) bgTextRef.value.sync()
      }
      if (bgTextVideoRefA.value) {
        bgTextVideoRefA.value.clipRect = null
        if (bgTextVideoRefA.value.sync) bgTextVideoRefA.value.sync()
      }
      if (bgTextVideoRefB.value) {
        bgTextVideoRefB.value.clipRect = null
        if (bgTextVideoRefB.value.sync) bgTextVideoRefB.value.sync()
      }
      // 3. Trigger bottom-left & mid-right typography STRICTLY AFTER ENVISYS has arrived!
      heroOverlayRef.value?.playEntrance?.()
    }
  })
}

function onScrollDown() {
  if ((window as any).lenisInstance) {
    (window as any).lenisInstance.scrollTo(window.innerHeight, { duration: 1.5, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  } else {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }
}

function handleBuildClick() {
  openPanel(window.innerWidth / 2, window.innerHeight / 2)
}

onMounted(() => {
  ;(window as any).telemetryCalloutsRef = telemetryCalloutsRef
  // Pre-set navbar opacity to 0 until preloader completes
  gsap.set(['.Header_topBar__t3Nfy', '.Header_header__qBw1J'], { opacity: 0, y: -20 })
})
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

/* Film grain - High performance cinematic texture */
.film-grain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 995;
  mix-blend-mode: overlay;
  opacity: 0.04;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
}

/* ── Volumetric Atmospheric Haze (Kills pure digital black) ── */
.volumetric-haze {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 4;
  background: 
    radial-gradient(ellipse 65% 55% at 50% 48%, rgba(255, 255, 255, 0.035) 0%, rgba(20, 20, 24, 0.04) 55%, transparent 85%),
    linear-gradient(180deg, rgba(16, 17, 20, 0.25) 0%, transparent 40%, rgba(8, 9, 11, 0.45) 100%);
  mix-blend-mode: screen;
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
  background: radial-gradient(ellipse 85% 75% at 50% 45%, #142224 0%, #0a1315 50%, #050a0b 100%);
  overflow: hidden;
  pointer-events: none;
}

.vignette {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  background: radial-gradient(circle at 50% 50%, transparent 50%, rgba(5, 10, 11, 0.65) 100%);
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
