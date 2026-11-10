/**
 * The full technical file for a series: everything a buyer would otherwise phone for. Shown on its product page under the
 * specification. One entry per series, keyed by the product's slug; series without an entry show the short specification only.
 *
 * Source for 'temperature-forcing': Operating Manual ETFS-40T-1500W-3P-V2 (Envisys). Figures are copied as printed.
 */

export interface Lineup {
  title: string
  cols: string[]
  rows: (string[] | { group: string })[]       // a { group } row is a sub-heading across the table
  notes?: string[]
}

export interface Axis { label: string; unit: string; min: number; max: number; step: number }
export interface Chart { title: string; x: Axis; y: Axis; points: [number, number][]; area?: boolean; note?: string }

/**
 * The specification of a series. Everything is optional beyond the basics: the page shows what is here and lists, as "still to
 * come", only what is missing (see pendingCards). Fill a value in and it appears in its real place and drops off the list; when
 * a card has nothing left it goes, and when nothing is missing the whole block goes.
 */
export interface StudioModel {
  name: string; volume: string; w: number; d: number; h: number     // interior size in mm, as printed
  ext?: string; weight?: string; load?: string; cooling?: string; noise?: string   // per model: external size, weight, connected load, cooling, noise
}
export interface Studio {
  headline: [string, string, string][]
  bars: { label: string; unit: string; min: number; max: number; from: number; to: number; ticks: number[]; ext?: [number, number]; note?: string }[]
  models: StudioModel[]
  common: [string, string][]                                         // true for every model
  space?: string                                                     // what the interior is called ('Interior' by default, e.g. 'Basket' )
  na?: string[]                                                      // data that does not apply to this series (ids from NEEDS), so it is never asked for
  curves?: (Chart & { id: 'pull' | 'heat' | 'uniformity' | 'envelope' | 'ramp' })[]
  extra?: Partial<Record<'door' | 'shelves' | 'ports' | 'utilities' | 'floor' | 'clearance' | 'ambient' | 'heat', string>>
  options?: string[]
  standards?: string[]
  downloads?: { kind: 'drawing' | 'manual' | 'other'; label: string; href: string }[]
}

export interface Detail {
  studio?: Studio
  model?: string                                  // the model the performance figures belong to
  headline?: [string, string, string][]           // the big figures: label, value, unit
  chart?: Chart
  lineup?: Lineup[]                               // the model range, as in the brochure (the Table view of the specification)
  tables?: { title: string; rows: [string, string][]; groups?: { title: string; rows: [string, string][] }[] }[]
  build?: { title: string; points: string[] }[]   // how it is built, one card per subsystem
  notes?: string[]
}

