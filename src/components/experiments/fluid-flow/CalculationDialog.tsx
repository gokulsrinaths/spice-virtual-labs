import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface CalculationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: number, work: string) => void;
  title: string;
  formula: string;
  variables: { [key: string]: string };
}

export function CalculationDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  formula,
  variables
}: CalculationDialogProps) {
  const [work, setWork] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = () => {
    const numericResult = parseFloat(result);
    if (!isNaN(numericResult)) {
      onSubmit(numericResult, work);
      setWork('');
      setResult('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-2xl p-6 m-4"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-light">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Formula and Variables */}
            <div className="bg-black/30 rounded-xl p-4 space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-zinc-400">Formula:</div>
                <div className="font-mono text-lg">{formula}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-zinc-400">Variables:</div>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(variables).map(([symbol, value]) => (
                    <div key={symbol} className="font-mono">
                      {symbol} = {value}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Work Area */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Show Your Work:</label>
              <textarea
                value={work}
                onChange={(e) => setWork(e.target.value)}
                placeholder="Write your calculation steps here..."
                className="w-full h-32 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono"
              />
            </div>

            {/* Result */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Final Result:</label>
              <input
                type="number"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="Enter your calculated result..."
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors font-medium"
            >
              <Check className="w-4 h-4" />
              Submit Calculation
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 