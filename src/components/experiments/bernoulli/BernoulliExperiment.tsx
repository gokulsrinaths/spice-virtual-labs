import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wind, Gauge, ArrowRight, Ruler } from 'lucide-react';

interface SectionData {
  id: number;
  diameter: number;
  velocity: number;
  pressure: number;
}

export function BernoulliExperiment() {
  const [initialVelocity, setInitialVelocity] = useState(2); // m/s
  const [sections, setSections] = useState<SectionData[]>([]);

  const density = 1000; // kg/m³ (water)
  const initialDiameter = 0.1; // m
  const throatDiameter = 0.05; // m

  useEffect(() => {
    calculateFlow();
  }, [initialVelocity]);

  const calculateFlow = () => {
    // Calculate flow using continuity equation and Bernoulli's principle
    const area1 = Math.PI * (initialDiameter / 2) ** 2;
    const area2 = Math.PI * (throatDiameter / 2) ** 2;
    const area3 = area1;

    // Continuity equation: A₁v₁ = A₂v₂
    const throatVelocity = initialVelocity * (area1 / area2);
    const finalVelocity = initialVelocity;

    // Bernoulli's equation: P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂
    // Assuming same height (h₁ = h₂), calculate pressures
    const initialPressure = 101325; // Pa (atmospheric pressure)
    const throatPressure = initialPressure + 0.5 * density * (initialVelocity ** 2 - throatVelocity ** 2);
    const finalPressure = initialPressure;

    setSections([
      { id: 1, diameter: initialDiameter, velocity: initialVelocity, pressure: initialPressure },
      { id: 2, diameter: throatDiameter, velocity: throatVelocity, pressure: throatPressure },
      { id: 3, diameter: initialDiameter, velocity: finalVelocity, pressure: finalPressure }
    ]);
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
          <h2 className="text-lg font-light">Bernoulli's Principle</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-light tracking-tight mb-2">Flow Analysis</h1>
            <p className="text-zinc-400 text-sm">Study pressure and velocity relationships in fluid flow</p>
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
                    Initial Velocity (m/s)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={initialVelocity}
                    onChange={(e) => setInitialVelocity(Number(e.target.value))}
                        className="w-full appearance-none bg-zinc-800 h-1.5 rounded-full"
                  />
                      <div className="mt-2 text-sm font-mono text-zinc-300">
                    {initialVelocity} m/s
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
                {sections.length > 0 && (
            <motion.div
                    className="bg-zinc-900 rounded-2xl border border-zinc-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
                    <div className="p-6 border-b border-zinc-800">
                      <h2 className="text-lg font-light">Flow Data</h2>
                    </div>
                    <div className="p-6">
              <div className="space-y-6">
                {sections.map((section) => (
                          <div key={section.id} className="space-y-2">
                            <h3 className="text-sm font-medium text-zinc-400">
                              Section {section.id}
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                      <div>
                                <div className="text-xs text-zinc-500">Diameter</div>
                                <div className="text-sm font-mono text-zinc-300">
                                  {(section.diameter * 100).toFixed(1)} cm
                                </div>
                      </div>
                      <div>
                                <div className="text-xs text-zinc-500">Velocity</div>
                                <div className="text-sm font-mono text-zinc-300">
                                  {section.velocity.toFixed(2)} m/s
                      </div>
                      </div>
                      <div>
                                <div className="text-xs text-zinc-500">Pressure</div>
                                <div className="text-sm font-mono text-zinc-300">
                                  {(section.pressure / 1000).toFixed(2)} kPa
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                  {/* Pipe Visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-full h-48" viewBox="0 0 800 200">
                      {/* Pipe outline */}
                      <path
                        d="M100,80 L300,80 C350,80 350,120 400,120 C450,120 450,80 500,80 L700,80 L700,120 L500,120 C450,120 450,80 400,80 C350,80 350,120 300,120 L100,120 Z"
                        fill="none"
                        stroke="rgb(161, 161, 170)"
                        strokeWidth="2"
                      />

                    {/* Flow particles */}
                      {sections.length > 0 && Array.from({ length: 5 }).map((_, i) => (
                        <motion.circle
                          key={i}
                          r="4"
                          fill="rgb(59, 130, 246)"
                          initial={{ x: 100 }}
                          animate={{
                            x: [100, 700],
                            y: [100, 100],
                          }}
                          transition={{
                            duration: 4 / initialVelocity,
                            delay: i * (0.8 / initialVelocity),
                              repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      ))}

                      {/* Section labels */}
                      <text x="150" y="60" fill="rgb(161, 161, 170)" fontSize="14">Section 1</text>
                      <text x="380" y="150" fill="rgb(161, 161, 170)" fontSize="14">Section 2</text>
                      <text x="600" y="60" fill="rgb(161, 161, 170)" fontSize="14">Section 3</text>
                    </svg>
                    </div>

                  {/* Velocity and pressure indicators */}
                  {sections.length > 0 && (
                    <>
                      {sections.map((section) => {
                        const x = section.id === 1 ? "20%" : section.id === 2 ? "50%" : "80%";
                        return (
                    <div
                            key={section.id}
                            className="absolute top-1/4 flex flex-col items-center gap-2"
                            style={{ left: x }}
                          >
                            <div className="flex items-center gap-1 bg-zinc-900/80 px-2 py-1 rounded-lg backdrop-blur-sm">
                              <Wind className="w-4 h-4 text-blue-400" />
                              <span className="text-xs font-mono text-blue-400">
                                {section.velocity.toFixed(1)} m/s
                              </span>
                            </div>
                            <div className="flex items-center gap-1 bg-zinc-900/80 px-2 py-1 rounded-lg backdrop-blur-sm">
                              <Gauge className="w-4 h-4 text-emerald-400" />
                              <span className="text-xs font-mono text-emerald-400">
                                {(section.pressure / 1000).toFixed(1)} kPa
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}