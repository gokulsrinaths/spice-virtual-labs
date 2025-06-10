import React from 'react';
import { Droplet } from 'lucide-react';
import { motion } from 'framer-motion';

interface WaterTapProps {
  isActive: boolean;
  isOccupied: boolean;
  onDrop: (e: React.DragEvent) => void;
}

export function WaterTap({ isActive, isOccupied, onDrop }: WaterTapProps) {
  const handleDragOver = (e: React.DragEvent) => {
    if (isActive && !isOccupied) {
      e.preventDefault();
    }
  };

  return (
    <motion.div
      className={`
        border-2 border-dashed rounded-lg p-6
        flex flex-col items-center justify-center gap-3
        min-h-[200px] transition-colors
        ${isActive && !isOccupied ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        ${isOccupied ? 'border-green-500 bg-green-50' : ''}
      `}
      onDragOver={handleDragOver}
      onDrop={onDrop}
      animate={{
        scale: isOccupied ? 1 : isActive ? 1.02 : 1,
        transition: { duration: 0.2 }
      }}
    >
      <Droplet className={`h-12 w-12 ${
        isOccupied ? 'text-green-500' :
        isActive ? 'text-blue-500' : 'text-gray-400'
      }`} />
      
      <p className={`text-sm font-medium ${
        isOccupied ? 'text-green-700' :
        isActive ? 'text-blue-700' : 'text-gray-500'
      }`}>
        Water Tap
      </p>
      
      {isActive && !isOccupied && (
        <p className="text-xs text-blue-600 text-center">
          Drop flask here to fill with water
        </p>
      )}
      
      {isOccupied && (
        <p className="text-xs text-green-600 text-center">
          Filling flask to 100 mL mark...
        </p>
      )}

      {isActive && !isOccupied && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <motion.div
            className="px-3 py-1 bg-blue-100 rounded-full text-xs text-blue-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Target: 100 mL
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}