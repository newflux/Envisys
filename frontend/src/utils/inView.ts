import { ref, onMounted, onUnmounted } from 'vue'

/** `go` turns true once `root` is a third on screen (and stays true): charts animate in once, when they are seen. */
export function useInView() {
  const root = ref<HTMLElement | null>(null), go = ref(false)
  let io: IntersectionObserver | null = null
  onMounted(() => {
    io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { go.value = true; io?.disconnect() } }, { threshold: 0.33 })
    if (root.value) io.observe(root.value)
  })
  onUnmounted(() => io?.disconnect())
  return { root, go }
}
