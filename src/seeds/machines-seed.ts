/**
 * Machine Definitions Seed Data
 * For machine-based search (Method 1)
 */

export interface MachineSeedData {
  brand: string
  type: string
  model: string
  series?: string
  frame?: 'small' | 'standard' | 'large'
  engine?: string
  yearFrom?: number
  yearTo?: number
  weight?: number // tons
  serialNumberRange?: string
  description?: string
}

export const MACHINES_SEED: MachineSeedData[] = [
  // ============================================================================
  // CAT (Caterpillar)
  // ============================================================================
  
  // Mini Excavators
  {
    brand: 'CAT',
    type: 'mini-excavator',
    model: '301.7D',
    series: 'D',
    frame: 'small',
    engine: 'Yanmar',
    yearFrom: 2015,
    yearTo: 2024,
    weight: 1.7,
    description: 'Mini koparka CAT 301.7D',
  },
  {
    brand: 'CAT',
    type: 'mini-excavator',
    model: '305.5E2',
    series: 'E2',
    frame: 'small',
    engine: 'Perkins',
    yearFrom: 2018,
    yearTo: 2024,
    weight: 5.5,
    description: 'Mini koparka CAT 305.5E2',
  },
  {
    brand: 'CAT',
    type: 'mini-excavator',
    model: '308E2',
    series: 'E2',
    frame: 'small',
    engine: 'Perkins',
    yearFrom: 2017,
    yearTo: 2024,
    weight: 8.2,
    description: 'Mini koparka CAT 308E2',
  },

  // Standard Excavators
  {
    brand: 'CAT',
    type: 'excavator',
    model: '320D',
    series: 'D',
    frame: 'standard',
    engine: 'Caterpillar C6.4',
    yearFrom: 2005,
    yearTo: 2015,
    weight: 20,
    serialNumberRange: 'RNP1-UP',
    description: 'Koparka CAT 320D - najpopularniejszy model',
  },
  {
    brand: 'CAT',
    type: 'excavator',
    model: '320E',
    series: 'E',
    frame: 'standard',
    engine: 'Caterpillar C4.4',
    yearFrom: 2015,
    yearTo: 2020,
    weight: 21,
    description: 'Koparka CAT 320E',
  },
  {
    brand: 'CAT',
    type: 'excavator',
    model: '320F',
    series: 'F',
    frame: 'standard',
    engine: 'Caterpillar C4.4',
    yearFrom: 2020,
    yearTo: 2024,
    weight: 21.5,
    description: 'Koparka CAT 320F - najnowsza generacja',
  },
  {
    brand: 'CAT',
    type: 'excavator',
    model: '325D',
    series: 'D',
    frame: 'standard',
    engine: 'Caterpillar C7',
    yearFrom: 2007,
    yearTo: 2015,
    weight: 25,
    description: 'Koparka CAT 325D',
  },
  {
    brand: 'CAT',
    type: 'excavator',
    model: '330D',
    series: 'D',
    frame: 'standard',
    engine: 'Caterpillar C9',
    yearFrom: 2006,
    yearTo: 2015,
    weight: 30,
    description: 'Koparka CAT 330D',
  },

  // Large Excavators
  {
    brand: 'CAT',
    type: 'excavator',
    model: '390F',
    series: 'F',
    frame: 'large',
    engine: 'Caterpillar C15',
    yearFrom: 2020,
    yearTo: 2024,
    weight: 90,
    description: 'Duża koparka CAT 390F',
  },

  // Wheel Loaders
  {
    brand: 'CAT',
    type: 'loader',
    model: '950M',
    series: 'M',
    frame: 'standard',
    engine: 'Caterpillar C7.1',
    yearFrom: 2014,
    yearTo: 2024,
    weight: 17,
    description: 'Ładowarka kołowa CAT 950M',
  },
  {
    brand: 'CAT',
    type: 'loader',
    model: '966M',
    series: 'M',
    frame: 'standard',
    engine: 'Caterpillar C9.3',
    yearFrom: 2014,
    yearTo: 2024,
    weight: 23,
    description: 'Ładowarka kołowa CAT 966M',
  },

  // Dozers
  {
    brand: 'CAT',
    type: 'dozer',
    model: 'D6T',
    series: 'T',
    frame: 'standard',
    engine: 'Caterpillar C9',
    yearFrom: 2007,
    yearTo: 2018,
    weight: 18,
    description: 'Spychacz CAT D6T',
  },

  // ============================================================================
  // KOMATSU
  // ============================================================================

  // Mini Excavators
  {
    brand: 'Komatsu',
    type: 'mini-excavator',
    model: 'PC50MR-5',
    series: '5',
    frame: 'small',
    engine: 'Komatsu 4D88E',
    yearFrom: 2018,
    yearTo: 2024,
    weight: 5.2,
    description: 'Mini koparka Komatsu PC50MR-5',
  },

  // Standard Excavators
  {
    brand: 'Komatsu',
    type: 'excavator',
    model: 'PC200-8',
    series: '8',
    frame: 'standard',
    engine: 'Komatsu SAA6D107E',
    yearFrom: 2010,
    yearTo: 2016,
    weight: 20,
    description: 'Koparka Komatsu PC200-8',
  },
  {
    brand: 'Komatsu',
    type: 'excavator',
    model: 'PC210-11',
    series: '11',
    frame: 'standard',
    engine: 'Komatsu SAA6D107E',
    yearFrom: 2020,
    yearTo: 2024,
    weight: 21,
    description: 'Koparka Komatsu PC210-11 - najnowsza generacja',
  },
  {
    brand: 'Komatsu',
    type: 'excavator',
    model: 'PC290-11',
    series: '11',
    frame: 'standard',
    engine: 'Komatsu SAA6D114E',
    yearFrom: 2020,
    yearTo: 2024,
    weight: 29,
    description: 'Koparka Komatsu PC290-11',
  },

  // Large Excavators
  {
    brand: 'Komatsu',
    type: 'excavator',
    model: 'PC390-11',
    series: '11',
    frame: 'large',
    engine: 'Komatsu SAA6D125E',
    yearFrom: 2020,
    yearTo: 2024,
    weight: 39,
    description: 'Duża koparka Komatsu PC390-11',
  },

  // Wheel Loaders
  {
    brand: 'Komatsu',
    type: 'loader',
    model: 'WA320-8',
    series: '8',
    frame: 'standard',
    engine: 'Komatsu SAA4D107E',
    yearFrom: 2018,
    yearTo: 2024,
    weight: 12,
    description: 'Ładowarka kołowa Komatsu WA320-8',
  },
  {
    brand: 'Komatsu',
    type: 'loader',
    model: 'WA470-8',
    series: '8',
    frame: 'standard',
    engine: 'Komatsu SAA6D114E',
    yearFrom: 2018,
    yearTo: 2024,
    weight: 18,
    description: 'Ładowarka kołowa Komatsu WA470-8',
  },

  // Dozers
  {
    brand: 'Komatsu',
    type: 'dozer',
    model: 'D65PX-18',
    series: '18',
    frame: 'standard',
    engine: 'Komatsu SAA6D114E',
    yearFrom: 2018,
    yearTo: 2024,
    weight: 20,
    description: 'Spychacz Komatsu D65PX-18',
  },

  // ============================================================================
  // HITACHI (now Zaxis)
  // ============================================================================

  // Mini Excavators
  {
    brand: 'Hitachi',
    type: 'mini-excavator',
    model: 'ZX55U-5',
    series: '5',
    frame: 'small',
    engine: 'Yanmar',
    yearFrom: 2015,
    yearTo: 2024,
    weight: 5.5,
    description: 'Mini koparka Hitachi ZX55U-5',
  },

  // Standard Excavators
  {
    brand: 'Hitachi',
    type: 'excavator',
    model: 'ZX210-5',
    series: '5',
    frame: 'standard',
    engine: 'Isuzu 6HK1X',
    yearFrom: 2013,
    yearTo: 2018,
    weight: 21,
    description: 'Koparka Hitachi ZX210-5',
  },
  {
    brand: 'Hitachi',
    type: 'excavator',
    model: 'ZX210-6',
    series: '6',
    frame: 'standard',
    engine: 'Isuzu 6HK1X',
    yearFrom: 2018,
    yearTo: 2024,
    weight: 21.5,
    description: 'Koparka Hitachi ZX210-6',
  },
  {
    brand: 'Hitachi',
    type: 'excavator',
    model: 'ZX350-6',
    series: '6',
    frame: 'large',
    engine: 'Isuzu 6WG1X',
    yearFrom: 2018,
    yearTo: 2024,
    weight: 35,
    description: 'Koparka Hitachi ZX350-6',
  },

  // Wheel Loaders
  {
    brand: 'Hitachi',
    type: 'loader',
    model: 'ZW220-6',
    series: '6',
    frame: 'standard',
    engine: 'Isuzu 6HK1X',
    yearFrom: 2018,
    yearTo: 2024,
    weight: 15,
    description: 'Ładowarka kołowa Hitachi ZW220-6',
  },

  // ============================================================================
  // VOLVO
  // ============================================================================

  // Excavators
  {
    brand: 'Volvo',
    type: 'excavator',
    model: 'EC220E',
    series: 'E',
    frame: 'standard',
    engine: 'Volvo D6J',
    yearFrom: 2018,
    yearTo: 2024,
    weight: 22,
    description: 'Koparka Volvo EC220E',
  },
  {
    brand: 'Volvo',
    type: 'excavator',
    model: 'EC300E',
    series: 'E',
    frame: 'standard',
    engine: 'Volvo D7E',
    yearFrom: 2018,
    yearTo: 2024,
    weight: 30,
    description: 'Koparka Volvo EC300E',
  },

  // Wheel Loaders
  {
    brand: 'Volvo',
    type: 'loader',
    model: 'L120H',
    series: 'H',
    frame: 'standard',
    engine: 'Volvo D7E',
    yearFrom: 2017,
    yearTo: 2024,
    weight: 16,
    description: 'Ładowarka kołowa Volvo L120H',
  },

  // ============================================================================
  // JCB
  // ============================================================================

  // Backhoe Loaders
  {
    brand: 'JCB',
    type: 'backhoe',
    model: '3CX',
    series: 'Eco',
    frame: 'standard',
    engine: 'JCB EcoMAX',
    yearFrom: 2010,
    yearTo: 2024,
    weight: 8,
    description: 'Koparka-ładowarka JCB 3CX - najpopularniejszy model',
  },
  {
    brand: 'JCB',
    type: 'backhoe',
    model: '4CX',
    series: 'Eco',
    frame: 'standard',
    engine: 'JCB EcoMAX',
    yearFrom: 2010,
    yearTo: 2024,
    weight: 9,
    description: 'Koparka-ładowarka JCB 4CX',
  },

  // Excavators
  {
    brand: 'JCB',
    type: 'excavator',
    model: 'JS220',
    series: 'LC',
    frame: 'standard',
    engine: 'JCB EcoMAX',
    yearFrom: 2015,
    yearTo: 2024,
    weight: 22,
    description: 'Koparka JCB JS220',
  },

  // Telehandlers
  {
    brand: 'JCB',
    type: 'telehandler',
    model: '535-95',
    frame: 'standard',
    engine: 'JCB EcoMAX',
    yearFrom: 2015,
    yearTo: 2024,
    weight: 7,
    description: 'Ładowarka teleskopowa JCB 535-95',
  },

  // ============================================================================
  // BOBCAT
  // ============================================================================

  // Mini Excavators
  {
    brand: 'Bobcat',
    type: 'mini-excavator',
    model: 'E26',
    frame: 'small',
    engine: 'Kubota',
    yearFrom: 2018,
    yearTo: 2024,
    weight: 2.6,
    description: 'Mini koparka Bobcat E26',
  },
  {
    brand: 'Bobcat',
    type: 'mini-excavator',
    model: 'E55',
    frame: 'small',
    engine: 'Kubota',
    yearFrom: 2018,
    yearTo: 2024,
    weight: 5.5,
    description: 'Mini koparka Bobcat E55',
  },

  // Skid Steer Loaders
  {
    brand: 'Bobcat',
    type: 'loader',
    model: 'S650',
    frame: 'small',
    engine: 'Kubota',
    yearFrom: 2015,
    yearTo: 2024,
    weight: 3.5,
    description: 'Ładowarka Bobcat S650',
  },
]

