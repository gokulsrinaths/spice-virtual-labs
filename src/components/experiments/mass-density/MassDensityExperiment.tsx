import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApparatusList } from './layout/ApparatusList';
import { LabBench } from './lab/LabBench';
import { DataTable } from './DataTable';
import { ExperimentData, ExperimentStep } from './types';
import { TemperatureSetupModal } from './components/TemperatureSetupModal';
import { WelcomeModal } from './components/WelcomeModal';
import { ChevronRight, Table2, X, Beaker, ClipboardList, Settings } from 'lucide-react';

export function MassDensityExperiment() {
  const [experimentData, setExperimentData] = useState<ExperimentData>({
    selectedFlask: 'volumetric-flask',
    currentStep: 'drying',
    isDropping: false,
    measurements: []
  });
  const [selectedApparatus, setSelectedApparatus] = useState<string | null>(null);
  const [usedApparatus, setUsedApparatus] = useState<string[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTemperatureSetup, setShowTemperatureSetup] = useState(false);
  const [labBenchActive, setLabBenchActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(false);
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

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    setShowTemperatureSetup(true);
  };

  const handleTemperatureSetup = (temperature: number) => {
    setExperimentData(prev => ({
      ...prev,
      ovenTemperature: temperature
    }));
    setShowTemperatureSetup(false);
    setLabBenchActive(true);
  };

  const handleStepComplete = (data: Partial<ExperimentData> & { nextStep?: ExperimentStep }) => {
    setExperimentData(prev => {
      const newData = { ...prev, ...data };
      if (data.nextStep) {
        newData.currentStep = data.nextStep;
      }
      return newData;
    });
  };

  const handleApparatusUse = (apparatusId: string) => {
    if (!usedApparatus.includes(apparatusId)) {
      setUsedApparatus(prev => [...prev, apparatusId]);
    }
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <WelcomeModal onStart={handleWelcomeComplete} />
      </div>
    );
  }

  if (showTemperatureSetup) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <TemperatureSetupModal onSetTemperature={handleTemperatureSetup} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation Menu */}
      <div className="h-16 w-full bg-zinc-900 border-b border-zinc-800 flex items-center px-8">
        <div className="flex items-center space-x-4">
          <button
            className="p-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors relative group"
            onClick={() => {}}
          >
            <Beaker className="h-5 w-5" />
            <span className="absolute top-full mt-1 px-3 py-1.5 bg-zinc-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
              Laboratory
            </span>
          </button>
          <button
            className={`p-3 rounded-xl transition-colors relative group ${
              validations.density && validations.specificWeight && validations.specificGravity
                ? 'text-white hover:bg-white/5'
                : 'text-zinc-600 cursor-not-allowed'
            }`}
            onClick={() => validations.specificGravity && setShowResults(true)}
            disabled={!validations.specificGravity}
          >
            <ClipboardList className="h-5 w-5" />
            <span className="absolute top-full mt-1 px-3 py-1.5 bg-zinc-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
              Results
            </span>
          </button>
          <button
            className={`p-3 rounded-xl transition-colors relative group ${
              experimentData.measurements && experimentData.measurements.length > 0 ? 'text-white' : 'text-zinc-400'
            } hover:bg-white/5`}
            onClick={() => setShowMeasurements(true)}
          >
            <Table2 className="h-5 w-5" />
            <span className="absolute top-full mt-1 px-3 py-1.5 bg-zinc-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
              Measurements
            </span>
            {experimentData.measurements && experimentData.measurements.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-white text-black text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {experimentData.measurements.length}
              </div>
            )}
          </button>
          <button
            className="p-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors relative group"
            onClick={() => {
              setExperimentData({
                selectedFlask: 'volumetric-flask',
                currentStep: 'drying',
                isDropping: false,
                measurements: [],
                location: null,
                flaskStatus: null,
                temperature: undefined,
                m1: undefined,
                m2: undefined,
                density: undefined,
                heatedM2: undefined,
                heatedTemperature: undefined,
                heatedDensity: undefined,
                dryingComplete: false,
                coolingComplete: false,
                waterAdded: false,
                calculationComplete: false,
                ovenTemperature: undefined
              });
              setSelectedApparatus(null);
              setUsedApparatus([]);
              setShowResults(false);
              setShowMeasurements(false);
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
              setLabBenchActive(true);
              setShowTemperatureSetup(true);
            }}
          >
            <Settings className="h-5 w-5" />
            <span className="absolute top-full mt-1 px-3 py-1.5 bg-zinc-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
              Reset All
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-light tracking-tight mb-2">Mass Density Analysis</h1>
            <p className="text-zinc-400 text-sm">Laboratory Protocol: MD-001</p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Data Table */}
            <div className="col-span-4">
              <div className="sticky top-24 space-y-8">
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800">
                  <div className="p-6 border-b border-zinc-800">
                    <h2 className="text-lg font-light">Experimental Data</h2>
                  </div>
                  <DataTable 
                    experimentData={experimentData}
                    currentStep={experimentData.currentStep}
                  />
                </div>
                
                {/* Available Apparatus */}
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800">
                  <div className="p-6 border-b border-zinc-800">
                    <h2 className="text-lg font-light">Available Apparatus</h2>
                  </div>
                  <ApparatusList
                    selectedApparatus={selectedApparatus}
                    onApparatusSelect={setSelectedApparatus}
                    usedApparatus={usedApparatus}
                    isTemperatureSet={experimentData.ovenTemperature !== undefined}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Lab Bench */}
            <div className="col-span-8">
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
                <LabBench
                  experimentData={experimentData}
                  onStepComplete={handleStepComplete}
                  onApparatusUse={handleApparatusUse}
                  active={labBenchActive}
                  currentStep={experimentData.currentStep}
                  selectedApparatus={selectedApparatus}
                  usedApparatus={usedApparatus}
                  calculationModal={{ show: false }}
                  validations={validations}
                  calculatedValues={calculatedValues}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <AnimatePresence>
        {showResults && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setShowResults(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-[600px] bg-zinc-900 border-r border-zinc-800 overflow-y-auto z-50"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-light">Results</h3>
                  <button
                    onClick={() => setShowResults(false)}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Results Table */}
                  <div className="bg-black/20 rounded-xl p-6">
                    <table className="w-full">
                      <tbody className="divide-y divide-zinc-800">
                        <tr>
                          <td className="py-4 text-sm text-zinc-400">Mass Density (ρ)</td>
                          <td className="py-4 text-sm font-mono">{calculatedValues.density?.toFixed(4)} g/mL</td>
                        </tr>
                        <tr>
                          <td className="py-4 text-sm text-zinc-400">Specific Weight (γ)</td>
                          <td className="py-4 text-sm font-mono">{calculatedValues.specificWeight?.toFixed(2)} kN/m³</td>
                        </tr>
                        <tr>
                          <td className="py-4 text-sm text-zinc-400">Specific Gravity (SG)</td>
                          <td className="py-4 text-sm font-mono">{calculatedValues.specificGravity?.toFixed(3)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* New Experiment Button */}
                  <button
                    onClick={() => {
                      setExperimentData({
                        selectedFlask: 'volumetric-flask',
                        currentStep: 'drying',
                        isDropping: false,
                        measurements: [],
                        location: null,
                        flaskStatus: null,
                        temperature: undefined,
                        m1: undefined,
                        m2: undefined,
                        density: undefined,
                        heatedM2: undefined,
                        heatedTemperature: undefined,
                        heatedDensity: undefined,
                        dryingComplete: false,
                        coolingComplete: false,
                        waterAdded: false,
                        calculationComplete: false,
                        ovenTemperature: undefined
                      });
                      setSelectedApparatus(null);
                      setUsedApparatus([]);
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
                      setShowResults(false);
                      setShowTemperatureSetup(true);
                    }}
                    className="w-full px-4 py-3 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    New Experiment
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Measurements Panel */}
      <AnimatePresence>
        {showMeasurements && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setShowMeasurements(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-[600px] bg-zinc-900 border-r border-zinc-800 overflow-y-auto z-50"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-light">Measurements</h3>
                  <button
                    onClick={() => setShowMeasurements(false)}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="bg-black/20 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="px-6 py-4 text-left text-sm font-normal text-zinc-400">Temperature</th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-zinc-400">M₁ (g)</th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-zinc-400">M₂ (g)</th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-zinc-400">Density (g/mL)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {experimentData.measurements?.map((measurement, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-sm font-mono">{measurement.temperature.toFixed(1)} °C</td>
                          <td className="px-6 py-4 text-sm font-mono">{measurement.m1.toFixed(3)}</td>
                          <td className="px-6 py-4 text-sm font-mono">{measurement.m2.toFixed(3)}</td>
                          <td className="px-6 py-4 text-sm font-mono">{measurement.density.toFixed(4)} g/mL</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function getStepTitle(step: ExperimentStep): string {
  switch (step) {
    case 'drying': return "Apparatus Selection";
    case 'cooling': return "Temperature Equilibration";
    case 'weighing': return "Initial Mass Measurement";
    case 'filling': return "Sample Introduction";
    case 'final-weighing': return "Final Mass Determination";
    default: return "";
  }
}

function getStepDescription(step: ExperimentStep): string {
  switch (step) {
    case 'drying': return "Select appropriate volumetric apparatus and initiate thermal conditioning";
    case 'cooling': return "Allow apparatus to reach thermal equilibrium in controlled environment";
    case 'weighing': return "Obtain precise mass measurement of empty apparatus";
    case 'filling': return "Introduce sample medium following standard protocols";
    case 'final-weighing': return "Perform final mass determination of apparatus with sample";
    default: return "";
  }
}