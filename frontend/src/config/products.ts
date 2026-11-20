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
  hotspots?: [number, number, string, string][] // points on the hero photo: [x %, y %, title, text] (chambers with a 3D model first)
  standards?: string[]       // test standards it runs (set in `extras` below)
  uses?: string[]            // what it is used for
  options?: string[]         // options and accessories, by name
}

const B = 'https://www.envisystech.com/wp-content/themes/tecobytes/media/brochure-2020/'

export const products: Product[] = [
  {
    hud: [['Temperature', '−70 – 180', '°C'], ['Humidity', '10 – 95', '% RH'], ['Volume', '150 – 3000', 'L'], ['Ramp', '3 – 20', '°C/min']],
    slug: 'et', name: 'ET Chamber', code: 'ET', tier: 'main', group: 'Climatic & thermal', gallery: 4,
    tagline: 'Climate, held exactly.',
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
    brochure: B + 'environmental-test-chambers-brochure.pdf',
    hotspots: [
      [50, 32, 'Viewing window', 'Multi-pane vacuum glass with de-fog heaters and an LED-lit work space, so the test can be watched without opening the door. 360 × 460 mm on the ET150.'],
      [50, 50.5, 'Touch controller', '99 programs, graphical programming and a built-in web server for remote monitoring. RS-232, RS-485, USB and Ethernet.'],
      [92, 35, 'Door and seals', 'Double silicone rubber seal with die-cast aluminium locks and hinges, built for years of daily opening.'],
      [5, 43, 'Access ports', 'Through-wall ports on either side for cables to the product under test. Two 115 mm ports on the ET150, more on request.'],
      [50, 74, 'Machine bay', 'Refrigeration, heating and air circulation sit in the base, serviceable from the front.'],
      [12, 95, 'Castors', 'Heavy-duty castors to move the chamber into place, with locks to hold it there.']
    ]
  },
  {
    hud: [['Hot zone', '200', '°C'], ['Cold zone', '−70', '°C'], ['Transfer', '< 10', 's'], ['Accuracy', '± 1', '°C']],
    slug: 'ets', name: 'ETS Thermal Shock', code: 'ETS', tier: 'main', group: 'Shock, altitude & vacuum', gallery: 4,
    tagline: 'Hot to cold in seconds.',
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
    tagline: 'Altitude meets temperature.',
    intro: 'Altitude chambers adjust temperature while exposing the product to low pressure, to simulate the conditions aircraft and their components meet. They suit avionics and any product that may be shipped by air.',
    features: ['Combined altitude, temperature and humidity (CATH) testing', 'Door locking mechanism, humidity butterfly valve, feed-through connectors', 'Factory tested before dispatch', 'Custom builds for specific altitude and temperature profiles'],
    specs: [['Available range', '600, 950 and 1400 L'], ['Temperature', '−40 / −70 °C to 180 °C'], ['Relative humidity', '10% to 95% (optional)'], ['Altitude', 'up to 10 mbar']],
    models: [{ label: 'Models', items: ['EA300', 'EA600', 'EA950', 'EA1400'] }, { label: 'Variants', items: ['40T / 70T (temperature)', '40H / 70H (temperature and humidity)'] }],
    keywords: ['altitude', 'pressure', 'vacuum', 'low pressure', 'aerospace', 'avionics', 'cath', 'aircraft', 'height'],
    brochure: B + 'altitude-chambers-brochure.pdf',
    hotspots: [
      [49, 19.5, 'Live readout', 'Temperature and pressure shown on the door, readable from across the lab.'],
      [49, 28.5, 'Viewing window', 'A pressure-rated window into the lit test space.'],
      [49, 49, 'Touch controller', 'Runs combined altitude, temperature and humidity (CATH) profiles from one screen.'],
      [94, 21, 'Door locking', 'A locking mechanism that holds the door sealed while the chamber is pumped down to 10 mbar.'],
      [49, 78, 'Vacuum and refrigeration', 'The pump-down and cooling plant, with the humidity butterfly valve and feed-through connectors for the product under test.'],
      [50, 95, 'Factory tested', 'Every chamber is run and checked in Bengaluru before dispatch.']
    ]
  },
  {
    hud: [['Models', '14', ''], ['Bench', '2', 'models'], ['Floor', '12', 'models'], ['Sizes', '30 – 100', 'EM']],
    slug: 'mini', name: 'Mini Environmental', code: 'EM', tier: 'main', group: 'Climatic & thermal', gallery: 4,
    tagline: 'Full climate, on a bench.',
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
    tagline: 'Climates you walk into.',
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
    tagline: 'Cells and packs, tested safely.',
    intro: 'Battery testing chambers come in many sizes and configurations for different battery types, with safety systems built in for the risks of lithium-ion testing.',
    features: ['CO₂ fire suppression system', 'Automatic air exchange system', 'Mechanical locking and fire extinguisher system', 'Mechanical pressure relief port'],
    specs: [['Available range', '600, 950 and 1400 L'], ['Temperature', '−40 / −70 °C to 180 °C']],
    models: [{ label: 'Models', items: ['ETB150', 'ETB300', 'ETB600', 'ETB950', 'ETB1400'] }],
    keywords: ['battery', 'lithium', 'li-ion', 'cell', 'pack', 'ev', 'electric vehicle', 'fire', 'safety'],
    brochure: B + 'battery-testing-chambers-brochure.pdf'
  },
  {
    slug: 'vibration-chambers', name: 'Vibration Chambers', code: 'ETV', tier: 'catalog', group: 'Vibration & mechanical', gallery: 2,
    tagline: 'Climate around a shaker.',
    intro: 'A vibration assembly with an environmental chamber, designed and built to the customer’s requirement and the international standard it must meet: chamber, shaker interface, and an HMI / PLC control system.',
    features: ['Environmental chamber with a vibration shaker interface', 'High-density, low-conduction mineral wool insulation to avoid thermal loss', 'Chamber moves vertically on hydraulic cylinders, or horizontally on rails', 'HMI / PC PLC based control'],
    specs: [['ETV150 work space', '550 × 400 × 700 mm']],
    models: [{ label: 'Models', items: ['ETV150', 'ETV300', 'ETV600', 'ETV950', 'ETV1400'] }, { label: 'Variants', items: ['40T / 70T (temperature)', '40H / 70H (temperature and humidity)'] }],
    keywords: ['vibration', 'shaker', 'cvc', 'combined', 'climatic vibration', 'halt', 'hass', 'interface'],
    brochure: B + 'vibration-chambers-brochure.pdf'
  },
  {
    slug: 'rain', name: 'Rain Chambers', code: 'IPX', tier: 'catalog', group: 'Ingress, corrosion & light', gallery: 2,
    tagline: 'Water, from drip to jet.',
    intro: 'Rain spray chambers test a product’s waterproofing by imitating rain, spray and dripping, for ingress-protection (IP) ratings and for the physical deterioration water causes. Walk-in and drive-in facilities and room conversions are available.',
    features: ['Industrial walk-in and drive-in rain facilities', 'Liquid-ingress protection test chambers', 'Room conversion into rain chambers'],
    specs: [['IP coverage', 'IPX1 up to IPX9K']],
    models: [{ label: 'Ranges', items: ['IPX1–IPX2', 'IPX3–IPX4', 'IPX5–IPX6', 'IPX7–IPX8', 'IPX9K'] }],
    keywords: ['rain', 'water', 'ip rating', 'ipx', 'ingress', 'spray', 'drip', 'jet', 'waterproof', 'splash', 'ip67', 'ip69'],
    brochure: B + 'rain-chambers-brochure.pdf'
  },
  {
    slug: 'vibration-shakers', name: 'Vibration Shakers', code: 'EVS', tier: 'catalog', group: 'Vibration & mechanical', gallery: 1,
    tagline: 'Shakers, low to high force.',
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
    tagline: 'Deep cold, for blades.',
    intro: 'Sub-zero chambers use a cascade water-cooled refrigeration system with a high-efficiency plate heat exchanger. They are used for the sub-zero treatment of razor blades and for heat-treatment applications on automotive components.',
    features: ['Cascade water-cooled refrigeration', 'Vertical sub-zero chambers for automotive components', 'Sub-zero treatment chambers for razor blades'],
    specs: [],
    models: [{ label: 'Models', items: ['ESC150-80-T', 'ESC300-80-T', 'ESC600-80-T', 'ESC950-80-T', 'ESC950-80-F', 'ESC1800-80-F', 'ESC2500-80-F'] }],
    keywords: ['sub zero', 'subzero', 'cryo', 'cryogenic', 'razor', 'razer', 'blade', 'treatment', 'freezing', 'cold', 'heat treatment', 'strip cooler']
  },
  {
    slug: 'solar-pv', name: 'PV Module & Solar Panel Testing', code: 'ET', tier: 'catalog', group: 'Energy & mobility', gallery: 1,
    tagline: 'Damp heat for PV modules.',
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
    tagline: 'Load, at temperature.',
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

// What each series is used for, the test standards it runs, and its options. Standards are the ones this type of chamber is
// built to run; the company confirms the exact list (data-needed sheet, tab 6). Options only where the brochure or a sheet names them.
const extras: Record<string, Pick<Product, 'standards' | 'uses' | 'options'>> = {
  et: {
    uses: ['Automotive electronics: ECUs, sensors, lamps, connectors', 'Defence and aerospace parts, qualified to MIL and IEC climates', 'Consumer electronics and PCBs: cold start, heat soak, damp heat', 'Materials and plastics ageing'],
    standards: ['IEC 60068-2-1 (cold)', 'IEC 60068-2-2 (dry heat)', 'IEC 60068-2-14 (change of temperature)', 'IEC 60068-2-30 (damp heat, cyclic)', 'IEC 60068-2-78 (damp heat, steady)', 'IEC 60068-3-5 (chamber performance)', 'MIL-STD-810 Methods 501, 502, 507'],
    options: ['Faster ramps: 5, 10, 15 or 20 °C per minute', 'Humidity control (40H / 70H)', 'Down to −70 °C (70T / 70H)', 'Extra trays (6 slots on the ET150)', 'Extra access ports', 'Power supply to suit the destination country']
  },
  ets: {
    uses: ['Solder joints and PCB assemblies', 'Semiconductors and electronic modules', 'Automotive and EV components', 'Materials with different expansion rates bonded together'],
    standards: ['IEC 60068-2-14 Test Na (rapid change of temperature)', 'MIL-STD-810 Method 503', 'MIL-STD-883 Method 1010', 'JESD22-A104 (temperature cycling)']
  },
  eta: {
    uses: ['Avionics and aircraft-hold equipment', 'Drones and UAV electronics', 'Batteries shipped by air', 'Defence equipment for high-altitude use'],
    standards: ['MIL-STD-810 Method 500 (low pressure)', 'MIL-STD-810 Method 520 (combined environments)', 'RTCA DO-160 Section 4', 'IEC 60068-2-13 (low air pressure)', 'IEC 60068-2-39 (combined temperature and low pressure)'],
    options: ['Humidity control (H variants)', 'Down to −70 °C (70T models)', 'Faster ramps: 3 to 20 °C per minute', 'Power supply to suit the destination country']
  },
  mini: {
    uses: ['Single components and small assemblies', 'R&D labs and quality checks beside the line', 'Sensors, small PCBs and connectors'],
    standards: ['IEC 60068-2-1 (cold)', 'IEC 60068-2-2 (dry heat)', 'IEC 60068-2-14 (change of temperature)', 'IEC 60068-2-30 (damp heat, cyclic)', 'IEC 60068-2-78 (damp heat, steady)']
  },
  'walk-in': {
    uses: ['Whole vehicles, two-wheelers and large assemblies', 'Battery packs and racks', 'Solar inverters, telecom cabinets and panels', 'Many products tested at once'],
    standards: ['IEC 60068-2-1 (cold)', 'IEC 60068-2-2 (dry heat)', 'IEC 60068-2-30 (damp heat, cyclic)', 'IEC 60068-2-78 (damp heat, steady)', 'MIL-STD-810 Methods 501, 502, 507']
  },
  battery: {
    uses: ['EV cells, modules and packs', 'Energy-storage batteries', 'Consumer lithium-ion cells'],
    standards: ['UN 38.3 T.2 (thermal test)', 'IEC 62133-2', 'IEC 62660-2', 'AIS-156']
  },
  'vibration-chambers': {
    uses: ['Automotive parts under heat, cold and road vibration together', 'Defence and aerospace equipment', 'EV batteries and power electronics'],
    standards: ['IEC 60068-2-6 (sine vibration)', 'IEC 60068-2-64 (random vibration)', 'MIL-STD-810 Method 520 (combined environments)', 'ISO 16750-3']
  },
  rain: {
    uses: ['Automotive lamps, connectors and ECUs', 'Outdoor electronics and enclosures', 'Electrical fittings and luminaires'],
    standards: ['IEC 60529 (IPX1 to IPX8)', 'ISO 20653 (IPX9K)', 'DIN 40050-9']
  },
  'vibration-shakers': {
    uses: ['Automotive components and assemblies', 'Defence and aerospace qualification', 'Packaging and transport testing'],
    standards: ['IEC 60068-2-6 (sine vibration)', 'IEC 60068-2-27 (shock)', 'IEC 60068-2-64 (random vibration)', 'MIL-STD-810 Method 514', 'ISO 16750-3']
  },
  dust: {
    uses: ['Automotive lamps and enclosures', 'Outdoor electronics and enclosures', 'Defence equipment for desert use'],
    standards: ['IEC 60529 (IP5X, IP6X)', 'ISO 20653', 'MIL-STD-810 Method 510']
  },
  'salt-spray': {
    uses: ['Coatings, plating and painted parts', 'Automotive body and chassis parts', 'Fasteners and marine hardware'],
    standards: ['ASTM B117', 'ISO 9227', 'IEC 60068-2-11 (salt mist)', 'IEC 60068-2-52 (salt mist, cyclic)', 'MIL-STD-810 Method 509'],
    options: ['Remote refrigeration unit', 'Vertical down-spray header cycle', 'Immersion cycle for dipping components', 'Wall-wash and SO₂ gas dosing', 'De-humidifier', 'Multi-solution salt spray system', 'Drain treatment unit']
  },
  'solar-pv': {
    uses: ['Solar panels and PV modules', 'Module materials: backsheets, encapsulants, junction boxes'],
    standards: ['IEC 61215-2 MQT 11 (thermal cycling)', 'IEC 61215-2 MQT 12 (humidity freeze)', 'IEC 61215-2 MQT 13 (damp heat)', 'IEC 61730']
  },
  'drop-test': { uses: ['Packaged products and shipping cartons', 'Handheld electronics'], standards: ['IEC 60068-2-31 (rough handling)', 'ISTA 1A', 'ASTM D5276'] },
  'solar-radiation': { uses: ['Automotive interiors and exterior parts', 'Outdoor equipment and materials'], standards: ['IEC 60068-2-5 (solar radiation)', 'MIL-STD-810 Method 505', 'DIN 75220'] },
  uv: { uses: ['Paints, coatings and plastics', 'Outdoor materials and textiles'], standards: ['ISO 4892-3', 'ASTM G154', 'ASTM D4329'] }
}
for (const p of products) Object.assign(p, extras[p.slug])

/** The family a standard belongs to, for the filter: 'IEC 60068-2-14 (cold)' gives 'IEC 60068', 'MIL-STD-810 Method 503' gives 'MIL-STD-810'. */
export const stdFamily = (s: string) => {
  const [a, b = ''] = s.split(' ')
  return /\d/.test(a) ? a : `${a} ${/^\d/.test(b) ? b.split('-')[0] : b}`
}
export const stdFamilies = [...new Set(products.flatMap((p) => (p.standards ?? []).map(stdFamily)))].sort()

/** Questions buyers ask, answered only from what the site already states for this series (no promised lead times or prices). */
export function faqFor(p: Product): [string, string][] {
  const f: [string, string][] = []
  const temp = p.specs.find(([k]) => /temperature/i.test(k))
  if (temp) f.push([`What temperature range does the ${p.name} cover?`, `${temp[1]}. The exact range depends on the model and variant; the technical data and data sheet give it model by model.`])
  if (p.standards?.length) f.push(['Which test standards can it run?', `It is built for tests such as ${p.standards.slice(0, 4).join(', ')}${p.standards.length > 4 ? ' and more' : ''}. Tell us your standard and clause and we will confirm the set-up.`])
  f.push(['Can it be built to a different size or specification?', 'Yes. Standard models come from the express factory; custom sizes, ranges and fixtures are built to your specification by the design team.'])
  f.push(['Can I rent one, or have my product tested instead of buying?', 'Yes. Chambers are available on rent for short tests, and Vistara, our NABL-accredited lab in Peenya, Bengaluru, can run the test for you.'])
  f.push(['Who services and calibrates it after the sale?', 'Envisys does, with engineers across India: calibration, AMCs, refurbishment, and buy-back when it is time to replace it.'])
  f.push(['How quickly can it be delivered?', 'Standard models are kept in stock and shipped fast, across India and abroad. Ask us for the lead time on the model you need.'])
  return f
}

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
      if (w.length > 2 && p.standards?.some((x) => x.toLowerCase().includes(w))) score += 20
      if (w.length > 3 && [...(p.uses ?? []), ...(p.options ?? [])].some((x) => x.toLowerCase().includes(w))) score += 6
    }
    if (score > 0) hits.push({ product: p, score, models: mm.slice(0, 4) })
  }
  return hits.sort((a, b) => b.score - a.score || (a.product.tier === 'main' ? -1 : 1))
}

export const suggestions = ['thermal shock', 'ET950', '-70 °C', 'battery', 'salt spray', 'IPX9K', 'IEC 60068', 'MIL-STD-810']
