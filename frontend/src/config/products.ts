/**
 * Every product series Envisys makes, in one place. The products page, each product page and the search all read this file.
 *
 * Sources: Website Development - Product lists.pdf (series and model codes), envisystech.com (descriptions, specs, brochures).
 * Where neither source gives a figure, the spec is left out rather than guessed; add it to `specs` when you have it.
 * Images live in /public/p/<slug>/ (hero.webp, g1.webp…, lines.webp = the X-ray line drawing).
 */

export type Group = 'Climatic & thermal' | 'Shock, altitude & vacuum' | 'Vibration & mechanical' | 'Ingress, corrosion & light' | 'Energy & mobility'

export interface Product {
  slug: string
  name: string
  code: string               // the model prefix on the machine, e.g. ET
  tier: 'main' | 'catalog'
  group: Group
  tagline: string
  intro: string
  features: string[]
  specs: [string, string][]
  models: { label: string; items: string[] }[]
  keywords: string[]         // extra words people type that are not in the name
  gallery: number            // how many g1..gN images exist
  photo?: boolean            // the hero is a photograph, not a cut-out
  hud?: [string, string, string][]    // main products only: the readouts on the showcase, [label, value, unit], all taken from `specs` or `models`
  brochure?: string
}

const B = 'https://www.envisystech.com/wp-content/themes/tecobytes/media/brochure-2020/'