export const details: Record<string, Detail> = {
  'temperature-forcing': {
    model: 'ETFS-40T-1500W-3P-V2',
    headline: [
      ['Temperature range', '−40 to +125', '°C'],
      ['Cooling capability', '1500', 'W at 0 °C'],
      ['With 2-phase cold plate head', '2800', 'W at 0 °C'],
      ['Transition time', '100 – 120', 's'],
      ['Accuracy', '±2.5 to 3', '°C, varies with load'],
      ['Thermal hose', '2 – 2.5', 'm, flexible']
    ],
    chart: {
      title: 'Lowest temperature at the head against heat load',
      x: { label: 'Heat load', unit: 'W', min: 0, max: 1600, step: 200 },
      y: { label: 'Temperature', unit: '°C', min: -70, max: 20, step: 10 },
      points: [[200, -56.2], [400, -47.2], [600, -38.4], [800, -29.9], [1000, -21.4], [1200, -13.9], [1400, -6.3], [1500, -0.8]],
      note: 'Measured on the ETFS 1500 W unit.'
    },
    tables: [
      {
        title: 'Performance',
        rows: [
          ['Temperature, minimum', '−40 °C'],
          ['Temperature, maximum', '125 °C'],
          ['Temperature controller', 'Touchscreen PLC based non-profiling PID controller'],
          ['Temperature accuracy', '±2.5 to 3 °C (varies with the load)'],
          ['Cooling capability', '1500 W at 0 °C (2800 W at 0 °C with the 2-phase cold plate head)'],
          ['Temperature transition time', '100 – 120 s'],
          ['Thermal head', '74 × 64 mm'],
          ['Chip connecting hole pitch', 'To the customer’s size'],
          ['Thermal head flexible hose', '2 – 2.5 m'],
          ['Condenser', 'Water cooled'],
          ['Sensor type', 'T-type thermocouple'],
          ['Communication', 'RS-485'],
          ['Noise', '63 – 68 dB(A)'],
          ['Rated power', '8.5 kW'],
          ['Power cable', '5 m']
        ]
      },
      {
        title: 'Model and size',
        rows: [
          ['Model', 'ETFS-40T-1500W-3P-V2'],
          ['Cooling head size', '74 × 64 mm (L × W)'],
          ['System dimensions', '700 × 900 × 1040 mm (W × D × H)'],
          ['Weight', '200 kg net'],
          ['Height', 'Under 1 m, fits beneath a work table'],
          ['Mobility', 'Four heavy-duty castor wheels']
        ]
      },
      {
        title: 'What your site needs',
        rows: [
          ['Space around the unit', '500 – 600 mm on three sides (not the front)'],
          ['Connected load', '9 kW maximum']
        ],
        groups: [
          { title: 'Electrical', rows: [['Supply', '3 phase, 380 – 480 V AC ±5 %, 50/60 Hz, 4 wire + E'], ['Power', '8 kW'], ['Current', '12 A']] },
          { title: 'Chilled water', rows: [['Connection', '½″ QRC (½″ BSP, ⅝″ 2 – 3 m flexible hose and strainer supplied)'], ['Temperature', '18 – 22 °C'], ['Pressure', '2 – 4 bar'], ['Differential pressure, in v/s out', '1 – 2 bar'], ['Flow rate', '15 – 20 LPM'], ['Water quality', 'Clean, particles under 100 µm, pH 6 – 7']] },
          { title: 'Compressed air (dry)', rows: [['Connection', '8 mm PU connector'], ['Pressure', '1 – 2 bar'], ['Dry air', '0.5 – 0.6 CFM at 2 – 3 bar']] },
          { title: 'Room', rows: [['Ambient temperature', '18 – 25 °C'], ['Ambient humidity', '20 – 80 % RH']] },
          { title: 'Drain', rows: [['Condensate drain', '½″ female BSP, at the rear']] }
        ]
      }
    ],
    build: [
      { title: 'Refrigeration', points: ['Mechanically cascaded, water-cooled refrigeration, maintenance free', 'Two hermetic reciprocating compressors on vibration-isolation mounts', 'Oil separators at the compressor discharge', 'Brazed plate heat exchangers for the water-cooled and cascade condensers', 'Filter driers; PID-controlled solenoid valves', 'Low-GWP refrigerants R-449A and R-508B'] },
      { title: 'Cooling head (2-phase cold plate)', points: ['95 – 97 % copper, chromium plated to a mirror finish for full contact', 'Micro-channel two-phase cold plate, direct to the chip', 'PEEK insulation inside an aluminium enclosure', 'Chip screwed to the front flange; the flange is changed to suit the chip'] },
      { title: 'Heating head', points: ['Same copper head with conduction heaters at the front', '125 – 150 W, 48 V rod heaters for positive temperatures', 'Heaters switched through SSRs by the PID controller'] },
      { title: 'Hose and condensation', points: ['2 – 2.5 m flexible thermal head hose, air-tight sealed', 'All lines insulated with foam and silicone', 'Dry-air purge around the head and suction lines: an air curtain against condensation'] },
      { title: 'Control and data', points: ['4″ HMI, PLC and PID controller working together', 'Chip temperature read over I²C (or the head’s T-type thermocouple)', 'Logs every pressure and temperature', 'Ethernet, RS-485, and remote monitoring through VNC'] },
      { title: 'Safety', points: ['MPCB and MCB protection for every power device', 'Protection against single phasing, phase reversal, under- and over-voltage', 'High and low pressure trips on both compressors', 'Chilled water flow, pressure and temperature watched; supply cut on a leak', 'EMI filters and surge protection'] }
    ],
    notes: ['Two independently controlled stages sit one above the other to keep the footprint small.', 'Service access from three sides; the control panel door opens onto the refrigeration bay.']
  },

  // ───────── from the Envisys brochure (2025): model ranges and construction, as printed ─────────
  mini: {
    studio: {
      headline: [["Temperature", "−60 to 150", "°C"], ["Humidity", "35 to 95", "% RH"], ["Volume", "30 to 100", "L"], ["Formats", "Bench · Floor", ""]],
      bars: [
        {"label": "Temperature", "unit": "°C", "min": -80, "max": 200, "from": -30, "to": 150, "ticks": [-80, -40, 0, 40, 80, 120, 160, 200], "ext": [-60, -30], "note": "Down to −60 °C on the 60T and 60H floor models; the bench models run −30 to 100 °C."},
        {"label": "Humidity", "unit": "% RH", "min": 0, "max": 100, "from": 35, "to": 95, "ticks": [0, 20, 40, 60, 80, 100], "note": "Controlled humidity on the H models."}
      ],
      models: [
        { name: "EM30", volume: "30 L", w: 300, d: 300, h: 350 },
        { name: "EM64", volume: "64 L", w: 400, d: 400, h: 400 },
        { name: "EM80", volume: "80 L", w: 400, d: 400, h: 500 },
        { name: "EM100", volume: "100 L", w: 500, d: 400, h: 500 }
      ],
      common: [["Temperature", "−30 / −60 to 150 °C (bench: −30 to 100 °C)"], ["Humidity", "35 to 95 % RH (H models)"], ["Supply", "Bench: 230 V AC, 1 phase. Floor: 415 V AC, 3 phase. 50/60 Hz, changed to suit the destination country"]]
    },
    lineup: [{
      title: 'EM series, models', cols: ['Model', 'Power supply', 'Temperature', 'Humidity', 'Interior, W × D × H (mm)'],
      rows: [
        { group: 'Bench / desk models' },
        ['EM30-30T-D', '230 V AC, 1 phase, 50/60 Hz', '−30 to 100 °C', '—', '300 × 300 × 350'],
        ['EM64-30T-D', '230 V AC, 1 phase, 50/60 Hz', '−30 to 100 °C', '—', '400 × 400 × 400'],
        { group: 'Floor models' },
        ['EM64-30T', '415 V AC, 3 phase, 50/60 Hz', '−30 to 150 °C', '—', '400 × 400 × 400'],
        ['EM64-30H', '415 V AC, 3 phase, 50/60 Hz', '−30 to 150 °C', '35 to 95 % RH', '400 × 400 × 400'],
        ['EM64-60T', '415 V AC, 3 phase, 50/60 Hz', '−60 to 150 °C', '—', '400 × 400 × 400'],
        ['EM64-60H', '415 V AC, 3 phase, 50/60 Hz', '−60 to 150 °C', '35 to 95 % RH', '400 × 400 × 400'],
        ['EM80-30T', '415 V AC, 3 phase, 50/60 Hz', '−30 to 150 °C', '—', '400 × 400 × 500'],
        ['EM80-30H', '415 V AC, 3 phase, 50/60 Hz', '−30 to 150 °C', '35 to 95 % RH', '400 × 400 × 500'],
        ['EM80-60T', '415 V AC, 3 phase, 50/60 Hz', '−60 to 150 °C', '—', '400 × 400 × 500'],
        ['EM80-60H', '415 V AC, 3 phase, 50/60 Hz', '−60 to 150 °C', '35 to 95 % RH', '400 × 400 × 500'],
        ['EM100-30T', '415 V AC, 3 phase, 50/60 Hz', '−30 to 150 °C', '—', '500 × 400 × 500'],
        ['EM100-30H', '415 V AC, 3 phase, 50/60 Hz', '−30 to 150 °C', '35 to 95 % RH', '500 × 400 × 500'],
        ['EM100-60T', '415 V AC, 3 phase, 50/60 Hz', '−60 to 150 °C', '—', '500 × 400 × 500'],
        ['EM100-60H', '415 V AC, 3 phase, 50/60 Hz', '−60 to 150 °C', '35 to 95 % RH', '500 × 400 × 500']
      ],
      notes: ['Power supply can be customised to the electrical standards of the destination country.']
    }],
    build: [{ title: 'Construction', points: ['Compact mono-block design with easy-access service sections', 'Standard temperature, with optional temperature and humidity ranges', 'Fits on a bench top, or on the optional floor stand', 'Side-mounted control console for comfortable operation'] }]
  },
  et: {
    studio: {
      headline: [['Temperature', '−70 to 180', '°C'], ['Humidity', '10 to 95', '% RH'], ['Volume', '150 to 3000', 'L'], ['Ramp rate', '3 to 20', '°C/min, optional']],
      bars: [
        { label: 'Temperature', unit: '°C', min: -80, max: 200, from: -40, to: 180, ticks: [-80, -40, 0, 40, 80, 120, 160, 200], ext: [-70, -40], note: 'Down to −70 °C on the 70T and 70H variants.' },
        { label: 'Humidity', unit: '% RH', min: 0, max: 100, from: 10, to: 95, ticks: [0, 20, 40, 60, 80, 100], note: 'Controlled humidity on the 40H and 70H variants.' }
      ],
      models: [
        { name: 'ET150', volume: '150 L', w: 550, d: 400, h: 750 },
        { name: 'ET300', volume: '300 L', w: 650, d: 600, h: 800 },
        { name: 'ET600', volume: '600 L', w: 800, d: 850, h: 900 },
        { name: 'ET950', volume: '950 L', w: 1000, d: 1000, h: 950 },
        { name: 'ET1400', volume: '1400 L', w: 1400, d: 1350, h: 950 },
        { name: 'ET3000', volume: '3000 L', w: 1400, d: 1500, h: 1400 }
      ],
      common: [['Temperature', '−40 / −70 to 180 °C'], ['Humidity', '10 to 95 % RH (H variants)'], ['Ramp rate', '3 to 20 °C per minute, optional'], ['Supply', '415 V AC, 3 phase, 50/60 Hz, changed to suit the destination country']]
    },
    lineup: [{
      title: 'ET series, models', cols: ['Model', 'Temperature', 'Humidity', 'Interior, W × D × H (mm)'],
      rows: [
        ['ET150-40T/70T & 40H/70H', '−40 / −70 to 180 °C', '10 to 95 % RH', '550 × 400 × 750'],
        ['ET300-40T/70T & 40H/70H', '−40 / −70 to 180 °C', '10 to 95 % RH', '650 × 600 × 800'],
        ['ET600-40T/70T & 40H/70H', '−40 / −70 to 180 °C', '10 to 95 % RH', '800 × 850 × 900'],
        ['ET950-40T/70T & 40H/70H', '−40 / −70 to 180 °C', '10 to 95 % RH', '1000 × 1000 × 950'],
        ['ET1400-40T/70T & 40H/70H', '−40 / −70 to 180 °C', '10 to 95 % RH', '1400 × 1350 × 950'],
        ['ET3000-40T/70T & 40H/70H', '−40 / −70 to 180 °C', '10 to 95 % RH', '1400 × 1500 × 1400']
      ],
      notes: ['Power supply: 415 V AC, 3 phase, 50/60 Hz, customisable to the destination country.', 'Temperature ramp rates are optional, from 3 °C to 20 °C per minute.']
    }],
    build: [{ title: 'Construction', points: ['Robust block construction with stainless-steel interiors', 'Powder-coated outer panels', 'LED-lit viewing window and durable shelving', 'Double sealing, heavy-duty hinges and locks', 'Through-wall cable ports', 'Laid out around an easy-access control desk'] }]
  },
  'walk-in': {
    studio: {
      headline: [["Temperature", "−65 to 150", "°C"], ["Humidity", "20 to 95", "% RH"], ["Volume", "10,000 to 22,000", "L"], ["Ramp rate", "2 to 5", "°C/min"]],
      bars: [
        {"label": "Temperature", "unit": "°C", "min": -80, "max": 200, "from": -35, "to": 150, "ticks": [-80, -40, 0, 40, 80, 120, 160, 200], "ext": [-65, -35], "note": "Low end −35 or −65 °C, high end 90 or 150 °C, by variant."},
        {"label": "Humidity", "unit": "% RH", "min": 0, "max": 100, "from": 20, "to": 95, "ticks": [0, 20, 40, 60, 80, 100], "note": "Controlled humidity on the H variants."}
      ],
      models: [
        { name: "EWS10K", volume: "10,000 L", w: 2200, d: 2200, h: 2000 },
        { name: "EWS12K", volume: "12,000 L", w: 2200, d: 2200, h: 2400 },
        { name: "EWS14K", volume: "14,000 L", w: 2200, d: 3100, h: 2000 },
        { name: "EWS16K", volume: "16,000 L", w: 2200, d: 3100, h: 2400 },
        { name: "EWS18K", volume: "18,000 L", w: 2200, d: 4100, h: 2000 },
        { name: "EWS22K", volume: "22,000 L", w: 2200, d: 4100, h: 2400 }
      ],
      common: [["Temperature", "−35 / −65 to 90 / 150 °C"], ["Humidity", "20 to 95 % RH (H variants)"], ["Ramp rate", "2 or 5 °C per minute"], ["Supply", "415 V AC, 3 phase, 50/60 Hz, changed to suit the destination country"]]
    },
    lineup: [{
      title: 'EWS series, models', cols: ['Model', 'Temperature', 'Humidity', 'Interior, W × D × H (mm)'],
      rows: [
        ['EWS10K-35T/65T & 35H/65H', '−35 / −65 to 90 / 150 °C', '20 to 95 % RH', '2200 × 2200 × 2000'],
        ['EWS12K-35T/65T & 35H/65H', '−35 / −65 to 90 / 150 °C', '20 to 95 % RH', '2200 × 2200 × 2400'],
        ['EWS14K-35T/65T & 35H/65H', '−35 / −65 to 90 / 150 °C', '20 to 95 % RH', '2200 × 3100 × 2000'],
        ['EWS16K-35T/65T & 35H/65H', '−35 / −65 to 90 / 150 °C', '20 to 95 % RH', '2200 × 3100 × 2400'],
        ['EWS18K-35T/65T & 35H/65H', '−35 / −65 to 90 / 150 °C', '20 to 95 % RH', '2200 × 4100 × 2000'],
        ['EWS22K-35T/65T & 35H/65H', '−35 / −65 to 90 / 150 °C', '20 to 95 % RH', '2200 × 4100 × 2400']
      ],
      notes: ['Custom workspace sizes and temperature ramp rates are built as required, from low sub-zero to higher temperatures.', 'Single-block design (EWS): full temperature and humidity control in a compact, factory-built structure.', 'PUF panel design (EWM): temperature-only testing in a modular, field-assembled room.', 'Ramp rates of 2 °C and 5 °C per minute.', 'Power supply: 415 V AC, 3 phase, 50/60 Hz, customisable to the destination country.']
    }],
    build: [{ title: 'Construction', points: ['Mono-block or pre-fabricated panel construction', 'Integrated or remote refrigeration sections and control panel', 'Water- or air-cooled refrigeration', 'Stainless interiors, view windows and cable ports', 'Robust multi-point door locking'] }]
  },
  ets: {
    studio: {
      headline: [["Temperature", "−70 to 200", "°C"], ["Basket transition", "Under 10", "s"], ["Volume", "50 to 900", "L"], ["Recovery", "Under 5", "min"]],
      bars: [
        {"label": "Temperature", "unit": "°C", "min": -80, "max": 220, "from": -70, "to": 200, "ticks": [-80, -40, 0, 40, 80, 120, 160, 200], "note": "Cold zone to −70 °C, hot zone to 200 °C."}
      ],
      models: [
        { name: "ETS-50", volume: "50 L", w: 500, d: 350, h: 300 },
        { name: "ETS-100", volume: "100 L", w: 500, d: 500, h: 400 },
        { name: "ETS-150", volume: "150 L", w: 600, d: 500, h: 500 },
        { name: "ETS-300", volume: "300 L", w: 800, d: 750, h: 500 },
        { name: "ETS-600", volume: "600 L", w: 900, d: 900, h: 750 },
        { name: "ETS-900", volume: "900 L", w: 1000, d: 1000, h: 900 }
      ],
      common: [["Temperature", "−70 to 200 °C"], ["Basket transition", "Under 10 seconds"], ["Recovery", "Under 5 minutes at 150 °C and −40 °C, subject to conditions"], ["Supply", "415 V AC, 3 phase, 50/60 Hz, changed to suit the destination country"]],
      space: "Each zone",
      na: ["envelope"]
    },
    lineup: [{
      title: 'ETS series, models', cols: ['Model', 'Temperature', 'Basket transition', 'Interior, W × D × H (mm)'],
      rows: [
        ['ETS-50', '−70 to 200 °C', '< 10 s', '500 × 350 × 300'],
        ['ETS-100', '−70 to 200 °C', '< 10 s', '500 × 500 × 400'],
        ['ETS-150', '−70 to 200 °C', '< 10 s', '600 × 500 × 500'],
        ['ETS-300', '−70 to 200 °C', '< 10 s', '800 × 750 × 500'],
        ['ETS-600', '−70 to 200 °C', '< 10 s', '900 × 900 × 750'],
        ['ETS-900', '−70 to 200 °C', '< 10 s', '1000 × 1000 × 900']
      ],
      notes: ['Recovery: under 5 minutes at 150 °C and −40 °C, subject to conditions.', 'Power supply: 415 V AC, 3 phase, 50/60 Hz, customisable to the destination country.']
    }],
    build: [{ title: 'Construction', points: ['Air-to-air and liquid-to-liquid thermal shock', 'Horizontal or vertical basket transfer between independent hot and cold zones', 'Mono-block construction; stainless-steel interiors, CRCS powder-coated exteriors', 'A rigid, stable basket mechanism for repeated cycles', 'Maintenance sections and control desk easy to reach'] }]
  },
  'vibration-chambers': {
    studio: {
      headline: [["Temperature", "−70 to 180", "°C"], ["Humidity", "10 to 95", "% RH"], ["Volume", "150 to 1400", "L"], ["Ramp rate", "3 to 20", "°C/min, optional"]],
      bars: [
        {"label": "Temperature", "unit": "°C", "min": -80, "max": 200, "from": -40, "to": 180, "ticks": [-80, -40, 0, 40, 80, 120, 160, 200], "ext": [-70, -40], "note": "Down to −70 °C on the 70T and 70H variants."},
        {"label": "Humidity", "unit": "% RH", "min": 0, "max": 100, "from": 10, "to": 95, "ticks": [0, 20, 40, 60, 80, 100], "note": "Controlled humidity on the 40H and 70H variants."}
      ],
      models: [
        { name: "ETV150", volume: "150 L", w: 500, d: 400, h: 700 },
        { name: "ETV300", volume: "300 L", w: 650, d: 600, h: 800 },
        { name: "ETV600", volume: "600 L", w: 800, d: 850, h: 900 },
        { name: "ETV950", volume: "950 L", w: 1000, d: 1000, h: 950 },
        { name: "ETV1400", volume: "1400 L", w: 1100, d: 1350, h: 950 }
      ],
      common: [["Temperature", "−40 / −70 to 180 °C"], ["Humidity", "10 to 95 % RH (H variants)"], ["Vibration", "Shaker interface, 3-axis, to the customer’s specification"], ["Supply", "415 V AC, 3 phase, 50/60 Hz, changed to suit the destination country"]]
    },
    lineup: [{
      title: 'ETV series, models', cols: ['Model', 'Temperature', 'Humidity', 'Interior, W × D × H (mm)'],
      rows: [
        ['ETV150-40T/70T 40H/70H', '−40 / −70 to 180 °C', '10 to 95 % RH', '500 × 400 × 700'],
        ['ETV300-40T/70T 40H/70H', '−40 / −70 to 180 °C', '10 to 95 % RH', '650 × 600 × 800'],
        ['ETV600-40T/70T 40H/70H', '−40 / −70 to 180 °C', '10 to 95 % RH', '800 × 850 × 900'],
        ['ETV950-40T/70T 40H/70H', '−40 / −70 to 180 °C', '10 to 95 % RH', '1000 × 1000 × 950'],
        ['ETV1400-40T/70T 40H/70H', '−40 / −70 to 180 °C', '10 to 95 % RH', '1100 × 1350 × 950']
      ],
      notes: ['Temperature ramp rates are optional, from 3 °C to 20 °C per minute.', 'Power supply: 415 V AC, 3 phase, 50/60 Hz, customisable to the destination country.']
    }],
    build: [{ title: 'Construction', points: ['Environmental chamber with a vibration shaker interface and HMI / PC-PLC control', 'Temperature, optional humidity, and 3-axis vibration to the customer’s specification', 'Interchangeable hood and interface that link shaker and chamber securely', 'Scissor-lift vertical motion on a hydraulic power pack', 'Horizontal positioning on castors with guide rails and a geared drive'] }]
  },
  'salt-spray': {
    studio: {
      headline: [["Temperature", "Ambient to 50", "°C"], ["Volume", "100 to 1500", "L"], ["Humidity", "Optional", ""], ["Types", "Basic · Cyclic", ""]],
      bars: [],
      models: [
        { name: "EMS-100", volume: "100 L", w: 600, d: 500, h: 400 },
        { name: "EBS/ECS 300", volume: "300 L", w: 850, d: 550, h: 650 },
        { name: "EBS/ECS 600", volume: "600 L", w: 900, d: 800, h: 850 },
        { name: "EBS/ECS 900", volume: "900 L", w: 1350, d: 800, h: 850 },
        { name: "EBS/ECS 1500", volume: "1500 L", w: 1500, d: 1000, h: 1000 }
      ],
      common: [["Temperature", "Ambient to 50 °C"], ["Humidity", "Optional"], ["Supply", "EMS-100: 415 V AC, 1 phase. EBS/ECS: 415 V AC, 3 phase. 50/60 Hz, changed to suit the destination country"]],
      na: ["pull", "heat", "uniformity", "envelope", "ramp"]
    },
    lineup: [{
      title: 'Salt spray chambers, models', cols: ['Model', 'Power supply', 'Temperature', 'Humidity', 'Interior, W × D × H (mm)'],
      rows: [
        { group: 'EMS series, mini salt spray' },
        ['EMS-100', '415 V AC, 1 phase, 50/60 Hz', 'Ambient to 50 °C', 'Optional', '600 × 500 × 400'],
        { group: 'EBS / ECS series' },
        ['EBS/ECS 300', '415 V AC, 3 phase, 50/60 Hz', 'Ambient to 50 °C', 'Optional', '850 × 550 × 650'],
        ['EBS/ECS 600', '415 V AC, 3 phase, 50/60 Hz', 'Ambient to 50 °C', 'Optional', '900 × 800 × 850'],
        ['EBS/ECS 900', '415 V AC, 3 phase, 50/60 Hz', 'Ambient to 50 °C', 'Optional', '1350 × 800 × 850'],
        ['EBS/ECS 1500', '415 V AC, 3 phase, 50/60 Hz', 'Ambient to 50 °C', 'Optional', '1500 × 1000 × 1000']
      ],
      notes: ['EBS is the basic chamber; ECS runs cyclic corrosion tests.', 'ECS options: remote refrigeration unit, vertical down-spray header cycle, immersion cycle for dipping components, wall-wash and SO₂ gas dosing, de-humidifier, multi-solution salt spray system, drain treatment unit.', 'Power supply can be customised to the destination country.']
    }],
    build: [{ title: 'Construction', points: ['Corrosion-resistant glass-fibre reinforced enclosure with a sealed viewing window', 'Atomiser tower and brine tank arranged for uniform fog and minimal condensate on specimens', 'Air-saturator, heaters, blower and spray header mounted for easy service'] }]
  },
  rain: {
    lineup: [{
      title: 'Ingress protection tests', cols: ['IP code', 'What it simulates'],
      rows: [
        ['IPX1 – IPX2', 'Vertical and tilted dripping water'],
        ['IPX3 – IPX4', 'Spraying and splashing water'],
        ['IPX5 – IPX6', 'High-pressure water jets'],
        ['IPX7 – IPX8', 'Temporary and continuous immersion'],
        ['IPX9K', 'High-temperature, high-pressure water jets (steam jet)']
      ],
      notes: ['Variety I: pre-set programmable timer with individual subsystems, a single-set-point PID controller for IPX tests, and manual by-pass valves to set flow and pressure for each nozzle.', 'Variety II: a touchscreen, fully programmable controller to create, run and monitor multi-step rain profiles, with live pressure, flow rate and duration.']
    }],
    build: [{ title: 'Construction', points: ['Corrosion-resistant, water-tight test enclosure', 'Integrated drip and spray manifolds, rotating table options', 'Full-view glass door with wiper', 'Pumps and flow control outside the test space for easy maintenance', 'Immersion fixtures for dip tests where required'] }]
  },
  dust: {
    studio: {
      headline: [["Temperature", "Ambient to 50", "°C"], ["Volume", "1000 to 3375", "L"], ["Test", "IP6X dust", ""], ["Air", "Negative pressure", ""]],
      bars: [],
      models: [
        { name: "EDC 1000", volume: "1000 L", w: 1000, d: 1000, h: 1000 },
        { name: "EDC 1500", volume: "1500 L", w: 1500, d: 1000, h: 1000 },
        { name: "EDC 3375", volume: "3375 L", w: 1500, d: 1500, h: 1500 }
      ],
      common: [["Temperature", "Ambient to 50 °C"], ["Dust circulation", "Centrifugal blower with pre-heating and hopper re-vibration"], ["Supply", "415 V AC, 3 phase, 50/60 Hz, changed to suit the destination country"]],
      na: ["pull", "heat", "uniformity", "envelope", "ramp"]
    },
    lineup: [{
      title: 'EDC series, models', cols: ['Model', 'Temperature', 'Interior, W × D × H (mm)'],
      rows: [['EDC 1000', 'Ambient to 50 °C', '1000 × 1000 × 1000'], ['EDC 1500', 'Ambient to 50 °C', '1500 × 1000 × 1000'], ['EDC 3375', 'Ambient to 50 °C', '1500 × 1500 × 1500']],
      notes: ['Power supply: 415 V AC, 3 phase, 50/60 Hz, customisable to the destination country.']
    }],
    build: [{ title: 'Construction', points: ['Free-flow dust circulation on a centrifugal blower, with pre-heating and hopper re-vibration', 'Blower speed control for uniform floating dust', 'Oil-free vacuum system for the negative pressure of IP6X tests', 'Stainless-steel test enclosure with a viewing window'] }]
  },
  eta: {
    studio: {
      headline: [["Temperature", "−70 to 180", "°C"], ["Humidity", "10 to 95", "% RH"], ["Altitude", "Down to 10", "mbar"], ["Volume", "300 to 1400", "L"]],
      bars: [
        {"label": "Temperature", "unit": "°C", "min": -80, "max": 200, "from": -40, "to": 180, "ticks": [-80, -40, 0, 40, 80, 120, 160, 200], "ext": [-70, -40], "note": "Down to −70 °C on the 70T and 70H variants."},
        {"label": "Humidity", "unit": "% RH", "min": 0, "max": 100, "from": 10, "to": 95, "ticks": [0, 20, 40, 60, 80, 100], "note": "Controlled humidity on the 40H and 70H variants."},
        {"label": "Pressure", "unit": "mbar", "min": 0, "max": 1000, "from": 10, "to": 1000, "ticks": [0, 200, 400, 600, 800, 1000], "note": "Altitude simulation down to 10 mbar."}
      ],
      models: [
        { name: "EA300", volume: "300 L", w: 650, d: 600, h: 800 },
        { name: "EA600", volume: "600 L", w: 800, d: 850, h: 900 },
        { name: "EA950", volume: "950 L", w: 1000, d: 1000, h: 950 },
        { name: "EA1400", volume: "1400 L", w: 1100, d: 1350, h: 950 }
      ],
      common: [["Temperature", "−40 / −70 to 180 °C"], ["Humidity", "10 to 95 % RH (H variants)"], ["Altitude", "Down to 10 mbar"], ["Supply", "415 V AC, 3 phase, 50/60 Hz, changed to suit the destination country"]]
    },
    lineup: [{
      title: 'EA series, models', cols: ['Model', 'Temperature', 'Humidity', 'Interior, W × D × H (mm)'],
      rows: [
        ['EA300-40T/70T 40H/70H', '−40 / −70 to 180 °C', '10 to 95 % RH', '650 × 600 × 800'],
        ['EA600-40T/70T 40H/70H', '−40 / −70 to 180 °C', '10 to 95 % RH', '800 × 850 × 900'],
        ['EA950-40T/70T 40H/70H', '−40 / −70 to 180 °C', '10 to 95 % RH', '1000 × 1000 × 950'],
        ['EA1400-40T/70T 40H/70H', '−40 / −70 to 180 °C', '10 to 95 % RH', '1100 × 1350 × 950']
      ],
      notes: ['Altitude down to 10 mbar.', 'Temperature ramp rates are optional, from 3 °C to 20 °C per minute.', 'Power supply: 415 V AC, 3 phase, 50/60 Hz, customisable to the destination country.']
    }],
    build: [{ title: 'Construction', points: ['Combined altitude, temperature and humidity (CATH) in a single test space', 'Mono-block construction with vacuum-tight stainless-steel interiors', 'Robust door locking and silicone-rubber sealing', 'Integrated feed-through connectors; humidity bypass and butterfly valves', 'Direct-coupled multi-vane rotary vacuum pump for stable pressure'] }]
  },
  battery: {
    lineup: [{
      title: 'ETB series, models', cols: ['Model', 'Temperature', 'Humidity'],
      rows: [['ETB150', '−40 / −70 to 180 °C', '10 to 95 % RH'], ['ETB300', '−40 / −70 to 180 °C', '10 to 95 % RH'], ['ETB600', '−40 / −70 to 180 °C', '10 to 95 % RH'], ['ETB950', '−40 / −70 to 180 °C', '10 to 95 % RH'], ['ETB1400', '−40 / −70 to 180 °C', '10 to 95 % RH']],
      notes: ['Temperature ramp rates are optional, from 3 °C to 20 °C per minute.', 'Power supply: 415 V AC, 3 phase, 50/60 Hz, customisable to the destination country.']
    }],
    build: [{ title: 'Safety built in', points: ['Reinforced environmental enclosure', 'Integrated CO₂ fire-suppression system', 'Automatic air-exchange system', 'Mechanical door locking and a fire-extinguisher interface', 'Pressure-relief port; gas-based fire detection and alarm', 'Status indication and a dedicated temperature safety controller, to contain thermal runaway'] }]
  },
  chillers: {
    lineup: [{
      title: 'ETC series, models', cols: ['Model', 'Capacity (standard)', 'Water flow (LPM)', 'Pressure (bar)'],
      rows: [['ETC5', '5 TR (1 circuit)', '100', '3 – 4'], ['ETC7.5', '7.5 TR (1 circuit)', '150', '3 – 4'], ['ETC10', '10 TR (1 or 2 circuits)', '200', '3 – 4'], ['ETC15', '15 TR (1 or 2 circuits)', '300', '3 – 4'], ['ETC20', '20 TR (1 circuit)', '400', '3 – 4'], ['ETC25', '25 TR (2 circuits)', '500', '3 – 4'], ['ETC30', '30 TR (2 circuits)', '600', '3 – 4'], ['ETC40', '40 TR (2 circuits)', '800', '3 – 4'], ['ETC50', '50 TR (2 circuits)', '1000', '3 – 4'], ['ETC60', '60 TR (2 circuits)', '1200', '3 – 4']],
      notes: ['Needs an ambient temperature of 15 °C ± 5 °C and a 415 V, 3 phase, 50 Hz supply.']
    }],
    build: [{ title: 'Construction', points: ['Hermetic scroll or reciprocating compressors', 'Finned-coil condensers with copper tubes and aluminium fins', 'Axial fans with die-cast aluminium blades', 'BPHE evaporators', 'Integrated storage tank with level sensors', 'Pressure switches, gauges and a compressor crankcase heater'] }]
  },
  'sub-zero': {
    tables: [{ title: 'Strip cooling', rows: [['Temperature limits', 'Ambient to −80 °C'], ['Strip passes', '2 or 4'], ['Strip slot dimensions', '50 × 15 mm'], ['Strip slot to slot', '12 mm'], ['Ground to strip pass height', '700 mm'], ['Maximum speed', '70 ft/min'], ['Suitable for', 'Thickness 0.4 mm, width up to 15 mm']] }],
    lineup: [{
      title: 'ESC series, models', cols: ['Model', 'Load', 'Temperature'],
      rows: [['ESC150-80-T', '25 kg/hr', 'Ambient to −80 °C'], ['ESC300-80-T', '95 kg/hr', 'Ambient to −80 °C'], ['ESC600-80-T', '125 kg/hr', 'Ambient to −80 °C'], ['ESC950-80-T', '250 kg/hr', 'Ambient to −80 °C'], ['ESC950-80-F', '250 kg/hr', 'Ambient to −80 °C'], ['ESC1800-80-F', '275 kg/hr', 'Ambient to −80 °C'], ['ESC2500-80-F', '300 kg/hr', 'Ambient to −80 °C']],
      notes: ['Power supply: 415 V AC, 3 phase, 50/60 Hz, customisable to the destination country.']
    }],
    build: [{ title: 'Construction', points: ['Strip-cooled deep freezers for sub-zero treatment of razor blades and automotive parts', 'Solid aluminium block heat exchanger with a circulation coil and brass strips', 'Glycol-based refrigerant system for uniform sub-zero conditioning', 'Two-channel digital set-point PID controllers: strip cooling and chamber set separately'] }]
  },
  'ovens-dryers': {
    studio: {
      headline: [["Oven temperature", "Up to 250", "°C"], ["Dryer temperature", "Up to 150", "°C"], ["Oven volume", "150 to 1400", "L"], ["Dryer trays", "12 to 192", ""]],
      bars: [],
      models: [
        { name: "EO150", volume: "150 L", w: 550, d: 400, h: 700 },
        { name: "EO300", volume: "300 L", w: 650, d: 600, h: 800 },
        { name: "EO600", volume: "600 L", w: 800, d: 850, h: 900 },
        { name: "EO950", volume: "950 L", w: 1000, d: 1000, h: 950 },
        { name: "EO1400", volume: "1400 L", w: 1100, d: 1350, h: 950 }
      ],
      common: [["Oven temperature", "Up to 250 °C"], ["Dryer temperature", "Up to 150 °C (see the dryers in the full table)"], ["Supply", "415 V AC, 3 phase, 50/60 Hz, changed to suit the destination country"]],
      space: "Oven interior",
      na: ["envelope"]
    },
    lineup: [
      { title: 'EO series industrial ovens', cols: ['Model', 'Inner size (mm)'], rows: [['EO150-250T', '550 × 400 × 700'], ['EO300-250T', '650 × 600 × 800'], ['EO600-250T', '800 × 850 × 900'], ['EO950-250T', '1000 × 1000 × 950'], ['EO1400-250T', '1100 × 1350 × 950']], notes: ['Up to 250 °C.'] },
      { title: 'ETD series industrial dryers', cols: ['Model', 'Trays', 'Inner size (mm)', 'Trolleys'], rows: [['ETD12-150T', '12', '840 × 460 × 920', '—'], ['ETD24-150T', '24', '840 × 920 × 920', '1'], ['ETD48-150T', '48', '1020 × 920 × 1830', '1'], ['ETD96-150T', '96', '2040 × 920 × 1830', '2'], ['ETD192-150T', '192', '2040 × 1830 × 1830', '4']], notes: ['Up to 150 °C.', 'Power supply: 415 V AC, 3 phase, 50/60 Hz, customisable to the destination country.'] }
    ],
    build: [{ title: 'Built for', points: ['Curing, heat processing, ageing and annealing', 'Uniform temperature distribution and process stability', 'Energy efficiency; multiple capacities, customised to the process'] }]
  },
  'e-motor': { tables: [{ title: 'Key figures', rows: [['Motor power', '10 kW to 200 kW'], ['Refrigeration', 'Common water-cooled remote unit'], ['Air delivery', 'Conditioned air through insulated flexible ducts'], ['Set-up', 'Standalone environmental chamber, several test volumes']] }] },
  'drop-test': { tables: [{ title: 'Key figures', rows: [['Drop height', 'Adjustable, up to 1800 mm'], ['Load capacity', 'Up to 80 kg'], ['Height adjustment', 'Motorised, by gear motor'], ['Test', 'Controlled free fall, quick specimen handling']] }] },
  vacuum: { tables: [{ title: 'Key figures', rows: [['Temperature', '50 °C to 120 °C'], ['Vacuum', 'Down to 1 × 10⁻⁶ Torr'], ['Purpose', 'Reduce material outgassing under controlled heat and ultra-low pressure']] }] },
  'vibration-shakers': { tables: [{ title: 'Key figures', rows: [['Air-cooled models', '600 kgf to 6,000 kgf'], ['Water-cooled models', '7,000 kgf to 20,000 kgf'], ['Tests', 'Sinusoidal, random and shock vibration']] }] }
}

