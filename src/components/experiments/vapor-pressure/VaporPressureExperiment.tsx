import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ExperimentState, MeasurementPoint, TEMPERATURE_PRESETS, MIN_TEMP, MAX_TEMP, TUBE_HEIGHT } from './types';
import { calculateTheoreticalVaporPressure, calculateExperimentalVaporPressure, calculateOilDensity, formatPressure, formatTemperature, formatHeight, formatDensity } from './utils';
import { BoilingFlask } from './components/BoilingFlask';
import { Manometer } from './components/Manometer';
import { DataTable } from './components/DataTable';

export function VaporPressureExperiment() {
  // Experiment state
  const [state, setState] = useState<ExperimentState>({
    temperature: 20,
    oilDensity: 920,
    leftHeight: 0,
    rightHeight: 0,
    isHeating: false,
    vaporPressure: 0,
    theoreticalPressure: calculateTheoreticalVaporPressure(20)
  });

  // Measurement history
  const [measurements, setMeasurements] = useState<MeasurementPoint[]>([]);
  
  // Graph toggle
  const [showGraph, setShowGraph] = useState(false);

  // Update manometer heights based on temperature with immediate visual feedback
  useEffect(() => {
    if (state.isHeating) {
      const theoreticalPressure = calculateTheoreticalVaporPressure(state.temperature);
      // Calculate required height difference using P = ρgh
      const heightDifference = theoreticalPressure / (state.oilDensity * 9.81);
      
      // Ensure height difference doesn't exceed tube height
      const maxDiff = TUBE_HEIGHT * 0.8; // Leave some margin
      const actualDiff = Math.min(heightDifference, maxDiff);
      
      // Immediately show a significant initial change
      const totalHeight = TUBE_HEIGHT * 0.6; // Initial oil fill level
      const targetLeft = (totalHeight - actualDiff) / 2;
      const targetRight = (totalHeight + actualDiff) / 2;

      // Immediate update for visual feedback
      setState(prev => ({
        ...prev,
        leftHeight: prev.leftHeight + (targetLeft - prev.leftHeight) * 0.3, // Larger initial step
        rightHeight: prev.rightHeight + (targetRight - prev.rightHeight) * 0.3,
        vaporPressure: calculateExperimentalVaporPressure(
          prev.oilDensity,
          targetRight - targetLeft
        )
      }));

      // Continue with smoother updates
      const updateInterval = setInterval(() => {
        setState(prev => {
          const currentLeft = prev.leftHeight;
          const currentRight = prev.rightHeight;
          const easing = 0.08; // Slightly faster easing

          const newLeft = currentLeft + (targetLeft - currentLeft) * easing;
          const newRight = currentRight + (targetRight - currentRight) * easing;
    
          // Stop updating if we're close enough
          if (Math.abs(targetLeft - newLeft) < 0.0001 && 
              Math.abs(targetRight - newRight) < 0.0001) {
            clearInterval(updateInterval);
            return prev;
          }

          return {
            ...prev,
            leftHeight: newLeft,
            rightHeight: newRight,
            vaporPressure: calculateExperimentalVaporPressure(prev.oilDensity, newRight - newLeft)
          };
        });
      }, 30); // Faster updates for smoother animation

      return () => clearInterval(updateInterval);
    }
  }, [state.temperature, state.isHeating]);

  // Handle temperature change
  const handleTemperatureChange = (temp: number) => {
    setState(prev => ({
      ...prev,
      temperature: temp,
      oilDensity: calculateOilDensity(temp),
      theoreticalPressure: calculateTheoreticalVaporPressure(temp)
    }));
  };

  // Start heating
  const startHeating = () => {
    setState(prev => ({ ...prev, isHeating: true }));
  };

  // Stop heating
  const stopHeating = () => {
    setState(prev => ({ ...prev, isHeating: false }));
  };

  // Update heights manually
  const updateHeights = (left: number, right: number) => {
    setState(prev => ({
      ...prev,
      leftHeight: left,
      rightHeight: right,
      vaporPressure: calculateExperimentalVaporPressure(prev.oilDensity, right - left)
    }));
  };

  // Record measurement
  const recordMeasurement = () => {
    const newPoint: MeasurementPoint = {
      temperature: state.temperature,
      vaporPressure: state.vaporPressure,
      theoreticalPressure: state.theoreticalPressure,
      heightDifference: state.rightHeight - state.leftHeight,
      timestamp: Date.now()
    };
    setMeasurements(prev => [...prev, newPoint]);
  };

  // Clear measurements
  const clearMeasurements = () => {
    setMeasurements([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-16">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl font-normal tracking-tight mb-4">
              Vapor Pressure Measurement
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              Measure vapor pressure using a U-tube manometer and explore the relationship between temperature and vapor pressure.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Controls */}
        <section className="mb-12">
          <div className="bg-gray-800 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Temperature Control */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Temperature (°C)
                </label>
                <input
                  type="range"
                  min={MIN_TEMP}
                  max={MAX_TEMP}
                  value={state.temperature}
                  onChange={(e) => handleTemperatureChange(Number(e.target.value))}
                  className="w-full h-2 bg-blue-600/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-400">
                  <span>{MIN_TEMP}°C</span>
                  <span className="text-blue-400 font-medium">{state.temperature.toFixed(1)}°C</span>
                  <span>{MAX_TEMP}°C</span>
                </div>
              </div>

              {/* Heating Controls */}
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startHeating}
                  disabled={state.isHeating}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                    state.isHeating
                      ? 'bg-red-500/20 text-red-300 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  Start Heating
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={stopHeating}
                  disabled={!state.isHeating}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                    !state.isHeating
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  Stop Heating
                </motion.button>
              </div>
            </div>
          </div>
        </section>

          {/* Visualization */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Flask */}
            <div className="bg-gray-800 rounded-2xl p-8 min-h-[500px] flex flex-col">
              <h2 className="text-xl text-gray-100 mb-6 flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                Boiling Flask
              </h2>
              <div className="flex-1 flex items-center justify-center">
                <BoilingFlask
                  temperature={state.temperature}
                  isHeating={state.isHeating}
                />
              </div>
            </div>

            {/* Manometer */}
            <div className="bg-gray-800 rounded-2xl p-8 min-h-[500px] flex flex-col">
              <h2 className="text-xl text-gray-100 mb-6 flex items-center">
                <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                U-tube Manometer
              </h2>
              <div className="flex-1 flex items-center justify-center">
                <Manometer
                  leftHeight={state.leftHeight}
                  rightHeight={state.rightHeight}
                  oilDensity={state.oilDensity}
                  onHeightChange={updateHeights}
                />
                  </div>
                  </div>
                </div>
        </section>

        {/* Results */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h3 className="text-sm text-gray-400 mb-2">Vapor Pressure (Pv)</h3>
              <div className="text-2xl text-gray-100">
                {formatPressure(state.vaporPressure)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h3 className="text-sm text-gray-400 mb-2">Theoretical Pressure</h3>
              <div className="text-2xl text-gray-100">
                {formatPressure(state.theoreticalPressure)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h3 className="text-sm text-gray-400 mb-2">Height Difference (Δh)</h3>
              <div className="text-2xl text-gray-100">
                {formatHeight(state.rightHeight - state.leftHeight)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Actions */}
        <section className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={recordMeasurement}
            className="px-6 py-3 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Record Measurement
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowGraph(!showGraph)}
            className="px-6 py-3 rounded-xl font-medium bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            {showGraph ? 'Hide Graph' : 'Show Graph'}
          </motion.button>
        </section>

        {/* Graph */}
        <AnimatePresence>
          {showGraph && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-12 overflow-hidden"
            >
              <div className="bg-gray-800 rounded-2xl p-8">
                <h2 className="text-xl text-gray-100 mb-6">Pressure vs Temperature</h2>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={measurements}>
                      <XAxis
                        dataKey="temperature"
                        name="Temperature"
                        unit="°C"
                        stroke="#9ca3af"
                      />
                      <YAxis
                        name="Pressure"
                        unit=" Pa"
                        stroke="#9ca3af"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: 'none',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="vaporPressure"
                        name="Experimental"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="theoreticalPressure"
                        name="Theoretical"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
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
          <section className="mt-12">
            <DataTable
              measurements={measurements}
              onClear={clearMeasurements}
            />
          </section>
        )}
      </main>
    </div>
  );
}