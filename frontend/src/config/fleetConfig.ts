/**
 * Swarm / Chamber Matrix Configuration for Phase 3
 * Exact match to user reference aesthetic:
 * - Pure monochrome tactical white/grey aesthetic
 * - Clean white box badges: DSA012, DSA011, DSA013
 * - Transparent right-side specification layout with thin horizontal rules
 * - Detail modal content for Image 1
 */

export interface FleetSpecRow {
  label: string
  value: string
}

export interface ChamberUnitConfig {
  order: string           // 01, 02, 03
  badgeId: string         // DSA012, DSA011, DSA013
  model: string           // ET-350, ET-950, EO-1000
  title: string
  subtitle: string
  tempRange: string
  desc: string
  spec1: string
  spec2: string
  defaultAnchor: {
    x: number
    y: number
  }
}

export interface FleetOverviewConfig {
  titleLine1: string
  titleLine2: string
  leadParagraph: string
  specs: FleetSpecRow[]
  chambers: ChamberUnitConfig[]
}

export const defaultFleetConfig: FleetOverviewConfig = {
  titleLine1: 'Understanding the',
  titleLine2: 'Chamber Matrix',
  leadParagraph: 'Fully autonomous environmental simulation matrix that operates and coordinates without human oversight, scaling across fleets to validate mission-critical aerospace, automotive, and defense payloads.',
  specs: [
    {
      label: 'Autonomy',
      value: 'Truly autonomous end-to-end multi-chamber operation'
    },
    {
      label: 'Scalability',
      value: 'Designed to scale across modular chamber volumes'
    },
    {
      label: 'Collaboration',
      value: 'Cooperative multi-unit coordination in real time'
    },
    {
      label: 'Coverage',
      value: 'Simultaneous monitoring of extreme -70°C to +180°C spectra'
    }
  ],
  chambers: [
    {
      order: '01',
      badgeId: 'DSA012',
      model: 'ET-350',
      title: 'Compact Environmental Chamber',
      subtitle: 'ENVIRONMENTAL TEST CHAMBER',
      tempRange: '-70°C to +180°C',
      desc: 'Compact precision simulation chamber engineered for high-frequency thermal cycling and sensor qualification in tight laboratory footprints.',
      spec1: 'HUMIDITY: 10% to 98% RH',
      spec2: 'CONTROLLER: ET-Touch 5.7" HMI',
      defaultAnchor: { x: 17.5, y: 55.0 }
    },
    {
      order: '02',
      badgeId: 'DSA011',
      model: 'ET-950',
      title: 'Flagship Modular Simulator',
      subtitle: 'ENVIRONMENTAL TEST CHAMBER',
      tempRange: '-70°C to +180°C',
      desc: 'Simulates extreme environmental conditions flawlessly for the next generation of testing. Designed for precision and reliability.',
      spec1: 'HUMIDITY: 10% to 98% RH',
      spec2: 'CONTROLLER: ET-Touch 5.7" HMI',
      defaultAnchor: { x: 49.5, y: 47.0 }
    },
    {
      order: '03',
      badgeId: 'DSA013',
      model: 'EO-1000',
      title: 'High-Capacity Walk-In Chamber',
      subtitle: 'HIGH-CAPACITY WALK-IN CHAMBER',
      tempRange: '-60°C to +150°C',
      desc: 'Heavy-capacity walk-in environmental suite designed for large automotive battery assemblies, aerospace structures, and long-duration endurance validation.',
      spec1: 'HUMIDITY: 10% to 98% RH',
      spec2: 'CONTROLLER: ET-Touch 10.4" Multi-Zone HMI',
      defaultAnchor: { x: 79.5, y: 40.0 }
    }
  ]
}
