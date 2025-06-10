export interface ExperimentState {
  temperature: number;  // °C
  oilDensity: number;  // kg/m³
  leftHeight: number;  // m
  rightHeight: number; // m
  isHeating: boolean;
  vaporPressure: number; // Pa
  theoreticalPressure: number; // Pa
}

export interface MeasurementPoint {
  temperature: number;  // °C
  vaporPressure: number;  // Pa
  theoreticalPressure: number;  // Pa
  heightDifference: number;  // m
  timestamp: number;  // ms
}

export interface FlaskState {
  temperature: number;  // °C
  bubbleIntensity: number;  // 0-1
  vaporLevel: number;  // 0-1
}

export interface ManometerState {
  leftHeight: number;  // m
  rightHeight: number;  // m
  oilDensity: number;  // kg/m³
  oilColor: string;
}

// Constants
export const GRAVITY = 9.81;  // m/s²
export const FLASK_VOLUME = 0.5;  // L
export const MIN_TEMP = 20;  // °C
export const MAX_TEMP = 150;  // °C
export const TUBE_HEIGHT = 0.5;  // m
export const DEFAULT_OIL_DENSITY = 920;  // kg/m³

// Antoine equation constants for water vapor pressure
export const ANTOINE = {
  A: 8.07131,
  B: 1730.63,
  C: 233.426
};

// Temperature presets
export const TEMPERATURE_PRESETS = [
  { value: 20, label: "20°C (Room)" },
  { value: 50, label: "50°C" },
  { value: 75, label: "75°C" },
  { value: 100, label: "100°C (Boiling)" },
  { value: 125, label: "125°C" },
  { value: 150, label: "150°C" }
]; 