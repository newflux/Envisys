<template>
  <!-- Common frame for the inner pages: smooth scroll, nav, cursor, contact panel, and the shutter footer under a light cover.
       Anything inside .rv fades up once as it enters view. Pages get `contact()` from the slot to open the contact panel. -->
  <div class="ps-root" :class="{ ready }">
    <div id="scroller" class="layout" ref="scrollerRef">
      <main class="layout__page" ref="pageRef">
        <div class="ps-cover" :class="{ dark, blue }"><slot :contact="() => (contactOpen = true)" /></div>
        <SiteFooter @build="contactOpen = true" />
      </main>
    </div>
    <Navbar ref="navbarRef" @build-click="contactOpen = true" />
    <ScrollBar />
    <ContactPanel :open="contactOpen" @close="contactOpen = false" />
    <ReticleCursor />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import Lenis from 'lenis'
import Navbar from './Navbar.vue'
import ScrollBar from './ScrollBar.vue'
import ContactPanel from './ContactPanel.vue'
import ReticleCursor from './ReticleCursor.vue'
import SiteFooter from './SiteFooter.vue'

const props = defineProps<{ title: string; dark?: boolean; blue?: boolean }>()
// on the light-blue pages the header turns ink-dark, except where the page has gone dark: the footer's fade, or a scene that asks for it (html.hx-dark)
const toneTick = () => {
  const nu = pageRef.value?.querySelector('.nu-sec') as HTMLElement | null
  const past = !!nu && nu.getBoundingClientRect().top + nu.offsetHeight * 0.4 < 44
  document.documentElement.dataset.tone = past || document.documentElement.classList.contains('hx-dark') ? 'dark' : 'light'
}
const ready = ref(false)
const contactOpen = ref(false)
const scrollerRef = ref<HTMLElement | null>(null)
const pageRef = ref<HTMLElement | null>(null)
const navbarRef = ref<any>(null)
let lenis: Lenis | null = null
let io: IntersectionObserver | null = null
const lenisTick = (t: number) => lenis?.raf(t * 1000)

onMounted(async () => {
  document.title = `${props.title} · Envisys Technologies`
  lenis = new Lenis({ wrapper: scrollerRef.value!, content: pageRef.value!, eventsTarget: window, lerp: 0.085, smoothWheel: true })
  ;(window as any).lenisInstance = lenis
  gsap.ticker.add(lenisTick)
  if (props.blue) gsap.ticker.add(toneTick)
  io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); io!.unobserve(e.target) } }, { threshold: 0.12 })
  await nextTick()
  pageRef.value!.querySelectorAll('.rv').forEach((el) => io!.observe(el))
  ready.value = true
  gsap.delayedCall(0.2, () => navbarRef.value?.animIn?.())
})
onUnmounted(() => { gsap.ticker.remove(lenisTick); gsap.ticker.remove(toneTick); delete document.documentElement.dataset.tone; io?.disconnect(); lenis?.destroy() })
</script>

<style>
.ps-root { --lt: #ececea; --ink: #0a0a0c; --ease: cubic-bezier(0.2, 0.9, 0.2, 1); position: fixed; inset: 0; background: #000; color: var(--ink); }
.ps-root #scroller { background: #000 !important; }
.ps-root .layout__page { position: relative; }
.ps-root .Header_brandLogo__AXo7t { mix-blend-mode: difference; transition: filter 0.6s ease; }
html[data-tone="light"] .ps-root .Header_brandLogo__AXo7t { mix-blend-mode: normal; filter: brightness(0) opacity(0.85); }
html[data-tone="light"] .ps-root .hamburger-bar { background: #0d2340 !important; }
html[data-mnav] .ps-root .hamburger-bar { background: #fff !important; }
html[data-mnav] .ps-root .Header_brandLogo__AXo7t { filter: none !important; mix-blend-mode: normal; }
.ps-cover { position: relative; z-index: 2; background: var(--lt); color: var(--ink); border-radius: 0; overflow: clip; }
/* the landing page's light blue and navy ink */
.ps-cover.blue { --lt: #d6e4f3; --ink: #0d2340; background: linear-gradient(180deg, #e4eef9, #d3e3f4 60%, #c9dcf0); }
.ps-cover.dark { background: #040508; color: #f3f6fa; box-shadow: 0 1px 0 rgba(255, 255, 255, 0.07), 0 40px 80px rgba(0, 0, 0, 0.55); }
.ps-root .rv { opacity: 0; transform: translateY(24px); transition: opacity 1s ease var(--d, 0s), transform 1.2s var(--ease) var(--d, 0s); }
.ps-root .rv.in { opacity: 1; transform: none; }
.ps-label { display: flex; gap: 10px; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.65; }
.ps-pill { display: inline-flex; align-items: center; gap: 10px; padding: 11px 18px; border: 0; border-radius: 40px; background: var(--ink); color: #fff; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; text-decoration: none; transition: background 0.4s ease, gap 0.4s ease; }
.ps-pill:hover { background: #2a2c31; gap: 14px; }
.ps-pill svg { width: 8px; height: 8px; }
.ps-pill.light { background: #f4f4f2; color: var(--ink); }
.ps-pill.light:hover { background: #fff; }
</style>
