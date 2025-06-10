import React from 'react';
import { motion } from 'framer-motion';

interface HeatingFlaskProps {
  isHeating: boolean;
}

export function HeatingFlask({ isHeating }: HeatingFlaskProps) {
  return (
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
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {/* Bubbles */}
            {isHeating && Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 w-2 h-2 bg-blue-100 rounded-full"
                style={{ left: `${20 + i * 15}%` }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </motion.div>
        </div>
        {/* Flask neck */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-2 border-gray-300" />
        {/* Thermometer */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-24 bg-red-500 rounded-full" />
      </div>
      {/* Hot plate */}
      <div className="w-40 h-4 bg-gray-600 rounded-lg -ml-4" />
    </div>
  );
}