import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Box, ArrowDown, ArrowUp, ChevronRight, Ruler } from 'lucide-react';

interface ObjectProperties {
  density: number;
  volume: number;
  mass: number;
  buoyantForce: number;
  netForce: number;
  state: 'floating' | 'sinking' | 'neutral';
}

export function BuoyancyExperiment() {
  const [objectDensity, setObjectDensity] = useState(1000);
  const [objectVolume, setObjectVolume] = useState(0.001);
  const [fluidDensity, setFluidDensity] = useState(1000);
  const [object, setObject] = useState<ObjectProperties | null>(null);

  const calculateBuoyancy = () => {
    const mass = objectDensity * objectVolume;
    const weight = mass * 9.81;
    const buoyantForce = fluidDensity * objectVolume * 9.81;
    const netForce = buoyantForce - weight;

    let state: 'floating' | 'sinking' | 'neutral';
    if (objectDensity < fluidDensity) {
      state = 'floating';
    } else if (objectDensity > fluidDensity) {
      state = 'sinking';
    } else {
      state = 'neutral';
    }

    setObject({
      density: objectDensity,
      volume: objectVolume,
      mass,
      buoyantForce,
      netForce,
      state
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation Menu */}
      <div className="h-16 w-full bg-zinc-900 border-b border-zinc-800 flex items-center px-8">
        <div className="flex items-center space-x-4">
          <button className="p-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <Scale className="h-5 w-5" />
          </button>
          <div className="h-5 border-r border-zinc-800"></div>
          <h2 className="text-lg font-light">Buoyancy Experiment</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-light tracking-tight mb-2">Buoyant Force Analysis</h1>
            <p className="text-zinc-400 text-sm">Study the behavior of objects in fluids</p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Controls */}
            <div className="col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Object Properties */}
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800">
                  <div className="p-6 border-b border-zinc-800">
                    <h2 className="text-lg font-light">Object Properties</h2>
                  </div>
                  <div className="p-6 space-y-6">
                <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                    Object Density (kg/m³)
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="2000"
                    value={objectDensity}
                    onChange={(e) => setObjectDensity(Number(e.target.value))}
                        className="w-full appearance-none bg-zinc-800 h-1.5 rounded-full"
                  />
                      <div className="mt-2 text-sm font-mono text-zinc-300">
                    {objectDensity} kg/m³
                  </div>
                </div>

                <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                    Object Volume (cm³)
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    value={objectVolume * 1000000}
                    onChange={(e) => setObjectVolume(Number(e.target.value) / 1000000)}
                        className="w-full appearance-none bg-zinc-800 h-1.5 rounded-full"
                  />
                      <div className="mt-2 text-sm font-mono text-zinc-300">
                    {(objectVolume * 1000000).toFixed(0)} cm³
                  </div>
                </div>

                <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                    Fluid Density (kg/m³)
                  </label>
                  <input
                    type="range"
                    min="800"
                    max="1200"
                    value={fluidDensity}
                    onChange={(e) => setFluidDensity(Number(e.target.value))}
                        className="w-full appearance-none bg-zinc-800 h-1.5 rounded-full"
                  />
                      <div className="mt-2 text-sm font-mono text-zinc-300">
                    {fluidDensity} kg/m³
                  </div>
                </div>

                <button
                  onClick={calculateBuoyancy}
                      className="w-full px-4 py-3 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  Calculate Forces
                      <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Results Panel */}
            {object && (
              <motion.div
                    className="bg-zinc-900 rounded-2xl border border-zinc-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                    <div className="p-6 border-b border-zinc-800">
                      <h2 className="text-lg font-light">Results</h2>
                    </div>
                    <div className="p-6 space-y-4">
                  <div>
                        <label className="text-sm text-zinc-400">Object Mass</label>
                        <div className="text-lg font-mono">{object.mass.toFixed(2)} kg</div>
                  </div>
                  
                  <div>
                        <label className="text-sm text-zinc-400">Buoyant Force</label>
                        <div className="text-lg font-mono">{object.buoyantForce.toFixed(2)} N</div>
                  </div>
                  
                  <div>
                        <label className="text-sm text-zinc-400">Net Force</label>
                        <div className="text-lg font-mono">
                          {Math.abs(object.netForce).toFixed(2)} N 
                          <span className="text-zinc-400 ml-2">
                            {object.netForce > 0 ? 'upward' : 'downward'}
                          </span>
                        </div>
                  </div>

                  <div>
                        <label className="text-sm text-zinc-400">Object State</label>
                        <div className={`text-lg font-medium ${
                          object.state === 'floating' ? 'text-emerald-400' :
                          object.state === 'sinking' ? 'text-red-400' :
                          'text-blue-400'
                        }`}>
                          {object.state.charAt(0).toUpperCase() + object.state.slice(1)}
                        </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
            </div>

            {/* Right Column - Visualization */}
            <div className="col-span-8">
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
                <div className="aspect-[4/3] relative bg-black/50 rounded-xl overflow-hidden">
                  {/* Water container */}
                  <div className="absolute inset-0">
                    {/* Water surface with gradient */}
                    <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-blue-900/5 to-blue-900/30 backdrop-blur-sm">
                      {/* Water surface waves */}
                      <motion.div
                        className="absolute inset-x-0 top-0 h-0.5 bg-blue-400/20"
                        animate={{
                          y: [0, 2, 0],
                          opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <motion.div
                        className="absolute inset-x-0 top-1 h-0.5 bg-blue-400/10"
                        animate={{
                          y: [0, 3, 0],
                          opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.2
                        }}
                      />
                    </div>
              
              {object && (
                <>
                  {/* Object */}
                  <motion.div
                          className="absolute left-1/2 -translate-x-1/2 w-24 h-24 flex items-center justify-center"
                          initial={{ y: "0%" }}
                    animate={{
                            y: object.state === 'floating' ? "25%" :
                               object.state === 'sinking' ? "150%" :
                               "75%"
                    }}
                          transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 20
                          }}
                  >
                          <div className={`w-full h-full rounded-xl ${
                            object.state === 'floating' ? 'bg-emerald-500/20 border-emerald-500/50' :
                            object.state === 'sinking' ? 'bg-red-500/20 border-red-500/50' :
                            'bg-blue-500/20 border-blue-500/50'
                          } border-2 backdrop-blur-sm relative group`}>
                    {/* Force vectors */}
                    <motion.div
                      className="absolute -left-16 inset-y-0 flex flex-col items-center justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                              <div className="flex items-center gap-1 bg-zinc-900/80 px-2 py-1 rounded-lg backdrop-blur-sm">
                                <ArrowUp className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-mono whitespace-nowrap text-emerald-400">
                          Fb = {object.buoyantForce.toFixed(1)} N
                        </span>
                      </div>
                              <div className="flex items-center gap-1 bg-zinc-900/80 px-2 py-1 rounded-lg backdrop-blur-sm">
                                <ArrowDown className="w-4 h-4 text-red-400" />
                                <span className="text-xs font-mono whitespace-nowrap text-red-400">
                          W = {(object.mass * 9.81).toFixed(1)} N
                        </span>
                      </div>
                    </motion.div>

                            {/* Object properties tooltip */}
                            <div className="absolute -right-32 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-zinc-900/80 backdrop-blur-sm px-3 py-2 rounded-lg">
                                <div className="text-xs font-mono space-y-1">
                                  <div>ρ = {object.density} kg/m³</div>
                                  <div>V = {(object.volume * 1000000).toFixed(0)} cm³</div>
                                  <div>m = {object.mass.toFixed(2)} kg</div>
                                </div>
                              </div>
                            </div>
                          </div>
                  </motion.div>

                        {/* Water level indicator */}
                        <div className="absolute right-4 inset-y-0 w-8 flex flex-col justify-between p-4">
                          <div className="text-xs font-mono text-zinc-400">0 m</div>
                          <div className="text-xs font-mono text-zinc-400">0.5 m</div>
                          <div className="text-xs font-mono text-zinc-400">1.0 m</div>
                        </div>

                        {/* Fluid properties */}
                        <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-sm p-4 rounded-lg">
                          <h3 className="text-sm text-zinc-400 mb-2">Fluid Properties</h3>
                          <div className="space-y-1 text-sm font-mono">
                            <div>ρf = {fluidDensity} kg/m³</div>
                            <div>g = 9.81 m/s²</div>
                          </div>
                        </div>
                </>
              )}
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