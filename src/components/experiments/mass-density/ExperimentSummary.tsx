import React from 'react';
import { motion } from 'framer-motion';
import { X, ChevronRight, Beaker, Thermometer, Scale, ArrowDown, ArrowUp, Calculator } from 'lucide-react';
import { ExperimentData } from './types';

interface ExperimentSummaryProps {
  experimentData: ExperimentData;
  onClose: () => void;
}

export function ExperimentSummary({ experimentData, onClose }: ExperimentSummaryProps) {
  const steps = [
    {
      title: 'Flask Preparation',
      icon: Beaker,
      content: 'Dried the flask in oven at 105°C for 2 hours to remove moisture.',
      details: 'This step ensures accurate mass measurements by eliminating any residual moisture.'
    },
    {
      title: 'Initial Mass',
      icon: Scale,
      content: `Empty flask mass (m₁): ${experimentData.m1?.toFixed(2)} g`,
      details: 'Measured after cooling to room temperature to ensure thermal equilibrium.'
    },
    {
      title: 'Liquid Addition',
      icon: Beaker,
      content: `Added liquid to the ${experimentData.selectedFlask === 'volumetric-flask' ? '100-mL' : '250-mL'} mark.`,
      details: 'Ensured proper meniscus reading at eye level for accurate volume measurement.'
    },
    {
      title: 'Temperature Reading',
      icon: Thermometer,
      content: `Temperature: ${experimentData.temperature}°C`,
      details: 'Recorded temperature affects fluid properties and final calculations.'
    },
    {
      title: 'Final Mass',
      icon: Scale,
      content: `Filled flask mass (m₂): ${experimentData.m2?.toFixed(2)} g`,
      details: 'Measured immediately after filling to minimize evaporation effects.'
    }
  ];

  const calculateResults = () => {
    const volume = experimentData.selectedFlask === 'volumetric-flask' ? 100 : 150;
    const density = (experimentData.m2! - experimentData.m1!) / volume;
    const specificWeight = density * 9.81;
    const specificGravity = density / 0.9982;

    return { density, specificWeight, specificGravity, volume };
  };

  const results = calculateResults();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Mass Density Experiment Summary</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-blue-100 mt-2">Comprehensive analysis of mass density determination</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Experimental Procedure */}
          <section>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ChevronRight className="h-5 w-5 text-blue-500" />
              Experimental Procedure
            </h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <step.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">{step.title}</h4>
                    <p className="text-gray-600">{step.content}</p>
                    <p className="text-sm text-gray-500 mt-1">{step.details}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Calculations */}
          <section>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-500" />
              Calculations & Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mass Density */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Mass Density (ρ)</h4>
                <div className="space-y-2">
                  <p className="text-sm text-blue-700">Formula: ρ = (m₂ - m₁) / V</p>
                  <p className="text-sm text-blue-700">
                    = ({experimentData.m2?.toFixed(2)} g - {experimentData.m1?.toFixed(2)} g) / {results.volume} mL
                  </p>
                  <p className="text-xl font-bold text-blue-800">
                    = {results.density.toFixed(4)} g/mL
                  </p>
                </div>
              </div>

              {/* Specific Weight */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-2">Specific Weight (γ)</h4>
                <div className="space-y-2">
                  <p className="text-sm text-green-700">Formula: γ = ρg</p>
                  <p className="text-sm text-green-700">
                    = {results.density.toFixed(4)} g/mL × 9.81 m/s²
                  </p>
                  <p className="text-xl font-bold text-green-800">
                    = {results.specificWeight.toFixed(3)} kN/m³
                  </p>
                </div>
              </div>

              {/* Specific Gravity */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium mb-2">Specific Gravity (SG)</h4>
                <div className="space-y-2">
                  <p className="text-sm text-purple-700">Formula: SG = ρ/ρwater at 4°C</p>
                  <p className="text-sm text-purple-700">
                    = {results.density.toFixed(4)} / 0.9982
                  </p>
                  <p className="text-xl font-bold text-purple-800">
                    = {results.specificGravity.toFixed(3)}
                  </p>
                </div>
              </div>

              {/* Temperature Effects */}
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium mb-2">Temperature Effects</h4>
                <div className="space-y-2">
                  <p className="text-sm text-orange-700">
                    Temperature: {experimentData.temperature}°C
                  </p>
                  <p className="text-sm text-orange-700">
                    Density variation: ~0.02% per °C
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Analysis */}
          <section className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Analysis & Conclusions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-blue-800">Density Analysis</h4>
                <p className="text-gray-700">
                  The measured density of {results.density.toFixed(4)} g/mL indicates that the liquid sample is {
                    results.density > 1 ? 'denser' : 'less dense'
                  } than water. This is confirmed by the specific gravity of {results.specificGravity.toFixed(3)}.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800">Experimental Accuracy</h4>
                <p className="text-gray-700">
                  Using a {experimentData.selectedFlask === 'volumetric-flask' ? '100-mL volumetric flask' : '250-mL Erlenmeyer flask'} 
                  with ±0.1 mL accuracy and an analytical balance with ±0.01 g precision ensures reliable results.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800">Temperature Considerations</h4>
                <p className="text-gray-700">
                  The experiment was conducted at {experimentData.temperature}°C, which affects the density measurements.
                  Temperature corrections may be necessary for high-precision applications.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            Close Summary
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}