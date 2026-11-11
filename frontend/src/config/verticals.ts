// The six business verticals: the hub (/verticals) and one page each (/verticals/<id>; Express Factory has its own page).
// Copy comes only from the CII National Shining MSME Awards 2026 deck, envisystech.com and the About page; nothing is invented.
// Every page has its own photographs (public/media/verticals), used nowhere else on the site, and its own motif: a small
// animated drawing that says what the vertical is at a glance (components/VMotif.vue), shown on the hub and on the page.
// Testing Services is Vistara's own website: paste the address the company gives here and every Testing link on the site
// (hub, menus, footer, next-vertical links) opens it in a new tab instead of our own page. Empty until then.
export const VISTARA_URL = ''

export type Motif = 'blueprint' | 'route' | 'instrument' | 'calendar' | 'dial' | 'loop'

export interface Vertical {
  id: string
  name: string
  short: string
  motif: Motif
  img: string
  img2: string
  external?: string
  // HUD tags over the hero photograph: [x %, y %, label], placed on what the label names
  tags: [number, number, string][]
  cta: string
  text: string
  offer: { t: string; d: string; href?: string; img?: string }[]
  steps: string[]
  facts: { v: string; l: string }[]
}

export const verticals: Vertical[] = [
  {
    id: 'design', name: 'Design & Build', short: 'Your chamber, engineered.', motif: 'blueprint',
    img: '/media/verticals/design.jpg', img2: '', tags: [[28, 38, 'designed.to.spec'], [54, 20, 'envisys.system'], [52, 47, 'control.panel']], cta: 'Start a project',
    text: 'Standard chambers or systems built to your test standard, by our own design and development team.',
    offer: [
      { t: 'Temperature & humidity', d: '150 to 3000 L', href: '/products/et' },
      { t: 'Thermal shock', d: 'Hot to cold in under 10 s', href: '/products/ets' },
      { t: 'Altitude', d: 'Low pressure and temperature', href: '/products/eta' },
      { t: 'Walk-in rooms', d: 'Built to order', href: '/products/walk-in' }
    ],
    steps: ['Your requirement', 'Design', 'Build and prove', 'Install and train'],
    facts: [{ v: '24', l: 'Product series' }, { v: '150–3000 L', l: 'Standard volumes' }, { v: '40+', l: 'Years of experience' }]
  },
  {
    id: 'express', name: 'Express Factory', short: 'Standard models, from stock.', motif: 'route',
    img: '/media/verticals/express.jpg', img2: '', tags: [[38, 42, 'standard.model'], [64, 55, 'ready.to.ship'], [84, 72, 'dispatch.lane']], cta: 'Order a standard model',
    text: 'Dedicated lines and supply chain for standard models, kept in stock and shipped fast.',
    offer: [], steps: [], facts: []
  },
  {
    id: 'testing', name: 'Testing Services', short: 'An accredited lab, next door.', motif: 'instrument',
    img: '/media/verticals/testing.jpg', img2: '/media/verticals/testing-2.jpg', tags: [[16, 32, 'ipx.spray.rig'], [46, 36, 'test.chamber'], [65, 56, 'water.circuit']], external: VISTARA_URL, cta: 'Book a test',
    text: 'Vistara, our lab in Peenya, is NABL-accredited for environmental testing.',
    offer: [
      { t: 'Temperature & humidity', d: 'MIL-810 · DO-160 · IEC 60068-2' },
      { t: 'Salt spray', d: 'ASTM B-117 · ISO 9227' },
      { t: 'Dust', d: 'IP, IEC 60529' },
      { t: 'Rain', d: 'IP, up to 3500 L' },
      { t: 'HALT & HASS', d: 'Stress screening' },
      { t: 'Prototype', d: 'Material analysis' }
    ],
    steps: ['Send the brief', 'Plan', 'Test', 'Report'],
    facts: [{ v: 'NABL', l: 'Accredited' }, { v: '3500 L', l: 'Largest rain chamber' }]
  },
  {
    id: 'rentals', name: 'Rentals', short: 'Short test? Rent the chamber.', motif: 'calendar',
    img: '/media/verticals/rentals.jpg', img2: '', tags: [[74, 26, 'chamber.ready'], [50, 42, 'short.term'], [32, 52, 'project.budget']], cta: 'Ask about a rental',
    text: 'A dedicated rental division, for when the budget is for a project, not a purchase.',
    offer: [
      { t: 'Renting a climatic chamber', d: 'Short-term testing', href: 'https://www.envisystech.com/blog/where-can-i-rent-a-climatic-test-chamber-for-short-term-testing/' },
      { t: 'Thermal shock rental', d: 'A buyer’s guide', href: 'https://www.envisystech.com/blog/thermal-shock-chamber-rental/' },
      { t: 'What sets the price', d: 'Rental price factors', href: 'https://www.envisystech.com/blog/factors-affecting-environmental-chamber-rental-price/' },
      { t: 'Rent, buy or use a lab', d: 'How to decide', href: 'https://www.envisystech.com/blog/environmental-test-chamber-rental-vs-buying-vs-testing-labs/' }
    ],
    steps: ['Tell us the test', 'We match a chamber', 'Delivered and set up', 'Return it'],
    facts: []
  },
  {
    id: 'aftersales', name: 'After Sales & AMCs', short: 'Answered within 24 hours.', motif: 'dial',
    img: '/media/verticals/aftersales.jpg', img2: '', tags: [[38, 26, 'response.24h'], [52, 50, 'engineer.onsite'], [76, 62, 'refrigeration.unit']], cta: 'Set up an AMC',
    text: 'Calibration, maintenance contracts and support for the life of the chamber.',
    offer: [
      { t: 'Annual maintenance', d: 'AMCs' },
      { t: 'Calibration', d: 'Of chambers' },
      { t: 'Repair and spares', d: 'Engineering support' }
    ],
    steps: ['Call or write', 'Answered in a day', 'Engineer on site', 'Back to testing'],
    facts: [{ v: '24 h', l: 'To respond' }, { v: '4', l: 'Regional offices' }]
  },
  {
    id: 'refurb', name: 'Refurbishment & Buy-back', short: 'A second life for chambers.', motif: 'loop',
    img: '/media/verticals/refurb.jpg', img2: '', tags: [[73, 62, 'refrigeration'], [50, 44, 'second.life'], [30, 64, 'restored']], cta: 'Discuss your chamber',
    text: 'Restore and modernise an ageing chamber, or trade it in when it is time for a new one.',
    offer: [
      { t: 'Refurbishment', d: 'Restored to working order', img: '/media/verticals/refurb-3.jpg' },
      { t: 'Modernisation', d: 'Controls brought up to date', img: '/media/verticals/refurb-2.jpg' },
      { t: 'Buy-back', d: 'Trade in the old one' }
    ],
    steps: ['Tell us about it', 'Inspection', 'Restore or trade in', 'Back in service'],
    facts: []
  }
]

export const offices = ['Faridabad', 'Pune', 'Hyderabad', 'Coimbatore']
export const vertical = (id: string) => verticals.find((v) => v.id === id)
// where a vertical's link goes: Vistara's site for Testing once it is set, otherwise the vertical's own page
export const to = (v: Vertical) => v.external || `/verticals/${v.id}`
export const attrs = (v: Vertical) => (v.external ? { href: v.external, target: '_blank', rel: 'noopener' } : { href: `/verticals/${v.id}` })

// the display face draws its hyphen as a long dash: set hyphens in the reading face (class .hy, styled where it is used)
export const hy = (s: string) => s.replace(/-/g, '<i class="hy">-</i>')
