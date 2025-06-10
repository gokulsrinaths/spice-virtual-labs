export interface FlowParameters {
  flowRate: number;      // m³/s
  diameter: number;      // m
  density: number;      // kg/m³
  k: number;            // loss coefficient
  p1?: number;          // Initial pressure (Pa)
}

export interface FlowData {
  component: string;
  iteration: string;  // Changed from number to string for Q1, Q2, Q3 format
  flowRate: number;
  velocity: number;
  p1: number;
  p2: number;
  pressureDrop: number;
  length: number;
  k: number;
}

export class FlowCalculations {
  /**
   * Calculate flow velocity
   */
  static calculateVelocity(flowRate: number, diameter: number): number {
    const area = Math.PI * Math.pow(diameter / 2, 2);
    return flowRate / area;
  }

  /**
   * Calculate pressure drop
   */
  static calculatePressureDrop(k: number, density: number, velocity: number): number {
    return 0.5 * k * density * Math.pow(velocity, 2);
  }

  /**
   * Calculate equivalent length
   */
  static calculateLength(pressureDrop: number, k: number, density: number, velocity: number): number {
    return (pressureDrop * 2) / (k * density * Math.pow(velocity, 2));
  }

  /**
   * Calculate Reynolds number
   */
  static calculateReynolds(velocity: number, diameter: number, density: number, viscosity: number): number {
    return (velocity * diameter * density) / viscosity;
  }

  /**
   * Verify calculations against expected values
   */
  static verifyCalculations(
    componentName: string,
    iteration: string,  // Changed from number to string
    params: FlowParameters,
    expected: {
      flowRate: number;
      velocity: number;
      pressureDrop: number;
      length: number;
    }
  ): void {
    const calculatedVelocity = this.calculateVelocity(params.flowRate, params.diameter);
    const calculatedPressureDrop = this.calculatePressureDrop(params.k, params.density, calculatedVelocity);
    const calculatedLength = this.calculateLength(calculatedPressureDrop, params.k, params.density, calculatedVelocity);

    console.log(`\nVerifying ${componentName} - Iteration ${iteration}:`);
    console.log(`Velocity: Expected=${expected.velocity.toFixed(4)} m/s, Calculated=${calculatedVelocity.toFixed(4)} m/s`);
    console.log(`Pressure Drop: Expected=${expected.pressureDrop.toFixed(2)} Pa, Calculated=${calculatedPressureDrop.toFixed(2)} Pa`);
    console.log(`Length: Expected=${expected.length.toFixed(2)} m, Calculated=${calculatedLength.toFixed(2)} m`);
  }
}

// Constants for verification
const PIPE_DIAMETER = 0.0102; // m
const WATER_DENSITY = 1000;   // kg/m³
const WATER_VISCOSITY = 0.001; // Pa·s

// Verification data for different components
export const verify90DegreeBend = () => {
  const iterations = [
    { flowRate: 0.0002, velocity: 2.4220, pressureDrop: 600, length: 0.06, iteration: 'Q1' },
    { flowRate: 0.0003, velocity: 3.2150, pressureDrop: 1050, length: 0.11, iteration: 'Q2' },
    { flowRate: 0.0005, velocity: 5.3583, pressureDrop: 2850, length: 0.29, iteration: 'Q3' }
  ];

  iterations.forEach((expected) => {
    FlowCalculations.verifyCalculations(
      "90-degree smooth bend",
      expected.iteration,
      {
        flowRate: expected.flowRate,
        diameter: PIPE_DIAMETER,
        density: WATER_DENSITY,
        k: 0.20
      },
      expected
    );
  });
};

export const verifyGlobeValve = () => {
  const iterations = [
    { flowRate: 0.0002, velocity: 2.4220, pressureDrop: 29300, length: 2.99, iteration: 'Q1' },
    { flowRate: 0.0003, velocity: 3.2150, pressureDrop: 51700, length: 5.27, iteration: 'Q2' },
    { flowRate: 0.0005, velocity: 5.3583, pressureDrop: 143000, length: 14.58, iteration: 'Q3' }
  ];

  iterations.forEach((expected) => {
    FlowCalculations.verifyCalculations(
      "Globe valve",
      expected.iteration,
      {
        flowRate: expected.flowRate,
        diameter: PIPE_DIAMETER,
        density: WATER_DENSITY,
        k: 10.0
      },
      expected
    );
  });
}; 