import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { rmSync } from 'node:fs'
import { PurgeCSS } from 'purgecss'

// Raw shoot folders / PDFs / CAD sit in public/ locally but must never ship.
const keepOut = { name: 'keep-raw-out', closeBundle() { for (const f of ['pics', 'about us pics', 'videos/C0512.mp4', 'models/EA600-40T-A.STEP', 'models/ETS100-75T.SLDASM', 'Envisys Testimonials.pdf', 'Website Development - Product lists.pdf', 'Website Development - Product page .pdf', 'vS2 CII National Shining MSME Award 2026.pdf']) rmSync('dist/' + f, { recursive: true, force: true }); } }

// The two legacy global stylesheets (~300 KB) are mostly rules for markup that no longer exists; the build keeps only selectors
// whose classes / ids / tags appear somewhere in src or index.html. Dev keeps the full files.
const purgeLegacy = {
  name: 'purge-legacy-css', apply: 'build' as const, enforce: 'pre' as const,
  async transform(code: string, id: string) {
    if (!/assets[\/](icomat|style)\.css$/.test(id)) return
    const [r] = await new PurgeCSS().purge({ content: ['src/**/*.vue', 'src/**/*.ts', 'index.html'], css: [{ raw: code }], keyframes: false, fontFace: false, variables: false })
    return { code: r.css, map: null }
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [keepOut, purgeLegacy, vue({
    template: {
      compilerOptions: {
        isCustomElement: tag => tag.startsWith('Tres') && tag !== 'TresCanvas' || tag === 'primitive',
      },
    },
  })],
})
