import { motion } from 'framer-motion';
import { MeasurementPoint } from '../types';
import { formatPressure, formatDepth, formatDensity } from '../utils';

interface DataTableProps {
  measurements: MeasurementPoint[];
  onClear: () => void;
}

export function DataTable({ measurements, onClear }: DataTableProps) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-light">Recorded Measurements</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClear}
          className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Clear Data
        </motion.button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-normal text-zinc-400">#</th>
              <th className="px-4 py-3 text-left text-sm font-normal text-zinc-400">Fluid</th>
              <th className="px-4 py-3 text-left text-sm font-normal text-zinc-400">Density</th>
              <th className="px-4 py-3 text-left text-sm font-normal text-zinc-400">Depth</th>
              <th className="px-4 py-3 text-left text-sm font-normal text-zinc-400">Pressure</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((point, index) => (
              <motion.tr
                key={point.timestamp}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b border-zinc-800/50 text-sm"
              >
                <td className="px-4 py-3 text-zinc-400 font-mono">{index + 1}</td>
                <td className="px-4 py-3">{point.fluid}</td>
                <td className="px-4 py-3 font-mono">{formatDensity(point.density)}</td>
                <td className="px-4 py-3 font-mono">{formatDepth(point.depth)}</td>
                <td className="px-4 py-3 font-mono">{formatPressure(point.pressure)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 