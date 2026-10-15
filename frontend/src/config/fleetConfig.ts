/**
 * Swarm / Chamber Matrix Configuration for Phase 3
 * Specifications & Content Model
 * - Kept strictly uniform, clean monochrome styling
 * - Product naming: ET-350, ET-950, EO-1000 with 01, 02, 03 indexing
 * - Spec strip attributes: index, model, volume, tempRange
 * - Benefits array preserved in content data (unused for now)
 */

export interface FleetBenefit {
  label: string
  value: string
}

export interface ChamberUnitConfig {
  order: string           // 01, 02, 03
  model: string           // ET-350, ET-950, EO-1000
  volume: string          // 350L, 950L, [placeholder]
  tempRange: string       // -70°C to +180°C
  title: string
  subtitle: string
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
  benefits: FleetBenefit[]
  chambers: ChamberUnitConfig[]
}

export const defaultFleetConfig: FleetOverviewConfig = {
  titleLine1: 'Understanding the',
  titleLine2: 'Chamber Matrix',
  leadParagraph: 'Fully autonomous environmental simulation matrix that operates and coordinates without human oversight, scaling across fleets to validate mission-critical aerospace, automotive, and defense payloads.',
  benefits: [
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
      model: 'ET-350',
      volume: '350L',
      tempRange: '-70°C to +180°C',
      title: 'Compact Environmental Chamber',
      subtitle: 'ENVIRONMENTAL TEST CHAMBER',
      desc: 'Compact precision simulation chamber engineered for high-frequency thermal cycling and sensor qualification in tight laboratory footprints.',
      spec1: 'HUMIDITY: 10% to 98% RH',
      spec2: 'CONTROLLER: ET-Touch 5.7" HMI',
      defaultAnchor: { x: 20.0, y: 44.0 }
    },
    {
      order: '02',
      model: 'ET-950',
      volume: '950L',
      tempRange: '-70°C to +180°C',
      title: 'Flagship Modular Simulator',
      subtitle: 'ENVIRONMENTAL TEST CHAMBER',
      desc: 'Simulates extreme environmental conditions flawlessly for the next generation of testing. Designed for precision and reliability.',
      spec1: 'HUMIDITY: 10% to 98% RH',
      spec2: 'CONTROLLER: ET-Touch 5.7" HMI',
      defaultAnchor: { x: 50.0, y: 44.0 }
    },
    {
      order: '03',
      model: 'EO-1000',
      volume: '[placeholder]',
      tempRange: '-60°C to +150°C',
      title: 'High-Capacity Walk-In Chamber',
      subtitle: 'HIGH-CAPACITY WALK-IN CHAMBER',
      desc: 'Heavy-capacity walk-in environmental suite designed for large automotive battery assemblies, aerospace structures, and long-duration endurance validation.',
      spec1: 'HUMIDITY: 10% to 98% RH',
      spec2: 'CONTROLLER: ET-Touch 10.4" Multi-Zone HMI',
      defaultAnchor: { x: 80.0, y: 44.0 }
    }
  ]
}
