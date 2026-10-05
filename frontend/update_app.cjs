const fs = require('fs');
let content = fs.readFileSync('src/App.vue', 'utf8');

// 1. Add Gallery Data at top of script setup
content = content.replace(
  "const isPanelOpen = ref(false)",
  `const galleryProducts = ref([
  { id: 'envisys_main', modelPath: '/models/chamber_main.glb', scale: 2.5, slotName: 'center', scene: null },
  { id: 'envisys_left', modelPath: '/models/chamber_main.glb', scale: 2.5, slotName: 'left', scene: null },
  { id: 'envisys_right', modelPath: '/models/chamber_main.glb', scale: 2.5, slotName: 'right', scene: null }
])
const galleryRefs = ref([])

const isPanelOpen = ref(false)`
);

// 2. Replace Template (Clones -> Gallery)
const templateRegex = /<!-- Main chamber group -->[\s\S]*?<!-- Next-Scene Transition Chamber -->/;
const newTemplate = `<!-- Gallery -->
      <TresGroup ref="chamberGroupRef" :position="[0, 0, scrollProxy.galleryZOffset]">
        <TresGroup 
          v-for="(product, index) in galleryProducts" 
          :key="product.id"
          :ref="el => { if (el) galleryRefs[index] = el }"
          @pointerdown="index === 0 ? onChamberPointerDown($event) : null"
          @pointerup="index === 0 ? onChamberPointerUp($event) : null"
          @pointerenter="index === 0 ? onChamberEnter($event) : null"
          @pointerleave="index === 0 ? onChamberLeave($event) : null"
        >
          <primitive v-if="product.scene" :object="product.scene" :scale="index === 0 ? product.scale : scrollProxy.galleryScale" :position="[0, floorY, 0]" />
        </TresGroup>
      </TresGroup>

      <!-- Next-Scene Transition Chamber -->`;
content = content.replace(templateRegex, newTemplate);

// 3. Update scrollProxy
content = content.replace(
  "cloneAx: 0, cloneAz: 0,",
  "galleryScale: 0, galleryZOffset: 0, galleryDarken: 1,"
);
content = content.replace("cloneBx: 0, cloneBz: 0,", "");
content = content.replace("cloneScale: 0, // Used to keep clones completely invisible until Phase 3", "");

// 4. Update GSAP Ticker
const tickerRegex = /\/\/ Dynamic Fleet Spread[\s\S]*?if \(transitionChamberRef\.value\)/;
const newTicker = `// Dynamic Gallery Formation & Fade
    galleryProducts.value.forEach((prod, index) => {
      const gRef = galleryRefs.value[index]
      if (gRef) {
        if (index === 0) {
          gRef.position.set(0, 0, 0)
          gRef.rotation.set(0, 0, 0)
        } else {
          const isLeft = index % 2 !== 0
          const pairIndex = Math.ceil(index / 2)
          const sign = isLeft ? -1 : 1
          gRef.position.set(sign * (baseSizeX * 1.25 * pairIndex), 0, -(baseSizeZ * 0.35 * pairIndex))
          gRef.rotation.set(0, sign * MathUtils.degToRad(-8 * pairIndex), 0)
        }
        
        // Handle darkening in Phase 4
        if (prod.scene) {
          prod.scene.traverse(child => {
            if (child.isMesh && child.material) {
              if (child.userData.origColor) {
                child.material.color.copy(child.userData.origColor).multiplyScalar(scrollProxy.galleryDarken)
                child.material.envMapIntensity = child.userData.origEnv * scrollProxy.galleryDarken
                if (scrollProxy.galleryDarken < 0.99 && !child.material.fog) {
                   child.material.fog = true
                   child.material.needsUpdate = true
                }
              }
            }
          })
          prod.scene.visible = scrollProxy.galleryDarken > 0.01
        }
      }
    })

    if (transitionChamberRef.value)`;
content = content.replace(tickerRegex, newTicker);

