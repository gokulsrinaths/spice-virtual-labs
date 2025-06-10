import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Info } from 'lucide-react';
import '../MassDensityExperiment.css';

interface ApparatusListProps {
  selectedApparatus: string | null;
  onApparatusSelect: (apparatus: string | null) => void;
  usedApparatus: string[];
  isTemperatureSet: boolean;
}

export function ApparatusList({
  selectedApparatus,
  onApparatusSelect,
  usedApparatus,
  isTemperatureSet
}: ApparatusListProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, apparatus: string) => {
    e.dataTransfer.setData('apparatus', apparatus);
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a custom drag image
    const dragImage = document.createElement('div');
    dragImage.className = 'fixed top-0 left-0 -translate-x-full';
    dragImage.innerHTML = `
      <div class="bg-white rounded-full p-3 shadow-lg">
        <svg class="w-12 h-12 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${apparatus === 'volumetric-flask' 
            ? '<path d="M8 3h8l1 16H7L8 3z"></path><path d="M8 16h8"></path>'
            : '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"></path><path d="M8.5 2h7"></path><path d="M7 16h10"></path>'}
        </svg>
      </div>
    `;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 40, 40);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    onApparatusSelect(null);
  };

  const apparatus = [
    {
      id: 'volumetric-flask',
      name: 'Volumetric Flask',
      description: '100 mL capacity, Class A precision',
      details: 'Calibrated at 20°C, ±0.08 mL tolerance'
    },
    {
      id: 'erlenmeyer-flask',
      name: 'Erlenmeyer Flask',
      description: '250 mL capacity, wide base design',
      details: 'Borosilicate glass, heat-resistant up to 500°C'
    }
  ];

  // Render SVG icons directly instead of relying on image files
  const renderFlaskIcon = (type: string, disabled: boolean) => {
    const color = disabled ? '#9CA3AF' : '#3B82F6';
    
    if (type === 'volumetric-flask') {
      return (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3h8l1 16H7L8 3z"></path>
          <path d="M8 16h8"></path>
        </svg>
      );
    } else {
      return (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"></path>
          <path d="M8.5 2h7"></path>
          <path d="M7 16h10"></path>
        </svg>
      );
    }
  };

  return (
    <div className="p-4 space-y-4">
      {apparatus.map((item) => {
        const isUsed = usedApparatus.includes(item.id);
        const isDisabled = isUsed || !isTemperatureSet;

        return (
          <motion.div
            key={item.id}
            className={`
              relative p-4 rounded-lg transition-all equipment-hover
              ${isDisabled
                ? 'border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed'
                : 'border border-blue-100 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50 cursor-grab active:cursor-grabbing shadow-sm'
              }
            `}
            whileHover={!isDisabled ? { scale: 1.02 } : {}}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Using a regular div for drag operations */}
            <div 
              draggable={!isDisabled}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragEnd={handleDragEnd}
              className="flex items-center gap-4"
            >
              <div className={`relative w-20 h-20 rounded-lg overflow-hidden bg-white ${!isDisabled ? 'flask-shimmer' : ''} flex items-center justify-center`}>
                {renderFlaskIcon(item.id, isDisabled)}
              </div>
              <div className="flex-1">
                <h3 className={`text-base font-medium ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                  {item.name}
                </h3>
                <p className={`text-xs mt-1 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.description}
                </p>
                <div className="flex items-center mt-2">
                  <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${isDisabled ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600'}`}>
                    <Info className="h-3 w-3 mr-1" />
                    {item.details}
                  </span>
                </div>
              </div>
            </div>
            
            {isUsed && (
              <div className="absolute -top-2 -right-2 bg-blue-100 rounded-full p-1 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
            )}

            {!isUsed && !isTemperatureSet && (
              <div className="absolute inset-0 bg-gray-200 bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center rounded-lg">
                <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded shadow-sm">
                  Set Temperature First
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
      
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Laboratory Note</h4>
        <p className="text-xs text-blue-700">
          All glassware has been calibrated according to ISO 4787 standards. Handle with care and verify 
          cleanliness before use. For accurate density measurements, ensure temperature equilibration.
        </p>
      </div>
    </div>
  );
}