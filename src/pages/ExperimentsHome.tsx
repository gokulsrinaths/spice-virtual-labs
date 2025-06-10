import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ExperimentCard {
  title: string;
  description: string;
  path: string;
}

const experiments = [
  {
    title: "Mass Density",
    description: "Mass and volume relationships in materials",
    path: "/experiments/mass-density"
  },
  {
    title: "Dynamic Viscosity",
    description: "Fluid resistance and flow behavior",
    path: "/experiments/viscosity"
  },
  {
    title: "Vapor Pressure",
    description: "Liquid-vapor phase equilibrium",
    path: "/experiments/vapor-pressure"
  },
  {
    title: "Buoyancy",
    description: "Floating and sinking phenomena",
    path: "/experiments/buoyancy"
  },
  {
    title: "Hydrostatic Pressure",
    description: "Pressure variation in static fluids",
    path: "/experiments/hydrostatic-pressure"
  },
  {
    title: "Bernoulli's Principle",
    description: "Fluid pressure and velocity relationships",
    path: "/experiments/bernoulli"
  },
  {
    title: "Energy Equation",
    description: "Energy conservation in fluid flow",
    path: "/experiments/energy"
  },
  {
    title: "Reynolds Number",
    description: "Laminar and turbulent flow regimes",
    path: "/experiments/reynolds"
  },
  {
    title: "Minor Head Loss",
    description: "Energy losses in pipe fittings",
    path: "/experiments/minor-head-loss"
  }
];

export function ExperimentsHome() {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Minimal Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-24">
        <motion.h1 
          className="text-4xl font-normal text-gray-900 mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Virtual Fluid Mechanics Laboratory
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-500 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Nine essential experiments. Precise simulations. Clear insights.
        </motion.p>
      </div>

      {/* Experiment Grid */}
      <div className="max-w-4xl mx-auto px-6 pb-32">
        <motion.div 
          className="grid gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {experiments.map((experiment, index) => (
            <Link
              key={experiment.path}
              to={experiment.path}
              className="group border-b border-gray-100 pb-12 last:border-b-0 last:pb-0"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
                      {experiment.title}
                    </h2>
                    <p className="mt-2 text-gray-500">
                      {experiment.description}
                    </p>
                  </div>
                  <div className="ml-8">
                    <svg 
                      className="w-5 h-5 text-gray-400 transform group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M14 5l7 7m0 0l-7 7m7-7H3" 
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Minimal Footer */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <p className="text-sm text-gray-400 text-center">
          A modern approach to fluid mechanics education
        </p>
      </div>
    </div>
  );
} 