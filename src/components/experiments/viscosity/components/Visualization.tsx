import React from 'react';
import { Ruler } from 'lucide-react';
import { Ball, Fluid } from '../types';
import { TUBE_HEIGHT } from '../data/constants';

interface VisualizationProps {
  selectedBall: Ball;
  selectedFluid: Fluid;
  isDropping: boolean;
  currentStep: number;
  onDropComplete?: () => void;
}

export function Visualization({ 
  selectedBall, 
  selectedFluid, 
  isDropping,
  currentStep,
  onDropComplete 
}: VisualizationProps) {
  const [currentPosition, setCurrentPosition] = React.useState<number>(0);
  const [yCoordinates, setYCoordinates] = React.useState<number[]>([]);
  const fallDuration = 8; // seconds

  React.useEffect(() => {
    if (isDropping) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const progress = Math.min(elapsedTime / fallDuration, 1);
        const newPosition = progress * TUBE_HEIGHT;
        setCurrentPosition(newPosition);
        
        // Record Y-coordinate every 25cm
        if (progress < 1 && Math.floor(newPosition / 25) > yCoordinates.length) {
          setYCoordinates(prev => [...prev, TUBE_HEIGHT - newPosition]);
        }
        
        if (progress === 1) {
          clearInterval(interval);
          if (onDropComplete) {
            onDropComplete();
          }
        }
      }, 50);

      return () => clearInterval(interval);
    } else {
      setCurrentPosition(0);
      setYCoordinates([]);
    }
  }, [isDropping, onDropComplete]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Ruler className="h-5 w-5 text-blue-500" />
        Experiment Visualization
      </h2>
      
      <div className="relative h-[600px] bg-gray-100 rounded-lg overflow-hidden">
        {/* Measuring tube */}
        <div 
          className="absolute left-1/2 top-4 bottom-4 w-20 -translate-x-1/2 border-2 border-gray-300 rounded-lg overflow-hidden"
          style={{ backgroundColor: `${selectedFluid.color}20` }}
        >
          {/* Fluid */}
          <div 
            className="absolute inset-x-0 bottom-0"
            style={{ 
              height: '100%',
              backgroundColor: selectedFluid.color,
              opacity: 0.3
            }}
          />

          {/* Height markers */}
          <div className="absolute right-0 inset-y-0 w-12 flex flex-col justify-between py-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-px bg-gray-400" />
                <span className="text-xs text-gray-600">{150 - i * 10}</span>
              </div>
            ))}
          </div>

          {/* Ball */}
          {currentStep >= 3 && (
            <div
              className="absolute left-1/2 -translate-x-1/2 rounded-full bg-gray-800"
              style={{
                width: `${selectedBall.diameter * 0.8}px`,
                height: `${selectedBall.diameter * 0.8}px`,
                top: `${(currentPosition / TUBE_HEIGHT) * 100}%`,
                transition: 'top 50ms linear'
              }}
            />
          )}

          {/* Y-coordinate measurements */}
          {yCoordinates.map((y, index) => (
            <div
              key={index}
              className="absolute right-0 bg-blue-100 px-2 py-1 rounded-l-md text-xs"
              style={{ top: `${(y / TUBE_HEIGHT) * 100}%`, transform: 'translateY(-50%)' }}
            >
              Δy = {y.toFixed(1)} cm
            </div>
          ))}
        </div>

        {/* Properties display */}
        <div className="absolute top-4 left-4 bg-white/90 p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium mb-2">Properties</h3>
          <div className="space-y-1 text-sm">
            <div>Fluid: {selectedFluid.name}</div>
            <div>Density: {selectedFluid.density} kg/m³</div>
            <div>Ball: {selectedBall.name}</div>
            <div>Diameter: {selectedBall.diameter} mm</div>
          </div>
        </div>

        {/* Current position display */}
        {isDropping && (
          <div className="absolute bottom-4 left-4 bg-white/90 p-4 rounded-lg shadow-md">
            <div className="text-sm font-medium">
              Current Position: {(TUBE_HEIGHT - currentPosition).toFixed(1)} cm
            </div>
          </div>
        )}
      </div>
    </div>
  );
}