export const products: Product[] = [
  {
    hud: [['Temperature', '−70 – 180', '°C'], ['Humidity', '10 – 95', '% RH'], ['Volume', '150 – 3000', 'L'], ['Ramp', '3 – 20', '°C/min']],
    slug: 'et', name: 'ET Chamber', code: 'ET', tier: 'main', group: 'Climatic & thermal', gallery: 4,
    tagline: 'Temperature and humidity, held where you set them.',
    intro: 'ET-Series environmental test chambers simulate a wide range of temperature and relative humidity for components and assemblies of many sizes, with the features other makers sell as add-ons already included.',
    features: [
      'LED-lit work space with a multi-pane vacuumised glass window and de-fog heaters',
      'Stainless steel interior and powder-coated CRCS panels, with SS shelving on height-adjustable tray channels',
      'Double silicone rubber seal, die-cast aluminium locks and hinges',
      'Through-wall access ports on either side for cable run-through',
      'Door-handle HMI for front-access operation',
      'Controller with RS-232, RS-485, USB and Ethernet, 99 programs, graphical programming and a built-in web server for remote monitoring'
    ],
    specs: [['Standard volumes', '150, 300, 600, 950, 1400 and 3000 L'], ['Temperature', '−40 / −70 °C to 180 °C, ±1 °C'], ['Relative humidity', '10% to 95%, ±3%'], ['Ramp rate', '3 °C/min standard; 5, 10, 15 or 20 °C/min optional']],
    models: [{ label: 'Models', items: ['ET150', 'ET300', 'ET600', 'ET950', 'ET1400', 'ET3000'] }, { label: 'Variants', items: ['40T / 70T (temperature)', '40H / 70H (temperature and humidity)'] }],
    keywords: ['climatic', 'temperature', 'humidity', 'rh', 'thermal cycling', 'cold', 'hot', 'reach-in', 'et series', 'environmental'],
    brochure: B + 'environmental-test-chambers-brochure.pdf'
  },
  {
    hud: [['Hot zone', '200', '°C'], ['Cold zone', '−70', '°C'], ['Transfer', '< 10', 's'], ['Accuracy', '± 1', '°C']],
    slug: 'ets', name: 'ETS Thermal Shock', code: 'ETS', tier: 'main', group: 'Shock, altitude & vacuum', gallery: 4,
    tagline: 'Hot to cold in under ten seconds.',
    intro: 'Thermal shock chambers move a product between a hot zone and a cold zone to find the point where materials and joints fail. A carrier basket transfers the test item between the two zones.',
    features: [
      'Two zones, hot and cold, with a product carrier basket between them',
      'Horizontal or vertical layouts',
      'Short temperature recovery with excellent uniformity',
      'Fixtures and configuration to meet the test specification'
    ],
    specs: [['Temperature', '−40 / −70 °C to 200 °C, ±1 °C'], ['Basket transition', 'under 10 s']],
    models: [{ label: 'Models', items: ['ETS-50', 'ETS-100', 'ETS-150', 'ETS-300', 'ETS-600', 'ETS-900'] }],
    keywords: ['thermal shock', 'shock', 'ess', 'stress screening', 'basket', 'two zone', 'cycling', 'rapid'],
    brochure: B + 'thermal-shock-chambers-brochure.pdf'
  },
  {
    hud: [['Temperature', '−70 – 180', '°C'], ['Pressure', '10', 'mbar'], ['Humidity', '10 – 95', '% RH'], ['Volume', '600 – 1400', 'L']],
    slug: 'eta', name: 'ETA Altitude', code: 'EA', tier: 'main', group: 'Shock, altitude & vacuum', gallery: 4,
    tagline: 'Low pressure and temperature together.',
    intro: 'Altitude chambers adjust temperature while exposing the product to low pressure, to simulate the conditions aircraft and their components meet. They suit avionics and any product that may be shipped by air.',
    features: ['Combined altitude, temperature and humidity (CATH) testing', 'Door locking mechanism, humidity butterfly valve, feed-through connectors', 'Factory tested before dispatch', 'Custom builds for specific altitude and temperature profiles'],
    specs: [['Available range', '600, 950 and 1400 L'], ['Temperature', '−40 / −70 °C to 180 °C'], ['Relative humidity', '10% to 95% (optional)'], ['Altitude', 'up to 10 mbar']],
    models: [{ label: 'Models', items: ['EA300', 'EA600', 'EA950', 'EA1400'] }, { label: 'Variants', items: ['40T / 70T (temperature)', '40H / 70H (temperature and humidity)'] }],
    keywords: ['altitude', 'pressure', 'vacuum', 'low pressure', 'aerospace', 'avionics', 'cath', 'aircraft', 'height'],
    brochure: B + 'altitude-chambers-brochure.pdf'
  },
  {
    hud: [['Models', '14', ''], ['Bench', '2', 'models'], ['Floor', '12', 'models'], ['Sizes', '30 – 100', 'EM']],
    slug: 'mini', name: 'Mini Environmental', code: 'EM', tier: 'main', group: 'Climatic & thermal', gallery: 4,
    tagline: 'A full climate, on a bench.',
    intro: 'EM-Series mini chambers are made for table or floor use with a small footprint, for component-level testing in laboratories short on space.',
    features: ['Mono-block construction with a user-access control desk', 'Full-front opening door with view window and LED lighting', 'Colour touch programmer or single / dual-loop controllers', 'Single or two-stage refrigeration with eco-friendly refrigerants', 'Optional stand for bench models'],
    specs: [['Formats', 'bench / desk and floor models'], ['Controller', 'programmable colour touch, or set-point controller']],
    models: [{ label: 'Bench / desk', items: ['EM30-30T-D', 'EM64-30T-D'] }, { label: 'Floor', items: ['EM64-30T', 'EM64-30H', 'EM64-60T', 'EM64-60H', 'EM80-30T', 'EM80-30H', 'EM80-60T', 'EM80-60H', 'EM100-30T', 'EM100-30H', 'EM100-60T', 'EM100-60H'] }],
    keywords: ['mini', 'bench', 'benchtop', 'tabletop', 'desk', 'small', 'compact', 'component', 'em series'],
    brochure: B + 'environmental-test-chambers-brochure.pdf'
  },
  {
    hud: [['Temperature', '−65 – 180', '°C'], ['Humidity', '10 – 95', '% RH'], ['Volume', '10k – 22k', 'L'], ['Models', '6', '']],
    slug: 'walk-in', name: 'Walk-in Environmental', code: 'EWS', tier: 'main', group: 'Climatic & thermal', gallery: 2,
    tagline: 'Room-sized climates for large specimens.',
    intro: 'EWS-Series walk-in chambers are built to order for large specimens. Mono-block rooms serve high-temperature work; pre-fabricated panel rooms serve low and medium temperatures.',
    features: ['Water- or air-cooled refrigeration with hermetic or semi-hermetic compressors', 'Integrated or remote refrigeration compartments and control panel', 'Colour touch programmer with RS-232, RS-485, USB and Ethernet', 'Height-adjustable specimen racks and cable ports', 'Built-in web server for remote monitoring', 'Optional remote control console'],
    specs: [['Volume', '10,000 to 22,000 L'], ['Temperature', '−35 / −65 °C to 180 °C'], ['Relative humidity', '10% to 95%']],
    models: [{ label: 'Models', items: ['EWS10K', 'EWS12K', 'EWS14K', 'EWS16K', 'EWS18K', 'EWS22K'] }, { label: 'Variants', items: ['35T / 65T (temperature)', '35H / 65H (temperature and humidity)'] }],
    keywords: ['walk in', 'walkin', 'walk-in', 'room', 'large', 'vehicle', 'big', 'ews', 'custom'],
    brochure: B + 'walkin-environmental-chambers-brochure.pdf'
  },

  // ── catalogue ──
  {
    slug: 'battery', name: 'Battery Testing Chambers', code: 'ETB', tier: 'catalog', group: 'Energy & mobility', gallery: 4,
    tagline: 'Safe testing of cells and packs against environmental stress.',
    intro: 'Battery testing chambers come in many sizes and configurations for different battery types, with safety systems built in for the risks of lithium-ion testing.',
    features: ['CO₂ fire suppression system', 'Automatic air exchange system', 'Mechanical locking and fire extinguisher system', 'Mechanical pressure relief port'],
    specs: [['Available range', '600, 950 and 1400 L'], ['Temperature', '−40 / −70 °C to 180 °C']],
    models: [{ label: 'Models', items: ['ETB150', 'ETB300', 'ETB600', 'ETB950', 'ETB1400'] }],
    keywords: ['battery', 'lithium', 'li-ion', 'cell', 'pack', 'ev', 'electric vehicle', 'fire', 'safety'],
    brochure: B + 'battery-testing-chambers-brochure.pdf'
  },
  {
    slug: 'vibration-chambers', name: 'Vibration Chambers', code: 'ETV', tier: 'catalog', group: 'Vibration & mechanical', gallery: 2,
    tagline: 'A climate chamber built around a shaker.',
    intro: 'A vibration assembly with an environmental chamber, designed and built to the customer’s requirement and the international standard it must meet: chamber, shaker interface, and an HMI / PLC control system.',
    features: ['Environmental chamber with a vibration shaker interface', 'High-density, low-conduction mineral wool insulation to avoid thermal loss', 'Chamber moves vertically on hydraulic cylinders, or horizontally on rails', 'HMI / PC PLC based control'],
    specs: [['ETV150 work space', '550 × 400 × 700 mm']],
    models: [{ label: 'Models', items: ['ETV150', 'ETV300', 'ETV600', 'ETV950', 'ETV1400'] }, { label: 'Variants', items: ['40T / 70T (temperature)', '40H / 70H (temperature and humidity)'] }],
    keywords: ['vibration', 'shaker', 'cvc', 'combined', 'climatic vibration', 'halt', 'hass', 'interface'],
    brochure: B + 'vibration-chambers-brochure.pdf'
  },
  {
    slug: 'rain', name: 'Rain Chambers', code: 'IPX', tier: 'catalog', group: 'Ingress, corrosion & light', gallery: 2,
    tagline: 'Water ingress, from drip to high-pressure jet.',
    intro: 'Rain spray chambers test a product’s waterproofing by imitating rain, spray and dripping, for ingress-protection (IP) ratings and for the physical deterioration water causes. Walk-in and drive-in facilities and room conversions are available.',
    features: ['Industrial walk-in and drive-in rain facilities', 'Liquid-ingress protection test chambers', 'Room conversion into rain chambers'],
    specs: [['IP coverage', 'IPX1 up to IPX9K']],
    models: [{ label: 'Ranges', items: ['IPX1–IPX2', 'IPX3–IPX4', 'IPX5–IPX6', 'IPX7–IPX8', 'IPX9K'] }],
    keywords: ['rain', 'water', 'ip rating', 'ipx', 'ingress', 'spray', 'drip', 'jet', 'waterproof', 'splash', 'ip67', 'ip69'],
    brochure: B + 'rain-chambers-brochure.pdf'
  },
  {
    slug: 'vibration-shakers', name: 'Vibration Shakers', code: 'EVS', tier: 'catalog', group: 'Vibration & mechanical', gallery: 1,
    tagline: 'Electrodynamic shakers from low to high force.',
    intro: 'Electrodynamic vibration shaker systems, in low, medium and high-force ranges.',
    features: [],
    specs: [['Force classes', 'low, medium and high']],
    models: [{ label: 'Low force', items: ['EVS-006-180', 'EVS-010-240'] }, { label: 'Medium force', items: ['EVS-020-300', 'EVS-030-360', 'EVS-040-450', 'EVS-050-450', 'EVS-060-450'] }, { label: 'High force', items: ['EVS-090-450-W', 'EVS-120-480-W', 'EVS-160-590-W', 'EVS-200-590-W'] }],
    keywords: ['vibration', 'shaker', 'electrodynamic', 'force', 'sine', 'random', 'evs']
  },
  {
    slug: 'dust', name: 'Dust Chambers', code: 'EDC', tier: 'catalog', group: 'Ingress, corrosion & light', gallery: 3,
    tagline: 'Sand and dust, on a schedule.',
    intro: 'Dust test chambers reproduce the electrical and mechanical effects of sand or dust getting into equipment, to find out whether it is suited to its environment and to determine its ingress protection.',
    features: ['Blower speed regulation for metered, uniform dust floating in the test space', 'Cycling dust test, programmable', 'Touch control or multi-function programmable timer', 'Built to the standard the user specifies'],
    specs: [['Volumes', '1000, 1500 and 3375 L']],
    models: [{ label: 'Models', items: ['EDC 1000', 'EDC 1500', 'EDC 3375'] }],
    keywords: ['dust', 'sand', 'ip5x', 'ip6x', 'ingress', 'blowing sand', 'particle'],
    brochure: B + 'dust-chambers-brochure.pdf'
  },
  {
    slug: 'salt-spray', name: 'Salt Spray Chambers', code: 'ECS', tier: 'catalog', group: 'Ingress, corrosion & light', gallery: 4,
    tagline: 'Corrosion, accelerated.',
    intro: 'Salt spray (salt fog) chambers test the corrosion resistance of materials and coatings through accelerated exposure, in basic and cyclic versions.',
    features: ['Basic and cyclic versions', 'Single set-point PID controller or colour touch programmer', 'Microprocessor-based PID temperature control', 'Mini, standard and walk-in sizes'],
    specs: [['Test standards', 'ASTM B-117, ISO 9227, MIL-810 and others']],
    models: [{ label: 'Mini', items: ['EMS-100'] }, { label: 'EBS / ECS', items: ['EBS/ECS 300', 'EBS/ECS 600', 'EBS/ECS 900', 'EBS/ECS 1500'] }],
    keywords: ['salt', 'spray', 'fog', 'corrosion', 'rust', 'astm b117', 'cyclic', 'coating', 'ems', 'ebs', 'ecs'],
    brochure: B + 'salt-spray-chambers-brochure.pdf'
  },
  {
    slug: 'sub-zero', name: 'Sub-Zero & Razor Blade Treatment', code: 'ESC', tier: 'catalog', group: 'Climatic & thermal', gallery: 4,
    tagline: 'Deep cold for treating blades and components.',
    intro: 'Sub-zero chambers use a cascade water-cooled refrigeration system with a high-efficiency plate heat exchanger. They are used for the sub-zero treatment of razor blades and for heat-treatment applications on automotive components.',
    features: ['Cascade water-cooled refrigeration', 'Vertical sub-zero chambers for automotive components', 'Sub-zero treatment chambers for razor blades'],
    specs: [],
    models: [{ label: 'Models', items: ['ESC150-80-T', 'ESC300-80-T', 'ESC600-80-T', 'ESC950-80-T', 'ESC950-80-F', 'ESC1800-80-F', 'ESC2500-80-F'] }],
    keywords: ['sub zero', 'subzero', 'cryo', 'cryogenic', 'razor', 'razer', 'blade', 'treatment', 'freezing', 'cold', 'heat treatment', 'strip cooler']
  },
  {
    slug: 'solar-pv', name: 'PV Module & Solar Panel Testing', code: 'ET', tier: 'catalog', group: 'Energy & mobility', gallery: 1,
    tagline: 'Damp heat and thermal cycling for PV modules.',
    intro: 'ET-Series environmental chambers sized for solar panels and PV modules, for the temperature and humidity tests the PV standards call for.',
    features: ['Humidity control during the temperature ramp, or none, as the test requires', 'Sized for variable panel dimensions'],
    specs: [['Standards', 'IEC 61215, IEC 61730, IEC 62108, UL 1703, ASTM E1171']],
    models: [{ label: 'Based on', items: ['ET series'] }],
    keywords: ['solar', 'pv', 'photovoltaic', 'panel', 'module', 'iec 61215', 'damp heat', 'humidity freeze'],
    brochure: B + 'solar-panel-testing-chambers-brochure.pdf'
  },
  {
    slug: 'chillers', name: 'Industrial Chillers', code: 'ETC', tier: 'catalog', group: 'Climatic & thermal', gallery: 2,
    tagline: 'Process cooling, from ETC5 to ETC60.',
    intro: 'Water-cooled industrial chillers for process cooling.',
    features: [],
    specs: [['Range', 'ETC5 to ETC60']],
    models: [{ label: 'Models', items: ['ETC5', 'ETC7.5', 'ETC10', 'ETC15', 'ETC20', 'ETC25', 'ETC30', 'ETC40', 'ETC50', 'ETC60'] }],
    keywords: ['chiller', 'cooling', 'water cooled', 'process', 'industrial', 'etc'],
    brochure: B + 'industrial-chillers-brochure.pdf'
  },
  {
    slug: 'ovens-dryers', name: 'Industrial Ovens & Dryers', code: 'EO', tier: 'catalog', group: 'Climatic & thermal', gallery: 4,
    tagline: 'Curing, ageing and drying, evenly heated.',
    intro: 'Industrial ovens and dryers for curing, heat processing, ageing and annealing, with uniform air circulation for a better temperature gradient in the working space.',
    features: ['High temperature accuracy for reliable test results', 'Uniform air circulation', 'Single set-point PID or programmable controller', 'Walk-in single and double door ovens'],
    specs: [['Oven volumes', '150, 300, 600, 950 and 1400 L'], ['Oven temperature', '250 °C']],
    models: [{ label: 'Ovens', items: ['EO150-250T', 'EO300-250T', 'EO600-250T', 'EO950-250T', 'EO1400-250T'] }, { label: 'Dryers', items: ['ETD12-150T', 'ETD24-150T', 'ETD48-150T', 'ETD96-150T', 'ETD192-150T'] }],
    keywords: ['oven', 'dryer', 'drying', 'curing', 'ageing', 'annealing', 'heating', 'walk-in oven', 'eo'],
    brochure: B + 'industrial-ovens-brochure.pdf'
  },
  {
    slug: 'temperature-forcing', name: 'Chip Coolers & Temperature Forcing', code: 'ETFS', tier: 'catalog', group: 'Climatic & thermal', gallery: 3,
    tagline: 'Hot and cold air straight onto the device.',
    intro: 'Temperature forcing systems drive a controlled temperature directly onto a chip or component through a flexible hose and cooling head, for GPU characterisation and workload profiling without a chamber.',
    features: ['Closed-loop temperature mapping from the chip to the main unit', 'Two-phase cold plate heads take away extreme heat loads', 'Maintenance-free cascade refrigeration with low-GWP R-449A and R-508B', 'Removable conduction heaters in the head for positive temperatures', '2 – 2.5 m flexible thermal head, sealed against condensation', 'Built-in touchscreen controller; fits under a work table'],
    specs: [['Temperature', '−40 °C to +125 °C'], ['Cooling capability', '1500 W at 0 °C (2800 W with the 2-phase head)'], ['Transition time', '100 – 120 s'], ['System size', '700 × 900 × 1040 mm (W × D × H)'], ['Power classes', '200, 400, 750, 1500 and 3000 W']],
    models: [{ label: 'Power', items: ['200 W', '400 W', '750 W', '1500 W', '3000 W'] }],
    keywords: ['chip', 'cooler', 'temperature forcing', 'etfs', 'probe', 'thermal head', 'semiconductor', 'ic', 'device', 'forcing'],
    brochure: B + 'temperature-forcing-chambers-brochure.pdf'
  },
  {
    slug: 'utm', name: 'Chambers for UTMs', code: 'UTM', tier: 'catalog', group: 'Vibration & mechanical', gallery: 1, photo: true,
    tagline: 'Test the material under load, at temperature.',
    intro: 'Environmental chambers made to fit universal testing machines, so a specimen can be pulled, pressed or bent while held at temperature.',
    features: [],
    specs: [],
    models: [{ label: 'Series', items: ['Made to the UTM'] }],
    keywords: ['utm', 'universal testing machine', 'tensile', 'load', 'material', 'instron', 'zwick'],
    brochure: B + 'utm-chambers-brochure.pdf'
  },
  {
    slug: 'drop-test', name: 'Drop Test Machine', code: 'DTM', tier: 'catalog', group: 'Vibration & mechanical', gallery: 0,
    tagline: 'Repeatable drops, up to 1800 mm.',
    intro: 'A drop test machine with adjustable drop heights and a maximum load capacity of 80 kg.',
    features: [],
    specs: [['Drop height', 'adjustable, up to 1800 mm'], ['Maximum load', '80 kg']],
    models: [{ label: 'Series', items: ['Drop test machine'] }],
    keywords: ['drop', 'impact', 'shock', 'free fall', 'packaging', 'transport', 'mechanical']
  },
  {
    slug: 'e-motor', name: 'E-Motor Testing', code: 'ETE', tier: 'catalog', group: 'Energy & mobility', gallery: 3,
    tagline: 'Electric motors, 10 to 200 kW.',
    intro: 'Test systems for electric motors in the 10 kW to 200 kW class.',
    features: [],
    specs: [['Motor power', '10 kW to 200 kW']],
    models: [{ label: 'Series', items: ['ETE300'] }],
    keywords: ['motor', 'e-motor', 'electric motor', 'ev', 'traction', 'dyno', 'dynamometer', 'ete', 'kw'],
  },
  {
    slug: 'fogging', name: 'Fogging Test Chambers', code: 'EFG', tier: 'catalog', group: 'Ingress, corrosion & light', gallery: 0, photo: true,
    tagline: 'Fogging system for test chambers.',
    intro: 'Fogging test chamber. Specifications on request.',
    features: [], specs: [],
    models: [{ label: 'Series', items: ['Fogging system'] }],
    keywords: ['fogging', 'fog', 'mist', 'interior', 'automotive']
  },
  {
    slug: 'solar-radiation', name: 'Solar Radiation Chambers', code: 'ESR', tier: 'catalog', group: 'Ingress, corrosion & light', gallery: 2,
    tagline: 'Sunlight, simulated.',
    intro: 'Solar radiation chambers expose a product to simulated sunlight together with a controlled climate. Specifications on request.',
    features: [], specs: [],
    models: [{ label: 'Series', items: ['Solar radiation chamber'] }],
    keywords: ['solar', 'sun', 'radiation', 'sunlight', 'irradiance', 'lamp', 'uv', 'weathering']
  },
  {
    slug: 'thermomechanical', name: 'Thermomechanical Chamber', code: 'ETM', tier: 'catalog', group: 'Vibration & mechanical', gallery: 2,
    tagline: 'Heat, cold and mechanical load together.',
    intro: 'Thermomechanical test chamber. Specifications on request.',
    features: [], specs: [],
    models: [{ label: 'Series', items: ['Thermomechanical chamber'] }],
    keywords: ['thermomechanical', 'thermo mechanical', 'load', 'fatigue', 'stress']
  },
  {
    slug: 'vacuum', name: 'Vacuum De-gassing Chambers', code: 'EVD', tier: 'catalog', group: 'Shock, altitude & vacuum', gallery: 1,
    tagline: 'Heated vacuum, 50 to 120 °C.',
    intro: 'Vacuum de-gassing chambers remove trapped gas under vacuum with controlled heat.',
    features: [],
    specs: [['Temperature', '50 °C to 120 °C']],
    models: [{ label: 'Series', items: ['Vacuum de-gassing chamber'] }],
    keywords: ['vacuum', 'degassing', 'de-gassing', 'degas', 'bubble', 'resin', 'casting']
  },
  {
    slug: 'uv', name: 'UV Chambers', code: 'EUV', tier: 'catalog', group: 'Ingress, corrosion & light', gallery: 0, photo: true,
    tagline: 'Ultraviolet ageing of materials.',
    intro: 'UV chambers expose materials to ultraviolet light to test how they age. Specifications on request.',
    features: [], specs: [],
    models: [{ label: 'Series', items: ['UV chamber'] }],
    keywords: ['uv', 'ultraviolet', 'weathering', 'ageing', 'aging', 'light', 'fade']
  }
]

