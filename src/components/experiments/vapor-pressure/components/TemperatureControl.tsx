import React from 'react';
import { ThermometerSun } from 'lucide-react';

interface TemperatureControlProps {
  temperature: number;
  onTemperatureChange: (temp: number) => void;
}

export function TemperatureControl({ temperature, onTemperatureChange }: TemperatureControlProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ThermometerSun className="h-5 w-5 text-blue-500" />
        Temperature Control
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Water Temperature (°C)
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={temperature}
            onChange={(e) => onTemperatureChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-lg font-medium text-blue-600">
            {temperature}°C
          </div>
        </div>

        {/* Temperature Presets */}
        <div className="grid grid-cols-4 gap-2">
          {[25, 50, 75, 100].map((temp) => (
            <button
              key={temp}
              onClick={() => onTemperatureChange(temp)}
              className={`
                px-2 py-1 rounded text-sm font-medium
                ${temperature === temp 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              {temp}°C
            </button>
          ))}
        </div>

        {/* Boiling Point Indicator */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            {temperature >= 100 
              ? "Water will boil at this temperature (100°C at 1 atm)"
              : `${100 - temperature}°C below boiling point`
            }
          </p>
        </div>
      </div>
    </div>
  );
}