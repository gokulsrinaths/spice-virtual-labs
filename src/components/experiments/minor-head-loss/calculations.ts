import { CONSTANTS, CalculationStep, ComponentMeasurement, FittingData, REFERENCE_VALUES } from './types';

export function calculateVelocity(flowRate: number): CalculationStep {
  const velocity = flowRate / CONSTANTS.PIPE_AREA;
  return {
    label: "Calculate flow velocity",
    equation: `V = Q/A = ${flowRate.toExponential(3)}/${CONSTANTS.PIPE_AREA.toExponential(3)}`,
    value: velocity,
    unit: "m/s"
  };
}

export function calculatePressureDrop(p1: number, p2: number): CalculationStep {
  const deltaPressure = p1 - p2;
  return {
    label: "Calculate pressure drop",
    equation: `ΔP = P₁ - P₂ = ${p1.toFixed(0)} - ${p2.toFixed(0)}`,
    value: deltaPressure,
    unit: "Pa"
  };
}

export function calculateHeadLoss(deltaPressure: number): CalculationStep {
  const headLoss = deltaPressure / (CONSTANTS.DENSITY * CONSTANTS.GRAVITY);
  return {
    label: "Calculate minor head loss",
    equation: `hₘ = ΔP/(ρg) = ${deltaPressure.toFixed(0)}/(${CONSTANTS.DENSITY}×${CONSTANTS.GRAVITY})`,
    value: headLoss,
    unit: "m"
  };
}

export function calculateLossCoefficient(deltaPressure: number, velocity: number): CalculationStep {
  const k = (2 * deltaPressure) / (CONSTANTS.DENSITY * Math.pow(velocity, 2));
  return {
    label: "Calculate loss coefficient",
    equation: `K = 2ΔP/(ρV²) = 2×${deltaPressure.toFixed(0)}/(${CONSTANTS.DENSITY}×${velocity.toFixed(2)}²)`,
    value: k,
    unit: ""
  };
}

export function calculateReynolds(velocity: number): CalculationStep {
  const reynolds = (velocity * CONSTANTS.PIPE_DIAMETER * CONSTANTS.DENSITY) / CONSTANTS.VISCOSITY;
  return {
    label: "Calculate Reynolds number",
    equation: `Re = ρVD/μ = ${CONSTANTS.DENSITY}×${velocity.toFixed(2)}×${CONSTANTS.PIPE_DIAMETER}/${CONSTANTS.VISCOSITY}`,
    value: reynolds,
    unit: ""
  };
}

export function calculateEquivalentLength(k: number): CalculationStep {
  const eqLength = k * CONSTANTS.PIPE_DIAMETER / CONSTANTS.FRICTION_FACTOR;
  return {
    label: "Calculate equivalent length",
    equation: `L_eq = KD/f = ${k.toFixed(2)}×${CONSTANTS.PIPE_DIAMETER}/${CONSTANTS.FRICTION_FACTOR}`,
    value: eqLength,
    unit: "m"
  };
}

export function validateCalculation(
  componentId: string,
  flowRate: number,
  value: number,
  type: 'velocity' | 'pressureDrop' | 'headLoss' | 'k'
): boolean {
  const flowRateStr = flowRate.toString();
  const referenceValue = REFERENCE_VALUES.find(
    ref => ref.component === componentId && ref.flowRate.toString() === flowRateStr
  );

  if (!referenceValue) {
    return false;
  }

  const expectedValue = referenceValue[type];
  const tolerance = expectedValue * 0.10; // 10% margin of error
  const minValue = expectedValue - tolerance;
  const maxValue = expectedValue + tolerance;

  return value >= minValue && value <= maxValue;
}

export function verifyMeasurements(
  measurements: ComponentMeasurement,
  fitting: FittingData
): ComponentMeasurement {
  const isVelocityCorrect = validateCalculation(
    measurements.componentId,
    measurements.flowRate,
    measurements.velocity,
    'velocity'
  );

  const isPressureDropCorrect = validateCalculation(
    measurements.componentId,
    measurements.flowRate,
    measurements.deltaPressure,
    'pressureDrop'
  );

  const isHeadLossCorrect = validateCalculation(
    measurements.componentId,
    measurements.flowRate,
    measurements.headLoss,
    'headLoss'
  );

  const isKValueCorrect = validateCalculation(
    measurements.componentId,
    measurements.flowRate,
    measurements.lossCoefficient,
    'k'
  );
  
  return {
    ...measurements,
    isVerified: isVelocityCorrect && isPressureDropCorrect && isHeadLossCorrect && isKValueCorrect
  };
}

export function generateReport(measurements: ComponentMeasurement[]): string {
  const headers = [
    'Component',
    'Flow Rate (m³/s)',
    'Velocity (m/s)',
    'P₁ (Pa)',
    'P₂ (Pa)',
    'ΔP (Pa)',
    'Head Loss (m)',
    'K',
    'Reynolds',
    'Eq. Length (m)',
    'Verified'
  ];

  const rows = measurements.map(m => [
    m.componentId,
    m.flowRate.toExponential(3),
    m.velocity.toFixed(2),
    m.p1.toFixed(0),
    m.p2.toFixed(0),
    m.deltaPressure.toFixed(0),
    m.headLoss.toFixed(4),
    m.lossCoefficient.toFixed(2),
    m.reynoldsNumber.toFixed(0),
    m.equivalentLength.toFixed(2),
    m.isVerified ? 'Yes' : 'No'
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
} 