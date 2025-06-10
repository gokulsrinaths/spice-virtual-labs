import React from 'react';
import { Scale } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeighingScaleProps {
  isActive: boolean;
  isOccupied: boolean;
  onDrop: (e: React.DragEvent) => void;
}

export function WeighingScale({ isActive, isOccupied, onDrop }: WeighingScaleProps) {
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
      <Scale className={`h-12 w-12 ${
        isOccupied ? 'text-green-500' :
        isActive ? 'text-blue-500' : 'text-gray-400'
      }`} />
      
      <p className={`text-sm font-medium ${
        isOccupied ? 'text-green-700' :
        isActive ? 'text-blue-700' : 'text-gray-500'
      }`}>
        Weighing Scale
      </p>
      
      {isActive && !isOccupied && (
        <p className="text-xs text-blue-600 text-center">
          Drop flask here to measure mass
        </p>
      )}
      
      {isOccupied && (
        <p className="text-xs text-green-600 text-center">
          Measuring mass...
        </p>
      )}

      {isActive && !isOccupied && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <motion.div
            className="px-3 py-1 bg-blue-100 rounded-full text-xs text-blue-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Precision: ±0.01g
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}