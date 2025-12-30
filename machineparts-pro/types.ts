export interface Machine {
  id: string;
  basicInfo: BasicInfo;
  ratingPlate: RatingPlate;
  mechanicalSpecs: MechanicalSpecs;
  dimensions: Dimensions;
  soundSpecs: SoundSpecs;
  commonIssues: string[];
  partsCatalog: Part[];
  technicalDocs?: TechnicalDocument[]; // New field for documentation
  groundingMetadata?: any; // To store search sources
  raw: {
    notes: string;
    specifications: string;
    applications: string;
    maintenance: string;
    oem_parts_raw: string;
    notes_pl: string;
    diagnostics_raw: string;
  };
}

export interface TechnicalDocument {
  title: string;
  type: 'Service Manual' | 'Parts Catalog' | 'Operator Manual' | 'Schematic' | 'Other';
  publicationNumber?: string;
  description?: string;
}

export interface ReplacementPart {
  manufacturer: string; // e.g., "Mann-Filter", "Donaldson"
  partNumber: string;
  type: 'Aftermarket' | 'OEM Alternative';
}

export interface Part {
  id: string;
  name: string;
  oemNumber: string;
  category: string; // e.g., "Engine System", "Hydraulics"
  diagramReference?: string; // e.g., "Fig 12.1"
  description?: string;
  manufacturer?: string; // e.g., "Donaldson", "Bosch"
  alternatives?: ReplacementPart[]; // New field for replacements
}

export interface BasicInfo {
  manufacturer: string;
  model_code: string;
  year_from: string;
  year_to: string;
  serial_range_start: string;
  serial_range_end: string;
  type_weight_note: string;
  engine_model?: string;
}

export interface RatingPlate {
  operatingweightkg: string;
  enginepowerkw: string;
  engine_model: string;
  enginedisplacementcc: string;
  emission_standard: string;
  hydraulicpressurebar: string;
  fueltankcapacity_l: string;
  hydraulictankcapacity_l: string;
  coolantcapacityl: string;
  engineoilcapacity_l: string;
  adblue_capacity_l: string;
}

export interface MechanicalSpecs {
    max_torque_nm: string;
    hydraulic_pump_type: string;
    hydraulic_flow_max_lmin: string;
    system_voltage_v: string;
    battery_capacity_ah: string;
    travel_speed_kmh: string;
    swing_speed_rpm: string;
    breakout_force_kn: string;
}

export interface Dimensions {
  transport_length_mm: string;
  transport_width_mm: string;
  transport_height_mm: string;
  digging_depth_mm: string;
  digging_reach_mm: string;
  dump_height_mm: string;
}

export interface SoundSpecs {
  noise_level_external_lwa_db: string;
  noise_level_cabin_lpa_db: string;
}

export interface OemParts {
  filters: any;
  seals: any;
  undercarriage: any;
  wear: any;
}