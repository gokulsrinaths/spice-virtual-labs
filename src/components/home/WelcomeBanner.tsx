import React from 'react';
import { motion } from 'framer-motion';
import { Beaker, TestTubes, Microscope, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function WelcomeBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-blue-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
      </div>

      {/* Floating Lab Equipment */}
      <motion.div
        className="absolute top-20 right-20 text-blue-400 opacity-20"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <TestTubes className="h-32 w-32" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-40 text-blue-400 opacity-20"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Microscope className="h-40 w-40" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left md:max-w-2xl"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-500 bg-opacity-20 rounded-full mb-8 border border-blue-400">
            <Beaker className="h-5 w-5 text-blue-300" />
            <span className="ml-2 text-blue-200">Virtual Fluid Mechanics Lab</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Experience the Future of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Lab Learning
            </span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 max-w-xl">
            Step into our state-of-the-art virtual laboratory where fluid mechanics comes to life through 
            interactive experiments and real-time simulations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/experiments"
              className="group inline-flex items-center px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30"
            >
              Begin Experiment
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="#features"
              className="inline-flex items-center px-8 py-3 border-2 border-blue-400 text-blue-200 rounded-lg font-semibold hover:bg-blue-500/10 transition-colors"
            >
              View Lab Equipment
            </Link>
          </div>

          {/* Lab Safety Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 inline-flex items-center px-4 py-2 bg-yellow-500/10 border border-yellow-400/30 rounded-lg"
          >
            <div className="flex items-center gap-2 text-yellow-200 text-sm">
              <span className="font-medium">🧪 Virtual Lab Safety:</span>
              <span>All experiments are safe and environmentally friendly</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent pointer-events-none"></div>
    </div>
  );
}