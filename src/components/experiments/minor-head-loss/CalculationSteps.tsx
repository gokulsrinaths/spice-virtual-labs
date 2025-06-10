import React from 'react';
import { CalculationStep } from './types';

interface CalculationStepsProps {
  steps: CalculationStep[];
  title: string;
}

export const CalculationSteps: React.FC<CalculationStepsProps> = ({
  steps,
  title
}) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span>🧠</span>
        <span>{title}</span>
      </h3>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col gap-1"
          >
            <div className="text-sm text-gray-300">
              {step.label}
            </div>
            
            <div className="font-mono bg-gray-900 p-3 rounded-lg flex items-center justify-between">
              <div className="text-blue-400">
                {step.equation}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">
                  = {step.value.toFixed(typeof step.value === 'number' && step.value < 0.01 ? 4 : 2)} {step.unit}
                </span>
                {step.isCorrect !== undefined && (
                  <span className={step.isCorrect ? "text-green-500" : "text-red-500"}>
                    {step.isCorrect ? "✓" : "✗"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 