# Envisys High-Fidelity Frontend Development Log

## Project Goal
Building a pixel-perfect, high-performance, custom Vue 3 + Vite frontend for Envisys, taking design architecture, physics, and fluid interactions from reference benchmarks (including Icomat).

---

## 1. Preloader Component
- **Status:** Completed & Committed (`cef7d39`)
- **Key Features Implemented:**
  - Standalone WebGL wave shader mesh replicating the side-sweeping dark smoke curtain animation (`uFrequency = -0.5`, `uOffsetY`, `uAmplitude` GSAP transition).
  - 2D Canvas 7-arc logo mark with animated clip-path bezier curves.
  - Smooth color inversion from `#0e0f12` to `#F5F5F7` as the wave rises, dissolving seamlessly into `#050505`.
  - Emits `@complete` upon finish to trigger the hero section entrance.
- **Reference Tested:**
  - Verified against `http://localhost:5175/` reference frames.

---

## 2. Brand Logo & Assets Tooling
- **Status:** Tooling Preserved & Ready
- **Notes:**
  - Traced SVG analyzed: noted jagged bezier edges and smudged tagline text. Logo replacement planned once clean vector master is finalized.
  - Reusable testing tool preserved at `tools/preview_logo.cjs` for previewing and verifying candidate SVGs:
    ```bash
    node tools/preview_logo.cjs "path/to/candidate.svg" "output.png"
    ```

---

## 3. Top Navigation & Brandmark (Pixel-Perfect Reference Alignment)
- **Status:** Completed & Tested
- **Components Modified:**
  - `frontend/src/components/Navbar.vue`
  - `frontend/src/App.vue`
- **Key Features Implemented:**
  - **Zero Remnants Before Animation:**
    - Wrapped in `.navbar-root` with initial `opacity: 0; visibility: hidden; pointer-events: none;`.
    - `animIn()` triggered strictly after preloader completion in `App.vue`.
  - **Top Left Brandmark (`ENVISYS`):**
    - 7-arc sphere SVG with alternating clipPath sweep animation (even rects wipe left-to-right, odd rects wipe right-to-left).
    - Sequential letter-by-letter reveal for **`ENVISYS`** (matching Image 3 `ICC'` progressive reveal), staggered by ~60ms using individual SVG clip rects.
    - Proportions matched to `BrandLogo_logo` (28px) and `BrandLogo_lottie` (133x29px) with `gap: 8px`.
  - **Main Navigation Bar (Exact Icomat Specs):**
    - Typography: `AkkuratMono, sans-serif`, `11px`, `0.22px` letter-spacing, uppercase.
    - Capsule padding: `4px`, border-radius: `7px`, background: `rgba(22, 22, 22, 0.85)` with `backdrop-filter: blur(43px)`.
    - Links: `padding: 5px 9px`.
    - Labels updated:
      1) `products` (formerly solutions)
      2) `verticles` (formerly tech)
      3) `industries` (kept)
      4) `The Company` (dropdown trigger with toggle chevron)
      5) `BUILD W/ ENVISYS` (crisp white rounded button `5.6px radius` with black text; on hover turns full solid black `#080808` with centered white text `#ffffff`).
  - **The Company Dropdown Submenu Cards (Exact 1:1 Match to Reference Screenshot):**
    - Architectural placement: direct child of `.Nav_wrapper__EfAHX` spanning the full width of the navbar (`width: 535px`, `margin-top: 12.35px`).
    - Separate floating cards for each item with `border-radius: 8.98px`, `padding: 5.6px`, `min-height: 91px`.
    - Thumbnail dimensions: **`79.7px × 79.7px` square** matching original, `border-radius: 7.86px`, `gap: 18px` from text.
    - Right chevron: `margin-right: 30px`, width `9px`.
    - **Hover State:** Hovered card turns solid pure white (`#ffffff`) with black text (`#080808`) and black chevron. Non-hovered cards remain dark glass (`rgba(8, 8, 8, 0.75)` with `backdrop-filter: blur(43px)`).
    - Submenu items updated:
      1) `about us` (formerly manifesto)
      2) `resources` (formerly careers)
      3) `contact` (formerly whitepapers)
    - Integrated invisible bridge hitbox + 220ms grace timer preventing premature menu close when cursor travels between elements.
  - **Top-Left Brand Logo:**
    - 7-arc sphere symbol: `31px × 27px` with alternating sweep clip animation on load/hover.
    - Wordmark: `ENVISYS` rendered in authentic `LayGrotesk-Semibold` (`22px`, font-weight 600, `#F8F8F8`, letter-spacing `0.04em`), matching the exact geometric kerning of the benchmark reference logo with fluid progressive clip wipe reveal.
  - **Visual Verification & Testing:**
    - Automated Puppeteer visual regression runner executed against `http://localhost:5173/`:
      - Settled header: `tools/test_settled_header.png`
      - Submenu open: `tools/test_submenu_open.png`
      - Hovered card white: `tools/test_submenu_hover_white.png`
      - CTA button black hover: `tools/test_contact_hover_black.png`