export const mainProducts = products.filter((p) => p.tier === 'main')
export const catalogue = products.filter((p) => p.tier === 'catalog')
export const groups: Group[] = ['Climatic & thermal', 'Shock, altitude & vacuum', 'Vibration & mechanical', 'Ingress, corrosion & light', 'Energy & mobility']
export const bySlug = (s: string) => products.find((p) => p.slug === s)
// the few gallery pictures that are real scenes (not cut-outs): shown as photographs in a rounded frame, the rest stand free
export const scenePhotos = new Set(['/p/eta/g3.webp', '/p/rain/g1.webp', '/p/temperature-forcing/g2.webp', '/p/temperature-forcing/g3.webp'])
export const img = (p: Product, f: 'hero' | 'lines' | `g${number}`) => `/p/${p.slug}/${f}.webp`

// the 3D model for each main chamber (phones load the `_m.glb` cut), dressed in Blender (tools/step_to_obj.py + tools/dress_step.py) and Draco-compressed.
// Only series with their own model are listed; the others show their photograph in the same place, so no page ever
// shows another product. Add each series here as its STEP file is converted.
export const models: Record<string, string> = { et: '/models/et950.glb', eta: '/models/ea600.glb' }
// photographs of individual models, by family (a model code without its variant suffix: EM64-30T → EM64).
// Families without one show 'Photograph to follow'.
// a model's own photograph (cut out, from the product shoots in public/pics), keyed by the name its card shows
export const modelShots: Record<string, string> = {
  ET300: '/p/et/m-et300.webp', EM30: '/p/mini/m-em30.webp', EM64: '/p/mini/m-em64.webp', EM100: '/p/mini/m-em100.webp',
  'ETS-150': '/p/ets/m-ets-150.webp', 'ETS-900': '/p/ets/m-ets-900.webp', EO150: '/p/ovens-dryers/m-eo150.webp', EO300: '/p/ovens-dryers/m-eo300.webp',
  ETB950: '/p/battery/m-etb950.webp', 'EDC 1500': '/p/dust/m-edc-1500.webp', ETE300: '/p/e-motor/m-ete300.webp',
  'EMS-100': '/p/salt-spray/m-ems-100.webp', 'EBS/ECS 300': '/p/salt-spray/m-ebs-ecs-300.webp',
  'Thermomechanical chamber': '/p/thermomechanical/m-thermomechanical-chamber.webp', 'Vacuum de-gassing chamber': '/p/vacuum/m-vacuum-de-gassing-chamber.webp',
  'Solar radiation chamber': '/p/solar-radiation/m-solar-radiation-chamber.webp', 'Drop test machine': '/p/drop-test/m-drop-test-machine.webp', 'ET series': '/p/solar-pv/m-et-series.webp'
}
export const family = (item: string) => item.replace(/-\d+[TH](-D)?$/, '')
// short lines from real Google reviews (the full ones are in TestimonialsSection); they are about Envisys, not one chamber
const quotes = [
  { q: 'Innovation every time we procure a new product', who: 'Prakash Rathod' },
  { q: 'Quality wise, very good', who: 'VR Prabu' },
  { q: 'Their service support is excellent', who: 'Venu Gopal' },
  { q: 'Clear, reliable reports', who: 'Baikunthanath Khuntia' },
  { q: 'There has not been a single issue', who: 'Sunil Nambiar' }
]
// one distinct review per flagship; the rest get none, because five real reviews repeated over 24 pages would read as stock
export const quotesFor = (i: number) => (i < quotes.length ? [quotes[i]] : [])

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9.]+/g, '')

