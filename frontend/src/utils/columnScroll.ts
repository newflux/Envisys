// The post-chamber page is one column (.tr-scroll) translated by the scrubbed GSAP timeline, not real layout.
// To jump to something inside it we convert "this element should sit at topPx" into a page-scroll target.
export function scrollColumnTo(el: HTMLElement, topPx: number, duration = 1.4) {
  const col = document.querySelector('.tr-scroll') as HTMLElement | null
  const sc = document.querySelector('#scroller') as HTMLElement | null
  const tl = (window as any).__envTl as { dur: number; end: number } | undefined
  const lenis = (window as any).lenisInstance
  if (!col || !sc || !tl || !lenis) return
  const maxScroll = sc.scrollHeight - sc.clientHeight
  const perPx = ((tl.dur / tl.end) * maxScroll) / (0.1 * window.innerHeight + col.offsetHeight)
  lenis.scrollTo(lenis.scroll + (el.getBoundingClientRect().top - topPx) * perPx, { duration })
}
