import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Timer, Thermometer, AlertCircle } from 'lucide-react';

interface DryingOvenStepProps {
  onComplete: () => void;
  isActive: boolean;
}

export function DryingOvenStep({ onComplete, isActive }: DryingOvenStepProps) {
  const [temperature, setTemperature] = useState<number | ''>('');
  const [time, setTime] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [isHeating, setIsHeating] = useState(false);

  const handleTemperatureSubmit = () => {
    if (temperature !== 105) {
      setError('Temperature must be set to 105°C');
      return;
    }
    if (time !== 2) {
      setError('Time must be set to 2 hours');
      return;
    }
    setError(null);
    setIsHeating(true);
    
    // Delay the completion to show the heating animation
    setTimeout(() => {
      setIsHeating(false);
      onComplete();
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Flame className={`h-5 w-5 ${isHeating ? 'text-orange-500 animate-pulse' : 'text-gray-500'}`} />
          <h3 className="text-lg font-semibold">Set Drying Parameters</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature (°C)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={temperature}
                onChange={(e) => {
                  setTemperature(e.target.value === '' ? '' : Number(e.target.value));
                  setError(null);
                }}
                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                placeholder="105"
                disabled={isHeating}
              />
              <Thermometer className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time (hours)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value === '' ? '' : Number(e.target.value));
                  setError(null);
                }}
                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                placeholder="2"
                disabled={isHeating}
              />
              <Timer className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-red-50 rounded-md flex items-center gap-2"
            >
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {isHeating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative p-4 bg-orange-50 rounded-lg border border-orange-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                <span className="font-medium text-orange-700">Heating in Progress</span>
              </div>
              
              {/* Temperature Rise Animation */}
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-orange-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </div>

              {/* Heating Waves */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border-2 border-orange-300 rounded-lg"
                    initial={{ opacity: 0.8, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.1 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>

              {/* Temperature Display */}
              <div className="mt-3 text-center text-sm font-medium text-orange-700">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Current Temperature: {temperature}°C
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleTemperatureSubmit}
          disabled={isHeating || !isActive}
          className={`
            w-full px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${isHeating || !isActive 
              ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'}
          `}
        >
          {isHeating ? 'Heating...' : 'Set Parameters'}
        </button>
      </div>
    </div>
  );
}