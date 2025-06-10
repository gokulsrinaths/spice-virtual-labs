import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, MoveHorizontal, ChevronDown } from 'lucide-react';
import '../MassDensityExperiment.css';

export interface WeighingAnimationProps {
  onComplete: (mass: number) => void;
  isFinal?: boolean;
  selectedFlask?: 'volumetric-flask' | 'erlenmeyer-flask';
  temperature?: number;
}

// SVG Flask Components
const VolumetricFlask = ({ isFilled = false }) => (
  <svg 
    width="100" 
    height="120" 
    viewBox="0 0 100 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-md"
  >
    {/* Flask outline */}
    <path d="M35 10 L65 10 L65 40 L72 100 A20 20 0 0 1 28 100 L35 40 Z" 
      stroke="#2563EB" 
      strokeWidth="2" 
      fill={isFilled ? "#DBEAFE" : "white"} 
    />
    
    {/* Neck */}
    <rect x="35" y="5" width="30" height="5" fill="white" stroke="#2563EB" strokeWidth="2" />
    
    {/* Calibration mark */}
    <line x1="28" y1="100" x2="72" y2="100" stroke="#1E40AF" strokeWidth="1.5" />
    <text x="75" y="102" fill="#2563EB" fontSize="6">100mL</text>
    
    {/* Fill level - only shown if isFilled is true */}
    {isFilled && (
      <path 
        d="M35 40 L65 40 L72 100 A20 20 0 0 1 28 100 L35 40 Z" 
        fill="#93C5FD" 
        fillOpacity="0.8"
      >
        <animate 
          attributeName="d" 
          dur="3s" 
          repeatCount="indefinite" 
          values="
            M35 40 L65 40 L72 100 A20 20 0 0 1 28 100 L35 40 Z;
            M35 40 L65 40 L73 100 A20 20 0 0 1 27 100 L35 40 Z;
            M35 40 L65 40 L72 100 A20 20 0 0 1 28 100 L35 40 Z"
        />
      </path>
    )}
  </svg>
);

const ErlenmeyerFlask = ({ isFilled = false }) => (
  <svg 
    width="100" 
    height="120" 
    viewBox="0 0 100 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-md"
  >
    {/* Flask outline */}
    <path d="M35 10 L65 10 L80 100 A20 20 0 0 1 20 100 L35 10 Z" 
      stroke="#2563EB" 
      strokeWidth="2" 
      fill={isFilled ? "#DBEAFE" : "white"} 
    />
    
    {/* Neck */}
    <rect x="35" y="5" width="30" height="5" fill="white" stroke="#2563EB" strokeWidth="2" />
    
    {/* Calibration marks */}
    <line x1="26" y1="80" x2="74" y2="80" stroke="#1E40AF" strokeWidth="1" strokeDasharray="2 1" />
    <text x="77" y="82" fill="#2563EB" fontSize="6">150mL</text>
    
    {/* Fill level - only shown if isFilled is true */}
    {isFilled && (
      <path 
        d="M35 60 L55 60 L62 80 A20 20 0 0 1 38 80 L35 60 Z" 
        fill="#93C5FD" 
        fillOpacity="0.8"
      >
        <animate 
          attributeName="d" 
          dur="3s" 
          repeatCount="indefinite" 
          values="
            M35 60 L55 60 L62 80 A20 20 0 0 1 38 80 L35 60 Z;
            M35 60 L55 60 L63 80 A20 20 0 0 1 37 80 L35 60 Z;
            M35 60 L55 60 L62 80 A20 20 0 0 1 38 80 L35 60 Z"
        />
      </path>
    )}
  </svg>
);

