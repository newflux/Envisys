import gsap from 'gsap'

/**
 * Signature reveal: every headline in the site enters as a character cascade —
 * glyphs flip up from their baseline (rotateX) inside the line's mask.
 * splitChars wraps the text of each matched element into .ch spans (idempotent).
 */
export function splitChars(selector: string, root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    if (el.dataset.split) return
    el.dataset.split = '1'
    const text = el.textContent ?? ''
    el.setAttribute('aria-label', text)
    el.textContent = ''
    for (const word of text.split(/(\s+)/)) {
      if (/^\s+$/.test(word)) { el.appendChild(document.createTextNode(' ')); continue }
      const w = document.createElement('span')
      w.className = 'ch-word'
      for (const c of word) {
        const s = document.createElement('span')
        s.className = 'ch'
        s.setAttribute('aria-hidden', 'true')
        s.textContent = c
        w.appendChild(s)
      }
      el.appendChild(w)
    }
  })
}

export const CH_FROM = { rotateX: -88, yPercent: 70, opacity: 0, transformOrigin: '50% 100% -0.4em' }
export const CH_TO = { rotateX: 0, yPercent: 0, opacity: 1, ease: 'power3.out' }

/** Cascade tween vars for a block of .ch under `selector` (use inside a timeline). */
export function chCascade(duration: number, stagger = 0.022) {
  return { ...CH_TO, duration, stagger }
}
