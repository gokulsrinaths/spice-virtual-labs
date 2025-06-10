import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Plus, Trash, Calculator } from 'lucide-react';
import { FlowCalculations, FlowParameters, FlowResults } from './FlowCalculations';
import { CalculationDialog } from './CalculationDialog';

interface SavedCalculation {
  id: string;
  component: string;
  iteration: number;
  results: FlowResults;
  timestamp: number;
  workShown: {
    velocity: string;
    p1: string;
    p2: string;
    pressureDrop: string;
    length: string;
  };
}

interface ManualCalculation {
  velocity: string;
  p1: string;
  p2: string;
  pressureDrop: string;
  length: string;
}

type CalculationField = 'velocity' | 'p1' | 'p2' | 'pressureDrop' | 'length';

export function FlowCalculatorDisplay() {
  const [selectedComponent, setSelectedComponent] = useState<string>('90-degree smooth bend');
  const [flowRate, setFlowRate] = useState<number>(0.0002);
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [manualCalc, setManualCalc] = useState<ManualCalculation>({
    velocity: '',
    p1: '',
    p2: '',
    pressureDrop: '',
    length: ''
  });
  const [workShown, setWorkShown] = useState<ManualCalculation>({
    velocity: '',
    p1: '',
    p2: '',
    pressureDrop: '',
    length: ''
  });
  const [activeCalculation, setActiveCalculation] = useState<CalculationField | null>(null);
  
  const PIPE_DIAMETER = 0.0102; // m
  const WATER_DENSITY = 1000;   // kg/m³
  const WATER_VISCOSITY = 0.001; // Pa·s
  const PIPE_AREA = Math.PI * Math.pow(PIPE_DIAMETER, 2) / 4;

  const components = [
    '90-degree smooth bend',
    'Globe valve',
    'Reducer (Contraction)'
  ];

  const flowRates = FlowCalculations.getIterationFlowRates();

  const getCalculationProps = (field: CalculationField) => {
    const defaultParams = FlowCalculations.getDefaultParameters(selectedComponent);
    const k = defaultParams.k || 0.2;

    switch (field) {
      case 'velocity':
        return {
          title: 'Calculate Velocity',
          formula: 'V = Q / A',
          variables: {
            'Q': `${flowRate} m³/s`,
            'A': `${PIPE_AREA.toExponential(4)} m²`
          }
        };
      case 'pressureDrop':
        return {
          title: 'Calculate Pressure Drop',
          formula: 'ΔP = K × (ρV²/2)',
          variables: {
            'K': `${k}`,
            'ρ': `${WATER_DENSITY} kg/m³`,
            'V': `${manualCalc.velocity} m/s`
          }
        };
      case 'p1':
        return {
          title: 'Initial Pressure',
          formula: 'P₁ = Initial System Pressure',
          variables: {
            'P₁(suggested)': '48000 Pa'
          }
        };
      case 'p2':
        return {
          title: 'Calculate Final Pressure',
          formula: 'P₂ = P₁ - ΔP',
          variables: {
            'P₁': `${manualCalc.p1} Pa`,
            'ΔP': `${manualCalc.pressureDrop} Pa`
          }
        };
      case 'length':
        return {
          title: 'Calculate Equivalent Length',
          formula: 'Le = (2 × ΔP)/(K × ρV²)',
          variables: {
            'ΔP': `${manualCalc.pressureDrop} Pa`,
            'K': `${k}`,
            'ρ': `${WATER_DENSITY} kg/m³`,
            'V': `${manualCalc.velocity} m/s`
          }
        };
      default:
        return {
          title: '',
          formula: '',
          variables: {}
        };
    }
  };

  const handleCalculationSubmit = (field: CalculationField, value: number, work: string) => {
    setManualCalc(prev => ({
      ...prev,
      [field]: value.toString()
    }));
    setWorkShown(prev => ({
      ...prev,
      [field]: work
    }));
    setActiveCalculation(null);
  };

  const verifyCalculations = () => {
    const expected = calculateExpectedResults();
    const errorMargin = 0.05; // 5% error margin

    // Convert manual inputs to numbers
    const manual = {
      velocity: parseFloat(manualCalc.velocity),
      p1: parseFloat(manualCalc.p1),
      p2: parseFloat(manualCalc.p2),
      pressureDrop: parseFloat(manualCalc.pressureDrop),
      length: parseFloat(manualCalc.length)
    };

    // Check for invalid inputs
    if (Object.values(manual).some(isNaN)) {
      setErrorMessage('Please complete all calculations');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return false;
    }

    // Verify each calculation within error margin
    const isVelocityCorrect = Math.abs(manual.velocity - expected.velocity) / expected.velocity <= errorMargin;
    const isPressureDropCorrect = Math.abs(manual.pressureDrop - expected.pressureDrop) / expected.pressureDrop <= errorMargin;
    const isLengthCorrect = Math.abs(manual.length - expected.length) / expected.length <= errorMargin;
    const isP1Correct = Math.abs(manual.p1 - expected.p1) / expected.p1 <= errorMargin;
    const isP2Correct = Math.abs(manual.p2 - expected.p2) / expected.p2 <= errorMargin;

    if (!isVelocityCorrect || !isPressureDropCorrect || !isLengthCorrect || !isP1Correct || !isP2Correct) {
      setErrorMessage('One or more calculations are incorrect. Check your work and try again.');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return false;
    }

    return true;
  };

  const calculateExpectedResults = () => {
    const defaultParams = FlowCalculations.getDefaultParameters(selectedComponent);
    const params: FlowParameters = {
      flowRate,
      diameter: PIPE_DIAMETER,
      density: WATER_DENSITY,
      k: defaultParams.k || 0.2,
      p1: defaultParams.p1
    };

    return FlowCalculations.calculateFlowParameters(params);
  };

  const saveCalculation = () => {
    if (!verifyCalculations()) return;

    const results: FlowResults = {
      velocity: parseFloat(manualCalc.velocity),
      p1: parseFloat(manualCalc.p1),
      p2: parseFloat(manualCalc.p2),
      pressureDrop: parseFloat(manualCalc.pressureDrop),
      length: parseFloat(manualCalc.length),
      k: FlowCalculations.getDefaultParameters(selectedComponent).k || 0.2,
      isWithinError: true
    };

    const newCalculation: SavedCalculation = {
      id: Math.random().toString(36).substr(2, 9),
      component: selectedComponent,
      iteration: savedCalculations.filter(c => c.component === selectedComponent).length + 1,
      results,
      timestamp: Date.now(),
      workShown
    };

    setSavedCalculations(prev => [...prev, newCalculation]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    // Reset calculations
    setManualCalc({
      velocity: '',
      p1: '',
      p2: '',
      pressureDrop: '',
      length: ''
    });
    setWorkShown({
      velocity: '',
      p1: '',
      p2: '',
      pressureDrop: '',
      length: ''
    });
  };

  const deleteCalculation = (id: string) => {
    setSavedCalculations(prev => prev.filter(calc => calc.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-light">Manual Flow Calculator</h2>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>D = {(PIPE_DIAMETER * 1000).toFixed(1)} mm</span>
            <span>•</span>
            <span>ρ = {WATER_DENSITY} kg/m³</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Component</label>
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm"
            >
              {components.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Flow Rate (m³/s)</label>
            <select
              value={flowRate}
              onChange={(e) => setFlowRate(Number(e.target.value))}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm"
            >
              {flowRates.map(rate => (
                <option key={rate} value={rate}>{rate.toFixed(4)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Manual Input Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Velocity (m/s)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={manualCalc.velocity}
                readOnly
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm font-mono"
                placeholder="Click Calculate"
              />
              <button
                onClick={() => setActiveCalculation('velocity')}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium transition-colors"
              >
                Calculate
              </button>
            </div>
            {workShown.velocity && (
              <div className="mt-2 text-xs text-zinc-500 font-mono">
                Work shown: {workShown.velocity}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Initial Pressure P₁ (Pa)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={manualCalc.p1}
                readOnly
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm font-mono"
                placeholder="Click Calculate"
              />
              <button
                onClick={() => setActiveCalculation('p1')}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium transition-colors"
              >
                Calculate
              </button>
            </div>
            {workShown.p1 && (
              <div className="mt-2 text-xs text-zinc-500 font-mono">
                Work shown: {workShown.p1}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Pressure Drop ΔP (Pa)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={manualCalc.pressureDrop}
                readOnly
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm font-mono"
                placeholder="Click Calculate"
              />
              <button
                onClick={() => setActiveCalculation('pressureDrop')}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium transition-colors"
              >
                Calculate
              </button>
            </div>
            {workShown.pressureDrop && (
              <div className="mt-2 text-xs text-zinc-500 font-mono">
                Work shown: {workShown.pressureDrop}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Final Pressure P₂ (Pa)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={manualCalc.p2}
                readOnly
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm font-mono"
                placeholder="Click Calculate"
              />
              <button
                onClick={() => setActiveCalculation('p2')}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium transition-colors"
              >
                Calculate
              </button>
            </div>
            {workShown.p2 && (
              <div className="mt-2 text-xs text-zinc-500 font-mono">
                Work shown: {workShown.p2}
              </div>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-zinc-400 mb-2">Equivalent Length (m)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={manualCalc.length}
                readOnly
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm font-mono"
                placeholder="Click Calculate"
              />
              <button
                onClick={() => setActiveCalculation('length')}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium transition-colors"
              >
                Calculate
              </button>
            </div>
            {workShown.length && (
              <div className="mt-2 text-xs text-zinc-500 font-mono">
                Work shown: {workShown.length}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={saveCalculation}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Verify and Add to Table
        </button>
      </div>

      {/* Saved Calculations Table */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-light tracking-tight">VIRTUAL LAB DATA TABLE</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-mono text-zinc-400">Component</th>
                <th className="px-6 py-4 text-left text-sm font-mono text-zinc-400">Iteration</th>
                <th className="px-6 py-4 text-left text-sm font-mono text-zinc-400">Flow Rate (m³/s)</th>
                <th className="px-6 py-4 text-left text-sm font-mono text-zinc-400">Velocity (m/s)</th>
                <th className="px-6 py-4 text-left text-sm font-mono text-zinc-400">P₁ (Pa)</th>
                <th className="px-6 py-4 text-left text-sm font-mono text-zinc-400">P₂ (Pa)</th>
                <th className="px-6 py-4 text-left text-sm font-mono text-zinc-400">ΔP (Pa)</th>
                <th className="px-6 py-4 text-left text-sm font-mono text-zinc-400">Length (m)</th>
                <th className="px-6 py-4 text-left text-sm font-mono text-zinc-400">K</th>
                <th className="px-6 py-4 text-left text-sm font-mono text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <AnimatePresence>
                {savedCalculations.map((calc) => (
                  <motion.tr
                    key={calc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="hover:bg-black transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-zinc-100">{calc.component}</td>
                    <td className="px-6 py-4 font-mono text-sm text-zinc-100">{calc.iteration}</td>
                    <td className="px-6 py-4 font-mono text-sm text-zinc-100">{flowRate.toFixed(4)}</td>
                    <td className="px-6 py-4 font-mono text-sm text-zinc-100 group-hover:relative">
                      <span>{calc.results.velocity.toFixed(4)}</span>
                      {calc.workShown.velocity && (
                        <div className="hidden group-hover:block absolute top-full left-0 mt-2 p-3 bg-black rounded-lg border border-zinc-800 text-xs z-10">
                          {calc.workShown.velocity}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-zinc-100">{calc.results.p1}</td>
                    <td className="px-6 py-4 font-mono text-sm text-zinc-100">{calc.results.p2}</td>
                    <td className="px-6 py-4 font-mono text-sm text-zinc-100">{calc.results.pressureDrop}</td>
                    <td className="px-6 py-4 font-mono text-sm text-zinc-100">{calc.results.length.toFixed(2)}</td>
                    <td className="px-6 py-4 font-mono text-sm text-zinc-100">{calc.results.k.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteCalculation(calc.id)}
                        className="text-zinc-400 hover:text-red-400 transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculation Dialog */}
      {activeCalculation && (
        <CalculationDialog
          isOpen={true}
          onClose={() => setActiveCalculation(null)}
          onSubmit={(value, work) => handleCalculationSubmit(activeCalculation, value, work)}
          {...getCalculationProps(activeCalculation)}
        />
      )}

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 right-8 bg-emerald-500/90 text-white px-6 py-4 rounded-xl backdrop-blur-sm flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-4" />
            Calculations verified and added successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 right-8 bg-red-500/90 text-white px-6 py-4 rounded-xl backdrop-blur-sm flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-4" />
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 