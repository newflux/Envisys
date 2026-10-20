import gsap from 'gsap'
import type { Directive } from 'vue'

// v-magnetic: the element leans toward the pointer while it is near, and springs back on leave.
// Usage: v-magnetic or v-magnetic="0.35" (strength).
export const vMagnetic: Directive<HTMLElement, number | undefined> = {
  mounted(el, { value }) {
    const k = value ?? 0.3
    const near = 36
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      if (Math.abs(dx) > r.width / 2 + near || Math.abs(dy) > r.height / 2 + near) return reset()
      gsap.to(el, { x: dx * k, y: dy * k, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
    }
    const reset = () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' })
    window.addEventListener('pointermove', move, { passive: true })
    ;(el as any).__mag = () => window.removeEventListener('pointermove', move)
  },
  unmounted(el) {
    ;(el as any).__mag?.()
  }
}
