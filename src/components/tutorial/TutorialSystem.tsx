import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'right' | 'bottom' | 'left';
}

interface TutorialProps {
  steps: TutorialStep[];
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialSystem({ steps, isOpen, onClose }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (isOpen && steps[currentStep]) {
      const element = document.querySelector(steps[currentStep].target);
      if (element) {
        setTargetElement(element.getBoundingClientRect());
      }
    }
  }, [currentStep, isOpen, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Highlight area */}
      {targetElement && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-10 transition-all duration-300"
          style={{
            top: targetElement.top - 4,
            left: targetElement.left - 4,
            width: targetElement.width + 8,
            height: targetElement.height + 8,
            borderRadius: '8px',
          }}
        />
      )}

      {/* Tutorial popup */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bg-white rounded-lg shadow-xl p-6 max-w-md"
          style={{
            top: targetElement ? targetElement.bottom + 20 : '50%',
            left: targetElement ? targetElement.left : '50%',
            transform: targetElement ? 'translateX(0)' : 'translate(-50%, -50%)',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h3>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center ${
                currentStep === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 