/** Everything a buyer might want on a chamber's page, by topic. `id` is what a series can mark not-applicable with `na`.
 *  `must` marks the essentials: only those are asked for on the page and in the company's checklist; the others still appear if supplied. */
export const NEEDS: { card: string; id: string; label: string; must: boolean; done: (s: Studio) => boolean }[] = [
  { card: 'Performance curves', id: 'pull', must: true, label: 'Pull-down time, +20 °C to the lowest temperature, per model', done: (s) => !!s.curves?.some((c) => c.id === 'pull') },
  { card: 'Performance curves', id: 'heat', must: true, label: 'Heat-up time, +20 °C to the highest temperature, per model', done: (s) => !!s.curves?.some((c) => c.id === 'heat') },
  { card: 'Performance curves', id: 'uniformity', must: false, label: 'Temperature uniformity and fluctuation, in °C', done: (s) => !!s.curves?.some((c) => c.id === 'uniformity') },
  { card: 'Performance curves', id: 'envelope', must: true, label: 'Humidity operating envelope (temperature against % RH), as a chart', done: (s) => !!s.curves?.some((c) => c.id === 'envelope') },
  { card: 'Performance curves', id: 'ramp', must: false, label: 'Ramp rate against load, as a chart', done: (s) => !!s.curves?.some((c) => c.id === 'ramp') },
  { card: 'Dimensions and weight', id: 'ext', must: true, label: 'External size, W × D × H, per model', done: (s) => s.models.every((m) => !!m.ext) },
  { card: 'Dimensions and weight', id: 'weight', must: true, label: 'Net weight, per model', done: (s) => s.models.every((m) => !!m.weight) },
  { card: 'Dimensions and weight', id: 'door', must: false, label: 'Door opening size and swing', done: (s) => !!s.extra?.door },
  { card: 'Dimensions and weight', id: 'shelves', must: false, label: 'Number of shelves and the load each takes', done: (s) => !!s.extra?.shelves },
  { card: 'Dimensions and weight', id: 'ports', must: false, label: 'Cable port size and position', done: (s) => !!s.extra?.ports },
  { card: 'Power and utilities', id: 'load', must: true, label: 'Connected load (kW) and running current (A), per model', done: (s) => s.models.every((m) => !!m.load) },
  { card: 'Power and utilities', id: 'cooling', must: true, label: 'Cooling: air or water, and the water flow and temperature', done: (s) => s.models.every((m) => !!m.cooling) },
  { card: 'Power and utilities', id: 'utilities', must: false, label: 'Drain, water-feed and air connections', done: (s) => !!s.extra?.utilities },
  { card: 'Power and utilities', id: 'floor', must: false, label: 'Floor loading', done: (s) => !!s.extra?.floor },
  { card: 'Site and noise', id: 'clearance', must: false, label: 'Clearance needed on each side', done: (s) => !!s.extra?.clearance },
  { card: 'Site and noise', id: 'ambient', must: false, label: 'Ambient temperature limits', done: (s) => !!s.extra?.ambient },
  { card: 'Site and noise', id: 'noise', must: false, label: 'Noise, in dB(A), per model', done: (s) => s.models.every((m) => !!m.noise) },
  { card: 'Site and noise', id: 'roomheat', must: false, label: 'Heat given off to the room (kW)', done: (s) => !!s.extra?.heat },
  { card: 'Options and accessories', id: 'options', must: true, label: 'Every option, with its name and what it adds', done: (s) => !!s.options?.length },
  { card: 'Standards and downloads', id: 'standards', must: true, label: 'The standards the chamber is tested to, and any certificates held', done: (s) => !!s.standards?.length },
  { card: 'Standards and downloads', id: 'drawing', must: true, label: 'Dimension drawing: front, side and top (PDF or DWG)', done: (s) => !!s.downloads?.some((d) => d.kind === 'drawing') },
  { card: 'Standards and downloads', id: 'manual', must: true, label: 'Operating manual (PDF)', done: (s) => !!s.downloads?.some((d) => d.kind === 'manual') }
]

/** What is still missing for a series, as cards: only the items not yet filled in and not marked not-applicable. */
export function pendingCards(s: Studio): { title: string; items: { id: string; label: string }[] }[] {
  const out: { title: string; items: { id: string; label: string }[] }[] = []
  for (const n of NEEDS) {
    if (!n.must || n.done(s) || s.na?.includes(n.id)) continue
    let c = out.find((x) => x.title === n.card)
    if (!c) out.push((c = { title: n.card, items: [] }))
    c.items.push({ id: n.id, label: n.label })
  }
  return out
}

/** The per-model rows of the data panel: shown with their value, or "To come" when the model has none yet. */
export const PER_MODEL: { key: keyof StudioModel; label: string; must: boolean }[] = [
  { key: 'ext', label: 'External size (W × D × H)', must: true },
  { key: 'weight', label: 'Net weight', must: true },
  { key: 'load', label: 'Connected load', must: true },
  { key: 'cooling', label: 'Cooling', must: true },
  { key: 'noise', label: 'Noise', must: false }
]
