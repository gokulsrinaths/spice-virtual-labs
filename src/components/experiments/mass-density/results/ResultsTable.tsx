import React from 'react';

interface ResultsTableProps {
  experimentData: any;
}

export function ResultsTable({ experimentData }: ResultsTableProps) {
  return (
    <div className="mt-4 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Results</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Measurement</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Value</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Unit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-2">Empty Flask Mass (m₁)</td>
              <td className="px-4 py-2">{experimentData.m1?.toFixed(2) || '-'}</td>
              <td className="px-4 py-2">g</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Flask + Water Mass (m₂)</td>
              <td className="px-4 py-2">{experimentData.m2?.toFixed(2) || '-'}</td>
              <td className="px-4 py-2">g</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Temperature</td>
              <td className="px-4 py-2">{experimentData.temperature?.toFixed(1) || '-'}</td>
              <td className="px-4 py-2">°C</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}