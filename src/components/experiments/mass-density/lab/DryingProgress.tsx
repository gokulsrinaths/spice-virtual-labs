import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface DryingProgressProps {
  progress: number;
  onComplete: () => void;
}

export function DryingProgress({ progress, onComplete }: DryingProgressProps) {
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
          <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
          <h3 className="text-lg font-semibold">Drying in Progress</h3>
        </div>
        
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
          <motion.div
            className="absolute inset-y-0 left-0 bg-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>{Math.round(progress)}%</span>
          <span>2 hours</span>
        </div>
      </motion.div>
    </div>
  );
}