import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer } from 'lucide-react';

interface CoolingProgressProps {
  progress: number;
  onComplete: () => void;
}

export function CoolingProgress({ progress, onComplete }: CoolingProgressProps) {
  React.useEffect(() => {
    if (progress >= 100) {
      onComplete();
    }
  }, [progress, onComplete]);

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
      <motion.div 
        className="bg-white rounded-lg p-6 w-80"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Thermometer className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-semibold">Cooling to Ambient Temperature</h3>
        </div>
        
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
          <motion.div
            className="absolute inset-y-0 left-0 bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>{Math.round(progress)}%</span>
          <span>Ambient Temperature</span>
        </div>
      </motion.div>
    </div>
  );
}