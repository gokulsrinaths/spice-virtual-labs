import React from 'react';
import { ExperimentData } from '../types';

interface ResultsSidebarProps {
  experimentData: ExperimentData;
}

export function ResultsSidebar({ experimentData }: ResultsSidebarProps) {
  const calculateResults = () => {
    if (!experimentData.m1 || !experimentData.m2) return null;
    
    const volume = 100; // mL
    const density = (experimentData.m2 - experimentData.m1) / volume;
    const specificWeight = density * 9.81;
    const specificGravity = density / 1.0; // relative to water at 4°C
    
    return { density, specificWeight, specificGravity };
  };

  const results = calculateResults();

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Results</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Empty Flask Mass (m₁)</p>
          <p className="text-lg font-medium">
            {experimentData.m1?.toFixed(2) || '-'} g
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Flask + Water Mass (m₂)</p>
          <p className="text-lg font-medium">
            {experimentData.m2?.toFixed(2) || '-'} g
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Temperature</p>
          <p className="text-lg font-medium">
            {experimentData.temperature?.toFixed(1) || '-'} °C
          </p>
        </div>

        {results && (
          <>
            <div className="h-px bg-gray-200 my-4" />

            <div>
              <p className="text-sm text-gray-500">Density (ρ)</p>
              <p className="text-lg font-medium">
                {results.density.toFixed(3)} g/cm³
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Specific Weight (γ)</p>
              <p className="text-lg font-medium">
                {results.specificWeight.toFixed(3)} kN/m³
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Specific Gravity (SG)</p>
              <p className="text-lg font-medium">
                {results.specificGravity.toFixed(3)}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}