/**
 * The test standards Envisys chambers are built to run, one page each (/standards/<slug>), for the engineers who search by standard.
 * Which chambers run each one comes from `standards` in config/products.ts; this file only says, in plain words, what the standard is.
 */
import { products, stdFamily, type Product } from './products'

export interface Standard { family: string; slug: string; title: string; what: string; body: string }

const S: [string, string, string, string][] = [
  // family, short title, one line, a short paragraph
  ['IEC 60068', 'Environmental testing', 'The international family of environmental tests for electrical and electronic products.',
    'IEC 60068-2 sets out how to test a product in cold (-2-1), dry heat (-2-2), change of temperature (-2-14), damp heat (-2-30 cyclic, -2-78 steady), salt mist (-2-11, -2-52), vibration (-2-6, -2-64), shock (-2-27), low air pressure (-2-13) and more. IEC 60068-3-5 describes how a temperature chamber itself should perform. Most product specifications in electronics, automotive and defence point to one of its parts.'],
  ['MIL-STD-810', 'Environmental engineering for defence equipment', 'The US defence standard for proving equipment survives the environments it will meet.',
    'Each environment is a numbered method: low pressure (500), high temperature (501), low temperature (502), temperature shock (503), solar radiation (505), humidity (507), salt fog (509), sand and dust (510), vibration (514) and combined environments (520). It is widely used beyond defence as a benchmark for rugged products.'],
  ['MIL-STD-883', 'Test methods for microelectronics', 'US defence test methods for microcircuits and semiconductor devices.',
    'Method 1010 is temperature cycling: devices are moved between hot and cold extremes for a set number of cycles to expose weak bonds, solder joints and packaging faults.'],
  ['JESD22-A104', 'Temperature cycling (JEDEC)', 'The JEDEC semiconductor industry test for temperature cycling.',
    'Used to qualify semiconductor packages and solder joints by cycling them between temperature extremes, usually in a two-zone thermal shock chamber.'],
  ['RTCA DO-160', 'Environmental conditions for airborne equipment', 'The aviation standard for testing equipment carried on aircraft.',
    'Section 4 covers temperature and altitude: equipment is run at the low pressure and temperatures of flight, including rapid decompression. Avionics suppliers test to it to certify their equipment.'],
  ['UN 38.3', 'Lithium battery transport tests', 'The UN tests a lithium battery must pass before it can be shipped.',
    'Test T.2 is the thermal test: cells and batteries are cycled between hot and cold extremes, then checked for leakage, venting or loss of voltage. T.1 simulates the low pressure of air transport.'],
  ['IEC 62133', 'Safety of portable batteries', 'Safety requirements for portable sealed cells and batteries.',
    'IEC 62133-2 covers lithium systems, with tests that include high-temperature exposure, temperature cycling and abuse conditions run in a controlled chamber.'],
  ['IEC 62660', 'Lithium-ion cells for electric vehicles', 'Performance and reliability tests for EV traction cells.',
    'IEC 62660-2 sets out reliability and abuse tests for lithium-ion cells used in electric vehicles, many of them at controlled temperature.'],
  ['AIS-156', 'Indian EV battery safety', 'The Indian automotive standard for the safety of electric vehicle batteries.',
    'Brought in for L-category electric vehicles (two- and three-wheelers), it includes thermal and environmental tests on battery packs.'],
  ['ISO 16750', 'Road vehicles: environmental conditions', 'Environmental conditions and tests for electrical equipment in road vehicles.',
    'Part 3 covers mechanical loads, including the vibration profiles for parts mounted on the engine, the body and the chassis, often run with temperature at the same time.'],
  ['IEC 60529', 'Degrees of protection (IP code)', 'The IP code: how well an enclosure keeps out dust and water.',
    'The first digit rates dust (IP5X dust-protected, IP6X dust-tight); the second rates water, from dripping (IPX1) to spraying (IPX3, IPX4), jets (IPX5, IPX6) and immersion (IPX7, IPX8).'],
  ['ISO 20653', 'Road vehicles: degrees of protection', 'The vehicle version of the IP code, including high-pressure washing.',
    'It adds IPX9K: hot water at high pressure from close range, as in a vehicle wash, and dust tests for vehicle parts.'],
  ['DIN 40050', 'Road vehicles: IP protection (DIN)', 'The German standard that first defined IPX9K for vehicle parts.',
    'Part 9 sets the high-pressure, high-temperature water jet test now carried into ISO 20653.'],
  ['ASTM B117', 'Salt spray (fog) testing', 'The most widely cited salt spray test in the world.',
    'Parts sit in a continuous neutral salt fog at a controlled temperature, and the time to corrosion is recorded. Used for coatings, plating and finished parts.'],
  ['ISO 9227', 'Salt spray tests', 'The international salt spray standard: neutral, acetic and copper-accelerated.',
    'Covers neutral salt spray (NSS), acetic acid salt spray (AASS) and copper-accelerated acetic acid salt spray (CASS) for comparing the corrosion resistance of metals and coatings.'],
  ['IEC 61215', 'PV module design qualification', 'The qualification tests for crystalline silicon solar modules.',
    'IEC 61215-2 includes thermal cycling (MQT 11), humidity freeze (MQT 12) and damp heat at 85 °C and 85 % RH for 1000 hours (MQT 13).'],
  ['IEC 61730', 'PV module safety', 'Safety qualification for photovoltaic modules.',
    'Builds on the IEC 61215 environmental sequences to show a module stays electrically safe over its life.'],
  ['ISTA 1A', 'Packaged product test (ISTA)', 'A basic integrity test for packaged products up to 68 kg.',
    'It combines vibration and drop tests to show a package protects its contents in normal shipping.'],
  ['ASTM D5276', 'Drop test of loaded containers', 'Free-fall drop testing of loaded shipping containers.',
    'Drops a filled container from set heights and orientations to judge how well it protects the product.'],
  ['DIN 75220', 'Solar simulation for vehicle parts', 'Ageing of vehicle components under simulated sunlight.',
    'Exposes interior and exterior parts to simulated solar radiation, dry or humid, to check fading, cracking and deformation.'],
  ['ISO 4892', 'Plastics: exposure to laboratory light sources', 'Accelerated weathering of plastics under artificial light.',
    'Part 3 uses fluorescent UV lamps with cycles of light and condensation to simulate years of outdoor exposure.'],
  ['ASTM G154', 'Fluorescent UV exposure', 'The standard practice for fluorescent UV lamp weathering of non-metallic materials.',
    'Cycles UV light and condensation to reproduce the damage caused by sunlight and dew on paints, plastics and coatings.'],
  ['ASTM D4329', 'Fluorescent UV exposure of plastics', 'Fluorescent UV weathering, specifically for plastics.',
    'Applies the G154 practice to plastics, with set lamp types, temperatures and cycles.']
]

const slugOf = (f: string) => f.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const standards: Standard[] = S.map(([family, title, what, body]) => ({ family, slug: slugOf(family), title, what, body }))
export const standardBySlug = (s: string) => standards.find((x) => x.slug === s)
export const standardUrl = (entry: string) => `/standards/${slugOf(stdFamily(entry))}`
/** The chambers that run this standard, and the parts of it each one names. */
export const chambersFor = (family: string): { p: Product; parts: string[] }[] =>
  products.flatMap((p) => { const parts = (p.standards ?? []).filter((s) => stdFamily(s) === family); return parts.length ? [{ p, parts }] : [] })

// every family used in products.ts has a page (checked at build in dev)
if (import.meta.env.DEV) for (const p of products) for (const s of p.standards ?? []) console.assert(standards.some((x) => x.family === stdFamily(s)), `No standards page for ${stdFamily(s)}`)
