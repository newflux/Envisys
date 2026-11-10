<template>
  <div class="navbar-root">
    <SearchOverlay :open="searchOpen" @close="searchOpen = false" />
    <!-- softens whatever is behind the open menu, so the page never fights with it -->
    <div class="Nav_scrim" :class="{ on: isCompanyOpen || isProductsOpen }" aria-hidden="true"></div>
    <!-- Top Bar with Left Brand Logo & Mobile Trigger -->
    <div ref="topBarRef" class="Header_topBar__t3Nfy">
      <a 
        class="Header_brandLogo__AXo7t" 
        aria-label="ENVISYS - Back home" 
        href="/"
        @click.prevent="onLogoClick"
      >
        <!-- the Envisys logo: its letters rise into place on load and when you click back to the top -->
        <BrandMark ref="brandRef" mono class="nav-brand" />
      </a>

      <!-- Mobile Hamburger Button -->
      <button 
        class="Header_burgerMenu__gyP1B mobile-hamburger" 
        @click="isMobileOpen = !isMobileOpen"
        aria-label="Toggle navigation"
      >
        <span class="hamburger-bar" :class="{ active: isMobileOpen }"></span>
        <span class="hamburger-bar" :class="{ active: isMobileOpen }"></span>
      </button>
    </div>

    <!-- Main Navigation Pill (Top Right) & Dropdown Submenu Cards -->
    <header ref="headerRef" class="Header_header__qBw1J" :class="{ 'is-mobile-open': isMobileOpen }">
      <div class="Header_brandLogoSpacer__MPAO1"></div>
      
      <div 
        class="Nav_wrapper__EfAHX Header_nav__DMp9j Nav_show__gn0zM" 
        :class="{ 'Nav_mobileOpen': isMobileOpen }"
        data-lenis-prevent="true"
        @mouseleave="onNavWrapperLeave"
      >
        <div class="Nav_backgroundMobile__HYUuU" v-if="isMobileOpen"></div>

        <nav class="Nav_nav__ABerH Nav_show__gn0zM" aria-label="Main navigation">
          <!-- Glass Backdrop Blur Capsule -->
          <div ref="navBgRef" class="Nav_backgroundNav__kGWok Nav_blur__hax35"></div>

          <ul class="Nav_mainMenu__pDzJf">
            <!-- Home item (hidden on desktop per icomat design) -->
            <li class="Nav_item__uIn_C nav-item-home">
              <a class="Nav_link__Vx_8M" href="/">
                <span class="Nav_label__EHdHO">
                  <div class="line-mask"><div class="line">home</div></div>
                </span>
              </a>
            </li>

            <!-- 1. Products Link (formerly solutions) -->
            <li 
              class="Nav_item__uIn_C" 
              :class="{ 'is-dimmed': activeIndex !== null && activeIndex !== 1 }"
              @mouseenter="openProductsMenu"
            >
              <a class="Nav_link__Vx_8M" href="/products">
                <span class="Nav_label__EHdHO">
                  <div class="line-mask"><div class="line">products</div></div>
                </span>
              </a>
            </li>

            <!-- 2. Verticals Link (formerly tech) -->
            <li 
              class="Nav_item__uIn_C" 
              :class="{ 'is-dimmed': activeIndex !== null && activeIndex !== 2 }"
              @mouseenter="onItemEnter(2)"
            >
              <a class="Nav_link__Vx_8M" href="/verticals">
                <span class="Nav_label__EHdHO">
                  <div class="line-mask"><div class="line">verticals</div></div>
                </span>
              </a>
            </li>

            <!-- 3. Industries Link -->
            <li 
              class="Nav_item__uIn_C" 
              :class="{ 'is-dimmed': activeIndex !== null && activeIndex !== 3 }"
              @mouseenter="onItemEnter(3)"
            >
              <a class="Nav_link__Vx_8M" href="/industries">
                <span class="Nav_label__EHdHO">
                  <div class="line-mask"><div class="line">industries</div></div>
                </span>
              </a>
            </li>

            <!-- 3b. The in-stock chart: standard models ready to ship -->
            <li 
              class="Nav_item__uIn_C" 
              :class="{ 'is-dimmed': activeIndex !== null && activeIndex !== 5 }"
              @mouseenter="onItemEnter(5)"
            >
              <a class="Nav_link__Vx_8M" href="/in-stock">
                <span class="Nav_label__EHdHO">
                  <div class="line-mask"><div class="line">in stock</div></div>
                </span>
              </a>
            </li>

            <!-- 4. The Company Trigger (Opens Full-Width Submenu Cards) -->
            <li 
              class="Nav_company__UZ8b9" 
              :class="{ 'is-dimmed': activeIndex !== null && activeIndex !== 4 }"
              @mouseenter="openCompanyMenu(4)"
            >
              <button 
                class="Nav_companyBtn__ceON4" 
                @click="toggleCompanyMenu" 
                :aria-expanded="isCompanyOpen"
              >
                <span class="Nav_labelWrapper__SDnrQ">
                  <span class="Nav_label__EHdHO">
                    <div class="line-mask"><div class="line">The Company</div></div>
                  </span>
                  <div 
                    class="Nav_arrow__5_gsV" 
                    :class="{ 'arrow-up': isCompanyOpen }"
                  >
                    <svg viewBox="0 0 8 5" fill="none" width="9" height="6" aria-hidden="true">
                      <path d="M0.353516 0.353554L3.85352 3.85355L7.35352 0.353554" stroke="currentColor" stroke-width="1.2"></path>
                    </svg>
                  </div>
                </span>
              </button>
            </li>

            <!-- search: opens the product search sheet -->
            <li class="Nav_search" @mouseenter="onItemEnter(6)">
              <button class="Nav_searchBtn" aria-label="Search products" @click="searchOpen = true">
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="6.8" cy="6.8" r="4.6" fill="none" stroke="currentColor" stroke-width="1.3"></circle><path d="M10.4 10.4L14 14" stroke="currentColor" stroke-width="1.3"></path></svg>
              </button>
            </li>

            <!-- 5. Build w/ ENVISYS CTA Button (Crisp White Rounded Button, Solid Black on Hover) -->
            <li 
              class="Nav_contact__H607i" 
              :class="{ 'is-dimmed': activeIndex !== null && activeIndex !== 5 }"
              @mouseenter="onItemEnter(5)"
            >
              <button 
                class="Nav_contactBtn__pdvQU" 
                @click="$emit('build-click')"
                @mouseenter="isContactHovered = true"
                @mouseleave="isContactHovered = false"
              >
                <div class="Nav_backgroundContact__xUc3D" :class="{ 'is-active-black': isContactHovered }"></div>
                <svg viewBox="0 0 9 9" fill="none" class="Nav_dotArrow__QLXCS" width="9" height="9">
                  <path d="M7.65039 0.650024L7.65039 6.65002" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"></path>
                  <path d="M7.65039 0.650024L1.65039 0.650024" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"></path>
                  <path d="M7.65039 0.650024L0.650391 7.65002" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"></path>
                </svg>
                <span class="Nav_label__EHdHO">
                  <div class="line-mask"><div class="line">BUILD W/ ENVISYS</div></div>
                </span>
              </button>
            </li>
          </ul>
        </nav>

        <!-- Products menu: pick a kind of test on the left, see its chambers (photo, name, one line) in the middle; quick links on the right -->
        <div class="Nav_mega" :class="{ on: isProductsOpen }" @mouseenter="keepProductsMenu" @mouseleave="onMegaLeave">
          <div class="Nav_megaIn">
            <div class="mg-groups">
              <span class="mg-eye">Products by test</span>
              <button v-for="g in groups" :key="g" :class="{ on: g === megaGroup }" @mouseenter="megaGroup = g" @focus="megaGroup = g" @click="megaGroup = g">
                <span>{{ g }}</span><small>{{ products.filter((q) => q.group === g).length }}</small>
              </button>
              <a class="mg-all" href="/products">All {{ products.length }} series <i>→</i></a>
            </div>
            <div class="mg-list">
              <div class="mg-head"><b>{{ megaGroup }}</b><span>{{ groupLine[megaGroup] }}</span></div>
              <div class="mg-grid">
                <a v-for="p in products.filter((q) => q.group === megaGroup)" :key="p.slug" class="mg-item" :href="`/products/${p.slug}`">
                  <span class="mg-th"><img :src="img(p, 'hero')" alt="" loading="lazy" /></span>
                  <span class="mg-tx"><b>{{ p.name }}</b><small>{{ p.tagline }}</small></span>
                </a>
              </div>
            </div>
            <div class="mg-side">
              <span class="mg-eye">Find a chamber</span>
              <button @click="isProductsOpen = false; searchOpen = true">Search by model or test</button>
              <a href="/in-stock">In stock, ready to ship</a>
              <span class="mg-eye">Services</span>
              <a href="/verticals">Vistara testing lab (NABL)</a>
              <a href="/verticals">Rentals</a>
              <a href="/verticals">Refurbishment and buy-back</a>
              <a href="/verticals">After-sales and AMC</a>
              <span class="mg-eye">Documents</span>
              <a href="/resources">Brochures and guides</a>
            </div>
          </div>
        </div>

        <!-- Company Dropdown Submenu Cards (Exact Architecture: Wide, Spacious, Aesthetic Floating Cards) -->
        <div 
          ref="submenuRef"
          class="Nav_submenu__EKbU9" 
          :class="{ 'Nav_visible__CEbKe': isCompanyOpen }" 
          aria-hidden="false"
          @mouseenter="keepCompanyMenuOpen"
          @mouseleave="onSubmenuLeave"
        >
          <ul>
            <!-- 1) About Us (formerly manifesto) - Solid White on Hover -->
            <a 
              class="CompanySubmenuItem_submenuItem__irMc_" 
              :class="{ 'is-hovered-white': hoveredSubIndex === 0 }"
              href="/about"
              @mouseenter="hoveredSubIndex = 0"
              @mouseleave="hoveredSubIndex = null"
            >
              <div class="CompanySubmenuItem_submenuItemBackground__i1vpn">
                <div class="CompanySubmenuItem_submenuItemBackgroundInner__MIdIG"></div>
              </div>
              <div class="CompanySubmenuItem_left__OLqdH">
                <img src="/media/team.jpg" alt="" aria-hidden="true" style="object-position: 58% 40%" />
                <span class="CompanySubmenuItem_link__ZOT0M">
                  <div class="line-mask"><div class="line">about us</div></div>
                  <small class="CompanySubmenuItem_sub">Our story, our team, our sites</small>
                </span>
              </div>
              <div class="CompanySubmenuItem_right__Aj08A">
                <svg viewBox="0 0 8 5" fill="none" width="10" height="6" style="transform:rotate(-90deg)">
                  <path d="M0.353516 0.353554L3.85352 3.85355L7.35352 0.353554" stroke="currentColor" stroke-width="1.2"></path>
                </svg>
              </div>
            </a>

            <!-- 2) Resources (formerly careers) - Solid White on Hover -->
            <a 
              class="CompanySubmenuItem_submenuItem__irMc_" 
              :class="{ 'is-hovered-white': hoveredSubIndex === 1 }"
              href="/resources"
              @mouseenter="hoveredSubIndex = 1"
              @mouseleave="hoveredSubIndex = null"
            >
              <div class="CompanySubmenuItem_submenuItemBackground__i1vpn">
                <div class="CompanySubmenuItem_submenuItemBackgroundInner__MIdIG"></div>
              </div>
              <div class="CompanySubmenuItem_left__OLqdH">
                <img src="/media/step-3.jpg" alt="" aria-hidden="true" />
                <span class="CompanySubmenuItem_link__ZOT0M">
                  <div class="line-mask"><div class="line">resources</div></div>
                  <small class="CompanySubmenuItem_sub">Guides and documents</small>
                </span>
              </div>
              <div class="CompanySubmenuItem_right__Aj08A">
                <svg viewBox="0 0 8 5" fill="none" width="10" height="6" style="transform:rotate(-90deg)">
                  <path d="M0.353516 0.353554L3.85352 3.85355L7.35352 0.353554" stroke="currentColor" stroke-width="1.2"></path>
                </svg>
              </div>
            </a>

            <!-- 3) Contact (formerly whitepapers) - Solid White on Hover -->
            <a 
              class="CompanySubmenuItem_submenuItem__irMc_" 
              :class="{ 'is-hovered-white': hoveredSubIndex === 2 }"
              href="/contact"
              @mouseenter="hoveredSubIndex = 2"
              @mouseleave="hoveredSubIndex = null"
            >
              <div class="CompanySubmenuItem_submenuItemBackground__i1vpn">
                <div class="CompanySubmenuItem_submenuItemBackgroundInner__MIdIG"></div>
              </div>
              <div class="CompanySubmenuItem_left__OLqdH">
                <img src="/media/site-aerial.jpg" alt="" aria-hidden="true" style="object-position: 52% 50%" />
                <span class="CompanySubmenuItem_link__ZOT0M">
                  <div class="line-mask"><div class="line">contact</div></div>
                  <small class="CompanySubmenuItem_sub">Peenya, Bengaluru</small>
                </span>
              </div>
              <div class="CompanySubmenuItem_right__Aj08A">
                <svg viewBox="0 0 8 5" fill="none" width="10" height="6" style="transform:rotate(-90deg)">
                  <path d="M0.353516 0.353554L3.85352 3.85355L7.35352 0.353554" stroke="currentColor" stroke-width="1.2"></path>
                </svg>
              </div>
            </a>
          </ul>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { scrollToTop } from '../utils/scrollTop'
