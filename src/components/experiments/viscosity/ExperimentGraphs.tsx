import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { MeasurementPoint } from './types';

interface ExperimentGraphsProps {
  data: MeasurementPoint[];
  isRunning: boolean;
}

export function ExperimentGraphs({ data, isRunning }: ExperimentGraphsProps) {
  const formatValue = (value: number) => value.toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Position vs Time Graph */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-sm font-normal text-gray-500 mb-4">Position vs Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="time"
                tickFormatter={(value) => `${formatValue(value)}s`}
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis
                tickFormatter={(value) => `${formatValue(value)}m`}
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
                formatter={(value: number) => [`${formatValue(value)}m`, 'Position']}
                labelFormatter={(label: number) => `Time: ${formatValue(label)}s`}
              />
              <Line
                type="monotone"
                dataKey="position"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                isAnimationActive={isRunning}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Velocity vs Time Graph */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-sm font-normal text-gray-500 mb-4">Velocity vs Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="time"
                tickFormatter={(value) => `${formatValue(value)}s`}
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis
                tickFormatter={(value) => `${formatValue(value)}m/s`}
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
                formatter={(value: number) => [`${formatValue(value)}m/s`, 'Velocity']}
                labelFormatter={(label: number) => `Time: ${formatValue(label)}s`}
              />
              <Line
                type="monotone"
                dataKey="velocity"
                stroke="#059669"
                strokeWidth={2}
                dot={false}
                isAnimationActive={isRunning}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 