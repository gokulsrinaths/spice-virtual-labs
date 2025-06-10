export interface Ball {
  id: string;
  name: string;
  diameter: number; // mm
  density: number; // kg/m³
}

export interface Fluid {
  id: string;
  name: string;
  density: number; // kg/m³
  viscosity: number; // Pa·s
  color: string;
}

export interface Measurement {
  ballId: string;
  fluidId: string;
  velocity: number;
  dynamicViscosity: number;
  temperature: number;
}

export interface ExperimentData {
  selectedFluid: Fluid;
  selectedBall: Ball;
  currentStep: number;
  isDropping: boolean;
  measurements: Measurement[];
}

export interface FluidData {
  name: string;
  viscosity: number;  // Dynamic viscosity in Pa·s at reference temperature
  temperature: number;  // Reference temperature in °C
}

export interface SimulationParams {
  fluidType: string;
  temperature: number;  // °C
  shearRate: number;  // s⁻¹
}

export interface ViscosityResult {
  dynamicViscosity: number;  // Pa·s
  reynoldsNumber: number;
  shearStress: number;  // Pa
}

export interface FluidProperties {
  name: string;
  density: number;  // kg/m³
  color: string;    // CSS color
}

export interface BallProperties {
  diameter: number;  // m
  density: number;   // kg/m³
  label: string;
}

export interface MeasurementPoint {
  time: number;      // seconds
  position: number;  // meters
  velocity: number;  // m/s
}

export interface ExperimentResults {
  terminalVelocity: number;     // m/s
  dynamicViscosity: number;     // Pa·s
  kinematicViscosity: number;   // m²/s
  timeToTerminal: number;       // seconds
  measurements: MeasurementPoint[];
}

export interface SimulationState {
  isRunning: boolean;
  currentTime: number;
  currentPosition: number;
  currentVelocity: number;
  hasReachedTerminal: boolean;
}

export const TUBE_HEIGHT = 1.5;  // meters
export const GRAVITY = 9.81;     // m/s²

export const FLUIDS: Record<string, FluidProperties> = {
  water: {
    name: "Water",
    density: 998.2,  // kg/m³ at 20°C
    color: "rgba(147, 197, 253, 0.9)"  // Semi-transparent blue
  },
  vegetableOil: {
    name: "Vegetable Oil",
    density: 920,    // kg/m³ at 20°C
    color: "rgba(234, 179, 8, 0.9)"    // Semi-transparent amber
  }
};

export const BALLS: BallProperties[] = [
  { diameter: 0.04, density: 7800, label: "D₁ = 40 mm" },   // Large steel ball
  { diameter: 0.03, density: 7800, label: "D₂ = 30 mm" },   // Medium steel ball
  { diameter: 0.02, density: 7800, label: "D₃ = 20 mm" },   // Small steel ball
  { diameter: 0.015, density: 7800, label: "D₄ = 15 mm" }   // Tiny steel ball
];