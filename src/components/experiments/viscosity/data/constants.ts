import { Ball, Fluid } from '../types';

export const TUBE_HEIGHT = 150; // cm

export const balls: Ball[] = [
  { id: 'D1', name: 'Ball D₁', diameter: 10, density: 7800 },
  { id: 'D2', name: 'Ball D₂', diameter: 15, density: 7800 },
  { id: 'D3', name: 'Ball D₃', diameter: 20, density: 7800 },
  { id: 'D4', name: 'Ball D₄', diameter: 25, density: 7800 }
];

export const fluids: Fluid[] = [
  {
    id: 'water',
    name: 'Water',
    density: 998.2,
    viscosity: 0.001002,
    color: '#60A5FA'
  },
  {
    id: 'oil',
    name: 'Vegetable Oil',
    density: 920,
    viscosity: 0.069,
    color: '#FCD34D'
  }
];