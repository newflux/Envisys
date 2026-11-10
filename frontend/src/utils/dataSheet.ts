import { LOGO } from '../config/logo'
import { PER_MODEL } from '../config/details'
import type { Studio, StudioModel } from '../config/details'

const esc = (v: string) => v.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))

/**
 * A one-page data sheet for one model, branded and ready to save as a PDF: it opens in a new tab and the print dialog comes up
 * (choose "Save as PDF"). Built from the same data as the page, so it can never disagree with it; anything not yet known reads
 * "On request" rather than being left out.
 */
export function openDataSheet(o: { series: string; s: Studio; m: StudioModel; brochure?: string }) {
  const { s, m } = o
  const rows: [string, string][] = [
    ['Model', m.name],
    [`${s.space ?? 'Interior'}, W × D × H`, `${m.w} × ${m.d} × ${m.h} mm`],
    ['Nominal volume', m.volume],
    ...s.common,
    ...PER_MODEL.map((p) => [p.label, m[p.key] ?? 'On request'] as [string, string]),
    ...Object.entries(s.extra ?? {}).map(([k, v]) => [({ door: 'Door opening and swing', shelves: 'Shelves', ports: 'Cable ports', utilities: 'Drain, water and air', floor: 'Floor loading', clearance: 'Clearance', ambient: 'Ambient limits', heat: 'Heat to the room' } as Record<string, string>)[k] ?? k, v as string] as [string, string])
  ]
  const logo = `<svg viewBox="${LOGO.viewNav}" width="150" xmlns="http://www.w3.org/2000/svg"><g fill="#0d2340">${LOGO.ink.letters.map((l) => `<path d="${l.d}"/>`).join('')}<path d="${LOGO.ink.dot.d}"/></g><g fill="#0a8cff">${LOGO.blue.letters.map((l) => `<path d="${l.d}"/>`).join('')}${LOGO.blue.dots.map((d) => `<path d="${d.d}"/>`).join('')}</g></svg>`
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(m.name)} data sheet · Envisys</title>
<style>
  @page { size: A4; margin: 16mm 15mm }
  * { box-sizing: border-box }
  :root { color-scheme: light }
  body { margin: 0; background: #fff; font: 14px/1.5 Helvetica, Arial, sans-serif; color: #0d2340 }
  header { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 14px; border-bottom: 2px solid #0d2340 }
  header span { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; opacity: .7 }
  h1 { margin: 26px 0 2px; font-size: 34px; letter-spacing: -.02em }
  h2 { margin: 0 0 22px; font-size: 16px; font-weight: 400; opacity: .75 }
  table { width: 100%; border-collapse: collapse }
  td { padding: 9px 4px; border-top: 1px solid #c9d4e2; vertical-align: top }
  td:first-child { width: 42%; opacity: .72 }
  td:last-child { font-weight: 600 }
  tr:last-child td { border-bottom: 1px solid #c9d4e2 }
  .note { margin-top: 20px; font-size: 12px; opacity: .7 }
  footer { margin-top: 28px; padding-top: 12px; border-top: 2px solid #0d2340; display: flex; justify-content: space-between; font-size: 12px }
  @media screen { body { max-width: 780px; margin: 30px auto; padding: 0 24px } }
</style></head><body>
<header>${logo}<span>Data sheet</span></header>
<h1>${esc(m.name)}</h1><h2>${esc(o.series)}</h2>
<table>${rows.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</table>
<p class="note">Dimensions in millimetres. Figures are from the Envisys brochure (2025) and may change with the specification you order; "On request" items are confirmed with the quotation.${o.brochure ? ` Full brochure: ${esc(o.brochure)}` : ''}</p>
<footer><span>Envisys Technologies Pvt. Ltd., Peenya Industrial Estate, Bengaluru</span><span>enquiry@envisystech.com · +91 99000 14150</span></footer>
</body></html>`
  const w = window.open('', '_blank')
  if (!w) {
    // pop-ups blocked: hand over the sheet as a file instead
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
    a.download = `${m.name.replace(/[^A-Za-z0-9-]+/g, '-')}-data-sheet.html`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 4000)
    return
  }
  w.document.open(); w.document.write(html); w.document.close()
  setTimeout(() => w.print(), 500)
}
