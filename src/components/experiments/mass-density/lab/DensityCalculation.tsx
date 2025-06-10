import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, BarChart3, Clipboard, Award, Thermometer, AlertCircle } from 'lucide-react';
import '../MassDensityExperiment.css';

export interface DensityCalculationProps {
  massFlask: number;
  massFlaskWater: number;
  volume: number;
  temperature: number;
  selectedFlask: 'volumetric-flask' | 'erlenmeyer-flask';
  onComplete: () => void;
}

// Define temperature keys type for standardDensities
type TemperatureKey = '15' | '20' | '25' | '30' | '35';

export function DensityCalculation({
  massFlask,
  massFlaskWater,
  volume,
  temperature,
  selectedFlask,
  onComplete
}: DensityCalculationProps) {
  const [showSteps, setShowSteps] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [calculationComplete, setCalculationComplete] = React.useState(false);
  const [showUncertainty, setShowUncertainty] = React.useState(false);
  
  // Calculate the density with temperature correction
  const waterMass = massFlaskWater - massFlask;
  
  // Temperature correction for water density
  const getWaterDensityAtTemp = (temp: number) => {
    // More precise polynomial fit for water density vs temperature
    const a = -0.0000069;
    const b = 0.0000592;
    const c = -0.0079;
    const d = 1.0002;
    return (a * Math.pow(temp, 3) + b * Math.pow(temp, 2) + c * temp + d);
  };
  
  const density = waterMass / volume;
  const temperatureCorrectedDensity = density * (0.9982 / getWaterDensityAtTemp(temperature));
  
  // Uncertainty analysis
  const uncertainties = {
    mass: 0.001, // g
    volume: selectedFlask === 'volumetric-flask' ? 0.08 : 0.1, // mL
    temperature: 0.1 // °C
  };
  
  const calculateUncertainty = () => {
    const dρdm = 1 / volume; // Partial derivative of density with respect to mass
    const dρdv = -waterMass / (volume * volume); // Partial derivative of density with respect to volume
    
    const massUncertaintyContribution = Math.pow(dρdm * uncertainties.mass, 2);
    const volumeUncertaintyContribution = Math.pow(dρdv * uncertainties.volume, 2);
    
    return Math.sqrt(massUncertaintyContribution + volumeUncertaintyContribution);
  };
  
  const densityUncertainty = calculateUncertainty();
  
  // Standard density values at different temperatures for comparison
  const standardDensities: Record<TemperatureKey, number> = {
    '15': 0.9991,
    '20': 0.9982,
    '25': 0.9970,
    '30': 0.9956,
    '35': 0.9940,
  };
  
  // Get the closest standard temperature for comparison
  const getClosestTemperature = (): TemperatureKey => {
    const temperatures = ['15', '20', '25', '30', '35'] as const;
    let closest = '20' as TemperatureKey;
    let smallestDiff = Math.abs(20 - temperature);
    
    for (const temp of temperatures) {
      const currentTemp = parseInt(temp, 10);
      const currentDiff = Math.abs(currentTemp - temperature);
      if (currentDiff < smallestDiff) {
        smallestDiff = currentDiff;
        closest = temp as TemperatureKey;
      }
    }
    
    return closest;
  };
  
  const closestTemp = getClosestTemperature();
  const standardDensity = standardDensities[closestTemp];
  const percentError = Math.abs((temperatureCorrectedDensity - standardDensity) / standardDensity * 100);
  
  // Calculate accuracy level with uncertainty consideration
  const getAccuracyLevel = () => {
    const combinedUncertainty = Math.sqrt(Math.pow(densityUncertainty, 2) + Math.pow(0.0001, 2)); // Adding standard uncertainty
    if (percentError < combinedUncertainty) return { label: 'Excellent', color: 'green' };
    if (percentError < 2 * combinedUncertainty) return { label: 'Good', color: 'blue' };
    if (percentError < 3 * combinedUncertainty) return { label: 'Acceptable', color: 'yellow' };
    return { label: 'Needs Improvement', color: 'red' };
  };
  
  const accuracyLevel = getAccuracyLevel();
  
  // Copy result to clipboard with enhanced information
  const copyToClipboard = () => {
    const resultText = `
Mass Density Experiment Results:
-------------------------------
Empty Flask Mass: ${massFlask.toFixed(3)} ± ${uncertainties.mass} g
Flask with Water Mass: ${massFlaskWater.toFixed(3)} ± ${uncertainties.mass} g
Water Mass: ${waterMass.toFixed(3)} ± ${(Math.sqrt(2) * uncertainties.mass).toFixed(3)} g
Volume: ${volume.toFixed(0)} ± ${uncertainties.volume} mL
Temperature: ${temperature}°C ± ${uncertainties.temperature}°C

Raw Density: ${density.toFixed(4)} ± ${densityUncertainty.toFixed(4)} g/mL
Temperature-Corrected Density: ${temperatureCorrectedDensity.toFixed(4)} g/mL
Standard Density at ${closestTemp}°C: ${standardDensity} g/mL
Percent Error: ${percentError.toFixed(2)}%
Accuracy Level: ${accuracyLevel.label}

Temperature Correction Factor: ${(0.9982 / getWaterDensityAtTemp(temperature)).toFixed(4)}
Measurement Uncertainty Analysis Included
    `;
    
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-xl p-6 w-[600px] shadow-2xl overflow-hidden glass-effect"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Calculator className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Density Calculation Results
            </h3>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyToClipboard}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors relative"
              title="Copy results"
            >
              <Clipboard className="h-4 w-4" />
              {copied && (
                <motion.div 
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Copied!
                </motion.div>
              )}
            </motion.button>
          </div>
        </div>

        {!calculationComplete ? (
          <motion.div 
            className="h-[300px] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Calculation animation */}
            <div className="relative w-20 h-20 mb-4">
              <motion.div 
                className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-2 border-4 border-t-transparent border-r-purple-300 border-b-transparent border-l-transparent rounded-full"
                animate={{ rotate: -180 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <Calculator className="absolute inset-0 m-auto h-8 w-8 text-purple-400" />
            </div>
            <motion.p 
              className="text-gray-600 text-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Calculating water density...
            </motion.p>
            
            <motion.div
              className="mt-6 w-[300px] bg-gray-100 h-2 rounded-full overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="h-full bg-purple-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
              />
            </motion.div>
          </motion.div>
        ) : (
          <>
            {/* Main result display */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-lg mb-6 relative border border-purple-100">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500">Water Density</div>
                  <div className="flex items-baseline">
                    <motion.div 
                      className="text-3xl font-bold gradient-text-purple-blue"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {temperatureCorrectedDensity.toFixed(4)}
                    </motion.div>
                    <div className="ml-1 text-gray-500">g/mL</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ± {densityUncertainty.toFixed(4)} g/mL
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Temperature Correction</span>
                  </div>
                  <div className="text-sm font-medium text-blue-600">
                    Factor: {(0.9982 / getWaterDensityAtTemp(temperature)).toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Temperature Effect Visualization */}
              <div className="mt-4 p-3 bg-white/80 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Temperature Effect</span>
                  <span className="text-xs text-gray-500">{temperature}°C</span>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(getWaterDensityAtTemp(temperature) / 0.9982) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>0.9940 g/mL</span>
                  <span>0.9991 g/mL</span>
                </div>
              </div>

              {/* Uncertainty Analysis */}
              <motion.div
                className="mt-4 bg-white/80 rounded-lg p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Uncertainty Analysis</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="text-xs text-gray-500">Mass</div>
                    <div className="text-sm font-medium">±{uncertainties.mass} g</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="text-xs text-gray-500">Volume</div>
                    <div className="text-sm font-medium">±{uncertainties.volume} mL</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="text-xs text-gray-500">Temperature</div>
                    <div className="text-sm font-medium">±{uncertainties.temperature}°C</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Combined uncertainty propagation using partial derivatives method
                </div>
              </motion.div>

              {/* Accuracy Assessment */}
              <motion.div
                className="mt-4 bg-white/80 rounded-lg p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">Accuracy Assessment</span>
                  </div>
                  <div 
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      accuracyLevel.color === 'green' ? 'bg-green-100 text-green-800' :
                      accuracyLevel.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                      accuracyLevel.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {accuracyLevel.label}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Error within {(Math.sqrt(Math.pow(densityUncertainty, 2) + Math.pow(0.0001, 2)) * 100).toFixed(2)}% uncertainty margin
                </div>
              </motion.div>

              {/* Statistical Analysis */}
              <motion.div
                className="mt-4 bg-white/80 rounded-lg p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Statistical Analysis</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Standard Deviation */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Standard Deviation</div>
                    <div className="text-sm font-medium text-gray-800">
                      ±{densityUncertainty.toFixed(4)} g/mL
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Based on propagation of uncertainties
                    </div>
                  </div>
                  
                  {/* Confidence Interval */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">95% Confidence Interval</div>
                    <div className="text-sm font-medium text-gray-800">
                      ±{(densityUncertainty * 1.96).toFixed(4)} g/mL
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Using Student's t-distribution
                    </div>
                  </div>
                </div>

                {/* Quality Metrics */}
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Precision</div>
                    <div className="text-sm font-medium text-gray-800">
                      {(100 - (densityUncertainty / temperatureCorrectedDensity * 100)).toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Accuracy</div>
                    <div className="text-sm font-medium text-gray-800">
                      {(100 - percentError).toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Quality Score</div>
                    <div className="text-sm font-medium text-gray-800">
                      {(((100 - percentError) + (100 - (densityUncertainty / temperatureCorrectedDensity * 100))) / 2).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <Clipboard className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Copy Results'}
                </button>
                
                <button
                  onClick={onComplete}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
            
            {/* Comparison with standard values */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium text-gray-700 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1.5 text-purple-500" />
                  Comparison with Standard Values
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSteps(!showSteps)}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  {showSteps ? 'Hide Calculation' : 'Show Calculation'}
                </motion.button>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-600">Your Result</div>
                  <div className="text-sm font-medium">{temperatureCorrectedDensity.toFixed(4)} g/mL</div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-0.5 bg-gray-100"></div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <div className="flex-1 h-0.5 bg-gray-100"></div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-600">Standard Value at {closestTemp}°C</div>
                  <div className="text-sm font-medium">{standardDensity} g/mL</div>
                </div>
                
                <div className="mt-2 bg-gray-50 p-2 rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">Percent Error</div>
                    <div 
                      className="text-sm font-medium"
                      style={{
                        color: percentError < 1 ? 'rgb(16, 185, 129)' : 
                               percentError < 2 ? 'rgb(245, 158, 11)' : 
                               'rgb(239, 68, 68)'
                      }}
                    >
                      {percentError.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Calculation steps */}
              {showSteps && (
                <motion.div
                  className="mt-4 bg-gray-50 rounded-lg p-4 text-sm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="mb-2 font-medium text-gray-700">Calculation Steps:</div>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li className="font-mono text-xs">
                      Mass of water = Mass of flask with water - Mass of empty flask
                      <div className="pl-5 mt-1 text-gray-500">
                        = {massFlaskWater.toFixed(3)} g - {massFlask.toFixed(3)} g = {waterMass.toFixed(3)} g
                      </div>
                    </li>
                    <li className="font-mono text-xs">
                      Density = Mass of water / Volume of water
                      <div className="pl-5 mt-1 text-gray-500">
                        = {waterMass.toFixed(3)} g / {volume} mL = {density.toFixed(4)} g/mL
                      </div>
                    </li>
                    <li className="font-mono text-xs">
                      Percent error = |Experimental - Standard| / Standard × 100%
                      <div className="pl-5 mt-1 text-gray-500">
                        = |{temperatureCorrectedDensity.toFixed(4)} - {standardDensity}| / {standardDensity} × 100% = {percentError.toFixed(2)}%
                      </div>
                    </li>
                  </ol>
                </motion.div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
} 