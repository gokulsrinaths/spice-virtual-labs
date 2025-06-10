import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ChevronRight } from 'lucide-react';

interface FlowData {
  component: string;
  iteration: number;
  flowRate: number;
  velocity: number;
  p1: number;
  p2: number;
  pressureDrop: number;
  length: number;
  k: number;
}

export function FlowCalculator() {
  const [calculatedData, setCalculatedData] = useState<FlowData[]>([]);
  const [density] = useState(1000); // kg/m³ (water density)
  const [viscosity] = useState(0.001); // Pa·s (water viscosity)

  const calculateVelocity = (flowRate: number, area: number) => {
    return flowRate / area;
  };

  const calculatePressureDrop = (k: number, density: number, velocity: number) => {
    return 0.5 * k * density * Math.pow(velocity, 2);
  };

  const calculateLength = (pressureDrop: number, k: number, density: number, velocity: number) => {
    return (pressureDrop * 2) / (k * density * Math.pow(velocity, 2));
  };

  useEffect(() => {
    // Initial data from the table
    const initialData: FlowData[] = [
      // 90-degree smooth bend
      { component: "90-degree smooth bend", iteration: 1, flowRate: 0.0002, velocity: 2.4220, p1: 48000, p2: 47400, pressureDrop: 600, length: 0.06, k: 0.20 },
      { component: "90-degree smooth bend", iteration: 2, flowRate: 0.0003, velocity: 3.2150, p1: 40000, p2: 38950, pressureDrop: 1050, length: 0.11, k: 0.20 },
      { component: "90-degree smooth bend", iteration: 3, flowRate: 0.0005, velocity: 5.3583, p1: 35000, p2: 34150, pressureDrop: 2850, length: 0.29, k: 0.20 },
      
      // Globe valve
      { component: "Globe valve", iteration: 1, flowRate: 0.0002, velocity: 2.4220, p1: 48000, p2: 45070, pressureDrop: 29300, length: 2.99, k: 10.0 },
      { component: "Globe valve", iteration: 2, flowRate: 0.0003, velocity: 3.2150, p1: 40000, p2: 34830, pressureDrop: 51700, length: 5.27, k: 10.0 },
      { component: "Globe valve", iteration: 3, flowRate: 0.0005, velocity: 5.3583, p1: 35000, p2: 20700, pressureDrop: 143000, length: 14.58, k: 10.0 },
      
      // Reducer (Contraction)
      { component: "Reducer (Contraction)", iteration: 1, flowRate: 0.0002, velocity: 2.4220, p1: 48000, p2: 47825, pressureDrop: 1475, length: 0.15, k: 0.50 },
      { component: "Reducer (Contraction)", iteration: 2, flowRate: 0.0003, velocity: 3.2150, p1: 40000, p2: 37400, pressureDrop: 2600, length: 0.27, k: 0.50 },
      { component: "Reducer (Contraction)", iteration: 3, flowRate: 0.0005, velocity: 5.3583, p1: 35000, p2: 34280, pressureDrop: 7200, length: 0.73, k: 0.50 }
    ];

    setCalculatedData(initialData);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-light tracking-tight mb-2">Fluid Flow Analysis</h1>
          <p className="text-zinc-400 text-sm">Component-wise flow calculations and measurements</p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Results Table */}
          <div className="col-span-12">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="text-lg font-light">Flow Calculations</h2>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <span>ρ = {density} kg/m³</span>
                  <span>•</span>
                  <span>μ = {viscosity} Pa·s</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Component</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Iteration</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Flow Rate (m³/s)</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Velocity (m/s)</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">P₁ (Pa)</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">P₂ (Pa)</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">ΔP (Pa)</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Length (m)</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">K</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {calculatedData.map((data, index) => (
                      <tr key={index} className="hover:bg-zinc-800/30">
                        <td className="px-6 py-4 font-mono text-sm">{data.component}</td>
                        <td className="px-6 py-4 font-mono text-sm">{data.iteration}</td>
                        <td className="px-6 py-4 font-mono text-sm">{data.flowRate.toFixed(4)}</td>
                        <td className="px-6 py-4 font-mono text-sm">{data.velocity.toFixed(4)}</td>
                        <td className="px-6 py-4 font-mono text-sm">{data.p1}</td>
                        <td className="px-6 py-4 font-mono text-sm">{data.p2}</td>
                        <td className="px-6 py-4 font-mono text-sm">{data.pressureDrop}</td>
                        <td className="px-6 py-4 font-mono text-sm">{data.length.toFixed(2)}</td>
                        <td className="px-6 py-4 font-mono text-sm">{data.k.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculation Details */}
              <div className="p-6 border-t border-zinc-800">
                <h3 className="text-lg font-light mb-4">Calculation Formulas</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="bg-zinc-800/50 p-4 rounded-xl">
                      <h4 className="text-sm font-medium mb-2">Velocity (V)</h4>
                      <p className="font-mono text-sm">V = Q/A</p>
                      <p className="text-xs text-zinc-400 mt-2">where Q is flow rate and A is cross-sectional area</p>
                    </div>
                    <div className="bg-zinc-800/50 p-4 rounded-xl">
                      <h4 className="text-sm font-medium mb-2">Pressure Drop (ΔP)</h4>
                      <p className="font-mono text-sm">ΔP = K × (ρV²/2)</p>
                      <p className="text-xs text-zinc-400 mt-2">where K is loss coefficient, ρ is density</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-zinc-800/50 p-4 rounded-xl">
                      <h4 className="text-sm font-medium mb-2">Equivalent Length (Le)</h4>
                      <p className="font-mono text-sm">Le = (2 × ΔP)/(K × ρV²)</p>
                      <p className="text-xs text-zinc-400 mt-2">where ΔP is pressure drop</p>
                    </div>
                    <div className="bg-zinc-800/50 p-4 rounded-xl">
                      <h4 className="text-sm font-medium mb-2">Loss Coefficient (K)</h4>
                      <p className="font-mono text-sm">K = constant for each component</p>
                      <p className="text-xs text-zinc-400 mt-2">based on component geometry and flow conditions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 