import { ANTOINE, GRAVITY } from './types';

/**
 * Calculate vapor pressure using Antoine equation
 * log₁₀(P) = A - (B / (T + C))
 * where P is in mmHg and T is in °C
 */
export function calculateTheoreticalVaporPressure(temperature: number): number {
  const mmHg = Math.pow(10, ANTOINE.A - (ANTOINE.B / (temperature + ANTOINE.C)));
  return mmHg * 133.322; // Convert mmHg to Pascal
}

/**
 * Calculate experimental vapor pressure using manometer readings
 * Pv = ρₘ × g × Δh
 */
export function calculateExperimentalVaporPressure(
  oilDensity: number,
  heightDifference: number
): number {
  return oilDensity * GRAVITY * heightDifference;
}

/**
 * Calculate oil density based on temperature
 * Simple linear approximation for demonstration
 */
export function calculateOilDensity(temperature: number): number {
  // Approximate 0.1% density decrease per °C increase
  const baseOilDensity = 920; // kg/m³ at 20°C
  const densityChange = -0.001 * (temperature - 20) * baseOilDensity;
  return baseOilDensity + densityChange;
}

/**
 * Calculate height difference between manometer columns
 */
export function calculateHeightDifference(leftHeight: number, rightHeight: number): number {
  return rightHeight - leftHeight;
}

/**
 * Format pressure value with appropriate units
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
 * Format temperature with unit
 */
export function formatTemperature(temp: number): string {
  return `${temp.toFixed(1)}°C`;
}

/**
 * Calculate bubble animation parameters based on temperature
 */
export function calculateBubbleIntensity(temperature: number): number {
  // Normalize temperature to 0-1 range for animation intensity
  const minTemp = 20;
  const boilingPoint = 100;
  if (temperature <= minTemp) return 0;
  if (temperature >= boilingPoint) return 1;
  return (temperature - minTemp) / (boilingPoint - minTemp);
}

/**
 * Generate data points for vapor pressure curve
 */
export function generateVaporPressureCurve(
  startTemp: number,
  endTemp: number,
  steps: number
): { temperature: number; pressure: number }[] {
  const points: { temperature: number; pressure: number }[] = [];
  const stepSize = (endTemp - startTemp) / steps;

  for (let temp = startTemp; temp <= endTemp; temp += stepSize) {
    points.push({
      temperature: temp,
      pressure: calculateTheoreticalVaporPressure(temp)
    });
  }

  return points;
}

/**
 * Calculate percent error between experimental and theoretical values
 */
export function calculatePercentError(
  experimental: number,
  theoretical: number
): number {
  return Math.abs((experimental - theoretical) / theoretical) * 100;
}

/**
 * Format height values with appropriate units
 */
export function formatHeight(height: number): string {
  return `${(height * 1000).toFixed(1)} mm`;
}

/**
 * Format density with appropriate units
 */
export function formatDensity(density: number): string {
  return `${density.toFixed(1)} kg/m³`;
} 