import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeighingAnimation } from './WeighingAnimation';
import { WaterAdditionStep } from './WaterAdditionStep';
import { DensityCalculation } from './DensityCalculation';
import { Info, Thermometer, Ruler, Scale, Droplet, Calculator } from 'lucide-react';
import '../MassDensityExperiment.css';
import { ExperimentStep } from '../types';

// Import WeighingAnimation and WaterAdditionStep prop types
interface WeighingAnimationProps {
  selectedFlask: string;
  isInitial?: boolean;
  temperature: number;
  onComplete: (mass: number) => void;
}

interface WaterAdditionStepProps {
  selectedFlask: string;
  volume: number;
  onComplete: () => void;
}

export interface ExperimentWorkbenchProps {
  apparatus: Record<string, any>;
  temperature: number;
  onExperimentComplete: (density: number) => void;
  currentStep: ExperimentStep;
  onStepComplete: (data: any) => void;
}

export function ExperimentWorkbench({
  apparatus,
  temperature,
  onExperimentComplete,
  currentStep,
  onStepComplete
}: ExperimentWorkbenchProps) {
  // Determine which flask is selected
  const selectedApparatus = React.useMemo(() => {
    if (apparatus['volumetric-flask']?.inUse) {
      return 'volumetric-flask';
    } else if (apparatus['erlenmeyer-flask']?.inUse) {
      return 'erlenmeyer-flask';
    }
    return null;
  }, [apparatus]);
  
  // Experiment data derived from apparatus
  const experimentData = React.useMemo(() => {
    // Default values
    const data = {
      location: selectedApparatus,
      temperature: temperature,
      capacity: 100,
      material: 'Borosilicate Glass',
      precision: 'Class A',
      m1: apparatus[selectedApparatus as string]?.m1,
      m2: apparatus[selectedApparatus as string]?.m2,
    };
    
    // Update with flask specific data if available
    if (selectedApparatus && apparatus[selectedApparatus]) {
      data.capacity = apparatus[selectedApparatus].capacity || data.capacity;
      data.material = apparatus[selectedApparatus].material || data.material;
      data.precision = apparatus[selectedApparatus].precision || data.precision;
    }
    
    return data;
  }, [apparatus, selectedApparatus, temperature]);

  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [showDroppableHint, setShowDroppableHint] = useState(false);
  const [laboratorySafety, setLaboratorySafety] = useState({ visible: false, content: '' });

  // Check if a specific step is active
  const isStepActive = (step: ExperimentStep): boolean => {
    return currentStep === step;
  };

  // Handler functions for different experiment steps
  const handleDryingComplete = () => {
    onStepComplete({
      dryingComplete: true,
      flaskStatus: 'hot',
      nextStep: 'cooling'
    });
  };

  const handleCoolingComplete = () => {
    onStepComplete({
      coolingComplete: true,
      flaskStatus: 'cool',
      nextStep: 'weighing'
    });
  };

  const handleWeighingComplete = (mass: number) => {
    onStepComplete({
      m1: mass,
      nextStep: 'filling'
    });
  };

  const handleWaterFillComplete = () => {
    onStepComplete({
      waterAdded: true,
      flaskStatus: 'filled',
      nextStep: 'final-weighing'
    });
  };

  const handleFinalWeighingComplete = (mass: number) => {
    onStepComplete({
      m2: mass,
      calculationComplete: true
    });
  };

  // Drag and drop handlers
  const handleDragEnter = (location: string) => {
    setDragTarget(location);
    setShowDroppableHint(true);
  };

  const handleDragLeave = () => {
    setDragTarget(null);
    setShowDroppableHint(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, location: string) => {
    e.preventDefault();
    const apparatus = e.dataTransfer.getData('apparatus');
    if (apparatus) {
      setDragTarget(null);
      setShowDroppableHint(false);
      
      onStepComplete({
        selectedFlask: apparatus as 'volumetric-flask' | 'erlenmeyer-flask',
        location: location as 'drying-oven' | 'cooling-area' | 'weighing-scale' | 'water-tap'
      });
      
      onStepComplete({
        selectedFlask: apparatus as 'volumetric-flask' | 'erlenmeyer-flask',
        location: location as 'drying-oven' | 'cooling-area' | 'weighing-scale' | 'water-tap'
      });
    }
  };

  // Show safety information based on current step
  const showSafetyInfo = (content: string) => {
    setLaboratorySafety({ visible: true, content });
    setTimeout(() => setLaboratorySafety({ visible: false, content: '' }), 5000);
  };

  // Generate step-specific safety tips
  const getSafetyTip = (step: ExperimentStep): string => {
    switch(step) {
      case 'drying':
        return "Always use heat-resistant gloves when handling hot glassware.";
      case 'cooling':
        return "Allow glassware to cool naturally. Don't use cold water to speed up cooling.";
      case 'weighing':
        return "Ensure the balance is properly calibrated for accurate measurements.";
      case 'filling':
        return "When filling, keep the flask at eye level to accurately read the meniscus.";
      case 'final-weighing':
        return "Handle filled flasks carefully to avoid spills and measurement errors.";
      default:
        return "Follow laboratory safety protocols at all times.";
    }
  };

  return (
    <div className="relative">
      {/* Laboratory background with subtle grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-gray-100 animated-bg-grid -z-10"></div>
      
      {/* Main workbench area */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 rounded-xl shadow-md bg-white/80 backdrop-blur-sm border border-gray-200 glass-effect"
      >
        {/* Experiment progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Mass Density Experiment</h3>
            <span className="text-sm text-gray-500">Temperature: {temperature}°C</span>
          </div>
          
          <div className="relative">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                initial={{ width: '0%' }}
                animate={{ 
                  width: currentStep === 'drying' ? '10%' : 
                         currentStep === 'cooling' ? '30%' : 
                         currentStep === 'weighing' ? '50%' : 
                         currentStep === 'filling' ? '80%' : 
                         '100%' 
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <div className={`flex flex-col items-center ${currentStep === 'drying' ? 'text-blue-500 font-medium' : ''}`}>
                <Scale size={16} className={currentStep === 'drying' ? 'text-blue-500' : 'text-gray-400'} />
                <span>Setup</span>
              </div>
              <div className={`flex flex-col items-center ${currentStep === 'cooling' ? 'text-blue-500 font-medium' : ''}`}>
                <Scale size={16} className={currentStep === 'cooling' ? 'text-blue-500' : 'text-gray-400'} />
                <span>Initial Mass</span>
              </div>
              <div className={`flex flex-col items-center ${currentStep === 'weighing' ? 'text-blue-500 font-medium' : ''}`}>
                <Droplet size={16} className={currentStep === 'weighing' ? 'text-blue-500' : 'text-gray-400'} />
                <span>Add Water</span>
              </div>
              <div className={`flex flex-col items-center ${currentStep === 'filling' ? 'text-blue-500 font-medium' : ''}`}>
                <Scale size={16} className={currentStep === 'filling' ? 'text-blue-500' : 'text-gray-400'} />
                <span>Final Mass</span>
              </div>
              <div className={`flex flex-col items-center ${currentStep === 'final-weighing' ? 'text-blue-500 font-medium' : ''}`}>
                <Calculator size={16} className={currentStep === 'final-weighing' ? 'text-blue-500' : 'text-gray-400'} />
                <span>Results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Experiment stages */}
        <AnimatePresence mode="wait">
          {/* Selection stage */}
          {currentStep === 'drying' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px]"
            >
              <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="text-blue-500 h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-700 mb-1">Experiment Setup</h4>
                    <p className="text-sm text-blue-600">
                      Select a flask from the apparatus list to begin the experiment. You'll measure its mass, 
                      add water, and then calculate the density.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <motion.div 
                  className={`equipment-card rounded-lg p-5 border ${experimentData.location === 'volumetric-flask' ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200 bg-gray-50/50'}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !selectedApparatus && onStepComplete({ nextStep: 'cooling' })}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-sm">
                      <img 
                        src="/images/volumetric-flask.png" 
                        alt="Volumetric Flask" 
                        className="w-12 h-12 object-contain floating-animation"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Volumetric Flask</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {experimentData.location === 'volumetric-flask' 
                          ? 'Selected for experiment' 
                          : 'Click to use volumetric flask'}
                      </p>
                    </div>
                  </div>
                  
                  {experimentData.location === 'volumetric-flask' && (
                    <motion.div 
                      className="mt-4 p-3 bg-white rounded-md border border-gray-100 shadow-sm"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Volume:</span>
                          <span className="ml-2 font-medium text-gray-700">
                            {experimentData.capacity} mL
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Material:</span>
                          <span className="ml-2 font-medium text-gray-700">
                            {experimentData.material}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Precision:</span>
                          <span className="ml-2 font-medium text-gray-700">
                            {experimentData.precision}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Temperature:</span>
                          <span className="ml-2 font-medium text-gray-700">
                            {temperature}°C
                          </span>
                        </div>
                      </div>
                      
                      <motion.button
                        className="mt-3 w-full py-2 bg-blue-500 text-white rounded-md text-sm font-medium"
                        whileHover={{ backgroundColor: '#3b82f6' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onStepComplete({ nextStep: 'cooling' })}
                      >
                        Continue to Weighing
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.div 
                  className={`equipment-card rounded-lg p-5 border ${experimentData.location === 'erlenmeyer-flask' ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200 bg-gray-50/50'}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !selectedApparatus && onStepComplete({ nextStep: 'cooling' })}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-sm">
                      <img 
                        src="/images/erlenmeyer-flask.png" 
                        alt="Erlenmeyer Flask" 
                        className="w-12 h-12 object-contain floating-animation"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Erlenmeyer Flask</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {experimentData.location === 'erlenmeyer-flask' 
                          ? 'Selected for experiment' 
                          : 'Click to use erlenmeyer flask'}
                      </p>
                    </div>
                  </div>
                  
                  {experimentData.location === 'erlenmeyer-flask' && (
                    <motion.div 
                      className="mt-4 p-3 bg-white rounded-md border border-gray-100 shadow-sm"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Volume:</span>
                          <span className="ml-2 font-medium text-gray-700">
                            {experimentData.capacity} mL
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Material:</span>
                          <span className="ml-2 font-medium text-gray-700">
                            {experimentData.material}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Precision:</span>
                          <span className="ml-2 font-medium text-gray-700">
                            {experimentData.precision}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Temperature:</span>
                          <span className="ml-2 font-medium text-gray-700">
                            {temperature}°C
                          </span>
                        </div>
                      </div>
                      
                      <motion.button
                        className="mt-3 w-full py-2 bg-blue-500 text-white rounded-md text-sm font-medium"
                        whileHover={{ backgroundColor: '#3b82f6' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onStepComplete({ nextStep: 'cooling' })}
                      >
                        Continue to Weighing
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                {!selectedApparatus ? (
                  <div className="animate-pulse">Select a flask to continue</div>
                ) : (
                  <div>Ready to proceed with your experiment</div>
                )}
              </div>
            </motion.div>
          )}

          {/* Initial weighing stage */}
          {currentStep === 'cooling' && (
            <motion.div
              key="initial-weighing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WeighingAnimation
                selectedFlask={selectedApparatus || ''}
                isInitial={true}
                temperature={temperature}
                onComplete={(mass) => onStepComplete({ m1: mass, nextStep: 'weighing' })}
              />
            </motion.div>
          )}

          {/* Water addition stage */}
          {currentStep === 'weighing' && (
            <motion.div
              key="water-addition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WaterAdditionStep
                selectedFlask={selectedApparatus || ''}
                volume={experimentData.capacity}
                onComplete={() => onStepComplete({ nextStep: 'filling' })}
              />
            </motion.div>
          )}

          {/* Final weighing stage */}
          {currentStep === 'filling' && (
            <motion.div
              key="final-weighing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WeighingAnimation
                selectedFlask={selectedApparatus || ''}
                isInitial={false}
                temperature={temperature}
                onComplete={(mass) => onStepComplete({ m2: mass, nextStep: 'final-weighing' })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Calculation modal */}
      <AnimatePresence>
        {currentStep === 'final-weighing' && experimentData.m1 !== undefined && experimentData.m2 !== undefined && (
          <DensityCalculation
            massFlask={experimentData.m1}
            massFlaskWater={experimentData.m2}
            volume={experimentData.capacity}
            temperature={temperature}
            selectedFlask={selectedApparatus as 'volumetric-flask' | 'erlenmeyer-flask'}
            onComplete={() => onExperimentComplete((experimentData.m2 - experimentData.m1) / experimentData.capacity)}
          />
        )}
      </AnimatePresence>
      
      {/* Lab notes */}
      <motion.div 
        className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100 shadow-sm text-sm text-yellow-800"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex gap-2 items-start">
          <Thermometer className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Laboratory Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-yellow-700">
              <li>Water density varies with temperature - expect values between 0.9970 g/mL (at 25°C) and 0.9991 g/mL (at 15°C).</li>
              <li>For accurate measurements, ensure the volumetric flask is filled precisely to the graduation mark.</li>
              <li>Bubbles in the water will affect your measurements. Gently tap the flask to remove them.</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Helper function to get step number for the progress indicator
function getStepNumber(step: ExperimentStep): number {
  const steps: ExperimentStep[] = ['drying', 'cooling', 'weighing', 'filling', 'final-weighing'];
  return steps.indexOf(step) + 1;
}

// Helper function to get step title
function getStepTitle(step: ExperimentStep): string {
  switch (step) {
    case 'drying': return 'Drying the Flask';
    case 'cooling': return 'Cooling the Flask';
    case 'weighing': return 'Initial Weighing';
    case 'filling': return 'Filling with Water';
    case 'final-weighing': return 'Final Weighing';
    default: return 'Unknown Step';
  }
}

// Helper function to get step description
function getStepDescription(step: ExperimentStep): string {
  switch (step) {
    case 'drying': return 'Remove moisture from the flask by drying in an oven';
    case 'cooling': return 'Allow the flask to cool to room temperature';
    case 'weighing': return 'Determine the mass of the empty flask';
    case 'filling': return 'Fill the flask with distilled water to the mark';
    case 'final-weighing': return 'Measure the mass of the flask with water';
    default: return '';
  }
}

// Helper function to get step-specific instructions
function getStepInstructions(step: ExperimentStep, data: ExperimentData): string {
  switch (step) {
    case 'drying':
      if (!data.selectedFlask) return 'Select a flask from the equipment list and drag it to the drying oven';
      if (data.location !== 'drying-oven') return 'Place the selected flask in the drying oven';
      return 'The flask is being dried at 105°C. Wait for the process to complete...';

    case 'cooling':
      if (data.location !== 'cooling-area') return 'Move the hot flask to the cooling area';
      return 'The flask is cooling to room temperature. Wait for the process to complete...';

    case 'weighing':
      if (data.location !== 'weighing-scale') return 'Place the cooled flask on the weighing scale';
      return 'Weighing the empty flask. Wait for the measurement to stabilize...';

    case 'filling':
      if (data.location !== 'water-tap') return 'Move the flask to the water filling station';
      if (!data.waterAdded) return 'Fill the flask with distilled water to the calibration mark';
      return 'The flask has been filled with distilled water';

    case 'final-weighing':
      if (data.location !== 'weighing-scale') return 'Place the filled flask on the weighing scale';
      return 'Weighing the flask with water. Wait for the measurement to stabilize...';

    default:
      return 'Follow the laboratory procedure to complete the experiment';
  }
} 