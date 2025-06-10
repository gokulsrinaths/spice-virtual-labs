import { SimulationParams, ViscosityResult } from './types';
import { BallProperties, FluidProperties, GRAVITY, MeasurementPoint } from './types';

/**
 * Calculate dynamic viscosity using the Andrade equation
 * μ = μ₀ * e^(-b*(T-T₀))
 */
export function calculateViscosity(
  referenceViscosity: number,
  referenceTemp: number,
  currentTemp: number,
  activationEnergy: number = 2000  // J/mol, approximate value
): number {
  const R = 8.314;  // Gas constant in J/(mol·K)
  const T1 = referenceTemp + 273.15;  // Convert to Kelvin
  const T2 = currentTemp + 273.15;
  return referenceViscosity * Math.exp((activationEnergy/R) * (1/T2 - 1/T1));
}

/**
 * Calculate Reynolds number for pipe flow
 * Re = (ρ * v * D) / μ
 */
export function calculateReynolds(
  density: number,  // kg/m³
  velocity: number,  // m/s
  diameter: number,  // m
  viscosity: number  // Pa·s
): number {
  return (density * velocity * diameter) / viscosity;
}

/**
 * Calculate shear stress
 * τ = μ * γ
 */
export function calculateShearStress(
  viscosity: number,  // Pa·s
  shearRate: number   // s⁻¹
): number {
  return viscosity * shearRate;
}

/**
 * Get simulation results based on current parameters
 */
export function getSimulationResults(
  params: SimulationParams,
  referenceViscosity: number,
  referenceTemp: number
): ViscosityResult {
  const dynamicViscosity = calculateViscosity(
    referenceViscosity,
    referenceTemp,
    params.temperature
  );

  // Assuming standard conditions for Reynolds calculation
  const density = 1000;  // kg/m³ (water)
  const velocity = params.shearRate * 0.001;  // m/s (approximate)
  const diameter = 0.01;  // m (1cm tube)

  const reynoldsNumber = calculateReynolds(
    density,
    velocity,
    diameter,
    dynamicViscosity
  );

  const shearStress = calculateShearStress(
    dynamicViscosity,
    params.shearRate
  );

  return {
    dynamicViscosity,
    reynoldsNumber,
    shearStress
  };
}

/**
 * Calculate terminal velocity using Stokes' Law
 * V = (2/9) * (ρ_ball - ρ_fluid) * g * r² / μ
 * All calculations are done in SI units (m, kg, s)
 */
export function calculateTerminalVelocity(
  ball: BallProperties,
  fluid: FluidProperties
): number {
  const radius = ball.diameter / 2;
  const densityDiff = ball.density - fluid.density;
  // Initial approximation of dynamic viscosity (Pa·s)
  const approximateViscosity = fluid.name === "Water" ? 0.001 : 0.05;
  return (densityDiff * GRAVITY * radius * radius) / (18 * approximateViscosity);
}

/**
 * Calculate dynamic viscosity using Stokes' Law
 * μ = (2/9) * (ρ_ball - ρ_fluid) * g * r² / V
 */
export function calculateDynamicViscosity(
  ball: BallProperties,
  fluid: FluidProperties,
  terminalVelocity: number
): number {
  const radius = ball.diameter / 2;
  const densityDiff = ball.density - fluid.density;
  return (densityDiff * GRAVITY * radius * radius) / (9 * terminalVelocity);
}

/**
 * Calculate kinematic viscosity
 * ν = μ / ρ_fluid
 */
export function calculateKinematicViscosity(
  dynamicViscosity: number,
  fluidDensity: number
): number {
  return dynamicViscosity / fluidDensity;
}

/**
 * Calculate instantaneous velocity at time t
 * Uses simplified model approaching terminal velocity exponentially
 */
export function calculateVelocityAtTime(
  time: number,
  terminalVelocity: number,
  timeConstant: number = 0.2
): number {
  // Ensure positive velocity (downward motion)
  return Math.abs(terminalVelocity * (1 - Math.exp(-time / timeConstant)));
}

/**
 * Calculate position at time t
 * Ball starts at top (maxHeight) and falls down to 0
 */
export function calculatePositionAtTime(
  time: number,
  terminalVelocity: number,
  timeConstant: number = 0.2
): number {
  const maxHeight = 1.5; // Maximum height of tube in meters
  
  // Calculate the distance fallen using the average velocity
  const avgVelocity = terminalVelocity * (time / timeConstant - (1 - Math.exp(-time / timeConstant)));
  const distance = avgVelocity * time;
  
  // Start from maxHeight and move down
  const position = maxHeight - distance;
  
  // Ensure position stays between 0 and maxHeight
  return Math.max(0, Math.min(maxHeight, position));
}

/**
 * Generate measurement points for the entire fall
 */
export function generateMeasurements(
  duration: number,
  terminalVelocity: number,
  timeStep: number = 0.02  // 50 fps
): MeasurementPoint[] {
  const points: MeasurementPoint[] = [];
  const timeConstant = 0.2;
  let lastPosition = 1.5; // Start at top

  // Always include the starting point
  points.push({
    time: 0,
    velocity: 0,
    position: 1.5
  });

  for (let t = timeStep; t <= duration; t += timeStep) {
    const velocity = calculateVelocityAtTime(t, terminalVelocity, timeConstant);
    const position = calculatePositionAtTime(t, terminalVelocity, timeConstant);
    
    // Stop if we've reached the bottom
    if (position <= 0) {
      points.push({
        time: t,
        velocity,
        position: 0
      });
      break;
    }
    
    // Only add point if we're actually moving
    if (position !== lastPosition) {
      points.push({
        time: t,
        velocity,
        position
      });
      lastPosition = position;
    }
  }

  return points;
}

/**
 * Determine if terminal velocity has been reached (within 1% tolerance)
 */
export function hasReachedTerminalVelocity(
  currentVelocity: number,
  terminalVelocity: number,
  tolerance: number = 0.01
): boolean {
  return Math.abs(1 - currentVelocity / terminalVelocity) < tolerance;
}

/**
 * Format a number with appropriate units and precision
 */
export function formatValue(value: number, unit: string, precision: number = 3): string {
  if (Math.abs(value) < 0.001) {
    return `${(value * 1000).toFixed(precision)} m${unit}`;
  }
  return `${value.toFixed(precision)} ${unit}`;
} 