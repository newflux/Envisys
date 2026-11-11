// Prints, as JSON, what the site knows about every series: the input of tools/export_missing_data.py
// (bundled and run by that script; not part of the site).
import { products, models as models3d } from '../src/config/products'
import { details, NEEDS } from '../src/config/details'

const out = products.map((p) => {
  const d = details[p.slug]
  const s = d?.studio
  return {
    slug: p.slug, name: p.name, code: p.code, tier: p.tier, group: p.group, tagline: p.tagline, listed: p.models.flatMap((m) => m.items).slice(0, 8),
    brochure: !!p.brochure, gallery: p.gallery, photoHero: !!p.photo, model3d: !!models3d[p.slug],
    hasPicker: !!s, hasLineup: !!d?.lineup, hasChart: !!d?.chart, hasTables: !!d?.tables, hasBuild: !!d?.build,
    specs: p.specs.length, features: p.features.length,
    needs: s ? NEEDS.map((n) => ({ id: n.id, card: n.card, label: n.label, done: n.done(s), na: !!s.na?.includes(n.id) })) : null,
    models: s ? s.models.map((m) => ({ name: m.name, w: m.w, d: m.d, h: m.h, volume: m.volume, ext: m.ext ?? '', weight: m.weight ?? '', load: m.load ?? '', cooling: m.cooling ?? '', noise: m.noise ?? '' })) : null
  }
})
console.log(JSON.stringify({ series: out, needs: NEEDS.map((n) => ({ id: n.id, card: n.card, label: n.label })) }))