import SearchOverlay from './SearchOverlay.vue'
import BrandMark from './BrandMark.vue'
import { products, groups, img } from '../config/products'
import type { Group } from '../config/products'

defineEmits<{
  (e: 'build-click'): void
}>()

// UI state
const isCompanyOpen = ref(false)
const isProductsOpen = ref(false)
const megaGroup = ref<Group>(groups[0])
// one plain line under each kind of test, in the products menu
const groupLine: Record<Group, string> = {
  'Climatic & thermal': 'Temperature and humidity, from a bench-top chamber to a walk-in room.',
  'Shock, altitude & vacuum': 'Sudden temperature swings, low pressure and outgassing.',
  'Vibration & mechanical': 'Shaking, dropping and loading, at temperature.',
  'Ingress, corrosion & light': 'Water, dust, salt fog, sunlight and UV.',
  'Energy & mobility': 'Batteries, electric motors and solar modules.'
}
const isMobileOpen = ref(false)
const searchOpen = ref(false)
const isContactHovered = ref(false)
const activeIndex = ref<number | null>(null)
const hoveredSubIndex = ref<number | null>(null)
let closeTimer: any = null
// the landing page draws its giant wordmark in a canvas behind the menu; tell the page so it can step back
watch([isCompanyOpen, isProductsOpen], ([a, b]) => { document.documentElement.dataset.menu = a || b ? '1' : '' })
watch(isMobileOpen, (v) => { document.documentElement.dataset.mnav = v ? '1' : ''; (window as any).lenisInstance?.[v ? 'stop' : 'start']?.() })