/**
 * Get machines by brand
 */
export function getMachinesByBrand(brand: string): MachineSeedData[] {
  return MACHINES_SEED.filter(m => m.brand === brand)
}

/**
 * Get machines by type
 */
export function getMachinesByType(type: string): MachineSeedData[] {
  return MACHINES_SEED.filter(m => m.type === type)
}

/**
 * Get machines by brand and type
 */
export function getMachinesByBrandAndType(brand: string, type: string): MachineSeedData[] {
  return MACHINES_SEED.filter(m => m.brand === brand && m.type === type)
}

/**
 * Get unique brands
 */
export function getUniqueBrands(): string[] {
  return [...new Set(MACHINES_SEED.map(m => m.brand))].sort()
}

/**
 * Get unique types
 */
export function getUniqueTypes(): string[] {
  return [...new Set(MACHINES_SEED.map(m => m.type))].sort()
}

/**
 * Statistics
 */
export const MACHINE_STATS = {
  totalMachines: MACHINES_SEED.length,
  brands: getUniqueBrands().length,
  types: getUniqueTypes().length,
  byBrand: {
    CAT: getMachinesByBrand('CAT').length,
    Komatsu: getMachinesByBrand('Komatsu').length,
    Hitachi: getMachinesByBrand('Hitachi').length,
    Volvo: getMachinesByBrand('Volvo').length,
    JCB: getMachinesByBrand('JCB').length,
    Bobcat: getMachinesByBrand('Bobcat').length,
  },
}
