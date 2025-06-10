import React from 'react';
import { Thermometer, Droplet } from 'lucide-react';

interface ApparatusStatusProps {
  location?: 'drying-oven' | 'cooling-area' | 'weighing-scale' | 'water-tap' | null;
  temperature?: number;
  flaskStatus?: 'hot' | 'cool' | 'filled' | null;
}

export function ApparatusStatus({ location, temperature, flaskStatus }: ApparatusStatusProps) {
  if (!location) return null;

  return (
    <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium text-slate-700">Current Location:</div>
          <div className="text-sm text-slate-600">{formatLocation(location)}</div>
        </div>
        
        {temperature && (
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-slate-500" />
            <div className="text-sm text-slate-600">{temperature}°C</div>
          </div>
        )}
        
        {flaskStatus && (
          <div className="flex items-center space-x-2">
            <Droplet className="h-4 w-4 text-slate-500" />
            <div className="text-sm text-slate-600">{formatStatus(flaskStatus)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatLocation(location: string): string {
  return location.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function formatStatus(status: string): string {
  switch (status) {
    case 'hot': return 'Hot';
    case 'cool': return 'Cooled';
    case 'filled': return 'Filled';
    default: return '';
  }
}