import React, { useState, useRef } from 'react';
import { CheckCircle2, Circle, ChevronUp, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExperimentStepsProps {
  currentStep: number;
  experimentData: any;
  onStepComplete: (data: any) => void;
}

export function ExperimentSteps({ currentStep, experimentData, onStepComplete }: ExperimentStepsProps) {
  const [temperature, setTemperature] = useState<number | ''>('');
  const [time, setTime] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleTemperatureSubmit = () => {
    if (temperature !== 105) {
      setError('Temperature must be set to 105°C');
      return;
    }
    if (time !== 2) {
      setError('Time must be set to 2 hours');
      return;
    }
    setError(null);
    onStepComplete({ ovenTemperature: temperature, ovenTime: time });
  };

  const scrollUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: -100, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: 100, behavior: 'smooth' });
    }
  };

  const steps = [
    {
      title: 'Set Oven Temperature',
      description: 'Set the drying oven to 105°C for 2 hours',
      isComplete: experimentData.ovenTemperature === 105 && experimentData.ovenTime === 2,
      inputs: currentStep === 1 && (
        <div className="mt-4 space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="105"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Time (hours)</label>
              <input
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="2"
              />
            </div>
            <button
              onClick={handleTemperatureSubmit}
              className="px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors h-[38px]"
            >
              Set
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      )
    },
    {
      title: 'Cool Flask',
      description: 'Cool the flask to ambient temperature',
      isComplete: experimentData.coolingComplete
    },
    {
      title: 'Weigh Empty Flask',
      description: 'Measure mass of empty flask (m₁)',
      isComplete: experimentData.m1 !== undefined,
      result: experimentData.m1 ? `m₁ = ${experimentData.m1.toFixed(2)} g` : undefined
    },
    {
      title: 'Add Water',
      description: 'Fill flask with water to 100 mL mark',
      isComplete: experimentData.waterAdded
    },
    {
      title: 'Final Weight',
      description: 'Weigh flask with water (m₂)',
      isComplete: experimentData.m2 !== undefined,
      result: experimentData.m2 ? `m₂ = ${experimentData.m2.toFixed(2)} g` : undefined
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[400px] flex flex-col">
      <h2 className="text-lg font-semibold mb-2">Experiment Steps</h2>
      
      <div className="relative flex-1 min-h-0">
        <button
          onClick={scrollUp}
          className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 p-1 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
        >
          <ChevronUp className="h-5 w-5 text-gray-500" />
        </button>

        <div 
          ref={scrollContainerRef}
          className="absolute inset-0 space-y-3 overflow-y-auto scrollbar-none py-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                flex items-start gap-3 p-3 rounded-lg transition-colors mx-2
                ${currentStep === index + 1 ? 'bg-blue-50 border border-blue-100' : ''}
              `}
            >
              {step.isComplete ? (
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className={`h-6 w-6 flex-shrink-0 ${
                  currentStep === index + 1 ? 'text-blue-500' : 'text-gray-300'
                }`} />
              )}
              
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium ${
                  currentStep === index + 1 ? 'text-blue-700' : 
                  step.isComplete ? 'text-gray-700' : 'text-gray-500'
                }`}>
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {step.description}
                </p>
                
                {step.result && (
                  <div className="mt-2 p-2 bg-green-50 rounded-md">
                    <p className="text-sm text-green-700">{step.result}</p>
                  </div>
                )}

                {step.inputs}
              </div>
            </motion.div>
          ))}

          {/* Show Summary Button after all steps are complete */}
          {steps.every(step => step.isComplete) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 mx-2"
            >
              <button
                onClick={() => onStepComplete({ nextStep: 6 })}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                View Experiment Summary
              </button>
            </motion.div>
          )}
        </div>

        <button
          onClick={scrollDown}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 p-1 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
        >
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
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
    </div>
  );
}