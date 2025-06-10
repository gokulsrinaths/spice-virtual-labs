import { ExperimentStep } from '../types';

export const experimentSteps: ExperimentStep[] = [
  {
    id: 1,
    title: 'Select Flask Type',
    description: 'Choose between 100-mL volumetric flask or 250-mL Erlenmeyer flask for the experiment.',
    requiredApparatus: ['volumetric-flask', 'erlenmeyer-flask'],
    validation: (data) => data.selectedFlask !== undefined
  },
  {
    id: 2,
    title: 'Prepare Flask',
    description: 'Place the selected flask in the drying oven at 105°C for 2 hours to remove moisture.',
    requiredApparatus: ['drying-oven'],
    safetyWarnings: [
      'Use heat-resistant gloves when handling hot glassware',
      'Ensure proper ventilation'
    ]
  },
  {
    id: 3,
    title: 'Weigh Empty Flask',
    description: 'Cool the flask to ambient temperature and weigh it to obtain m₁.',
    requiredApparatus: ['balance'],
    validation: (data) => data.m1 !== undefined && data.m1 > 0
  },
  {
    id: 4,
    title: 'Add Liquid',
    description: 'Fill the flask with the liquid sample (100 mL for volumetric flask, 150 mL for Erlenmeyer flask).',
    requiredApparatus: ['volumetric-flask', 'erlenmeyer-flask'],
    safetyWarnings: [
      'Handle chemicals with care',
      'Use proper filling technique'
    ]
  },
  {
    id: 5,
    title: 'Measure Temperature',
    description: 'Record the temperature of the liquid using the thermometer.',
    requiredApparatus: ['thermometer'],
    validation: (data) => data.temperature !== undefined
  },
  {
    id: 6,
    title: 'Final Weight',
    description: 'Weigh the flask with the liquid to obtain m₂.',
    requiredApparatus: ['balance'],
    validation: (data) => data.m2 !== undefined && data.m2 > data.m1!
  },
  {
    id: 7,
    title: 'Heat Sample',
    description: 'Heat the liquid to approximately 10°C above the initial temperature.',
    requiredApparatus: ['drying-oven', 'thermometer'],
    validation: (data) => data.heatedTemperature !== undefined && data.heatedTemperature >= data.temperature! + 10,
    safetyWarnings: [
      'Use heat-resistant gloves',
      'Handle hot liquids with extreme care',
      'Ensure proper ventilation'
    ]
  },
  {
    id: 8,
    title: 'Repeat Measurements',
    description: 'Repeat steps 3-6 with the heated liquid to obtain new mass and temperature readings.',
    requiredApparatus: ['balance', 'thermometer'],
    validation: (data) => data.heatedM2 !== undefined && data.heatedTemperature !== undefined
  }
];