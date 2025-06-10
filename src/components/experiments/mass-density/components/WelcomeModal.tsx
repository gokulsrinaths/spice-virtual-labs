import React from 'react';
import { motion } from 'framer-motion';
import { Beaker, ArrowRight, FlaskRound as Flask, Thermometer, Scale } from 'lucide-react';

interface WelcomeModalProps {
  onStart: () => void;
}

export function WelcomeModal({ onStart }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <motion.div
        initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full border border-zinc-800"
    >
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-white/5 rounded-xl">
              <Beaker className="h-6 w-6 text-white" />
        </div>
        <div>
              <h2 className="text-2xl font-light text-white tracking-tight">Mass Density</h2>
              <p className="text-zinc-400 text-sm">Virtual fluid mechanics laboratory</p>
        </div>
      </div>

          <div className="space-y-8">
            <div className="bg-black/20 rounded-xl p-6">
              <h3 className="font-medium text-white mb-4">What you'll learn</h3>
              <ul className="space-y-3 text-zinc-400 text-sm">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1 h-1 rounded-full bg-zinc-500 flex-shrink-0"></div>
              <div>How to determine the mass density of liquids using volumetric flasks</div>
            </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1 h-1 rounded-full bg-zinc-500 flex-shrink-0"></div>
              <div>Proper laboratory techniques for precise measurements</div>
            </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1 h-1 rounded-full bg-zinc-500 flex-shrink-0"></div>
              <div>Calculation of specific gravity and specific weight</div>
            </li>
          </ul>
        </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-black/20 rounded-xl text-center">
                <Flask className="h-5 w-5 text-zinc-400 mx-auto mb-2" />
                <div className="text-xs text-zinc-500 font-medium">Select Flask</div>
          </div>
              <div className="p-4 bg-black/20 rounded-xl text-center">
                <Thermometer className="h-5 w-5 text-zinc-400 mx-auto mb-2" />
                <div className="text-xs text-zinc-500 font-medium">Set Temperature</div>
          </div>
              <div className="p-4 bg-black/20 rounded-xl text-center">
                <Scale className="h-5 w-5 text-zinc-400 mx-auto mb-2" />
                <div className="text-xs text-zinc-500 font-medium">Take Measurements</div>
          </div>
        </div>

        <button
          onClick={onStart}
              className="w-full px-4 py-3 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 font-medium"
        >
              Begin Experiment
              <ArrowRight className="h-4 w-4" />
        </button>
          </div>
      </div>
    </motion.div>
    </div>
  );
}