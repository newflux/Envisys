import { createApp } from 'vue'
import Clarity from '@microsoft/clarity'
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
  '/in-stock': () => import('./pages/InStockPage.vue'),
  '/standards': () => import('./pages/StandardsPage.vue')
}
// Microsoft Clarity (heatmaps, scroll depth, recordings): live site only, so local testing never shows up in the data
if (import.meta.env.PROD && location.hostname !== 'localhost') Clarity.init('zdlb48i7f7')

// Big photos decoded on the scroll path froze scrolling for 150-350 ms as each came into view; async decoding lets the frame go
// out first and the picture follow a frame later. Set on every <img> the pages add.
new MutationObserver((ms) => { for (const m of ms) m.addedNodes.forEach((n) => { if (n instanceof Element) (n.tagName === 'IMG' ? [n] : n.querySelectorAll('img')).forEach((i) => ((i as HTMLImageElement).decoding = 'async')) }) }).observe(document.documentElement, { childList: true, subtree: true })

const path = location.pathname.replace(/\/+$/, '') || '/'
const product = path.startsWith('/products/')
const vertical = path.startsWith('/verticals/')
if (path.startsWith('/standards/')) pages[path] = () => import('./pages/StandardsPage.vue')
if (path.startsWith('/blog/')) pages[path] = () => import('./pages/BlogPage.vue')
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
