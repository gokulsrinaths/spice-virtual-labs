import { Droplets, Gauge, Scale, Wind, ThermometerSnowflake, Zap } from 'lucide-react';
import { Experiment } from '../types/experiments';

export const experiments: Experiment[] = [
  {
    id: 'fluid-properties',
    title: 'Fluid Properties',
    description: 'Study fundamental properties of fluids including density, viscosity, and vapor pressure.',
    icon: Droplets,
    subTopics: [
      {
        id: 'mass-density',
        title: 'Mass Density',
        description: 'Understand the relationship between temperature and density of fluids.'
      },
      {
        id: 'viscosity',
        title: 'Viscosity',
        description: 'Explore dynamic and kinematic viscosity through interactive simulations.'
      },
      {
        id: 'vapor-pressure',
        title: 'Vapor Pressure',
        description: 'Investigate how pressure changes with temperature in fluids.'
      }
    ]
  },
  {
    id: 'pressure-measurement',
    title: 'Pressure Measurement',
    description: 'Learn about pressure measurement techniques and applications.',
    icon: Gauge
  },
  {
    id: 'hydrostatic-pressure',
    title: 'Hydrostatic Pressure and Force',
    description: 'Study pressure variation with depth and resulting forces.',
    icon: Gauge
  },
  {
    id: 'buoyancy',
    title: 'Buoyancy and Buoyant Force',
    description: 'Understand buoyant force and its effects on submerged objects.',
    icon: Scale
  },
  {
    id: 'reynolds',
    title: 'Reynolds Number',
    description: 'Study flow regimes and transition points in fluid flow.',
    icon: Wind
  },
  {
    id: 'bernoulli',
    title: "Bernoulli's Theorem",
    description: 'Explore the relationship between pressure and velocity in fluid flow.',
    icon: Wind
  },
  {
    id: 'energy-equation',
    title: 'Energy Equation',
    description: 'Study relationships between pressure head, velocity head, and elevation head in flowing fluids.',
    icon: Zap
  },
  {
    id: 'minor-head-loss',
    title: 'Minor Head Loss',
    description: 'Analyze energy losses in pipe fittings and valves.',
    icon: ThermometerSnowflake
  },
  {
    id: 'major-head-loss',
    title: 'Major Head Loss',
    description: 'Study friction losses in straight pipes and channels.',
    icon: ThermometerSnowflake
  }
];