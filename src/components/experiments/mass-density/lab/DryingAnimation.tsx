import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export interface DryingAnimationProps {
  onComplete: () => void;
  selectedFlask: 'volumetric-flask' | 'erlenmeyer-flask';
}

export function DryingAnimation({ onComplete, selectedFlask }: DryingAnimationProps) {
  const [minutes, setMinutes] = React.useState(0);
  const totalMinutes = 120;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setMinutes((prev) => {
        const newMinutes = prev + 1;
        if (newMinutes >= totalMinutes) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return totalMinutes;
        }
        return newMinutes;
      });
    }, 50); // Sped up for demo purposes (50ms = 1 minute)

    return () => clearInterval(timer);
  }, [onComplete]);

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}:${remainingMins.toString().padStart(2, '0')}`;
  };

  const progress = (minutes / totalMinutes) * 100;

  return (
    <motion.div 
      className="absolute inset-0 bg-black/50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-lg p-6 w-96"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
          <h3 className="text-lg font-semibold">Drying Flask</h3>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Temperature</span>
            <span>105°C</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-orange-500"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Time Elapsed</span>
          <span>{formatTime(minutes)} / 2:00</span>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          {minutes < totalMinutes ? 'Drying in progress...' : 'Drying complete!'}
        </div>
      </motion.div>
    </motion.div>
  );
}