// DOM refs
const topBarRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const navBgRef = ref<HTMLElement | null>(null)
const submenuRef = ref<HTMLElement | null>(null)

const brandRef = ref<InstanceType<typeof BrandMark> | null>(null)

// ── Hover Physics for Nav Items ────────────────────────────────
function onItemEnter(index: number) {
  clearTimeout(closeTimer)
  activeIndex.value = index
  if (index !== 4) {
    isCompanyOpen.value = false
  }
  if (index !== 1) isProductsOpen.value = false
}

// the products menu: opens a beat after the pointer arrives, stays while it moves into the panel
function openProductsMenu() {
  clearTimeout(closeTimer)
  clearTimeout(openTimer)
  activeIndex.value = 1
  isCompanyOpen.value = false
  if (window.matchMedia('(max-width: 768px)').matches) return // phones use the plain list
  openTimer = setTimeout(() => { isProductsOpen.value = true }, 110)
}
function keepProductsMenu() { clearTimeout(closeTimer); isProductsOpen.value = true; activeIndex.value = 1 }
function onMegaLeave() {
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => { isProductsOpen.value = false; if (activeIndex.value === 1) activeIndex.value = null }, 220)
}

let openTimer: any = null
function openCompanyMenu(index: number) {
  clearTimeout(closeTimer)
  clearTimeout(openTimer)
  activeIndex.value = index
  if (isCompanyOpen.value) return
  isProductsOpen.value = false
  openTimer = setTimeout(() => { isCompanyOpen.value = true; stagger() }, 110)
}
function stagger() {
  if (submenuRef.value) {
    const cards = submenuRef.value.querySelectorAll('.CompanySubmenuItem_submenuItem__irMc_')
    gsap.killTweensOf(cards)
    gsap.fromTo(
      cards,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out', overwrite: 'auto' }
    )
  }
}

