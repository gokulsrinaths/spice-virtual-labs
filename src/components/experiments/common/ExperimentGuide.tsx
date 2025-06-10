import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  warningPoints?: string[];
  tips?: string[];
  expectedResults?: string[];
  troubleshooting?: {
    problem: string;
    solution: string;
  }[];
}

interface ExperimentGuideProps {
  steps: Step[];
  onStepComplete?: (stepId: string) => void;
  onExperimentComplete?: () => void;
}

export function ExperimentGuide({
  steps,
  onStepComplete,
  onExperimentComplete,
}: ExperimentGuideProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onExperimentComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleStepComplete = () => {
    const stepId = currentStep.id;
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
      onStepComplete?.(stepId);
    }
  };

  const toggleVideo = () => {
    setIsPlaying(!isPlaying);
    // Implement video playback control
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Experiment Progress
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {currentStep.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {currentStep.description}
          </p>

          {/* Video Demonstration */}
          {currentStep.videoUrl && (
            <div className="mb-6">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  src={currentStep.videoUrl}
                  className="w-full h-full object-cover"
                  controls={false}
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                  <button
                    onClick={() => {
                      /* Implement restart */
                    }}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={toggleVideo}
                    className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Warning Points */}
          {currentStep.warningPoints && currentStep.warningPoints.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Important Points
              </h4>
              <ul className="space-y-2">
                {currentStep.warningPoints.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start text-yellow-700 dark:text-yellow-500"
                  >
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips */}
          {currentStep.tips && currentStep.tips.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Helpful Tips
              </h4>
              <ul className="space-y-2">
                {currentStep.tips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start text-gray-600 dark:text-gray-300"
                  >
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-green-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Expected Results */}
          {currentStep.expectedResults && currentStep.expectedResults.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Expected Results
              </h4>
              <ul className="space-y-2">
                {currentStep.expectedResults.map((result, index) => (
                  <li
                    key={index}
                    className="flex items-start text-gray-600 dark:text-gray-300"
                  >
                    <span className="mr-2">•</span>
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Troubleshooting */}
          {currentStep.troubleshooting && currentStep.troubleshooting.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setShowTroubleshooting(!showTroubleshooting)}
                className="text-lg font-medium text-blue-500 hover:text-blue-600 transition-colors flex items-center"
              >
                <span>Troubleshooting Guide</span>
                <ChevronRight
                  className={`w-5 h-5 ml-1 transform transition-transform ${
                    showTroubleshooting ? 'rotate-90' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {showTroubleshooting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4"
                  >
                    {currentStep.troubleshooting.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                      >
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                          Problem: {item.problem}
                        </h5>
                        <p className="text-gray-600 dark:text-gray-300">
                          Solution: {item.solution}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
          className={`flex items-center px-4 py-2 rounded-lg ${
            currentStepIndex === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </button>
        <button
          onClick={handleStepComplete}
          className={`px-4 py-2 rounded-lg ${
            completedSteps.includes(currentStep.id)
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {completedSteps.includes(currentStep.id) ? 'Completed' : 'Mark as Complete'}
        </button>
        <button
          onClick={handleNext}
          disabled={currentStepIndex === steps.length - 1}
          className={`flex items-center px-4 py-2 rounded-lg ${
            currentStepIndex === steps.length - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Next
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
} 