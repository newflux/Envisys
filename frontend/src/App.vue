<template>
  <div id="app">
<<!----><!----><div id="__layout"><div id="scroller" class="layout" data-v-314f53c6><div class="preloader" data-v-edead8a0 data-v-314f53c6><div class="preloader__inner" data-v-edead8a0><h4 class="preloader__text" data-v-edead8a0><span data-v-edead8a0></span> <span data-v-edead8a0> |</span></h4></div> <div class="preloader__progress" data-v-edead8a0></div></div> <main class="layout__page" data-v-314f53c6><div class="main-page" data-v-314f53c6><div class="start-screen-wrapper" data-v-34202237><div class="start-screen" data-v-34202237><div class="start-screen__canvas-wrapper" data-v-741cd722 data-v-34202237>
  <div style="position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1;">
    <TresCanvas window-size :clear-color="sceneColor" :tone-mapping-exposure="exposure">
      <TresPerspectiveCamera ref="cameraRef" :position="[0, 0.5, 23.6]" :look-at="[0,0,0]" :fov="45" />
      
      <!-- Exact original fog values to dissipate the GLB's native floor perfectly -->
      <TresFog :color="sceneColor" :near="27" :far="29" />

      <Suspense>
        <GLTFModel path="/models/tv1.glb" :scale="1.0" :position="[0, -0.5, 0]" draco @click="toggleNightMode" />
      </Suspense>
      <TresAmbientLight :intensity="0.5" />
      <!-- Positioned to cast the gradient glow perfectly -->
      <TresPointLight :position="[0, 2.0, -5.0]" :intensity="3" :distance="50" :decay="1" />
    </TresCanvas>
  </div>
