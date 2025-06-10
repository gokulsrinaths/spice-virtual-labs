import { MeasurementPoint } from '../types';
import { formatPressure, formatTemperature, formatHeight, calculatePercentError } from '../utils';

interface DataTableProps {
  measurements: MeasurementPoint[];
}

export function DataTable({ measurements }: DataTableProps) {
  if (measurements.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No measurements recorded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="px-6 py-3 text-left text-sm text-gray-400 font-normal">#</th>
            <th className="px-6 py-3 text-left text-sm text-gray-400 font-normal">Temperature</th>
            <th className="px-6 py-3 text-left text-sm text-gray-400 font-normal">Height Diff.</th>
            <th className="px-6 py-3 text-left text-sm text-gray-400 font-normal">Vapor Pressure</th>
            <th className="px-6 py-3 text-left text-sm text-gray-400 font-normal">Theoretical</th>
            <th className="px-6 py-3 text-left text-sm text-gray-400 font-normal">Error</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {measurements.map((point, index) => (
            <tr key={point.timestamp} className="hover:bg-gray-800/50">
              <td className="px-6 py-4 text-sm text-gray-400">{index + 1}</td>
              <td className="px-6 py-4 text-sm text-gray-100">
                {formatTemperature(point.temperature)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-100">
                {formatHeight(point.heightDifference)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-100">
                {formatPressure(point.vaporPressure)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-100">
                {formatPressure(point.theoreticalPressure)}
              </td>
              <td className="px-6 py-4 text-sm">
                <span className={`${
                  calculatePercentError(point.vaporPressure, point.theoreticalPressure) < 5
                    ? 'text-green-500'
                    : 'text-yellow-500'
                }`}>
                  {calculatePercentError(point.vaporPressure, point.theoreticalPressure).toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 