import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Table } from 'lucide-react';
import { Ball, Fluid, Measurement } from '../types';
import { balls, fluids } from '../data/constants';

interface ResultsProps {
  selectedBall: Ball;
  selectedFluid: Fluid;
  measurements: Measurement[];
  currentStep: number;
}

export function Results({ 
  selectedBall, 
  selectedFluid,
  measurements,
  currentStep 
}: ResultsProps) {
  // Get the latest measurement for the current ball and fluid
  const currentMeasurement = measurements.find(
    m => m.ballId === selectedBall.id && m.fluidId === selectedFluid.id
  );

  // Group measurements by fluid
  const groupedMeasurements = measurements.reduce((acc, measurement) => {
    const fluid = measurement.fluidId;
    if (!acc[fluid]) {
      acc[fluid] = [];
    }
    acc[fluid].push(measurement);
    return acc;
  }, {} as { [key: string]: Measurement[] });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Calculator className="h-5 w-5 text-blue-500" />
        Results
      </h2>

      <div className="space-y-6">
        {/* Current Experiment Results */}
        {currentStep >= 4 && currentMeasurement && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Terminal Velocity</label>
              <div className="font-medium">{currentMeasurement.velocity.toFixed(4)} m/s</div>
            </div>
            
            <div>
              <label className="text-sm text-gray-500">Dynamic Viscosity (μ)</label>
              <div className="font-medium">{currentMeasurement.dynamicViscosity.toFixed(4)} Pa·s</div>
            </div>

            <div>
              <label className="text-sm text-gray-500">Kinematic Viscosity (ν)</label>
              <div className="font-medium">
                {(currentMeasurement.dynamicViscosity / selectedFluid.density).toFixed(6)} m²/s
              </div>
            </div>
          </div>
        )}

        {/* Complete Data Table */}
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
            <Table className="h-4 w-4 text-blue-500" />
            Comprehensive Results Table
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fluid</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ball</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Diameter (m)</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">V (m/s)</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">μ (Pa·s)</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ν (m²/s)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {Object.entries(groupedMeasurements).map(([fluidId, fluidMeasurements]) => (
                  fluidMeasurements.map((measurement, index) => {
                    const fluid = fluids.find(f => f.id === fluidId)!;
                    const ball = balls.find(b => b.id === measurement.ballId)!;
                    const kinematicViscosity = measurement.dynamicViscosity / fluid.density;

                    return (
                      <tr key={`${fluidId}-${measurement.ballId}`}
                          className={`${
                            selectedFluid.id === fluidId && 
                            selectedBall.id === measurement.ballId ? 
                            'bg-blue-50' : ''
                          }`}
                      >
                        {index === 0 && (
                          <td className="px-3 py-2 align-top" rowSpan={fluidMeasurements.length}>
                            {fluid.name}
                          </td>
                        )}
                        <td className="px-3 py-2">{ball.name}</td>
                        <td className="px-3 py-2">{(ball.diameter / 1000).toFixed(3)}</td>
                        <td className="px-3 py-2">{measurement.velocity.toFixed(4)}</td>
                        <td className="px-3 py-2">{measurement.dynamicViscosity.toFixed(4)}</td>
                        <td className="px-3 py-2">{kinematicViscosity.toFixed(6)}</td>
                      </tr>
                    );
                  })
                ))}
                {measurements.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-4 text-center text-gray-500">
                      No measurements recorded yet. Complete experiments to populate the table.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Constants */}
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Constants</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-yellow-700">Gravity, g:</span>
                <span className="text-sm font-medium ml-2">9.81 m/s²</span>
              </div>
              <div>
                <span className="text-sm text-yellow-700">Temperature:</span>
                <span className="text-sm font-medium ml-2">25°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}