function toggleCompanyMenu() {
  clearTimeout(openTimer)
  isCompanyOpen.value = !isCompanyOpen.value
  if (isCompanyOpen.value) stagger()
}

function keepCompanyMenuOpen() {
  clearTimeout(closeTimer)
  isCompanyOpen.value = true
  activeIndex.value = 4
}

function onSubmenuLeave() {
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    isCompanyOpen.value = false
    if (activeIndex.value === 4) {
      activeIndex.value = null
    }
  }, 220)
}

function onNavWrapperLeave() {
  clearTimeout(openTimer)
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    isCompanyOpen.value = false
    isProductsOpen.value = false
    activeIndex.value = null
  }, 200)
}

// ── Top Left Brand Logo Animation: the letters rise from behind the baseline, the blocks drop in ──
function playLogoAnim() {
  brandRef.value?.play(0.1)
}

// ── Global Entrance Choreography (animIn) ──────────────────────
function animIn() {
  // Reveal navbar-root with autoAlpha (No remnants visible during preloader)
  gsap.to('.navbar-root', {
    autoAlpha: 1,
    duration: 0.8,
    ease: 'power2.out',
    onComplete: () => {
      const el = document.querySelector('.navbar-root') as HTMLElement
      if (el) el.style.pointerEvents = 'auto'
    }
  })

  if (topBarRef.value) {
    gsap.fromTo(
      topBarRef.value,
      { autoAlpha: 0, y: -20 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
  }

  if (headerRef.value) {
    gsap.fromTo(
      headerRef.value,
      { autoAlpha: 0, y: -20 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
  }

  // Slide nav capsule in from right (xPercent: 105 -> 0)
  if (navBgRef.value) {
    gsap.fromTo(
      navBgRef.value,
      { xPercent: 105 },
      { xPercent: 0, duration: 0.85, ease: 'power3.out', delay: 0.08 }
    )
  }

  // Stagger nav text lines rising cleanly into view
  const lines = headerRef.value?.querySelectorAll('.Nav_mainMenu__pDzJf .line')
  if (lines && lines.length > 0) {
    gsap.fromTo(
      lines,
      { opacity: 0, y: 6 },
      { 
        opacity: 1,
        y: 0, 
        duration: 0.5, 
        stagger: 0.04, 
        ease: 'power2.out', 
        delay: 0.1,
        clearProps: 'transform,opacity'
      }
    )
  }

  // Trigger logo arc sweep + progressive letter reveal
  gsap.delayedCall(0.18, () => {
    playLogoAnim()
  })
  gsap.delayedCall(1, () => { introDone = true })
}

// Scroll down: the links drop out one by one, the capsule slides off to the right and the nav lifts away
// (the logo stays).
// Scroll up: the same intro plays again. Always shown near the top and while a menu is open.
let introDone = false
let hidden = false
let lastY = 0
function navLines() {
  return headerRef.value?.querySelectorAll('.Nav_mainMenu__pDzJf .line') ?? []
}
// The logo is home: back to the top (behind a curtain from deep in the page), with its arc sweep as it lands.
function onLogoClick() {
  if (location.pathname !== '/') { location.href = '/'; return } // on any other page the logo goes home
  scrollToTop(playLogoAnim)
}
function hideNav() {
  const bars = [headerRef.value]
  gsap.killTweensOf([...bars, navBgRef.value, ...navLines()])
  gsap.to(navLines(), { opacity: 0, y: -8, duration: 0.28, stagger: 0.03, ease: 'power2.in' })
  gsap.to(navBgRef.value, { xPercent: 105, duration: 0.55, ease: 'power3.in', delay: 0.08 })
  gsap.to(bars, { autoAlpha: 0, y: -24, filter: 'blur(6px)', duration: 0.5, ease: 'power2.in', delay: 0.22 })
}
function showNav() {
  const bars = [headerRef.value]
  gsap.killTweensOf([...bars, navBgRef.value, ...navLines()])
  gsap.to(bars, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' })
  gsap.fromTo(navBgRef.value, { xPercent: 105 }, { xPercent: 0, duration: 0.75, ease: 'power3.out', delay: 0.05 })
  gsap.fromTo(navLines(), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: 'power2.out', delay: 0.12, clearProps: 'transform,opacity' })
}
function watchScroll() {
  if (!introDone) return
  const sc = document.getElementById('scroller')
  const y = (window as any).lenisInstance?.scroll ?? sc?.scrollTop ?? 0
  const dy = y - lastY
  lastY = y
  let hide = hidden
  if (y < 80 || isCompanyOpen.value || isMobileOpen.value) hide = false
  else if (dy > 4) hide = true
  else if (dy < -4) hide = false
  if (hide === hidden) return
  hidden = hide
  hide ? hideNav() : showNav()
}

// anything on the page can open the search: the nav button, a field on the products page, or the keyboard
const openSearch = () => { searchOpen.value = true }
const onKey = (e: KeyboardEvent) => {
  const t = e.target as HTMLElement
  if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !/INPUT|TEXTAREA/.test(t?.tagName))) { e.preventDefault(); searchOpen.value = true }
}
onMounted(() => { window.addEventListener('envisys:search', openSearch); window.addEventListener('keydown', onKey) })
onUnmounted(() => { window.removeEventListener('envisys:search', openSearch); window.removeEventListener('keydown', onKey) })

onMounted(() => {
  if (navBgRef.value) {
    gsap.set(navBgRef.value, { transformOrigin: 'right center' })
  }
  gsap.ticker.add(watchScroll)
})
onUnmounted(() => gsap.ticker.remove(watchScroll))

defineExpose({
  animIn,
  playLogoAnim
})
</script>

<style scoped>
/* ── Hidden Root Before Preloader Finishes ────────────────────── */
.navbar-root {
  position: relative;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* ── Top Bar Container (Left Logo) - Big, Bold & Aesthetic ───── */
.Header_topBar__t3Nfy {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding-top: 24.7px;
  padding-left: 24px;
  padding-right: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 15;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  box-sizing: border-box;
}

.Header_topBar__t3Nfy > * {
  pointer-events: auto;
}

.Header_brandLogo__AXo7t {
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
}
/* hover dims the two layers themselves: opacity on the link would stop the ink layer blending with the page */
.Header_brandLogo__AXo7t .lg-ink, .Header_brandLogo__AXo7t .lg-blue { transition: opacity 0.25s ease; }
.Header_brandLogo__AXo7t:hover .lg-ink, .Header_brandLogo__AXo7t:hover .lg-blue { opacity: 0.85; }
.nav-brand { width: 112px; }

/* Mobile Hamburger Button */
.mobile-hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  flex-direction: column;
  gap: 5px;
}

.hamburger-bar {
  display: block;
  width: 22px;
  height: 2px;
  background-color: #fff;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

@media (max-width: 768px) {
  .mobile-hamburger {
    display: flex;
  }
  /* phones: the menu is closed until the button opens it, then it fills the screen */
  .Header_header__qBw1J:not(.is-mobile-open) { display: none !important; }
  .Header_header__qBw1J.is-mobile-open { inset: 0; padding: 96px 7vw 7vw; background: rgba(4, 6, 10, 0.97); overflow-y: auto; pointer-events: auto; }
  .Header_header__qBw1J.is-mobile-open .Nav_wrapper__EfAHX { width: 100%; align-items: stretch; }
  .Header_header__qBw1J.is-mobile-open .Nav_nav__ABerH { background: none; overflow: visible; padding: 0; }
  .Header_header__qBw1J.is-mobile-open .Nav_backgroundNav__kGWok { display: none; }
  .Header_header__qBw1J.is-mobile-open .Nav_mainMenu__pDzJf { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; width: 100%; font-size: 26px; }
}

/* ── Header Container (Top Right Nav) - Spacious, Elegant & Long ── */
.Header_header__qBw1J {
  position: fixed;
  top: 0;
  right: 0;
  padding-top: 24.7px;
  padding-right: 24px;
  z-index: 14;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
}

.Header_nav__DMp9j {
  pointer-events: auto;
}

/* Nav Wrapper (AkkuratMono Typography, Generous Proportion) */
.Nav_wrapper__EfAHX {
  font-family: AkkuratMono, monospace, sans-serif;
  font-size: 12.35px;
  line-height: 1.2;
  letter-spacing: 0.25px;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 650px; /* room for the five links, the search and the button, with a little to spare */
}

/* Main Nav Capsule (Long, Spacious, Architectural Rounded Bar) */
.Nav_nav__ABerH {
  position: relative;
  width: 100%;
  overflow: hidden;
  color: #fff;
  padding: 4.5px;
  border-radius: 8px;
  min-height: 42px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.Nav_backgroundNav__kGWok {
  border-radius: 8px;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: -1;
  background-color: rgba(18, 20, 24, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.08);
  will-change: transform;
}

.Nav_blur__hax35 {
  backdrop-filter: blur(43px);
  -webkit-backdrop-filter: blur(43px);
}

.Nav_mainMenu__pDzJf {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

/* Hidden home item on desktop */
.nav-item-home {
  display: none;
}

/* Nav Link Items - Generous Padding for Wide Aesthetic Spread */
.Nav_item__uIn_C {
  padding: 0;
  transition: opacity 0.3s ease;
}

.Nav_link__Vx_8M {
  position: relative;
  display: block;
  padding: 5.6px 11px;
  color: rgba(255, 255, 255, 0.7) !important;
  text-decoration: none;
  cursor: pointer;
  font-size: 12.35px;
  letter-spacing: 0.25px;
  white-space: nowrap;
  transition: color 0.25s ease;
}

/* an invisible, taller target: the whole height of the bar is clickable, not just the letters */
.Nav_link__Vx_8M::after { content: ''; position: absolute; left: 0; right: 0; top: -14px; bottom: -14px; }

.Nav_link__Vx_8M:hover {
  color: #ffffff !important;
}

.Nav_label__EHdHO {
  display: inline-flex;
  align-items: center;
  color: inherit;
}

.Nav_nav__ABerH .Nav_mainMenu__pDzJf .Nav_label__EHdHO .line-mask {
  display: block !important;
  position: relative !important;
  overflow: clip !important;
  padding-top: 0 !important;
  vertical-align: middle;
}

.Nav_nav__ABerH .Nav_mainMenu__pDzJf .Nav_label__EHdHO .line {
  display: block !important;
  color: inherit;
  will-change: transform !important;
  text-shadow: 0 1.8em currentColor !important;
  transition: transform 0.35s cubic-bezier(0.2, 0, 0, 1), color 0.25s ease !important;
}

.Nav_link__Vx_8M:hover .Nav_label__EHdHO .line,
.Nav_companyBtn__ceON4:hover .Nav_label__EHdHO .line,
.Nav_contactBtn__pdvQU:hover .Nav_label__EHdHO .line {
  transform: translateY(-1.8em) !important;
}

/* The Company Trigger */
.Nav_company__UZ8b9 {
  position: relative;
  padding: 0;
  transition: opacity 0.3s ease;
}

.Nav_companyBtn__ceON4 {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7) !important;
  font: inherit;
  letter-spacing: 0.25px;
  text-transform: inherit;
  font-size: 12.35px;
  cursor: pointer;
  padding: 5.6px 26px 5.6px 11px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  position: relative;
  white-space: nowrap;
  transition: color 0.25s ease;
}

.Nav_companyBtn__ceON4:hover,
.Nav_companyBtn__ceON4[aria-expanded="true"] {
  color: #ffffff !important;
}

.Nav_labelWrapper__SDnrQ {
  display: flex;
  align-items: center;
}

.Nav_arrow__5_gsV {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: auto;
  color: inherit;
  transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1);
  display: flex;
  align-items: center;
}

.Nav_arrow__5_gsV.arrow-up {
  transform: translateY(-50%) rotate(180deg);
}

/* ── Build w/ ENVISYS Button (Crisp White Rounded Button, Turns Solid Black on Hover) ── */
.Nav_contact__H607i {
  margin-left: 4px;
  display: flex;
  align-items: center;
}

.Nav_contactBtn__pdvQU {
  position: relative;
  color: #080808 !important;
  border: none;
  border-radius: 5.6px;
  padding: 5.6px 12px;
  min-height: 33px;
  overflow: hidden;
  cursor: pointer;
  font: inherit;
  font-size: 12.35px;
  font-weight: 500;
  letter-spacing: 0.25px;
  text-transform: uppercase;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.3s ease;
  box-sizing: border-box;
  white-space: nowrap;
}

.Nav_backgroundContact__xUc3D {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: -1;
  background-color: #ffffff;
  border-radius: 5.6px;
  transition: background-color 0.3s cubic-bezier(0.2, 0, 0, 1);
  will-change: transform;
}

.Nav_backgroundContact__xUc3D.is-active-black,
.Nav_contactBtn__pdvQU:hover .Nav_backgroundContact__xUc3D {
  background-color: #080808 !important;
}

.Nav_contactBtn__pdvQU:hover {
  color: #ffffff !important;
}

.Nav_contactBtn__pdvQU .Nav_label__EHdHO .line {
  text-shadow: 0 1.8em #ffffff;
}

.Nav_dotArrow__QLXCS {
  width: 9px;
  height: 9px;
  color: inherit;
  transition: transform 0.25s ease, color 0.3s ease;
  flex-shrink: 0;
}

.Nav_contactBtn__pdvQU:hover .Nav_dotArrow__QLXCS {
  color: #ffffff;
  transform: translate(1.5px, -1.5px);
}

/* Subtle Dimming on Other Items */
.is-dimmed {
  opacity: 0.45 !important;
}

/* ── Company Dropdown Submenu Cards (Wide, Tall, Luxury Floating Cards) ── */
.Nav_search { list-style: none; display: flex; align-items: center; }
.Nav_searchBtn { width: 34px; height: 34px; margin: 0 4px 0 2px; display: grid; place-items: center; border: 0; border-radius: 50%; background: transparent; color: #fff; opacity: 0.7; cursor: pointer; transition: background 0.3s ease, opacity 0.3s ease; }
.Nav_searchBtn:hover { background: rgba(255, 255, 255, 0.14); opacity: 1; }
.Nav_scrim { position: fixed; inset: 0; z-index: 5; pointer-events: none; opacity: 0; background: radial-gradient(80% 100% at 80% 0%, rgba(2, 4, 8, 0.86), rgba(2, 4, 8, 0.7) 75%); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); transition: opacity 0.45s ease; }
.Nav_scrim.on { opacity: 1; }
.CompanySubmenuItem_sub { display: block; margin-top: 3px; font-size: 9.5px; letter-spacing: 0.1em; opacity: 0.5; text-transform: uppercase; transition: opacity 0.3s ease; }
.CompanySubmenuItem_submenuItem__irMc_:hover .CompanySubmenuItem_sub { opacity: 0.65; }
/* the products menu: three panes in a clear order: the kind of test, its chambers, quick links. A solid panel on a dimmed page,
   set in the site's clean grotesk (names) and Geist (text), with normal letter-spacing, so it reads calmly. */
.Nav_wrapper__EfAHX { position: relative; }
.Nav_mega { position: absolute; top: calc(100% + 12px); right: 0; z-index: 1001; width: min(1180px, calc(100vw - 48px)); opacity: 0; visibility: hidden; transform: translateY(-6px); transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.2, 0.9, 0.2, 1), visibility 0s linear 0.25s; }
.Nav_mega.on { opacity: 1; visibility: visible; transform: none; transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.2, 0.9, 0.2, 1); }
.Nav_mega::before { content: ''; position: absolute; top: -14px; left: 0; right: 0; height: 14px; }
.Nav_megaIn { display: grid; grid-template-columns: 300px minmax(0, 1fr) 260px; min-height: 440px; border-radius: 14px; overflow: hidden; background: #101216; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 40px 90px rgba(0, 0, 0, 0.55); color: #fff; text-transform: none; letter-spacing: 0; font-family: 'Geist', var(--font-body), sans-serif; }
.mg-eye { display: block; margin: 0 0 12px; font-family: 'Geist Mono', var(--font-body), monospace; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); }

/* 1 · the kinds of test */
.mg-groups { display: flex; flex-direction: column; gap: 2px; padding: 28px 14px 22px; background: #14161b; border-right: 1px solid rgba(255, 255, 255, 0.08); }
.mg-groups .mg-eye { padding: 0 14px; }
.mg-groups button { display: flex; justify-content: space-between; align-items: center; gap: 12px; width: 100%; padding: 14px 14px; border: 0; border-radius: 10px; background: none; color: rgba(255, 255, 255, 0.62); font-family: 'LayGrotesk-Semibold', 'Geist', sans-serif; font-size: 19px; line-height: 1.2; letter-spacing: -0.01em; text-align: left; cursor: pointer; transition: background 0.2s ease, color 0.2s ease; }
.mg-groups button small { font-family: 'Geist Mono', monospace; font-size: 13px; letter-spacing: 0; color: rgba(255, 255, 255, 0.4); }
.mg-groups button.on { background: rgba(255, 255, 255, 0.09); color: #fff; }
.mg-groups button.on small { color: #ff6a1a; }
.mg-all { margin-top: auto; padding: 16px 14px 0; color: #fff; font-family: 'Geist', sans-serif; font-size: 15px; text-decoration: none; }
.mg-all i { font-style: normal; color: #ff6a1a; }

/* 2 · the chambers of the chosen kind */
.mg-list { padding: 28px 30px 26px; }
.mg-head { display: flex; flex-direction: column; gap: 8px; padding-bottom: 18px; margin-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.mg-head b { font-weight: 400; font-family: 'LayGrotesk-Semibold', 'Geist', sans-serif; font-size: 30px; line-height: 1.1; letter-spacing: -0.015em; }
.mg-head span { font-family: 'Geist', sans-serif; font-size: 15px; line-height: 1.45; color: rgba(255, 255, 255, 0.62); }
.mg-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px 16px; }
.mg-item { display: grid; grid-template-columns: 64px minmax(0, 1fr); align-items: center; gap: 16px; padding: 10px; border-radius: 12px; color: #fff; text-decoration: none; transition: background 0.2s ease; }
.mg-item:hover { background: rgba(255, 255, 255, 0.07); }
.mg-th { display: grid; place-items: center; width: 64px; height: 64px; border-radius: 10px; background: linear-gradient(180deg, #eaf1f9, #d3e0ef); overflow: hidden; }
.mg-th img { width: 86%; height: 86%; object-fit: contain; }
.mg-tx { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.mg-tx b { font-weight: 400; font-family: 'LayGrotesk-Semibold', 'Geist', sans-serif; font-size: 17px; line-height: 1.2; letter-spacing: -0.005em; }
.mg-tx small { font-family: 'Geist', sans-serif; font-size: 14px; line-height: 1.4; color: rgba(255, 255, 255, 0.6); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.mg-item:hover .mg-tx b { color: #ff8a4a; }

/* 3 · quick links */
.mg-side { display: flex; flex-direction: column; align-items: flex-start; padding: 28px 26px 22px; border-left: 1px solid rgba(255, 255, 255, 0.08); }
.mg-side .mg-eye:not(:first-child) { margin-top: 24px; }
.mg-side a, .mg-side button { padding: 7px 0; border: 0; background: none; color: rgba(255, 255, 255, 0.88); font-family: 'Geist', sans-serif; font-size: 16px; line-height: 1.35; text-align: left; text-decoration: none; cursor: pointer; transition: color 0.2s ease; }
.mg-side a:hover, .mg-side button:hover { color: #ff8a4a; }
@media (max-width: 768px) { .Nav_mega { display: none; } }

.Nav_submenu__EKbU9 {
  width: 100%;
  margin-top: 12.35px;
  display: none !important;
  position: relative;
  z-index: 1000;
}

/* Invisible Bridge Hitbox */
.Nav_submenu__EKbU9::before {
  content: "";
  position: absolute;
  top: -16px;
  left: 0;
  width: 100%;
  height: 16px;
  background: transparent;
}

.Nav_submenu__EKbU9.Nav_visible__CEbKe {
  display: block !important;
}

.Nav_submenu__EKbU9 ul {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5.6px;
}

/* Floating Submenu Card - Large, Spacious, Aesthetic (Height ~91px) */
.CompanySubmenuItem_submenuItem__irMc_ {
  width: 100%;
  color: #ffffff;
  border-radius: 8.98px;
  padding: 5.6px;
  min-height: 91px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  position: relative;
  text-decoration: none;
  cursor: pointer;
  box-sizing: border-box;
  transition: color 0.3s ease;
}

/* Dark Glass Floating Background */
.CompanySubmenuItem_submenuItemBackground__i1vpn {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: -1;
  backdrop-filter: blur(43px);
  -webkit-backdrop-filter: blur(43px);
  border-radius: 8.98px;
  background-color: rgba(8, 8, 8, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: opacity 0.3s ease, background-color 0.3s ease;
}

/* White Background Layer for Hover (Matches Reference Image 1) */
.CompanySubmenuItem_submenuItemBackgroundInner__MIdIG {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: #ffffff;
  opacity: 0;
  border-radius: 8.98px;
  transition: opacity 0.3s cubic-bezier(0.2, 0, 0, 1);
}

/* When Card is Hovered: Pure Solid White Background, Black Text & Black Arrow */
.CompanySubmenuItem_submenuItem__irMc_.is-hovered-white .CompanySubmenuItem_submenuItemBackground__i1vpn,
.CompanySubmenuItem_submenuItem__irMc_:hover .CompanySubmenuItem_submenuItemBackground__i1vpn {
  background-color: #ffffff !important;
  opacity: 1 !important;
}

.CompanySubmenuItem_submenuItem__irMc_.is-hovered-white .CompanySubmenuItem_submenuItemBackgroundInner__MIdIG,
.CompanySubmenuItem_submenuItem__irMc_:hover .CompanySubmenuItem_submenuItemBackgroundInner__MIdIG {
  opacity: 1 !important;
}

.CompanySubmenuItem_submenuItem__irMc_.is-hovered-white,
.CompanySubmenuItem_submenuItem__irMc_:hover {
  color: #080808 !important;
}

.CompanySubmenuItem_left__OLqdH {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 18px;
}

/* Large, crisp preview image (80px x 80px square) matching reference screenshot */
.CompanySubmenuItem_left__OLqdH img {
  transition: transform 0.7s cubic-bezier(0.2, 0.9, 0.2, 1);
  width: 79.7px;
  height: 79.7px;
  object-fit: cover;
  border-radius: 7.86px;
  flex-shrink: 0;
}

.CompanySubmenuItem_link__ZOT0M {
  line-height: 1.4;
  font-family: AkkuratMono, monospace, sans-serif;
  font-size: 12.35px;
  letter-spacing: 0.25px;
  font-weight: 400;
  text-transform: uppercase;
}

.CompanySubmenuItem_link__ZOT0M .line-mask {
  overflow: clip;
  display: block;
}

.CompanySubmenuItem_link__ZOT0M .line {
  will-change: transform;
  text-shadow: 0 1.8em #080808;
  transition: transform 0.35s cubic-bezier(0.2, 0, 0, 1);
}

.CompanySubmenuItem_link__ZOT0M .line.rolled-black,
.CompanySubmenuItem_submenuItem__irMc_:hover .line {
  transform: translateY(-1.8em);
}

.CompanySubmenuItem_right__Aj08A {
  margin-right: 30px;
  width: 9px;
  height: auto;
  color: inherit;
  display: flex;
  align-items: center;
  transition: color 0.3s ease, transform 0.25s ease;
}

.CompanySubmenuItem_submenuItem__irMc_:hover .CompanySubmenuItem_left__OLqdH img { transform: scale(1.06); }
.CompanySubmenuItem_submenuItem__irMc_:hover .CompanySubmenuItem_right__Aj08A {
  transform: translateX(3px);
}
</style>

<style>
/* while the company menu is open the 3D scene behind it softens and darkens, so the wordmark never fights the cards */
.canvas-fixed-wrap { transition: filter 0.5s ease; }
html[data-menu="1"] .canvas-fixed-wrap { filter: blur(12px) brightness(0.3); }
</style>