---

## 4. Hero Typography, 3D Text & Hover Glitch Resolution
- **Navbar Hover Glitch Fix:**
  - Removed `text-shadow` artifact from global css and removed vertical line rolling on nav links.
  - Hovering links now cleanly highlights text to `#ffffff` without any horizontal slicing or baseline cutoff (`tools/test_industries_hover_fixed.png`).
- **Hero Left-Bottom Tagline:**
  - Replaced "Engineer Without Limits™" with clean two-line stacked block:
    ```
    Reimagining 
    the environment.
    ```
  - Font: `LayGrotesk-Semibold`, size: `26px`, line-height: `1.1` (tight leading), letter-spacing: `-0.03em`.
- **Hero Mid-Right Text Block:**
  - Brought slightly down to `top: 57%` for better vertical balance against 3D chamber.
  - Updated copy supporting Envisys test technology:
    - Primary: *"Pioneering environmental test chambers and simulation systems engineered for extreme reliability."*
    - Secondary: *"Empowering aerospace, automotive, and defense to test without limits."*
    - Font, size, style, and structure preserved.
- **Background 3D Chamber Text:**
  - Replaced `/envisys` with bold uppercase **`ENVISYS`** using authentic **Monument Extended Ultrabold** (`/fonts/MonumentExtended-Ultrabold.woff`).
  - Set `:letterSpacing="-0.04"` for stacked, architectural tracking (`tools/test_hero_full.png`).

---

## 5. Navbar Roll-Up Hover, Tagline Resizing & Laser-Cut Reveal
- **Navbar Roll-Up & Return Hover Restored:**
  - Diagnosed that in `icomat.css`, `.Nav_nav__ABerH .Nav_mainMenu__pDzJf .Nav_label__EHdHO .line` specified `text-shadow: 0 1.8em currentColor`.
  - Configured matching exact metrics:
    - `.Nav_label__EHdHO .line-mask`: `display: block !important; position: relative !important; overflow: clip !important; padding-top: 0 !important;`
    - `.Nav_label__EHdHO .line`: `will-change: transform !important; text-shadow: 0 1.8em currentColor !important; transition: transform 0.35s cubic-bezier(0.2, 0, 0, 1) !important;`
    - Hover state (`.Nav_link__Vx_8M:hover .line`, `.Nav_companyBtn__ceON4:hover .line`, `.Nav_contactBtn__pdvQU:hover .line`): `transform: translateY(-1.8em) !important;`
  - Zero text clipping or half-cut characters; text rolls up cleanly and returns smoothly on hover leave (`tools/nav_hover_products.png`, `tools/nav_hover_verticles.png`, `tools/nav_hover_industries.png`).
- **Hero Left-Bottom Tagline Enlarge:**
  - Increased font size of "Reimagining the environment." from `26px` to `34px`.
  - Preserved stacked two-line block, `LayGrotesk-Semibold`, `line-height: 1.1`, `letter-spacing: -0.03em` (`tools/tagline_close_up.png`).
- **Architectural Scale-Up & Y-Nudge (Awwwards Scaffolding):**
  - Scaled up the background 3D text `ENVISYS` by ~35% (`textScale: 0.44`). The 'E' and 'S' now span wide across the viewport, acting as monumental architectural scaffolding.
  - Nudged the Y position up (`textY: 5.1`, `:position="[0, 5.1, -15]"`): the horizontal baseline now sits right behind the top cooling vents and upper window frame, framing the test chamber and giving the glossy floor reflection ample room to breathe (`tools/final_scaled_up_view.png`).
  - Updated the laser-cutting clip-rect range from `[-80, -30, laserProgress.x, 30]` to `+80` to cleanly reveal the wider span.

---

## 6. Next Tasks
1. 3D canvas interaction & chamber model orbit/pivot positioning.
2. Smooth scroll choreography (Lenis + GSAP ScrollTrigger).
3. Section transitions and interactive chamber hotspots.
