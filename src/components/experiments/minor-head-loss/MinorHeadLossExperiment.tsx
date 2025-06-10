import React, { useState, useEffect } from 'react';
import { ArrowDownIcon, ArrowPathIcon, DocumentArrowDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { PipeSystem } from './PipeSystem';
import { CalculationSteps } from './CalculationSteps';
import {
  CONSTANTS,
  FLOW_RATES,
  FITTINGS,
  REFERENCE_VALUES,
  ComponentMeasurement,
  GaugeReading,
  CalculationStep,
  ReferenceValues,
  COMPONENT_PRESSURES,
  ComponentPressures,
  ComponentId,
  FlowRate,
  FlowRateValue
} from './types';
import {
  calculateVelocity,
  calculatePressureDrop,
  calculateHeadLoss,
  calculateLossCoefficient,
  calculateReynolds,
  calculateEquivalentLength,
  verifyMeasurements,
  generateReport,
  validateCalculation
} from './calculations';

interface ValidationFeedback {
  velocity: boolean | null;
  pressureDrop: boolean | null;
  headLoss: boolean | null;
  kValue: boolean | null;
}

export default function MinorHeadLossExperiment() {
  const [selectedFlowRate, setSelectedFlowRate] = useState<number>(FLOW_RATES[0].value);
  const [currentIteration, setCurrentIteration] = useState<string>('Q1');
  const [valveOpening, setValveOpening] = useState<number>(100);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [useImperial, setUseImperial] = useState<boolean>(false);
  const [selectedComponent, setSelectedComponent] = useState(FITTINGS[0]);
  const [gaugeReadings, setGaugeReadings] = useState<GaugeReading[]>([]);
  const [measurements, setMeasurements] = useState<ComponentMeasurement[]>([]);
  const [calculationSteps, setCalculationSteps] = useState<CalculationStep[]>([]);
  const [referenceData, setReferenceData] = useState<ReferenceValues[]>([]);
  const [currentCalculation, setCurrentCalculation] = useState<{
    velocity: number | null;
    pressureDrop: number | null;
    headLoss: number | null;
    kValue: number | null;
  }>({
    velocity: null,
    pressureDrop: null,
    headLoss: null,
    kValue: null
  });
  const [instructorMode, setInstructorMode] = useState<boolean>(false);

  // Add state for student inputs
  const [studentCalculations, setStudentCalculations] = useState({
    velocity: '',
    pressureDrop: '',
    headLoss: '',
    kValue: ''
  });

  const [validationFeedback, setValidationFeedback] = useState<ValidationFeedback>({
    velocity: null,
    pressureDrop: null,
    headLoss: null,
    kValue: null
  });

  // Get current reference data
  const getCurrentReference = () => {
    const flowRate = FLOW_RATES.find(rate => rate.iteration === currentIteration)?.value;
    return REFERENCE_VALUES.find(
      data => data.component === selectedComponent.id &&
              data.flowRate === flowRate
    );
  };

  useEffect(() => {
    // Clear non-relevant gauges when component changes
    setGaugeReadings(prev => {
      return prev.filter(reading => {
        // Keep only gauges relevant to the current component
        if (selectedComponent.id === 'globe-valve') {
          return reading.position === 'valve-in' || reading.position === 'valve-out';
        } else if (selectedComponent.id === 'smooth-bend') {
          return reading.position === 'bend-out' || reading.position === 'reducer-in';
        } else if (selectedComponent.id === 'reducer') {
          return reading.position === 'reducer-in' || reading.position === 'reducer-out';
        }
        return false;
      });
    });

    const reference = getCurrentReference();
    if (reference) {
      setSelectedFlowRate(reference.flowRate);
      updateReferenceReadings(reference);
    }
  }, [selectedComponent.id, currentIteration]);

  // Update pressure readings when component or flow rate changes
  useEffect(() => {
    const componentId = selectedComponent.id as ComponentId;
    const flowRateObj = FLOW_RATES.find(rate => rate.iteration === currentIteration);
    
    if (!flowRateObj) {
      console.warn(`No flow rate found for iteration ${currentIteration}`);
      return;
    }

    const flowRate = flowRateObj.value.toFixed(4) as FlowRateValue;
    const pressures = COMPONENT_PRESSURES[componentId]?.[flowRate];
    
    if (!pressures) {
      console.warn(`No pressure data found for ${componentId} at flow rate ${flowRate}`);
      return;
    }

    const newReadings: GaugeReading[] = [];
    
    if (componentId === 'globe-valve') {
      newReadings.push(
        {
          position: 'valve-in',
          pressure: pressures.p1,
          isConnected: true,
          isReference: false
        },
        {
          position: 'valve-out',
          pressure: pressures.p2,
          isConnected: true,
          isReference: false
        }
      );
    } else if (componentId === 'smooth-bend') {
      newReadings.push(
        {
          position: 'bend-out',
          pressure: pressures.p1,
          isConnected: true,
          isReference: false
        },
        {
          position: 'reducer-in',
          pressure: pressures.p2,
          isConnected: true,
          isReference: false
        }
      );
    } else if (componentId === 'reducer') {
      newReadings.push(
        {
          position: 'reducer-in',
          pressure: pressures.p1,
          isConnected: true,
          isReference: false
        },
        {
          position: 'reducer-out',
          pressure: pressures.p2,
          isConnected: true,
          isReference: false
        }
      );
    }
    
    setGaugeReadings(newReadings);
  }, [selectedComponent.id, currentIteration]);

  const updateReferenceReadings = (reference: ReferenceValues) => {
    setGaugeReadings(prev => {
      const newReadings = prev.filter(r => !r.isReference);
      
      // Add reference readings (orange values)
      const referencePoints = getReferencePoints(selectedComponent.id);
      referencePoints.forEach(point => {
        const pressure = point.isInput ? reference.p1 : reference.p2;
        newReadings.push({
          position: point.id,
          pressure,
          isConnected: true,
          isReference: true
        });
      });
      
      return newReadings;
    });
  };

  const getReferencePoints = (componentId: string): { id: string; isInput: boolean }[] => {
    switch (componentId) {
      case 'globe-valve':
        return [
          { id: 'valve-in', isInput: true },
          { id: 'valve-out', isInput: false }
        ];
      case 'smooth-bend':
        return [
          { id: 'bend-out', isInput: false },
          { id: 'reducer-in', isInput: true }
        ];
      case 'reducer':
        return [
          { id: 'reducer-in', isInput: true },
          { id: 'reducer-out', isInput: false }
        ];
      default:
        return [];
    }
  };

  const handleGaugeClick = (position: string) => {
    // Check if this gauge is relevant to the current component
    const isRelevantGauge = (() => {
      if (selectedComponent.id === 'globe-valve') {
        return position === 'valve-in' || position === 'valve-out';
      } else if (selectedComponent.id === 'smooth-bend') {
        return position === 'bend-out' || position === 'reducer-in';
      } else if (selectedComponent.id === 'reducer') {
        return position === 'reducer-in' || position === 'reducer-out';
      }
      return false;
    })();

    if (!isRelevantGauge) {
      return; // Don't allow connecting irrelevant gauges
    }

    // Check if this is a reference point
    const referencePoints = getReferencePoints(selectedComponent.id);
    const isReferencePoint = referencePoints.some(p => p.id === position);
    
    // Don't allow disconnecting reference points
    if (isReferencePoint) {
      return;
    }

    // Count current non-reference connected gauges
    const connectedNonRef = gaugeReadings.filter(r => r.isConnected && !r.isReference).length;

    setGaugeReadings(prev => {
      const newReadings = [...prev];
      const existingReading = newReadings.find(r => r.position === position);
      
      if (existingReading) {
        // Allow disconnecting non-reference gauges
        if (!existingReading.isReference) {
          existingReading.isConnected = !existingReading.isConnected;
        }
      } else {
        // Only allow connecting if less than 2 non-reference gauges are connected
        if (connectedNonRef < 2) {
          newReadings.push({
            position,
            pressure: 101325, // Start at atmospheric pressure
            isConnected: true,
            isReference: false
          });
        }
      }
      
      return newReadings;
    });

    if (showAnswers || instructorMode) {
      const reference = getCurrentReference();
      if (reference) {
        updatePressureReadings(reference);
      }
    }
  };

  const updatePressureReadings = (reference: ReferenceValues) => {
    setGaugeReadings(prev => {
      const newReadings = [...prev];
      
      // Update non-reference readings based on their position
      newReadings.forEach(reading => {
        if (!reading.isReference && reading.isConnected) {
          switch (reading.position) {
            case 'valve-in':
            case 'reducer-in':
            case 'bend-in':
              reading.pressure = reference.p1;
              break;
            case 'valve-out':
            case 'reducer-out':
            case 'bend-out':
              reading.pressure = reference.p2;
              break;
          }
        }
      });
      
      return newReadings;
    });

    // Perform calculations if we have enough readings
    const connectedReadings = gaugeReadings.filter(r => r.isConnected);
    if (connectedReadings.length >= 2) {
      performCalculations(reference.p1, reference.p2);
    }
  };

  const performCalculations = (p1: number, p2: number) => {
    const velocityStep = calculateVelocity(selectedFlowRate);
    const pressureDropStep = calculatePressureDrop(p1, p2);
    const headLossStep = calculateHeadLoss(pressureDropStep.value);
    const lossCoeffStep = calculateLossCoefficient(pressureDropStep.value, velocityStep.value);
    const reynoldsStep = calculateReynolds(velocityStep.value);
    const eqLengthStep = calculateEquivalentLength(lossCoeffStep.value);

    // Verify calculations
    const measurement: ComponentMeasurement = {
      componentId: selectedComponent.id,
      iteration: currentIteration,
      flowRate: selectedFlowRate,
      velocity: velocityStep.value,
      p1: p1,
      p2: p2,
      deltaPressure: pressureDropStep.value,
      headLoss: headLossStep.value,
      lossCoefficient: lossCoeffStep.value,
      reynoldsNumber: reynoldsStep.value,
      equivalentLength: eqLengthStep.value,
      isVerified: false
    };

    const verifiedMeasurement = verifyMeasurements(measurement, selectedComponent);

    setMeasurements(prev => {
      const exists = prev.find(m => 
        m.componentId === verifiedMeasurement.componentId && 
        m.iteration === verifiedMeasurement.iteration
      );
      
      if (exists) {
        return prev.map(m => 
          m.componentId === verifiedMeasurement.componentId && 
          m.iteration === verifiedMeasurement.iteration
            ? verifiedMeasurement
            : m
        );
      }
      return [...prev, verifiedMeasurement];
    });

    setCalculationSteps([
      velocityStep,
      pressureDropStep,
      headLossStep,
      lossCoeffStep,
      reynoldsStep,
      eqLengthStep
    ]);
  };

  const exportData = () => {
    const csv = generateReport(measurements);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minor-head-loss-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetExperiment = () => {
    setGaugeReadings([]);
    setMeasurements([]);
    setCalculationSteps([]);
    setSelectedFlowRate(FLOW_RATES[0].value);
    setValveOpening(100);
    setShowAnswers(false);
  };

  // Calculate velocity
  const handleCalculateVelocity = () => {
    if (!studentCalculations.velocity) {
      alert('Please enter your calculated velocity');
      return;
    }

    const isCorrect = validateCalculation(
      selectedComponent.id,
      selectedFlowRate,
      parseFloat(studentCalculations.velocity),
      'velocity'
    );

    setValidationFeedback(prev => ({
      ...prev,
      velocity: isCorrect
    }));

    if (isCorrect) {
      setCurrentCalculation(prev => ({
        ...prev,
        velocity: parseFloat(studentCalculations.velocity)
      }));
    }
  };

  // Calculate pressure drop
  const handleCalculatePressureDrop = () => {
    if (!studentCalculations.pressureDrop) {
      alert('Please enter your calculated pressure drop');
      return;
    }

    const isCorrect = validateCalculation(
      selectedComponent.id,
      selectedFlowRate,
      parseFloat(studentCalculations.pressureDrop),
      'pressureDrop'
    );

    setValidationFeedback(prev => ({
      ...prev,
      pressureDrop: isCorrect
    }));

    if (isCorrect) {
      setCurrentCalculation(prev => ({
        ...prev,
        pressureDrop: parseFloat(studentCalculations.pressureDrop)
      }));
    }
  };

  // Calculate head loss
  const handleCalculateHeadLoss = () => {
    if (!studentCalculations.headLoss) {
      alert('Please enter your calculated head loss');
      return;
    }

    const isCorrect = validateCalculation(
      selectedComponent.id,
      selectedFlowRate,
      parseFloat(studentCalculations.headLoss),
      'headLoss'
    );

    setValidationFeedback(prev => ({
      ...prev,
      headLoss: isCorrect
    }));

    if (isCorrect) {
      setCurrentCalculation(prev => ({
        ...prev,
        headLoss: parseFloat(studentCalculations.headLoss)
      }));
    }
  };

  // Calculate K value
  const handleCalculateK = () => {
    if (!studentCalculations.kValue) {
      alert('Please enter your calculated loss coefficient');
      return;
    }

    const isCorrect = validateCalculation(
      selectedComponent.id,
      selectedFlowRate,
      parseFloat(studentCalculations.kValue),
      'k'
    );

    setValidationFeedback(prev => ({
      ...prev,
      kValue: isCorrect
    }));

    if (isCorrect) {
      setCurrentCalculation(prev => ({
        ...prev,
        kValue: parseFloat(studentCalculations.kValue)
      }));
    }
  };

  // Add to reference data
  const handleAddToReference = () => {
    if (!currentCalculation.velocity || !currentCalculation.pressureDrop || 
        !currentCalculation.headLoss || !currentCalculation.kValue) return;

    const p1 = gaugeReadings.find(r => r.isConnected && (
      (selectedComponent.id === 'globe-valve' && r.position === 'valve-in') ||
      (selectedComponent.id === 'smooth-bend' && r.position === 'bend-out') ||
      (selectedComponent.id === 'reducer' && r.position === 'reducer-in')
    ))?.pressure as number;

    const p2 = gaugeReadings.find(r => r.isConnected && (
      (selectedComponent.id === 'globe-valve' && r.position === 'valve-out') ||
      (selectedComponent.id === 'smooth-bend' && r.position === 'reducer-in') ||
      (selectedComponent.id === 'reducer' && r.position === 'reducer-out')
    ))?.pressure as number;

    const newReference: ReferenceValues = {
      component: selectedComponent.id,
      flowRate: selectedFlowRate,
      velocity: currentCalculation.velocity,
      p1,
      p2,
      pressureDrop: currentCalculation.pressureDrop,
      headLoss: currentCalculation.headLoss,
      k: currentCalculation.kValue
    };

    setReferenceData(prev => [...prev, newReference]);
    
    // Reset current calculation
    setCurrentCalculation({
      velocity: null,
      pressureDrop: null,
      headLoss: null,
      kValue: null
    });
    setCalculationSteps([]);
  };

  // Update the flow rate selection handler
  const handleFlowRateChange = (iteration: string) => {
    const selectedRate = FLOW_RATES.find(rate => rate.iteration === iteration);
    if (selectedRate) {
      setCurrentIteration(iteration);
      setSelectedFlowRate(selectedRate.value);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Main experiment area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Visualization */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Pipe System Visualization</h2>
            <div className="h-[600px]">
              <PipeSystem
                selectedComponent={selectedComponent}
                gaugeReadings={gaugeReadings}
                onGaugeClick={handleGaugeClick}
                flowRate={selectedFlowRate}
                valveOpening={valveOpening}
                showAnswers={showAnswers}
                useImperial={useImperial}
              />
            </div>
          </div>
        </div>

        {/* Right column - Controls and Measurements */}
        <div className="flex flex-col gap-6">
          {/* Component Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Component Selection</h2>
            <div className="grid grid-cols-3 gap-4">
              {FITTINGS.map((fitting) => (
                <button
                  key={fitting.id}
                  onClick={() => setSelectedComponent(fitting)}
                  className={`p-4 rounded-lg text-center transition-colors ${
                    selectedComponent.id === fitting.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {fitting.name}
                </button>
              ))}
            </div>
          </div>

          {/* Flow Rate Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Flow Rate Selection</h2>
            <select
              value={currentIteration}
              onChange={(e) => handleFlowRateChange(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {FLOW_RATES.map((rate) => (
                <option key={rate.iteration} value={rate.iteration}>
                  {rate.label}
                </option>
              ))}
            </select>
          </div>

          {/* Measurements and Calculations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Measurements & Calculations</h2>
            <div className="space-y-4">
              {/* Pressure Readings */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Pressure Readings:</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['P1', 'P2', 'P3', 'P4', 'P5'].map((label) => {
                    const reading = gaugeReadings.find(r => {
                      if (label === 'P1' && selectedComponent.id === 'globe-valve') return r.position === 'valve-in';
                      if (label === 'P2' && selectedComponent.id === 'globe-valve') return r.position === 'valve-out';
                      if (label === 'P3' && selectedComponent.id === 'smooth-bend') return r.position === 'bend-out';
                      if (label === 'P4' && (selectedComponent.id === 'smooth-bend' || selectedComponent.id === 'reducer')) return r.position === 'reducer-in';
                      if (label === 'P5' && selectedComponent.id === 'reducer') return r.position === 'reducer-out';
                      return false;
                    });

                    const isActive = (() => {
                      if (selectedComponent.id === 'globe-valve') return label === 'P1' || label === 'P2';
                      if (selectedComponent.id === 'smooth-bend') return label === 'P3' || label === 'P4';
                      if (selectedComponent.id === 'reducer') return label === 'P4' || label === 'P5';
                      return false;
                    })();

                    return (
                      <div
                        key={label}
                        className={`p-3 rounded-lg ${
                          !isActive ? 'bg-gray-100 text-gray-400' :
                          reading?.isConnected ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        <div className="text-sm font-medium">{label}</div>
                        <div className="font-mono">
                          {reading?.isConnected ? `${reading.pressure.toFixed(0)} Pa` : '---'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Manual Calculations */}
              <div className="space-y-6">
                {/* Flow Rate Input */}
                <div className="flex items-center justify-between">
                  <span className="font-medium">Flow Rate (Q):</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={selectedFlowRate}
                      onChange={(e) => setSelectedFlowRate(Number(e.target.value))}
                      className="w-32 px-2 py-1 border rounded text-right font-mono"
                      step="0.0001"
                    />
                    <span className="text-sm text-gray-500">m³/s</span>
                  </div>
                </div>

                {/* Cross-sectional Area */}
                <div className="flex items-center justify-between">
                  <span className="font-medium">Cross-sectional Area (A):</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">9.33E-05</span>
                    <span className="text-sm text-gray-500">m²</span>
                  </div>
                </div>

                {/* Velocity Calculation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Velocity (V):</span>
                      <div className="text-sm text-gray-500">V = Q/A</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={studentCalculations.velocity}
                        onChange={(e) => setStudentCalculations(prev => ({
                          ...prev,
                          velocity: e.target.value
                        }))}
                        placeholder="Enter calculated V"
                        className="w-32 px-2 py-1 border rounded text-right font-mono"
                        step="0.0001"
                      />
                      <span className="text-sm text-gray-500">m/s</span>
                      <button
                        onClick={handleCalculateVelocity}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                  {validationFeedback.velocity !== null && (
                    <div className={`text-sm ${validationFeedback.velocity ? 'text-green-600' : 'text-red-600'}`}>
                      {validationFeedback.velocity 
                        ? 'Correct! You may proceed to the next calculation.'
                        : 'Incorrect. Please check your calculation and try again. Remember there is a 10% margin of error allowed.'}
                    </div>
                  )}
                </div>

                {/* Pressure Drop Calculation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Pressure Drop (ΔP):</span>
                      <div className="text-sm text-gray-500">ΔP = P₁ - P₂</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={studentCalculations.pressureDrop}
                        onChange={(e) => setStudentCalculations(prev => ({
                          ...prev,
                          pressureDrop: e.target.value
                        }))}
                        placeholder="Enter calculated ΔP"
                        className="w-32 px-2 py-1 border rounded text-right font-mono"
                        step="0.01"
                      />
                      <span className="text-sm text-gray-500">Pa</span>
                      <button
                        onClick={handleCalculatePressureDrop}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                  {validationFeedback.pressureDrop !== null && (
                    <div className={`text-sm ${validationFeedback.pressureDrop ? 'text-green-600' : 'text-red-600'}`}>
                      {validationFeedback.pressureDrop 
                        ? 'Correct! You may proceed to the next calculation.'
                        : 'Incorrect. Please check your calculation and try again. Remember there is a 10% margin of error allowed.'}
                    </div>
                  )}
                </div>

                {/* Head Loss Calculation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Head Loss (hₘ):</span>
                      <div className="text-sm text-gray-500">hₘ = ΔP/(ρg)</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={studentCalculations.headLoss}
                        onChange={(e) => setStudentCalculations(prev => ({
                          ...prev,
                          headLoss: e.target.value
                        }))}
                        placeholder="Enter calculated hₘ"
                        className="w-32 px-2 py-1 border rounded text-right font-mono"
                        step="0.0001"
                      />
                      <span className="text-sm text-gray-500">m</span>
                      <button
                        onClick={handleCalculateHeadLoss}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                  {validationFeedback.headLoss !== null && (
                    <div className={`text-sm ${validationFeedback.headLoss ? 'text-green-600' : 'text-red-600'}`}>
                      {validationFeedback.headLoss 
                        ? 'Correct! You may proceed to the next calculation.'
                        : 'Incorrect. Please check your calculation and try again. Remember there is a 10% margin of error allowed.'}
                    </div>
                  )}
                </div>

                {/* Loss Coefficient Calculation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Loss Coefficient (K):</span>
                      <div className="text-sm text-gray-500">K = 2ΔP/(ρV²)</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={studentCalculations.kValue}
                        onChange={(e) => setStudentCalculations(prev => ({
                          ...prev,
                          kValue: e.target.value
                        }))}
                        placeholder="Enter calculated K"
                        className="w-32 px-2 py-1 border rounded text-right font-mono"
                        step="0.01"
                      />
                      <span className="text-sm text-gray-500">-</span>
                      <button
                        onClick={handleCalculateK}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                  {validationFeedback.kValue !== null && (
                    <div className={`text-sm ${validationFeedback.kValue ? 'text-green-600' : 'text-red-600'}`}>
                      {validationFeedback.kValue 
                        ? 'Correct! All calculations are complete.'
                        : 'Incorrect. Please check your calculation and try again. Remember there is a 10% margin of error allowed.'}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAddToReference}
                  disabled={!currentCalculation.kValue}
                  className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Add to Reference Data</span>
                </button>
              </div>

              {/* Calculation Steps */}
              {calculationSteps.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Calculation Steps:</h3>
                  <CalculationSteps 
                    steps={calculationSteps}
                    title="Current Calculations"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reference Data Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Reference Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Iteration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flow Rate (m³/s)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Velocity (m/s)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P₁ (Pa)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P₂ (Pa)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ΔP (Pa)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">hₘ (m)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">K</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {referenceData.map((ref, index) => (
                <tr key={index}>
                  <td>{ref.component}</td>
                  <td>{ref.flowRate}</td>
                  <td>{ref.velocity.toFixed(4)}</td>
                  <td>{ref.p1}</td>
                  <td>{ref.p2}</td>
                  <td>{ref.pressureDrop}</td>
                  <td>{ref.headLoss.toFixed(2)}</td>
                  <td>{ref.k.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 