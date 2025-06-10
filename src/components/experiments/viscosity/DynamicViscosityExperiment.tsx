import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BallProperties, FluidProperties, FLUIDS, BALLS, SimulationState, ExperimentResults, MeasurementPoint } from './types';
import { calculateTerminalVelocity, calculateDynamicViscosity, calculateKinematicViscosity, generateMeasurements, hasReachedTerminalVelocity, formatValue } from './utils';
import { FallingBallVisualization } from './FallingBallVisualization';
import { ExperimentGraphs } from './ExperimentGraphs';

export function DynamicViscosityExperiment() {
  // Experiment parameters
  const [selectedFluid, setSelectedFluid] = useState<FluidProperties>(FLUIDS.water);
  const [selectedBall, setSelectedBall] = useState<BallProperties>(BALLS[0]);
  
  // Simulation state
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: false,
    currentTime: 0,
    currentPosition: 1.5, // Start at top
    currentVelocity: 0,
    hasReachedTerminal: false
  });

  // Results
  const [results, setResults] = useState<ExperimentResults>({
    terminalVelocity: 0,
    dynamicViscosity: 0,
    kinematicViscosity: 0,
    timeToTerminal: 0,
    measurements: []
  });

  // Data points for graphs
  const [dataPoints, setDataPoints] = useState<MeasurementPoint[]>([]);

  // Calculate terminal velocity and generate measurements
  const initializeExperiment = useCallback(() => {
    const terminalVelocity = calculateTerminalVelocity(selectedBall, selectedFluid);
    const measurements = generateMeasurements(5, terminalVelocity);
    const timeToTerminal = measurements.find(m => 
      hasReachedTerminalVelocity(m.velocity, terminalVelocity)
    )?.time || 0;

    const dynamicViscosity = calculateDynamicViscosity(
      selectedBall,
      selectedFluid,
      terminalVelocity
    );

    const kinematicViscosity = calculateKinematicViscosity(
      dynamicViscosity,
      selectedFluid.density
    );

    setResults({
      terminalVelocity,
      dynamicViscosity,
      kinematicViscosity,
      timeToTerminal,
      measurements
    });
  }, [selectedBall, selectedFluid]);

  // Reset experiment
  const resetExperiment = () => {
    setSimulationState({
      isRunning: false,
      currentTime: 0,
      currentPosition: 1.5, // Reset to top
      currentVelocity: 0,
      hasReachedTerminal: false
    });
    setDataPoints([]);
    initializeExperiment();
  };

  // Start experiment
  const startExperiment = () => {
    setSimulationState({
      isRunning: true,
      currentTime: 0,
      currentPosition: 1.5, // Start at top
      currentVelocity: 0,
      hasReachedTerminal: false
    });
    setDataPoints([]);
  };

  // Update simulation state
  useEffect(() => {
    if (!simulationState.isRunning) return;

    const duration = 5; // Total animation duration in seconds
    const startPosition = 1.5; // Start at top
    const endPosition = 0; // End at bottom
    const frameRate = 60; // Frames per second
    const totalFrames = duration * frameRate;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      
      // Calculate current position using easeInOut
      const progress = frame / totalFrames;
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      const newPosition = startPosition - (startPosition - endPosition) * easeProgress;
      
      // Calculate approximate velocity
      const velocity = results.terminalVelocity * (1 - Math.exp(-progress * 5));

      if (frame >= totalFrames) {
        setSimulationState(prev => ({
          ...prev,
          isRunning: false,
          currentPosition: endPosition,
          currentVelocity: 0
        }));
        clearInterval(interval);
        return;
      }

      setSimulationState(prev => ({
        ...prev,
        currentTime: (frame / frameRate),
        currentPosition: newPosition,
        currentVelocity: velocity,
        hasReachedTerminal: progress > 0.7
      }));

      // Add data point
      setDataPoints(prev => [...prev, {
        time: frame / frameRate,
        position: newPosition,
        velocity: velocity
      }]);

    }, 1000 / frameRate);

    return () => clearInterval(interval);
  }, [simulationState.isRunning, results.terminalVelocity]);

  // Initialize experiment on parameter change
  useEffect(() => {
    resetExperiment();
  }, [selectedBall, selectedFluid, initializeExperiment]);

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Experiment Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl font-normal text-gray-900 tracking-tight mb-4">
              Dynamic Viscosity — Falling Ball Method
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl">
              Measure fluid viscosity by observing the terminal velocity of falling spheres using Stokes' Law.
                </p>
          </motion.div>
              </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid gap-12">
          {/* Controls Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Fluid Type
              </label>
              <select 
                value={Object.keys(FLUIDS).find(key => FLUIDS[key] === selectedFluid)}
                onChange={(e) => setSelectedFluid(FLUIDS[e.target.value as keyof typeof FLUIDS])}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-gray-300 transition-colors"
              >
                {Object.entries(FLUIDS).map(([key, fluid]) => (
                  <option key={key} value={key}>
                    {fluid.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Ball Size
              </label>
              <select 
                value={BALLS.indexOf(selectedBall)}
                onChange={(e) => setSelectedBall(BALLS[Number(e.target.value)])}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-gray-300 transition-colors"
              >
                {BALLS.map((ball, index) => (
                  <option key={index} value={index}>
                    {ball.label}
                  </option>
                ))}
              </select>
          </div>

            <div className="flex items-end">
            <button 
                onClick={simulationState.isRunning ? resetExperiment : startExperiment}
                className="w-full px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                {simulationState.isRunning ? 'Reset' : 'Drop Ball'}
            </button>
          </div>
          </section>

          {/* Visualization Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl text-gray-900 mb-6">Experiment</h2>
              <FallingBallVisualization
                ball={selectedBall}
                fluid={selectedFluid}
                position={simulationState.currentPosition}
                isRunning={simulationState.isRunning}
                hasReachedTerminal={simulationState.hasReachedTerminal}
              />
            </div>

            <div>
              <h2 className="text-xl text-gray-900 mb-6">Real-time Measurements</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Current Position</div>
                    <div className="text-xl text-gray-900">
                      {formatValue(simulationState.currentPosition, 'm')}
                  </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Current Velocity</div>
                    <div className="text-xl text-gray-900">
                      {formatValue(simulationState.currentVelocity, 'm/s')}
                  </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Terminal Velocity</div>
                    <div className="text-xl text-gray-900">
                      {formatValue(results.terminalVelocity, 'm/s')}
              </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Dynamic Viscosity</div>
                    <div className="text-xl text-gray-900">
                      {formatValue(results.dynamicViscosity, 'Pa·s')}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Kinematic Viscosity</div>
                    <div className="text-xl text-gray-900">
                      {formatValue(results.kinematicViscosity, 'm²/s')}
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Graphs Section */}
          <section>
            <h2 className="text-xl text-gray-900 mb-6">Analysis</h2>
            <ExperimentGraphs
              data={dataPoints}
              isRunning={simulationState.isRunning}
            />
          </section>

          {/* Theory Section */}
          <section>
            <h2 className="text-xl text-gray-900 mb-6">Theory</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-500">
                The falling ball method uses Stokes' Law to determine fluid viscosity by measuring the terminal velocity 
                of a sphere falling through the fluid. At terminal velocity, the drag force equals the net gravitational force:
              </p>
              <div className="py-4 text-lg text-gray-700 font-mono text-center border-l-2 border-gray-100 pl-4 my-4">
                μ = (2/9) * (ρ_ball - ρ_fluid) * g * r² / V
              </div>
              <p className="text-gray-500">
                where μ is dynamic viscosity, ρ is density, g is gravitational acceleration, r is ball radius, 
                and V is terminal velocity. Kinematic viscosity (ν) is then calculated as μ/ρ_fluid.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}