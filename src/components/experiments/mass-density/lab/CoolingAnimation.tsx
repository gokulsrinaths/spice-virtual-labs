import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer } from 'lucide-react';

export interface CoolingAnimationProps {
  onComplete: () => void;
  selectedFlask: 'volumetric-flask' | 'erlenmeyer-flask';
}

export function CoolingAnimation({ onComplete, selectedFlask }: CoolingAnimationProps) {
  const [temperature, setTemperature] = useState(105);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 5000; // 5 seconds for cooling
    const initialTemp = 105;
    const finalTemp = 20 + Math.random() * 5; // Room temperature between 20-25°C

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Exponential cooling curve
      const currentTemp = initialTemp - (initialTemp - finalTemp) * (1 - Math.exp(-4 * progress));
      
      setTemperature(Number(currentTemp.toFixed(1)));

      if (progress === 1 && !isComplete) {
        setIsComplete(true);
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete, isComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Thermometer className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Temperature Equilibration</h3>
            <p className="text-sm text-slate-600">Monitoring temperature decrease to ambient conditions</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Current Temperature:</span>
            <span className="text-lg font-semibold text-blue-600">{temperature.toFixed(1)}°C</span>
          </div>

          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: "100%" }}
              animate={{ width: `${((temperature - 20) / 85) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-500">
            <span>Room Temp. (20-25°C)</span>
            <span>Initial (105°C)</span>
          </div>

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-green-600 font-medium"
            >
              Temperature equilibration complete
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}