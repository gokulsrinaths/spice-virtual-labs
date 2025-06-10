import React, { useState } from 'react';
import { Thermometer, Scale, Droplet, Flame, ChevronDown, ChevronUp } from 'lucide-react';

interface ApparatusPanelProps {
  selectedApparatus: string | null;
  setSelectedApparatus: (apparatus: string | null) => void;
}

const apparatus = [
  { 
    id: 'drying-oven', 
    name: 'Drying Ovens', 
    icon: Flame,
    description: 'Used to remove moisture from glassware at controlled temperatures.'
  },
  { 
    id: 'balance', 
    name: 'Balance', 
    icon: Scale,
    description: 'Precision instrument for measuring mass accurately.'
  },
  { 
    id: 'water-pipe', 
    name: 'Water Pipe', 
    icon: Droplet,
    description: 'Delivers distilled water for the experiment.'
  },
  { 
    id: 'thermometer', 
    name: 'Thermometer', 
    icon: Thermometer,
    description: 'Measures liquid temperature with high precision.'
  },
];

export function ApparatusPanel({ selectedApparatus, setSelectedApparatus }: ApparatusPanelProps) {
  const [expandedApparatus, setExpandedApparatus] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedApparatus(expandedApparatus === id ? null : id);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Available Apparatus</h3>
      
      <div className="space-y-4">
        {apparatus.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden">
            <button
              className={`w-full p-4 flex items-center justify-between transition-colors ${
                selectedApparatus === item.id
                  ? 'bg-blue-50 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => toggleExpand(item.id)}
            >
              <div className="flex items-center">
                <item.icon className="h-6 w-6 text-blue-500 mr-3" />
                <span>{item.name}</span>
              </div>
              {expandedApparatus === item.id ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedApparatus === item.id && (
              <div className="p-4 bg-gray-50 border-t">
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <button
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  onClick={() => setSelectedApparatus(item.id)}
                >
                  Select Apparatus
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}