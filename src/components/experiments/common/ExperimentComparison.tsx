import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowRight, Download, Filter, Table } from 'lucide-react';

interface ExperimentData {
  id: string;
  name: string;
  description: string;
  parameters: {
    [key: string]: number;
  };
  results: {
    time: number;
    values: {
      [key: string]: number;
    };
  }[];
}

interface ComparisonProps {
  experiments: ExperimentData[];
  onExport?: (data: any) => void;
}

export function ExperimentComparison({ experiments, onExport }: ComparisonProps) {
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [selectedExperiments, setSelectedExperiments] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  // Get all available parameters from experiments
  const allParameters = Array.from(
    new Set(
      experiments.flatMap((exp) =>
        Object.keys(exp.results[0]?.values || {})
      )
    )
  );

  const handleParameterToggle = (parameter: string) => {
    setSelectedParameters((prev) =>
      prev.includes(parameter)
        ? prev.filter((p) => p !== parameter)
        : [...prev, parameter]
    );
  };

  const handleExperimentToggle = (experimentId: string) => {
    setSelectedExperiments((prev) =>
      prev.includes(experimentId)
        ? prev.filter((id) => id !== experimentId)
        : [...prev, experimentId]
    );
  };

  const getChartData = () => {
    const data: any[] = [];
    const selectedExps = experiments.filter((exp) =>
      selectedExperiments.includes(exp.id)
    );

    selectedExps.forEach((exp) => {
      exp.results.forEach((result) => {
        const timePoint = result.time;
        const existingPoint = data.find((d) => d.time === timePoint);

        if (existingPoint) {
          selectedParameters.forEach((param) => {
            existingPoint[`${exp.name}-${param}`] = result.values[param];
          });
        } else {
          const newPoint: any = { time: timePoint };
          selectedParameters.forEach((param) => {
            newPoint[`${exp.name}-${param}`] = result.values[param];
          });
          data.push(newPoint);
        }
      });
    });

    return data.sort((a, b) => a.time - b.time);
  };

  const handleExport = () => {
    if (!onExport) return;

    const exportData = {
      experiments: selectedExperiments.map((id) => {
        const exp = experiments.find((e) => e.id === id);
        return {
          name: exp?.name,
          parameters: exp?.parameters,
          results: exp?.results.map((r) => ({
            time: r.time,
            values: Object.fromEntries(
              Object.entries(r.values).filter(([key]) =>
                selectedParameters.includes(key)
              )
            ),
          })),
        };
      }),
      parameters: selectedParameters,
      timestamp: new Date().toISOString(),
    };

    onExport(exportData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Experiment Comparison
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setViewMode(viewMode === 'chart' ? 'table' : 'chart')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {viewMode === 'chart' ? (
              <Table className="w-5 h-5" />
            ) : (
              <LineChart className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Experiment Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Select Experiments
            </h3>
            <div className="space-y-2">
              {experiments.map((exp) => (
                <label
                  key={exp.id}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={selectedExperiments.includes(exp.id)}
                    onChange={() => handleExperimentToggle(exp.id)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span>{exp.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Parameter Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Select Parameters
            </h3>
            <div className="space-y-2">
              {allParameters.map((param) => (
                <label
                  key={param}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={selectedParameters.includes(param)}
                    onChange={() => handleParameterToggle(param)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span>{param}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Chart/Table View */}
        <div className="lg:col-span-3">
          {viewMode === 'chart' ? (
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    label={{ value: 'Time', position: 'bottom' }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {selectedExperiments.map((expId) => {
                    const exp = experiments.find((e) => e.id === expId);
                    return selectedParameters.map((param) => (
                      <Line
                        key={`${exp?.name}-${param}`}
                        type="monotone"
                        dataKey={`${exp?.name}-${param}`}
                        name={`${exp?.name} - ${param}`}
                        stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                      />
                    ));
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Time
                    </th>
                    {selectedExperiments.map((expId) => {
                      const exp = experiments.find((e) => e.id === expId);
                      return selectedParameters.map((param) => (
                        <th
                          key={`${exp?.name}-${param}`}
                          className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          {exp?.name} - {param}
                        </th>
                      ));
                    })}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {getChartData().map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {row.time}
                      </td>
                      {selectedExperiments.map((expId) => {
                        const exp = experiments.find((e) => e.id === expId);
                        return selectedParameters.map((param) => (
                          <td
                            key={`${exp?.name}-${param}`}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                          >
                            {row[`${exp?.name}-${param}`]?.toFixed(2)}
                          </td>
                        ));
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 