# Graph Report - src  (2026-10-20)

## Corpus Check
- Corpus is ~39,164 words - fits in a single context window. You may not need a graph.

## Summary
- 454 nodes · 603 edges · 24 communities (21 shown, 3 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- App: 3D Scene & Scroll Timeline
- Finale, Footer Probe & Industries
- Anatomy CAD Scene
- Navbar & Brand Logo
- Fleet Overview
- Trust Column & Page Light
- Testimonials & Smoke Wave
- Hero Overlay & Telemetry
- Preloader
- Products & Column Scroll
- Reticle Cursor
- Autonomy Comparison
- Quote Drawer
- Film Section
- Factory Steps
- Chamber Statement
- Scroll Bar
- Build Statement
- Temperature Gauge
- Library Imports (three, troika)
- Chamber Panel Handlers
- App Bootstrap
- Dust Particles
- Phase Four Config

## God Nodes (most connected - your core abstractions)
1. `chCascade()` - 7 edges
2. `tick()` - 6 edges
3. `seg()` - 5 edges
4. `loadModel()` - 5 edges
5. `render()` - 5 edges
6. `scrollColumnTo()` - 5 edges
7. `scrollToTop()` - 5 edges
8. `CH_FROM` - 5 edges
9. `tick()` - 4 edges
10. `tick()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `buildScrollTimeline()` --calls--> `chCascade()`  [EXTRACTED]
  App.vue → utils/splitChars.ts
- `toTop()` --calls--> `scrollToTop()`  [EXTRACTED]
  components/FinaleSection.vue → utils/scrollTop.ts
- `playEntrance()` --calls--> `chCascade()`  [EXTRACTED]
  components/HeroOverlay.vue → utils/splitChars.ts
- `onLogoClick()` --calls--> `scrollToTop()`  [EXTRACTED]
  components/Navbar.vue → utils/scrollTop.ts
- `go()` --calls--> `scrollColumnTo()`  [EXTRACTED]
  components/ProductsSection.vue → utils/columnScroll.ts

## Import Cycles
- None detected.

## Communities (24 total, 3 thin omitted)

### Community 0 - "App: 3D Scene & Scroll Timeline"
Cohesion: 0.02
Nodes (78): activeChamberData, baseCameraPos, baseCameraTarget, bgTextGroupRef, bgTextRef, bgTextVideoRefA, bgTextVideoRefB, blob1Ref (+70 more)

### Community 1 - "Finale, Footer Probe & Industries"
Cohesion: 0.08
Nodes (31): cards, clamp01(), cols, drawLines(), footRef, headWords, linesRef, markRef (+23 more)

### Community 2 - "Anatomy CAD Scene"
Cohesion: 0.08
Nodes (31): b64(), buildScene(), canvasRef, clamp01(), G, gridEls, gridPaths, GROUP_STYLE (+23 more)

### Community 3 - "Navbar & Brand Logo"
Cohesion: 0.08
Nodes (25): activeIndex, animIn(), clipRect0, clipRect1, clipRect2, clipRect3, clipRect4, clipRect5 (+17 more)

### Community 4 - "Fleet Overview"
Cohesion: 0.08
Nodes (23): anchor1, anchor2, anchor3, cachedAnchors, containerRef, emit, getChamberAnchor(), hoveredUnit (+15 more)

### Community 5 - "Trust Column & Page Light"
Cohesion: 0.09
Nodes (25): clamp01(), facts, rootRef, smooth(), tick(), titleLines, tone, chapEls (+17 more)

### Community 6 - "Testimonials & Smoke Wave"
Cohesion: 0.11
Nodes (22): active, barRef, barWrapRef, canvasRef, cardsDark, clamp01(), drawWave(), HI (+14 more)

### Community 7 - "Hero Overlay & Telemetry"
Cohesion: 0.15
Nodes (14): buildScrollTimeline(), downBtnRef, emit, handleScrollDown(), playEntrance(), CalloutData, callouts, isActive (+6 more)

### Community 8 - "Preloader"
Cohesion: 0.13
Nodes (18): arcItems, canvasRef, defaultSvgPaths, emit, initWaveShader(), isFinished, loaderRootRef, logoColorState (+10 more)

### Community 9 - "Products & Column Scroll"
Cohesion: 0.14
Nodes (14): clamp01(), fill(), frac, go(), prodEls, products, rootRef, smooth() (+6 more)

### Community 10 - "Reticle Cursor"
Cohesion: 0.14
Nodes (13): boxRef, dotRef, hidden, inside(), isDown, isShown(), label, onMove() (+5 more)

### Community 11 - "Autonomy Comparison"
Cohesion: 0.15
Nodes (9): active, activeId, Card, cards, close(), onKey(), panelsRef, rightRef (+1 more)

### Community 12 - "Quote Drawer"
Cohesion: 0.15
Nodes (11): chambers, close(), emit, errors, fields, form, Key, panelRef (+3 more)

### Community 13 - "Film Section"
Cohesion: 0.18
Nodes (11): capRef, clamp01(), cur, frameRef, inOut(), missing, props, rootRef (+3 more)

### Community 14 - "Factory Steps"
Cohesion: 0.18
Nodes (11): cardEls, clamp01(), headWords, rootRef, smooth(), spacer, stageRef, steps (+3 more)

### Community 15 - "Chamber Statement"
Cohesion: 0.24
Nodes (8): accents, clamp01(), measured, rootRef, smooth(), textRef, tick(), words

### Community 16 - "Scroll Bar"
Cohesion: 0.28
Nodes (8): active, dragging, hover, metrics(), moving, startDrag(), thumbRef, tick()

### Community 17 - "Build Statement"
Cohesion: 0.32
Nodes (7): clamp01(), figEls, images, rootRef, smooth(), tick(), words

### Community 18 - "Temperature Gauge"
Cohesion: 0.25
Nodes (6): digits, markerRef, rounded, sign, state, temp

### Community 19 - "Library Imports (three, troika)"
Cohesion: 0.40
Nodes (4): three, three/examples/jsm/loaders/DRACOLoader.js, three/examples/jsm/loaders/GLTFLoader.js, troika-three-text

### Community 20 - "Chamber Panel Handlers"
Cohesion: 1.00
Nodes (3): onChamberPointerUp(), openChamberModal(), openPanel()

## Knowledge Gaps
- **267 isolated node(s):** `p4Words`, `p4`, `p4GroupRef`, `portal`, `tunnelGroupRef` (+262 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 317 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `scrollToTop()` connect `Finale, Footer Probe & Industries` to `Navbar & Brand Logo`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **Why does `chCascade()` connect `Hero Overlay & Telemetry` to `App: 3D Scene & Scroll Timeline`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **Why does `vMagnetic` connect `Finale, Footer Probe & Industries` to `Products & Column Scroll`?**
  _High betweenness centrality (0.001) - this node is a cross-community bridge._
- **What connects `p4Words`, `p4`, `p4GroupRef` to the rest of the system?**
  _267 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App: 3D Scene & Scroll Timeline` be split into smaller, more focused modules?**
  _Cohesion score 0.021739130434782608 - nodes in this community are weakly interconnected._
- **Should `Finale, Footer Probe & Industries` be split into smaller, more focused modules?**
  _Cohesion score 0.07777777777777778 - nodes in this community are weakly interconnected._
- **Should `Anatomy CAD Scene` be split into smaller, more focused modules?**
  _Cohesion score 0.08266129032258064 - nodes in this community are weakly interconnected._