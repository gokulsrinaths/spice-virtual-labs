import React from 'react';
import { ExperimentData } from '../types';

interface DataTableProps {
  experimentData: ExperimentData;
  showTable: boolean;
}

export function DataTable({ experimentData, showTable }: DataTableProps) {
  if (!showTable) return null;

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-3">
        <h3 className="text-lg font-semibold">Data Table</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Iteration No.
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mass 1, M₁ (g)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume, ∀ (mL)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mass 2, M₂ (g)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Temperature, T (°C)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mass Density, ρ (g/mL)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specific Weight, γ (kN/m³)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specific Gravity, SG
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {experimentData.measurements?.map((measurement, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {measurement.m1.toFixed(2)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {measurement.volume.toFixed(0)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {measurement.m2.toFixed(2)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {measurement.temperature.toFixed(1)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {measurement.density.toFixed(4)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {(measurement.density * 9.81).toFixed(3)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {(measurement.density / 0.9982).toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}