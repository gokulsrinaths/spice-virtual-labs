import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExperimentData, ExperimentStep } from '../types';
import { ChevronRight, AlertCircle, Table2, X, Beaker, Thermometer, Scale, Droplets } from 'lucide-react';
import { DryingAnimation } from './DryingAnimation';
import { CoolingAnimation } from './CoolingAnimation';
import { WeighingAnimation } from './WeighingAnimation';
import { WaterFillAnimation } from './WaterFillAnimation';
import { ApparatusStatus } from './ApparatusStatus';
import { ApparatusSlot } from './ApparatusSlot';

interface LabBenchProps {
  experimentData: ExperimentData;
  onStepComplete: (data: Partial<ExperimentData> & { nextStep?: ExperimentStep }) => void;
  onApparatusUse: (apparatusId: string) => void;
  active: boolean;
  currentStep: ExperimentStep;
  selectedApparatus: string | null;
  usedApparatus: string[];
  calculationModal?: { show: boolean };
  validations: {
    density: boolean;
    specificWeight: boolean;
    specificGravity: boolean;
  };
  calculatedValues: {
    density: number | null;
    specificWeight: number | null;
    specificGravity: number | null;
  };
}

export function LabBench({
  experimentData,
  onStepComplete,
  onApparatusUse,
  active,
  currentStep,
  selectedApparatus,
  usedApparatus,
  calculationModal,
  validations,
  calculatedValues
}: LabBenchProps) {
  const [isDrying, setIsDrying] = useState(false);
  const [isCooling, setIsCooling] = useState(false);
  const [isWeighing, setIsWeighing] = useState(false);
  const [isFillingWater, setIsFillingWater] = useState(false);
  const [isFinalWeighing, setIsFinalWeighing] = useState(false);
  const [showDataTable, setShowDataTable] = useState(false);

  // Enhanced visual feedback for drag and drop
  const [dragTarget, setDragTarget] = useState<string | null>(null);

  const handleDryingComplete = () => {
    setIsDrying(false);
    onStepComplete({ 
      dryingComplete: true,
      flaskStatus: 'hot',
      temperature: 105.0,
      nextStep: 'cooling'
    });
  };

  const handleCoolingComplete = () => {
    setIsCooling(false);
    // Calculate room temperature (between 20-25°C)
    const roomTemperature = 20 + Math.random() * 5;
    onStepComplete({ 
      coolingComplete: true, 
      flaskStatus: 'cool',
      temperature: Number(roomTemperature.toFixed(1)), // Round to 1 decimal place
      nextStep: 'weighing'
    });
  };

  const handleWeighingComplete = (mass: number) => {
    setIsWeighing(false);
    onStepComplete({
      m1: mass,
      nextStep: 'filling'
    });
  };

  const handleWaterFillComplete = () => {
    setIsFillingWater(false);
    onStepComplete({
      waterAdded: true,
      flaskStatus: 'filled',
      nextStep: 'final-weighing'
    });
  };

  const handleFinalWeighingComplete = (mass: number) => {
    setIsFinalWeighing(false);
    onStepComplete({
      m2: mass,
      nextStep: 'final-weighing'
    });
  };

  const handleDragEnter = (location: string) => {
    setDragTarget(location);
  };

  const handleDragLeave = () => {
    setDragTarget(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, location: string) => {
    e.preventDefault();
    setDragTarget(null);
    const apparatus = e.dataTransfer.getData('apparatus');
    if (!apparatus) return;

    // Update location and flask selection
    const updates: Partial<ExperimentData> & { nextStep?: ExperimentStep } = {
      location: location as 'drying-oven' | 'cooling-area' | 'weighing-scale' | 'water-tap',
      selectedFlask: apparatus as 'volumetric-flask' | 'erlenmeyer-flask'
    };

    // Start the appropriate animation based on the location and current state
    switch (location) {
      case 'drying-oven':
        if (currentStep === 'drying' && !experimentData.dryingComplete) {
          setIsDrying(true);
        }
        break;
      case 'cooling-area':
        if (experimentData.flaskStatus === 'hot' && currentStep === 'cooling') {
          setIsCooling(true);
        }
        break;
      case 'weighing-scale':
        if (experimentData.flaskStatus === 'cool' && !experimentData.m1 && currentStep === 'weighing') {
          setIsWeighing(true);
        } else if (experimentData.flaskStatus === 'filled' && !experimentData.m2 && currentStep === 'final-weighing') {
          setIsFinalWeighing(true);
        }
        break;
      case 'water-tap':
        if (experimentData.m1 !== undefined && !experimentData.waterAdded && currentStep === 'filling') {
          setIsFillingWater(true);
        }
        break;
    }

    // If this is the first time using this apparatus
    if (!experimentData.location) {
      onApparatusUse(apparatus);
    }

    onStepComplete(updates);
  };

  return (
    <div className="relative">
      {/* Main Content Container - Add blur when popup is active */}
      <div 
        className={`relative space-y-8 transition-all duration-200 ${
          isDrying || isCooling || isWeighing || isFillingWater || isFinalWeighing || calculationModal?.show
            ? 'blur-sm pointer-events-none' 
            : ''
        }`} 
        style={{ 
          zIndex: calculationModal?.show ? 0 : 'auto',
          position: calculationModal?.show ? 'relative' : 'static'
        }}
      >
        {/* Step Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {['drying', 'cooling', 'weighing', 'filling', 'final-weighing'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  getStepNumber(currentStep) > index + 1
                    ? 'bg-green-100 text-green-700 border-2 border-green-500'
                    : getStepNumber(currentStep) === index + 1
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-500 ring-4 ring-blue-50'
                    : 'bg-slate-100 text-slate-400 border-2 border-slate-300'
                }`}>
                  {index + 1}
                </div>
                {index < 4 && (
                  <div className={`w-24 h-0.5 mx-2 ${
                    getStepNumber(currentStep) > index + 1
                      ? 'bg-green-500'
                      : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              {currentStep === 'drying' && <Beaker className="h-6 w-6 text-blue-500" />}
              {currentStep === 'cooling' && <Thermometer className="h-6 w-6 text-blue-500" />}
              {(currentStep === 'weighing' || currentStep === 'final-weighing') && <Scale className="h-6 w-6 text-blue-500" />}
              {currentStep === 'filling' && <Droplets className="h-6 w-6 text-blue-500" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{getStepTitle(currentStep)}</h3>
              <p className="text-slate-600">{getStepDescription(currentStep)}</p>
            </div>
          </div>
        </div>

        {/* Laboratory Workspace */}
        <div className="grid grid-cols-2 gap-8">
          {/* Equipment Zone */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Beaker className="h-5 w-5 text-blue-500" />
                Equipment Zone
              </h3>
              <div className="grid grid-cols-2 gap-4">
        <ApparatusSlot
          id="drying-oven"
          name="Drying Oven"
                  icon={<Thermometer className="h-6 w-6" />}
                  isActive={currentStep === 'drying' && !experimentData.dryingComplete}
                  isOccupied={experimentData.location === 'drying-oven'}
                  currentApparatus={experimentData.location === 'drying-oven' ? experimentData.selectedFlask : undefined}
          onDrop={(e) => handleDrop(e, 'drying-oven')}
                  onDragEnter={() => handleDragEnter('drying-oven')}
                  onDragLeave={handleDragLeave}
                  isTargeted={dragTarget === 'drying-oven'}
                  temperature={experimentData.temperature}
                  showDropMessage={currentStep === 'drying' && !experimentData.dryingComplete}
                />
        <ApparatusSlot
          id="cooling-area"
          name="Cooling Area"
                  icon={<Thermometer className="h-6 w-6" />}
                  isActive={currentStep === 'cooling' && !experimentData.coolingComplete}
                  isOccupied={experimentData.location === 'cooling-area'}
                  currentApparatus={experimentData.location === 'cooling-area' ? experimentData.selectedFlask : undefined}
          onDrop={(e) => handleDrop(e, 'cooling-area')}
                  onDragEnter={() => handleDragEnter('cooling-area')}
                  onDragLeave={handleDragLeave}
                  isTargeted={dragTarget === 'cooling-area'}
                  temperature={experimentData.temperature}
                  showDropMessage={currentStep === 'cooling' && !experimentData.coolingComplete}
                />
              </div>
            </div>

            {/* Status Panel */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h4 className="text-sm font-medium text-slate-600 mb-3">Current Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Temperature:</span>
                  <span className="text-sm font-medium text-slate-700">
                    {experimentData.temperature ? `${experimentData.temperature.toFixed(1)}°C` : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Flask Status:</span>
                  <span className="text-sm font-medium text-slate-700">
                    {experimentData.flaskStatus ? experimentData.flaskStatus.charAt(0).toUpperCase() + experimentData.flaskStatus.slice(1) : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Location:</span>
                  <span className="text-sm font-medium text-slate-700">
                    {experimentData.location ? experimentData.location.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Measurement Zone */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-500" />
                Measurement Zone
              </h3>
              <div className="grid grid-cols-2 gap-4">
        <ApparatusSlot
          id="weighing-scale"
          name="Weighing Scale"
                  icon={<Scale className="h-6 w-6" />}
                  isActive={currentStep === 'weighing' || currentStep === 'final-weighing'}
                  isOccupied={experimentData.location === 'weighing-scale'}
                  currentApparatus={experimentData.location === 'weighing-scale' ? experimentData.selectedFlask : undefined}
          onDrop={(e) => handleDrop(e, 'weighing-scale')}
                  onDragEnter={() => handleDragEnter('weighing-scale')}
                  onDragLeave={handleDragLeave}
                  isTargeted={dragTarget === 'weighing-scale'}
                  showDropMessage={currentStep === 'weighing' || currentStep === 'final-weighing'}
        />
        <ApparatusSlot
          id="water-tap"
          name="Water Tap"
                  icon={<Droplets className="h-6 w-6" />}
                  isActive={currentStep === 'filling' && !experimentData.waterAdded}
                  isOccupied={experimentData.location === 'water-tap'}
                  currentApparatus={experimentData.location === 'water-tap' ? experimentData.selectedFlask : undefined}
          onDrop={(e) => handleDrop(e, 'water-tap')}
                  onDragEnter={() => handleDragEnter('water-tap')}
                  onDragLeave={handleDragLeave}
                  isTargeted={dragTarget === 'water-tap'}
                  showDropMessage={currentStep === 'filling' && !experimentData.waterAdded}
                />
              </div>
            </div>

            {/* Measurements Panel */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h4 className="text-sm font-medium text-slate-600 mb-3">Measurements</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Empty Mass (M₁):</span>
                  <span className="text-sm font-medium text-slate-700">
                    {experimentData.m1 ? `${experimentData.m1.toFixed(3)} g` : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Filled Mass (M₂):</span>
                  <span className="text-sm font-medium text-slate-700">
                    {experimentData.m2 ? `${experimentData.m2.toFixed(3)} g` : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Volume:</span>
                  <span className="text-sm font-medium text-slate-700">
                    {experimentData.selectedFlask ? (experimentData.selectedFlask === 'volumetric-flask' ? '100.000 mL' : '150.000 mL') : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Table - Show when all calculations are complete */}
        {experimentData.m2 && experimentData.m1 && validations.density && validations.specificWeight && validations.specificGravity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Experiment Results</h3>
              <button
                onClick={() => {
                  // Reset experiment data
                  onStepComplete({
                    selectedFlask: 'volumetric-flask',
                    m1: undefined,
                    m2: undefined,
                    temperature: undefined,
                    density: undefined,
                    currentStep: 'drying',
                    dryingComplete: false,
                    coolingComplete: false,
                    waterAdded: false,
                    calculationComplete: false,
                    location: null,
                    flaskStatus: null
                  });
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <span>New Experiment</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 text-sm font-medium text-gray-500">Flask Type</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-500">Temperature</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-500">Empty Mass (M₁)</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-500">Filled Mass (M₂)</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-500">Volume</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-500">Mass Density (ρ)</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-500">Specific Weight (γ)</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-500">Specific Gravity (SG)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">{experimentData.selectedFlask === 'volumetric-flask' ? 'Volumetric Flask' : 'Erlenmeyer Flask'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{experimentData.temperature?.toFixed(1)} °C</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{experimentData.m1?.toFixed(3)} g</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{experimentData.m2?.toFixed(3)} g</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{experimentData.selectedFlask === 'volumetric-flask' ? '100.000' : '150.000'} mL</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{calculatedValues.density?.toFixed(4)} g/mL</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{calculatedValues.specificWeight?.toFixed(2)} kN/m³</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{calculatedValues.specificGravity?.toFixed(3)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Calculations Section */}
      <AnimatePresence>
        {calculationModal?.show && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Mass Density Calculations</h3>
              <button
                onClick={() => onStepComplete({ calculationComplete: true })}
                className="text-slate-400 hover:text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mass Density Calculation */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Mass Density (ρ)</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Formula:</span>
                  <span className="font-mono">ρ = (M₂ - M₁)/V</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-2 rounded-lg">
                    <div className="text-slate-500">M₁</div>
                    <div className="font-medium">{experimentData.m1?.toFixed(3)} g</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <div className="text-slate-500">M₂</div>
                    <div className="font-medium">{experimentData.m2?.toFixed(3)} g</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <div className="text-slate-500">V</div>
                    <div className="font-medium">
                      {experimentData.selectedFlask === 'volumetric-flask' ? '100.000' : '150.000'} mL
                    </div>
                  </div>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <div className="text-blue-800 font-medium">
                    ρ = {((experimentData.m2! - experimentData.m1!) / 
                      (experimentData.selectedFlask === 'volumetric-flask' ? 100 : 150)).toFixed(4)} g/mL
                  </div>
                </div>
              </div>
            </div>

            {/* Specific Weight Calculation */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Specific Weight (γ)</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Formula:</span>
                  <span className="font-mono">γ = ρg = ρ × 9.81</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-2 rounded-lg">
                    <div className="text-slate-500">ρ</div>
                    <div className="font-medium">
                      {((experimentData.m2! - experimentData.m1!) / 
                        (experimentData.selectedFlask === 'volumetric-flask' ? 100 : 150)).toFixed(4)} g/mL
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <div className="text-slate-500">g</div>
                    <div className="font-medium">9.81 m/s²</div>
                  </div>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <div className="text-blue-800 font-medium">
                    γ = {(((experimentData.m2! - experimentData.m1!) / 
                      (experimentData.selectedFlask === 'volumetric-flask' ? 100 : 150)) * 9.81).toFixed(2)} kN/m³
                  </div>
                </div>
              </div>
            </div>

            {/* Specific Gravity Calculation */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Specific Gravity (SG)</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Formula:</span>
                  <span className="font-mono">SG = ρ/ρwater,4°C = ρ/0.9982</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-2 rounded-lg">
                    <div className="text-slate-500">ρ</div>
                    <div className="font-medium">
                      {((experimentData.m2! - experimentData.m1!) / 
                        (experimentData.selectedFlask === 'volumetric-flask' ? 100 : 150)).toFixed(4)} g/mL
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <div className="text-slate-500">ρwater,4°C</div>
                    <div className="font-medium">0.9982 g/mL</div>
                  </div>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <div className="text-blue-800 font-medium">
                    SG = {(((experimentData.m2! - experimentData.m1!) / 
                      (experimentData.selectedFlask === 'volumetric-flask' ? 100 : 150)) / 0.9982).toFixed(3)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation Overlays */}
      <AnimatePresence>
        {isDrying && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: calculationModal?.show ? 0 : 40 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-0 bg-slate-900/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div 
              className="relative w-full max-w-2xl mx-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <DryingAnimation 
                onComplete={handleDryingComplete}
                selectedFlask={experimentData.selectedFlask}
              />
            </motion.div>
          </motion.div>
        )}
        {isCooling && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: calculationModal?.show ? 0 : 40 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-0 bg-slate-900/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div 
              className="relative w-full max-w-2xl mx-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
          <CoolingAnimation 
            onComplete={handleCoolingComplete}
                selectedFlask={experimentData.selectedFlask || 'volumetric-flask'}
          />
            </motion.div>
          </motion.div>
        )}
        {isWeighing && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: calculationModal?.show ? 0 : 40 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-0 bg-slate-900/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div 
              className="relative w-full max-w-2xl mx-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
          <WeighingAnimation 
            onComplete={handleWeighingComplete} 
            selectedFlask={experimentData.selectedFlask}
                isFinal={false}
          />
            </motion.div>
          </motion.div>
        )}
        {isFillingWater && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: calculationModal?.show ? 0 : 40 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-0 bg-slate-900/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div 
              className="relative w-full max-w-2xl mx-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
          <WaterFillAnimation 
            onComplete={handleWaterFillComplete}
            selectedFlask={experimentData.selectedFlask}
          />
            </motion.div>
          </motion.div>
        )}
        {isFinalWeighing && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: calculationModal?.show ? 0 : 40 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-0 bg-slate-900/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div 
              className="relative w-full max-w-2xl mx-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
          <WeighingAnimation 
            onComplete={handleFinalWeighingComplete} 
            selectedFlask={experimentData.selectedFlask}
                isFinal={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getStepNumber(step: ExperimentStep): number {
  switch (step) {
    case 'drying': return 1;
    case 'cooling': return 2;
    case 'weighing': return 3;
    case 'filling': return 4;
    case 'final-weighing': return 5;
  }
}

function getStepTitle(step: ExperimentStep): string {
  switch (step) {
    case 'drying': return "Apparatus Selection";
    case 'cooling': return "Temperature Equilibration";
    case 'weighing': return "Initial Mass Measurement";
    case 'filling': return "Sample Introduction";
    case 'final-weighing': return "Final Mass Determination";
  }
}

function getStepDescription(step: ExperimentStep): string {
  switch (step) {
    case 'drying': return "Select appropriate volumetric apparatus and initiate thermal conditioning";
    case 'cooling': return "Allow apparatus to reach thermal equilibrium in controlled environment";
    case 'weighing': return "Obtain precise mass measurement of empty apparatus";
    case 'filling': return "Introduce sample medium following standard protocols";
    case 'final-weighing': return "Perform final mass determination of apparatus with sample";
  }
}