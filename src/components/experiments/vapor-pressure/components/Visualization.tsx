import React from 'react';
import { motion } from 'framer-motion';
import { Beaker } from 'lucide-react';

interface VisualizationProps {
  temperature: number;
  pressure: number;
  isHeating: boolean;
  heightDifference?: number;
}

export function Visualization({ temperature, pressure, isHeating, heightDifference }: VisualizationProps) {
  // Calculate bubble animation speed based on temperature
  const bubbleSpeed = Math.max(0.5, Math.min(3, temperature / 33.33));
  
  // Calculate vapor intensity based on temperature
  const vaporIntensity = Math.min(1, temperature / 100);
  
  // Calculate water animation frequency based on temperature
  const waterFrequency = Math.max(2, Math.min(4, temperature / 25));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Beaker className="h-5 w-5 text-blue-500" />
        Experiment Visualization
      </h2>
      
      <div className="relative h-[500px] bg-gray-100 rounded-lg overflow-hidden">
        {/* Flask with water */}
        <div className="absolute bottom-8 left-12">
          <div className="relative w-32 h-40">
            {/* Flask body */}
            <div className="absolute bottom-0 w-full h-32 bg-white border-2 border-gray-300 rounded-b-3xl overflow-hidden">
              {/* Water */}
              <motion.div
                className="absolute bottom-0 w-full bg-blue-200"
                style={{ height: '80%' }}
                animate={{
                  height: ['80%', '75%', '80%'],
                }}
                transition={{
                  duration: waterFrequency,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                {/* Bubbles */}
                {(isHeating || temperature > 30) && Array.from({ length: Math.ceil(temperature / 20) }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bottom-0 w-2 h-2 bg-blue-100 rounded-full"
                    style={{ left: `${20 + (i % 5) * 15}%` }}
                    animate={{
                      y: [0, -40, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3 / bubbleSpeed,
                      repeat: Infinity,
                      delay: i * (0.5 / bubbleSpeed)
                    }}
                  />
                ))}
              </motion.div>
            </div>
            
            {/* Flask neck with vapor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-2 border-gray-300 overflow-hidden">
              {temperature > 40 && (
                <motion.div
                  className="absolute inset-0 bg-blue-100/30"
                  animate={{
                    opacity: [0, vaporIntensity, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              )}
            </div>
            
            {/* Thermometer */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-24 bg-gradient-to-t from-red-500 to-red-200 rounded-full" 
                 style={{ 
                   backgroundSize: '100% 200%',
                   backgroundPosition: `0 ${100 - (temperature/100 * 100)}%`
                 }}
            />
          </div>
          {/* Hot plate with glow effect */}
          <div className={`w-40 h-4 bg-gray-600 rounded-lg -ml-4 relative ${isHeating ? 'after:absolute after:inset-0 after:bg-red-500/20 after:animate-pulse' : ''}`} />
        </div>

        {/* Manometer */}
        <div className="absolute right-12 top-8 bottom-8 w-24">
          <div className="absolute inset-0 border-2 border-gray-300 rounded-lg overflow-hidden">
            {/* Scale */}
            <div className="absolute right-0 inset-y-0 w-6 flex flex-col justify-between py-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="w-2 h-px bg-gray-400" />
                  <span className="text-xs text-gray-600">{150 - i * 10}</span>
                </div>
              ))}
            </div>
            {/* Mercury level */}
            <motion.div
              className="absolute bottom-0 left-0 right-6 bg-gray-400"
              initial={{ height: '60%' }}
              animate={{ 
                height: heightDifference 
                  ? `${Math.max(0, Math.min(100, 60 - heightDifference))}%` 
                  : '60%'
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Temperature display */}
        <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-600">Temperature</div>
          <div className="text-lg font-bold text-blue-600">{temperature}°C</div>
        </div>

        {/* Pressure display */}
        <div className="absolute top-4 right-40 bg-white px-3 py-2 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-600">Vapor Pressure</div>
          <div className="text-lg font-bold text-blue-600">{pressure.toFixed(2)} kPa</div>
        </div>
      </div>
    </div>
  );
}