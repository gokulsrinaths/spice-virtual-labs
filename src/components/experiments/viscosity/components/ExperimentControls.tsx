import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, CircleDot, Play, RefreshCw } from 'lucide-react';
import { Ball, Fluid } from '../types';

interface ExperimentControlsProps {
  fluids: Fluid[];
  balls: Ball[];
  selectedFluid: Fluid;
  selectedBall: Ball;
  onFluidChange: (fluid: Fluid) => void;
  onBallChange: (ball: Ball) => void;
  currentStep: number;
  onStartDrop: () => void;
  isDropping: boolean;
  measurements: { ballId: string; fluidId: string }[];
  onNewFluidTest: () => void;
}

export function ExperimentControls({
  fluids,
  balls,
  selectedFluid,
  selectedBall,
  onFluidChange,
  onBallChange,
  currentStep,
  onStartDrop,
  isDropping,
  measurements,
  onNewFluidTest
}: ExperimentControlsProps) {
  // Get list of balls that have been used with current fluid
  const usedBalls = measurements
    .filter(m => m.fluidId === selectedFluid.id)
    .map(m => m.ballId);

  // Filter available balls to only show unused ones after first measurement
  const availableBalls = currentStep === 4 
    ? balls.filter(ball => !usedBalls.includes(ball.id))
    : balls;

  // Check if all balls have been tested with current fluid
  const allBallsTested = balls.every(ball => usedBalls.includes(ball.id));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Experiment Controls</h2>

      {/* Fluid Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Fluid
        </label>
        <div className="grid grid-cols-2 gap-2">
          {fluids.map((fluid) => (
            <button
              key={fluid.id}
              onClick={() => (currentStep === 1 || currentStep === 4) && onFluidChange(fluid)}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${selectedFluid.id === fluid.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-200'}
                ${currentStep !== 1 && currentStep !== 4 ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={currentStep !== 1 && currentStep !== 4}
            >
              <div className="flex items-center gap-2">
                <Droplet 
                  className="h-5 w-5" 
                  style={{ color: fluid.color }} 
                />
                <span className="text-sm font-medium">{fluid.name}</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                ρ = {fluid.density} kg/m³
              </div>
              {measurements.some(m => m.fluidId === fluid.id) && (
                <div className="mt-1 text-xs text-blue-600">
                  {measurements.filter(m => m.fluidId === fluid.id).length} measurements
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Ball Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Iron Ball
        </label>
        <div className="grid grid-cols-2 gap-2">
          {availableBalls.map((ball) => (
            <button
              key={ball.id}
              onClick={() => (currentStep === 2 || currentStep === 4) && onBallChange(ball)}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${selectedBall.id === ball.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-200'}
                ${currentStep !== 2 && currentStep !== 4 ? 'opacity-50 cursor-not-allowed' : ''}
                ${usedBalls.includes(ball.id) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={currentStep !== 2 && currentStep !== 4 || usedBalls.includes(ball.id)}
            >
              <div className="flex items-center gap-2">
                <CircleDot className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">{ball.name}</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                ∅ {ball.diameter} mm
              </div>
              {usedBalls.includes(ball.id) && (
                <div className="mt-1 text-xs text-orange-500">
                  Already tested
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Drop Control */}
      <motion.button
        onClick={onStartDrop}
        disabled={currentStep !== 3 || isDropping}
        className={`
          w-full px-4 py-3 rounded-lg font-medium
          flex items-center justify-center gap-2
          transition-colors
          ${currentStep === 3 && !isDropping
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
        `}
        whileHover={currentStep === 3 && !isDropping ? { scale: 1.02 } : {}}
        whileTap={currentStep === 3 && !isDropping ? { scale: 0.98 } : {}}
      >
        <Play className="h-5 w-5" />
        {isDropping ? 'Measuring...' : 'Release Ball'}
      </motion.button>

      {/* New Fluid Test Button */}
      {allBallsTested && currentStep === 4 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onNewFluidTest}
          className="mt-4 w-full px-4 py-3 rounded-lg font-medium bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
        >
          <RefreshCw className="h-5 w-5" />
          Test Another Fluid
        </motion.button>
      )}

      {/* Step Indicator */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Step {currentStep} of 5</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full ${
                  step === currentStep
                    ? 'bg-blue-500'
                    : step < currentStep
                    ? 'bg-blue-200'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}