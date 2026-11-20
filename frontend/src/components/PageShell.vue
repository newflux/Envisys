<template>
  <!-- Common frame for the inner pages: smooth scroll, nav, cursor, contact panel, and the shutter footer under a light cover.
       Anything inside .rv fades up once as it enters view. Pages get `contact(text?)` from the slot to open the contact panel, optionally with the message started. -->
  <div class="ps-root" :class="{ ready }">
    <div id="scroller" class="layout" ref="scrollerRef">
      <main class="layout__page" ref="pageRef">
        <div class="ps-cover" :class="{ dark, blue }"><slot :contact="openContact" /></div>
        <SiteFooter @build="contactOpen = true" />
      </main>
    </div>
    <Navbar ref="navbarRef" @build-click="contactOpen = true" />
    <ScrollBar />
    <ContactPanel :open="contactOpen" :prefill="prefill" @close="contactOpen = false" />
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
  const past = !!nu && nu.getBoundingClientRect().top < 56 // the logo turns white the moment the dark closing block reaches it
  document.documentElement.dataset.tone = past || document.documentElement.classList.contains('hx-dark') ? 'dark' : 'light'
}
const ready = ref(false)
const contactOpen = ref(false)
// pages can open the quote with a first line already written (the model, the standard), so the visitor only adds the rest
const prefill = ref('')
const openContact = (text?: string) => { prefill.value = text ?? ''; contactOpen.value = true }
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
  // links like /resources#downloads: the page scrolls in its own container, so the browser cannot jump to the anchor itself
  if (location.hash.length > 1) setTimeout(() => { const el = document.getElementById(location.hash.slice(1)); if (el) lenis?.scrollTo(el, { duration: 1.4 }) }, 700)
  gsap.ticker.add(lenisTick)
  if (props.blue) gsap.ticker.add(toneTick)
  io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); e.target.setAttribute('data-in', ''); io!.unobserve(e.target) } }, { threshold: 0.12 })
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
/* the logo: only its white layer follows the page (it inverts over light, goes navy on the light-blue pages); the blue SYS never changes */
html[data-tone="light"] .ps-root .hamburger-bar { background: #0d2340 !important; }
html[data-mnav] .ps-root .hamburger-bar { background: #fff !important; }
.ps-cover { position: relative; z-index: 2; background: var(--lt); color: var(--ink); border-radius: 0; overflow: clip; }
/* the landing page's light blue and navy ink */
.ps-cover.blue { --lt: #d6e4f3; --ink: #0d2340; background: linear-gradient(180deg, #e4eef9, #d3e3f4 60%, #c9dcf0); }
.ps-cover.dark { background: #040508; color: #f3f6fa; box-shadow: 0 1px 0 rgba(255, 255, 255, 0.07), 0 40px 80px rgba(0, 0, 0, 0.55); }
.ps-root .rv { opacity: 0; transform: translateY(24px); transition: opacity 1s ease var(--d, 0s), transform 1.2s var(--ease) var(--d, 0s); }
/* data-in as well: a :class binding on the same element rewrites its classes and would drop .in */
.ps-root .rv.in, .ps-root .rv[data-in] { opacity: 1; transform: none; }
/* a hairline that draws itself left to right as its row comes into view (after intrepidautomation.com): add `hl` next to `rv` */
.ps-root .hl { position: relative; }
.ps-root .hl::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 1px; background: currentColor; opacity: 0.32; transform: scaleX(0); transform-origin: 0 0; transition: transform 1.6s cubic-bezier(0.7, 0, 0.2, 1) var(--d, 0s); pointer-events: none; }
.ps-root .hl[data-in]::before { transform: none; }
.ps-label { display: flex; gap: 10px; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.65; }
.ps-pill { display: inline-flex; align-items: center; gap: 10px; padding: 11px 18px; border: 0; border-radius: 40px; background: var(--ink); color: #fff; font-family: var(--font-body); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; text-decoration: none; transition: background 0.4s ease, gap 0.4s ease; }
.ps-pill:hover { background: #2a2c31; gap: 14px; }
.ps-pill svg { width: 8px; height: 8px; }
.ps-pill.light { background: #f4f4f2; color: var(--ink); }
.ps-pill.light:hover { background: #fff; }
</style>
