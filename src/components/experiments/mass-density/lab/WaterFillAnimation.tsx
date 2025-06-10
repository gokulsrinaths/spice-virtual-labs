import React from 'react';
import { motion } from 'framer-motion';
import { Droplet } from 'lucide-react';

interface WaterFillAnimationProps {
  onComplete: () => void;
  selectedFlask?: 'volumetric-flask' | 'erlenmeyer-flask';
}

// SVG Flask Components with Water Fill Animation
const VolumetricFlask = ({ fillPercentage = 0 }) => (
  <svg 
    width="120" 
    height="140" 
    viewBox="0 0 100 140" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-md"
  >
    {/* Flask outline */}
    <path d="M35 10 L65 10 L65 40 L72 100 A20 20 0 0 1 28 100 L35 40 Z" 
      stroke="#2563EB" 
      strokeWidth="2" 
      fill="white" 
    />
    
    {/* Neck */}
    <rect x="35" y="5" width="30" height="5" fill="white" stroke="#2563EB" strokeWidth="2" />
    
    {/* Calibration mark */}
    <line x1="28" y1="100" x2="72" y2="100" stroke="#1E40AF" strokeWidth="1.5" />
    <text x="75" y="102" fill="#2563EB" fontSize="6">100mL</text>
    
    {/* Fill level - animated */}
    <motion.path 
      d={`M35 ${100 - fillPercentage * 0.6} L65 ${100 - fillPercentage * 0.6} L72 100 A20 20 0 0 1 28 100 L35 ${100 - fillPercentage * 0.6} Z`}
      fill="#93C5FD" 
      fillOpacity="0.8"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 0.8,
        y: [0, -1, 0],
      }}
      transition={{ 
        y: { 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut"
        }, 
        opacity: { duration: 0.5 } 
      }}
    />
    
    {/* Water ripple effect */}
    <motion.ellipse
      cx="50"
      cy="100 - (fillPercentage * 0.6)"
      rx="15"
      ry="2"
      fill="#60A5FA"
      opacity="0.5"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 0.5, 0],
        rx: [5, 15, 5],
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
      }}
    />
  </svg>
);

const ErlenmeyerFlask = ({ fillPercentage = 0 }) => (
  <svg 
    width="120" 
    height="140" 
    viewBox="0 0 100 140" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-md"
  >
    {/* Flask outline */}
    <path d="M35 10 L65 10 L80 100 A20 20 0 0 1 20 100 L35 10 Z" 
      stroke="#2563EB" 
      strokeWidth="2" 
      fill="white" 
    />
    
    {/* Neck */}
    <rect x="35" y="5" width="30" height="5" fill="white" stroke="#2563EB" strokeWidth="2" />
    
    {/* Calibration marks */}
    <line x1="26" y1="80" x2="74" y2="80" stroke="#1E40AF" strokeWidth="1" />
    <text x="77" y="82" fill="#2563EB" fontSize="6">150mL</text>
    
    {/* Fill level - animated */}
    <motion.path 
      d={`M${35 + (45 - 35) * (fillPercentage / 100)} ${100 - fillPercentage * 0.7} 
         L${65 - (65 - 55) * (fillPercentage / 100)} ${100 - fillPercentage * 0.7} 
         L70 100 A20 20 0 0 1 30 100 
         L${35 + (45 - 35) * (fillPercentage / 100)} ${100 - fillPercentage * 0.7} Z`}
      fill="#93C5FD" 
      fillOpacity="0.8"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 0.8,
        y: [0, -1, 0],
      }}
      transition={{ 
        y: { 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut"
        }, 
        opacity: { duration: 0.5 } 
      }}
    />
    
    {/* Water ripple effect */}
    <motion.ellipse
      cx="50"
      cy="100 - (fillPercentage * 0.7)"
      rx="15"
      ry="2"
      fill="#60A5FA"
      opacity="0.5"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 0.5, 0],
        rx: [5, 15, 5],
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
      }}
    />
  </svg>
);

export function WaterFillAnimation({ onComplete, selectedFlask = 'volumetric-flask' }: WaterFillAnimationProps) {
  const [volume, setVolume] = React.useState(0);
  const targetVolume = selectedFlask === 'volumetric-flask' ? 100 : 150; // Set target based on flask type
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setVolume(prev => {
        const newVolume = prev + (Math.random() * 2);
        if (newVolume >= targetVolume) {
          clearInterval(interval);
          if (!isComplete) {
            setIsComplete(true);
            setTimeout(() => onComplete(), 1000);
          }
          return targetVolume;
        }
        return newVolume;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete, isComplete, targetVolume]);

  const flaskName = selectedFlask === 'volumetric-flask' ? '100-mL Volumetric Flask' : '250-mL Erlenmeyer Flask';
  const fillPercentage = (volume / targetVolume) * 100;

  return (
    <motion.div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-xl p-6 w-[450px] shadow-2xl overflow-hidden glass-effect"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Droplet className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Filling Flask with Water
            </h3>
          </div>
          <div className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
            Water Addition
          </div>
        </div>

        {/* Improved visualization */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {selectedFlask === 'volumetric-flask' ? 
              <VolumetricFlask fillPercentage={fillPercentage} /> : 
              <ErlenmeyerFlask fillPercentage={fillPercentage} />
            }
            
            {/* Water droplets animation */}
            {!isComplete && (
              <motion.div
                className="absolute top-[-10px] left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  y: [-10, 10],
                  x: [0, Math.random() * 6 - 3]
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity,
                  repeatDelay: 0.2
                }}
              >
                <svg width="10" height="15" viewBox="0 0 10 15" fill="none">
                  <path d="M5 0 L10 8 A5 5 0 0 1 0 8 Z" fill="#60A5FA" />
                </svg>
              </motion.div>
            )}
            
            {/* Water level indicator */}
            <div className="absolute -right-12 top-0 bottom-0 w-2">
              <div className="h-full relative bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 bg-blue-500"
                  initial={{ height: "0%" }}
                  animate={{ height: `${fillPercentage}%` }}
                  transition={{ duration: 0.2 }}
                />
                
                {/* Calibration mark */}
                <div className="absolute left-0 right-0 border-t border-dashed border-gray-400"
                     style={{ top: '28%' }}>
                  <div className="absolute -right-5 -top-2 text-[9px] text-gray-500">150mL</div>
                </div>
                
                <div className="absolute left-0 right-0 border-t border-dashed border-gray-400"
                     style={{ top: '72%' }}>
                  <div className="absolute -right-5 -top-2 text-[9px] text-gray-500">100mL</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-600 mb-1">Flask Type</div>
              <div className="text-sm font-medium text-gray-800">{flaskName}</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-600 mb-1">Target Volume</div>
              <div className="text-sm font-medium text-gray-800">{targetVolume} mL</div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center">
              <div className="text-xs text-blue-600 mb-1">Current Volume</div>
              <div className="text-sm font-medium text-blue-700">{volume.toFixed(1)} mL</div>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden mt-1">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${fillPercentage}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
          
          <div className="mt-1 text-center">
            {!isComplete ? (
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-flex items-center text-sm text-gray-500"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="mr-1">
                  <path d="M12 2v6m0 14v-6m-8-4h6M22 10h-6" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Filling flask with water...</span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Flask filled to {targetVolume} mL mark!</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}