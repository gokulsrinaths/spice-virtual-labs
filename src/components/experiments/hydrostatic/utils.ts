import { GRAVITY } from './types';

/**
 * Calculate hydrostatic pressure using the formula P = ρgh
 * @param density Fluid density in kg/m³
 * @param depth Depth in meters
 * @returns Pressure in Pascal
 */
export function calculateHydrostaticPressure(density: number, depth: number): number {
  return density * GRAVITY * depth;
}

/**
 * Format pressure with appropriate units
 * @param pressure Pressure in Pascal
 * @returns Formatted string with units
 */
export function formatPressure(pressure: number): string {
  if (pressure >= 1000000) {
    return `${(pressure / 1000000).toFixed(2)} MPa`;
  } else if (pressure >= 1000) {
    return `${(pressure / 1000).toFixed(2)} kPa`;
  }
  return `${pressure.toFixed(2)} Pa`;
}

/**
 * Format pressure in bar
 * @param pressure Pressure in Pascal
 * @returns Formatted string in bar
 */
export function formatPressureBar(pressure: number): string {
  const bar = pressure / 100000;
  return `${bar.toFixed(3)} bar`;
}

/**
 * Format depth with appropriate units
 * @param depth Depth in meters
 * @returns Formatted string with units
 */
export function formatDepth(depth: number): string {
  if (depth >= 1) {
    return `${depth.toFixed(2)} m`;
  }
  return `${(depth * 100).toFixed(1)} cm`;
}

/**
 * Format density with appropriate units
 * @param density Density in kg/m³
 * @returns Formatted string with units
 */
export function formatDensity(density: number): string {
  return `${density.toFixed(0)} kg/m³`;
}

/**
 * Generate equation string with substituted values
 * @param density Density in kg/m³
 * @param depth Depth in meters
 * @returns Formatted equation string
 */
export function generateEquation(density: number, depth: number): string {
  const pressure = calculateHydrostaticPressure(density, depth);
  return `P = ρ × g × h\nP = ${density} × ${GRAVITY} × ${depth.toFixed(3)}\nP = ${formatPressure(pressure)}`;
} 