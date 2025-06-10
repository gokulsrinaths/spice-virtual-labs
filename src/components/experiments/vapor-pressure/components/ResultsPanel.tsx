import React from 'react';
import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';

interface ResultsPanelProps {
  pressure: number;
}

export function ResultsPanel({ pressure }: ResultsPanelProps) {
  // Calculate relative pressure (compared to atmospheric pressure)
  const atmosphericPressure = 101.325; // kPa
  const relativePercentage = (pressure / atmosphericPressure) * 100;

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Gauge className="h-5 w-5 text-blue-500" />
        Results
      </h2>

      <div className="space-y-6">
        {/* Pressure Display */}
        <div>
          <label className="text-sm text-gray-500">Vapor Pressure</label>
          <div className="text-3xl font-bold text-blue-600">
            {pressure.toFixed(2)} kPa
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {relativePercentage.toFixed(1)}% of atmospheric pressure
          </p>
        </div>

        {/* Pressure Gauge Visualization */}
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${relativePercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Analysis */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium mb-2">Pressure Analysis</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              {pressure >= atmosphericPressure ? (
                "Water will boil at this temperature as vapor pressure exceeds atmospheric pressure."
              ) : (
                `Water will not boil at this temperature. Vapor pressure is ${(atmosphericPressure - pressure).toFixed(1)} kPa below atmospheric pressure.`
              )}
            </p>
            <p>
              {pressure < 2.34 ? "Low vapor pressure - minimal evaporation" :
               pressure < 10 ? "Moderate vapor pressure - noticeable evaporation" :
               pressure < 50 ? "High vapor pressure - rapid evaporation" :
               "Very high vapor pressure - near or at boiling point"}
            </p>
          </div>
        </div>

        {/* Reference Values */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Reference Values</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Atmospheric Pressure</p>
              <p className="font-medium">{atmosphericPressure.toFixed(3)} kPa</p>
            </div>
            <div>
              <p className="text-gray-500">Boiling Point</p>
              <p className="font-medium">100°C at 1 atm</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}