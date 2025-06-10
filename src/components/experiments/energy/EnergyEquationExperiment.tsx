import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowDown, ArrowUp, Gauge } from 'lucide-react';

interface PointData {
  x: number;
  y: number;
  velocity: number;
  pressure: number;
  elevation: number;
  totalHead: number;
}

export function EnergyEquationExperiment() {
  const [flowRate, setFlowRate] = useState(0.1); // m³/s
  const [points, setPoints] = useState<PointData[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  const density = 1000; // kg/m³ (water)
  const gravity = 9.81; // m/s²

  useEffect(() => {
    calculateHeads();
  }, [flowRate]);

  const calculateHeads = () => {
    const newPoints: PointData[] = [
      {
        x: 0,
        y: 200,
        elevation: 10,
        velocity: flowRate / 0.1,
        pressure: 101325,
        totalHead: 0
      },
      {
        x: 200,
        y: 150,
        elevation: 7.5,
        velocity: flowRate / 0.05,
        pressure: 95000,
        totalHead: 0
      },
      {
        x: 400,
        y: 100,
        elevation: 5,
        velocity: flowRate / 0.15,
        pressure: 98000,
        totalHead: 0
      }
    ];

    // Calculate total head for each point
    newPoints.forEach(point => {
      const velocityHead = (point.velocity ** 2) / (2 * gravity);
      const pressureHead = point.pressure / (density * gravity);
      const elevationHead = point.elevation;
      point.totalHead = velocityHead + pressureHead + elevationHead;
    });

    setPoints(newPoints);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation Menu */}
      <div className="h-16 w-full bg-zinc-900 border-b border-zinc-800 flex items-center px-8">
        <div className="flex items-center space-x-4">
          <button className="p-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <Zap className="h-5 w-5" />
          </button>
          <div className="h-5 border-r border-zinc-800"></div>
          <h2 className="text-lg font-light">Energy Equation</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-light tracking-tight mb-2">Energy Analysis</h1>
            <p className="text-zinc-400 text-sm">Study energy conservation in fluid flow systems</p>
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
                    Flow Rate (m³/s)
                  </label>
                  <input
                    type="range"
                    min={0.05}
                    max={0.2}
                    step={0.01}
                    value={flowRate}
                    onChange={(e) => setFlowRate(Number(e.target.value))}
                        className="w-full appearance-none bg-zinc-800 h-1.5 rounded-full"
                  />
                      <div className="mt-2 text-sm font-mono text-zinc-300">
                    {flowRate.toFixed(2)} m³/s
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            {selectedPoint !== null && (
              <motion.div
                    className="bg-zinc-900 rounded-2xl border border-zinc-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                    <div className="p-6 border-b border-zinc-800">
                      <h2 className="text-lg font-light">Point Analysis</h2>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-6">
                  <div>
                          <label className="text-sm text-zinc-400">Velocity Head</label>
                          <div className="text-lg font-mono">
                      {((points[selectedPoint].velocity ** 2) / (2 * gravity)).toFixed(2)} m
                    </div>
                  </div>
                  <div>
                          <label className="text-sm text-zinc-400">Pressure Head</label>
                          <div className="text-lg font-mono">
                      {(points[selectedPoint].pressure / (density * gravity)).toFixed(2)} m
                    </div>
                  </div>
                  <div>
                          <label className="text-sm text-zinc-400">Elevation Head</label>
                          <div className="text-lg font-mono">
                      {points[selectedPoint].elevation.toFixed(2)} m
                    </div>
                  </div>
                  <div>
                          <label className="text-sm text-zinc-400">Total Head</label>
                          <div className="text-lg font-mono">
                      {points[selectedPoint].totalHead.toFixed(2)} m
                          </div>
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
              {/* Pipe sections */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d="M 50,200 L 200,150 L 350,100"
                      stroke="rgb(59, 130, 246)"
                  strokeWidth="20"
                  fill="none"
                />
              </svg>

              {/* Measurement points */}
              {points.map((point, index) => (
                <motion.div
                  key={index}
                  className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full cursor-pointer
                        ${selectedPoint === index ? 'bg-blue-500' : 'bg-blue-400/20 border border-blue-400/50'}
                        hover:bg-blue-400/40 transition-colors backdrop-blur-sm`}
                  style={{ left: point.x + 50, top: point.y }}
                  onClick={() => setSelectedPoint(index)}
                  whileHover={{ scale: 1.1 }}
                >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-mono text-zinc-400">
                    Point {index + 1}
                  </div>
                      {selectedPoint === index && (
                        <motion.div
                          className="absolute -right-32 top-1/2 -translate-y-1/2 bg-zinc-900/80 backdrop-blur-sm px-3 py-2 rounded-lg"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <div className="text-xs font-mono space-y-1">
                            <div>v = {point.velocity.toFixed(1)} m/s</div>
                            <div>P = {(point.pressure / 1000).toFixed(1)} kPa</div>
                            <div>h = {point.elevation.toFixed(1)} m</div>
                          </div>
                        </motion.div>
                      )}
                </motion.div>
              ))}

              {/* Flow particles */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                      className="absolute w-2 h-2 bg-blue-400/80 rounded-full"
                  animate={{
                    x: [50, 400],
                    y: [200, 100],
                    transition: {
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.6
                    }
                  }}
                />
              ))}

                  {/* Energy line */}
                  {points.length > 0 && (
                    <svg className="absolute inset-0 w-full h-full">
                      <path
                        d={`M ${points[0].x + 50},${points[0].y - points[0].totalHead * 10} 
                           L ${points[1].x + 50},${points[1].y - points[1].totalHead * 10}
                           L ${points[2].x + 50},${points[2].y - points[2].totalHead * 10}`}
                        stroke="rgb(34, 197, 94)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        fill="none"
                      />
                    </svg>
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