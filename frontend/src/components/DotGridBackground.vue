<template>
  <div class="dot-grid-background">
    <canvas ref="bgCanvasRef" class="bg-grid-canvas"></canvas>
    <div class="vignette"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const bgCanvasRef = ref<HTMLCanvasElement | null>(null)
// You may need to inject or compute a globalPointerX and globalPointerY if reused
let globalPointerX = window.innerWidth / 2
let globalPointerY = window.innerHeight / 2

window.addEventListener('pointermove', (e) => {
  globalPointerX = e.clientX
  globalPointerY = e.clientY
})

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (bgCanvasRef.value) {
    const canvas = bgCanvasRef.value
    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0
    let isTabVisible = true
    let animationFrameId = 0
    let time = 0

    let dots: { x: number, y: number, currentRadius: number }[] = []
    
    const initDots = () => {
      dots = []
      const isMobile = window.innerWidth <= 768
      const spacing = isMobile ? 14 : 10
      for (let y = spacing/2; y < height; y += spacing) {
        for (let x = spacing/2; x < width; x += spacing) {
          dots.push({ x, y, currentRadius: 0.4 })
        }
      }
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      initDots()
    }
    resize()
    window.addEventListener('resize', resize)

    document.addEventListener('visibilitychange', () => {
      isTabVisible = document.visibilityState === 'visible'
    })

    let lastTime = performance.now()
    const fpsInterval = 1000 / 30

    const drawGrid = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(drawGrid)
      
      if (!isTabVisible) return
      
      const elapsed = currentTime - lastTime
      if (elapsed < fpsInterval && !prefersReducedMotion) return
      lastTime = currentTime - (elapsed % fpsInterval)

      if (!prefersReducedMotion) {
        time += (elapsed / 1000) * (Math.PI * 2 / 20) 
      }

      ctx!.clearRect(0, 0, width, height)
      
      const centerX = width / 2
      const centerY = height / 2
      const dimRadius = width * 0.22

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i]
        
        const noiseRaw = (Math.sin(dot.x * 0.003 + time) + Math.cos(dot.y * 0.004 + time * 0.8) + 2) / 4
        
        let activeNoise = (noiseRaw - 0.6) / 0.4
        if (activeNoise < 0) activeNoise = 0
        activeNoise = Math.pow(activeNoise, 1.5)
        
        let targetRadius = 0.4 + (activeNoise * 1.2)
        
        const distToCursor = Math.hypot(dot.x - globalPointerX, dot.y - globalPointerY)
        if (distToCursor < 140) {
           const cursorEffect = Math.pow(1 - (distToCursor / 140), 2)
           targetRadius += cursorEffect * 1.2
        }
        
        if (targetRadius > 1.6) targetRadius = 1.6
        
        dot.currentRadius += (targetRadius - dot.currentRadius) * 0.08
        
        let alpha = 0.05 + ((dot.currentRadius - 0.4) / 1.2) * 0.23
        if (alpha > 0.28) alpha = 0.28
        
        const distToCenter = Math.hypot(dot.x - centerX, dot.y - centerY)
        if (distToCenter < dimRadius) {
          const dimFactor = Math.pow(distToCenter / dimRadius, 2)
          alpha *= (0.2 + 0.8 * dimFactor)
        }
        
        ctx!.beginPath()
        ctx!.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx!.fill()
      }
      
      if (prefersReducedMotion) {
        cancelAnimationFrame(animationFrameId)
      }
    }
    
    requestAnimationFrame(drawGrid)
  }
})
</script>

<style scoped>
.dot-grid-background {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: -1;
  background-color: #070708;
  overflow: hidden;
  pointer-events: none;
}
.bg-grid-canvas {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
}
.vignette {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  background: radial-gradient(circle, transparent 40%, rgba(0, 0, 0, 0.8) 100%);
}
</style>
