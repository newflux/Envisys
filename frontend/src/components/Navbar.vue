<template>
  <div class="navbar-root">
    <!-- Top Bar with Left Brand Logo & Mobile Trigger -->
    <div ref="topBarRef" class="Header_topBar__t3Nfy">
      <a 
        class="Header_brandLogo__AXo7t" 
        aria-label="ENVISYS - Back home" 
        href="/"
        @mouseenter="playLogoAnim"
      >
        <!-- 7-Arc Sphere Brandmark with Animated Alternating ClipPaths -->
        <svg 
          class="BrandLogo_logo__q8D51" 
          width="36" 
          height="31.5" 
          viewBox="0 0 24 21" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="nav-clip-0"><rect ref="clipRect0" x="0" y="0" width="100%" height="21"></rect></clipPath>
            <clipPath id="nav-clip-1"><rect ref="clipRect1" x="100%" y="0" width="100%" height="21"></rect></clipPath>
            <clipPath id="nav-clip-2"><rect ref="clipRect2" x="0" y="0" width="100%" height="21"></rect></clipPath>
            <clipPath id="nav-clip-3"><rect ref="clipRect3" x="100%" y="0" width="100%" height="21"></rect></clipPath>
            <clipPath id="nav-clip-4"><rect ref="clipRect4" x="0" y="0" width="100%" height="21"></rect></clipPath>
            <clipPath id="nav-clip-5"><rect ref="clipRect5" x="100%" y="0" width="100%" height="21"></rect></clipPath>
            <clipPath id="nav-clip-6"><rect ref="clipRect6" x="0" y="0" width="100%" height="21"></rect></clipPath>
          </defs>
          <path clip-path="url(#nav-clip-0)" d="M4.93561 20.277C8.90405 18.1244 14.4418 18.1244 18.4102 20.277L18.3688 20.4163C17.825 20.2601 17.2756 20.1246 16.7224 20.0098C13.4088 19.2986 9.93896 19.2986 6.62535 20.0098C6.07214 20.1246 5.52269 20.262 4.97889 20.4163L4.9375 20.277H4.93561Z" fill="#F8F8F8"></path>
          <path clip-path="url(#nav-clip-1)" d="M2.54027 18.0303C7.96888 14.7186 15.3789 14.7186 20.8075 18.0303L20.751 18.1639C20.0322 17.8666 19.3003 17.607 18.557 17.3831C14.105 16.0245 9.24465 16.0245 4.79074 17.3831C4.04749 17.6051 3.31364 17.8666 2.59672 18.1639L2.54027 18.0303Z" fill="#F8F8F8"></path>
          <path clip-path="url(#nav-clip-2)" d="M1.04246 15.62C7.22186 11.3844 16.1259 11.3844 22.3053 15.62L22.2394 15.7479C21.4228 15.3377 20.5817 14.9783 19.7218 14.6679C14.5792 12.7824 8.76858 12.7824 3.62599 14.6679C2.76607 14.9783 1.92684 15.3377 1.10832 15.7479L1.04246 15.62Z" fill="#F8F8F8"></path>
          <path clip-path="url(#nav-clip-3)" d="M0.186365 12.9706C6.75903 8.12719 16.587 8.12719 23.1596 12.9706L23.0881 13.0967C22.2188 12.615 21.3194 12.1878 20.3955 11.8209C14.8671 9.58737 8.47887 9.58737 2.95053 11.8209C2.02664 12.1878 1.1272 12.6131 0.257868 13.0967L0.186365 12.9706Z" fill="#F8F8F8"></path>
          <path clip-path="url(#nav-clip-4)" d="M0 9.96744C6.65545 4.98479 16.6904 4.98479 23.3458 9.96744L23.2743 10.0916C22.3937 9.59299 21.4811 9.1508 20.544 8.7707C14.9329 6.45813 8.41481 6.45813 2.80368 8.7707C1.86661 9.1508 0.954005 9.59111 0.073385 10.0916L0.00188167 9.96744H0Z" fill="#F8F8F8"></path>
          <path clip-path="url(#nav-clip-5)" d="M0.811009 6.41106C7.09954 2.01548 16.2482 2.01548 22.5367 6.41106L22.469 6.53901C21.6373 6.10999 20.7793 5.73178 19.9043 5.40813C14.6563 3.43238 8.69143 3.43238 3.44346 5.40813C2.5666 5.73178 1.71045 6.10999 0.878749 6.53901L0.811009 6.41106Z" fill="#F8F8F8"></path>
          <path clip-path="url(#nav-clip-6)" d="M4.03998 1.90448C8.56539 -0.633887 14.7805 -0.635768 19.3059 1.90448L19.2589 2.04184C18.6474 1.83862 18.0283 1.66175 17.4036 1.50933C13.6591 0.581671 9.68686 0.581671 5.94235 1.50933C5.31763 1.65987 4.69856 1.83862 4.08702 2.04184L4.03998 1.90448Z" fill="#F8F8F8"></path>
        </svg>

        <!-- Brand Text Wordmark (ENVISYS) - Big, Bold, Clean Architectural Reveal -->
        <div class="BrandLogo_lottie__SZi57">
          <svg 
            class="BrandLogo_envisysLettersSvg" 
            viewBox="0 0 160 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id="envisys-wipe-clip">
                <rect ref="wordmarkClipRef" x="0" y="0" width="100%" height="32" />
              </clipPath>
            </defs>
            <text 
              clip-path="url(#envisys-wipe-clip)" 
              x="0" 
              y="24" 
              font-family="'Monument Extended', sans-serif" 
              font-weight="800" 
              font-size="16" 
              fill="#F8F8F8" 
              letter-spacing="0.03em"
            >ENVISYS</text>
          </svg>
        </div>
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
    <header ref="headerRef" class="Header_header__qBw1J">
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
              @mouseenter="onItemEnter(1)"
            >
              <a class="Nav_link__Vx_8M" href="/products">
                <span class="Nav_label__EHdHO">
                  <div class="line-mask"><div class="line">products</div></div>
                </span>
              </a>
            </li>

            <!-- 2. Verticles Link (formerly tech) -->
            <li 
              class="Nav_item__uIn_C" 
              :class="{ 'is-dimmed': activeIndex !== null && activeIndex !== 2 }"
              @mouseenter="onItemEnter(2)"
            >
              <a class="Nav_link__Vx_8M" href="/verticles">
                <span class="Nav_label__EHdHO">
                  <div class="line-mask"><div class="line">verticles</div></div>
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
                <img src="/images/pages/manifesto.png" alt="" aria-hidden="true" />
                <span class="CompanySubmenuItem_link__ZOT0M">
                  <div class="line-mask"><div class="line">about us</div></div>
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
                <img src="/images/pages/career.png" alt="" aria-hidden="true" />
                <span class="CompanySubmenuItem_link__ZOT0M">
                  <div class="line-mask"><div class="line">resources</div></div>
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
                <img src="/images/pages/whitePapers.png" alt="" aria-hidden="true" />
                <span class="CompanySubmenuItem_link__ZOT0M">
                  <div class="line-mask"><div class="line">contact</div></div>
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
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

