import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, AlertCircle } from 'lucide-react';

interface TemperatureSetupModalProps {
  onSetTemperature: (temperature: number) => void;
}

export function TemperatureSetupModal({ onSetTemperature }: TemperatureSetupModalProps) {
  const [temperature, setTemperature] = useState<number>(105);
  const [time, setTime] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (temperature !== 105) {
      setError('Temperature must be set to 105°C');
      return;
    }
    if (time !== 2) {
      setError('Time must be set to 2 hours');
      return;
    }
    setError(null);
    onSetTemperature(temperature);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full border border-zinc-800"
        initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        >
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-white/5 rounded-xl">
              <Thermometer className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-light text-white tracking-tight">Drying Parameters</h2>
              <p className="text-zinc-400 text-sm">Configure temperature and time settings</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Temperature (°C)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => {
                    setTemperature(Number(e.target.value));
                    setError(null);
                  }}
                  className="block w-full bg-black/20 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
                  placeholder="105"
                />
                <div className="text-sm text-zinc-500 whitespace-nowrap">Required: 105°C</div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Drying Time (hours)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={time}
                  onChange={(e) => {
                    setTime(Number(e.target.value));
                    setError(null);
                  }}
                  className="block w-full bg-black/20 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
                  placeholder="2"
                />
                <div className="text-sm text-zinc-500 whitespace-nowrap">Required: 2h</div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full px-4 py-3 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors font-medium"
            >
              Start Experiment
            </button>

            <div className="text-sm text-zinc-500 text-center">
              These parameters ensure proper drying of glassware
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}