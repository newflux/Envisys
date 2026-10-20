import gsap from 'gsap'

// Back to the top from deep in the page. Scrolling back over ~30 screens of scrubbed scenes replays every one of
// them in reverse while the scrub lags behind, so the hero lands half-restored. Instead a curtain wipes up over the
// screen, the page jumps to the top under it, the scroll timeline is snapped to its start, and the curtain lifts.
let busy = false

export function scrollToTop(onShown?: () => void) {
  const lenis = (window as any).lenisInstance
  if (!lenis || busy) return
  // close to the top already: a plain glide is fine
  if (lenis.scroll < window.innerHeight * 1.5) {
    lenis.scrollTo(0, { duration: 1.2 })
    onShown?.()
    return
  }
  busy = true
  const veil = document.createElement('div')
  Object.assign(veil.style, { position: 'fixed', inset: '0', zIndex: '2600', background: '#050609', pointerEvents: 'auto', clipPath: 'inset(100% 0 0 0)' })
  document.body.appendChild(veil)
  lenis.stop()
  gsap.to(veil, {
    clipPath: 'inset(0% 0 0 0)',
    duration: 0.75,
    ease: 'power3.inOut',
    onComplete: () => {
      lenis.start()
      lenis.scrollTo(0, { immediate: true, force: true })
      // skip the scrub's catch-up so the timeline is exactly at its start, not easing back through every scene
      const st = (window as any).__envMainTl?.scrollTrigger
      st?.update()
      st?.getTween?.()?.progress(1)
      // a few frames for the sections to settle on their new positions and the 3D scene to draw, then lift
      gsap.delayedCall(0.4, () => {
        onShown?.()
        gsap.to(veil, { clipPath: 'inset(0 0 100% 0)', duration: 0.95, ease: 'power3.inOut', onComplete: () => { veil.remove(); busy = false } })
      })
    }
  })
}
