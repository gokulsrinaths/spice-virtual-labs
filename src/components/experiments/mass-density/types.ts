export interface Measurement {
  m1: number;
  m2: number;
  volume: number;
  temperature: number;
  density: number;
}

export type ExperimentStep = 'drying' | 'cooling' | 'weighing' | 'filling' | 'final-weighing' | 'calculation';

export interface ExperimentData {
  selectedFlask: 'volumetric-flask' | 'erlenmeyer-flask';
  m1?: number;
  m2?: number;
  temperature?: number;
  density?: number;
  heatedM2?: number;
  heatedTemperature?: number;
  heatedDensity?: number;
  measurements?: Measurement[];
  currentStep: ExperimentStep;
  ovenTemperature?: number;
  isDropping?: boolean;
  dryingComplete?: boolean;
  coolingComplete?: boolean;
  waterAdded?: boolean;
  calculationComplete?: boolean;
  location?: 'drying-oven' | 'cooling-area' | 'weighing-scale' | 'water-tap' | null;
  flaskStatus?: 'hot' | 'cool' | 'filled' | null;
}

export interface Apparatus {
  id: string;
  name: string;
  description: string;
  icon: any;
  specifications: {
    [key: string]: string | number;
  };
  safetyNotes: string[];
}

export interface ExperimentStepConfig {
  id: number;
  title: string;
  description: string;
  requiredApparatus: string[];
  validation?: (data: ExperimentData) => boolean;
  safetyWarnings?: string[];
}