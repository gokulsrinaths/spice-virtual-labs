import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer } from 'lucide-react';

interface CoolingAreaProps {
  isActive: boolean;
  isOccupied: boolean;
  onDrop: (e: React.DragEvent) => void;
}

export function CoolingArea({ isActive, isOccupied, onDrop }: CoolingAreaProps) {
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
        ${isOccupied ? 'border-green-500 bg-green-50' :
          isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
      `}
      onDragOver={handleDragOver}
      onDrop={onDrop}
    >
      <Thermometer className={`h-12 w-12 ${
        isOccupied ? 'text-green-500' :
        isActive ? 'text-blue-500' : 'text-gray-400'
      }`} />
      <p className={`text-sm font-medium ${
        isOccupied ? 'text-green-700' :
        isActive ? 'text-blue-700' : 'text-gray-500'
      }`}>
        Cooling Area
      </p>
      {isActive && !isOccupied && (
        <p className="text-xs text-blue-600">Drop flask here to cool</p>
      )}
      {isOccupied && (
        <p className="text-xs text-green-600">Flask cooling to ambient temperature</p>
      )}
    </motion.div>
  );
}