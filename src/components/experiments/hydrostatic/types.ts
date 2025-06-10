export interface Fluid {
  name: string;
  density: number; // kg/m³
  color: string;
}

export interface ExperimentState {
  selectedFluid: Fluid;
  depth: number; // meters
  pressure: number; // Pascal
}

export interface MeasurementPoint {
  fluid: string;
  density: number; // kg/m³
  depth: number; // meters
  pressure: number; // Pascal
  timestamp: number;
}

// Constants
export const GRAVITY = 9.81; // m/s²
export const MAX_DEPTH = 2.0; // meters
export const MIN_DEPTH = 0.0; // meters

// Available fluids
export const FLUIDS: Fluid[] = [
  {
    name: "Water",
    density: 1000,
    color: "#3b82f6" // blue-500
  },
  {
    name: "Oil",
    density: 920,
    color: "#eab308" // yellow-500
  },
  {
    name: "Mercury",
    density: 13600,
    color: "#94a3b8" // slate-400
  }
]; 