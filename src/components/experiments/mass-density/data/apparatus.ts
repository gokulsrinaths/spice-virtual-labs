import { Beaker, FlaskRound as Flask } from 'lucide-react';
import { Apparatus } from '../types';

export const apparatus: Apparatus[] = [
  {
    id: 'volumetric-flask',
    name: '100-mL Volumetric Flask',
    description: 'High precision volumetric flask with calibration mark',
    icon: Beaker,
    specifications: {
      accuracy: '±0.1 mL',
      volume: '100 mL'
    },
    safetyNotes: [
      'Handle with care to avoid breakage',
      'Ensure proper cleaning before use'
    ]
  },
  {
    id: 'erlenmeyer-flask',
    name: '250-mL Erlenmeyer Flask',
    description: 'Wide-bottom flask ideal for mixing and heating solutions',
    icon: Flask,
    specifications: {
      volume: '250 mL',
      material: 'Borosilicate glass',
      graduations: 'Every 50 mL',
      maxTemp: '150°C'
    },
    safetyNotes: [
      'Heat-resistant up to 150°C',
      'Do not heat empty flask',
      'Check for cracks before each use',
      'Use heat-resistant gloves when handling hot flask'
    ]
  }
];