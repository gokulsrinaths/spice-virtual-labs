import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowDown, ArrowUp, Gauge, HelpCircle, Play, Pause, RotateCcw, Settings, ChevronDown, ChevronUp, RefreshCw, Download } from 'lucide-react';

interface PointData {
  x: number;
  y: number;
  velocity: number;
  pressure: number;
  elevation: number;
  totalHead: number;
  diameter: number;
  roughness: number;
  headLoss?: number;
  temperature: number;
}

interface FluidProperties {
  name: string;
  density: number;
  viscosity: number;
  description: string;
}

const FLUIDS: FluidProperties[] = [
  {
    name: "Water (20°C)",
    density: 998.2,
    viscosity: 0.001002,
    description: "Standard water at room temperature"
  },
  {
    name: "Water (40°C)",
    density: 992.2,
    viscosity: 0.000653,
    description: "Warm water"
  },
  {
    name: "Glycerin (20°C)",
    density: 1261,
    viscosity: 1.41,
    description: "High viscosity fluid"
  },
  {
    name: "Engine Oil (20°C)",
    density: 920,
    viscosity: 0.25,
    description: "Common lubricant"
  }
];

interface TutorialStep {
  title: string;
  content: string;
  highlight: string[];
}

export function EnergyEquationExperiment() {
  const [flowRate, setFlowRate] = useState(0.1); // m³/s
  const [points, setPoints] = useState<PointData[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [showEnergyLines, setShowEnergyLines] = useState(true);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [selectedFluid, setSelectedFluid] = useState<FluidProperties>(FLUIDS[0]);
  const [pipeRoughness, setPipeRoughness] = useState(0.0015); // mm
  const [showDataTable, setShowDataTable] = useState(false);
  const [measurementHistory, setMeasurementHistory] = useState<PointData[][]>([]);
  const [systemTemperature, setSystemTemperature] = useState(20);

  const density = 1000; // kg/m³ (water)
  const gravity = 9.81; // m/s²

  const tutorialSteps: TutorialStep[] = [
    {
      title: "Welcome to Energy Analysis",
      content: "This experiment demonstrates energy conservation in fluid flow systems. You'll analyze how energy transforms between different forms along a pipeline.",
      highlight: ["header"]
    },
    {
      title: "Flow Controls",
      content: "Adjust the flow rate to see how it affects velocity, pressure, and energy distribution in the system.",
      highlight: ["controls"]
    },
    {
      title: "Measurement Points",
      content: "Click on any point to see detailed energy calculations. Notice how total energy changes along the pipe.",
      highlight: ["visualization"]
    },
    {
      title: "Energy Lines",
      content: "The green dashed line shows total energy, while the blue line shows hydraulic grade line. The difference indicates energy losses.",
      highlight: ["energy-lines"]
    }
  ];

  const calculateViscosity = useCallback((baseViscosity: number, temperature: number) => {
    const referenceTemp = 20; // °C
    const activationEnergy = 2000; // J/mol
    const R = 8.314; // Gas constant
    const T1 = referenceTemp + 273.15;
    const T2 = temperature + 273.15;
    return baseViscosity * Math.exp((activationEnergy/R) * (1/T2 - 1/T1));
  }, []);

  const calculateDensity = useCallback((baseDensity: number, temperature: number) => {
    const referenceTemp = 20; // °C
    const thermalExpansion = 0.0002; // per °C (approximate)
    return baseDensity * (1 - thermalExpansion * (temperature - referenceTemp));
  }, []);

  const getCurrentFluidProperties = useCallback(() => {
    const viscosity = calculateViscosity(selectedFluid.viscosity, systemTemperature);
    const density = calculateDensity(selectedFluid.density, systemTemperature);
    return { viscosity, density };
  }, [selectedFluid, systemTemperature]);

  const calculateReynoldsNumber = useCallback((velocity: number, diameter: number) => {
    const { density, viscosity } = getCurrentFluidProperties();
    return (density * velocity * diameter) / viscosity;
  }, [getCurrentFluidProperties]);

  const calculateFrictionFactor = useCallback((reynolds: number, roughness: number, diameter: number) => {
    const relativeRoughness = roughness / diameter;
    if (reynolds < 2300) {
      return 64 / reynolds;
    } else {
      return 0.25 / Math.pow(Math.log10(relativeRoughness/3.7 + 5.74/Math.pow(reynolds, 0.9)), 2);
    }
  }, []);

  const calculateHeadLoss = useCallback((length: number, diameter: number, velocity: number, f: number) => {
    return f * (length / diameter) * (velocity * velocity) / (2 * gravity);
  }, [gravity]);

  const saveMeasurement = useCallback(() => {
    setMeasurementHistory(prev => [...prev, points]);
  }, [points]);

  const exportData = useCallback(() => {
    const headers = ['Point', 'Velocity (m/s)', 'Pressure (Pa)', 'Elevation (m)', 'Total Head (m)', 'Reynolds Number'];
    const rows = points.map((point, idx) => [
      idx + 1,
      point.velocity.toFixed(3),
      point.pressure.toFixed(0),
      point.elevation.toFixed(3),
      point.totalHead.toFixed(3),
      calculateReynoldsNumber(point.velocity, point.diameter).toFixed(0)
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'energy_analysis_data.csv';
    a.click();
  }, [points, calculateReynoldsNumber]);

  const resetExperiment = useCallback(() => {
    setFlowRate(0.1);
    setSelectedPoint(null);
    setIsSimulating(false);
    setMeasurementHistory([]);
    calculateHeads();
  }, []);

  const calculateHeads = useCallback(() => {
    const { density } = getCurrentFluidProperties();
    const gravity = 9.81;

    const newPoints: PointData[] = [
      {
        x: 0,
        y: 200,
        elevation: 10,
        diameter: 0.2,
        roughness: pipeRoughness,
        velocity: flowRate / (Math.PI * Math.pow(0.2, 2) / 4),
        pressure: 101325,
        totalHead: 0,
        temperature: systemTemperature
      },
      {
        x: 200,
        y: 150,
        elevation: 7.5,
        diameter: 0.15,
        roughness: pipeRoughness,
        velocity: flowRate / (Math.PI * Math.pow(0.15, 2) / 4),
        pressure: 95000,
        totalHead: 0,
        temperature: systemTemperature
      },
      {
        x: 400,
        y: 100,
        elevation: 5,
        diameter: 0.1,
        roughness: pipeRoughness,
        velocity: flowRate / (Math.PI * Math.pow(0.1, 2) / 4),
        pressure: 98000,
        totalHead: 0,
        temperature: systemTemperature
      }
    ];

    let cumulativeHeadLoss = 0;
    newPoints.forEach((point, index) => {
      const reynolds = calculateReynoldsNumber(point.velocity, point.diameter);
      const f = calculateFrictionFactor(reynolds, point.roughness, point.diameter);
      
      if (index > 0) {
        const prevPoint = newPoints[index - 1];
        const length = Math.sqrt(Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)) / 10;
        const headLoss = calculateHeadLoss(length, point.diameter, point.velocity, f);
        cumulativeHeadLoss += headLoss;
        point.headLoss = cumulativeHeadLoss;
      }

      const velocityHead = (point.velocity ** 2) / (2 * gravity);
      const pressureHead = point.pressure / (density * gravity);
      const elevationHead = point.elevation;
      point.totalHead = velocityHead + pressureHead + elevationHead;
    });

    setPoints(newPoints);
  }, [flowRate, pipeRoughness, systemTemperature, getCurrentFluidProperties, calculateReynoldsNumber, calculateFrictionFactor, calculateHeadLoss]);

  useEffect(() => {
    calculateHeads();
  }, [calculateHeads]);

  const renderEnergyLines = () => {
    if (!showEnergyLines || points.length === 0) return null;

    const totalEnergyLine = `M ${points[0].x + 50},${points[0].y - points[0].totalHead * 10} 
                            L ${points[1].x + 50},${points[1].y - points[1].totalHead * 10}
                            L ${points[2].x + 50},${points[2].y - points[2].totalHead * 10}`;

    const hydraulicGradeLine = points.map((point, i) => {
      const y = point.y - ((point.pressure / (getCurrentFluidProperties().density * gravity)) + point.elevation) * 10;
      return `${i === 0 ? 'M' : 'L'} ${point.x + 50},${y}`;
    }).join(' ');

    return (
      <g>
        <path
          d={totalEnergyLine}
          stroke="rgb(34, 197, 94)"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
        />
        <path
          d={hydraulicGradeLine}
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
        />
      </g>
    );
  };

  const renderPipeSystem = () => {
    return (
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          {/* Gradient for pipe */}
          <linearGradient id="pipe-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(37, 99, 235)" />
            <stop offset="100%" stopColor="rgb(59, 130, 246)" />
          </linearGradient>
          {/* Glow effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          {/* Flow animation */}
          <pattern id="flow-pattern" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
            <rect width="20" height="20" fill="none"/>
            <path d="M-5,5 l10,-10 M0,20 l20,-20 M15,25 l10,-10" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
          </pattern>
        </defs>

        {/* Background grid */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Pipe sections with animated flow pattern */}
        <g className="pipes">
          {points.map((point, index) => {
            if (index === points.length - 1) return null;
            const nextPoint = points[index + 1];
            const pipeWidth = point.diameter * 100; // Scale diameter for visualization
            
            return (
              <g key={`pipe-${index}`}>
                {/* Main pipe */}
                <path
                  d={`M ${point.x + 50},${point.y} L ${nextPoint.x + 50},${nextPoint.y}`}
                  stroke="url(#pipe-gradient)"
                  strokeWidth={pipeWidth}
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Animated flow pattern */}
                {isSimulating && (
                  <path
                    d={`M ${point.x + 50},${point.y} L ${nextPoint.x + 50},${nextPoint.y}`}
                    stroke="url(#flow-pattern)"
                    strokeWidth={pipeWidth * 0.8}
                    strokeLinecap="round"
                    fill="none"
                    className="animate-flow"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Energy lines with glow effect */}
        {renderEnergyLines()}

        {/* Measurement points with enhanced interaction */}
        {points.map((point, index) => (
          <g key={`point-${index}`} className="measurement-point">
            {/* Point highlight circle */}
            <circle
              cx={point.x + 50}
              cy={point.y}
              r={15}
              className={`transition-all duration-300 ${
                selectedPoint === index 
                  ? 'fill-blue-500 stroke-blue-300' 
                  : 'fill-blue-400/20 stroke-blue-400/50'
              }`}
              strokeWidth={2}
              filter="url(#glow)"
              onClick={() => setSelectedPoint(index)}
            />
            
            {/* Point label */}
            <text
              x={point.x + 50}
              y={point.y - 25}
              textAnchor="middle"
              className="text-sm fill-zinc-400 font-medium"
            >
              Point {index + 1}
            </text>

            {/* Data tooltip */}
            {selectedPoint === index && (
              <g>
                <rect
                  x={point.x + 70}
                  y={point.y - 40}
                  width="120"
                  height="80"
                  rx="4"
                  className="fill-zinc-800/90 stroke-zinc-700"
                />
                <text x={point.x + 80} y={point.y - 20} className="text-xs fill-zinc-300">
                  <tspan x={point.x + 80} dy="0">v = {point.velocity.toFixed(1)} m/s</tspan>
                  <tspan x={point.x + 80} dy="15">P = {(point.pressure / 1000).toFixed(1)} kPa</tspan>
                  <tspan x={point.x + 80} dy="15">h = {point.elevation.toFixed(1)} m</tspan>
                  <tspan x={point.x + 80} dy="15">∅ = {(point.diameter * 1000).toFixed(0)} mm</tspan>
                </text>
              </g>
            )}
          </g>
        ))}

        {/* Flow particles */}
        {isSimulating && Array.from({ length: 10 }).map((_, i) => (
          <circle
            key={`particle-${i}`}
            r={2}
            className="fill-blue-400"
            filter="url(#glow)"
          >
            <animateMotion
              dur={`${3 + i * 0.3}s`}
              repeatCount="indefinite"
              path={`M 50,200 L 200,150 L 350,100`}
            />
          </circle>
        ))}
      </svg>
    );
  };

  // Add this CSS to your styles
  const styles = `
    @keyframes flowAnimation {
      from {
        stroke-dashoffset: 20;
      }
      to {
        stroke-dashoffset: 0;
      }
    }

    .animate-flow {
      stroke-dasharray: 20;
      animation: flowAnimation 1s linear infinite;
    }
  `;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Add the styles */}
      <style>{styles}</style>
      
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
          <div className="mb-12 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-light tracking-tight mb-2">Energy Analysis</h1>
              <p className="text-zinc-400 text-sm">Study energy conservation in fluid flow systems</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowDataTable(!showDataTable)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                {showDataTable ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                Data Table
              </button>
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Download className="h-5 w-5" />
                Export Data
              </button>
              <button
                onClick={resetExperiment}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
                Reset
              </button>
              <button
                onClick={() => setShowTutorial(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <HelpCircle className="h-5 w-5" />
                Tutorial
              </button>
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                {isSimulating ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {isSimulating ? 'Pause' : 'Start'} Simulation
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Controls */}
            <div className="col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Flow Controls */}
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800">
                  <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-lg font-light">Flow Controls</h2>
                    <button
                      onClick={() => setShowAdvancedControls(!showAdvancedControls)}
                      className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      {showAdvancedControls ? 'Basic' : 'Advanced'} Controls
                    </button>
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

                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                        Fluid Type
                      </label>
                      <select
                        value={selectedFluid.name}
                        onChange={(e) => setSelectedFluid(FLUIDS.find(f => f.name === e.target.value) || FLUIDS[0])}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                      >
                        {FLUIDS.map(fluid => (
                          <option key={fluid.name} value={fluid.name}>{fluid.name}</option>
                        ))}
                      </select>
                      <div className="mt-2 text-sm text-zinc-400">
                        {selectedFluid.description}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                        System Temperature (°C)
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={80}
                        step={1}
                        value={systemTemperature}
                        onChange={(e) => setSystemTemperature(Number(e.target.value))}
                        className="w-full appearance-none bg-zinc-800 h-1.5 rounded-full"
                      />
                      <div className="mt-2 text-sm font-mono text-zinc-300">
                        {systemTemperature}°C
                      </div>
                    </div>

                    {showAdvancedControls && (
                      <>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-2">
                            Pipe Roughness (mm)
                          </label>
                          <input
                            type="range"
                            min={0.001}
                            max={0.005}
                            step={0.0001}
                            value={pipeRoughness}
                            onChange={(e) => setPipeRoughness(Number(e.target.value))}
                            className="w-full appearance-none bg-zinc-800 h-1.5 rounded-full"
                          />
                          <div className="mt-2 text-sm font-mono text-zinc-300">
                            {pipeRoughness.toFixed(4)} mm
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                          <label className="text-sm text-zinc-400">Show Energy Lines</label>
                          <button
                            onClick={() => setShowEnergyLines(!showEnergyLines)}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              showEnergyLines ? 'bg-blue-500' : 'bg-zinc-800'
                            }`}
                          >
                            {showEnergyLines ? 'On' : 'Off'}
                          </button>
                        </div>
                      </>
                    )}
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
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-light">Point {selectedPoint + 1} Analysis</h2>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-sm ${
                            calculateReynoldsNumber(points[selectedPoint].velocity, points[selectedPoint].diameter) < 2300
                              ? 'bg-blue-900/50 text-blue-300'
                              : 'bg-orange-900/50 text-orange-300'
                          }`}>
                            {calculateReynoldsNumber(points[selectedPoint].velocity, points[selectedPoint].diameter) < 2300
                              ? 'Laminar Flow'
                              : 'Turbulent Flow'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Velocity Section */}
                        <div className="col-span-2 bg-zinc-800/50 rounded-lg p-4">
                          <h3 className="text-sm text-zinc-400 mb-2">Velocity Analysis</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-zinc-500">Flow Speed</label>
                              <div className="text-lg font-mono text-blue-400">
                                {points[selectedPoint].velocity.toFixed(2)} m/s
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-500">Reynolds Number</label>
                              <div className="text-lg font-mono text-blue-400">
                                {calculateReynoldsNumber(
                                  points[selectedPoint].velocity,
                                  points[selectedPoint].diameter
                                ).toFixed(0)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 h-2 bg-zinc-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-500"
                              style={{ 
                                width: `${Math.min(100, (points[selectedPoint].velocity / 10) * 100)}%`
                              }}
                            />
                          </div>
                        </div>

                        {/* Pressure Section */}
                        <div className="col-span-2 bg-zinc-800/50 rounded-lg p-4">
                          <h3 className="text-sm text-zinc-400 mb-2">Pressure Analysis</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-zinc-500">Pressure</label>
                              <div className="text-lg font-mono text-green-400">
                                {(points[selectedPoint].pressure / 1000).toFixed(1)} kPa
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-500">Pressure Head</label>
                              <div className="text-lg font-mono text-green-400">
                                {(points[selectedPoint].pressure / (getCurrentFluidProperties().density * 9.81)).toFixed(2)} m
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 h-2 bg-zinc-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 transition-all duration-500"
                              style={{ 
                                width: `${(points[selectedPoint].pressure / 150000) * 100}%`
                              }}
                            />
                          </div>
                        </div>

                        {/* Elevation Section */}
                        <div className="col-span-1 bg-zinc-800/50 rounded-lg p-4">
                          <h3 className="text-sm text-zinc-400 mb-2">Elevation</h3>
                          <div>
                            <label className="text-xs text-zinc-500">Height</label>
                            <div className="text-lg font-mono text-purple-400">
                              {points[selectedPoint].elevation.toFixed(2)} m
                            </div>
                          </div>
                          <div className="mt-2 h-2 bg-zinc-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 transition-all duration-500"
                              style={{ 
                                width: `${(points[selectedPoint].elevation / 15) * 100}%`
                              }}
                            />
                          </div>
                        </div>

                        {/* Pipe Properties */}
                        <div className="col-span-1 bg-zinc-800/50 rounded-lg p-4">
                          <h3 className="text-sm text-zinc-400 mb-2">Pipe Properties</h3>
                          <div>
                            <label className="text-xs text-zinc-500">Diameter</label>
                            <div className="text-lg font-mono text-yellow-400">
                              {(points[selectedPoint].diameter * 1000).toFixed(0)} mm
                            </div>
                          </div>
                          <div className="mt-2 h-2 bg-zinc-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-500 transition-all duration-500"
                              style={{ 
                                width: `${(points[selectedPoint].diameter / 0.2) * 100}%`
                              }}
                            />
                          </div>
                        </div>

                        {/* Energy Components */}
                        <div className="col-span-2 bg-zinc-800/50 rounded-lg p-4">
                          <h3 className="text-sm text-zinc-400 mb-2">Energy Components</h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="text-xs text-zinc-500">Velocity Head</label>
                              <div className="text-lg font-mono text-blue-400">
                                {((points[selectedPoint].velocity ** 2) / (2 * 9.81)).toFixed(2)} m
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-500">Pressure Head</label>
                              <div className="text-lg font-mono text-green-400">
                                {(points[selectedPoint].pressure / (getCurrentFluidProperties().density * 9.81)).toFixed(2)} m
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-500">Elevation Head</label>
                              <div className="text-lg font-mono text-purple-400">
                                {points[selectedPoint].elevation.toFixed(2)} m
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="text-xs text-zinc-500">Total Head</label>
                            <div className="text-xl font-mono text-white">
                              {points[selectedPoint].totalHead.toFixed(2)} m
                            </div>
                          </div>
                        </div>

                        {/* Head Loss Section */}
                        {points[selectedPoint].headLoss !== undefined && (
                          <div className="col-span-2 bg-zinc-800/50 rounded-lg p-4">
                            <h3 className="text-sm text-zinc-400 mb-2">Head Loss Analysis</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-zinc-500">Cumulative Head Loss</label>
                                <div className="text-lg font-mono text-red-400">
                                  {points[selectedPoint].headLoss.toFixed(2)} m
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-zinc-500">Efficiency</label>
                                <div className="text-lg font-mono text-red-400">
                                  {(100 * (1 - points[selectedPoint].headLoss / points[selectedPoint].totalHead)).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 h-2 bg-zinc-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-500 transition-all duration-500"
                                style={{ 
                                  width: `${(points[selectedPoint].headLoss / points[selectedPoint].totalHead) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Right Column - Visualization */}
            <div className="col-span-8">
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
                <div className="aspect-[4/3] relative bg-black rounded-xl overflow-hidden">
                  {renderPipeSystem()}
                </div>

                {/* Legend */}
                <div className="mt-6 flex items-center justify-center gap-8 text-sm text-zinc-400">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-green-500"></div>
                    <span>Total Energy Line</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-blue-500"></div>
                    <span>Hydraulic Grade Line</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Measurement Point</span>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <AnimatePresence>
                {showDataTable && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-8 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden"
                  >
                    <div className="p-6 border-b border-zinc-800">
                      <h2 className="text-lg font-light">Measurement Data</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-zinc-800">
                            <th className="p-4 text-left text-sm font-normal text-zinc-400">Point</th>
                            <th className="p-4 text-left text-sm font-normal text-zinc-400">Velocity (m/s)</th>
                            <th className="p-4 text-left text-sm font-normal text-zinc-400">Pressure (kPa)</th>
                            <th className="p-4 text-left text-sm font-normal text-zinc-400">Elevation (m)</th>
                            <th className="p-4 text-left text-sm font-normal text-zinc-400">Reynolds Number</th>
                            <th className="p-4 text-left text-sm font-normal text-zinc-400">Flow Regime</th>
                            <th className="p-4 text-left text-sm font-normal text-zinc-400">Total Head (m)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {points.map((point, index) => {
                            const reynolds = calculateReynoldsNumber(point.velocity, point.diameter);
                            return (
                              <tr key={index} className="border-b border-zinc-800">
                                <td className="p-4 font-mono">Point {index + 1}</td>
                                <td className="p-4 font-mono">{point.velocity.toFixed(2)}</td>
                                <td className="p-4 font-mono">{(point.pressure / 1000).toFixed(1)}</td>
                                <td className="p-4 font-mono">{point.elevation.toFixed(2)}</td>
                                <td className="p-4 font-mono">{reynolds.toFixed(0)}</td>
                                <td className="p-4 font-mono">{reynolds < 2300 ? 'Laminar' : 'Turbulent'}</td>
                                <td className="p-4 font-mono">{point.totalHead.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-lg w-full mx-4"
          >
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-xl font-light">{tutorialSteps[currentTutorialStep].title}</h3>
            </div>
            <div className="p-6">
              <p className="text-zinc-400">{tutorialSteps[currentTutorialStep].content}</p>
            </div>
            <div className="p-6 border-t border-zinc-800 flex justify-between">
              <button
                onClick={() => setShowTutorial(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Skip Tutorial
              </button>
              <div className="flex items-center gap-4">
                {currentTutorialStep > 0 && (
                  <button
                    onClick={() => setCurrentTutorialStep(currentTutorialStep - 1)}
                    className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                  >
                    Previous
                  </button>
                )}
                {currentTutorialStep < tutorialSteps.length - 1 ? (
                  <button
                    onClick={() => setCurrentTutorialStep(currentTutorialStep + 1)}
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition-colors"
                  >
                    Finish
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}