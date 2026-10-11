# ICOMAT Pixel-Perfect Frontend Replica

Exact, pixel-perfect frontend replica of [icomat.co.uk](https://www.icomat.co.uk/) with zero external dependencies, complete asset coverage, and extracted pure code architecture.

---

## 🚀 How to Run Locally

```bash
cd frontend/icomat
npm start
```
Or directly:
```bash
node serve.cjs
```
Open **[http://localhost:5175/](http://localhost:5175/)** in your browser.

---

## 📁 Directory Structure

```text
frontend/icomat/
├── index.html                   # Complete live-rendered DOM entry with all metadata
├── serve.cjs                    # Native Node.js static server with video streaming support
├── package.json                 # Scripts to run replica
├── preview.png                  # Verification snapshot taken directly on localhost:5175
├── asset-map.json               # Full map of original remote URLs to local assets
├── _next/                       # Bundled static chunks (CSS, Webpack, React runtime, Three.js, GSAP)
│   ├── static/css/              # Original compiled stylesheet
│   └── static/chunks/           # Unpacked JavaScript bundles & page chunks
├── fonts/                       # LayGrotesk-Semibold, AkkuratMono, Doto-VariableFont
├── assets/                      # All high-res Prismic images and media
├── videos/                      # Hero and RTS process MP4 video files
├── lottie/                      # All JSON Lottie vector animations
└── src/                         # Pure, legible code extracted for building upon:
    ├── components/
    │   ├── Preloader.js         # Exact 7-curve alternating SVG clipPath canvas loader
    │   └── Scene3D.js           # Three.js 3D wave plane with 2D Gaussian cursor bump
    ├── shaders/
    │   ├── linesVertex.glsl     # Procedural wave & cursor displacement vertex shader
    │   ├── linesFragment.glsl   # Carbon texture rotation & depth fade fragment shader
    │   └── vignetteFragment.glsl# Atmospheric vignette shader
    └── data/
        └── siteData.js          # Full copy, quotes, stats, and navigation model
```

---

## 🎨 Key Technical Reconstructions

### 1. Canvas Preloader Animation (`src/components/Preloader.js`)
- The Icomat preloader is built from **7 precise mathematical SVG bezier curves**.
- Each arc reveals in alternating directions:
  - **Even indices (0, 2, 4, 6)** sweep from left to right (`0` to `progress * width`).
  - **Odd indices (1, 3, 5)** sweep from right to left (`width * (1 - progress)` to `progress * width`).
- Animated via GSAP timeline with `stagger: 0.08s`, `duration: 1.2s`, `ease: "power2.out"`.

### 2. 3D Carbon Wave Scene (`src/components/Scene3D.js` & `src/shaders/`)
- Built with Three.js `PlaneGeometry(1, 1.5, 64, 64)` and custom `ShaderMaterial`.
- **Vertex displacement**:
  - `uPointerX`, `uPointerY`: Gaussian bump centered at cursor with exponential falloff `exp(-dist^2 / radius^2)`.
  - `uTime`, `uCurveOffset`: Infinite traveling sine wave with harmonics `-pow(abs(wave), 2.0)`.
- **Fragment shading**:
  - Procedural repeating carbon tape texture with rotational matrix transform (`rotateUV`).
  - Depth darkening attenuation modulated by Z position in world space (`vDepth`).

---

## 🛠️ How to Build Upon This Code for Envisys

1. **Change Texts & Brand Copy**:
   Modify values in `src/data/siteData.js`.
2. **Tweak Preloader & Timing**:
   Inspect `src/components/Preloader.js` to adjust curve speeds, colors, or replace the paths with your custom Envisys mark.
3. **Customize Shaders & 3D Lighting**:
   Edit `src/shaders/linesVertex.glsl` and `linesFragment.glsl` to change wave frequencies, colors, or bump heights.
