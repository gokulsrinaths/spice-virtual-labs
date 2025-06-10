import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ExperimentState, MeasurementPoint, FLUIDS, MAX_DEPTH, MIN_DEPTH } from './types';
import { calculateHydrostaticPressure, formatPressure, formatPressureBar, formatDepth, formatDensity, generateEquation } from './utils';
import { FluidTank } from './components/FluidTank';
import { DataTable } from './components/DataTable';

export function HydrostaticPressureExperiment() {
  // Experiment state
  const [state, setState] = useState<ExperimentState>({
    selectedFluid: FLUIDS[0],
    depth: 1.0,
    pressure: calculateHydrostaticPressure(FLUIDS[0].density, 1.0)
  });

  // Measurement history
  const [measurements, setMeasurements] = useState<MeasurementPoint[]>([]);
  
  // Graph toggle
  const [showGraph, setShowGraph] = useState(false);

  // Handle fluid selection
  const handleFluidChange = (fluidName: string) => {
    const fluid = FLUIDS.find(f => f.name === fluidName) || FLUIDS[0];
    setState(prev => ({
      ...prev,
      selectedFluid: fluid,
      pressure: calculateHydrostaticPressure(fluid.density, prev.depth)
    }));
  };

  // Handle depth change
  const handleDepthChange = (depth: number) => {
    setState(prev => ({
      ...prev,
      depth,
      pressure: calculateHydrostaticPressure(prev.selectedFluid.density, depth)
    }));
  };

  // Record measurement
  const recordMeasurement = () => {
    const newPoint: MeasurementPoint = {
      fluid: state.selectedFluid.name,
      density: state.selectedFluid.density,
      depth: state.depth,
      pressure: state.pressure,
      timestamp: Date.now()
    };
    setMeasurements(prev => [...prev, newPoint]);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-light tracking-tight mb-3">
              Hydrostatic Pressure
            </h1>
            <p className="text-zinc-400 text-lg">
              P = ρgh
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Controls */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fluid Selection */}
            <div className="space-y-2">
              <label className="block text-sm text-zinc-400">
                Fluid Type
              </label>
              <select
                value={state.selectedFluid.name}
                onChange={(e) => handleFluidChange(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-700 transition-colors"
              >
                {FLUIDS.map(fluid => (
                  <option key={fluid.name} value={fluid.name}>
                    {fluid.name} (ρ = {formatDensity(fluid.density)})
                  </option>
                ))}
              </select>
            </div>

            {/* Depth Control */}
            <div className="space-y-2">
              <label className="block text-sm text-zinc-400">
                Depth
              </label>
              <input
                type="range"
                min={MIN_DEPTH}
                max={MAX_DEPTH}
                step={0.01}
                value={state.depth}
                onChange={(e) => handleDepthChange(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-zinc-400">
                <span>{formatDepth(MIN_DEPTH)}</span>
                <span className="text-white font-medium">{formatDepth(state.depth)}</span>
                <span>{formatDepth(MAX_DEPTH)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Visualization */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tank */}
            <div className="bg-zinc-900 rounded-2xl p-8">
              <div className="aspect-[4/3]">
                <FluidTank
                  fluid={state.selectedFluid}
                  depth={state.depth}
                  maxDepth={MAX_DEPTH}
                />
              </div>
            </div>

            {/* Results */}
            <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col">
              <div className="font-mono text-sm text-zinc-400 mb-8 p-6 bg-black/30 rounded-xl">
                <pre className="whitespace-pre-wrap">
                  {generateEquation(state.selectedFluid.density, state.depth)}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="p-6 bg-black/30 rounded-xl">
                  <div className="text-sm text-zinc-400 mb-1">SI Units</div>
                  <div className="text-2xl font-light">{formatPressure(state.pressure)}</div>
                </div>
                <div className="p-6 bg-black/30 rounded-xl">
                  <div className="text-sm text-zinc-400 mb-1">Bar</div>
                  <div className="text-2xl font-light">{formatPressureBar(state.pressure)}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={recordMeasurement}
            className="px-6 py-3 rounded-xl font-medium bg-white text-black hover:bg-zinc-200 transition-colors"
          >
            Record Measurement
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowGraph(!showGraph)}
            className="px-6 py-3 rounded-xl font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
          >
            {showGraph ? 'Hide Graph' : 'Show Graph'}
          </motion.button>
        </section>

        {/* Graph */}
        <AnimatePresence>
          {showGraph && measurements.length > 0 && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-zinc-900 rounded-2xl p-8">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={measurements}>
                      <XAxis
                        dataKey="depth"
                        name="Depth"
                        unit=" m"
                        stroke="#71717a"
                      />
                      <YAxis
                        dataKey="pressure"
                        name="Pressure"
                        unit=" Pa"
                        stroke="#71717a"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181b',
                          border: 'none',
                          borderRadius: '0.5rem',
                        }}
                        formatter={(value: number, name: string) => {
                          if (name === 'pressure') return [formatPressure(value), 'Pressure'];
                          if (name === 'depth') return [formatDepth(value), 'Depth'];
                          return [value, name];
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="pressure"
                        stroke="#fff"
                        strokeWidth={1.5}
                        dot={{ fill: '#fff', strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Data Table */}
        {measurements.length > 0 && (
          <section>
            <DataTable
              measurements={measurements}
              onClear={() => setMeasurements([])}
            />
          </section>
        )}
      </main>
    </div>
  );
} 