// 5. Replace Loader Logic
const loaderRegex = /loader\.load\('\/models\/chamber_main\.glb', \(gltf\) => \{[\s\S]*?const fov = 30/;
const newLoader = `
  let loadedCount = 0
  galleryProducts.value.forEach((product, idx) => {
    loader.load(product.modelPath, (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          if (child.name === 'Body5.003') {
            child.material = gracesMaterial.clone()
          }
          child.castShadow = true
          child.receiveShadow = true
          if (child.material) {
            child.material.fog = false
            child.material.needsUpdate = true
            child.userData.origColor = child.material.color.clone()
            child.userData.origEnv = child.material.envMapIntensity !== undefined ? child.material.envMapIntensity : 1
          }
        }
      })
      product.scene = gltf.scene
      if (idx === 0) {
        chamberScene.value = gltf.scene // keep ref for transition chamber cloning
        transitionChamber.value = gltf.scene.clone(true)
      }
      
      loadedCount++
      if (loadedCount === galleryProducts.value.length) {
        // All loaded
        const box = new THREE.Box3().setFromObject(galleryProducts.value[0].scene)
        const size = new THREE.Vector3(); box.getSize(size); size.multiplyScalar(2.5)
        
        tunnelW.value = size.x * 4
        tunnelH.value = size.y * 2.6
        tunnelD.value = size.z * 25
        generateTextures()
        
        baseSizeY = size.y
        window.baseSizeX = size.x
        window.baseSizeZ = size.z
        
        const center = new THREE.Vector3(); box.getCenter(center)
        center.multiplyScalar(2.5); center.add(new THREE.Vector3(0,-2.05,0))
        baseCameraTarget.copy(center)
        buildScrollTimeline()
      }
    })
  })

  // We defer buildScrollTimeline until models load.
  // We need to move the timeline out of the old load block.
  
  const fov = 30`;
content = content.replace(loaderRegex, newLoader);

// 6. Update Timeline Phases
const phase3Regex = /\/\/ ── Phase 3: The South-West Spread Reveal[\s\S]*?ease: 'power3\.out' \n    }, 40\)/;
const newPhase3 = `// ── Phase 3: The Gallery Trucking Shot (40% to 65%) ──
    tl.to(scrollProxy, { 
      camX: 3.5, // Truck right (ends at +3.5)
      camY: baseCameraPos.y + (baseSizeY * 0.3),  
      camZ: baseCameraPos.z + 16,  
      lookX: 0, 
      lookY: baseCameraTarget.y,
      lookZ: 0, // Aim at center
      fogFar: 70,
      duration: 25, 
      ease: 'power1.inOut' 
    }, 40)
    
    // Animate camera yaw via lookX (from +14 deg to -14 deg)
    tl.fromTo(scrollProxy, 
      { lookX: -Math.tan(MathUtils.degToRad(14)) * 16, camX: -3.5, camY: baseCameraPos.y + (baseSizeY * 0.3), camZ: baseCameraPos.z + 16 }, 
      { lookX: Math.tan(MathUtils.degToRad(14)) * 16, duration: 25, ease: 'power1.inOut' }, 
    40)

    tl.to(scrollProxy, {
      galleryScale: 2.5, // pop in the other products!
      fleetLightIntensity: 80, 
      duration: 5, // very short span to pop them in
      ease: 'power3.out' 
    }, 38)`;

content = content.replace(phase3Regex, newPhase3);

const phase4Regex = /\/\/ ── Phase 4: Cinematic J-Curve Breach[\s\S]*?tl\.to\(scrollProxy, { camZ: 1\.2, duration: 35, ease: "power2\.inOut" }, 65\)/;
const newPhase4 = `// ── Phase 4: Exit & Darken (65% to 75%) ──
    tl.to(scrollProxy, { 
      camX: 0, 
      camY: baseCameraTarget.y + 0.8, 
      lookX: 0,
      lookY: baseCameraTarget.y + 0.8,
      lookZ: 0,
      fogFar: 35,
      fleetLightIntensity: 0,
      galleryDarken: 0, // Fade to black
      galleryZOffset: -20, // Slide back 20 units
      duration: 10, // Short span
      ease: "power2.inOut" 
    }, 65)

    // J-Curve Breach into Transition Chamber
    tl.to(scrollProxy, { camZ: 1.2, duration: 35, ease: "power2.inOut" }, 65)`;
content = content.replace(phase4Regex, newPhase4);

content = content.replace("cloneA.value = gltf.scene.clone(true)\n    cloneB.value = gltf.scene.clone(true)\n    transitionChamber.value = gltf.scene.clone(true)\n\n    buildScrollTimeline()", "");
content = content.replace("cloneA.value = gltf.scene.clone(true)\n    cloneB.value = gltf.scene.clone(true)\n", "");
content = content.replace("transitionChamber.value = gltf.scene.clone(true)\n\n    buildScrollTimeline()", "");

fs.writeFileSync('src/App.vue', content);
console.log('App.vue updated successfully.');
