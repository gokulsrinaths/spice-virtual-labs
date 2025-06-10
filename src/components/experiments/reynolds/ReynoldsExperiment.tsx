import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wind, Ruler, Droplet } from 'lucide-react';

interface FluidData {
  name: string;
  density: number; // kg/m³
  viscosity: number; // Pa·s
  color: string;
}

interface FlowData {
  reynoldsNumber: number;
  flowRegime: 'laminar' | 'transitional' | 'turbulent';
}

const fluids: FluidData[] = [
  { name: 'Water', density: 1000, viscosity: 0.001, color: '#60A5FA' },
  { name: 'Oil', density: 900, viscosity: 0.03, color: '#FCD34D' },
  { name: 'Glycerin', density: 1260, viscosity: 0.95, color: '#F87171' },
  { name: 'Air', density: 1.225, viscosity: 0.0000181, color: '#A78BFA' }
];

export default function ReynoldsExperiment() {
  const [selectedFluid, setSelectedFluid] = useState<FluidData>(fluids[0]);
  const [velocity, setVelocity] = useState(1); // m/s
  const [diameter, setDiameter] = useState(0.05); // m
  const [flowData, setFlowData] = useState<FlowData | null>(null);

  useEffect(() => {
    calculateReynolds();
  }, [selectedFluid, velocity, diameter]);

  const calculateReynolds = () => {
    const reynolds = (selectedFluid.density * velocity * diameter) / selectedFluid.viscosity;
    
    let flowRegime: 'laminar' | 'transitional' | 'turbulent';
    if (reynolds < 2300) {
      flowRegime = 'laminar';
    } else if (reynolds < 4000) {
      flowRegime = 'transitional';
    } else {
      flowRegime = 'turbulent';
    }

    setFlowData({ reynoldsNumber: reynolds, flowRegime });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation Menu */}
      <div className="h-16 w-full bg-zinc-900 border-b border-zinc-800 flex items-center px-8">
        <div className="flex items-center space-x-4">
          <button className="p-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <Wind className="h-5 w-5" />
          </button>
          <div className="h-5 border-r border-zinc-800"></div>
          <h2 className="text-lg font-light">Reynolds Number</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-light tracking-tight mb-2">Flow Regime Analysis</h1>
            <p className="text-zinc-400 text-sm">Study laminar, transitional, and turbulent flow patterns</p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Controls */}
            <div className="col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Flow Controls */}
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800">
                  <div className="p-6 border-b border-zinc-800">
                    <h2 className="text-lg font-light">Flow Controls</h2>
                  </div>
                  <div className="p-6 space-y-6">
                <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                    Fluid Type
                  </label>
                  <select
                    value={selectedFluid.name}
                    onChange={(e) => setSelectedFluid(fluids.find(f => f.name === e.target.value) || fluids[0])}
                        className="w-full bg-zinc-800 border-zinc-700 rounded-xl text-white py-2 px-3"
                  >
                    {fluids.map(fluid => (
                      <option key={fluid.name} value={fluid.name}>{fluid.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                    Flow Velocity (m/s)
                  </label>
                  <input
                    type="range"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={velocity}
                    onChange={(e) => setVelocity(Number(e.target.value))}
                        className="w-full appearance-none bg-zinc-800 h-1.5 rounded-full"
                  />
                      <div className="mt-2 text-sm font-mono text-zinc-300">
                    {velocity.toFixed(1)} m/s
                  </div>
                </div>

                <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                    Pipe Diameter (cm)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={0.5}
                    value={diameter * 100}
                    onChange={(e) => setDiameter(Number(e.target.value) / 100)}
                        className="w-full appearance-none bg-zinc-800 h-1.5 rounded-full"
                  />
                      <div className="mt-2 text-sm font-mono text-zinc-300">
                    {(diameter * 100).toFixed(1)} cm
                  </div>
                </div>
              </div>
            </div>

            {/* Fluid Properties */}
            <motion.div
                  className="bg-zinc-900 rounded-2xl border border-zinc-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
                  <div className="p-6 border-b border-zinc-800">
                    <h2 className="text-lg font-light">Fluid Properties</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                <div>
                        <label className="text-sm text-zinc-400">Density</label>
                        <div className="text-lg font-mono">{selectedFluid.density} kg/m³</div>
                </div>
                <div>
                        <label className="text-sm text-zinc-400">Viscosity</label>
                        <div className="text-lg font-mono">{selectedFluid.viscosity} Pa·s</div>
                      </div>
                </div>
              </div>
            </motion.div>
          </div>
            </div>

            {/* Right Column - Visualization */}
            <div className="col-span-8">
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
                <div className="aspect-[4/3] relative bg-black/50 rounded-xl overflow-hidden">
              {flowData && (
                <div 
                  className="absolute inset-x-0 top-1/2 transition-all duration-300"
                  style={{ 
                    height: `${Math.max(diameter * 1000, 20)}px`,
                    transform: `translateY(-50%)`,
                    backgroundColor: selectedFluid.color + '20',
                    border: `2px solid ${selectedFluid.color}40`
                  }}
                >
                  {/* Flow particles */}
                  {Array.from({ length: Math.ceil(velocity * 5) }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 -translate-y-1/2 rounded-full"
                      style={{ 
                        backgroundColor: selectedFluid.color,
                        width: `${Math.max(diameter * 200, 4)}px`,
                        height: `${Math.max(diameter * 200, 4)}px`,
                        left: `${-10}%`
                      }}
                      animate={{
                        left: ['0%', '100%'],
                        y: flowData.flowRegime === 'turbulent' 
                          ? ['-50%', '-30%', '-70%', '-50%']
                          : flowData.flowRegime === 'transitional'
                          ? ['-50%', '-40%', '-60%', '-50%']
                          : '-50%',
                      }}
                      transition={{
                        duration: 5 / velocity,
                        repeat: Infinity,
                        delay: i * (0.5 / velocity),
                        ease: flowData.flowRegime === 'turbulent' 
                          ? 'easeInOut' 
                          : flowData.flowRegime === 'transitional'
                          ? 'linear'
                          : 'linear'
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Flow regime indicators */}
                  <div className="absolute bottom-4 left-4 space-y-2 bg-zinc-900/80 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <div className="text-sm font-mono">
                  Re = {flowData?.reynoldsNumber.toFixed(0)}
                </div>
                    <div className={`text-sm font-medium ${
                      flowData?.flowRegime === 'laminar' ? 'text-emerald-400' :
                      flowData?.flowRegime === 'transitional' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                  {flowData?.flowRegime} Flow
                </div>
              </div>

              {/* Flow characteristics */}
                  <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-sm p-4 rounded-lg">
                    <h3 className="text-sm text-zinc-400 mb-2">Flow Properties</h3>
                    <div className="space-y-1 text-sm font-mono">
                  <div>Velocity: {velocity.toFixed(1)} m/s</div>
                  <div>Diameter: {(diameter * 100).toFixed(1)} cm</div>
                  <div>Fluid: {selectedFluid.name}</div>
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