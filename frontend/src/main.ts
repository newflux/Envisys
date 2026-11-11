import { createApp } from 'vue'
import './assets/icomat.css'
import './assets/style.css'
import './assets/tokens.css'

// One page per path (no router: the nav links are plain hrefs). Anything unknown falls back to the landing page.
const pages: Record<string, () => Promise<typeof import('./App.vue')>> = {
  '/about': () => import('./pages/AboutPage.vue'),
  '/products': () => import('./pages/ProductsPage.vue'),
  '/verticals': () => import('./pages/VerticalsPage.vue'),
  '/industries': () => import('./pages/IndustriesPage.vue'),
  '/resources': () => import('./pages/ResourcesPage.vue'),
  '/in-stock': () => import('./pages/InStockPage.vue')
}
const path = location.pathname.replace(/\/+$/, '') || '/'
const product = path.startsWith('/products/')
const vertical = path.startsWith('/verticals/')
// the express factory has a page of its own; the other verticals share one
if (path === '/verticals/express') pages[path] = () => import('./pages/ExpressPage.vue')
else if (vertical) pages[path] = () => import('./pages/VerticalPage.vue')
const landing = !pages[path] && !product
;(pages[path] ?? (product ? () => import('./pages/ProductPage.vue') : () => import('./App.vue')))().then(async ({ default: Root }) => {
  const app = createApp(Root)
  // only the landing page draws with TresJS; importing it here keeps three.js out of every other page
  if (landing) app.use((await import('@tresjs/core')).default)
  app.mount('#app')
})

// The scroll timeline binds to DOM nodes once, so a hot-swapped component would be left
// orphaned (invisible). In dev, reload the whole page after every update instead.
if (import.meta.hot) import.meta.hot.on('vite:afterUpdate', () => location.reload())