<video playsinline="" loop="loop" muted="muted" crossOrigin="anonymous" style="visibility:hidden;position:absolute;pointer-events:none;" data-v-741cd722><source src="/models/tv_square.mp4" data-v-741cd722></video></div> <header class="start-header" data-v-36cf41b8 data-v-34202237><nav class="start-header__navigation" data-v-36cf41b8><ul class="start-header__navigation-list" data-v-4a566750 data-v-36cf41b8><li class="start-header__navigation-item" data-v-4a566750><a href="/about" class="link-switcher p2" data-v-760660a8 data-v-4a566750><span class="link-switcher__icon" data-v-760660a8><span class="switcher-icon" data-v-5376e1c5 data-v-760660a8><span class="switcher-icon__shadow" data-v-5376e1c5></span> <span class="switcher-icon__body" data-v-5376e1c5><span class="switcher-icon__marker" data-v-5376e1c5></span></span></span></span> <span class="link-switcher__text" data-v-760660a8>About us</span></a></li> <li class="start-header__navigation-item" data-v-4a566750><a href="/contacts" class="link-switcher p2" data-v-760660a8 data-v-4a566750><span class="link-switcher__icon" data-v-760660a8><span class="switcher-icon" data-v-5376e1c5 data-v-760660a8><span class="switcher-icon__shadow" data-v-5376e1c5></span> <span class="switcher-icon__body" data-v-5376e1c5><span class="switcher-icon__marker" data-v-5376e1c5></span></span></span></span> <span class="link-switcher__text" data-v-760660a8>Contacts</span></a></li> <li class="start-header__navigation-item" data-v-4a566750><button class="link-switcher p2" data-v-760660a8 data-v-4a566750><span class="link-switcher__icon" data-v-760660a8><span class="switcher-icon" data-v-5376e1c5 data-v-760660a8><span class="switcher-icon__shadow" data-v-5376e1c5></span> <span class="switcher-icon__body" data-v-5376e1c5><span class="switcher-icon__marker" data-v-5376e1c5></span></span></span></span> <span class="link-switcher__text" data-v-760660a8>FAQ</span></button></li></ul></nav> <div class="start-header__logo" data-v-36cf41b8><div class="logo" data-v-cb243c6e data-v-36cf41b8></div></div> <div class="start-header__logo start-header__logo--nightmode" style="display:none;" data-v-36cf41b8><div class="logo" data-v-cb243c6e data-v-36cf41b8></div></div> <div class="start-header__sound" data-v-36cf41b8><button class="sound-switcher" data-v-69263892 data-v-36cf41b8><span class="sound-switcher__text p2" data-v-69263892>Sound</span> <span class="switcher-2" data-v-87500f60 data-v-69263892><span class="switcher-2__body" data-v-87500f60><span class="switcher-2__marker" data-v-87500f60></span></span></span></button></div> <div class="dots start-header__dots" data-v-7d6eeb50 data-v-36cf41b8><div class="dot" data-v-7d6eeb50></div> <div class="dot" data-v-7d6eeb50></div></div></header> <footer class="start-screen__footer" data-v-7934099c data-v-34202237><div class="start-screen__footer-left p2" data-v-7934099c>
    // Positioned at the axis of talent and content across film
  </div> <div class="start-screen__footer-center" data-v-7934099c><p class="scroll-down p2" data-v-751b1c41 data-v-7934099c><span data-v-751b1c41>Scroll Down</span> <span class="scroll-down__icon" data-v-751b1c41></span></p></div> <div class="start-screen__footer-right" data-v-7934099c><p class="clock p2" data-v-43f4bbf8 data-v-7934099c>06 : 57 pm</p></div></footer></div></div> <!----></div></main> <div class="popup faq" style="display: none;" data-v-55603bb3 data-v-314f53c6><button aria-label="close modal" class="faq__close-button" data-v-372f1411 data-v-55603bb3><span data-v-372f1411></span> <span data-v-372f1411></span></button> <div class="faq__inner" data-v-55603bb3><div class="faq__content" data-v-55603bb3><div class="faq__item" data-v-a5afd848 data-v-55603bb3><h3 tabindex="0" role="button" class="faq__item-title p1" data-v-a5afd848><span class="faq__item-title-text" data-v-a5afd848>How to submit your work on Netpitch.io</span></h3> <div class="faq__item-text-wrapper" data-v-a5afd848><p class="faq__item-text p2" data-v-a5afd848>
      Under the “Submit Your Pitch” tab, select whether you’re going to be submitting a film, television, or music and select “Click to Pitch”. Then, please read and follow the guidelines and provide your contact info, the info about the project, and your payment info and you’re good to go!
    </p> <div class="faq__item-pb" data-v-a5afd848></div></div> <div class="faq__item-border" data-v-a5afd848></div></div><div class="faq__item" data-v-a5afd848 data-v-55603bb3><h3 tabindex="0" role="button" class="faq__item-title p1" data-v-a5afd848><span class="faq__item-title-text" data-v-a5afd848>How do I know if my submission was received?</span></h3> <div class="faq__item-text-wrapper" data-v-a5afd848><p class="faq__item-text p2" data-v-a5afd848>
      After you provide your payment and the project is received by our system you will receive and email letting you know the process has been completed.
    </p> <div class="faq__item-pb" data-v-a5afd848></div></div> <div class="faq__item-border" data-v-a5afd848></div></div><div class="faq__item" data-v-a5afd848 data-v-55603bb3><h3 tabindex="0" role="button" class="faq__item-title p1" data-v-a5afd848><span class="faq__item-title-text" data-v-a5afd848>When will I know the status of my project?</span></h3> <div class="faq__item-text-wrapper" data-v-a5afd848><p class="faq__item-text p2" data-v-a5afd848>
      Within 10 business days after submission, you will hear from our review team whether the project will continue to be pitched or if the idea still needs some work beforehand, regardless you’ll be alerted via email.
    </p> <div class="faq__item-pb" data-v-a5afd848></div></div> <div class="faq__item-border" data-v-a5afd848></div></div><div class="faq__item" data-v-a5afd848 data-v-55603bb3><h3 tabindex="0" role="button" class="faq__item-title p1" data-v-a5afd848><span class="faq__item-title-text" data-v-a5afd848>How long will it take for my idea to get produced?</span></h3> <div class="faq__item-text-wrapper" data-v-a5afd848><p class="faq__item-text p2" data-v-a5afd848>
      The short answer is that it all depends. There are a multitude of factors anywhere from pairing projects with mandates to attracting the right talent to really put the project into motion. Initially if your idea is bought then you’ll have a contract to assure your stake in the project no matter how long it takes to get into production.
    </p> <div class="faq__item-pb" data-v-a5afd848></div></div> <div class="faq__item-border" data-v-a5afd848></div></div><div class="faq__item" data-v-a5afd848 data-v-55603bb3><h3 tabindex="0" role="button" class="faq__item-title p1" data-v-a5afd848><span class="faq__item-title-text" data-v-a5afd848>How do I come up with a great idea that's likely to sell?</span></h3> <div class="faq__item-text-wrapper" data-v-a5afd848><p class="faq__item-text p2" data-v-a5afd848>
      For beginners or those who haven’t written a full project is to read, read, and read as many great scripts as you can find to see how they are put together, pick your favorites and works you know well from the screen so as you read you can visualize how the project was made from paper to screen.

The key is originality and telling a story that hasn’t been told yet that can appeal to a mass audience…which is easier said than done. Think about unique circumstances that haven’t been done but yet could still move a viewer from any walk of life. Be sure that your characters are well thought out and have depth to bring the viewers in. 

Once you’ve got a draft down, the best writers will re-write a project several times to make sure that it flows properly and it’s ready for submission…so don’t be afraid to go back and amend what might not be working. When finished, if you’ve done your job you should be able to retell your story in 30 seconds to give people an idea of what it’s about from start to finish.
    </p> <div class="faq__item-pb" data-v-a5afd848></div></div> <div class="faq__item-border" data-v-a5afd848></div></div></div></div></div> <div class="loader" data-v-0dfb4719 data-v-314f53c6><div class="loader__inner" data-v-0dfb4719></div> <!----></div> <div class="cursor" data-v-37e7b582 data-v-314f53c6><div class="cursor__inner" data-v-37e7b582><span data-v-37e7b582></span> <span data-v-37e7b582></span> <span data-v-37e7b582></span> <span data-v-37e7b582></span></div></div></div></div>
  </div>
