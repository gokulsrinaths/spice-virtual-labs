import React from 'react';
import { ExperimentData } from './MassDensityExperiment';

interface ResultsPanelProps {
  experimentData: ExperimentData;
}

export function ResultsPanel({ experimentData }: ResultsPanelProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Results</h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Empty Flask Mass (m₁)</p>
          <p className="font-medium">{experimentData.m1?.toFixed(2) || '-'} g</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Flask + Liquid Mass (m₂)</p>
          <p className="font-medium">{experimentData.m2?.toFixed(2) || '-'} g</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Temperature</p>
          <p className="font-medium">{experimentData.temperature?.toFixed(1) || '-'} °C</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Density (ρ)</p>
          <p className="font-medium">{experimentData.density?.toFixed(3) || '-'} g/cm³</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Specific Weight (γ)</p>
          <p className="font-medium">{experimentData.specificWeight?.toFixed(3) || '-'} kN/m³</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Specific Gravity (SG)</p>
          <p className="font-medium">{experimentData.specificGravity?.toFixed(3) || '-'}</p>
        </div>
      </div>
    </div>
  );
}