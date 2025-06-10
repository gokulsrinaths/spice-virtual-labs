import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExperimentData, ExperimentStep } from './types';
import { Calculator, X } from 'lucide-react';

interface DataTableProps {
  experimentData: ExperimentData;
  currentStep: ExperimentStep;
}

export function DataTable({ experimentData, currentStep }: DataTableProps) {
  const [showCalculations, setShowCalculations] = useState(false);
  const [userInputs, setUserInputs] = useState({
    density: '' as string,
    specificWeight: '' as string,
    specificGravity: '' as string
  });
  const [validations, setValidations] = useState({
    density: false,
    specificWeight: false,
    specificGravity: false
  });
  const [calculatedValues, setCalculatedValues] = useState({
    density: null as number | null,
    specificWeight: null as number | null,
    specificGravity: null as number | null
  });

  // Reset function to clear all states
  const resetStates = () => {
    setShowCalculations(false);
    setUserInputs({
      density: '',
      specificWeight: '',
      specificGravity: ''
    });
    setValidations({
      density: false,
      specificWeight: false,
      specificGravity: false
    });
    setCalculatedValues({
      density: null,
      specificWeight: null,
      specificGravity: null
    });
  };

  useEffect(() => {
    if (experimentData?.m2 != null && experimentData?.m1 != null) {
      setShowCalculations(true);
    }
  }, [experimentData?.m2, experimentData?.m1]);

  // Add useEffect for automatic scrolling
  useEffect(() => {
    if (validations.density) {
      const specificWeightElement = document.getElementById('specific-weight-calculation');
      if (specificWeightElement) {
        specificWeightElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [validations.density]);

  // Add useEffect for scrolling to mass density cell when M2 is entered
  useEffect(() => {
    if (experimentData?.m2 != null && !validations.density) {
      const densityCell = document.querySelector('[data-cell="density"]');
      if (densityCell) {
        densityCell.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }
  }, [experimentData?.m2, validations.density]);

  // Add useEffect for scrolling to specific weight cell when density is validated
  useEffect(() => {
    if (validations.density && !validations.specificWeight) {
      const specificWeightCell = document.querySelector('[data-cell="specificWeight"]');
      if (specificWeightCell) {
        specificWeightCell.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }
  }, [validations.density, validations.specificWeight]);

  const getStepNumber = (step: ExperimentStep): number => {
    switch (step) {
      case 'drying': return 1;
      case 'cooling': return 2;
      case 'weighing': return 3;
      case 'filling': return 4;
      case 'final-weighing': return 5;
    }
  };

  // Get active cell based on current step and data completeness
  const getActiveCell = () => {
    // If all values are filled, return null to stop highlighting
    if (experimentData.m1 && experimentData.m2 && experimentData.temperature && experimentData.selectedFlask) {
      if (!validations.density) return 'density';
      if (!validations.specificWeight) return 'specificWeight';
      if (!validations.specificGravity) return 'specificGravity';
      return null;
    }

    // Highlight based on current step
    switch (currentStep) {
      case 'drying': return 'flask';
      case 'cooling': return 'temp';
      case 'weighing': return 'mass1';
      case 'filling': return 'volume';
      case 'final-weighing': return 'mass2';
      default: return null;
    }
  };

  type ActiveCell = 'flask' | 'temp' | 'mass1' | 'volume' | 'mass2' | 'density' | 'specificWeight' | 'specificGravity' | null;

  const activeCell: ActiveCell = getActiveCell();

  const currentRow = {
    flask: getStepNumber(currentStep) > 1 && experimentData.selectedFlask 
      ? (experimentData.selectedFlask === 'volumetric-flask' ? '100-mL Volumetric Flask' : '250-mL Erlenmeyer Flask')
      : '-',
    temp: getStepNumber(currentStep) > 2 && experimentData.temperature 
      ? `${experimentData.temperature.toFixed(1)} °C`
      : '-',
    mass1: getStepNumber(currentStep) > 3 && experimentData.m1 
      ? experimentData.m1.toFixed(3) 
      : '-',
    volume: getStepNumber(currentStep) > 3 && experimentData.waterAdded && experimentData.selectedFlask 
      ? (experimentData.selectedFlask === 'volumetric-flask' ? '100.000' : '150.000')
      : '-',
    mass2: getStepNumber(currentStep) > 4 && experimentData.m2 
      ? experimentData.m2.toFixed(3) 
      : '-'
  };

  const validateCalculation = (type: 'density' | 'specificWeight' | 'specificGravity', value: string) => {
    if (!experimentData.m1 || !experimentData.m2) return false;

    const userValue = parseFloat(value);
    if (isNaN(userValue)) return false;

    let correctValue: number;
    const tolerance = 0.001; // 0.1% tolerance

    switch (type) {
      case 'density':
        correctValue = (experimentData.m2 - experimentData.m1) / 
          (experimentData.selectedFlask === 'volumetric-flask' ? 100 : 150);
        break;
      case 'specificWeight':
        correctValue = calculatedValues.density! * 9.81;
        break;
      case 'specificGravity':
        correctValue = calculatedValues.density! / 0.9982;
        break;
      default:
        return false;
    }

    return Math.abs(userValue - correctValue) / correctValue < tolerance;
  };

  const handleInputChange = (type: 'density' | 'specificWeight' | 'specificGravity', value: string) => {
    setUserInputs(prev => ({ ...prev, [type]: value }));
    const isValid = validateCalculation(type, value);
    setValidations(prev => ({ ...prev, [type]: isValid }));

    if (isValid) {
      setCalculatedValues(prev => ({ ...prev, [type]: parseFloat(value) }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Data Table</h2>
          {validations.density && validations.specificWeight && validations.specificGravity && (
            <button
              onClick={() => {
                // Store current values in measurements array
                const newMeasurement = {
                  m1: experimentData.m1!,
                  m2: experimentData.m2!,
                  volume: experimentData.selectedFlask === 'volumetric-flask' ? 100 : 150,
                  temperature: experimentData.temperature!,
                  density: calculatedValues.density!
                };
                
                // Reset for new experiment while preserving measurements
                resetStates();
                
                // Update experiment data with new measurement and reset lab state
                const updatedMeasurements = [...(experimentData.measurements || []), newMeasurement];
                Object.assign(experimentData, {
                  measurements: updatedMeasurements,
                  selectedFlask: 'volumetric-flask',
                  currentStep: 'drying',
                  m1: undefined,
                  m2: undefined,
                  temperature: undefined,
                  density: undefined,
                  heatedM2: undefined,
                  heatedTemperature: undefined,
                  heatedDensity: undefined,
                  isDropping: false,
                  dryingComplete: false,
                  coolingComplete: false,
                  waterAdded: false,
                  calculationComplete: false,
                  location: null,
                  flaskStatus: null,
                  ovenTemperature: undefined
                });
              }}
              className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>

        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="min-w-max">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Flask Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Temperature (°C)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Mass 1 (g)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Volume (mL)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Mass 2 (g)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Mass Density (g/mL)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Specific Weight (kN/m³)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Specific Gravity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="relative" data-cell="flask">
                    <div className={`px-4 py-3 text-sm text-gray-900 ${activeCell === 'flask' ? 'bg-blue-50' : ''}`}>
                      {currentRow.flask}
                      {activeCell === 'flask' && (
                        <motion.div
                          className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        />
                      )}
                    </div>
                  </td>
                  <td className="relative" data-cell="temp">
                    <div className={`px-4 py-3 text-sm text-gray-900 ${activeCell === 'temp' ? 'bg-blue-50' : ''}`}>
                      {currentRow.temp}
                      {activeCell === 'temp' && (
                        <motion.div
                          className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        />
                      )}
                    </div>
                  </td>
                  <td className="relative" data-cell="mass1">
                    <div className={`px-4 py-3 text-sm text-gray-900 ${activeCell === 'mass1' ? 'bg-blue-50' : ''}`}>
                      {currentRow.mass1}
                      {activeCell === 'mass1' && (
                        <motion.div
                          className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        />
                      )}
                    </div>
                  </td>
                  <td className="relative" data-cell="volume">
                    <div className={`px-4 py-3 text-sm text-gray-900 ${activeCell === 'volume' ? 'bg-blue-50' : ''}`}>
                      {currentRow.volume}
                      {activeCell === 'volume' && (
                        <motion.div
                          className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        />
                      )}
                    </div>
                  </td>
                  <td className="relative" data-cell="mass2">
                    <div className={`px-4 py-3 text-sm text-gray-900 ${activeCell === 'mass2' ? 'bg-blue-50' : ''}`}>
                      {currentRow.mass2}
                      {activeCell === 'mass2' && (
                        <motion.div
                          className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        />
                      )}
                    </div>
                  </td>
                  <td className="relative" data-cell="density">
                    <div className={`px-4 py-3 text-sm text-gray-900 ${activeCell === 'density' || (experimentData.m2 && !validations.density) ? 'bg-blue-50' : ''}`}>
                      {calculatedValues.density ? calculatedValues.density.toFixed(4) : '-'}
                      {(activeCell === 'density' || (experimentData.m2 && !validations.density)) && (
                        <motion.div
                          className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        />
                      )}
                    </div>
                  </td>
                  <td className="relative" data-cell="specificWeight">
                    <div className={`px-4 py-3 text-sm text-gray-900 ${activeCell === 'specificWeight' || (validations.density && !validations.specificWeight) ? 'bg-blue-50' : ''}`}>
                      {calculatedValues.specificWeight ? calculatedValues.specificWeight.toFixed(2) : '-'}
                      {(activeCell === 'specificWeight' || (validations.density && !validations.specificWeight)) && (
                        <motion.div
                          className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        />
                      )}
                    </div>
                  </td>
                  <td className="relative" data-cell="specificGravity">
                    <div className={`px-4 py-3 text-sm text-gray-900 ${activeCell === 'specificGravity' || (validations.specificWeight && !validations.specificGravity) ? 'bg-blue-50' : ''}`}>
                      {calculatedValues.specificGravity ? calculatedValues.specificGravity.toFixed(3) : '-'}
                      {(activeCell === 'specificGravity' || (validations.specificWeight && !validations.specificGravity)) && (
                        <motion.div
                          className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Step Instructions */}
        <div className="p-4 bg-blue-50">
          <p className="text-sm text-blue-800">
            {currentStep === 'drying' && "Select a flask and place it in the drying oven to begin"}
            {currentStep === 'cooling' && "Cool the flask and record temperature"}
            {currentStep === 'weighing' && "Measure the empty flask mass (M₁)"}
            {currentStep === 'filling' && "Add water to the flask"}
            {currentStep === 'final-weighing' && "Measure the filled flask mass (M₂)"}
          </p>
        </div>
      </div>

      {/* Calculations Section */}
      {showCalculations && experimentData?.m2 != null && experimentData?.m1 != null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="h-6 w-6 text-blue-500" />
            <h2 className="text-lg font-semibold">Calculations</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Mass Density */}
            <div 
              className="bg-white rounded-lg shadow p-4 border border-gray-200 relative"
              id="density-calculation"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">1. Mass Density (ρ)</span>
                {calculatedValues.density && (
                  <span className="text-sm font-medium text-blue-600">
                    {calculatedValues.density.toFixed(4)} g/mL
                  </span>
                )}
              </div>
              <div className="space-y-3 mt-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Formula:</span>
                      <span className="font-mono">ρ = (M₂ - M₁)/V</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-white p-2 rounded-lg">
                        <div className="text-slate-500">M₁</div>
                        <div className="font-medium">{experimentData.m1.toFixed(3)} g</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg">
                        <div className="text-slate-500">M₂</div>
                        <div className="font-medium">{experimentData.m2.toFixed(3)} g</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg">
                        <div className="text-slate-500">V</div>
                        <div className="font-medium">
                          {experimentData.selectedFlask === 'volumetric-flask' ? '100.000' : '150.000'} mL
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`relative flex-1 transition-all duration-300 ${validations.density ? 'bg-green-50 rounded-lg' : ''}`}>
                        <input
                          type="number"
                          step="0.0001"
                          value={userInputs.density}
                          onChange={(e) => handleInputChange('density', e.target.value)}
                          placeholder="Enter your calculated density"
                          className={`w-full px-3 py-2 pr-16 rounded-lg border ${
                            userInputs.density ? (
                              validations.density ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                            ) : 'border-gray-300'
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <span className="text-gray-500">g/mL</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInputChange('density', userInputs.density)}
                        className={`flex-shrink-0 w-8 h-8 rounded-full transition-all duration-200 ${
                          userInputs.density ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-100 cursor-not-allowed'
                        } flex items-center justify-center`}
                      >
                        <svg className={`w-5 h-5 ${userInputs.density ? 'text-blue-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {!validations.density && (
                <motion.div
                  className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                />
              )}
            </div>

            {/* Specific Weight */}
            <div 
              className={`bg-white rounded-lg shadow p-4 border border-gray-200 relative ${!validations.density ? 'opacity-50' : ''}`}
              id="specific-weight-calculation"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">2. Specific Weight (γ)</span>
                {calculatedValues.specificWeight && (
                  <span className="text-sm font-medium text-blue-600">
                    {calculatedValues.specificWeight.toFixed(2)} kN/m³
                  </span>
                )}
              </div>
              {validations.density && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 mt-4"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Formula:</span>
                        <span className="font-mono">γ = ρg = ρ × 9.81</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white p-2 rounded-lg">
                          <div className="text-slate-500">ρ</div>
                          <div className="font-medium">
                            {calculatedValues.density !== null ? calculatedValues.density.toFixed(4) : '-'} g/mL
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded-lg">
                          <div className="text-slate-500">g</div>
                          <div className="font-medium">9.81 m/s²</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`relative flex-1 transition-all duration-300 ${validations.specificWeight ? 'bg-green-50 rounded-lg' : ''}`}>
                          <input
                            type="number"
                            step="0.01"
                            value={userInputs.specificWeight}
                            onChange={(e) => handleInputChange('specificWeight', e.target.value)}
                            placeholder="Enter your calculated specific weight"
                            disabled={!validations.density}
                            className={`w-full px-3 py-2 pr-16 rounded-lg border ${
                              !validations.density ? 'bg-gray-50 text-gray-400 cursor-not-allowed' :
                              userInputs.specificWeight ? (
                                validations.specificWeight ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                              ) : 'border-gray-300'
                            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <span className="text-gray-500">kN/m³</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleInputChange('specificWeight', userInputs.specificWeight)}
                          disabled={!validations.density}
                          className={`flex-shrink-0 w-8 h-8 rounded-full transition-all duration-200 ${
                            validations.density && userInputs.specificWeight ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-100 cursor-not-allowed'
                          } flex items-center justify-center`}
                        >
                          <svg className={`w-5 h-5 ${validations.density && userInputs.specificWeight ? 'text-blue-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {validations.density && !validations.specificWeight && (
                <motion.div
                  className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                />
              )}
              {!validations.density && (
                <p className="text-sm text-gray-500 mt-2">Complete Mass Density calculation first</p>
              )}
            </div>

            {/* Specific Gravity */}
            <div className={`bg-white rounded-lg shadow p-4 border border-gray-200 relative ${!validations.specificWeight ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">3. Specific Gravity (SG)</span>
                {calculatedValues.specificGravity && (
                  <span className="text-sm font-medium text-blue-600">
                    {calculatedValues.specificGravity.toFixed(3)}
                  </span>
                )}
              </div>
              {validations.specificWeight && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 mt-4"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Formula:</span>
                        <span className="font-mono">SG = ρ/ρwater,4°C = ρ/0.9982</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white p-2 rounded-lg">
                          <div className="text-slate-500">ρ</div>
                          <div className="font-medium">
                            {calculatedValues.density !== null ? calculatedValues.density.toFixed(4) : '-'} g/mL
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded-lg">
                          <div className="text-slate-500">ρwater,4°C</div>
                          <div className="font-medium">0.9982 g/mL</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`relative flex-1 transition-all duration-300 ${validations.specificGravity ? 'bg-green-50 rounded-lg' : ''}`}>
                          <input
                            type="number"
                            step="0.001"
                            value={userInputs.specificGravity}
                            onChange={(e) => handleInputChange('specificGravity', e.target.value)}
                            placeholder="Enter your calculated specific gravity"
                            disabled={!validations.specificWeight}
                            className={`w-full px-3 py-2 pr-16 rounded-lg border ${
                              !validations.specificWeight ? 'bg-gray-50 text-gray-400 cursor-not-allowed' :
                              userInputs.specificGravity ? (
                                validations.specificGravity ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                              ) : 'border-gray-300'
                            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <span className="text-gray-500">SG</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleInputChange('specificGravity', userInputs.specificGravity)}
                          disabled={!validations.specificWeight}
                          className={`flex-shrink-0 w-8 h-8 rounded-full transition-all duration-200 ${
                            validations.specificWeight && userInputs.specificGravity ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-100 cursor-not-allowed'
                          } flex items-center justify-center`}
                        >
                          <svg className={`w-5 h-5 ${validations.specificWeight && userInputs.specificGravity ? 'text-blue-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {!validations.specificWeight && (
                <p className="text-sm text-gray-500 mt-2">Complete Specific Weight calculation first</p>
              )}
            </div>

            {/* Complete Section - Show when all calculations are done */}
            {validations.density && validations.specificWeight && validations.specificGravity && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow p-4 border border-green-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Experiment Complete!</h3>
                      <p className="text-sm text-green-600">All calculations have been successfully verified</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Store current values in measurements array
                      const newMeasurement = {
                        m1: experimentData.m1!,
                        m2: experimentData.m2!,
                        volume: experimentData.selectedFlask === 'volumetric-flask' ? 100 : 150,
                        temperature: experimentData.temperature!,
                        density: calculatedValues.density!
                      };
                      
                      // Reset for new experiment while preserving measurements
                      resetStates();
                      
                      // Update experiment data with new measurement and reset lab state
                      const updatedMeasurements = [...(experimentData.measurements || []), newMeasurement];
                      Object.assign(experimentData, {
                        measurements: updatedMeasurements,
                        selectedFlask: 'volumetric-flask',
                        currentStep: 'drying',
                        m1: undefined,
                        m2: undefined,
                        temperature: undefined,
                        density: undefined,
                        heatedM2: undefined,
                        heatedTemperature: undefined,
                        heatedDensity: undefined,
                        isDropping: false,
                        dryingComplete: false,
                        coolingComplete: false,
                        waterAdded: false,
                        calculationComplete: false,
                        location: null,
                        flaskStatus: null,
                        ovenTemperature: undefined
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <span>New Experiment</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}