export interface Hit { product: Product; score: number; models: string[] }

/** Search by name, group, model code (ET950, ets-300, EM64), keyword, or a spec such as -70 or 22000. Offline and instant. */
export function searchProducts(q: string): Hit[] {
  const raw = q.trim().toLowerCase()
  if (!raw) return []
  const nq = norm(raw)
  const words = raw.split(/[\s,]+/).filter(Boolean)
  const hits: Hit[] = []
  for (const p of products) {
    let score = 0
    const mm: string[] = []
    const name = p.name.toLowerCase()
    if (name === raw) score += 100
    else if (name.includes(raw)) score += 60
    if (norm(p.code) === nq) score += 70
    for (const m of p.models) for (const it of m.items) {
      const ni = norm(it)
      if (nq.length >= 2 && (ni === nq || (nq.length >= 3 && ni.startsWith(nq)) || (nq.length >= 4 && ni.includes(nq)))) { score += ni === nq ? 90 : 55; if (!mm.includes(it)) mm.push(it) }
    }
    for (const w of words) {
      if (w.length < 2) continue
      if (name.includes(w)) score += 22
      if (p.keywords.some((k) => k.includes(w) || (w.length > 3 && w.includes(k)))) score += 16
      if (p.group.toLowerCase().includes(w)) score += 8
      if (p.tagline.toLowerCase().includes(w) || p.intro.toLowerCase().includes(w)) score += 5
      if (p.specs.some(([a, b]) => (a + ' ' + b).toLowerCase().includes(w))) score += 9
    }
    if (score > 0) hits.push({ product: p, score, models: mm.slice(0, 4) })
  }
  return hits.sort((a, b) => b.score - a.score || (a.product.tier === 'main' ? -1 : 1))
}

export const suggestions = ['thermal shock', 'ET950', '-70 °C', 'battery', 'salt spray', 'IPX9K', 'walk-in', 'altitude']
