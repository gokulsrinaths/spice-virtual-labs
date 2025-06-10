import React, { useState, useEffect } from 'react';
import { ArrowDownIcon, ArrowPathIcon, DocumentArrowDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { PipeSystem } from './PipeSystem';
import { CalculationSteps } from './CalculationSteps';
import {
  CONSTANTS,
  FLOW_RATES,
  FITTINGS,
  REFERENCE_DATA,
  ComponentMeasurement,
  GaugeReading,
  CalculationStep,
  ReferenceData
} from './types';
import {
  calculateVelocity,
  calculatePressureDrop,
  calculateHeadLoss,
  calculateLossCoefficient,
  calculateReynolds,
  calculateEquivalentLength,
  verifyMeasurements,
  generateReport
} from './calculations';

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
  const [referenceData, setReferenceData] = useState<ReferenceData[]>([]);
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

  // Calculate velocity
  const handleCalculateVelocity = () => {
    const velocity = selectedFlowRate / CONSTANTS.PIPE_AREA;
    setCurrentCalculation(prev => ({
      ...prev,
      velocity
    }));
    setCalculationSteps(prev => [...prev, {
      label: "Calculate velocity",
      equation: `V = Q/A = ${selectedFlowRate.toExponential(3)}/${CONSTANTS.PIPE_AREA.toExponential(3)}`,
      value: velocity,
      unit: "m/s"
    }]);
  };

  // Calculate pressure drop
  const handleCalculatePressureDrop = () => {
    const p1 = gaugeReadings.find(r => r.isConnected && (
      (selectedComponent.id === 'globe-valve' && r.position === 'valve-in') ||
      (selectedComponent.id === 'smooth-bend' && r.position === 'bend-out') ||
      (selectedComponent.id === 'reducer' && r.position === 'reducer-in')
    ))?.pressure || 0;

    const p2 = gaugeReadings.find(r => r.isConnected && (
      (selectedComponent.id === 'globe-valve' && r.position === 'valve-out') ||
      (selectedComponent.id === 'smooth-bend' && r.position === 'reducer-in') ||
      (selectedComponent.id === 'reducer' && r.position === 'reducer-out')
    ))?.pressure || 0;

    const pressureDrop = p1 - p2;
    setCurrentCalculation(prev => ({
      ...prev,
      pressureDrop
    }));
    setCalculationSteps(prev => [...prev, {
      label: "Calculate pressure drop",
      equation: `ΔP = P₁ - P₂ = ${p1.toFixed(0)} - ${p2.toFixed(0)}`,
      value: pressureDrop,
      unit: "Pa"
    }]);
  };

  // Calculate head loss
  const handleCalculateHeadLoss = () => {
    const pressureDrop = currentCalculation.pressureDrop;
    if (typeof pressureDrop !== 'number') return;
    
    const headLoss = pressureDrop / (CONSTANTS.DENSITY * CONSTANTS.GRAVITY);
    setCurrentCalculation(prev => ({
      ...prev,
      headLoss
    }));
    setCalculationSteps(prev => [...prev, {
      label: "Calculate head loss",
      equation: `hₘ = ΔP/(ρg) = ${pressureDrop.toFixed(0)}/(${CONSTANTS.DENSITY}×${CONSTANTS.GRAVITY})`,
      value: headLoss,
      unit: "m"
    }]);
  };

  // Calculate K value
  const handleCalculateK = () => {
    const pressureDrop = currentCalculation.pressureDrop;
    const velocity = currentCalculation.velocity;
    if (typeof pressureDrop !== 'number' || typeof velocity !== 'number') return;
    
    const kValue = (2 * pressureDrop) / (CONSTANTS.DENSITY * Math.pow(velocity, 2));
    setCurrentCalculation(prev => ({
      ...prev,
      kValue
    }));
    setCalculationSteps(prev => [...prev, {
      label: "Calculate loss coefficient",
      equation: `K = 2ΔP/(ρV²) = 2×${pressureDrop.toFixed(0)}/(${CONSTANTS.DENSITY}×${velocity.toFixed(2)}²)`,
      value: kValue,
      unit: ""
    }]);
  };

  // Add to reference data
  const handleAddToReference = () => {
    if (!currentCalculation.velocity || !currentCalculation.pressureDrop || 
        !currentCalculation.headLoss || !currentCalculation.kValue) return;

    const p1 = gaugeReadings.find(r => r.isConnected && (
      (selectedComponent.id === 'globe-valve' && r.position === 'valve-in') ||
      (selectedComponent.id === 'smooth-bend' && r.position === 'bend-out') ||
      (selectedComponent.id === 'reducer' && r.position === 'reducer-in')
    ))?.pressure || 0;

    const p2 = gaugeReadings.find(r => r.isConnected && (
      (selectedComponent.id === 'globe-valve' && r.position === 'valve-out') ||
      (selectedComponent.id === 'smooth-bend' && r.position === 'reducer-in') ||
      (selectedComponent.id === 'reducer' && r.position === 'reducer-out')
    ))?.pressure || 0;

    const newReference: ReferenceData = {
      component: selectedComponent.id,
      iteration: currentIteration,
      flowRate: selectedFlowRate,
      velocity: currentCalculation.velocity,
      p1,
      p2,
      pressureDrop: currentCalculation.pressureDrop,
      headLoss: currentCalculation.headLoss,
      kValue: currentCalculation.kValue,
      isCalculated: true
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

  // ... rest of the component code ...
} 