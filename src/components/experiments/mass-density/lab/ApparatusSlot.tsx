import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Thermometer, Scale, Droplet, Beaker, FlaskRound } from 'lucide-react';

export interface ApparatusSlotProps {
  id: string;
  name: string;
  icon?: React.ReactElement;
  isActive: boolean;
  isOccupied: boolean;
  currentApparatus?: 'volumetric-flask' | 'erlenmeyer-flask';
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter?: () => void;
  onDragLeave?: () => void;
  isTargeted?: boolean;
  temperature?: number;
  showDropMessage: boolean;
}

export function ApparatusSlot({
  id,
  name,
  icon,
  isActive,
  isOccupied,
  currentApparatus,
  onDrop,
  onDragEnter,
  onDragLeave,
  isTargeted,
  temperature,
  showDropMessage
}: ApparatusSlotProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isActive && !isOccupied) {
      e.currentTarget.classList.add('bg-blue-50');
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50');
    if (isActive && !isOccupied) {
      onDrop(e);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (currentApparatus) {
      e.dataTransfer.setData('apparatus', currentApparatus);
      e.dataTransfer.effectAllowed = 'move';
      
      // Create a custom drag image
      const dragImage = document.createElement('div');
      dragImage.className = 'fixed top-0 left-0 -translate-x-full';
      dragImage.innerHTML = `
        <div class="bg-white rounded-full p-3 shadow-lg">
          ${currentApparatus === 'volumetric-flask' 
            ? '<svg class="w-8 h-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3h6l1 11H8L9 3z"/><path d="M6 14h12l-2 7H8l-2-7z"/></svg>'
            : '<svg class="w-8 h-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 3h4l4 7v8a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-8l4-7z"/></svg>'
          }
        </div>
      `;
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 40, 40);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  };

  const getIcon = () => {
    switch (id) {
      case 'drying-oven':
        return <Flame className="w-8 h-8 text-blue-500" />;
      case 'cooling-area':
        return <Thermometer className="w-8 h-8 text-slate-400" />;
      case 'weighing-scale':
        return <Scale className="w-8 h-8 text-slate-400" />;
      case 'water-tap':
        return <Droplet className="w-8 h-8 text-slate-400" />;
      default:
        return null;
    }
  };

  const getFlaskIcon = () => {
    if (!currentApparatus) return null;
    return currentApparatus === 'volumetric-flask' 
      ? <Beaker className="w-8 h-8 text-blue-500" />
      : <FlaskRound className="w-8 h-8 text-blue-500" />;
  };

  return (
    <div
      className={`relative rounded-lg p-4 transition-all ${
        isActive
          ? 'bg-blue-50 border-2 border-dashed border-blue-200'
          : 'bg-slate-50 border-2 border-dashed border-slate-200'
      } ${isTargeted ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <div className="flex items-center gap-3 mb-2">
        {icon && <div className="text-slate-400">{icon}</div>}
        <span className="text-sm font-medium text-slate-700">{name}</span>
      </div>

      {temperature && (
        <div className="text-xs text-slate-500 mb-2">
          Temperature: {temperature.toFixed(1)}°C
        </div>
      )}

      {isOccupied && currentApparatus && (
        <div className="text-xs text-slate-500">
          Contains: {currentApparatus.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </div>
      )}

      {showDropMessage && !isOccupied && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-blue-500 mt-2"
        >
          Drop here to use
        </motion.div>
      )}

      {isOccupied && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-4 cursor-grab active:cursor-grabbing"
        >
          <div
            draggable
            onDragStart={handleDragStart}
            className="cursor-grab active:cursor-grabbing"
          >
            {getFlaskIcon()}
            <span className="mt-1 block text-xs text-blue-600 text-center">
              {currentApparatus === 'volumetric-flask' ? 'Volumetric Flask' : 'Erlenmeyer Flask'}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}