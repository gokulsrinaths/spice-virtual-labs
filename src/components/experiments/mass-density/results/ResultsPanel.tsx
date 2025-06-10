import React, { useState } from 'react';
import { ExperimentData } from '../types';
import { DataTable } from './DataTable';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ResultsPanelProps {
  experimentData: ExperimentData;
}

export function ResultsPanel({ experimentData }: ResultsPanelProps) {
  const [showTable, setShowTable] = useState(false);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4">Current Results</h3>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Empty Flask Mass (m₁)</p>
            <p className="font-medium">{experimentData.m1?.toFixed(2) || '-'} g</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Flask + Water Mass (m₂)</p>
            <p className="font-medium">{experimentData.m2?.toFixed(2) || '-'} g</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Temperature</p>
            <p className="font-medium">{experimentData.temperature?.toFixed(1) || '-'} °C</p>
          </div>
          
          {experimentData.density && (
            <>
              <div className="h-px bg-gray-200 my-3" />
              
              <div>
                <p className="text-sm text-gray-500">Density (ρ)</p>
                <p className="font-medium">{experimentData.density.toFixed(4)} g/mL</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Specific Weight (γ)</p>
                <p className="font-medium">{(experimentData.density * 9.81).toFixed(3)} kN/m³</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Specific Gravity (SG)</p>
                <p className="font-medium">{(experimentData.density / 0.9982).toFixed(3)}</p>
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => setShowTable(!showTable)}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {showTable ? (
            <>
              Hide Data Table
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show Data Table
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      <DataTable experimentData={experimentData} showTable={showTable} />
    </div>
  );
}