export function WeighingAnimation({ 
  onComplete, 
  isFinal = false, 
  selectedFlask = 'volumetric-flask',
  temperature = 20
}: WeighingAnimationProps) {
  const [mass, setMass] = useState(0);
  const [displayMass, setDisplayMass] = useState("0.000");
  const [isComplete, setIsComplete] = useState(false);
  const [digitIndex, setDigitIndex] = useState(0);
  const [scaleStabilized, setScaleStabilized] = useState(false);

  // Get target mass based on flask type and whether it's initial or final weighing
  const getTargetMass = () => {
    if (!isFinal) {
      // Initial weighing (M1)
      return selectedFlask === 'volumetric-flask' ? 150 : 300; // Erlenmeyer flask M1 is 300g
    } else {
      // Final weighing (M2)
      if (selectedFlask === 'volumetric-flask') {
        // For 100mL volumetric flask:
        // M2 = M1 + water mass
        // Water mass = density * volume = 0.998 g/mL * 100 mL = 99.8 g
        return 249.82; // 150g (flask) + 99.82g (water)
      } else {
        // For 250mL Erlenmeyer flask with 150mL water
        // Temperature-dependent M2 calculation
        // Base water mass = 150mL * 0.998 g/mL = 149.7g
        // Temperature correction factor = -0.0002 g/mL/°C
        const waterDensity = 0.998 - (0.0002 * (temperature - 20)); // Density correction
        const waterMass = 150 * waterDensity;
        return 300 + waterMass; // 300g (flask) + temperature-adjusted water mass
      }
    }
  };

  const targetMass = getTargetMass();

  // Digital display animation
  useEffect(() => {
    const updateDisplay = () => {
      // Format with 3 decimal places
      const formatted = mass.toFixed(3);
      setDisplayMass(formatted);
    };
    
    updateDisplay();
    
    // Simulate flickering digital display during measurement
    if (!isComplete && mass > 0) {
      const flickerInterval = setInterval(() => {
        const randomDigit = Math.floor(Math.random() * 10);
        setDigitIndex(Math.floor(Math.random() * 5)); // Randomly flicker different positions
        
        setDisplayMass(prev => {
          const chars = prev.split('');
          if (digitIndex < chars.length) {
            chars[digitIndex] = randomDigit.toString();
          }
          return chars.join('');
        });
      }, 100);
      
      return () => clearInterval(flickerInterval);
    }
  }, [mass, isComplete, digitIndex]);

  // Mass measurement animation
  useEffect(() => {
    const startTime = Date.now();
    const duration = isFinal ? 3000 : 2000; // Final weighing takes longer due to more mass
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Simulate a realistic weighing with initial oscillation
      const oscillation = Math.sin(progress * 10) * (1 - progress) * 5;
      const newMass = progress * targetMass + oscillation;
      
      setMass(Math.max(0, newMass));
      
      // Simulate stabilization
      if (progress > 0.8 && !scaleStabilized) {
        setScaleStabilized(true);
      }
      
      if (progress === 1) {
        clearInterval(interval);
        if (!isComplete) {
          setIsComplete(true);
          setMass(targetMass); // Set exact target mass
          setTimeout(() => onComplete(targetMass), 1000);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete, isComplete, targetMass, isFinal]);

  const flaskName = selectedFlask === 'volumetric-flask' ? '100-mL Volumetric Flask' : '250-mL Erlenmeyer Flask';

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
              <Scale className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isFinal ? 'Final Mass Measurement' : 'Empty Flask Mass'}
            </h3>
          </div>
          <div className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
            Precision Scale
          </div>
        </div>

        {/* Scale display with flask */}
        <div className="mb-8 relative">
          <div className="relative h-[180px] bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg flex flex-col items-center justify-center border border-gray-200">
            {/* Scale platform */}
            <motion.div 
              className="w-[250px] h-[30px] bg-gradient-to-b from-gray-300 to-gray-400 rounded-md relative z-10"
              animate={{ 
                y: mass > 0 ? [0, 4, 2] : 0,
              }}
              transition={{ duration: 0.5, times: [0, 0.7, 1] }}
            >
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
            </motion.div>
            
            {/* Flask on scale - using inline SVG instead of img */}
            <motion.div 
              className="absolute bottom-[30px] left-1/2 transform -translate-x-1/2"
              animate={{ 
                y: mass > 0 ? [0, 4, 2] : 0,
              }}
              transition={{ duration: 0.5, times: [0, 0.7, 1] }}
            >
              {selectedFlask === 'volumetric-flask' ? 
                <VolumetricFlask isFilled={isFinal} /> : 
                <ErlenmeyerFlask isFilled={isFinal} />
              }
            </motion.div>
            
            {/* Digital display */}
            <div className="absolute top-2 right-2 bg-black rounded-md p-1 shadow-inner">
              <div className="w-[100px] h-[30px] bg-gradient-to-b from-[#a5d6a7] to-[#66bb6a] rounded flex items-center justify-center font-mono text-black border border-gray-700">
                <span className="tracking-wider">{displayMass}</span>
                <span className="text-xs ml-1">g</span>
              </div>
            </div>
            
            {/* Stabilization indicator */}
            <div className="absolute top-2 left-2 flex items-center">
              <motion.div 
                className={`w-2 h-2 rounded-full mr-1 ${scaleStabilized ? 'bg-green-500' : 'bg-yellow-500'}`}
                animate={{ opacity: scaleStabilized ? 1 : [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: scaleStabilized ? 0 : Infinity }}
              ></motion.div>
              <span className="text-xs text-gray-600">{scaleStabilized ? 'Stable' : 'Stabilizing...'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-600 mb-1">Flask Type</div>
              <div className="text-sm font-medium text-gray-800">{flaskName}</div>
            </div>
            
            {isFinal && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-600 mb-1">Temperature</div>
                <div className="text-sm font-medium text-gray-800">{temperature}°C</div>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center">
              <div className="text-xs text-blue-600 mb-1">Current Reading</div>
              <div className="text-sm font-medium text-blue-700">{displayMass} g</div>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden mt-1">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${(mass / targetMass) * 100}%` }}
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
                <MoveHorizontal className="h-3 w-3 mr-1" />
                <span>Stabilizing measurement...</span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full"
              >
                <ChevronDown className="h-3 w-3 mr-1" />
                {isFinal ? 
                  `Final mass: ${targetMass.toFixed(3)} g` :
                  `Empty flask mass: ${targetMass.toFixed(3)} g`}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}