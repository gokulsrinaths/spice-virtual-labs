import React from 'react';
import { ExperimentData } from './MassDensityExperiment';
import { CheckCircle2, Circle } from 'lucide-react';

interface StepsPanelProps {
  currentStep: number;
  experimentData: ExperimentData;
}

const steps = [
  {
    title: 'Step 1',
    description: 'Dry the 100-mL volumetric flask in the drying oven at 105°C for 2 hours',
    apparatus: 'drying-oven'
  },
  {
    title: 'Step 2',
    description: 'Cool the volumetric flask to ambient temperature and weigh it (m₁)',
    apparatus: 'balance'
  },
  {
    title: 'Step 3',
    description: 'Add water to the flask until the meniscus reaches the 100 mL mark',
    apparatus: 'water-pipe'
  },
  {
    title: 'Step 4',
    description: 'Measure the temperature of the water using the thermometer',
    apparatus: 'thermometer'
  },
  {
    title: 'Step 5',
    description: 'Weigh the flask with water (m₂)',
    apparatus: 'balance'
  }
];

export function StepsPanel({ currentStep, experimentData }: StepsPanelProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-semibold mb-4">Experiment Steps</h3>
      
      <div className="relative">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${(currentStep - 1) * 100}%)` }}
        >
          {steps.map((step, index) => (
            <div 
              key={index}
              className="w-full flex-shrink-0 px-4"
            >
              <div className={`flex items-start space-x-3 ${
                currentStep === index + 1 ? 'text-blue-600' : 
                currentStep > index + 1 ? 'text-green-600' : 'text-gray-500'
              }`}>
                {currentStep > index + 1 ? (
                  <CheckCircle2 className="h-6 w-6 flex-shrink-0" />
                ) : (
                  <Circle className="h-6 w-6 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-medium text-xl mb-2">{step.title}</h4>
                  <p className="text-base">{step.description}</p>
                  <p className="text-sm mt-2 opacity-75">
                    Required apparatus: {step.apparatus.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <div className="text-sm text-gray-500">
          Step {currentStep} of {steps.length}
        </div>
        <div className="flex space-x-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentStep === index + 1 ? 'bg-blue-600' :
                currentStep > index + 1 ? 'bg-green-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}