import { createApp } from 'vue'
import './assets/icomat.css'
import './assets/style.css'
import './assets/tokens.css'
import Tres from '@tresjs/core'

// One page per path (no router: the nav links are plain hrefs). Anything unknown falls back to the landing page.
const pages: Record<string, () => Promise<typeof import('./App.vue')>> = {
  '/about': () => import('./pages/AboutPage.vue'),
  '/products': () => import('./pages/ProductsPage.vue'),
  '/verticals': () => import('./pages/VerticalsPage.vue'),
  '/resources': () => import('./pages/ResourcesPage.vue')
}
const path = location.pathname.replace(/\/+$/, '') || '/'
;(pages[path] ?? (path.startsWith('/products/') ? () => import('./pages/ProductPage.vue') : () => import('./App.vue')))().then(({ default: Root }) => {
  const app = createApp(Root)
  app.use(Tres)
  app.mount('#app')
})

// The scroll timeline binds to DOM nodes once, so a hot-swapped component would be left
// orphaned (invisible). In dev, reload the whole page after every update instead.
if (import.meta.hot) import.meta.hot.on('vite:afterUpdate', () => location.reload())