</template>
<script setup lang="ts">
import { GLTFModel } from '@tresjs/cientos'
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import Lenis from 'lenis'
import ScrollTrigger from 'gsap/ScrollTrigger'

const cameraRef = ref<any>(null)
const sceneColor = ref('#7a7a7a')
const exposure = ref(3)
const camState = { parallax: 8.0 }

let isNight = false
const toggleNightMode = () => {
  isNight = !isNight
  const tl = gsap.timeline()
  const proxy = { color: sceneColor.value, exposure: exposure.value }
  
  if(isNight) {
    tl.to(proxy, {
      color: '#454546', // Dark mode WebGL background
      exposure: 0.6,    // Drop exposure for night
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => { 
        sceneColor.value = proxy.color;
        exposure.value = proxy.exposure;
      }
    }, 0)
    tl.to('.link-switcher, .clock, .scroll-down, .sound-switcher__text, .start-screen__footer-left', {
      color: '#ffffff',
      fill: '#ffffff',
      duration: 0.5
    }, 0)
  } else {
    tl.to(proxy, {
      color: '#7a7a7a', // Light mode WebGL background
      exposure: 3.0,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => { 
        sceneColor.value = proxy.color;
        exposure.value = proxy.exposure;
      }
    }, 0)
    tl.to('.link-switcher, .clock, .scroll-down, .sound-switcher__text, .start-screen__footer-left', {
      color: '#101011',
      fill: '#101011',
      duration: 0.5
    }, 0)
  }
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  // 1. Lenis Smooth Scrolling (Bound to #scroller instead of window)
  const scrollerEl = document.querySelector('#scroller') as HTMLElement;
  const lenis = new Lenis({
    wrapper: scrollerEl,
    content: document.querySelector('.layout__page') as HTMLElement,
    lerp: 0.1,
    smoothWheel: true,
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
    
    // 1. Lock the Target (lookAt) inside the render loop
    if (cameraRef.value) {
      // Monitor is slightly lowered (-0.5), we stare directly at its center (-0.3) on every single frame.
      cameraRef.value.lookAt(0, -0.3, 0)
    }
  })
  gsap.ticker.lagSmoothing(0)

  // 2. Custom Cursor & Interactive Background Glow
  const cursor = document.querySelector('.cursor') as HTMLElement;
  const layoutPage = document.querySelector('.layout__page') as HTMLElement;
  
  if (cursor) {
    cursor.style.display = 'block';
    window.addEventListener('mousemove', (e) => {
      // Move cursor (centered on mouse)
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        xPercent: -50,
        yPercent: -50,
        duration: 0.1,
        ease: 'power2.out'
      })
      
      // Move CSS Gradient center
      const mouseXPct = (e.clientX / window.innerWidth) * 100;
      const mouseYPct = (e.clientY / window.innerHeight) * 100;
      if (layoutPage) {
        gsap.to(layoutPage, {
          '--mouse-x': `${mouseXPct}%`,
          '--mouse-y': `${mouseYPct}%`,
          duration: 1,
          ease: 'power2.out'
        });
      }
      
      // Extreme X-Axis Parallax Camera matched to Original
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      
      if (cameraRef.value) {
        gsap.to(cameraRef.value.position, {
          x: mouseX * camState.parallax, // Dynamically scales down as we zoom in
          y: 0.5, // Always slightly elevated (User requested)
          duration: 1.5,
          ease: 'power2.out'
        });
      }
    });
  }

  // 3. ScrollTrigger for Camera Z-Axis (Zoom into TV)
  setTimeout(() => {
    if(cameraRef.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.layout__page',
          scroller: '#scroller', // Important: Tell GSAP which div is scrolling
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      })
      
      // 2. Animate Only the Z-Axis (The Dolly In) & 3. The Immediate Stop (Zero Inertia Scrub)
      tl.to(cameraRef.value.position, {
        z: 3.5, // Stop right in front of the screen
        ease: 'none', // Strictly maps to scrollbar with zero lag
      }, 0)
      
      // Dynamically drop parallax to absolute zero so it doesn't wander around the room
      tl.to(camState, {
        parallax: 0.0, // Stop all drifting
        ease: 'none',
      }, 0)
    }
  }, 500)
})
</script>
<style>
@import "./assets/style.css";

.layout__page {
  min-height: 200vh; /* Make it scrollable for testing Lenis */
}

body, #app {
  background: transparent !important;
  overflow-x: hidden;
}

* { pointer-events: auto !important; }
.preloader, .loader, .popup.faq { display: none !important; }
.start-screen-wrapper, .start-screen, .main-page, .layout, .layout__page { visibility: visible !important; opacity: 1 !important; }
.start-header, .start-screen__footer, .nightmode-label { opacity: 1 !important; visibility: visible !important; }
.start-screen__mode-switcher { visibility: visible !important; opacity: 1 !important; z-index: 50; cursor: pointer; }

/* Let GSAP control cursor instead of absolute transform */
.cursor { position: fixed !important; left: 0; top: 0; pointer-events: none !important; z-index: 9999; } .cursor * { pointer-events: none !important; }
</style>

