defineEmits<{
  (e: 'build-click'): void
}>()

// UI state
const isCompanyOpen = ref(false)
const isMobileOpen = ref(false)
const isContactHovered = ref(false)
const activeIndex = ref<number | null>(null)
const hoveredSubIndex = ref<number | null>(null)
let closeTimer: any = null

// DOM refs
const topBarRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const navBgRef = ref<HTMLElement | null>(null)
const submenuRef = ref<HTMLElement | null>(null)

// 7 Arcs Clip Rects
const clipRect0 = ref<SVGRectElement | null>(null)
const clipRect1 = ref<SVGRectElement | null>(null)
const clipRect2 = ref<SVGRectElement | null>(null)
const clipRect3 = ref<SVGRectElement | null>(null)
const clipRect4 = ref<SVGRectElement | null>(null)
const clipRect5 = ref<SVGRectElement | null>(null)
const clipRect6 = ref<SVGRectElement | null>(null)

// Wordmark Clip Rect for ENVISYS (Progressive sweep reveal matching reference)
const wordmarkClipRef = ref<SVGRectElement | null>(null)

function getArcClipRects(): (SVGRectElement | null)[] {
  return [clipRect0.value, clipRect1.value, clipRect2.value, clipRect3.value, clipRect4.value, clipRect5.value, clipRect6.value]
}

// ── Hover Physics for Nav Items ────────────────────────────────
function onItemEnter(index: number) {
  clearTimeout(closeTimer)
  activeIndex.value = index
  if (index !== 4) {
    isCompanyOpen.value = false
  }
}

function openCompanyMenu(index: number) {
  clearTimeout(closeTimer)
  activeIndex.value = index
  isCompanyOpen.value = true
  
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
  isCompanyOpen.value = !isCompanyOpen.value
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
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    isCompanyOpen.value = false
    activeIndex.value = null
  }, 200)
}

// ── Top Left Brand Logo Animation (Arc Sweeping + Smooth ENVISYS Wordmark Reveal) ──
function playLogoAnim() {
  // 1. 7 Arcs alternating sweep (even: left->right, odd: right->left)
  const arcRects = getArcClipRects()
  const duration = 0.95
  const delayStep = 0.04

  arcRects.forEach((rect, i) => {
    if (!rect) return
    gsap.killTweensOf(rect)
    const isEven = i % 2 === 0
    if (isEven) {
      gsap.fromTo(
        rect,
        { attr: { width: '0%', x: '0%' } },
        { attr: { width: '100%', x: '0%' }, duration, delay: i * delayStep, ease: 'power2.out' }
      )
    } else {
      gsap.fromTo(
        rect,
        { attr: { width: '0%', x: '100%' } },
        { attr: { width: '100%', x: '0%' }, duration, delay: i * delayStep, ease: 'power2.out' }
      )
    }
  })

  // 2. Progressive sweep reveal for ENVISYS wordmark
  if (wordmarkClipRef.value) {
    gsap.killTweensOf(wordmarkClipRef.value)
    gsap.fromTo(
      wordmarkClipRef.value,
      { attr: { width: '0%' } },
      { 
        attr: { width: '100%' }, 
        duration: 0.85, 
        delay: 0.15, 
        ease: 'power2.out' 
      }
    )
  }
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
}

onMounted(() => {
  if (navBgRef.value) {
    gsap.set(navBgRef.value, { transformOrigin: 'right center' })
  }
})

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
  gap: 10px;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.25s ease;
}

.Header_brandLogo__AXo7t:hover {
  opacity: 0.85;
}

.BrandLogo_logo__q8D51 {
  width: 31px;
  height: 27px;
  display: block;
  flex-shrink: 0;
}

.BrandLogo_lottie__SZi57 {
  width: 155px;
  height: 32px;
  display: flex;
  align-items: center;
  overflow: visible;
}

.BrandLogo_envisysLettersSvg {
  width: 100%;
  height: 100%;
  display: block;
}

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
  width: 535px;
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

.CompanySubmenuItem_submenuItem__irMc_:hover .CompanySubmenuItem_right__Aj08A {
  transform: translateX(3px);
}
</style>
