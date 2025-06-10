import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { experiments } from '../data/experiments';
import { ChevronRight, Beaker } from 'lucide-react';

export function ExperimentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="relative z-10">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full mb-8 border border-blue-400/30">
              <Beaker className="h-5 w-5 text-blue-300" />
              <span className="ml-2 text-blue-200">Virtual Lab Experiments</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Available Experiments
            </h1>
            <p className="text-xl text-blue-200 max-w-2xl">
              Choose from our comprehensive collection of fluid mechanics experiments
            </p>
          </div>
        </div>
      </div>

      {/* Experiments Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiments.map((experiment, index) => (
            <motion.div
              key={experiment.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <experiment.icon className="h-8 w-8 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{experiment.title}</h2>
                </div>

                <p className="text-blue-200 mb-6">{experiment.description}</p>

                {experiment.subTopics ? (
                  <div className="space-y-3">
                    {experiment.subTopics.map(subTopic => (
                      <Link
                        key={subTopic.id}
                        to={`/experiments/${subTopic.id}`}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                      >
                        <div>
                          <h3 className="font-medium text-white">{subTopic.title}</h3>
                          <p className="text-sm text-blue-200">{subTopic.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-blue-400 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    to={`/experiments/${experiment.id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Start Experiment
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </Link>
                )}

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl" />
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}