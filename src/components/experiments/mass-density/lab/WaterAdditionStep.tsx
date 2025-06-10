import React, { useState, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Droplet, AlertCircle, CheckCircle } from 'lucide-react';
import '../MassDensityExperiment.css';

interface WaterAdditionStepProps {
  onComplete: (volume: number) => void;
  isActive: boolean;
}

export function WaterAdditionStep({ onComplete, isActive }: WaterAdditionStepProps) {
  const [waterLevel, setWaterLevel] = useState(0);
  const [isDraggingWater, setIsDraggingWater] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const beakerRef = useRef<HTMLDivElement>(null);
  const controlsWater = useAnimation();
  const controlsRipple = useAnimation();

  const handleDragStart = () => {
    if (isActive) {
      setIsDraggingWater(true);
    }
  };

  const handleDragEnd = () => {
    setIsDraggingWater(false);
  };

  const simulateWaterDrop = async () => {
    // Play water ripple animation
    await controlsRipple.start({
      opacity: [0, 0.6, 0],
      scale: [0.5, 1.5],
      transition: { duration: 1 }
    });
    
    // Reset ripple for next drop
    controlsRipple.start({ opacity: 0, scale: 0.5 });
  };

  const handleWaterAdd = async () => {
    if (isActive) {
      // Create ripple effect
      await simulateWaterDrop();

      // Increase water level
      setWaterLevel(prev => {
        const newLevel = Math.min(100, prev + 10);
        
        // Update fill animation for visual effect
        controlsWater.start({
          height: `${newLevel}%`,
          transition: { type: "spring", stiffness: 100, damping: 15 }
        });

        // When filled to 100%, show completion
        if (newLevel === 100) {
          setShowCompletionMessage(true);
          setTimeout(() => onComplete(100), 1500);
        }
        
        return newLevel;
      });
    }
  };

  // Drag-and-drop water addition
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isActive && waterLevel < 100) {
      handleWaterAdd();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-blue-800 text-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-2">
          <Droplet className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-500" />
          <div>
            <p className="font-medium mb-1">Water Addition Guidelines</p>
            <p className="text-blue-700 text-xs">
              Fill the flask to the calibration mark (100 mL) by dragging water from the beaker 
              to the flask or clicking the beaker to add water incrementally.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Water Source (Beaker) */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm font-medium text-gray-700 mb-2">Water Source</p>
          <motion.div
            className={`
              relative w-36 h-44 rounded-md bg-gradient-to-b from-gray-50 to-gray-100
              border-2 border-blue-300 flex items-center justify-center cursor-pointer
              ${isDraggingWater ? 'shadow-lg border-blue-400' : 'shadow-md'}
            `}
            drag={isActive}
            dragSnapToOrigin={true}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={isActive ? handleWaterAdd : undefined}
            ref={beakerRef}
          >
            {/* Water in beaker */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-400 to-blue-300 rounded-b-sm water-ripple"
              style={{ height: '70%' }}
            />
            
            {/* Beaker measurement lines */}
            <div className="absolute inset-y-4 left-0 w-1 flex flex-col justify-between items-center">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3 h-0.5 bg-gray-400" />
              ))}
            </div>
            
            {/* Beaker top opening highlight */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent opacity-60 rounded-t-md" />
            
            {/* Droplet Icon */}
            <Droplet className={`h-10 w-10 z-10 ${isDraggingWater ? 'text-blue-600' : 'text-blue-500'}`} />
            
            <div className="absolute -bottom-6 text-xs text-center text-gray-500">
              Click or drag to add water
            </div>
          </motion.div>
        </motion.div>

        {/* Flask with Water Level */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm font-medium text-gray-700 mb-2">Volumetric Flask</p>
          <div
            className={`
              relative w-24 h-44 bg-white rounded-lg shadow-md overflow-hidden
              ${isActive ? 'ring-2 ring-blue-300' : 'opacity-70'}
            `}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Flask shape SVG */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 100 180" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M35 10 L65 10 L65 80 L78 140 A30 30 0 1 1 22 140 L35 80 Z" 
                fill="transparent" 
                stroke="#d1d5db" 
                strokeWidth="2"
              />
              {/* Calibration mark */}
              <line 
                x1="22" y1="140" x2="78" y2="140" 
                stroke="#374151" 
                strokeWidth="2" 
                strokeDasharray={waterLevel >= 100 ? "0" : "4 2"}
              />
              <text x="84" y="144" fill="#4b5563" fontSize="10">100mL</text>
            </svg>
            
            {/* Water in flask */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-400/80 to-blue-300/80"
              style={{ height: '0%', borderRadius: '0 0 0.5rem 0.5rem' }}
              animate={controlsWater}
            />
            
            {/* Water ripple animation when adding water */}
            <motion.div 
              className="absolute left-1/2 top-[60%] w-20 h-20 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0) 70%)',
                opacity: 0,
                scale: 0.5
              }}
              animate={controlsRipple}
            />
          </div>
          
          <div className="mt-2 text-sm font-medium">
            <div className="flex items-center justify-center gap-2">
              <div className={`w-3 h-3 rounded-full ${waterLevel < 100 ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
              <span>{waterLevel.toFixed(0)}% filled</span>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showCompletionMessage && (
          <motion.div
            className="p-4 bg-green-50 rounded-lg border border-green-100 text-green-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Flask successfully filled to the 100mL mark!</span>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="p-4 bg-red-50 rounded-lg border border-red-100 text-red-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}