export interface GaugeReading {
  position: string;
  pressure: number;
  isConnected: boolean;
  isReference?: boolean;  // true for orange (given) values, false for green (calculated) values
}

export interface ReferenceData {
  component: string;
  iteration: string;
  flowRate: number;
  velocity: number | null;  // Can be null when not yet calculated
  p1: number;
  p2: number;
  pressureDrop: number | null;  // Can be null when not yet calculated
  headLoss: number | null;  // Can be null when not yet calculated
  kValue: number | null;  // Can be null when not yet calculated
  isCalculated: boolean;  // Flag to track if calculations are done
}

export interface ComponentMeasurement {
  componentId: string;
  iteration: string;
  flowRate: number;
  velocity: number;
  p1: number;
  p2: number;
  deltaPressure: number;
  headLoss: number;
  lossCoefficient: number;
  reynoldsNumber: number;
  equivalentLength: number;
  isVerified: boolean;
}

export interface CalculationStep {
  label: string;
  equation: string;
  value: number;
  unit: string;
  explanation?: string;  // Made optional since it's not used in the calculations
  isCorrect?: boolean;   // Added since it's used in the CalculationSteps component
}

export interface FittingData {
  id: string;
  name: string;
  color: string;
  kValue: number;
  expectedPressureDrops: {
    [iteration: string]: number;
  };
}

export interface ReferenceValues {
  component: string;
  iteration: string;
  flowRate: number;
  velocity: number;
  p1: number;
  p2: number;
  pressureDrop: number;
  headLoss: number;
  k: number;
}

// Initialize with empty reference data
export const REFERENCE_DATA: ReferenceData[] = [];

export const REFERENCE_VALUES: ReferenceValues[] = [
  // 90-degree smooth bend
  {
    component: 'smooth-bend',
    iteration: '1',
    flowRate: 0.0002,
    velocity: 2.4220,
    p1: 350000,
    p2: 347150,
    pressureDrop: 600,
    headLoss: 0.06,
    k: 0.20
  },
  {
    component: 'smooth-bend',
    iteration: '2',
    flowRate: 0.0003,
    velocity: 3.2150,
    p1: 400000,
    p2: 398950,
    pressureDrop: 1050,
    headLoss: 0.11,
    k: 0.20
  },
  {
    component: 'smooth-bend',
    iteration: '3',
    flowRate: 0.0005,
    velocity: 5.3583,
    p1: 480000,
    p2: 479400,
    pressureDrop: 2850,
    headLoss: 0.29,
    k: 0.20
  },
  // Globe valve
  {
    component: 'globe-valve',
    iteration: '1',
    flowRate: 0.0002,
    velocity: 2.4220,
    p1: 350000,
    p2: 207000,
    pressureDrop: 29300,
    headLoss: 2.99,
    k: 10.0
  },
  {
    component: 'globe-valve',
    iteration: '2',
    flowRate: 0.0003,
    velocity: 3.2150,
    p1: 400000,
    p2: 348300,
    pressureDrop: 51700,
    headLoss: 5.27,
    k: 10.0
  },
  {
    component: 'globe-valve',
    iteration: '3',
    flowRate: 0.0005,
    velocity: 5.3583,
    p1: 480000,
    p2: 450700,
    pressureDrop: 143000,
    headLoss: 14.58,
    k: 10.0
  },
  // Reducer
  {
    component: 'reducer',
    iteration: '1',
    flowRate: 0.0002,
    velocity: 2.4220,
    p1: 350000,
    p2: 342800,
    pressureDrop: 1470,
    headLoss: 0.15,
    k: 0.50
  },
  {
    component: 'reducer',
    iteration: '2',
    flowRate: 0.0003,
    velocity: 3.2150,
    p1: 400000,
    p2: 397400,
    pressureDrop: 2600,
    headLoss: 0.27,
    k: 0.50
  },
  {
    component: 'reducer',
    iteration: '3',
    flowRate: 0.0005,
    velocity: 5.3583,
    p1: 480000,
    p2: 478530,
    pressureDrop: 7200,
    headLoss: 0.73,
    k: 0.50
  }
];

// Physical constants
export const CONSTANTS = {
  DENSITY: 998, // kg/m³
  GRAVITY: 9.81, // m/s²
  PIPE_AREA: 9.33e-5, // m²
  PIPE_DIAMETER: 0.0109, // m
  VISCOSITY: 0.001, // Pa·s
  FRICTION_FACTOR: 0.02, // Darcy friction factor
} as const;

export const FLOW_RATES = [
  { label: 'Q₁ = 0.0002 m³/s', value: 0.0002, iteration: 'Q1' },
  { label: 'Q₂ = 0.0003 m³/s', value: 0.0003, iteration: 'Q2' },
  { label: 'Q₃ = 0.0005 m³/s', value: 0.0005, iteration: 'Q3' }
] as const;

export const FITTINGS: FittingData[] = [
  {
    id: 'globe-valve',
    name: 'Globe Valve',
    color: '#F97316', // orange
    kValue: 10.0,
    expectedPressureDrops: {
      '1': 29300,  // Q1 (0.0002)
      '2': 51700,  // Q2 (0.0003)
      '3': 143000  // Q3 (0.0005)
    }
  },
  {
    id: 'smooth-bend',
    name: '90° Smooth Bend',
    color: '#EC4899', // pink
    kValue: 0.20,
    expectedPressureDrops: {
      '1': 600,   // Q1 (0.0002)
      '2': 1050,  // Q2 (0.0003)
      '3': 2850   // Q3 (0.0005)
    }
  },
  {
    id: 'reducer',
    name: 'Reducer',
    color: '#22C55E', // green
    kValue: 0.50,
    expectedPressureDrops: {
      '1': 1470,  // Q1 (0.0002)
      '2': 2600,  // Q2 (0.0003)
      '3': 7200   // Q3 (0.0005)
    }
  }
] as const;

export type ComponentId = 'globe-valve' | 'smooth-bend' | 'reducer';
export type Iteration = 'Q1' | 'Q2' | 'Q3';
export type FlowRateValue = '0.0002' | '0.0003' | '0.0005';

export interface ComponentPressures {
  [key: string]: {
    [iteration: string]: {
      p1: number;
      p2: number;
    };
  };
}

export interface FlowRate {
  iteration: Iteration;
  value: number;
  label: string;
}

// Flow rate pressure mappings for each component
export const COMPONENT_PRESSURES: ComponentPressures = {
  'globe-valve': {
    '1': { p1: 350000, p2: 207000 },  // Q1 (0.0002)
    '2': { p1: 400000, p2: 348300 },  // Q2 (0.0003)
    '3': { p1: 480000, p2: 450700 }   // Q3 (0.0005)
  },
  'smooth-bend': {
    '1': { p1: 350000, p2: 347150 },  // Q1 (0.0002)
    '2': { p1: 400000, p2: 398950 },  // Q2 (0.0003)
    '3': { p1: 480000, p2: 479400 }   // Q3 (0.0005)
  },
  'reducer': {
    '1': { p1: 350000, p2: 342800 },  // Q1 (0.0002)
    '2': { p1: 400000, p2: 397400 },  // Q2 (0.0003)
    '3': { p1: 480000, p2: 478530 }   // Q3 (0.0005)
  }
};

export interface Fitting {
  id: ComponentId;
  name: string;
} 